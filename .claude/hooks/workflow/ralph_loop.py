#!/usr/bin/env python3
"""
Ralph Loop Stop Hook Handler v2.0

Handles the Ralph Wiggum autonomous loop logic at workflow Stop events.
Now with WORKFLOW-STATUS.yaml tracking and executable checkpoints.

The Ralph loop wraps the multi-phase workflow and provides:
- TodoList tracking via WORKFLOW-STATUS.yaml
- Executable checkpoints for phase verification
- Automatic iteration until completion promise is detected
- Self-correction by retrying failed phases
- Safety limits (max iterations, max retries per phase)

Flow:
1. Load workflow status from WORKFLOW-STATUS.yaml
2. Check for completion (all phases COMPLETED)
3. Check for max iterations timeout
4. Execute checkpoint for current phase
5. Update phase status based on checkpoint result
6. Either exit (allow stop) or continue loop (block stop)
"""

import json
import logging
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Tuple


def output_block_decision(reason: str) -> None:
    """
    Output JSON to stdout to block Claude from stopping.

    According to Claude Code hooks documentation, Stop hooks can output JSON
    with format: {"decision": "block", "reason": "..."} to prevent stopping.

    Args:
        reason: Human-readable explanation of why we're blocking the stop.
    """
    decision = {
        "decision": "block",
        "reason": reason
    }
    print(json.dumps(decision))


def setup_logging(project_root: Path) -> logging.Logger:
    """Configure daily logging for hooks."""
    logs_dir = project_root / "logs" / "hooks"
    logs_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = logs_dir / f"{today}_ralph.log"

    logger = logging.getLogger("ralph_loop")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        file_handler = logging.FileHandler(log_file, mode="a")
        file_handler.setFormatter(
            logging.Formatter(
                "[%(asctime)s] [%(levelname)s] %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%SZ",
            )
        )
        logger.addHandler(file_handler)

    return logger


# =============================================================================
# CHECKPOINT EXECUTION
# =============================================================================

def execute_checkpoint(command: str, expected: str, timeout: int = 60) -> Tuple[bool, str]:
    """
    Execute a checkpoint command and verify the result.

    Args:
        command: Shell command to execute
        expected: Expected result criteria:
            - "exit 0": Command must exit with code 0
            - "passed": Output must contain "passed"
            - "APPROVED": Output must contain "APPROVED"
            - "no high severity": Output must NOT contain "High"

    Returns:
        Tuple of (passed: bool, message: str)
    """
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=os.environ.get("CLAUDE_PROJECT_DIR", "."),
        )

        output = result.stdout + result.stderr
        exit_code = result.returncode

        # Check expected criteria
        if expected == "exit 0":
            passed = exit_code == 0
            msg = f"Exit code: {exit_code}" + (f"\n{output[:500]}" if not passed else "")
        elif expected.startswith("no "):
            # "no high severity" -> should NOT contain the text
            forbidden = expected[3:]  # Remove "no "
            passed = forbidden.lower() not in output.lower()
            msg = f"Found forbidden '{forbidden}'" if not passed else "Clean"
        else:
            # Text must be present in output
            passed = expected.lower() in output.lower()
            msg = f"Found '{expected}'" if passed else f"'{expected}' not found in output"

        return passed, msg

    except subprocess.TimeoutExpired:
        return False, f"Checkpoint timeout after {timeout}s"
    except Exception as e:
        return False, f"Checkpoint error: {str(e)}"


# =============================================================================
# FALLBACK: TEXT-BASED FAILURE DETECTION
# =============================================================================

BUILD_MARKERS = [
    "build failed", "compilation error", "vite build failed",
    "webpack error", "esbuild error", "bundler error",
]

LINT_MARKERS = [
    "eslint", "ruff", "lint error", "TypeScript error",
    "mypy", "type error", "prettier error",
]

TEST_MARKERS = [
    "pytest FAILED", "vitest failed", "test failed",
    "AssertionError", "Error: expect(", "FAILED",
]


def detect_failure_from_output(output: str) -> Optional[str]:
    """
    Fallback: Detect failure type from output text.
    Used when no checkpoint is defined for a phase.
    """
    if not output:
        return None

    output_lower = output.lower()

    if any(m.lower() in output_lower for m in BUILD_MARKERS):
        return "build_failed"
    if any(m.lower() in output_lower for m in LINT_MARKERS):
        return "lint_failed"
    if any(m.lower() in output_lower for m in TEST_MARKERS):
        return "tests_failed"

    return None


# =============================================================================
# WORKFLOW STATUS HELPERS
# =============================================================================

def load_workflow_status(project_root: Path):
    """Load WorkflowStatus from YAML file."""
    try:
        hooks_dir = Path(__file__).parent
        if str(hooks_dir) not in sys.path:
            sys.path.insert(0, str(hooks_dir))

        from models.workflow_state import WorkflowStatus
        return WorkflowStatus.load(project_root)
    except Exception as e:
        print(f"[RALPH] Error loading workflow status: {e}", file=sys.stderr)
        return None


def load_legacy_short_term(project_root: Path):
    """Load legacy short_term.json for backward compatibility."""
    try:
        hooks_dir = Path(__file__).parent
        if str(hooks_dir) not in sys.path:
            sys.path.insert(0, str(hooks_dir))

        from models.memory_state import ShortTermMemory

        short_term_path = project_root / "ai_docs" / "memoria" / "short_term.json"
        if not short_term_path.exists():
            return None

        with open(short_term_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return ShortTermMemory.from_dict(data)
    except Exception:
        return None


# =============================================================================
# MAIN HANDLER
# =============================================================================

def handle_ralph_stop(context: Dict[str, Any], args: list = None) -> int:
    """
    Handler for the Ralph loop Stop hook.

    Returns:
        0 = Allow exit (workflow complete or disabled)
        1 = Block exit, continue loop (retry from specific phase)
    """
    project_root = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()
    logger = setup_logging(project_root)
    logger.info("Ralph loop hook triggered")

    args = args or []
    output = context.get("tool_result", "")

    # ==========================================================================
    # 1. Try new WORKFLOW-STATUS.yaml first
    # ==========================================================================
    workflow = load_workflow_status(project_root)

    if workflow:
        logger.info(f"Loaded workflow: {workflow.workflow_id}, iteration {workflow.iteration}")
        return handle_workflow_based_loop(workflow, project_root, output, logger)

    # ==========================================================================
    # 2. Fallback to legacy short_term.json
    # ==========================================================================
    short_term = load_legacy_short_term(project_root)

    if short_term and short_term.ralph and short_term.ralph.enabled:
        logger.info("Using legacy short_term.json mode")
        return handle_legacy_loop(short_term, project_root, output, logger)

    # ==========================================================================
    # 3. No active Ralph session
    # ==========================================================================
    print("[RALPH] No active workflow or Ralph session")
    return 0


def handle_workflow_based_loop(workflow, project_root: Path, output: str, logger) -> int:
    """
    Handle Ralph loop using WORKFLOW-STATUS.yaml tracking.
    """
    from models.workflow_state import PhaseStatus, FinalStatus

    # Check for completion promise in output
    if workflow.completion.completion_promise in output:
        workflow.completion.all_completed = True
        workflow.completion.final_status = FinalStatus.SUCCESS
        workflow.save(project_root)

        print(f"[RALPH] ✓ SUCCESS after {workflow.iteration} iteration(s)")
        print(f"[RALPH] Completion promise detected: '{workflow.completion.completion_promise}'")
        logger.info(f"SUCCESS: {workflow.workflow_id}")
        return 0  # Allow exit

    # Check max iterations
    if workflow.iteration >= workflow.max_iterations:
        workflow.completion.final_status = FinalStatus.TIMEOUT
        workflow.save(project_root)

        print(f"[RALPH] ✗ TIMEOUT at {workflow.max_iterations} iterations")
        logger.info(f"TIMEOUT: {workflow.workflow_id}")
        return 0  # Allow exit

    # Check if all phases completed
    if workflow.all_phases_completed():
        workflow.completion.all_completed = True
        workflow.completion.final_status = FinalStatus.SUCCESS
        workflow.save(project_root)

        print("[RALPH] ✓ All phases COMPLETED")
        print(workflow.completion.completion_promise)
        logger.info(f"ALL_COMPLETED: {workflow.workflow_id}")
        return 0  # Allow exit

    # Check if any phase is blocked
    if workflow.any_phase_blocked():
        blocked = [p for p in workflow.phases if p.status == PhaseStatus.BLOCKED]
        workflow.completion.final_status = FinalStatus.PARTIAL
        workflow.save(project_root)

        print(f"[RALPH] ✗ BLOCKED at: {', '.join(p.name for p in blocked)}")
        logger.info(f"BLOCKED: {workflow.workflow_id}")
        return 0  # Allow exit

    # Get current or next phase
    current = workflow.get_current_phase()
    if current is None:
        current = workflow.get_next_pending_phase()

    if current is None:
        print("[RALPH] No pending phases")
        return 0

    # Execute checkpoint if defined
    if current.checkpoint:
        print(f"[RALPH] Executing checkpoint for {current.name}...")
        logger.info(f"Checkpoint: {current.checkpoint.command}")

        passed, msg = execute_checkpoint(
            current.checkpoint.command,
            current.checkpoint.expected,
            current.checkpoint.timeout,
        )

        if passed:
            current.mark_completed()
            print(f"[RALPH] ✓ {current.name}: COMPLETED")
            logger.info(f"PASSED: {current.name}")
        else:
            current.mark_failed(msg)
            if current.status == PhaseStatus.BLOCKED:
                print(f"[RALPH] ✗ {current.name}: BLOCKED (max retries)")
            else:
                print(f"[RALPH] ! {current.name}: FAILED (retry {current.retries}/{current.max_retries})")
            logger.info(f"FAILED: {current.name} - {msg}")
    else:
        # No checkpoint - use text-based detection
        failure = detect_failure_from_output(output)
        if failure:
            current.mark_failed(failure)
            print(f"[RALPH] ! Detected {failure} in {current.name}")
        else:
            # Assume success if no failure detected
            current.mark_completed()
            print(f"[RALPH] ✓ {current.name}: COMPLETED (no checkpoint)")

    # Increment iteration
    workflow.iteration += 1
    workflow.update_completion()
    workflow.save(project_root)

    # Print status
    print(f"\n[RALPH] Iteration {workflow.iteration}/{workflow.max_iterations}")
    print("[RALPH] Phase Status:")
    for phase in workflow.phases:
        icon = {"COMPLETED": "✓", "IN_PROGRESS": "→", "FAILED": "!", "BLOCKED": "✗", "PENDING": " "}
        print(f"  [{icon.get(phase.status.value, ' ')}] FASE {phase.id}: {phase.name}")

    # Continue loop - use JSON output to block stop (per Claude Code hooks docs)
    output_block_decision(f"Ralph loop continuing - iteration {workflow.iteration}/{workflow.max_iterations}")
    return 0


def handle_legacy_loop(short_term, project_root: Path, output: str, logger) -> int:
    """
    Handle Ralph loop using legacy short_term.json (backward compatibility).
    """
    ralph = short_term.ralph

    # Check completion promise
    if ralph.completion_promise and ralph.completion_promise in output:
        ralph.completion_detected = True
        ralph.enabled = False
        save_legacy_short_term(project_root, short_term)
        print(f"[RALPH] SUCCESS after {ralph.iteration} iteration(s)")
        return 0

    # Check max iterations
    if ralph.iteration >= ralph.max_iterations:
        ralph.enabled = False
        save_legacy_short_term(project_root, short_term)
        print(f"[RALPH] TIMEOUT at {ralph.max_iterations} iterations")
        return 0

    # Detect failures
    failure = detect_failure_from_output(output)
    if failure:
        retry_phase = {"tests_failed": 3, "lint_failed": 3, "build_failed": 2}.get(failure, 3)
        if ralph.should_retry_phase(retry_phase):
            ralph.record_retry(retry_phase, failure, f"retry_from_phase_{retry_phase}")
            print(f"[RALPH] Detected: {failure}, retrying from phase {retry_phase}")

    ralph.iteration += 1
    save_legacy_short_term(project_root, short_term)

    print(f"\n[RALPH] Iteration {ralph.iteration}/{ralph.max_iterations}")
    # Continue loop - use JSON output to block stop (per Claude Code hooks docs)
    output_block_decision(f"Legacy Ralph loop continuing - iteration {ralph.iteration}/{ralph.max_iterations}")
    return 0


def save_legacy_short_term(project_root: Path, short_term) -> bool:
    """Save legacy short_term.json."""
    try:
        path = project_root / "ai_docs" / "memoria" / "short_term.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(short_term.to_dict(), f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False


# =============================================================================
# CLI ENTRY POINT
# =============================================================================

def main() -> int:
    """Main entry point for direct CLI invocation."""
    args = sys.argv[1:] if len(sys.argv) > 1 else []

    if "--help" in args or "-h" in args:
        print("Ralph Loop Stop Hook v2.0")
        print("")
        print("Usage: ralph_loop.py [options]")
        print("")
        print("Options:")
        print("  --help, -h    Show this help message")
        print("  --status      Show current workflow status")
        print("  --test CMD    Test a checkpoint command")
        print("")
        print("Exit Codes:")
        print("  0    Allow workflow to stop (success or disabled)")
        print("  1    Block stop, continue Ralph loop")
        return 0

    project_root = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()

    # Handle --status
    if "--status" in args:
        workflow = load_workflow_status(project_root)
        if workflow:
            print(f"Workflow: {workflow.workflow_id}")
            print(f"Mode: {workflow.mode}")
            print(f"Iteration: {workflow.iteration}/{workflow.max_iterations}")
            print(f"Phases:")
            for p in workflow.phases:
                print(f"  [{p.status.value}] {p.name} ({p.agent})")
        else:
            legacy = load_legacy_short_term(project_root)
            if legacy and legacy.ralph and legacy.ralph.enabled:
                print(f"Legacy mode: iteration {legacy.ralph.iteration}/{legacy.ralph.max_iterations}")
            else:
                print("No active workflow")
        return 0

    # Handle --test
    if "--test" in args:
        idx = args.index("--test")
        if idx + 1 < len(args):
            cmd = args[idx + 1]
            passed, msg = execute_checkpoint(cmd, "exit 0")
            print(f"Command: {cmd}")
            print(f"Result: {'PASS' if passed else 'FAIL'}")
            print(f"Message: {msg}")
            return 0 if passed else 1
        else:
            print("Usage: --test 'command'")
            return 1

    # Read context from stdin
    try:
        input_data = sys.stdin.read()
        context = json.loads(input_data) if input_data.strip() else {}
    except json.JSONDecodeError:
        context = {}

    return handle_ralph_stop(context, args)


if __name__ == "__main__":
    sys.exit(main())
