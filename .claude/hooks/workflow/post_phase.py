#!/usr/bin/env python3
"""
Post-phase hook handler.

Executed after each tool use (PostToolUse event with matcher Edit|Write|Bash).
Responsibilities:
1. Record tool event to short-term memory
2. Extract file paths from tool parameters
3. Track files modified during session
4. Detect potential blockers from errors
"""

import json
import logging
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Optional


def setup_logging(project_root: Path) -> logging.Logger:
    """Configure daily logging for hooks."""
    logs_dir = project_root / "logs" / "hooks"
    logs_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = logs_dir / f"{today}_hooks.log"

    logger = logging.getLogger("post_phase")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        file_handler = logging.FileHandler(log_file, mode="a")
        file_handler.setFormatter(
            logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%SZ",
            )
        )
        logger.addHandler(file_handler)

    return logger


def extract_file_path(tool_name: str, tool_params: dict[str, Any]) -> Optional[str]:
    """
    Extract file path from tool parameters.

    Args:
        tool_name: Name of the tool (Edit, Write, Bash, Read, etc.)
        tool_params: Parameters passed to the tool

    Returns:
        File path if found, None otherwise
    """
    # Direct file path parameters
    if file_path := tool_params.get("file_path"):
        return str(file_path)

    if path := tool_params.get("path"):
        return str(path)

    # For Bash, try to extract from command
    if tool_name == "Bash":
        command = tool_params.get("command", "")
        # Common patterns: editing/writing to files
        patterns = [
            r'>\s*([^\s;|&]+)',  # redirect to file
            r'cat\s+.*>\s*([^\s;|&]+)',  # cat > file
            r'echo\s+.*>\s*([^\s;|&]+)',  # echo > file
            r'tee\s+([^\s;|&]+)',  # tee file
        ]
        for pattern in patterns:
            if match := re.search(pattern, command):
                return match.group(1)

    return None


def extract_error_info(tool_result: str, tool_success: bool) -> Optional[dict[str, Any]]:
    """
    Extract error information from tool result.

    Args:
        tool_result: Raw result from tool execution
        tool_success: Whether the tool succeeded

    Returns:
        Error info dict if error detected, None otherwise
    """
    if tool_success:
        return None

    # Parse common error patterns
    error_info: dict[str, Any] = {
        "raw": tool_result[:500] if tool_result else "Unknown error",
    }

    # Python errors
    if "Traceback" in tool_result:
        error_info["type"] = "python_exception"
        # Extract exception type and message
        if match := re.search(r"(\w+Error|\w+Exception):\s*(.+?)(?:\n|$)", tool_result):
            error_info["exception"] = match.group(1)
            error_info["message"] = match.group(2)

    # Test failures
    elif "FAILED" in tool_result or "AssertionError" in tool_result:
        error_info["type"] = "test_failure"
        if match := re.search(r"FAILED\s+(.+?)::", tool_result):
            error_info["test_file"] = match.group(1)

    # Syntax errors
    elif "SyntaxError" in tool_result:
        error_info["type"] = "syntax_error"
        if match := re.search(r"File\s+\"(.+?)\",\s+line\s+(\d+)", tool_result):
            error_info["file"] = match.group(1)
            error_info["line"] = int(match.group(2))

    # Import errors
    elif "ImportError" in tool_result or "ModuleNotFoundError" in tool_result:
        error_info["type"] = "import_error"
        if match := re.search(r"No module named ['\"](.+?)['\"]", tool_result):
            error_info["module"] = match.group(1)

    else:
        error_info["type"] = "unknown"

    return error_info


def handle_post_phase(context: dict[str, Any], args: list[str]) -> int:
    """
    Handle the post-phase (PostToolUse) event.

    Args:
        context: Environment context from hook_runner
        args: Additional arguments (first arg is event type: 'tool_event')

    Returns:
        Exit code (0 for success)
    """
    # Setup logging
    project_root = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()
    logger = setup_logging(project_root)

    event_type = args[0] if args else "tool_event"

    # Only process tool events
    if event_type != "tool_event":
        return 0

    # Get tool info from context (Claude Code hook format)
    tool_name = context.get("tool_name", "")
    tool_params = context.get("tool_input", context.get("tool_params", {}))
    tool_result = str(context.get("tool_response", context.get("tool_result", "")))
    tool_success = context.get("tool_success", True)

    # Skip if no tool name (shouldn't happen)
    if not tool_name:
        return 0

    logger.info(f"Tool event: {tool_name} (success={tool_success})")

    # Import memory manager from local core/
    try:
        hooks_dir = Path(__file__).parent
        sys.path.insert(0, str(hooks_dir))
        from core.memory_manager import create_memory_manager
    except ImportError as e:
        logger.warning(f"Could not load memory manager: {e}")
        return 0

    try:
        manager = create_memory_manager(project_root)

        # Check if session exists
        if not manager.short_term:
            # Try to load existing session
            session_file = project_root / "ai_docs" / "memoria" / "short_term.json"
            if session_file.exists():
                manager._short_term = manager.load_short_term()
            else:
                # No active session, skip
                return 0

        # Extract file path
        file_path = extract_file_path(tool_name, tool_params)

        # Extract error info if failed
        error_info = extract_error_info(tool_result, tool_success)

        # Record the tool event
        manager.record_tool_event(
            tool=tool_name,
            success=tool_success,
            file=file_path,
            error=error_info.get("raw") if error_info else None,
            params=tool_params,
        )

        # Track modified files
        if file_path and tool_name in ("Edit", "Write"):
            if file_path not in manager.short_term.context_snapshot["files_modified"]:
                manager.short_term.context_snapshot["files_modified"].append(file_path)

        # Auto-detect blockers from errors
        if error_info and error_info.get("type") in ("syntax_error", "import_error", "test_failure"):
            manager.record_blocker(
                symptom=error_info.get("message", error_info.get("raw", "Unknown error"))[:200],
                severity="medium" if error_info["type"] == "test_failure" else "high",
                tags=[error_info["type"], tool_name.lower()],
            )

        # Save updated short-term memory
        manager._save_short_term()

        # Output brief status on failures
        if not tool_success and error_info:
            print(f"[hooks] Tool failure recorded: {error_info.get('type', 'unknown')}")

        return 0

    except Exception as e:
        print(f"[hooks] Error in post_phase: {e}", file=sys.stderr)
        # Fail-safe: don't block workflow
        return 0


def main() -> int:
    """Main entry point for standalone execution with uv run."""
    try:
        # Read context from stdin (JSON from Claude Code)
        input_data = sys.stdin.read()
        if input_data.strip():
            context = json.loads(input_data)
        else:
            context = {}
    except json.JSONDecodeError as e:
        print(f"[post_phase] Warning: Invalid JSON input: {e}", file=sys.stderr)
        context = {}

    # Get CLI args
    args = sys.argv[1:] if len(sys.argv) > 1 else []

    return handle_post_phase(context, args)


if __name__ == "__main__":
    sys.exit(main())
