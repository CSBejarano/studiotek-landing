#!/usr/bin/env python3
"""
Pre-workflow hook handler.

Executed at workflow start (Start event). Responsibilities:
1. Create new short-term memory session
2. Load long-term memory with historical context
3. Detect domain from task description
4. Load relevant agent memory
5. Output context summary for Claude
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def get_task_description() -> str:
    """
    Extract task description from environment or stdin.

    Checks in order:
    1. WORKFLOW_TASK_DESCRIPTION environment variable
    2. First argument if provided
    3. Empty string as fallback
    """
    if desc := os.environ.get("WORKFLOW_TASK_DESCRIPTION"):
        return desc

    # Could be passed as argument
    return ""


def generate_workflow_id(task_description: str) -> str:
    """
    Generate a unique workflow ID.

    Format: YYYY-MM-DD_slug-from-description

    Args:
        task_description: The task description to slugify

    Returns:
        Unique workflow ID string
    """
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Create slug from description
    if task_description:
        # Extract issue number if present
        issue_match = re.search(r"#(\d+)", task_description)
        if issue_match:
            slug = f"issue-{issue_match.group(1)}"
        else:
            # Slugify first few words
            words = re.sub(r"[^a-zA-Z0-9\s]", "", task_description.lower()).split()[:3]
            slug = "-".join(words) if words else "workflow"
    else:
        slug = "workflow"

    return f"{today}_{slug}"


def detect_domain(task_description: str) -> str:
    """
    Detect the primary domain from task description.

    Uses keyword matching against domain definitions.

    Args:
        task_description: The task description to analyze

    Returns:
        Domain ID (e.g., 'backend', 'frontend', 'database')
    """
    # Domain keyword mappings
    domain_keywords = {
        "backend": ["fastapi", "api", "endpoint", "route", "handler", "controller", "service", "use case"],
        "frontend": ["react", "vue", "component", "ui", "css", "tailwind", "button", "form", "modal"],
        "database": ["sql", "migration", "alembic", "schema", "table", "index", "query", "rls"],
        "testing": ["test", "pytest", "mock", "fixture", "coverage", "unit", "integration"],
        "api": ["rest", "graphql", "openapi", "swagger", "endpoint", "request", "response"],
        "security": ["auth", "jwt", "permission", "rbac", "owasp", "vulnerability", "token"],
        "infra": ["docker", "kubernetes", "ci", "cd", "deploy", "terraform", "nginx", "redis"],
    }

    task_lower = task_description.lower()
    scores: dict[str, int] = {}

    for domain, keywords in domain_keywords.items():
        score = sum(1 for kw in keywords if kw in task_lower)
        if score > 0:
            scores[domain] = score

    if scores:
        return max(scores, key=scores.get)  # type: ignore

    return "backend"  # Default domain


def handle_pre_workflow(context: dict[str, Any], args: list[str]) -> int:
    """
    Handle the pre-workflow event.

    Args:
        context: Environment context from hook_runner
        args: Additional arguments (first arg may be task description)

    Returns:
        Exit code (0 for success)
    """
    # Get task description
    task_description = args[0] if args else get_task_description()

    # Import memory manager (path already set by hook_runner)
    try:
        sys.path.insert(0, str(Path(context["skill_root"])))
        from core.memory_manager import create_memory_manager
    except ImportError as e:
        print(f"[workflow-task] Warning: Could not load memory manager: {e}", file=sys.stderr)
        # Fail-safe: continue without memory
        return 0

    try:
        # Create memory manager
        skill_root = Path(context["skill_root"])
        manager = create_memory_manager(skill_root)

        # Generate workflow ID
        workflow_id = generate_workflow_id(task_description)

        # Detect domain
        domain = detect_domain(task_description)

        # Start session (creates short-term memory)
        manager.start_session(
            workflow_id=workflow_id,
            task_description=task_description,
            domain=domain,
        )

        # Load long-term memory
        long_term = manager.load_long_term()

        # Load agent memory for detected domain
        agent_memory = manager.load_agent_memory(domain)

        # Get combined context
        combined_context = manager.get_context()

        # Output context summary
        output_context_summary(
            workflow_id=workflow_id,
            task_description=task_description,
            domain=domain,
            long_term=long_term,
            agent_memory=agent_memory,
            combined_context=combined_context,
        )

        return 0

    except Exception as e:
        print(f"[workflow-task] Error in pre_workflow: {e}", file=sys.stderr)
        # Fail-safe: don't block workflow
        return 0


def output_context_summary(
    workflow_id: str,
    task_description: str,
    domain: str,
    long_term: Any,
    agent_memory: Any,
    combined_context: dict[str, Any],
) -> None:
    """
    Output a summary of loaded context for Claude.

    This is displayed to help Claude understand the available context.
    """
    print("\n" + "=" * 60)
    print("WORKFLOW-TASK v2.0 - Session Started")
    print("=" * 60)
    print(f"Workflow ID: {workflow_id}")
    print(f"Domain: {domain}")
    if task_description:
        print(f"Task: {task_description[:100]}...")

    # Long-term stats
    if long_term:
        print(f"\nHistorical Context:")
        print(f"  - Workflows completed: {long_term.workflows_completed}")
        print(f"  - Validated decisions: {len(long_term.decisions)}")
        print(f"  - Known blockers: {len(long_term.blockers)}")

    # Agent memory stats
    if agent_memory:
        print(f"\n{agent_memory.display_name} Memory:")
        print(f"  - Tasks handled: {agent_memory.tasks_handled}")
        print(f"  - Success rate: {agent_memory.success_rate:.0%}")
        print(f"  - Domain decisions: {len(agent_memory.decisions)}")

    # Relevant decisions from context
    relevant_decisions = combined_context.get("relevant_decisions", [])
    if relevant_decisions:
        print(f"\nRelevant Past Decisions ({len(relevant_decisions)}):")
        for dec in relevant_decisions[:3]:
            print(f"  - {dec.get('context', 'N/A')}: {dec.get('decision', 'N/A')}")

    print("=" * 60 + "\n")


if __name__ == "__main__":
    # For testing
    context = {
        "skill_root": str(Path(__file__).parent.parent.parent),
        "project_root": str(Path(__file__).parent.parent.parent.parent.parent.parent.parent),
    }
    sys.exit(handle_pre_workflow(context, sys.argv[1:]))
