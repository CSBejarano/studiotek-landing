"""
Tests for workflow-task v2.0 LearningEngine.

Tests pattern capture, promotion, and learning across memory tiers.
"""

import pytest
from pathlib import Path
import sys

# Add paths for imports
SKILL_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SKILL_ROOT))


# =============================================================================
# LearningResult Tests
# =============================================================================


class TestLearningResult:
    """Tests for LearningResult dataclass."""

    def test_result_creation(self) -> None:
        """Test basic result creation."""
        from core.learning_engine import LearningResult

        result = LearningResult()

        assert result.decisions_promoted == 0
        assert result.blockers_promoted == 0
        assert result.total_promoted == 0

    def test_result_total_promoted(self) -> None:
        """Test total promoted calculation."""
        from core.learning_engine import LearningResult

        result = LearningResult(
            decisions_promoted=3,
            blockers_promoted=2,
        )

        assert result.total_promoted == 5

    def test_result_has_errors(self) -> None:
        """Test error detection."""
        from core.learning_engine import LearningResult

        result = LearningResult()
        assert result.has_errors is False

        result.errors.append("Test error")
        assert result.has_errors is True

    def test_result_to_dict(self) -> None:
        """Test result serialization."""
        from core.learning_engine import LearningResult

        result = LearningResult(
            decisions_promoted=2,
            decisions_skipped=1,
            blockers_promoted=1,
            tool_patterns_updated=5,
        )
        data = result.to_dict()

        assert data["decisions_promoted"] == 2
        assert data["blockers_promoted"] == 1
        assert data["total_promoted"] == 3


# =============================================================================
# Capture Tests
# =============================================================================


class TestLearningEngineCapture:
    """Tests for LearningEngine capture methods."""

    def test_capture_tool_event(self, workflow_skill_root: Path) -> None:
        """Test capturing a tool event."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        event = engine.capture_tool_event(
            tool="Edit",
            success=True,
            file_path="app/service.py",
        )

        assert event.tool == "Edit"
        assert event.success is True
        assert event.file == "app/service.py"

    def test_capture_tool_event_with_error(self, workflow_skill_root: Path) -> None:
        """Test capturing a failed tool event."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        event = engine.capture_tool_event(
            tool="Bash",
            success=False,
            error="Command not found",
            correction="Install missing package",
        )

        assert event.success is False
        assert event.error == "Command not found"
        assert event.correction == "Install missing package"

    def test_capture_decision(self, workflow_skill_root: Path) -> None:
        """Test capturing a decision."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        decision = engine.capture_decision(
            context="Rate limiting approach",
            decision="Use Redis sliding window",
            confidence=0.85,
            tags=["api", "redis"],
        )

        assert decision.context == "Rate limiting approach"
        assert decision.decision == "Use Redis sliding window"
        assert decision.confidence == 0.85
        assert "redis" in decision.tags

    def test_capture_decision_clamps_confidence(self, workflow_skill_root: Path) -> None:
        """Test that confidence is clamped to 0-1."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        decision1 = engine.capture_decision(
            context="Test",
            decision="Test",
            confidence=1.5,
        )
        assert decision1.confidence == 1.0

        decision2 = engine.capture_decision(
            context="Test2",
            decision="Test2",
            confidence=-0.5,
        )
        assert decision2.confidence == 0.0

    def test_capture_blocker(self, workflow_skill_root: Path) -> None:
        """Test capturing a blocker."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        blocker = engine.capture_blocker(
            symptom="Import error in module",
            severity="high",
            tags=["python", "import"],
            phase=2,
        )

        assert blocker.symptom == "Import error in module"
        assert blocker.severity == "high"
        assert blocker.resolved is False

    def test_resolve_blocker(self, workflow_skill_root: Path) -> None:
        """Test resolving a captured blocker."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        engine.capture_blocker(symptom="Missing dependency", severity="medium")
        resolved = engine.resolve_blocker(
            symptom="Missing dependency",
            solution="pip install package",
        )

        assert resolved is True


# =============================================================================
# Validation Tests
# =============================================================================


class TestLearningEngineValidation:
    """Tests for decision validation."""

    def test_validate_decision_success(self, workflow_skill_root: Path) -> None:
        """Test validating a decision successfully."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        engine.capture_decision(
            context="Authentication approach",
            decision="Use JWT",
            confidence=0.7,
        )

        validated = engine.validate_decision("Authentication approach", success=True)
        assert validated is True

    def test_validate_decision_failure(self, workflow_skill_root: Path) -> None:
        """Test validating a decision as failure."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        engine.capture_decision(
            context="Caching strategy",
            decision="Use Redis",
            confidence=0.8,
        )

        validated = engine.validate_decision("Caching strategy", success=False)
        assert validated is True

    def test_validate_nonexistent_decision(self, workflow_skill_root: Path) -> None:
        """Test validating a non-existent decision."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        validated = engine.validate_decision("Unknown context", success=True)
        assert validated is False


# =============================================================================
# Promotion Tests
# =============================================================================


class TestLearningEnginePromotion:
    """Tests for learning promotion."""

    def test_promote_learnings_empty(self, workflow_skill_root: Path) -> None:
        """Test promotion with no learnings."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")
        engine = LearningEngine(manager)

        result = engine.promote_learnings()

        assert result.decisions_promoted == 0
        assert result.blockers_promoted == 0

    def test_promote_decision_meets_threshold(self, workflow_skill_root: Path) -> None:
        """Test promoting a decision that meets thresholds."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import PendingDecision

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")

        # Add decision with high confidence and validations
        short_term = manager.load_short_term()
        short_term.decisions_pending.append(
            PendingDecision(
                context="Test decision",
                decision="Do X",
                confidence=0.9,
                validated_count=3,
                tags=["test"],
                source="manual",
            )
        )

        engine = LearningEngine(manager)
        result = engine.promote_learnings()

        assert result.decisions_promoted == 1

    def test_promote_decision_below_threshold(self, workflow_skill_root: Path) -> None:
        """Test that low-confidence decisions are not promoted."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import PendingDecision

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")

        short_term = manager.load_short_term()
        short_term.decisions_pending.append(
            PendingDecision(
                context="Low confidence decision",
                decision="Maybe do Y",
                confidence=0.5,  # Below threshold
                validated_count=1,  # Below threshold
                tags=[],
                source="manual",
            )
        )

        engine = LearningEngine(manager)
        result = engine.promote_learnings()

        assert result.decisions_promoted == 0
        assert result.decisions_skipped == 1

    def test_promote_blocker_meets_threshold(self, workflow_skill_root: Path) -> None:
        """Test promoting a blocker after multiple occurrences."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import ActiveBlocker, SolvedBlocker

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")

        # Add existing blocker to long-term (simulating previous occurrence)
        long_term = manager.load_long_term()
        long_term.blockers.append(
            SolvedBlocker(
                id="B1",
                symptom="Repeated blocker",
                solution="Previous solution",
                prevention="Check first",
                occurrences=1,
                last_seen="2025-12-28",
                tags=[],
            )
        )
        manager._long_term = long_term
        manager._save_long_term()

        # Add resolved blocker to short-term
        short_term = manager.load_short_term()
        short_term.blockers_active.append(
            ActiveBlocker(
                symptom="Repeated blocker",
                solution="Updated solution",
                severity="medium",
                tags=[],
                phase=1,
                resolved=True,
            )
        )

        engine = LearningEngine(manager)
        result = engine.promote_learnings()

        assert result.blockers_promoted == 1

    def test_promote_updates_tool_patterns(self, workflow_skill_root: Path) -> None:
        """Test that tool patterns are updated during promotion."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import ToolEvent

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("test-001", "Test task")

        short_term = manager.load_short_term()
        short_term.tool_events.extend([
            ToolEvent(
                timestamp="2025-12-28T10:00:00+00:00",
                tool="Edit",
                success=True,
                file="test.py",
            ),
            ToolEvent(
                timestamp="2025-12-28T10:01:00+00:00",
                tool="Edit",
                success=True,
                file="test2.py",
            ),
            ToolEvent(
                timestamp="2025-12-28T10:02:00+00:00",
                tool="Read",
                success=False,
                error="File not found",
            ),
        ])

        engine = LearningEngine(manager)
        result = engine.promote_learnings()

        assert result.tool_patterns_updated == 3


# =============================================================================
# Velocity Tests
# =============================================================================


class TestLearningEngineVelocity:
    """Tests for velocity calculations."""

    def test_calculate_velocity_new_phase(self, workflow_skill_root: Path) -> None:
        """Test calculating velocity for a new phase."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        engine = LearningEngine(manager)

        velocity = engine.calculate_velocity("execution", 25.0)

        assert velocity["avg_min"] == 25.0
        assert velocity["samples"] == 1

    def test_calculate_velocity_rolling_average(self, workflow_skill_root: Path) -> None:
        """Test velocity rolling average calculation."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        engine = LearningEngine(manager)

        # First sample
        engine.calculate_velocity("review", 30.0)

        # Second sample
        velocity = engine.calculate_velocity("review", 20.0)

        assert velocity["avg_min"] == 25.0  # (30 + 20) / 2
        assert velocity["samples"] == 2

    def test_record_workflow_completion_success(self, workflow_skill_root: Path) -> None:
        """Test recording a successful workflow completion."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        engine = LearningEngine(manager)

        engine.record_workflow_completion(
            workflow_id="2025-12-28_test",
            result="SUCCESS",
            duration_min=45.0,
            domain="backend",
            complexity=5,
        )

        long_term = manager.load_long_term()
        assert long_term.workflows_completed == 1
        assert len(long_term.history) == 1
        assert long_term.history[0].result == "SUCCESS"

    def test_record_workflow_completion_updates_complexity_stats(
        self, workflow_skill_root: Path
    ) -> None:
        """Test that workflow completion updates complexity stats."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        engine = LearningEngine(manager)

        engine.record_workflow_completion(
            workflow_id="2025-12-28_test",
            result="SUCCESS",
            duration_min=60.0,
            domain="testing",
            complexity=7,  # High complexity
        )

        long_term = manager.load_long_term()
        assert "high" in long_term.velocity.by_complexity
        assert long_term.velocity.by_complexity["high"].success_rate == 1.0


# =============================================================================
# Query Tests
# =============================================================================


class TestLearningEngineQueries:
    """Tests for learning engine queries."""

    def test_get_relevant_decisions(self, workflow_skill_root: Path) -> None:
        """Test getting relevant decisions."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import ValidatedDecision

        manager = MemoryManager(workflow_skill_root)

        # Add some decisions to long-term memory
        long_term = manager.load_long_term()
        long_term.decisions.extend([
            ValidatedDecision(
                id="D1",
                context="API rate limiting implementation",
                decision="Use Redis sliding window",
                confidence=0.9,
                validated_count=5,
                failed_count=0,
                last_used="2025-12-28",
                tags=["api"],
            ),
            ValidatedDecision(
                id="D2",
                context="Database connection pooling",
                decision="Use asyncpg pool",
                confidence=0.85,
                validated_count=3,
                failed_count=0,
                last_used="2025-12-27",
                tags=["database"],
            ),
        ])
        manager._long_term = long_term
        manager._save_long_term()

        engine = LearningEngine(manager)
        decisions = engine.get_relevant_decisions("rate limiting for API")

        assert len(decisions) >= 1
        assert any("rate" in d.context.lower() for d in decisions)

    def test_get_relevant_blockers(self, workflow_skill_root: Path) -> None:
        """Test getting relevant blockers."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine
        from models.memory_state import SolvedBlocker

        manager = MemoryManager(workflow_skill_root)

        long_term = manager.load_long_term()
        long_term.blockers.extend([
            SolvedBlocker(
                id="B1",
                symptom="Import error with circular dependency",
                solution="Use TYPE_CHECKING for type hints",
                prevention="Avoid circular imports",
                occurrences=3,
                last_seen="2025-12-28",
                tags=["python"],
            ),
        ])
        manager._long_term = long_term
        manager._save_long_term()

        engine = LearningEngine(manager)
        blockers = engine.get_relevant_blockers("circular import error")

        assert len(blockers) >= 1
        assert "circular" in blockers[0].symptom.lower()

    def test_get_tool_stats(self, workflow_skill_root: Path) -> None:
        """Test getting tool usage statistics."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)

        from models.memory_state import ToolStats

        long_term = manager.load_long_term()
        long_term.tools = {
            "Edit": ToolStats(success_count=100, fail_count=5),
            "Read": ToolStats(success_count=200, fail_count=2),
        }
        manager._long_term = long_term
        manager._save_long_term()

        engine = LearningEngine(manager)
        stats = engine.get_tool_stats()

        assert "Edit" in stats
        assert stats["Edit"]["total"] == 105
        assert stats["Edit"]["success_rate"] > 0.9

    def test_get_velocity_stats(self, workflow_skill_root: Path) -> None:
        """Test getting velocity statistics."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        engine = LearningEngine(manager)

        # Record some velocities
        engine.calculate_velocity("execution", 30.0)
        engine.calculate_velocity("review", 15.0)

        stats = engine.get_velocity_stats()

        assert "by_phase" in stats
        assert "execution" in stats["by_phase"]
        assert "review" in stats["by_phase"]


# =============================================================================
# Integration Tests
# =============================================================================


class TestLearningEngineIntegration:
    """Integration tests for learning engine."""

    def test_full_learning_cycle(self, workflow_skill_root: Path) -> None:
        """Test complete learning cycle from capture to promotion."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        manager = MemoryManager(workflow_skill_root)
        manager.start_session("int-001", "Integration test task", domain="backend")
        engine = LearningEngine(manager)

        # Capture tool events
        engine.capture_tool_event("Read", True, "app/main.py")
        engine.capture_tool_event("Edit", True, "app/service.py")
        engine.capture_tool_event("Bash", False, error="pytest failed")

        # Capture and validate a decision
        engine.capture_decision(
            context="Error handling approach",
            decision="Use custom exceptions",
            confidence=0.9,
        )
        engine.validate_decision("Error handling", success=True)
        engine.validate_decision("Error handling", success=True)

        # Capture and resolve a blocker
        engine.capture_blocker("Test timeout")
        engine.resolve_blocker("Test timeout", "Increase timeout value")

        # Promote learnings
        result = engine.promote_learnings()

        assert result.tool_patterns_updated == 3
        assert result.has_errors is False

    def test_learning_persists_across_sessions(self, workflow_skill_root: Path) -> None:
        """Test that learnings persist across sessions."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import LearningEngine

        # First session
        manager1 = MemoryManager(workflow_skill_root)
        engine1 = LearningEngine(manager1)

        engine1.calculate_velocity("execution", 30.0)
        engine1.record_workflow_completion(
            workflow_id="session1",
            result="SUCCESS",
            duration_min=45.0,
            domain="backend",
            complexity=5,
        )

        # Second session
        manager2 = MemoryManager(workflow_skill_root)
        engine2 = LearningEngine(manager2)

        stats = engine2.get_velocity_stats()

        assert stats["workflows_completed"] == 1
        assert "execution" in stats["by_phase"]


# =============================================================================
# Factory Tests
# =============================================================================


class TestLearningEngineFactory:
    """Tests for learning engine factory."""

    def test_create_learning_engine(self, workflow_skill_root: Path) -> None:
        """Test factory function."""
        from core.memory_manager import MemoryManager
        from core.learning_engine import create_learning_engine

        manager = MemoryManager(workflow_skill_root)
        engine = create_learning_engine(manager)

        assert engine is not None
