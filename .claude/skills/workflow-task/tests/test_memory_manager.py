"""
Tests for MemoryManager v2.0

Tests the 3-tier memory system:
- TIER 1: ShortTermMemory (session)
- TIER 2: LongTermMemory (project)
- TIER 3: AgentMemory (per domain)
"""

import json
from pathlib import Path

import pytest

# Add parent to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

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
    PhaseTiming,
    ToolStats,
    PhaseVelocity,
    ComplexityVelocity,
    ContextSnapshot,
    AgentContext,
    AgentDecision,
    AgentBlocker,
    KeywordConfig,
)
from core.memory_manager import MemoryManager, create_memory_manager


# =============================================================================
# TIER 1: SHORT-TERM MEMORY TESTS
# =============================================================================

class TestToolEvent:
    """Tests for ToolEvent dataclass."""

    def test_create_tool_event(self, sample_tool_event):
        """Test creating a ToolEvent."""
        event = ToolEvent(**sample_tool_event)
        assert event.tool == "Edit"
        assert event.success is True
        assert event.file == "app/service.py"

    def test_tool_event_to_dict(self, sample_tool_event):
        """Test converting ToolEvent to dict."""
        event = ToolEvent(**sample_tool_event)
        data = event.to_dict()
        assert data["tool"] == "Edit"
        assert data["success"] is True
        assert "params" in data

    def test_tool_event_from_dict(self, sample_tool_event):
        """Test creating ToolEvent from dict."""
        event = ToolEvent.from_dict(sample_tool_event)
        assert event.tool == "Edit"
        assert event.success is True

    def test_tool_event_minimal(self):
        """Test ToolEvent with minimal fields."""
        event = ToolEvent(
            timestamp="2025-12-28T10:00:00Z",
            tool="Read",
            success=True,
        )
        data = event.to_dict()
        assert "error" not in data
        assert "correction" not in data


class TestPendingDecision:
    """Tests for PendingDecision dataclass."""

    def test_create_pending_decision(self, sample_decision):
        """Test creating a PendingDecision."""
        decision = PendingDecision(**sample_decision)
        assert decision.context == "Rate limiting strategy"
        assert decision.confidence == 0.85

    def test_decision_to_dict(self, sample_decision):
        """Test converting decision to dict."""
        decision = PendingDecision(**sample_decision)
        data = decision.to_dict()
        assert "tags" in data
        assert len(data["tags"]) == 3

    def test_decision_from_dict(self, sample_decision):
        """Test creating decision from dict."""
        decision = PendingDecision.from_dict(sample_decision)
        assert decision.source == "manual"


class TestActiveBlocker:
    """Tests for ActiveBlocker dataclass."""

    def test_create_blocker(self, sample_blocker):
        """Test creating an ActiveBlocker."""
        blocker = ActiveBlocker(**sample_blocker)
        assert blocker.symptom == "AsyncMock not awaitable"
        assert blocker.resolved is True

    def test_blocker_to_dict(self, sample_blocker):
        """Test converting blocker to dict."""
        blocker = ActiveBlocker(**sample_blocker)
        data = blocker.to_dict()
        assert data["severity"] == "medium"

    def test_blocker_from_dict(self, sample_blocker):
        """Test creating blocker from dict."""
        blocker = ActiveBlocker.from_dict(sample_blocker)
        assert blocker.phase == 2


class TestShortTermMemory:
    """Tests for ShortTermMemory dataclass."""

    def test_create_short_term(self, sample_short_term_data):
        """Test creating ShortTermMemory."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        assert memory.workflow_id == "2025-12-28_issue-64"
        assert memory.current_phase == 2

    def test_short_term_to_dict(self, sample_short_term_data):
        """Test converting short-term to dict."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        data = memory.to_dict()
        assert data["$schema"] == "2.0"
        assert data["complexity_score"] == 7

    def test_add_tool_event(self, sample_short_term_data, sample_tool_event):
        """Test adding tool events."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        event = ToolEvent.from_dict(sample_tool_event)
        memory.add_tool_event(event)
        assert len(memory.tool_events) == 1

    def test_tool_event_fifo(self, sample_short_term_data):
        """Test FIFO behavior for tool events."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        memory.MAX_TOOL_EVENTS = 3  # Override for test

        for i in range(5):
            event = ToolEvent(
                timestamp=f"2025-12-28T10:0{i}:00Z",
                tool=f"Tool{i}",
                success=True,
            )
            memory.add_tool_event(event)

        assert len(memory.tool_events) == 3
        assert memory.tool_events[0].tool == "Tool2"
        assert memory.tool_events[2].tool == "Tool4"

    def test_add_decision(self, sample_short_term_data, sample_decision):
        """Test adding decisions."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        decision = PendingDecision.from_dict(sample_decision)
        memory.add_decision(decision)
        assert len(memory.decisions_pending) == 1

    def test_add_blocker(self, sample_short_term_data, sample_blocker):
        """Test adding blockers."""
        memory = ShortTermMemory.from_dict(sample_short_term_data)
        blocker = ActiveBlocker.from_dict(sample_blocker)
        memory.add_blocker(blocker)
        assert len(memory.blockers_active) == 1


# =============================================================================
# TIER 2: LONG-TERM MEMORY TESTS
# =============================================================================

class TestValidatedDecision:
    """Tests for ValidatedDecision dataclass."""

    def test_create_validated_decision(self):
        """Test creating ValidatedDecision."""
        decision = ValidatedDecision(
            id="D001",
            context="Rate limiting",
            decision="Use Redis",
            confidence=0.9,
            validated_count=3,
        )
        assert decision.failed_count == 0
        assert decision.confidence == 0.9

    def test_validated_decision_to_dict(self):
        """Test converting to dict."""
        decision = ValidatedDecision(
            id="D001",
            context="Test",
            decision="Solution",
            confidence=0.85,
            validated_count=2,
            tags=["test"],
        )
        data = decision.to_dict()
        assert data["id"] == "D001"
        assert data["tags"] == ["test"]


class TestSolvedBlocker:
    """Tests for SolvedBlocker dataclass."""

    def test_create_solved_blocker(self):
        """Test creating SolvedBlocker."""
        blocker = SolvedBlocker(
            id="B001",
            symptom="Timeout",
            solution="Use async",
            occurrences=3,
        )
        assert blocker.occurrences == 3

    def test_solved_blocker_to_dict(self):
        """Test converting to dict."""
        blocker = SolvedBlocker(
            id="B001",
            symptom="Error",
            solution="Fix",
            prevention="Check first",
        )
        data = blocker.to_dict()
        assert data["prevention"] == "Check first"


class TestToolStats:
    """Tests for ToolStats dataclass."""

    def test_success_rate_calculation(self):
        """Test success rate calculation."""
        stats = ToolStats(success_count=90, fail_count=10)
        assert stats.success_rate == 0.9

    def test_success_rate_zero_total(self):
        """Test success rate with zero uses."""
        stats = ToolStats()
        assert stats.success_rate == 1.0


class TestLongTermMemory:
    """Tests for LongTermMemory dataclass."""

    def test_create_long_term(self, sample_long_term_data):
        """Test creating LongTermMemory."""
        memory = LongTermMemory.from_dict(sample_long_term_data)
        assert memory.workflows_completed == 5
        assert len(memory.decisions) == 1

    def test_long_term_to_dict(self, sample_long_term_data):
        """Test converting to dict."""
        memory = LongTermMemory.from_dict(sample_long_term_data)
        data = memory.to_dict()
        assert data["version"] == "2.0"
        assert len(data["history"]) == 1

    def test_add_decision(self, sample_long_term_data):
        """Test adding decisions."""
        memory = LongTermMemory.from_dict(sample_long_term_data)
        decision = ValidatedDecision(
            id="D002",
            context="New",
            decision="Solution",
            confidence=0.85,
            validated_count=2,
        )
        memory.add_decision(decision)
        assert len(memory.decisions) == 2

    def test_decision_fifo(self):
        """Test FIFO for decisions."""
        memory = LongTermMemory()
        memory.MAX_DECISIONS = 3

        for i in range(5):
            decision = ValidatedDecision(
                id=f"D{i:03d}",
                context=f"Context {i}",
                decision=f"Decision {i}",
                confidence=0.9,
                validated_count=2,
            )
            memory.add_decision(decision)

        assert len(memory.decisions) == 3
        assert memory.decisions[0].id == "D002"

    def test_add_history(self, sample_long_term_data):
        """Test adding history entries."""
        memory = LongTermMemory.from_dict(sample_long_term_data)
        entry = WorkflowHistoryEntry(
            id="new-workflow",
            result="SUCCESS",
            duration_min=30.0,
        )
        memory.add_history(entry)
        assert len(memory.history) == 2


# =============================================================================
# TIER 3: AGENT MEMORY TESTS
# =============================================================================

class TestAgentMemory:
    """Tests for AgentMemory dataclass."""

    def test_create_agent_memory(self, sample_agent_memory_data):
        """Test creating AgentMemory."""
        memory = AgentMemory.from_dict(sample_agent_memory_data)
        assert memory.domain_id == "api"
        assert memory.tasks_handled == 8

    def test_agent_memory_to_dict(self, sample_agent_memory_data):
        """Test converting to dict."""
        memory = AgentMemory.from_dict(sample_agent_memory_data)
        data = memory.to_dict()
        assert len(data["keywords"]["primary"]) == 3
        assert len(data["decisions"]) == 1

    def test_update_stats_success(self, sample_agent_memory_data):
        """Test updating stats on success."""
        memory = AgentMemory.from_dict(sample_agent_memory_data)
        initial_rate = memory.success_rate
        memory.update_stats(success=True)
        assert memory.tasks_handled == 9
        # Success rate should increase or stay same
        assert memory.success_rate >= initial_rate * 0.9

    def test_update_stats_failure(self, sample_agent_memory_data):
        """Test updating stats on failure."""
        memory = AgentMemory.from_dict(sample_agent_memory_data)
        memory.update_stats(success=False)
        assert memory.tasks_handled == 9
        # Success rate should decrease
        assert memory.success_rate < 0.92


# =============================================================================
# MEMORY MANAGER TESTS
# =============================================================================

class TestMemoryManager:
    """Tests for MemoryManager."""

    def test_create_manager(self, temp_project_root):
        """Test creating MemoryManager."""
        manager = MemoryManager(temp_project_root)
        assert manager.project_root == temp_project_root

    def test_create_manager_factory(self, temp_project_root):
        """Test factory function."""
        manager = create_memory_manager(temp_project_root)
        assert isinstance(manager, MemoryManager)

    def test_start_session(self, temp_project_root):
        """Test starting a session."""
        manager = MemoryManager(temp_project_root)
        short_term = manager.start_session(
            workflow_id="test-workflow",
            task_description="Test task",
            complexity_score=5,
        )
        assert short_term.workflow_id == "test-workflow"
        assert short_term.complexity_score == 5
        assert manager.short_term is not None

    def test_start_session_persists(self, temp_project_root):
        """Test that start_session persists to disk."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        # Verify file exists
        assert manager.short_term_path.exists()

        # Verify content
        with open(manager.short_term_path) as f:
            data = json.load(f)
        assert data["workflow_id"] == "test"

    def test_load_short_term(self, temp_project_root):
        """Test loading short-term memory."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        # Create new manager and load
        manager2 = MemoryManager(temp_project_root)
        loaded = manager2.load_short_term()

        assert loaded is not None
        assert loaded.workflow_id == "test"

    def test_purge_short_term(self, temp_project_root):
        """Test purging short-term memory."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)
        manager.purge_short_term()

        assert not manager.short_term_path.exists()
        assert manager.short_term is None

    def test_record_tool_event(self, temp_project_root):
        """Test recording tool events."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        manager.record_tool_event(
            tool="Edit",
            success=True,
            file="test.py",
        )

        assert len(manager.short_term.tool_events) == 1
        assert manager.short_term.tool_events[0].tool == "Edit"

    def test_record_decision(self, temp_project_root):
        """Test recording decisions."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        manager.record_decision(
            context="Test context",
            decision="Test decision",
            confidence=0.9,
            tags=["test"],
        )

        assert len(manager.short_term.decisions_pending) == 1
        assert manager.short_term.decisions_pending[0].confidence == 0.9

    def test_record_blocker(self, temp_project_root):
        """Test recording blockers."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        manager.record_blocker(
            symptom="Test symptom",
            solution="Test solution",
            severity="high",
        )

        assert len(manager.short_term.blockers_active) == 1
        assert manager.short_term.blockers_active[0].severity == "high"

    def test_start_phase(self, temp_project_root):
        """Test starting a phase."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        manager.start_phase(2)

        assert manager.short_term.current_phase == 2
        assert manager.short_term.phase_status == "IN_PROGRESS"
        assert 2 in manager.short_term.phase_timings

    def test_complete_phase(self, temp_project_root):
        """Test completing a phase."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)
        manager.start_phase(2)

        duration = manager.complete_phase(2)

        assert duration >= 0
        assert manager.short_term.phase_status == "COMPLETED"
        assert manager.short_term.phase_timings[2].end is not None

    def test_load_long_term_creates_if_missing(self, temp_project_root):
        """Test that load_long_term creates file if missing."""
        manager = MemoryManager(temp_project_root)
        long_term = manager.load_long_term()

        assert long_term is not None
        assert long_term.version == "2.0"
        assert manager.long_term_path.exists()

    def test_load_agent_memory(self, temp_project_root):
        """Test loading agent memory."""
        manager = MemoryManager(temp_project_root)
        agent = manager.load_agent_memory("backend")

        assert agent.domain_id == "backend"
        assert agent.display_name == "Backend Expert"

    def test_set_active_domain(self, temp_project_root):
        """Test setting active domain."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 3)

        manager.set_active_domain("api")

        assert manager.short_term.active_domain == "api"
        assert "api" in manager._agent_memories

    def test_consolidate_workflow(self, temp_project_root):
        """Test workflow consolidation."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test-consolidate", "Test consolidation", 5)
        manager.set_active_domain("backend")

        # Record some events
        manager.record_tool_event("Edit", success=True)
        manager.record_decision(
            context="Test",
            decision="Solution",
            confidence=0.9,
            tags=["backend"],
        )

        # Complete phases
        manager.start_phase(0)
        manager.complete_phase(0)
        manager.start_phase(2)
        manager.complete_phase(2)

        # Consolidate
        summary = manager.consolidate_workflow(success_rate=1.0)

        assert "workflow_id" in summary
        assert summary["total_tool_events"] == 1
        assert manager.short_term is None  # Purged

    def test_consolidate_updates_long_term(self, temp_project_root):
        """Test that consolidation updates long-term memory."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test", 5)

        manager.record_tool_event("Edit", success=True)
        manager.start_phase(2)
        manager.complete_phase(2)

        manager.consolidate_workflow(success_rate=1.0)

        # Load long-term and verify
        manager2 = MemoryManager(temp_project_root)
        long_term = manager2.load_long_term()

        assert long_term.workflows_completed == 1
        assert len(long_term.history) == 1
        assert "Edit" in long_term.tools

    def test_get_context(self, temp_project_root):
        """Test getting combined context."""
        manager = MemoryManager(temp_project_root)
        manager.start_session("test", "Test context", 5)
        manager.set_active_domain("api")
        manager.load_long_term()

        context = manager.get_context(phase_id=2)

        assert context["phase"] == 2
        assert context["phase_name"] == "execution"
        assert context["workflow_id"] == "test"
        assert context["active_domain"] == "api"


class TestMemoryManagerFileIO:
    """Tests for MemoryManager file I/O operations."""

    def test_atomic_write_json(self, temp_project_root):
        """Test atomic JSON writing."""
        manager = MemoryManager(temp_project_root)
        test_path = manager.skill_root / "test.json"

        manager._atomic_write_json(test_path, {"key": "value"})

        assert test_path.exists()
        with open(test_path) as f:
            data = json.load(f)
        assert data["key"] == "value"

    def test_atomic_write_yaml(self, temp_project_root):
        """Test atomic YAML writing."""
        manager = MemoryManager(temp_project_root)
        test_path = manager.skill_root / "test.yaml"

        manager._atomic_write_yaml(test_path, {"key": "value"})

        assert test_path.exists()

    def test_read_yaml(self, temp_project_root):
        """Test reading YAML files."""
        manager = MemoryManager(temp_project_root)
        test_path = manager.skill_root / "test.yaml"

        # Write test file
        test_path.write_text("key: value\nnumber: 42\n")

        data = manager._read_yaml(test_path)

        assert data["key"] == "value"
        assert data["number"] == 42


class TestPromotionRules:
    """Tests for promotion rules between memory tiers."""

    def test_should_promote_decision_true(self, temp_project_root):
        """Test decision promotion criteria - should promote."""
        manager = MemoryManager(temp_project_root)
        decision = PendingDecision(
            context="Test",
            decision="Solution",
            confidence=0.85,
            validated_count=3,
        )

        assert manager._should_promote_decision(decision) is True

    def test_should_promote_decision_low_confidence(self, temp_project_root):
        """Test decision promotion criteria - low confidence."""
        manager = MemoryManager(temp_project_root)
        decision = PendingDecision(
            context="Test",
            decision="Solution",
            confidence=0.5,  # Below threshold
            validated_count=3,
        )

        assert manager._should_promote_decision(decision) is False

    def test_should_promote_decision_low_validation(self, temp_project_root):
        """Test decision promotion criteria - low validation count."""
        manager = MemoryManager(temp_project_root)
        decision = PendingDecision(
            context="Test",
            decision="Solution",
            confidence=0.9,
            validated_count=1,  # Below threshold
        )

        assert manager._should_promote_decision(decision) is False

    def test_should_promote_blocker_resolved(self, temp_project_root):
        """Test blocker promotion criteria - resolved."""
        manager = MemoryManager(temp_project_root)
        blocker = ActiveBlocker(
            symptom="Error",
            solution="Fix",
            resolved=True,
        )

        assert manager._should_promote_blocker(blocker) is True

    def test_should_promote_blocker_unresolved(self, temp_project_root):
        """Test blocker promotion criteria - unresolved."""
        manager = MemoryManager(temp_project_root)
        blocker = ActiveBlocker(
            symptom="Error",
            resolved=False,
        )

        assert manager._should_promote_blocker(blocker) is False

    def test_is_domain_relevant_true(self, temp_project_root):
        """Test domain relevance check - true."""
        manager = MemoryManager(temp_project_root)
        # Tags must contain domain keywords, not just the domain name
        tags_api = ["rest", "endpoint"]  # Keywords for "api" domain
        tags_backend = ["fastapi", "async"]  # Keywords for "backend" domain

        assert manager._is_domain_relevant(tags_api, "api") is True
        assert manager._is_domain_relevant(tags_backend, "backend") is True

    def test_is_domain_relevant_false(self, temp_project_root):
        """Test domain relevance check - false."""
        manager = MemoryManager(temp_project_root)
        tags = ["frontend", "react"]

        assert manager._is_domain_relevant(tags, "database") is False

    def test_is_domain_relevant_empty(self, temp_project_root):
        """Test domain relevance check - empty tags."""
        manager = MemoryManager(temp_project_root)

        assert manager._is_domain_relevant([], "api") is False
