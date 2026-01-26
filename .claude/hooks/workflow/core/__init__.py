"""
Core package for workflow hooks.

Exports the MemoryManager for managing the 3-tier memory system.
"""

from .memory_manager import MemoryManager, create_memory_manager

__all__ = [
    "MemoryManager",
    "create_memory_manager",
]
