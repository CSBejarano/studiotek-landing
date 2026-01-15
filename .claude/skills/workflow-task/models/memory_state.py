"""
Memory State Models v2.0

Dataclasses for the 3-tier memory system:
- TIER 1: ShortTermMemory (session, ~50KB max, 24h TTL)
- TIER 2: LongTermMemory (project, persistent, max 100 entries)
- TIER 3: AgentMemory (per agent/domain)
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from enum import Enum


# =============================================================================
# ENUMS
# =============================================================================

class PhaseStatus(Enum):
    """Status of a workflow phase."""
    IDLE = "IDLE"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


class WorkflowResult(Enum):
    """Result of a completed workflow."""
    SUCCESS = "SUCCESS"
    PARTIAL = "PARTIAL"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class Severity(Enum):
    """Severity level for blockers."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# =============================================================================
# TIER 1: SHORT-TERM MEMORY (Session)
# =============================================================================

@dataclass
class ToolEvent:
    """
    Record of a tool invocation during workflow execution.

    Attributes:
        timestamp: ISO 8601 timestamp of the event
        tool: Name of the tool (Edit, Read, Bash, etc.)
        success: Whether the tool call succeeded
        file: Optional file path involved
        error: Error message if failed
        correction: Fix that resolved the error
        params: Additional parameters
    """
    timestamp: str
    tool: str
    success: bool
    file: Optional[str] = None
    error: Optional[str] = None
    correction: Optional[str] = None
    params: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        result = {
            "timestamp": self.timestamp,
            "tool": self.tool,
            "success": self.success,
        }
        if self.file:
            result["file"] = self.file
        if self.error:
            result["error"] = self.error
        if self.correction:
            result["correction"] = self.correction
        if self.params:
            result["params"] = self.params
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ToolEvent":
        """Create from dictionary."""
        return cls(
            timestamp=data["timestamp"],
            tool=data["tool"],
            success=data["success"],
            file=data.get("file"),
            error=data.get("error"),
            correction=data.get("correction"),
            params=data.get("params"),
        )


@dataclass
class PendingDecision:
    """
    A decision captured during workflow that hasn't been validated yet.

    Attributes:
        context: The situation or problem being addressed
        decision: The chosen solution or approach
        confidence: Confidence level (0.0 to 1.0)
        tags: Classification tags
        source: Where this decision was captured (manual, git, DECISIONS.md)
        validated_count: Number of successful uses
    """
    context: str
    decision: str
    confidence: float = 0.5
    tags: List[str] = field(default_factory=list)
    source: str = "manual"
    validated_count: int = 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "context": self.context,
            "decision": self.decision,
            "confidence": self.confidence,
            "tags": self.tags,
            "source": self.source,
            "validated_count": self.validated_count,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PendingDecision":
        """Create from dictionary."""
        return cls(
            context=data["context"],
            decision=data["decision"],
            confidence=data.get("confidence", 0.5),
            tags=data.get("tags", []),
            source=data.get("source", "manual"),
            validated_count=data.get("validated_count", 0),
        )


@dataclass
class ActiveBlocker:
    """
    A blocker encountered during workflow execution.

    Attributes:
        symptom: What the problem looks like
        solution: How to fix it (if known)
        severity: Impact level
        tags: Classification tags
        phase: Which phase encountered this
        resolved: Whether it's been resolved
    """
    symptom: str
    solution: Optional[str] = None
    severity: str = "medium"
    tags: List[str] = field(default_factory=list)
    phase: Optional[int] = None
    resolved: bool = False

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        result = {
            "symptom": self.symptom,
            "severity": self.severity,
            "tags": self.tags,
            "resolved": self.resolved,
        }
        if self.solution:
            result["solution"] = self.solution
        if self.phase is not None:
            result["phase"] = self.phase
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ActiveBlocker":
        """Create from dictionary."""
        return cls(
            symptom=data["symptom"],
            solution=data.get("solution"),
            severity=data.get("severity", "medium"),
            tags=data.get("tags", []),
            phase=data.get("phase"),
            resolved=data.get("resolved", False),
        )


@dataclass
class PhaseTiming:
    """Timing information for a workflow phase."""
    start: str
    end: Optional[str] = None
    duration_min: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = {"start": self.start}
        if self.end:
            result["end"] = self.end
        if self.duration_min is not None:
            result["duration_min"] = self.duration_min
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PhaseTiming":
        """Create from dictionary."""
        return cls(
            start=data["start"],
            end=data.get("end"),
            duration_min=data.get("duration_min"),
        )


@dataclass
class ContextSnapshot:
    """Snapshot of context during workflow."""
    files_read: List[str] = field(default_factory=list)
    files_modified: List[str] = field(default_factory=list)
    patterns_found: Dict[str, List[str]] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "files_read": self.files_read,
            "files_modified": self.files_modified,
            "patterns_found": self.patterns_found,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ContextSnapshot":
        """Create from dictionary."""
        return cls(
            files_read=data.get("files_read", []),
            files_modified=data.get("files_modified", []),
            patterns_found=data.get("patterns_found", {}),
        )


@dataclass
class ShortTermMemory:
    """
    TIER 1: Short-term memory for the current workflow session.

    Constraints:
    - Max size: ~50KB
    - TTL: 24 hours (auto-purge)
    - Scope: Single workflow

    Attributes:
        workflow_id: Unique identifier for this workflow
        task_description: Human description of the task
        session_start: When the session started
        current_phase: Current phase number (-1 to 5)
        phase_status: Status of current phase
        active_domain: Selected domain expert (if any)
        tool_events: List of tool invocations
        decisions_pending: Decisions awaiting validation
        blockers_active: Current blockers
        context_snapshot: Current context state
        phase_timings: Timing per phase
    """
    workflow_id: str
    task_description: str
    session_start: str
    current_phase: int = -1
    phase_status: str = "IDLE"
    active_domain: Optional[str] = None
    complexity_score: int = 0
    tool_events: List[ToolEvent] = field(default_factory=list)
    decisions_pending: List[PendingDecision] = field(default_factory=list)
    blockers_active: List[ActiveBlocker] = field(default_factory=list)
    context_snapshot: ContextSnapshot = field(default_factory=ContextSnapshot)
    phase_timings: Dict[int, PhaseTiming] = field(default_factory=dict)
    # Ralph Wiggum loop state (optional)
    ralph: Optional["RalphLoopState"] = None

    # Constraints
    MAX_SIZE_KB: int = 50
    MAX_TOOL_EVENTS: int = 200
    MAX_DECISIONS: int = 50
    MAX_BLOCKERS: int = 30

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "$schema": "2.0",
            "workflow_id": self.workflow_id,
            "task_description": self.task_description,
            "session_start": self.session_start,
            "current_phase": self.current_phase,
            "phase_status": self.phase_status,
            "active_domain": self.active_domain,
            "complexity_score": self.complexity_score,
            "tool_events": [e.to_dict() for e in self.tool_events],
            "decisions_pending": [d.to_dict() for d in self.decisions_pending],
            "blockers_active": [b.to_dict() for b in self.blockers_active],
            "context_snapshot": self.context_snapshot.to_dict(),
            "phase_timings": {
                str(k): v.to_dict() for k, v in self.phase_timings.items()
            },
            "ralph": self.ralph.to_dict() if self.ralph else None,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ShortTermMemory":
        """Create from dictionary."""
        from .ralph_state import RalphLoopState

        phase_timings = {}
        for k, v in data.get("phase_timings", {}).items():
            phase_timings[int(k)] = PhaseTiming.from_dict(v)

        # Parse ralph state if present
        ralph_data = data.get("ralph")
        ralph = RalphLoopState.from_dict(ralph_data) if ralph_data else None

        return cls(
            workflow_id=data["workflow_id"],
            task_description=data["task_description"],
            session_start=data["session_start"],
            current_phase=data.get("current_phase", -1),
            phase_status=data.get("phase_status", "IDLE"),
            active_domain=data.get("active_domain"),
            complexity_score=data.get("complexity_score", 0),
            tool_events=[
                ToolEvent.from_dict(e) for e in data.get("tool_events", [])
            ],
            decisions_pending=[
                PendingDecision.from_dict(d)
                for d in data.get("decisions_pending", [])
            ],
            blockers_active=[
                ActiveBlocker.from_dict(b)
                for b in data.get("blockers_active", [])
            ],
            context_snapshot=ContextSnapshot.from_dict(
                data.get("context_snapshot", {})
            ),
            phase_timings=phase_timings,
            ralph=ralph,
        )

    def add_tool_event(self, event: ToolEvent) -> None:
        """Add tool event with size constraint."""
        if len(self.tool_events) >= self.MAX_TOOL_EVENTS:
            # FIFO: remove oldest
            self.tool_events.pop(0)
        self.tool_events.append(event)

    def add_decision(self, decision: PendingDecision) -> None:
        """Add pending decision with size constraint."""
        if len(self.decisions_pending) >= self.MAX_DECISIONS:
            self.decisions_pending.pop(0)
        self.decisions_pending.append(decision)

    def add_blocker(self, blocker: ActiveBlocker) -> None:
        """Add active blocker with size constraint."""
        if len(self.blockers_active) >= self.MAX_BLOCKERS:
            self.blockers_active.pop(0)
        self.blockers_active.append(blocker)


# =============================================================================
# TIER 2: LONG-TERM MEMORY (Project)
# =============================================================================

@dataclass
class ValidatedDecision:
    """
    A decision that has been validated through successful use.

    Promotion criteria:
    - confidence >= 0.8
    - validated_count >= 2
    """
    id: str
    context: str
    decision: str
    confidence: float
    validated_count: int
    failed_count: int = 0
    last_used: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "context": self.context,
            "decision": self.decision,
            "confidence": self.confidence,
            "validated_count": self.validated_count,
            "failed_count": self.failed_count,
            "last_used": self.last_used,
            "tags": self.tags,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ValidatedDecision":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            context=data["context"],
            decision=data["decision"],
            confidence=data.get("confidence", 0.8),
            validated_count=data.get("validated_count", 1),
            failed_count=data.get("failed_count", 0),
            last_used=data.get("last_used"),
            tags=data.get("tags", []),
        )


@dataclass
class SolvedBlocker:
    """
    A blocker that has been solved and learned from.

    Promotion criteria:
    - occurrences >= 2
    - solution_verified = True
    """
    id: str
    symptom: str
    solution: str
    prevention: Optional[str] = None
    occurrences: int = 1
    last_seen: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = {
            "id": self.id,
            "symptom": self.symptom,
            "solution": self.solution,
            "occurrences": self.occurrences,
            "tags": self.tags,
        }
        if self.prevention:
            result["prevention"] = self.prevention
        if self.last_seen:
            result["last_seen"] = self.last_seen
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "SolvedBlocker":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            symptom=data["symptom"],
            solution=data["solution"],
            prevention=data.get("prevention"),
            occurrences=data.get("occurrences", 1),
            last_seen=data.get("last_seen"),
            tags=data.get("tags", []),
        )


@dataclass
class PhaseVelocity:
    """Velocity statistics for a single phase."""
    avg_min: float
    samples: int = 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {"avg_min": self.avg_min, "samples": self.samples}

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PhaseVelocity":
        """Create from dictionary."""
        return cls(avg_min=data.get("avg_min", 0.0), samples=data.get("samples", 0))


@dataclass
class ComplexityVelocity:
    """Velocity statistics by complexity level."""
    avg_min: float
    success_rate: float
    samples: int = 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "avg_min": self.avg_min,
            "success_rate": self.success_rate,
            "samples": self.samples,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ComplexityVelocity":
        """Create from dictionary."""
        return cls(
            avg_min=data.get("avg_min", 0.0),
            success_rate=data.get("success_rate", 1.0),
            samples=data.get("samples", 0),
        )


@dataclass
class VelocityStats:
    """Aggregated velocity statistics."""
    by_phase: Dict[str, PhaseVelocity] = field(default_factory=dict)
    by_complexity: Dict[str, ComplexityVelocity] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "by_phase": {k: v.to_dict() for k, v in self.by_phase.items()},
            "by_complexity": {k: v.to_dict() for k, v in self.by_complexity.items()},
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "VelocityStats":
        """Create from dictionary."""
        by_phase = {}
        for k, v in data.get("by_phase", {}).items():
            by_phase[k] = PhaseVelocity.from_dict(v)

        by_complexity = {}
        for k, v in data.get("by_complexity", {}).items():
            by_complexity[k] = ComplexityVelocity.from_dict(v)

        return cls(by_phase=by_phase, by_complexity=by_complexity)


@dataclass
class ToolStats:
    """Statistics for a single tool."""
    success_count: int = 0
    fail_count: int = 0

    @property
    def success_rate(self) -> float:
        """Calculate success rate."""
        total = self.success_count + self.fail_count
        if total == 0:
            return 1.0
        return self.success_count / total

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "success_count": self.success_count,
            "fail_count": self.fail_count,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ToolStats":
        """Create from dictionary."""
        return cls(
            success_count=data.get("success_count", 0),
            fail_count=data.get("fail_count", 0),
        )


@dataclass
class WorkflowHistoryEntry:
    """Entry in workflow history."""
    id: str
    result: str
    duration_min: float
    domain: Optional[str] = None
    complexity: int = 0
    timestamp: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = {
            "id": self.id,
            "result": self.result,
            "duration_min": self.duration_min,
        }
        if self.domain:
            result["domain"] = self.domain
        if self.complexity:
            result["complexity"] = self.complexity
        if self.timestamp:
            result["timestamp"] = self.timestamp
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WorkflowHistoryEntry":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            result=data["result"],
            duration_min=data.get("duration_min", 0.0),
            domain=data.get("domain"),
            complexity=data.get("complexity", 0),
            timestamp=data.get("timestamp"),
        )


@dataclass
class LongTermMemory:
    """
    TIER 2: Long-term memory for the project.

    Constraints:
    - Max 100 entries per category (FIFO)
    - Persistent across workflows
    - YAML format for readability

    Attributes:
        version: Schema version
        project_id: Project identifier
        updated_at: Last update timestamp
        workflows_completed: Total completed workflows
        decisions: Validated decisions
        blockers: Solved blockers
        velocity: Velocity statistics
        tools: Tool usage statistics
        history: Recent workflow history
    """
    version: str = "2.0"
    project_id: str = ""
    updated_at: Optional[str] = None
    workflows_completed: int = 0
    decisions: List[ValidatedDecision] = field(default_factory=list)
    blockers: List[SolvedBlocker] = field(default_factory=list)
    velocity: VelocityStats = field(default_factory=VelocityStats)
    tools: Dict[str, ToolStats] = field(default_factory=dict)
    history: List[WorkflowHistoryEntry] = field(default_factory=list)

    # Constraints
    MAX_DECISIONS: int = 100
    MAX_BLOCKERS: int = 100
    MAX_HISTORY: int = 100

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for YAML serialization."""
        return {
            "version": self.version,
            "project_id": self.project_id,
            "updated_at": self.updated_at,
            "workflows_completed": self.workflows_completed,
            "decisions": [d.to_dict() for d in self.decisions],
            "blockers": [b.to_dict() for b in self.blockers],
            "velocity": self.velocity.to_dict(),
            "tools": {k: v.to_dict() for k, v in self.tools.items()},
            "history": [h.to_dict() for h in self.history],
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "LongTermMemory":
        """Create from dictionary."""
        tools = {}
        for k, v in data.get("tools", {}).items():
            tools[k] = ToolStats.from_dict(v)

        return cls(
            version=data.get("version", "2.0"),
            project_id=data.get("project_id", ""),
            updated_at=data.get("updated_at"),
            workflows_completed=data.get("workflows_completed", 0),
            decisions=[
                ValidatedDecision.from_dict(d)
                for d in data.get("decisions", [])
            ],
            blockers=[
                SolvedBlocker.from_dict(b)
                for b in data.get("blockers", [])
            ],
            velocity=VelocityStats.from_dict(data.get("velocity", {})),
            tools=tools,
            history=[
                WorkflowHistoryEntry.from_dict(h)
                for h in data.get("history", [])
            ],
        )

    def add_decision(self, decision: ValidatedDecision) -> None:
        """Add validated decision with FIFO constraint."""
        if len(self.decisions) >= self.MAX_DECISIONS:
            self.decisions.pop(0)
        self.decisions.append(decision)

    def add_blocker(self, blocker: SolvedBlocker) -> None:
        """Add solved blocker with FIFO constraint."""
        if len(self.blockers) >= self.MAX_BLOCKERS:
            self.blockers.pop(0)
        self.blockers.append(blocker)

    def add_history(self, entry: WorkflowHistoryEntry) -> None:
        """Add history entry with FIFO constraint."""
        if len(self.history) >= self.MAX_HISTORY:
            self.history.pop(0)
        self.history.append(entry)


# =============================================================================
# TIER 3: AGENT MEMORY (Per Domain)
# =============================================================================

@dataclass
class KeywordConfig:
    """Keyword configuration for agent classification."""
    primary: List[str] = field(default_factory=list)
    secondary: List[str] = field(default_factory=list)
    file_patterns: List[str] = field(default_factory=list)
    exclude: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "primary": self.primary,
            "secondary": self.secondary,
            "file_patterns": self.file_patterns,
            "exclude": self.exclude,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "KeywordConfig":
        """Create from dictionary."""
        return cls(
            primary=data.get("primary", []),
            secondary=data.get("secondary", []),
            file_patterns=data.get("file_patterns", []),
            exclude=data.get("exclude", []),
        )


@dataclass
class AgentContext:
    """Domain-specific context for an agent."""
    key_concepts: List[str] = field(default_factory=list)
    common_patterns: List[str] = field(default_factory=list)
    anti_patterns: List[str] = field(default_factory=list)
    preferred_tools: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "key_concepts": self.key_concepts,
            "common_patterns": self.common_patterns,
            "anti_patterns": self.anti_patterns,
            "preferred_tools": self.preferred_tools,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentContext":
        """Create from dictionary."""
        return cls(
            key_concepts=data.get("key_concepts", []),
            common_patterns=data.get("common_patterns", []),
            anti_patterns=data.get("anti_patterns", []),
            preferred_tools=data.get("preferred_tools", []),
        )


@dataclass
class AgentDecision:
    """A decision specific to this agent's domain."""
    id: str
    scenario: str
    decision: str
    rationale: Optional[str] = None
    confidence: float = 0.8

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = {
            "id": self.id,
            "scenario": self.scenario,
            "decision": self.decision,
            "confidence": self.confidence,
        }
        if self.rationale:
            result["rationale"] = self.rationale
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentDecision":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            scenario=data["scenario"],
            decision=data["decision"],
            rationale=data.get("rationale"),
            confidence=data.get("confidence", 0.8),
        )


@dataclass
class AgentBlocker:
    """A blocker specific to this agent's domain."""
    id: str
    symptom: str
    solution: str
    domain_context: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        result = {
            "id": self.id,
            "symptom": self.symptom,
            "solution": self.solution,
        }
        if self.domain_context:
            result["domain_context"] = self.domain_context
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentBlocker":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            symptom=data["symptom"],
            solution=data["solution"],
            domain_context=data.get("domain_context"),
        )


@dataclass
class AgentMemory:
    """
    TIER 3: Memory for a specific domain expert agent.

    Each agent maintains its own specialized memory.

    Attributes:
        domain_id: Unique identifier (backend, frontend, etc.)
        display_name: Human-readable name
        version: Schema version
        updated_at: Last update timestamp
        tasks_handled: Total tasks handled by this agent
        success_rate: Overall success rate
        keywords: Classification keywords
        context: Domain-specific context
        decisions: Domain-specific decisions
        blockers: Domain-specific blockers
    """
    domain_id: str
    display_name: str
    version: str = "1.0"
    updated_at: Optional[str] = None
    tasks_handled: int = 0
    success_rate: float = 1.0
    keywords: KeywordConfig = field(default_factory=KeywordConfig)
    context: AgentContext = field(default_factory=AgentContext)
    decisions: List[AgentDecision] = field(default_factory=list)
    blockers: List[AgentBlocker] = field(default_factory=list)

    # Constraints
    MAX_DECISIONS: int = 50
    MAX_BLOCKERS: int = 50

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for YAML serialization."""
        return {
            "domain_id": self.domain_id,
            "display_name": self.display_name,
            "version": self.version,
            "updated_at": self.updated_at,
            "tasks_handled": self.tasks_handled,
            "success_rate": self.success_rate,
            "keywords": self.keywords.to_dict(),
            "context": self.context.to_dict(),
            "decisions": [d.to_dict() for d in self.decisions],
            "blockers": [b.to_dict() for b in self.blockers],
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentMemory":
        """Create from dictionary."""
        return cls(
            domain_id=data["domain_id"],
            display_name=data["display_name"],
            version=data.get("version", "1.0"),
            updated_at=data.get("updated_at"),
            tasks_handled=data.get("tasks_handled", 0),
            success_rate=data.get("success_rate", 1.0),
            keywords=KeywordConfig.from_dict(data.get("keywords", {})),
            context=AgentContext.from_dict(data.get("context", {})),
            decisions=[
                AgentDecision.from_dict(d)
                for d in data.get("decisions", [])
            ],
            blockers=[
                AgentBlocker.from_dict(b)
                for b in data.get("blockers", [])
            ],
        )

    def add_decision(self, decision: AgentDecision) -> None:
        """Add domain decision with FIFO constraint."""
        if len(self.decisions) >= self.MAX_DECISIONS:
            self.decisions.pop(0)
        self.decisions.append(decision)

    def add_blocker(self, blocker: AgentBlocker) -> None:
        """Add domain blocker with FIFO constraint."""
        if len(self.blockers) >= self.MAX_BLOCKERS:
            self.blockers.pop(0)
        self.blockers.append(blocker)

    def update_stats(self, success: bool) -> None:
        """Update tasks_handled and success_rate."""
        total = self.tasks_handled
        successes = int(self.success_rate * total)

        self.tasks_handled += 1
        if success:
            successes += 1

        self.success_rate = successes / self.tasks_handled
