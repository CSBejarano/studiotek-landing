#!/usr/bin/env python3
"""
Ralph Loop Stop Hook Handler v1.0

Handles the Ralph Wiggum autonomous loop logic at workflow Stop events.

The Ralph loop wraps the 6-phase workflow and provides:
- Automatic iteration until completion promise is detected
- Self-correction by retrying from appropriate phase on failure
- Safety limits (max iterations, max retries per phase)

Flow:
1. Check if Ralph loop is enabled
2. Check for completion promise in output
3. Check for max iterations
4. Detect failures and determine retry phase
5. Either exit (allow stop) or continue loop (block stop)
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, Optional


# =============================================================================
# FAILURE DETECTION
# =============================================================================

# Markers for detecting build failures (most specific, check first)
BUILD_MARKERS = [
    "build failed",
    "compilation error",
    "vite build failed",
    "webpack error",
    "esbuild error",
    "bundler error",
]

# Markers for detecting lint/type failures
LINT_MARKERS = [
    "eslint",
    "ruff",
    "lint error",
    "linting error",
    "TypeScript error",
    "mypy",
    "type error",
    "tslint",
    "prettier error",
]

# Markers for detecting test failures (more generic, check last)
TEST_MARKERS = [
    "pytest FAILED",
    "vitest failed",
    "test failed",
    "tests failed",
    "AssertionError",
    "Error: expect(",
    "FAILED",  # Generic, keep at end
]


def detect_failure_type(output: str) -> Optional[str]:
    """
    Detect the type of failure in the output.

    Checks for build failures, lint failures, and test failures
    by looking for specific markers in the output text.
    Order matters: build (most specific) -> lint -> test (most generic).

    Args:
        output: The output text to analyze

    Returns:
        One of: "tests_failed", "lint_failed", "build_failed", or None
    """
    if not output:
        return None

    output_lower = output.lower()

    # Check for build errors first (most specific)
    if any(marker.lower() in output_lower for marker in BUILD_MARKERS):
        return "build_failed"

    # Check for lint/type errors
    if any(marker.lower() in output_lower for marker in LINT_MARKERS):
        return "lint_failed"

    # Check for test failures last (most generic markers)
    if any(marker.lower() in output_lower for marker in TEST_MARKERS):
        return "tests_failed"

    return None


def get_retry_phase(failure_type: str) -> int:
    """
    Determine which phase to retry from based on failure type.

    Mapping:
    - tests_failed -> Phase 3 (Review) - fix code and re-review
    - lint_failed -> Phase 3 (Review) - fix formatting and re-review
    - build_failed -> Phase 2 (Execution) - re-execute with fixes

    Args:
        failure_type: Type of failure detected

    Returns:
        Phase number to retry from (2 or 3)
    """
    return {
        "tests_failed": 3,   # Review phase
        "lint_failed": 3,    # Review phase
        "build_failed": 2,   # Execution phase
    }.get(failure_type, 3)  # Default to Review phase


# =============================================================================
# MEMORY HELPERS
# =============================================================================

def load_short_term(skill_root: Path) -> Optional[Any]:
    """
    Load short-term memory from disk.

    Args:
        skill_root: Path to the skill root directory

    Returns:
        ShortTermMemory instance or None
    """
    try:
        # Add paths for imports
        models_dir = skill_root / "models"
        if str(models_dir) not in sys.path:
            sys.path.insert(0, str(models_dir))
        if str(skill_root) not in sys.path:
            sys.path.insert(0, str(skill_root))

        from models.memory_state import ShortTermMemory

        short_term_path = skill_root / "memoria" / "short_term.json"
        if not short_term_path.exists():
            return None

        with open(short_term_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return ShortTermMemory.from_dict(data)
    except Exception as e:
        print(f"[RALPH] Error loading short_term: {e}", file=sys.stderr)
        return None


def save_short_term(skill_root: Path, short_term: Any) -> bool:
    """
    Save short-term memory to disk.

    Args:
        skill_root: Path to the skill root directory
        short_term: ShortTermMemory instance

    Returns:
        True if saved successfully
    """
    try:
        short_term_path = skill_root / "memoria" / "short_term.json"
        short_term_path.parent.mkdir(parents=True, exist_ok=True)

        data = short_term.to_dict()
        with open(short_term_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return True
    except Exception as e:
        print(f"[RALPH] Error saving short_term: {e}", file=sys.stderr)
        return False


# =============================================================================
# MAIN HANDLER
# =============================================================================

def handle_ralph_stop(context: Dict[str, Any], args: list = None) -> int:
    """
    Handler for the Ralph loop Stop hook.

    This is called when the workflow is about to stop. It determines
    whether to allow the stop (exit) or continue the loop (retry).

    Args:
        context: Environment context from hook_runner containing:
            - skill_root: Path to skill directory
            - tool_result: Last tool output (used for failure detection)
        args: Additional arguments (unused)

    Returns:
        0 = Allow exit (workflow complete or disabled)
        1 = Block exit, continue loop (retry from specific phase)
    """
    args = args or []
    skill_root = Path(context.get("skill_root", "."))

    # 1. Load short-term memory
    short_term = load_short_term(skill_root)
    if short_term is None:
        print("[RALPH] No active session")
        return 0  # Allow exit

    # 2. Check if Ralph is enabled
    ralph = short_term.ralph
    if ralph is None or not ralph.enabled:
        # Ralph not active, allow normal workflow completion
        return 0

    # 3. Get output for analysis
    # Use tool_result from context, or check for last_output in args
    output = context.get("tool_result", "")
    if not output and args:
        output = " ".join(args)

    # 4. Check for completion promise
    if ralph.completion_promise and ralph.completion_promise in output:
        ralph.completion_detected = True
        ralph.enabled = False
        save_short_term(skill_root, short_term)
        print(f"[RALPH] SUCCESS after {ralph.iteration} iteration(s)")
        print(f"[RALPH] Completion promise detected: '{ralph.completion_promise}'")
        return 0  # Allow exit - success!

    # 5. Check max iterations
    if ralph.iteration >= ralph.max_iterations:
        ralph.enabled = False
        save_short_term(skill_root, short_term)
        print(f"[RALPH] TIMEOUT at {ralph.max_iterations} iterations")
        print("[RALPH] Max iterations reached without completion")
        return 0  # Allow exit - timeout

    # 6. Detect failures and determine retry
    failure_type = detect_failure_type(output)
    if failure_type:
        retry_phase = get_retry_phase(failure_type)

        if ralph.should_retry_phase(retry_phase):
            # Record the retry
            action = f"retry_from_phase_{retry_phase}"
            ralph.record_retry(retry_phase, failure_type, action)

            # Set the phase to retry from
            short_term.current_phase = retry_phase
            short_term.phase_status = "IN_PROGRESS"

            print(f"[RALPH] Detected: {failure_type}")
            print(f"[RALPH] Retrying from phase {retry_phase}")
            print(f"[RALPH] Retry count for phase {retry_phase}: {ralph.get_retry_count(retry_phase)}/{ralph.MAX_PHASE_RETRIES}")
        else:
            # Max retries for this phase reached
            print(f"[RALPH] Max retries ({ralph.MAX_PHASE_RETRIES}) reached for phase {retry_phase}")
            print(f"[RALPH] Continuing to next iteration without phase reset")

    # 7. Increment iteration and continue loop
    ralph.iteration += 1
    save_short_term(skill_root, short_term)

    print(f"\n[RALPH] Iteration {ralph.iteration}/{ralph.max_iterations}")
    print(f"[RALPH] Continue workflow. When done, output: {ralph.completion_promise}")
    print("")

    return 1  # Block exit - continue loop


# =============================================================================
# CLI ENTRY POINT
# =============================================================================

def main() -> int:
    """Main entry point for direct CLI invocation."""
    import os

    # Build context from environment
    context = {
        "skill_root": os.environ.get(
            "WORKFLOW_TASK_ROOT",
            str(Path(__file__).parent.parent.parent)
        ),
        "tool_result": os.environ.get("CLAUDE_TOOL_RESULT", ""),
    }

    args = sys.argv[1:] if len(sys.argv) > 1 else []

    # Handle --help
    if "--help" in args or "-h" in args:
        print("Ralph Loop Stop Hook")
        print("")
        print("Usage: ralph_loop.py [options]")
        print("")
        print("Options:")
        print("  --help, -h    Show this help message")
        print("  --test        Run with test output")
        print("")
        print("Environment Variables:")
        print("  WORKFLOW_TASK_ROOT    Path to workflow-task skill root")
        print("  CLAUDE_TOOL_RESULT    Last tool output for failure detection")
        print("")
        print("Exit Codes:")
        print("  0    Allow workflow to stop (success or disabled)")
        print("  1    Block stop, continue Ralph loop")
        return 0

    # Handle --test
    if "--test" in args:
        print("[RALPH] Test mode - checking configuration")
        skill_root = Path(context["skill_root"])
        short_term = load_short_term(skill_root)
        if short_term and short_term.ralph and short_term.ralph.enabled:
            print(f"[RALPH] Active: iteration {short_term.ralph.iteration}/{short_term.ralph.max_iterations}")
            print(f"[RALPH] Promise: '{short_term.ralph.completion_promise}'")
        else:
            print("[RALPH] Not active or no session")
        return 0

    return handle_ralph_stop(context, args)


if __name__ == "__main__":
    sys.exit(main())
