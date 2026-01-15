"""
Workflow State Models v2.0

Dataclasses for workflow state management including:
- WorkflowStatus enum
- WorkflowResult dataclass
- PhaseInfo dataclass
- WorkflowState dataclass
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional


class WorkflowStatus(Enum):
    """Status of a workflow."""

    PENDING = "pending"         # Not yet started
    IN_PROGRESS = "in_progress" # Currently running
    PAUSED = "paused"          # Temporarily paused
    COMPLETED = "completed"     # Successfully completed
    FAILED = "failed"           # Failed or aborted


class PhaseStatus(Enum):
    """Status of a workflow phase."""

    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"
    FAILED = "failed"


@dataclass
class PhaseInfo:
    """
    Information about a workflow phase.

    Attributes:
        phase_id: Phase number (0-5)
        name: Human-readable phase name
        status: Current phase status
        started_at: When phase started
        completed_at: When phase completed
        duration_min: Duration in minutes
        tool_events: Number of tool events
        errors: List of errors encountered
    """

    phase_id: int
    name: str = ""
    status: PhaseStatus = PhaseStatus.NOT_STARTED
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    duration_min: float = 0.0
    tool_events: int = 0
    errors: List[str] = field(default_factory=list)

    # Phase name lookup
    PHASE_NAMES = {
        0: "Pre-Phase (Analysis)",
        1: "Planning",
        2: "Execution",
        3: "Review",
        4: "QA",
        5: "Validation",
    }

    def __post_init__(self) -> None:
        """Set default name if not provided."""
        if not self.name:
            self.name = self.PHASE_NAMES.get(self.phase_id, f"Phase {self.phase_id}")

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "phase_id": self.phase_id,
            "name": self.name,
            "status": self.status.value,
            "started_at": self.started_at,
            "completed_at": self.completed_at,
            "duration_min": self.duration_min,
            "tool_events": self.tool_events,
            "errors": self.errors,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PhaseInfo":
        """Create from dictionary."""
        return cls(
            phase_id=data["phase_id"],
            name=data.get("name", ""),
            status=PhaseStatus(data.get("status", "not_started")),
            started_at=data.get("started_at"),
            completed_at=data.get("completed_at"),
            duration_min=data.get("duration_min", 0.0),
            tool_events=data.get("tool_events", 0),
            errors=data.get("errors", []),
        )


@dataclass
class WorkflowResult:
    """
    Result of a completed workflow.

    Attributes:
        workflow_id: Unique workflow identifier
        result: SUCCESS, PARTIAL, or FAILED
        duration_min: Total duration in minutes
        phases_completed: Number of phases completed
        total_tool_events: Total tool events recorded
        decisions_made: Decisions recorded
        blockers_resolved: Blockers resolved during workflow
        notes: Optional completion notes
    """

    workflow_id: str
    result: str  # SUCCESS, PARTIAL, FAILED
    duration_min: float = 0.0
    phases_completed: int = 0
    total_tool_events: int = 0
    decisions_made: int = 0
    blockers_resolved: int = 0
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "workflow_id": self.workflow_id,
            "result": self.result,
            "duration_min": self.duration_min,
            "phases_completed": self.phases_completed,
            "total_tool_events": self.total_tool_events,
            "decisions_made": self.decisions_made,
            "blockers_resolved": self.blockers_resolved,
            "notes": self.notes,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowResult":
        """Create from dictionary."""
        return cls(
            workflow_id=data["workflow_id"],
            result=data["result"],
            duration_min=data.get("duration_min", 0.0),
            phases_completed=data.get("phases_completed", 0),
            total_tool_events=data.get("total_tool_events", 0),
            decisions_made=data.get("decisions_made", 0),
            blockers_resolved=data.get("blockers_resolved", 0),
            notes=data.get("notes", ""),
        )

    @property
    def is_success(self) -> bool:
        """Check if workflow was successful."""
        return self.result == "SUCCESS"

    @property
    def is_partial(self) -> bool:
        """Check if workflow was partial success."""
        return self.result == "PARTIAL"

    @property
    def is_failed(self) -> bool:
        """Check if workflow failed."""
        return self.result == "FAILED"


@dataclass
class WorkflowState:
    """
    Complete state of a workflow.

    Used for persistence and resumption.

    Attributes:
        workflow_id: Unique workflow identifier
        task_description: Human description
        domain: Primary domain
        status: Current status
        current_phase: Current phase number
        phases: Phase info by phase_id
        started_at: When workflow started
        completed_at: When workflow completed
        complexity_score: Task complexity (0-10)
        metadata: Additional metadata
    """

    workflow_id: str
    task_description: str
    domain: Optional[str] = None
    status: WorkflowStatus = WorkflowStatus.PENDING
    current_phase: Optional[int] = None
    phases: Dict[int, PhaseInfo] = field(default_factory=dict)
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    complexity_score: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "workflow_id": self.workflow_id,
            "task_description": self.task_description,
            "domain": self.domain,
            "status": self.status.value,
            "current_phase": self.current_phase,
            "phases": {k: v.to_dict() for k, v in self.phases.items()},
            "started_at": self.started_at,
            "completed_at": self.completed_at,
            "complexity_score": self.complexity_score,
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowState":
        """Create from dictionary."""
        phases = {}
        for phase_id, phase_data in data.get("phases", {}).items():
            phases[int(phase_id)] = PhaseInfo.from_dict(phase_data)

        return cls(
            workflow_id=data["workflow_id"],
            task_description=data["task_description"],
            domain=data.get("domain"),
            status=WorkflowStatus(data.get("status", "pending")),
            current_phase=data.get("current_phase"),
            phases=phases,
            started_at=data.get("started_at"),
            completed_at=data.get("completed_at"),
            complexity_score=data.get("complexity_score", 0),
            metadata=data.get("metadata", {}),
        )

    def get_phase(self, phase_id: int) -> PhaseInfo:
        """Get or create phase info."""
        if phase_id not in self.phases:
            self.phases[phase_id] = PhaseInfo(phase_id=phase_id)
        return self.phases[phase_id]

    def start_phase(self, phase_id: int) -> PhaseInfo:
        """Start a phase."""
        phase = self.get_phase(phase_id)
        phase.status = PhaseStatus.IN_PROGRESS
        phase.started_at = datetime.now(timezone.utc).isoformat()
        self.current_phase = phase_id
        return phase

    def complete_phase(self, phase_id: int, success: bool = True) -> PhaseInfo:
        """Complete a phase."""
        phase = self.get_phase(phase_id)
        phase.status = PhaseStatus.COMPLETED if success else PhaseStatus.FAILED
        phase.completed_at = datetime.now(timezone.utc).isoformat()

        if phase.started_at:
            start = datetime.fromisoformat(phase.started_at)
            end = datetime.fromisoformat(phase.completed_at)
            phase.duration_min = (end - start).total_seconds() / 60

        if self.current_phase == phase_id:
            self.current_phase = None

        return phase

    @property
    def duration_min(self) -> float:
        """Get total workflow duration."""
        if not self.started_at:
            return 0.0

        end = (
            datetime.fromisoformat(self.completed_at)
            if self.completed_at
            else datetime.now(timezone.utc)
        )
        start = datetime.fromisoformat(self.started_at)
        return (end - start).total_seconds() / 60

    @property
    def phases_completed(self) -> int:
        """Count completed phases."""
        return sum(
            1 for p in self.phases.values()
            if p.status == PhaseStatus.COMPLETED
        )
