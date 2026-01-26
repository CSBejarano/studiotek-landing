"""
Workflow State Models v1.0

Dataclasses for WORKFLOW-STATUS.yaml tracking in Ralph Mode v4.1.

Features:
- Phase-based tracking with named phases and agents
- Checkpoint execution with pass/fail criteria
- Status: PENDING | IN_PROGRESS | COMPLETED | FAILED | BLOCKED
- Retry tracking per phase
- Integration with TodoWrite tool
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pathlib import Path
import yaml


class PhaseStatus(str, Enum):
    """Status values for workflow phases."""
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    BLOCKED = "BLOCKED"


class FinalStatus(str, Enum):
    """Final status values for workflow completion."""
    SUCCESS = "SUCCESS"
    PARTIAL = "PARTIAL"
    FAILED = "FAILED"
    TIMEOUT = "TIMEOUT"


@dataclass
class Checkpoint:
    """
    Checkpoint definition for a phase.

    Attributes:
        command: Shell command to execute for verification
        expected: Expected result (exit code, text match, etc.)
        timeout: Max seconds to wait for command (default 60)
    """
    command: str
    expected: str = "exit 0"
    timeout: int = 60

    def to_dict(self) -> Dict[str, Any]:
        return {
            "command": self.command,
            "expected": self.expected,
            "timeout": self.timeout,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Checkpoint":
        return cls(
            command=data.get("command", ""),
            expected=data.get("expected", "exit 0"),
            timeout=data.get("timeout", 60),
        )


@dataclass
class WorkflowPhase:
    """
    A single phase in the workflow.

    Attributes:
        id: Phase number (1, 2, 3, etc.)
        name: Human-readable name
        agent: Agent type (@backend, @testing, etc.)
        status: Current status
        checkpoint: Verification checkpoint
        retries: Number of retry attempts
        max_retries: Maximum allowed retries
        started_at: When phase started
        completed_at: When phase completed
        error_message: Last error if failed
    """
    id: int
    name: str
    agent: str
    status: PhaseStatus = PhaseStatus.PENDING
    checkpoint: Optional[Checkpoint] = None
    retries: int = 0
    max_retries: int = 3
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    error_message: Optional[str] = None

    def can_retry(self) -> bool:
        """Check if phase can be retried."""
        return self.retries < self.max_retries

    def mark_in_progress(self) -> None:
        """Mark phase as in progress."""
        self.status = PhaseStatus.IN_PROGRESS
        self.started_at = datetime.now().isoformat()

    def mark_completed(self) -> None:
        """Mark phase as completed."""
        self.status = PhaseStatus.COMPLETED
        self.completed_at = datetime.now().isoformat()

    def mark_failed(self, error: str) -> None:
        """Mark phase as failed with error."""
        self.status = PhaseStatus.FAILED
        self.error_message = error
        self.retries += 1
        if not self.can_retry():
            self.status = PhaseStatus.BLOCKED

    def to_dict(self) -> Dict[str, Any]:
        result = {
            "id": self.id,
            "name": self.name,
            "agent": self.agent,
            "status": self.status.value,
            "retries": self.retries,
            "max_retries": self.max_retries,
        }
        if self.checkpoint:
            result["checkpoint"] = self.checkpoint.to_dict()
        if self.started_at:
            result["started_at"] = self.started_at
        if self.completed_at:
            result["completed_at"] = self.completed_at
        if self.error_message:
            result["error_message"] = self.error_message
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowPhase":
        checkpoint = None
        if "checkpoint" in data:
            checkpoint = Checkpoint.from_dict(data["checkpoint"])

        return cls(
            id=data["id"],
            name=data["name"],
            agent=data["agent"],
            status=PhaseStatus(data.get("status", "PENDING")),
            checkpoint=checkpoint,
            retries=data.get("retries", 0),
            max_retries=data.get("max_retries", 3),
            started_at=data.get("started_at"),
            completed_at=data.get("completed_at"),
            error_message=data.get("error_message"),
        )


@dataclass
class WorkflowCompletion:
    """
    Completion status for the workflow.

    Attributes:
        all_completed: Whether all phases are done
        completion_promise: Text that signals success
        final_status: Overall workflow status
    """
    all_completed: bool = False
    completion_promise: str = "WORKFLOW COMPLETE"
    final_status: Optional[FinalStatus] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "all_completed": self.all_completed,
            "completion_promise": self.completion_promise,
            "final_status": self.final_status.value if self.final_status else None,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowCompletion":
        final_status = None
        if data.get("final_status"):
            final_status = FinalStatus(data["final_status"])

        return cls(
            all_completed=data.get("all_completed", False),
            completion_promise=data.get("completion_promise", "WORKFLOW COMPLETE"),
            final_status=final_status,
        )


@dataclass
class WorkflowStatus:
    """
    Main workflow status tracking.

    This is serialized to ai_docs/state/WORKFLOW-STATUS.yaml

    Attributes:
        workflow_id: Unique identifier (e.g., "2026-01-15_feature-auth")
        issue: GitHub issue number
        mode: FAST or FULL
        started_at: ISO timestamp when workflow started
        iteration: Current Ralph loop iteration
        max_iterations: Maximum iterations before timeout
        phases: List of workflow phases
        completion: Completion status
    """
    workflow_id: str
    issue: Optional[int] = None
    mode: str = "FAST"
    started_at: Optional[str] = None
    iteration: int = 0
    max_iterations: int = 50
    phases: List[WorkflowPhase] = field(default_factory=list)
    completion: WorkflowCompletion = field(default_factory=WorkflowCompletion)

    # File path constant
    STATUS_FILE = "ai_docs/state/WORKFLOW-STATUS.yaml"

    def get_next_pending_phase(self) -> Optional[WorkflowPhase]:
        """Get the next phase that needs to be executed."""
        for phase in self.phases:
            if phase.status in (PhaseStatus.PENDING, PhaseStatus.FAILED):
                if phase.can_retry():
                    return phase
        return None

    def get_current_phase(self) -> Optional[WorkflowPhase]:
        """Get the currently in-progress phase."""
        for phase in self.phases:
            if phase.status == PhaseStatus.IN_PROGRESS:
                return phase
        return None

    def all_phases_completed(self) -> bool:
        """Check if all phases are completed."""
        return all(p.status == PhaseStatus.COMPLETED for p in self.phases)

    def any_phase_blocked(self) -> bool:
        """Check if any phase is blocked (max retries exceeded)."""
        return any(p.status == PhaseStatus.BLOCKED for p in self.phases)

    def update_completion(self) -> None:
        """Update completion status based on phases."""
        if self.all_phases_completed():
            self.completion.all_completed = True
            self.completion.final_status = FinalStatus.SUCCESS
        elif self.any_phase_blocked():
            self.completion.final_status = FinalStatus.PARTIAL
        elif self.iteration >= self.max_iterations:
            self.completion.final_status = FinalStatus.TIMEOUT

    def get_todo_list(self) -> List[Dict[str, Any]]:
        """
        Generate TodoWrite-compatible list from phases.

        Returns:
            List of dicts with content, status, activeForm
        """
        status_map = {
            PhaseStatus.PENDING: "pending",
            PhaseStatus.IN_PROGRESS: "in_progress",
            PhaseStatus.COMPLETED: "completed",
            PhaseStatus.FAILED: "in_progress",  # Will retry
            PhaseStatus.BLOCKED: "completed",   # Can't continue
        }

        todos = []
        for phase in self.phases:
            status = status_map.get(phase.status, "pending")

            # Add retry info to name if failed
            name = f"FASE {phase.id}: {phase.name}"
            if phase.status == PhaseStatus.FAILED:
                name += f" (retry {phase.retries}/{phase.max_retries})"
            elif phase.status == PhaseStatus.BLOCKED:
                name += " (BLOCKED)"

            todos.append({
                "content": name,
                "status": status,
                "activeForm": f"Ejecutando {phase.name}",
            })

        return todos

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for YAML serialization."""
        return {
            "workflow_id": self.workflow_id,
            "issue": self.issue,
            "mode": self.mode,
            "started_at": self.started_at,
            "iteration": self.iteration,
            "max_iterations": self.max_iterations,
            "phases": [p.to_dict() for p in self.phases],
            "completion": self.completion.to_dict(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowStatus":
        """Create from dictionary."""
        phases = [WorkflowPhase.from_dict(p) for p in data.get("phases", [])]
        completion = WorkflowCompletion.from_dict(data.get("completion", {}))

        return cls(
            workflow_id=data.get("workflow_id", "unknown"),
            issue=data.get("issue"),
            mode=data.get("mode", "FAST"),
            started_at=data.get("started_at"),
            iteration=data.get("iteration", 0),
            max_iterations=data.get("max_iterations", 50),
            phases=phases,
            completion=completion,
        )

    def save(self, project_root: Path) -> bool:
        """
        Save to WORKFLOW-STATUS.yaml.

        Args:
            project_root: Project root directory

        Returns:
            True if saved successfully
        """
        try:
            status_path = project_root / self.STATUS_FILE
            status_path.parent.mkdir(parents=True, exist_ok=True)

            with open(status_path, "w", encoding="utf-8") as f:
                yaml.dump(
                    self.to_dict(),
                    f,
                    default_flow_style=False,
                    allow_unicode=True,
                    sort_keys=False,
                )
            return True
        except Exception as e:
            print(f"[WORKFLOW] Error saving status: {e}")
            return False

    @classmethod
    def load(cls, project_root: Path) -> Optional["WorkflowStatus"]:
        """
        Load from WORKFLOW-STATUS.yaml.

        Args:
            project_root: Project root directory

        Returns:
            WorkflowStatus instance or None if not found
        """
        try:
            status_path = project_root / cls.STATUS_FILE
            if not status_path.exists():
                return None

            with open(status_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)

            return cls.from_dict(data) if data else None
        except Exception as e:
            print(f"[WORKFLOW] Error loading status: {e}")
            return None

    @classmethod
    def create_new(
        cls,
        workflow_id: str,
        phases: List[Dict[str, Any]],
        issue: Optional[int] = None,
        mode: str = "FAST",
        max_iterations: int = 50,
        completion_promise: str = "WORKFLOW COMPLETE",
    ) -> "WorkflowStatus":
        """
        Factory method to create a new workflow status.

        Args:
            workflow_id: Unique identifier
            phases: List of phase definitions with name, agent, checkpoint
            issue: GitHub issue number
            mode: FAST or FULL
            max_iterations: Maximum Ralph loop iterations
            completion_promise: Text that signals success

        Returns:
            New WorkflowStatus instance
        """
        workflow_phases = []
        for i, phase_def in enumerate(phases, start=1):
            checkpoint = None
            if "checkpoint" in phase_def:
                checkpoint = Checkpoint(
                    command=phase_def["checkpoint"].get("command", ""),
                    expected=phase_def["checkpoint"].get("expected", "exit 0"),
                )

            workflow_phases.append(WorkflowPhase(
                id=i,
                name=phase_def["name"],
                agent=phase_def["agent"],
                checkpoint=checkpoint,
            ))

        return cls(
            workflow_id=workflow_id,
            issue=issue,
            mode=mode,
            started_at=datetime.now().isoformat(),
            iteration=0,
            max_iterations=max_iterations,
            phases=workflow_phases,
            completion=WorkflowCompletion(
                completion_promise=completion_promise,
            ),
        )
