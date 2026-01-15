#!/usr/bin/env python3
"""
Post-workflow hook handler.

Executed at workflow end (Stop event). Responsibilities:
1. Complete any active phase
2. Promote validated decisions to long-term memory
3. Promote resolved blockers to long-term memory
4. Update agent memory with domain-specific learnings
5. Calculate and save velocity metrics
6. Consolidate workflow to history
7. Output final summary
"""

import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


def determine_workflow_result(
    short_term: Any,
    had_errors: bool = False,
) -> str:
    """
    Determine the final workflow result.

    Args:
        short_term: Short-term memory state
        had_errors: Whether there were blocking errors

    Returns:
        Result string: 'SUCCESS', 'PARTIAL', or 'FAILED'
    """
    if had_errors:
        return "FAILED"

    # Check for active blockers
    if short_term.blockers_active:
        unresolved = sum(1 for b in short_term.blockers_active if not b.resolved)
        if unresolved > 0:
            return "PARTIAL"

    # Check tool success rate
    if short_term.tool_events:
        failures = sum(1 for e in short_term.tool_events if not e.success)
        total = len(short_term.tool_events)
        if failures / total > 0.3:  # More than 30% failures
            return "PARTIAL"

    return "SUCCESS"


def calculate_duration_minutes(short_term: Any) -> float:
    """
    Calculate workflow duration in minutes.

    Args:
        short_term: Short-term memory with session_start

    Returns:
        Duration in minutes
    """
    try:
        start = datetime.fromisoformat(short_term.session_start)
        now = datetime.now(timezone.utc)
        delta = now - start
        return delta.total_seconds() / 60
    except (ValueError, TypeError):
        return 0.0


def handle_post_workflow(context: dict[str, Any], args: list[str]) -> int:
    """
    Handle the post-workflow (Stop) event.

    Args:
        context: Environment context from hook_runner
        args: Additional arguments

    Returns:
        Exit code (0 for success)
    """
    # Import memory manager
    try:
        sys.path.insert(0, str(Path(context["skill_root"])))
        from core.memory_manager import create_memory_manager
    except ImportError as e:
        print(f"[workflow-task] Warning: Could not load memory manager: {e}", file=sys.stderr)
        return 0

    try:
        skill_root = Path(context["skill_root"])
        manager = create_memory_manager(skill_root)

        # Check if session exists
        session_file = skill_root / "memoria" / "short_term.json"
        if not session_file.exists():
            print("[workflow-task] No active session to close")
            return 0

        # Load existing session
        manager.short_term = manager._load_short_term()

        if not manager.short_term:
            print("[workflow-task] Could not load session")
            return 0

        # Load long-term memory
        long_term = manager.load_long_term()

        # Load agent memory for the session domain
        domain = manager.short_term.active_domain
        agent_memory = manager.load_agent_memory(domain) if domain else None

        # Determine result
        result = determine_workflow_result(manager.short_term)

        # Calculate duration
        duration = calculate_duration_minutes(manager.short_term)

        # Promote learnings
        promotions = promote_learnings(manager, result)

        # Consolidate workflow
        manager.consolidate_workflow(result=result, duration_min=duration)

        # Output summary
        output_workflow_summary(
            workflow_id=manager.short_term.workflow_id,
            result=result,
            duration=duration,
            domain=domain,
            promotions=promotions,
            stats=gather_session_stats(manager.short_term),
        )

        return 0

    except Exception as e:
        print(f"[workflow-task] Error in post_workflow: {e}", file=sys.stderr)
        # Fail-safe: don't block workflow
        return 0


def promote_learnings(manager: Any, result: str) -> dict[str, int]:
    """
    Promote validated learnings to long-term memory.

    Only promotes on SUCCESS or PARTIAL results.

    Args:
        manager: MemoryManager instance
        result: Workflow result string

    Returns:
        Dictionary with promotion counts
    """
    promotions = {
        "decisions": 0,
        "blockers": 0,
        "agent_decisions": 0,
        "agent_blockers": 0,
    }

    if result == "FAILED":
        return promotions

    short_term = manager.short_term
    domain = short_term.active_domain

    # Promote decisions that meet criteria
    for decision in short_term.decisions_pending:
        # Check if decision is worth promoting
        # Criteria: high confidence OR was validated during session
        if decision.confidence >= 0.7 or decision.validated_count > 0:
            if manager.promote_to_long_term("decision", decision):
                promotions["decisions"] += 1

            # Also promote to agent if domain-specific
            if domain and decision.tags:
                domain_tags = {"api", "rest", "endpoint"} if domain == "api" else {domain}
                if any(tag in domain_tags for tag in decision.tags):
                    if manager.promote_to_agent("decision", decision, domain):
                        promotions["agent_decisions"] += 1

    # Promote resolved blockers
    for blocker in short_term.blockers_active:
        if blocker.resolved and blocker.solution:
            if manager.promote_to_long_term("blocker", blocker):
                promotions["blockers"] += 1

            # Promote to agent if domain-specific
            if domain and blocker.tags:
                domain_tags = {"api", "rest", "endpoint"} if domain == "api" else {domain}
                if any(tag in domain_tags for tag in blocker.tags):
                    if manager.promote_to_agent("blocker", blocker, domain):
                        promotions["agent_blockers"] += 1

    return promotions


def gather_session_stats(short_term: Any) -> dict[str, Any]:
    """
    Gather statistics from the session.

    Args:
        short_term: Short-term memory state

    Returns:
        Dictionary with session statistics
    """
    tool_events = short_term.tool_events

    # Tool usage stats
    tool_usage: dict[str, dict[str, int]] = {}
    for event in tool_events:
        if event.tool not in tool_usage:
            tool_usage[event.tool] = {"success": 0, "fail": 0}
        if event.success:
            tool_usage[event.tool]["success"] += 1
        else:
            tool_usage[event.tool]["fail"] += 1

    # Files modified
    files_modified = short_term.context_snapshot.get("files_modified", [])

    # Phases completed
    phases = list(short_term.phase_timings.keys())

    return {
        "tool_events_total": len(tool_events),
        "tool_usage": tool_usage,
        "files_modified": len(files_modified),
        "decisions_recorded": len(short_term.decisions_pending),
        "blockers_encountered": len(short_term.blockers_active),
        "blockers_resolved": sum(1 for b in short_term.blockers_active if b.resolved),
        "phases_completed": len(phases),
    }


def output_workflow_summary(
    workflow_id: str,
    result: str,
    duration: float,
    domain: Optional[str],
    promotions: dict[str, int],
    stats: dict[str, Any],
) -> None:
    """
    Output a summary of the completed workflow.
    """
    result_emoji = {
        "SUCCESS": "✅",
        "PARTIAL": "⚠️",
        "FAILED": "❌",
    }.get(result, "❓")

    print("\n" + "=" * 60)
    print(f"WORKFLOW-TASK v2.0 - Session Complete {result_emoji}")
    print("=" * 60)
    print(f"Workflow: {workflow_id}")
    print(f"Result: {result}")
    print(f"Duration: {duration:.1f} min")
    if domain:
        print(f"Domain: {domain}")

    print(f"\nSession Statistics:")
    print(f"  - Tool events: {stats['tool_events_total']}")
    print(f"  - Files modified: {stats['files_modified']}")
    print(f"  - Decisions recorded: {stats['decisions_recorded']}")
    print(f"  - Blockers: {stats['blockers_resolved']}/{stats['blockers_encountered']} resolved")

    if any(v > 0 for v in promotions.values()):
        print(f"\nLearnings Promoted:")
        if promotions["decisions"]:
            print(f"  - {promotions['decisions']} decisions → long-term memory")
        if promotions["blockers"]:
            print(f"  - {promotions['blockers']} blockers → long-term memory")
        if promotions["agent_decisions"]:
            print(f"  - {promotions['agent_decisions']} decisions → agent memory")
        if promotions["agent_blockers"]:
            print(f"  - {promotions['agent_blockers']} blockers → agent memory")

    # Tool usage breakdown
    if stats.get("tool_usage"):
        print(f"\nTool Usage:")
        for tool, counts in sorted(stats["tool_usage"].items()):
            total = counts["success"] + counts["fail"]
            if counts["fail"] > 0:
                print(f"  - {tool}: {total} ({counts['fail']} failures)")
            else:
                print(f"  - {tool}: {total}")

    print("=" * 60 + "\n")


if __name__ == "__main__":
    # For testing
    context = {
        "skill_root": str(Path(__file__).parent.parent.parent),
        "project_root": str(Path(__file__).parent.parent.parent.parent.parent.parent.parent),
    }
    sys.exit(handle_post_workflow(context, []))
