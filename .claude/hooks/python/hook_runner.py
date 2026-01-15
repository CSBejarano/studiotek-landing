#!/usr/bin/env python3
"""
Hook Runner - Main orchestrator for workflow-task v2.0 hooks.

This module routes hook events to their appropriate handlers and manages
the skill root discovery and error handling.

Usage:
    python hook_runner.py <hook_type> [args...]

    hook_type: pre_workflow | post_phase | post_workflow
    args: varies by hook type (e.g., tool_event for post_phase)
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def get_skill_root() -> Path:
    """
    Discover the skill root directory.

    Checks in order:
    1. WORKFLOW_TASK_ROOT environment variable
    2. CLAUDE_PROJECT_ROOT environment variable + path
    3. Relative to this file's location
    """
    # Option 1: Explicit skill root
    if skill_root := os.environ.get("WORKFLOW_TASK_ROOT"):
        return Path(skill_root)

    # Option 2: Claude project root
    if project_root := os.environ.get("CLAUDE_PROJECT_ROOT"):
        skill_path = Path(project_root) / ".claude" / "skills" / "workflow-task"
        if skill_path.exists():
            return skill_path

    # Option 3: Relative to this file
    return Path(__file__).parent.parent


def get_project_root() -> Path:
    """Get the project root directory."""
    if project_root := os.environ.get("CLAUDE_PROJECT_ROOT"):
        return Path(project_root)

    # Walk up from skill root to find project root
    skill_root = get_skill_root()
    return skill_root.parent.parent.parent.parent


def load_env_context() -> dict[str, Any]:
    """
    Load context from Claude Code environment variables.

    Returns:
        Dictionary with tool name, parameters, success status, etc.
    """
    context = {
        "tool_name": os.environ.get("CLAUDE_TOOL_NAME", ""),
        "tool_input": os.environ.get("CLAUDE_TOOL_INPUT", "{}"),
        "tool_result": os.environ.get("CLAUDE_TOOL_RESULT", ""),
        "tool_success": os.environ.get("CLAUDE_TOOL_SUCCESS", "true").lower() == "true",
        "project_root": str(get_project_root()),
        "skill_root": str(get_skill_root()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Parse tool input as JSON if possible
    try:
        context["tool_params"] = json.loads(context["tool_input"])
    except (json.JSONDecodeError, TypeError):
        context["tool_params"] = {}

    return context


def run_hook(hook_type: str, args: list[str]) -> int:
    """
    Route to the appropriate hook handler.

    Args:
        hook_type: One of 'pre_workflow', 'post_phase', 'post_workflow', 'ralph_stop'
        args: Additional arguments passed to the hook

    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    # Add hooks/python to path for imports
    hooks_python_dir = Path(__file__).parent
    if str(hooks_python_dir) not in sys.path:
        sys.path.insert(0, str(hooks_python_dir))

    # Add core modules to path
    skill_root = get_skill_root()
    core_dir = skill_root / "core"
    models_dir = skill_root / "models"

    for module_dir in [core_dir, models_dir, skill_root]:
        if module_dir.exists() and str(module_dir) not in sys.path:
            sys.path.insert(0, str(module_dir))

    context = load_env_context()

    try:
        if hook_type == "pre_workflow":
            from pre_workflow import handle_pre_workflow
            return handle_pre_workflow(context, args)

        elif hook_type == "post_phase":
            from post_phase import handle_post_phase
            return handle_post_phase(context, args)

        elif hook_type == "post_workflow":
            from post_workflow import handle_post_workflow
            return handle_post_workflow(context, args)

        elif hook_type == "ralph_stop":
            from ralph_loop import handle_ralph_stop
            return handle_ralph_stop(context, args)

        else:
            print(f"[workflow-task] Unknown hook type: {hook_type}", file=sys.stderr)
            return 1

    except ImportError as e:
        print(f"[workflow-task] Failed to import handler for {hook_type}: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"[workflow-task] Error in {hook_type} hook: {e}", file=sys.stderr)
        # Fail-safe: don't block workflow on hook errors
        return 0


def main() -> int:
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: hook_runner.py <hook_type> [args...]", file=sys.stderr)
        print("  hook_type: pre_workflow | post_phase | post_workflow | ralph_stop", file=sys.stderr)
        return 1

    hook_type = sys.argv[1]
    args = sys.argv[2:]

    return run_hook(hook_type, args)


if __name__ == "__main__":
    sys.exit(main())
