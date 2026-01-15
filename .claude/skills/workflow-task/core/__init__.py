"""
Core package for workflow-task v2.0

Exports all core functionality.
"""

__version__ = "2.0.0"

from .memory_manager import MemoryManager, create_memory_manager
from .workflow_engine import WorkflowEngine, WorkflowPhase, PhaseResult, run_workflow
from .agent_registry import AgentRegistry, create_agent_registry
from .learning_engine import LearningEngine, LearningResult, create_learning_engine

__all__ = [
    "__version__",
    # Memory
    "MemoryManager",
    "create_memory_manager",
    # Workflow
    "WorkflowEngine",
    "WorkflowPhase",
    "PhaseResult",
    "run_workflow",
    # Agents
    "AgentRegistry",
    "create_agent_registry",
    # Learning
    "LearningEngine",
    "LearningResult",
    "create_learning_engine",
]
