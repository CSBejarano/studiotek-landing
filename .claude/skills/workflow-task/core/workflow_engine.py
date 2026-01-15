"""
Workflow Engine v2.0

Main orchestrator for workflow execution. Coordinates:
- Workflow lifecycle (start, phases, complete)
- Memory management (3-tier)
- Phase transitions with validation
- Decision and blocker recording
- Automatic consolidation on completion

Usage:
    async with run_workflow("Issue #64 - Feature", domain="backend") as engine:
        # Record during work
        engine.record_decision(...)
        engine.record_tool_event(...)

        # Execute phases
        await engine.start_phase(2)
        await engine.complete_phase()

        # Auto-consolidates on exit
"""

import asyncio
import re
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any, AsyncGenerator, Callable, Dict, List, Optional


from .memory_manager import MemoryManager, create_memory_manager

# Import models
try:
    from ..models.memory_state import (
        PendingDecision,
        ActiveBlocker,
        ToolEvent,
    )
    from ..models.workflow_state import (
        WorkflowStatus,
        WorkflowResult,
        PhaseInfo,
        WorkflowState,
    )
except ImportError:
    from models.memory_state import (
        PendingDecision,
        ActiveBlocker,
        ToolEvent,
    )
    from models.workflow_state import (
        WorkflowStatus,
        WorkflowResult,
        PhaseInfo,
        WorkflowState,
    )


class WorkflowPhase(Enum):
    """Standard workflow phases."""

    PRE_PHASE = 0       # Analysis and planning
    PLANNING = 1        # Detailed planning
    EXECUTION = 2       # Implementation
    REVIEW = 3          # Code review and fixes
    QA = 4              # Testing and validation
    VALIDATION = 5      # Final validation


@dataclass
class PhaseResult:
    """Result of a phase execution."""

    phase: int
    success: bool
    duration_min: float
    tool_events: int
    errors: List[str] = field(default_factory=list)
    blockers_resolved: int = 0
    decisions_made: int = 0


class WorkflowEngine:
    """
    Main workflow orchestrator.

    Manages the complete workflow lifecycle including phases,
    memory, decisions, and blockers.
    """

    def __init__(
        self,
        skill_root: Path,
        workflow_id: str,
        task_description: str,
        domain: Optional[str] = None,
        complexity_score: int = 0,
        auto_save: bool = True,
    ):
        """
        Initialize the workflow engine.

        Args:
            skill_root: Path to the skill directory
            workflow_id: Unique workflow identifier
            task_description: Human description of the task
            domain: Primary domain (backend, frontend, etc.)
            complexity_score: Task complexity (0-10)
            auto_save: Whether to auto-save on changes
        """
        self._skill_root = skill_root
        self._workflow_id = workflow_id
        self._task_description = task_description
        self._domain = domain
        self._complexity_score = complexity_score
        self._auto_save = auto_save

        # State
        self._status = WorkflowStatus.PENDING
        self._current_phase: Optional[int] = None
        self._phase_start_time: Optional[datetime] = None
        self._phase_results: Dict[int, PhaseResult] = {}
        self._started_at: Optional[datetime] = None
        self._completed_at: Optional[datetime] = None

        # Memory manager
        self._memory: Optional[MemoryManager] = None

        # Hooks
        self._on_phase_start: List[Callable] = []
        self._on_phase_complete: List[Callable] = []
        self._on_error: List[Callable] = []

    # =========================================================================
    # PROPERTIES
    # =========================================================================

    @property
    def workflow_id(self) -> str:
        """Get the workflow ID."""
        return self._workflow_id

    @property
    def task_description(self) -> str:
        """Get the task description."""
        return self._task_description

    @property
    def domain(self) -> Optional[str]:
        """Get the primary domain."""
        return self._domain

    @property
    def status(self) -> WorkflowStatus:
        """Get current workflow status."""
        return self._status

    @property
    def current_phase(self) -> Optional[int]:
        """Get the current phase number."""
        return self._current_phase

    @property
    def is_running(self) -> bool:
        """Check if workflow is currently running."""
        return self._status == WorkflowStatus.IN_PROGRESS

    @property
    def is_complete(self) -> bool:
        """Check if workflow is complete."""
        return self._status in (WorkflowStatus.COMPLETED, WorkflowStatus.FAILED)

    @property
    def memory(self) -> Optional[MemoryManager]:
        """Get the memory manager."""
        return self._memory

    # =========================================================================
    # LIFECYCLE
    # =========================================================================

    async def start(self) -> None:
        """
        Start the workflow.

        Initializes memory, creates session, and transitions to IN_PROGRESS.
        """
        if self._status != WorkflowStatus.PENDING:
            raise RuntimeError(f"Cannot start workflow in state {self._status}")

        self._started_at = datetime.now(timezone.utc)
        self._status = WorkflowStatus.IN_PROGRESS

        # Initialize memory manager
        self._memory = create_memory_manager(self._skill_root)

        # Start session
        self._memory.start_session(
            workflow_id=self._workflow_id,
            task_description=self._task_description,
            complexity_score=self._complexity_score,
            domain=self._domain,
        )

        # Load long-term memory
        self._memory.load_long_term()

        # Load agent memory if domain specified
        if self._domain:
            self._memory.load_agent_memory(self._domain)

    async def complete(
        self,
        result: Optional[str] = None,
        force: bool = False,
    ) -> WorkflowResult:
        """
        Complete the workflow.

        Args:
            result: Override result (SUCCESS, PARTIAL, FAILED)
            force: Force completion even with active blockers

        Returns:
            WorkflowResult with summary
        """
        if not self.is_running and not force:
            raise RuntimeError("Workflow is not running")

        self._completed_at = datetime.now(timezone.utc)

        # Complete any active phase
        if self._current_phase is not None:
            await self.complete_phase()

        # Determine result
        if result is None:
            result = self._determine_result()

        # Calculate duration
        duration_min = 0.0
        if self._started_at:
            delta = self._completed_at - self._started_at
            duration_min = delta.total_seconds() / 60

        # Consolidate memory
        if self._memory:
            self._memory.consolidate_workflow(
                result=result,
                duration_min=duration_min,
            )

        # Update status
        self._status = (
            WorkflowStatus.COMPLETED
            if result == "SUCCESS"
            else WorkflowStatus.FAILED
            if result == "FAILED"
            else WorkflowStatus.COMPLETED
        )

        return WorkflowResult(
            workflow_id=self._workflow_id,
            result=result,
            duration_min=duration_min,
            phases_completed=len(self._phase_results),
            total_tool_events=sum(pr.tool_events for pr in self._phase_results.values()),
            decisions_made=sum(pr.decisions_made for pr in self._phase_results.values()),
            blockers_resolved=sum(pr.blockers_resolved for pr in self._phase_results.values()),
        )

    async def abort(self, reason: str = "User requested abort") -> None:
        """
        Abort the workflow.

        Args:
            reason: Reason for aborting
        """
        self._status = WorkflowStatus.FAILED
        self._completed_at = datetime.now(timezone.utc)

        # Record the abort as a blocker
        if self._memory and self._memory.short_term:
            self.record_blocker(
                symptom=f"Workflow aborted: {reason}",
                severity="critical",
                tags=["abort", "workflow"],
            )

        # Complete with FAILED
        await self.complete(result="FAILED", force=True)

    # =========================================================================
    # PHASE MANAGEMENT
    # =========================================================================

    async def start_phase(self, phase_id: int, description: str = "") -> None:
        """
        Start a new phase.

        Args:
            phase_id: Phase number (0-5)
            description: Optional phase description
        """
        if not self.is_running:
            raise RuntimeError("Workflow is not running")

        # Complete previous phase if any
        if self._current_phase is not None:
            await self.complete_phase()

        self._current_phase = phase_id
        self._phase_start_time = datetime.now(timezone.utc)

        # Update memory
        if self._memory:
            self._memory.start_phase(phase_id)

        # Fire hooks
        for hook in self._on_phase_start:
            try:
                if asyncio.iscoroutinefunction(hook):
                    await hook(phase_id, description)
                else:
                    hook(phase_id, description)
            except Exception:
                pass  # Don't block on hook errors

    async def complete_phase(
        self,
        success: bool = True,
        notes: str = "",
    ) -> Optional[PhaseResult]:
        """
        Complete the current phase.

        Args:
            success: Whether phase completed successfully
            notes: Optional notes about completion

        Returns:
            PhaseResult with summary
        """
        if self._current_phase is None:
            return None

        phase_id = self._current_phase
        duration_min = 0.0

        if self._phase_start_time:
            delta = datetime.now(timezone.utc) - self._phase_start_time
            duration_min = delta.total_seconds() / 60

        # Get phase stats from memory
        tool_events = 0
        decisions_made = 0
        blockers_resolved = 0
        errors: List[str] = []

        if self._memory and self._memory.short_term:
            # Count tool events for this phase
            for event in self._memory.short_term.tool_events:
                tool_events += 1
                if not event.success and event.error:
                    errors.append(event.error[:100])

            decisions_made = len(self._memory.short_term.decisions_pending)
            blockers_resolved = sum(
                1 for b in self._memory.short_term.blockers_active if b.resolved
            )

            # Complete phase in memory
            self._memory.complete_phase(phase_id)

        result = PhaseResult(
            phase=phase_id,
            success=success,
            duration_min=duration_min,
            tool_events=tool_events,
            errors=errors,
            decisions_made=decisions_made,
            blockers_resolved=blockers_resolved,
        )

        self._phase_results[phase_id] = result
        self._current_phase = None
        self._phase_start_time = None

        # Fire hooks
        for hook in self._on_phase_complete:
            try:
                if asyncio.iscoroutinefunction(hook):
                    await hook(result)
                else:
                    hook(result)
            except Exception:
                pass

        return result

    # =========================================================================
    # RECORDING
    # =========================================================================

    def record_tool_event(
        self,
        tool: str,
        success: bool,
        file: Optional[str] = None,
        error: Optional[str] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Record a tool event.

        Args:
            tool: Tool name (Edit, Write, Bash, etc.)
            success: Whether the tool succeeded
            file: File path if applicable
            error: Error message if failed
            params: Tool parameters
        """
        if self._memory:
            self._memory.record_tool_event(
                tool=tool,
                success=success,
                file=file,
                error=error,
                params=params,
            )

    def record_decision(
        self,
        context: str,
        decision: str,
        confidence: float = 0.5,
        tags: Optional[List[str]] = None,
    ) -> None:
        """
        Record a pending decision.

        Args:
            context: What the decision is about
            decision: The decision made
            confidence: Confidence level (0-1)
            tags: Tags for categorization
        """
        if self._memory:
            self._memory.record_decision(
                context=context,
                decision=decision,
                confidence=confidence,
                tags=tags or [],
            )

    def record_blocker(
        self,
        symptom: str,
        severity: str = "medium",
        tags: Optional[List[str]] = None,
    ) -> None:
        """
        Record an active blocker.

        Args:
            symptom: What the blocker is
            severity: low, medium, high, critical
            tags: Tags for categorization
        """
        if self._memory:
            self._memory.record_blocker(
                symptom=symptom,
                severity=severity,
                tags=tags or [],
            )

        # Fire error hooks
        for hook in self._on_error:
            try:
                hook(symptom, severity)
            except Exception:
                pass

    def resolve_blocker(self, symptom: str, solution: str) -> bool:
        """
        Resolve an active blocker.

        Args:
            symptom: The blocker symptom to match
            solution: How it was resolved

        Returns:
            True if blocker was found and resolved
        """
        if self._memory:
            return self._memory.resolve_blocker(symptom, solution)
        return False

    # =========================================================================
    # CONTEXT
    # =========================================================================

    def get_context(self) -> Dict[str, Any]:
        """
        Get the current workflow context.

        Returns:
            Combined context from all memory tiers
        """
        if self._memory:
            return self._memory.get_context(
                phase_id=self._current_phase or 0,
                task_description=self._task_description,
            )
        return {}

    def get_relevant_decisions(self, tags: Optional[List[str]] = None) -> List[Dict]:
        """
        Get relevant past decisions.

        Args:
            tags: Filter by tags

        Returns:
            List of relevant decisions
        """
        context = self.get_context()
        decisions = context.get("relevant_decisions", [])

        if tags:
            decisions = [
                d for d in decisions
                if any(t in d.get("tags", []) for t in tags)
            ]

        return decisions

    def get_known_blockers(self, tags: Optional[List[str]] = None) -> List[Dict]:
        """
        Get known blockers from history.

        Args:
            tags: Filter by tags

        Returns:
            List of known blockers with solutions
        """
        context = self.get_context()
        blockers = context.get("known_blockers", [])

        if tags:
            blockers = [
                b for b in blockers
                if any(t in b.get("tags", []) for t in tags)
            ]

        return blockers

    # =========================================================================
    # HOOKS
    # =========================================================================

    def on_phase_start(self, callback: Callable) -> None:
        """Register a callback for phase start events."""
        self._on_phase_start.append(callback)

    def on_phase_complete(self, callback: Callable) -> None:
        """Register a callback for phase complete events."""
        self._on_phase_complete.append(callback)

    def on_error(self, callback: Callable) -> None:
        """Register a callback for error events."""
        self._on_error.append(callback)

    # =========================================================================
    # INTERNAL
    # =========================================================================

    def _determine_result(self) -> str:
        """Determine the workflow result based on current state."""
        if not self._memory or not self._memory.short_term:
            return "FAILED"

        short_term = self._memory.short_term

        # Check for unresolved critical blockers
        for blocker in short_term.blockers_active:
            if not blocker.resolved and blocker.severity == "critical":
                return "FAILED"

        # Check for high failure rate
        total_events = len(short_term.tool_events)
        if total_events > 0:
            failures = sum(1 for e in short_term.tool_events if not e.success)
            if failures / total_events > 0.3:
                return "PARTIAL"

        # Check for unresolved blockers
        unresolved = sum(1 for b in short_term.blockers_active if not b.resolved)
        if unresolved > 0:
            return "PARTIAL"

        return "SUCCESS"


# =============================================================================
# CONTEXT MANAGER
# =============================================================================


@asynccontextmanager
async def run_workflow(
    task_description: str,
    skill_root: Optional[Path] = None,
    workflow_id: Optional[str] = None,
    domain: Optional[str] = None,
    complexity_score: int = 0,
) -> AsyncGenerator[WorkflowEngine, None]:
    """
    Context manager for running a workflow.

    Usage:
        async with run_workflow("Issue #64 - Feature") as engine:
            engine.record_decision(...)
            await engine.start_phase(2)
            # Work...
            await engine.complete_phase()

    Args:
        task_description: Human description of the task
        skill_root: Path to skill directory (auto-detected if None)
        workflow_id: Unique ID (generated if None)
        domain: Primary domain
        complexity_score: Task complexity (0-10)

    Yields:
        WorkflowEngine instance
    """
    # Auto-detect skill root
    if skill_root is None:
        # Try to find from current file location
        skill_root = Path(__file__).parent.parent

    # Generate workflow ID if not provided
    if workflow_id is None:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        # Extract slug from description
        issue_match = re.search(r"#(\d+)", task_description)
        if issue_match:
            slug = f"issue-{issue_match.group(1)}"
        else:
            words = re.sub(r"[^a-zA-Z0-9\s]", "", task_description.lower()).split()[:3]
            slug = "-".join(words) if words else "workflow"
        workflow_id = f"{today}_{slug}"

    engine = WorkflowEngine(
        skill_root=skill_root,
        workflow_id=workflow_id,
        task_description=task_description,
        domain=domain,
        complexity_score=complexity_score,
    )

    try:
        await engine.start()
        yield engine
        await engine.complete()
    except Exception as e:
        await engine.abort(reason=str(e))
        raise
