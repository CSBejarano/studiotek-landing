"""
Learning Engine v2.0

Captures patterns and promotes learnings across memory tiers:
- Tool usage patterns → Short-term → Long-term
- Decisions → Validate → Promote to Long-term
- Blockers → Resolve → Promote to Long-term
- Agent memory → Domain-specific learnings

Usage:
    engine = LearningEngine(memory_manager)
    engine.capture_tool_event(tool, success, error)
    engine.capture_decision(context, decision, confidence)
    await engine.promote_learnings()
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Import models
try:
    from ..models.memory_state import (
        ShortTermMemory,
        LongTermMemory,
        AgentMemory,
        ToolEvent,
        PendingDecision,
        ActiveBlocker,
        ValidatedDecision,
        SolvedBlocker,
        WorkflowHistoryEntry,
        PhaseVelocity,
        ComplexityVelocity,
        ToolStats,
    )
    from .memory_manager import MemoryManager
except ImportError:
    from models.memory_state import (
        ShortTermMemory,
        LongTermMemory,
        AgentMemory,
        ToolEvent,
        PendingDecision,
        ActiveBlocker,
        ValidatedDecision,
        SolvedBlocker,
        WorkflowHistoryEntry,
        PhaseVelocity,
        ComplexityVelocity,
        ToolStats,
    )
    from core.memory_manager import MemoryManager

# Aliases for clarity in this module
LongTermDecision = ValidatedDecision
LongTermBlocker = SolvedBlocker
WorkflowHistory = WorkflowHistoryEntry


# =============================================================================
# CONSTANTS
# =============================================================================

# Promotion thresholds
DECISION_MIN_CONFIDENCE = 0.8
DECISION_MIN_VALIDATIONS = 2
BLOCKER_MIN_OCCURRENCES = 2

# Velocity calculation
DEFAULT_PHASE_DURATION_MIN = 30.0
DEFAULT_VELOCITY_SAMPLES = 10


# =============================================================================
# LEARNING RESULT
# =============================================================================


@dataclass
class LearningResult:
    """Result of a learning operation."""

    decisions_promoted: int = 0
    decisions_skipped: int = 0
    blockers_promoted: int = 0
    blockers_skipped: int = 0
    tool_patterns_updated: int = 0
    agent_memories_updated: int = 0
    errors: List[str] = field(default_factory=list)

    @property
    def total_promoted(self) -> int:
        """Total items promoted."""
        return self.decisions_promoted + self.blockers_promoted

    @property
    def has_errors(self) -> bool:
        """Check if there were any errors."""
        return len(self.errors) > 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "decisions_promoted": self.decisions_promoted,
            "decisions_skipped": self.decisions_skipped,
            "blockers_promoted": self.blockers_promoted,
            "blockers_skipped": self.blockers_skipped,
            "tool_patterns_updated": self.tool_patterns_updated,
            "agent_memories_updated": self.agent_memories_updated,
            "errors": self.errors,
            "total_promoted": self.total_promoted,
        }


# =============================================================================
# LEARNING ENGINE
# =============================================================================


class LearningEngine:
    """
    Captures patterns and promotes learnings across memory tiers.

    The engine observes workflow execution and extracts reusable learnings
    that can be applied to future workflows.
    """

    def __init__(
        self,
        memory_manager: MemoryManager,
        min_decision_confidence: float = DECISION_MIN_CONFIDENCE,
        min_decision_validations: int = DECISION_MIN_VALIDATIONS,
        min_blocker_occurrences: int = BLOCKER_MIN_OCCURRENCES,
    ):
        """
        Initialize the learning engine.

        Args:
            memory_manager: The memory manager to use for storage
            min_decision_confidence: Minimum confidence for decision promotion
            min_decision_validations: Minimum validations for decision promotion
            min_blocker_occurrences: Minimum occurrences for blocker promotion
        """
        self._memory = memory_manager
        self._min_confidence = min_decision_confidence
        self._min_validations = min_decision_validations
        self._min_occurrences = min_blocker_occurrences

        # Tracking
        self._captured_events: List[ToolEvent] = []
        self._captured_decisions: List[PendingDecision] = []
        self._captured_blockers: List[ActiveBlocker] = []

    # =========================================================================
    # CAPTURE METHODS
    # =========================================================================

    def capture_tool_event(
        self,
        tool: str,
        success: bool,
        file_path: Optional[str] = None,
        error: Optional[str] = None,
        correction: Optional[str] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> ToolEvent:
        """
        Capture a tool usage event.

        Args:
            tool: Tool name (Edit, Read, Bash, etc.)
            success: Whether the tool call succeeded
            file_path: File involved (if any)
            error: Error message (if failed)
            correction: How the error was corrected
            params: Tool parameters

        Returns:
            Captured ToolEvent
        """
        event = ToolEvent(
            timestamp=datetime.now(timezone.utc).isoformat(),
            tool=tool,
            success=success,
            file=file_path,
            error=error,
            correction=correction,
            params=params or {},
        )

        self._captured_events.append(event)
        # Use individual parameters for MemoryManager
        self._memory.record_tool_event(
            tool=tool,
            success=success,
            file=file_path,
            error=error,
            correction=correction,
            params=params,
        )

        return event

    def capture_decision(
        self,
        context: str,
        decision: str,
        confidence: float = 0.7,
        tags: Optional[List[str]] = None,
        source: str = "manual",
    ) -> PendingDecision:
        """
        Capture a decision for potential promotion.

        Args:
            context: The context where the decision was made
            decision: The decision itself
            confidence: Confidence level (0.0 to 1.0)
            tags: Optional tags for categorization
            source: How the decision was made (manual, auto, inferred)

        Returns:
            Captured PendingDecision
        """
        clamped_confidence = min(max(confidence, 0.0), 1.0)
        pending = PendingDecision(
            context=context,
            decision=decision,
            confidence=clamped_confidence,
            tags=tags or [],
            source=source,
            validated_count=0,
        )

        self._captured_decisions.append(pending)
        # Use individual parameters for MemoryManager
        self._memory.record_decision(
            context=context,
            decision=decision,
            confidence=clamped_confidence,
            tags=tags,
            source=source,
        )

        return pending

    def capture_blocker(
        self,
        symptom: str,
        severity: str = "medium",
        tags: Optional[List[str]] = None,
        phase: Optional[int] = None,
    ) -> ActiveBlocker:
        """
        Capture a blocker that occurred.

        Args:
            symptom: What went wrong
            severity: low, medium, high
            tags: Optional tags
            phase: Which phase the blocker occurred in

        Returns:
            Captured ActiveBlocker
        """
        blocker = ActiveBlocker(
            symptom=symptom,
            solution=None,
            severity=severity,
            tags=tags or [],
            phase=phase or 0,
            resolved=False,
        )

        self._captured_blockers.append(blocker)
        # Use individual parameters for MemoryManager
        self._memory.record_blocker(
            symptom=symptom,
            solution=None,
            severity=severity,
            tags=tags,
        )

        return blocker

    def resolve_blocker(
        self,
        symptom: str,
        solution: str,
    ) -> bool:
        """
        Mark a blocker as resolved with a solution.

        Args:
            symptom: The symptom to look for
            solution: How it was solved

        Returns:
            True if a blocker was resolved
        """
        return self._memory.resolve_blocker(symptom, solution)

    # =========================================================================
    # VALIDATION
    # =========================================================================

    def validate_decision(
        self,
        context: str,
        success: bool = True,
    ) -> bool:
        """
        Validate or invalidate a previous decision.

        Args:
            context: The decision context to look for
            success: Whether the decision worked

        Returns:
            True if a decision was found and updated
        """
        short_term = self._memory.load_short_term()
        if not short_term:
            return False

        for decision in short_term.decisions_pending:
            if context.lower() in decision.context.lower():
                if success:
                    decision.validated_count += 1
                    # Boost confidence on validation
                    decision.confidence = min(decision.confidence + 0.05, 1.0)
                else:
                    decision.validated_count = max(0, decision.validated_count - 1)
                    decision.confidence = max(decision.confidence - 0.1, 0.0)
                return True

        return False

    # =========================================================================
    # PROMOTION
    # =========================================================================

    def promote_learnings(self) -> LearningResult:
        """
        Promote validated learnings to long-term memory.

        Evaluates pending decisions and resolved blockers,
        promoting those that meet the thresholds.

        Returns:
            LearningResult with promotion statistics
        """
        result = LearningResult()

        # Use in-memory short_term if already loaded, otherwise load from disk
        short_term = self._memory._short_term or self._memory.load_short_term()
        long_term = self._memory._long_term or self._memory.load_long_term()

        if not short_term:
            result.errors.append("No short-term memory available")
            return result

        if not long_term:
            long_term = LongTermMemory()

        # Promote decisions
        decision_result = self._promote_decisions(short_term, long_term)
        result.decisions_promoted = decision_result[0]
        result.decisions_skipped = decision_result[1]

        # Promote blockers
        blocker_result = self._promote_blockers(short_term, long_term)
        result.blockers_promoted = blocker_result[0]
        result.blockers_skipped = blocker_result[1]

        # Update tool patterns
        result.tool_patterns_updated = self._update_tool_patterns(
            short_term, long_term
        )

        # Save updated long-term memory
        try:
            self._memory._long_term = long_term
            self._memory._save_long_term()
        except Exception as e:
            result.errors.append(f"Failed to save long-term memory: {e}")

        return result

    def _promote_decisions(
        self,
        short_term: ShortTermMemory,
        long_term: LongTermMemory,
    ) -> Tuple[int, int]:
        """Promote eligible decisions to long-term memory."""
        promoted = 0
        skipped = 0

        for pending in short_term.decisions_pending:
            if self._should_promote_decision(pending):
                lt_decision = self._convert_to_long_term_decision(pending)

                # Check for existing decision
                existing_idx = self._find_existing_decision(long_term, pending)
                if existing_idx is not None:
                    # Update existing
                    long_term.decisions[existing_idx].validated_count += 1
                    long_term.decisions[existing_idx].last_used = (
                        datetime.now(timezone.utc).strftime("%Y-%m-%d")
                    )
                else:
                    # Add new
                    long_term.decisions.append(lt_decision)

                promoted += 1
            else:
                skipped += 1

        return promoted, skipped

    def _should_promote_decision(self, decision: PendingDecision) -> bool:
        """Check if a decision should be promoted."""
        return (
            decision.confidence >= self._min_confidence
            and decision.validated_count >= self._min_validations
        )

    def _convert_to_long_term_decision(
        self,
        pending: PendingDecision,
    ) -> LongTermDecision:
        """Convert pending decision to long-term format."""
        return LongTermDecision(
            id=f"D{len(pending.context)}{pending.validated_count}",
            context=pending.context,
            decision=pending.decision,
            confidence=pending.confidence,
            validated_count=pending.validated_count,
            failed_count=0,
            last_used=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            tags=pending.tags,
        )

    def _find_existing_decision(
        self,
        long_term: LongTermMemory,
        pending: PendingDecision,
    ) -> Optional[int]:
        """Find existing decision in long-term memory by context similarity."""
        context_lower = pending.context.lower()

        for i, lt_decision in enumerate(long_term.decisions):
            if context_lower in lt_decision.context.lower():
                return i

        return None

    def _promote_blockers(
        self,
        short_term: ShortTermMemory,
        long_term: LongTermMemory,
    ) -> Tuple[int, int]:
        """Promote resolved blockers to long-term memory."""
        promoted = 0
        skipped = 0

        for blocker in short_term.blockers_active:
            if self._should_promote_blocker(blocker, long_term):
                lt_blocker = self._convert_to_long_term_blocker(blocker)

                # Check for existing blocker
                existing_idx = self._find_existing_blocker(long_term, blocker)
                if existing_idx is not None:
                    # Update existing
                    long_term.blockers[existing_idx].occurrences += 1
                    long_term.blockers[existing_idx].last_seen = (
                        datetime.now(timezone.utc).strftime("%Y-%m-%d")
                    )
                    if blocker.solution:
                        long_term.blockers[existing_idx].solution = blocker.solution
                else:
                    # Add new
                    long_term.blockers.append(lt_blocker)

                promoted += 1
            else:
                skipped += 1

        return promoted, skipped

    def _should_promote_blocker(
        self,
        blocker: ActiveBlocker,
        long_term: LongTermMemory,
    ) -> bool:
        """Check if a blocker should be promoted."""
        # Must be resolved
        if not blocker.resolved or not blocker.solution:
            return False

        # Check existing occurrences
        existing = self._find_existing_blocker(long_term, blocker)
        if existing is not None:
            total_occurrences = long_term.blockers[existing].occurrences + 1
            return total_occurrences >= self._min_occurrences

        # First occurrence, needs to happen again
        return False

    def _convert_to_long_term_blocker(
        self,
        blocker: ActiveBlocker,
    ) -> LongTermBlocker:
        """Convert active blocker to long-term format."""
        return LongTermBlocker(
            id=f"B{len(blocker.symptom)}",
            symptom=blocker.symptom,
            solution=blocker.solution or "",
            prevention=f"Check for: {blocker.symptom[:50]}",
            occurrences=1,
            last_seen=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            tags=blocker.tags,
        )

    def _find_existing_blocker(
        self,
        long_term: LongTermMemory,
        blocker: ActiveBlocker,
    ) -> Optional[int]:
        """Find existing blocker in long-term memory by symptom similarity."""
        symptom_lower = blocker.symptom.lower()

        for i, lt_blocker in enumerate(long_term.blockers):
            if symptom_lower in lt_blocker.symptom.lower():
                return i

        return None

    def _update_tool_patterns(
        self,
        short_term: ShortTermMemory,
        long_term: LongTermMemory,
    ) -> int:
        """Update tool usage patterns in long-term memory."""
        updated = 0

        for event in short_term.tool_events:
            tool = event.tool
            if tool not in long_term.tools:
                long_term.tools[tool] = ToolStats(success_count=0, fail_count=0)

            if event.success:
                long_term.tools[tool].success_count += 1
            else:
                long_term.tools[tool].fail_count += 1

            updated += 1

        return updated

    # =========================================================================
    # VELOCITY & METRICS
    # =========================================================================

    def calculate_velocity(
        self,
        phase: str,
        duration_min: float,
    ) -> Dict[str, Any]:
        """
        Calculate and update velocity metrics.

        Args:
            phase: Phase name (e.g., "execution", "review")
            duration_min: Duration in minutes

        Returns:
            Updated velocity data
        """
        long_term = self._memory.load_long_term()
        if not long_term:
            return {}

        # Update phase velocity
        if phase not in long_term.velocity.by_phase:
            long_term.velocity.by_phase[phase] = PhaseVelocity(
                avg_min=duration_min,
                samples=1,
            )
        else:
            stats = long_term.velocity.by_phase[phase]
            old_avg = stats.avg_min
            old_samples = stats.samples

            # Rolling average
            new_samples = min(old_samples + 1, DEFAULT_VELOCITY_SAMPLES)
            new_avg = ((old_avg * old_samples) + duration_min) / new_samples

            stats.avg_min = round(new_avg, 2)
            stats.samples = new_samples

        self._memory._long_term = long_term
        self._memory._save_long_term()

        velocity = long_term.velocity.by_phase.get(phase)
        return velocity.to_dict() if velocity else {}

    def record_workflow_completion(
        self,
        workflow_id: str,
        result: str,
        duration_min: float,
        domain: str,
        complexity: int,
    ) -> None:
        """
        Record a workflow completion in history.

        Args:
            workflow_id: Unique workflow identifier
            result: SUCCESS, PARTIAL, or FAILED
            duration_min: Total duration in minutes
            domain: Primary domain (backend, testing, etc.)
            complexity: Complexity score (1-10)
        """
        long_term = self._memory.load_long_term()
        if not long_term:
            return

        history_entry = WorkflowHistory(
            id=workflow_id,
            result=result,
            duration_min=duration_min,
            domain=domain,
            complexity=complexity,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

        # Add to history (keep last 100)
        long_term.history.append(history_entry)
        if len(long_term.history) > 100:
            long_term.history = long_term.history[-100:]

        # Update workflows completed count
        if result == "SUCCESS":
            long_term.workflows_completed += 1

        # Update complexity velocity
        complexity_key = self._get_complexity_key(complexity)
        if complexity_key not in long_term.velocity.by_complexity:
            long_term.velocity.by_complexity[complexity_key] = ComplexityVelocity(
                avg_min=duration_min,
                success_rate=1.0 if result == "SUCCESS" else 0.0,
                samples=1,
            )
        else:
            stats = long_term.velocity.by_complexity[complexity_key]
            old_samples = stats.samples
            new_samples = min(old_samples + 1, DEFAULT_VELOCITY_SAMPLES)

            # Update average duration
            old_avg = stats.avg_min
            new_avg = ((old_avg * old_samples) + duration_min) / new_samples
            stats.avg_min = round(new_avg, 2)

            # Update success rate
            old_rate = stats.success_rate
            success = 1.0 if result == "SUCCESS" else 0.0
            new_rate = ((old_rate * old_samples) + success) / new_samples
            stats.success_rate = round(new_rate, 2)

            stats.samples = new_samples

        self._memory._long_term = long_term
        self._memory._save_long_term()

    def _get_complexity_key(self, complexity: int) -> str:
        """Get complexity bucket key."""
        if complexity <= 3:
            return "low"
        elif complexity <= 6:
            return "medium"
        else:
            return "high"

    # =========================================================================
    # AGENT LEARNING
    # =========================================================================

    def update_agent_memory(
        self,
        domain_id: str,
        success: bool,
        decisions: Optional[List[PendingDecision]] = None,
        blockers: Optional[List[ActiveBlocker]] = None,
    ) -> bool:
        """
        Update agent memory with workflow learnings.

        Args:
            domain_id: The domain agent ID
            success: Whether the workflow succeeded
            decisions: Decisions to add to agent memory
            blockers: Blockers to add to agent memory

        Returns:
            True if update succeeded
        """
        agent_memory = self._memory.load_agent_memory(domain_id)
        if not agent_memory:
            return False

        # Update task count and success rate
        agent_memory.tasks_handled += 1
        old_rate = agent_memory.success_rate
        old_count = agent_memory.tasks_handled - 1

        if old_count > 0:
            total_successes = old_rate * old_count + (1.0 if success else 0.0)
            agent_memory.success_rate = total_successes / agent_memory.tasks_handled
        else:
            agent_memory.success_rate = 1.0 if success else 0.0

        agent_memory.success_rate = round(agent_memory.success_rate, 2)
        agent_memory.updated_at = datetime.now(timezone.utc).isoformat()

        # Add relevant decisions
        if decisions:
            for decision in decisions:
                if decision.confidence >= 0.7:
                    agent_decision = {
                        "id": f"AD{agent_memory.tasks_handled}",
                        "scenario": decision.context,
                        "decision": decision.decision,
                        "rationale": f"Validated {decision.validated_count} times",
                        "confidence": decision.confidence,
                    }
                    agent_memory.decisions.append(type(agent_memory.decisions[0])(**agent_decision) if agent_memory.decisions else agent_decision)

        # Add relevant blockers
        if blockers:
            for blocker in blockers:
                if blocker.resolved and blocker.solution:
                    agent_blocker = {
                        "id": f"AB{agent_memory.tasks_handled}",
                        "symptom": blocker.symptom,
                        "solution": blocker.solution,
                        "domain_context": f"Phase {blocker.phase}",
                    }
                    agent_memory.blockers.append(type(agent_memory.blockers[0])(**agent_blocker) if agent_memory.blockers else agent_blocker)

        return self._memory.save_agent_memory(domain_id, agent_memory)

    # =========================================================================
    # QUERIES
    # =========================================================================

    def get_relevant_decisions(
        self,
        context: str,
        limit: int = 5,
    ) -> List[LongTermDecision]:
        """
        Get relevant decisions for a given context.

        Args:
            context: The context to search for
            limit: Maximum number of decisions to return

        Returns:
            List of relevant decisions
        """
        long_term = self._memory.load_long_term()
        if not long_term:
            return []

        context_lower = context.lower()
        relevant = []

        for decision in long_term.decisions:
            # Check context match
            if any(
                word in decision.context.lower()
                for word in context_lower.split()
                if len(word) > 3
            ):
                relevant.append(decision)

        # Sort by confidence and validation count
        relevant.sort(
            key=lambda d: (d.confidence, d.validated_count),
            reverse=True,
        )

        return relevant[:limit]

    def get_relevant_blockers(
        self,
        symptom: str,
        limit: int = 3,
    ) -> List[LongTermBlocker]:
        """
        Get relevant blockers for a given symptom.

        Args:
            symptom: The symptom to search for
            limit: Maximum number of blockers to return

        Returns:
            List of relevant blockers
        """
        long_term = self._memory.load_long_term()
        if not long_term:
            return []

        symptom_lower = symptom.lower()
        relevant = []

        for blocker in long_term.blockers:
            if any(
                word in blocker.symptom.lower()
                for word in symptom_lower.split()
                if len(word) > 3
            ):
                relevant.append(blocker)

        # Sort by occurrences
        relevant.sort(key=lambda b: b.occurrences, reverse=True)

        return relevant[:limit]

    def get_tool_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get tool usage statistics."""
        long_term = self._memory.load_long_term()
        if not long_term:
            return {}

        stats = {}
        for tool, data in long_term.tools.items():
            # Support both ToolStats objects and dicts
            if hasattr(data, "success_count"):
                success = data.success_count
                fail = data.fail_count
            else:
                success = data.get("success_count", 0)
                fail = data.get("fail_count", 0)

            total = success + fail

            stats[tool] = {
                "success_count": success,
                "fail_count": fail,
                "total": total,
                "success_rate": round(success / total, 2) if total > 0 else 0.0,
            }

        return stats

    def get_velocity_stats(self) -> Dict[str, Any]:
        """Get velocity statistics."""
        long_term = self._memory.load_long_term()
        if not long_term:
            return {}

        return {
            "by_phase": long_term.velocity.by_phase,
            "by_complexity": long_term.velocity.by_complexity,
            "workflows_completed": long_term.workflows_completed,
        }


# =============================================================================
# FACTORY
# =============================================================================


def create_learning_engine(
    memory_manager: MemoryManager,
) -> LearningEngine:
    """
    Create a learning engine instance.

    Args:
        memory_manager: The memory manager to use

    Returns:
        Configured LearningEngine
    """
    return LearningEngine(memory_manager)
