#!/usr/bin/env python3
"""
SubagentStop hook handler.

Executed when a subagent (Task tool) finishes. Responsibilities:
1. Detect domain from transcript (subagent_type)
2. Extract learnings from subagent execution
3. Update domain-experts/{domain}.yaml with learnings
4. Log execution for monitoring
"""

import json
import logging
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


# Domain mapping from subagent_type to YAML file
DOMAIN_MAP = {
    "backend": "backend.yaml",
    "frontend": "frontend.yaml",
    "testing": "testing.yaml",
    "infra": "infra.yaml",
    "security-reviewer": "security.yaml",
    "gentleman": "gentleman.yaml",
    "quality-reviewer": "quality-reviewer.yaml",
    "codebase-analyst": "codebase-analyst.yaml",
}

# Generic agents that should be silently ignored (no warnings)
GENERIC_AGENTS = {
    "Explore",
    "Plan",
    "Bash",
    "general-purpose",
    "claude-code-guide",
    "statusline-setup",
}


def setup_logging(project_root: Path) -> logging.Logger:
    """Configure daily logging for subagent hooks."""
    logs_dir = project_root / "logs" / "subagents"
    logs_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = logs_dir / f"{today}_subagents.log"

    # Configure logging
    logger = logging.getLogger("subagent_stop")
    logger.setLevel(logging.INFO)

    # Avoid duplicate handlers
    if not logger.handlers:
        file_handler = logging.FileHandler(log_file, mode="a")
        file_handler.setFormatter(
            logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%SZ",
            )
        )
        logger.addHandler(file_handler)

        # Also log to stderr for visibility
        stderr_handler = logging.StreamHandler(sys.stderr)
        stderr_handler.setFormatter(
            logging.Formatter("[%(name)s] %(message)s")
        )
        logger.addHandler(stderr_handler)

    return logger


def detect_domain_from_transcript(transcript_path: str, logger: logging.Logger) -> Optional[str]:
    """
    Extract subagent_type from the transcript file.

    The transcript is a JSONL file. We look for the Task tool invocation
    that contains the subagent_type parameter.

    Args:
        transcript_path: Path to the transcript .jsonl file
        logger: Logger instance

    Returns:
        Domain name (e.g., "backend") or None if not found
    """
    try:
        transcript_file = Path(transcript_path)
        if not transcript_file.exists():
            logger.warning(f"Transcript not found: {transcript_path}")
            return None

        with open(transcript_file, "r") as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())

                    # Look for Task tool invocations
                    # Format actual de Claude Code: entry.message.content[]
                    content = None
                    if "message" in entry and "content" in entry.get("message", {}):
                        content = entry.get("message", {}).get("content", [])
                    elif "content" in entry:
                        # Fallback para formato legacy: entry.content[]
                        content = entry.get("content", [])

                    # Process content if found
                    if content and isinstance(content, list):
                        for item in content:
                            if isinstance(item, dict):
                                # Check for tool_use with Task
                                if item.get("type") == "tool_use" and item.get("name") == "Task":
                                    input_data = item.get("input", {})
                                    if "subagent_type" in input_data:
                                        subagent_type = input_data["subagent_type"]
                                        logger.info(f"Detected subagent_type: {subagent_type}")
                                        return subagent_type

                    # Also check for subagent_type in tool_input
                    if "tool_input" in entry:
                        tool_input = entry.get("tool_input", {})
                        if "subagent_type" in tool_input:
                            subagent_type = tool_input["subagent_type"]
                            logger.info(f"Detected subagent_type from tool_input: {subagent_type}")
                            return subagent_type

                except json.JSONDecodeError:
                    continue

        logger.warning("Could not detect subagent_type from transcript")
        return None

    except Exception as e:
        logger.error(f"Error reading transcript: {e}")
        return None


def update_domain_expert(
    domain: str,
    project_root: Path,
    logger: logging.Logger,
) -> bool:
    """
    Update the domain expert YAML file with task completion.

    Increments tasks_handled and updates updated_at timestamp.

    Args:
        domain: Domain name (e.g., "backend")
        project_root: Project root path
        logger: Logger instance

    Returns:
        True if updated successfully, False otherwise
    """
    try:
        # Check if this is a generic agent (silently ignore)
        if domain in GENERIC_AGENTS:
            logger.debug(f"Ignoring generic agent: {domain}")
            return True  # Not an error, just not a trackable domain-expert

        # Get YAML filename from domain map
        yaml_filename = DOMAIN_MAP.get(domain)
        if not yaml_filename:
            logger.warning(f"Unknown domain: {domain}, using {domain}.yaml")
            yaml_filename = f"{domain}.yaml"

        yaml_path = project_root / "ai_docs" / "expertise" / "domain-experts" / yaml_filename

        if not yaml_path.exists():
            logger.warning(f"Domain expert file not found: {yaml_path}")
            return False

        # Read current content
        with open(yaml_path, "r") as f:
            content = f.read()

        # Update tasks_handled (increment)
        tasks_match = re.search(r"tasks_handled:\s*(\d+)", content)
        if tasks_match:
            current_tasks = int(tasks_match.group(1))
            new_tasks = current_tasks + 1
            content = re.sub(
                r"tasks_handled:\s*\d+",
                f"tasks_handled: {new_tasks}",
                content,
            )
            logger.info(f"Incremented tasks_handled: {current_tasks} -> {new_tasks}")

        # Update updated_at timestamp
        now = datetime.now(timezone.utc).isoformat()
        content = re.sub(
            r'updated_at:\s*"[^"]*"',
            f'updated_at: "{now}"',
            content,
        )

        # Write back
        with open(yaml_path, "w") as f:
            f.write(content)

        logger.info(f"Updated {yaml_filename}")
        return True

    except Exception as e:
        logger.error(f"Error updating domain expert: {e}")
        return False


def handle_subagent_stop(context: dict[str, Any], args: list[str]) -> int:
    """
    Handle the SubagentStop event.

    Args:
        context: Environment context with session_id, transcript_path, etc.
        args: Additional CLI arguments

    Returns:
        Exit code (0 for success, always 0 to not block subagent)
    """
    # Determine project root
    project_root = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()

    # Setup logging
    logger = setup_logging(project_root)
    logger.info("=" * 50)
    logger.info("SubagentStop hook triggered")

    try:
        # Extract context
        session_id = context.get("session_id", "unknown")
        transcript_path = context.get("transcript_path", "")

        logger.info(f"Session ID: {session_id}")
        logger.info(f"Transcript: {transcript_path}")

        # Detect domain from transcript
        domain = None
        if transcript_path:
            domain = detect_domain_from_transcript(transcript_path, logger)

        # If domain provided via args, use it
        for arg in args:
            if arg.startswith("--domain="):
                domain = arg.split("=", 1)[1]
                logger.info(f"Domain from args: {domain}")
                break

        if not domain:
            logger.warning("No domain detected, skipping update")
            return 0

        # Check if this is a generic agent to ignore
        if domain in GENERIC_AGENTS:
            logger.debug(f"Ignoring generic agent: {domain}")
            return 0

        # Check if this is a trackable domain-expert
        if domain not in DOMAIN_MAP:
            logger.info(f"Unknown domain: {domain}, will try to update {domain}.yaml")
            # Continue anyway - update_domain_expert will handle unknown domains

        # Update domain expert file
        updated = update_domain_expert(domain, project_root, logger)
        if updated:
            logger.info(f"Successfully updated domain-experts/{DOMAIN_MAP[domain]}")
        else:
            logger.warning(f"Could not update domain-experts/{DOMAIN_MAP[domain]}")

        logger.info("SubagentStop hook completed")
        return 0

    except Exception as e:
        logger.error(f"Error in subagent_stop: {e}")
        # Fail-safe: don't block subagent
        return 0


def main() -> int:
    """Main entry point for standalone execution."""
    try:
        # Read context from stdin (JSON from Claude Code)
        input_data = sys.stdin.read()
        if input_data.strip():
            context = json.loads(input_data)
        else:
            context = {}
    except json.JSONDecodeError as e:
        print(f"[subagent_stop] Warning: Invalid JSON input: {e}", file=sys.stderr)
        context = {}

    # Get CLI args
    args = sys.argv[1:] if len(sys.argv) > 1 else []

    return handle_subagent_stop(context, args)


if __name__ == "__main__":
    sys.exit(main())
