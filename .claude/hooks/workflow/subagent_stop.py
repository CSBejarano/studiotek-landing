#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pyyaml>=6.0",
# ]
# ///
"""
SubagentStop hook handler.

Executed when a subagent (Task tool) finishes. Responsibilities:
1. Detect domain from transcript (subagent_type)
2. Extract learnings from subagent execution (### Aprendizajes section)
3. Update domain-experts/{domain}.yaml with learnings and task count
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

import yaml


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
    "marketing-expert": "marketing-expert.yaml",
    "seo-expert": "seo-expert.yaml",
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


def extract_learnings(text: str) -> list[str]:
    """Extract learnings from text containing Aprendizajes section.

    Searches for ALL Aprendizajes sections and extracts from the LAST one
    that has valid learnings (most recent agent output).

    Supports multiple formats:
    - ## Aprendizajes Clave:
    - ### Aprendizajes:
    - **Aprendizajes Clave:**

    And list formats:
    - Numbered: 1. item, 2. item
    - Bullets: - item, * item

    Args:
        text: Agent output text potentially containing learnings section.

    Returns:
        List of learning strings extracted from the most recent valid section.
    """
    pattern = r"[#\*]*\s*Aprendizajes[^\n]*:?\s*\n"

    # Find ALL Aprendizajes sections
    matches = list(re.finditer(pattern, text, re.IGNORECASE))
    if not matches:
        return []

    # Process sections in REVERSE order (most recent first)
    for match in reversed(matches):
        remaining = text[match.end():]

        # Stop at next major section (## or **Section**)
        next_section = re.search(r"\n(?:##|\*\*[A-Z])", remaining)
        if next_section:
            remaining = remaining[:next_section.start()]

        learnings = []

        # Try numbered items first: 1. text or 1) text
        numbered = re.findall(
            r"^\s*\d+[.\)]\s*(.+?)(?=\n\s*\d+[.\)]|\n\n|\Z)",
            remaining,
            re.MULTILINE | re.DOTALL
        )

        if numbered:
            for item in numbered:
                # Clean markdown formatting
                cleaned = re.sub(r"\*\*([^\*]+)\*\*", r"\1", item)
                cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
                cleaned = " ".join(cleaned.split())
                # Skip too short items and items that look like debug output
                if cleaned and len(cleaned) > 20 and not cleaned.startswith("["):
                    learnings.append(cleaned)

        # If no numbered, try bullets
        if not learnings:
            bullets = re.findall(
                r"^\s*[-*]\s+(.+?)(?=\n\s*[-*]|\n\n|\Z)",
                remaining,
                re.MULTILINE | re.DOTALL
            )
            for item in bullets:
                cleaned = re.sub(r"\*\*([^\*]+)\*\*", r"\1", item)
                cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
                cleaned = " ".join(cleaned.split())
                if cleaned and len(cleaned) > 20 and not cleaned.startswith("["):
                    learnings.append(cleaned)

        # Return first section that has valid learnings (most recent)
        if learnings and len(learnings) >= 2:  # At least 2 learnings to be valid
            return learnings

    return []


def extract_agent_output_from_transcript(transcript_path: str, logger: logging.Logger) -> str:
    """Extract the agent's text output from the transcript file.

    The transcript is a JSONL file. We look for assistant messages,
    text content blocks, and Task tool results.

    Args:
        transcript_path: Path to the transcript .jsonl file
        logger: Logger instance

    Returns:
        Combined text output from the agent
    """
    output_parts = []
    try:
        transcript_file = Path(transcript_path)
        if not transcript_file.exists():
            return ""

        with open(transcript_file, "r") as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())

                    # Look for assistant messages with text content
                    if entry.get("type") == "assistant":
                        message = entry.get("message", {})
                        content = message.get("content", [])
                        if isinstance(content, list):
                            for item in content:
                                if isinstance(item, dict) and item.get("type") == "text":
                                    text = item.get("text", "")
                                    if text:
                                        output_parts.append(text)

                    # Check for tool_result in user messages (Task results ONLY)
                    # Task tool returns content as a LIST of text blocks, not a string
                    # This distinguishes Task results from Bash/Read outputs which are strings
                    if entry.get("type") == "user":
                        message = entry.get("message", {})
                        content = message.get("content", [])
                        if isinstance(content, list):
                            for item in content:
                                if isinstance(item, dict) and item.get("type") == "tool_result":
                                    result_content = item.get("content", "")
                                    # ONLY handle list content (Task tool results)
                                    # Skip string content (Bash, Read, etc. outputs)
                                    if isinstance(result_content, list):
                                        for block in result_content:
                                            if isinstance(block, dict) and block.get("type") == "text":
                                                text = block.get("text", "")
                                                if text:
                                                    decoded = text.replace("\\n", "\n")
                                                    output_parts.append(decoded)

                    # Also check for legacy tool_result format
                    if entry.get("type") == "tool_result":
                        content = entry.get("content", "")
                        if isinstance(content, str) and content:
                            decoded = content.replace("\\n", "\n")
                            output_parts.append(decoded)

                except json.JSONDecodeError:
                    continue

    except Exception as e:
        logger.error(f"Error extracting agent output: {e}")

    return "\n".join(output_parts)


def detect_domain_from_transcript(transcript_path: str, logger: logging.Logger) -> Optional[str]:
    """
    Extract subagent_type from the PARENT's transcript file.

    The transcript is a JSONL file. We look for the LAST Task tool invocation
    that contains the subagent_type parameter (most recent subagent).

    Args:
        transcript_path: Path to the PARENT's transcript .jsonl file
        logger: Logger instance

    Returns:
        Domain name (e.g., "backend") or None if not found
    """
    try:
        transcript_file = Path(transcript_path)
        if not transcript_file.exists():
            logger.warning(f"Parent transcript not found: {transcript_path}")
            return None

        # Collect ALL subagent_types and return the LAST one
        # This handles the case where multiple subagents were spawned
        found_subagent_types = []

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
                                        found_subagent_types.append(subagent_type)
                                        logger.debug(f"Found Task with subagent_type: {subagent_type}")

                    # Also check for subagent_type in tool_input (PreToolUse format)
                    if "tool_input" in entry:
                        tool_input = entry.get("tool_input", {})
                        if "subagent_type" in tool_input:
                            subagent_type = tool_input["subagent_type"]
                            found_subagent_types.append(subagent_type)
                            logger.debug(f"Found subagent_type from tool_input: {subagent_type}")

                except json.JSONDecodeError:
                    continue

        if found_subagent_types:
            # Return the LAST subagent_type found (most recent)
            last_subagent_type = found_subagent_types[-1]
            logger.info(f"Detected subagent_type (last of {len(found_subagent_types)}): {last_subagent_type}")
            return last_subagent_type

        logger.warning("Could not detect subagent_type from parent transcript")
        return None

    except Exception as e:
        logger.error(f"Error reading parent transcript: {e}")
        return None


def update_yaml_learnings(yaml_path: Path, learnings: list[str], logger: logging.Logger) -> bool:
    """Update domain expert YAML with new learnings.

    Appends new learnings to the 'learnings' array in the YAML file,
    each with a timestamp.

    Args:
        yaml_path: Path to the domain expert YAML file.
        learnings: List of learning strings to add.
        logger: Logger instance

    Returns:
        True if updated successfully, False otherwise.
    """
    if not yaml_path.exists() or not learnings:
        return False

    try:
        with open(yaml_path) as f:
            data = yaml.safe_load(f)

        # Add new learnings with timestamp
        existing = data.get("learnings", [])
        if existing is None:
            existing = []

        timestamp = datetime.now(timezone.utc).isoformat()
        for learning in learnings:
            existing.append({
                "text": learning,
                "added_at": timestamp
            })

        data["learnings"] = existing
        data["updated_at"] = timestamp

        with open(yaml_path, "w") as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        logger.info(f"Added {len(learnings)} learnings to {yaml_path.name}")
        return True

    except Exception as e:
        logger.error(f"Error updating learnings: {e}")
        return False


def update_domain_expert(
    domain: str,
    project_root: Path,
    logger: logging.Logger,
    learnings: list[str] = None,
) -> bool:
    """
    Update the domain expert YAML file with task completion and learnings.

    Increments tasks_handled, updates updated_at timestamp, and adds learnings.

    Args:
        domain: Domain name (e.g., "backend")
        project_root: Project root path
        logger: Logger instance
        learnings: Optional list of learnings to add

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

        # Update updated_at timestamp (handle both quoted and unquoted formats)
        now = datetime.now(timezone.utc).isoformat()
        content = re.sub(
            r"updated_at:\s*['\"]?[^'\"\n]*['\"]?",
            f"updated_at: '{now}'",
            content,
        )

        # Write back
        with open(yaml_path, "w") as f:
            f.write(content)

        logger.info(f"Updated {yaml_filename}")

        # Add learnings if provided
        if learnings:
            update_yaml_learnings(yaml_path, learnings, logger)

        return True

    except Exception as e:
        logger.error(f"Error updating domain expert: {e}")
        return False


def handle_subagent_stop(context: dict[str, Any], args: list[str]) -> int:
    """
    Handle the SubagentStop event.

    According to Claude Code documentation:
    - transcript_path: Path to the PARENT's transcript (contains Task tool_use with subagent_type)
    - agent_transcript_path: Path to the SUBAGENT's transcript (contains learnings)
    - agent_id: Unique identifier for the subagent

    Args:
        context: Environment context with session_id, transcript_path, agent_transcript_path, etc.
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
        transcript_path = context.get("transcript_path", "")  # Parent's transcript
        agent_transcript_path = context.get("agent_transcript_path", "")  # Subagent's transcript
        agent_id = context.get("agent_id", "unknown")

        logger.info(f"Session ID: {session_id}")
        logger.info(f"Agent ID: {agent_id}")
        logger.info(f"Parent Transcript: {transcript_path}")
        logger.info(f"Agent Transcript: {agent_transcript_path}")

        # Detect domain from PARENT's transcript (Task tool_use contains subagent_type)
        domain = None
        if transcript_path:
            domain = detect_domain_from_transcript(transcript_path, logger)

        # If domain provided via args, use it (override)
        for arg in args:
            if arg.startswith("--domain="):
                domain = arg.split("=", 1)[1]
                logger.info(f"Domain from args (override): {domain}")
                break

        if not domain:
            logger.warning("No domain detected from parent transcript, skipping update")
            return 0

        # Check if this is a generic agent to ignore
        if domain in GENERIC_AGENTS:
            logger.debug(f"Ignoring generic agent: {domain}")
            return 0

        # Check if this is a trackable domain-expert
        if domain not in DOMAIN_MAP:
            logger.info(f"Unknown domain: {domain}, will try to update {domain}.yaml")
            # Continue anyway - update_domain_expert will handle unknown domains

        # Extract learnings from SUBAGENT's transcript (not parent's)
        # Use agent_transcript_path if available, fallback to transcript_path for backwards compatibility
        learnings = []
        learnings_transcript = agent_transcript_path if agent_transcript_path else transcript_path
        if learnings_transcript:
            logger.info(f"Extracting learnings from: {learnings_transcript}")
            agent_output = extract_agent_output_from_transcript(learnings_transcript, logger)
            if agent_output:
                learnings = extract_learnings(agent_output)
                if learnings:
                    logger.info(f"Extracted {len(learnings)} learnings from agent output")
                else:
                    logger.info("No learnings found in agent output (no '### Aprendizajes' section)")
            else:
                logger.warning("No agent output extracted from transcript")

        # Update domain expert file with learnings
        yaml_filename = DOMAIN_MAP.get(domain, f"{domain}.yaml")
        updated = update_domain_expert(domain, project_root, logger, learnings)
        if updated:
            logger.info(f"Successfully updated domain-experts/{yaml_filename}")
        else:
            logger.warning(f"Could not update domain-experts/{yaml_filename}")

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
