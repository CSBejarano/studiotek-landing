"""
Models package for workflow-task v2.0

Exports all dataclasses for the 3-tier memory system.
"""

__version__ = "2.0.0"

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

from .workflow_state import (
    WorkflowStatus,
    PhaseStatus,
    PhaseInfo,
    WorkflowResult,
    WorkflowState,
)

from .agent_state import (
    AgentDomain,
    AgentProfile,
    AgentMatch,
    AgentContext,
    DomainExpert,
    DEFAULT_AGENT_PROFILES,
)

from .ralph_state import (
    RalphLoopState,
    RalphFailureEntry,
)

__all__ = [
    # Version
    "__version__",
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
    # Workflow state
    "WorkflowStatus",
    "PhaseStatus",
    "PhaseInfo",
    "WorkflowResult",
    "WorkflowState",
    # Agent state
    "AgentDomain",
    "AgentProfile",
    "AgentMatch",
    "AgentContext",
    "DomainExpert",
    "DEFAULT_AGENT_PROFILES",
    # Ralph Wiggum loop
    "RalphLoopState",
    "RalphFailureEntry",
]
