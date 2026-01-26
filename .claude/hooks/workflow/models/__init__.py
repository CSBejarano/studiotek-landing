"""
Models package for workflow hooks.

Exports dataclasses for the 3-tier memory system.
"""

from .memory_state import (
    # TIER 1: Short-term memory (session)
    ShortTermMemory,
    ToolEvent,
    PendingDecision,
    ActiveBlocker,
    PhaseTiming,
    ContextSnapshot,
    # TIER 2: Long-term memory (project)
    LongTermMemory,
    ValidatedDecision,
    SolvedBlocker,
    VelocityStats,
    PhaseVelocity,
    ComplexityVelocity,
    ToolStats,
    WorkflowHistoryEntry,
    # TIER 3: Agent memory
    AgentMemory,
    AgentDecision,
    AgentBlocker,
    AgentContext,
    KeywordConfig,
)

from .ralph_state import (
    RalphLoopState,
    RalphFailureEntry,
)

from .workflow_state import (
    WorkflowStatus,
    WorkflowPhase,
    WorkflowCompletion,
    Checkpoint,
    PhaseStatus,
    FinalStatus,
)

__all__ = [
    # TIER 1
    "ShortTermMemory",
    "ToolEvent",
    "PendingDecision",
    "ActiveBlocker",
    "PhaseTiming",
    "ContextSnapshot",
    # TIER 2
    "LongTermMemory",
    "ValidatedDecision",
    "SolvedBlocker",
    "VelocityStats",
    "PhaseVelocity",
    "ComplexityVelocity",
    "ToolStats",
    "WorkflowHistoryEntry",
    # TIER 3
    "AgentMemory",
    "AgentDecision",
    "AgentBlocker",
    "AgentContext",
    "KeywordConfig",
    # Ralph (legacy)
    "RalphLoopState",
    "RalphFailureEntry",
    # Workflow (v2.0)
    "WorkflowStatus",
    "WorkflowPhase",
    "WorkflowCompletion",
    "Checkpoint",
    "PhaseStatus",
    "FinalStatus",
]
