"""
Ralph Wiggum Loop State Models v1.0

Dataclasses for the Ralph Wiggum autonomous loop mechanism.

Features:
- Iteration tracking with max limit
- Completion promise detection
- Self-correction with phase retry
- Overnight mode with logging
- Failure tracking per phase
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


# =============================================================================
# DATACLASSES
# =============================================================================

@dataclass
class RalphFailureEntry:
    """
    Record of a failure during Ralph loop iteration.

    Attributes:
        iteration: Which iteration this failure occurred
        phase: Which workflow phase failed
        reason: Type of failure (tests_failed, lint_failed, build_failed)
        action: Action taken (retry_from_phase_N)
        timestamp: ISO 8601 timestamp of the failure
    """
    iteration: int
    phase: int
    reason: str  # tests_failed | lint_failed | build_failed
    action: str  # retry_from_phase_N
    timestamp: str

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "iteration": self.iteration,
            "phase": self.phase,
            "reason": self.reason,
            "action": self.action,
            "timestamp": self.timestamp,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "RalphFailureEntry":
        """Create from dictionary."""
        return cls(
            iteration=data["iteration"],
            phase=data["phase"],
            reason=data["reason"],
            action=data["action"],
            timestamp=data["timestamp"],
        )


@dataclass
class RalphLoopState:
    """
    State management for Ralph Wiggum autonomous loop.

    The Ralph loop wraps the 6-phase workflow and provides:
    - Automatic iteration until completion promise is detected
    - Self-correction by retrying from appropriate phase on failure
    - Safety limits (max iterations, max retries per phase)
    - Overnight mode with logging

    Attributes:
        enabled: Whether Ralph loop is active
        iteration: Current iteration number (starts at 1)
        max_iterations: Maximum iterations before timeout
        completion_promise: Phrase that signals successful completion
        completion_detected: Whether completion was found in output
        overnight_mode: Whether running in unattended mode
        log_file: Path to log file for overnight mode
        started_at: ISO 8601 timestamp when loop started
        phase_retries: Count of retries per phase {"3": 2, "4": 1}
        failure_log: History of failures with actions taken
    """
    enabled: bool = False
    iteration: int = 1
    max_iterations: int = 50
    completion_promise: str = "WORKFLOW COMPLETE"
    completion_detected: bool = False
    overnight_mode: bool = False
    log_file: Optional[str] = None
    started_at: Optional[str] = None
    phase_retries: Dict[str, int] = field(default_factory=dict)
    failure_log: List[RalphFailureEntry] = field(default_factory=list)

    # Safety limits
    MAX_PHASE_RETRIES: int = 3
    MAX_FAILURE_LOG: int = 100

    def should_retry_phase(self, phase: int) -> bool:
        """
        Check if a phase can be retried.

        Args:
            phase: Phase number to check

        Returns:
            True if phase has not exceeded retry limit
        """
        key = str(phase)
        current = self.phase_retries.get(key, 0)
        return current < self.MAX_PHASE_RETRIES

    def record_retry(self, phase: int, reason: str, action: str) -> None:
        """
        Record a retry attempt for a phase.

        Args:
            phase: Phase number being retried
            reason: Type of failure (tests_failed, lint_failed, build_failed)
            action: Action being taken (retry_from_phase_N)
        """
        key = str(phase)
        self.phase_retries[key] = self.phase_retries.get(key, 0) + 1

        entry = RalphFailureEntry(
            iteration=self.iteration,
            phase=phase,
            reason=reason,
            action=action,
            timestamp=datetime.now().isoformat(),
        )

        # FIFO constraint on failure log
        if len(self.failure_log) >= self.MAX_FAILURE_LOG:
            self.failure_log.pop(0)
        self.failure_log.append(entry)

    def get_retry_count(self, phase: int) -> int:
        """
        Get current retry count for a phase.

        Args:
            phase: Phase number to check

        Returns:
            Number of retries for this phase
        """
        return self.phase_retries.get(str(phase), 0)

    def reset_phase_retries(self) -> None:
        """Reset all phase retry counts (e.g., after successful completion)."""
        self.phase_retries.clear()

    def is_active(self) -> bool:
        """Check if loop should continue."""
        return self.enabled and not self.completion_detected and self.iteration <= self.max_iterations

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "enabled": self.enabled,
            "iteration": self.iteration,
            "max_iterations": self.max_iterations,
            "completion_promise": self.completion_promise,
            "completion_detected": self.completion_detected,
            "overnight_mode": self.overnight_mode,
            "log_file": self.log_file,
            "started_at": self.started_at,
            "phase_retries": self.phase_retries,
            "failure_log": [f.to_dict() for f in self.failure_log],
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "RalphLoopState":
        """Create from dictionary."""
        failure_log = [
            RalphFailureEntry.from_dict(f)
            for f in data.get("failure_log", [])
        ]

        return cls(
            enabled=data.get("enabled", False),
            iteration=data.get("iteration", 1),
            max_iterations=data.get("max_iterations", 50),
            completion_promise=data.get("completion_promise", "WORKFLOW COMPLETE"),
            completion_detected=data.get("completion_detected", False),
            overnight_mode=data.get("overnight_mode", False),
            log_file=data.get("log_file"),
            started_at=data.get("started_at"),
            phase_retries=data.get("phase_retries", {}),
            failure_log=failure_log,
        )

    @classmethod
    def create_new(
        cls,
        max_iterations: int = 50,
        completion_promise: str = "WORKFLOW COMPLETE",
        overnight_mode: bool = False,
        log_file: Optional[str] = None,
    ) -> "RalphLoopState":
        """
        Factory method to create a new Ralph loop state.

        Args:
            max_iterations: Maximum iterations before timeout
            completion_promise: Phrase that signals completion
            overnight_mode: Whether running unattended
            log_file: Path to log file for overnight mode

        Returns:
            New RalphLoopState instance ready to start
        """
        return cls(
            enabled=True,
            iteration=1,
            max_iterations=max_iterations,
            completion_promise=completion_promise,
            completion_detected=False,
            overnight_mode=overnight_mode,
            log_file=log_file,
            started_at=datetime.now().isoformat(),
            phase_retries={},
            failure_log=[],
        )
