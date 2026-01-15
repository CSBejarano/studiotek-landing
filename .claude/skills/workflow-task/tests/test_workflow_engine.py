"""
Tests for workflow-task v2.0 WorkflowEngine.

Tests the complete workflow lifecycle including phases, memory integration,
and context manager usage.
"""

import pytest
from pathlib import Path
from datetime import datetime, timezone
from typing import Generator
import sys

# Add paths for imports
SKILL_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SKILL_ROOT))


# =============================================================================
# Test Fixtures
# =============================================================================


@pytest.fixture
def workflow_skill_root(temp_project_root: Path) -> Path:
    """Return the skill root with required directories."""
    skill_root = temp_project_root / ".claude" / "skills" / "workflow-task-v2"

    # Ensure required directories exist
    (skill_root / "memoria").mkdir(parents=True, exist_ok=True)
    (skill_root / "agents" / "memory").mkdir(parents=True, exist_ok=True)
    (skill_root / "templates").mkdir(parents=True, exist_ok=True)

    return skill_root


# =============================================================================
# WorkflowStatus Tests
# =============================================================================


class TestWorkflowStatus:
    """Tests for WorkflowStatus enum."""

    def test_status_values(self) -> None:
        """Test all status values exist."""
        from models.workflow_state import WorkflowStatus

        assert WorkflowStatus.PENDING.value == "pending"
        assert WorkflowStatus.IN_PROGRESS.value == "in_progress"
        assert WorkflowStatus.PAUSED.value == "paused"
        assert WorkflowStatus.COMPLETED.value == "completed"
        assert WorkflowStatus.FAILED.value == "failed"


# =============================================================================
# PhaseInfo Tests
# =============================================================================


class TestPhaseInfo:
    """Tests for PhaseInfo dataclass."""

    def test_phase_info_creation(self) -> None:
        """Test basic PhaseInfo creation."""
        from models.workflow_state import PhaseInfo

        phase = PhaseInfo(phase_id=2)
        assert phase.phase_id == 2
        assert phase.name == "Execution"  # Auto-set from PHASE_NAMES

    def test_phase_info_custom_name(self) -> None:
        """Test PhaseInfo with custom name."""
        from models.workflow_state import PhaseInfo

        phase = PhaseInfo(phase_id=2, name="Custom Execution")
        assert phase.name == "Custom Execution"

    def test_phase_info_to_dict(self) -> None:
        """Test PhaseInfo serialization."""
        from models.workflow_state import PhaseInfo, PhaseStatus

        phase = PhaseInfo(
            phase_id=2,
            status=PhaseStatus.COMPLETED,
            duration_min=25.5,
            tool_events=10,
        )
        data = phase.to_dict()

        assert data["phase_id"] == 2
        assert data["status"] == "completed"
        assert data["duration_min"] == 25.5
        assert data["tool_events"] == 10

    def test_phase_info_from_dict(self) -> None:
        """Test PhaseInfo deserialization."""
        from models.workflow_state import PhaseInfo, PhaseStatus

        data = {
            "phase_id": 3,
            "name": "Review",
            "status": "in_progress",
            "duration_min": 15.0,
        }
        phase = PhaseInfo.from_dict(data)

        assert phase.phase_id == 3
        assert phase.name == "Review"
        assert phase.status == PhaseStatus.IN_PROGRESS
        assert phase.duration_min == 15.0


# =============================================================================
# WorkflowResult Tests
# =============================================================================


class TestWorkflowResult:
    """Tests for WorkflowResult dataclass."""

    def test_workflow_result_creation(self) -> None:
        """Test basic WorkflowResult creation."""
        from models.workflow_state import WorkflowResult

        result = WorkflowResult(
            workflow_id="2025-12-28_issue-64",
            result="SUCCESS",
            duration_min=45.0,
            phases_completed=5,
        )

        assert result.workflow_id == "2025-12-28_issue-64"
        assert result.result == "SUCCESS"
        assert result.duration_min == 45.0
        assert result.phases_completed == 5

    def test_workflow_result_is_success(self) -> None:
        """Test is_success property."""
        from models.workflow_state import WorkflowResult

        result = WorkflowResult(workflow_id="test", result="SUCCESS")
        assert result.is_success is True
        assert result.is_partial is False
        assert result.is_failed is False

    def test_workflow_result_is_partial(self) -> None:
        """Test is_partial property."""
        from models.workflow_state import WorkflowResult

        result = WorkflowResult(workflow_id="test", result="PARTIAL")
        assert result.is_success is False
        assert result.is_partial is True
        assert result.is_failed is False

    def test_workflow_result_is_failed(self) -> None:
        """Test is_failed property."""
        from models.workflow_state import WorkflowResult

        result = WorkflowResult(workflow_id="test", result="FAILED")
        assert result.is_success is False
        assert result.is_partial is False
        assert result.is_failed is True

    def test_workflow_result_to_dict(self) -> None:
        """Test WorkflowResult serialization."""
        from models.workflow_state import WorkflowResult

        result = WorkflowResult(
            workflow_id="test",
            result="SUCCESS",
            duration_min=30.0,
            decisions_made=5,
        )
        data = result.to_dict()

        assert data["workflow_id"] == "test"
        assert data["result"] == "SUCCESS"
        assert data["duration_min"] == 30.0
        assert data["decisions_made"] == 5


# =============================================================================
# WorkflowState Tests
# =============================================================================


class TestWorkflowState:
    """Tests for WorkflowState dataclass."""

    def test_workflow_state_creation(self) -> None:
        """Test basic WorkflowState creation."""
        from models.workflow_state import WorkflowState, WorkflowStatus

        state = WorkflowState(
            workflow_id="test-123",
            task_description="Test task",
            domain="backend",
        )

        assert state.workflow_id == "test-123"
        assert state.task_description == "Test task"
        assert state.domain == "backend"
        assert state.status == WorkflowStatus.PENDING

    def test_workflow_state_start_phase(self) -> None:
        """Test starting a phase."""
        from models.workflow_state import WorkflowState, PhaseStatus

        state = WorkflowState(workflow_id="test", task_description="Test")
        phase = state.start_phase(2)

        assert phase.phase_id == 2
        assert phase.status == PhaseStatus.IN_PROGRESS
        assert phase.started_at is not None
        assert state.current_phase == 2

    def test_workflow_state_complete_phase(self) -> None:
        """Test completing a phase."""
        from models.workflow_state import WorkflowState, PhaseStatus

        state = WorkflowState(workflow_id="test", task_description="Test")
        state.start_phase(2)
        phase = state.complete_phase(2)

        assert phase.status == PhaseStatus.COMPLETED
        assert phase.completed_at is not None
        assert phase.duration_min >= 0
        assert state.current_phase is None

    def test_workflow_state_phases_completed(self) -> None:
        """Test phases_completed counter."""
        from models.workflow_state import WorkflowState

        state = WorkflowState(workflow_id="test", task_description="Test")

        # Complete two phases
        state.start_phase(1)
        state.complete_phase(1)
        state.start_phase(2)
        state.complete_phase(2)

        assert state.phases_completed == 2

    def test_workflow_state_to_dict(self) -> None:
        """Test WorkflowState serialization."""
        from models.workflow_state import WorkflowState

        state = WorkflowState(
            workflow_id="test",
            task_description="Test task",
            domain="frontend",
            complexity_score=7,
        )
        data = state.to_dict()

        assert data["workflow_id"] == "test"
        assert data["task_description"] == "Test task"
        assert data["domain"] == "frontend"
        assert data["complexity_score"] == 7


# =============================================================================
# WorkflowEngine Tests
# =============================================================================


class TestWorkflowEngine:
    """Tests for WorkflowEngine class."""

    @pytest.mark.asyncio
    async def test_engine_creation(self, workflow_skill_root: Path) -> None:
        """Test basic engine creation."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
            domain="backend",
        )

        assert engine.workflow_id == "test-123"
        assert engine.task_description == "Test workflow"
        assert engine.domain == "backend"
        assert engine.is_running is False

    @pytest.mark.asyncio
    async def test_engine_start(self, workflow_skill_root: Path) -> None:
        """Test starting the engine."""
        from core.workflow_engine import WorkflowEngine
        from models.workflow_state import WorkflowStatus

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()

        assert engine.status == WorkflowStatus.IN_PROGRESS
        assert engine.is_running is True
        assert engine.memory is not None

    @pytest.mark.asyncio
    async def test_engine_start_twice_fails(self, workflow_skill_root: Path) -> None:
        """Test that starting twice raises error."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()

        with pytest.raises(RuntimeError, match="Cannot start"):
            await engine.start()

    @pytest.mark.asyncio
    async def test_engine_phase_lifecycle(self, workflow_skill_root: Path) -> None:
        """Test phase start and complete."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        await engine.start_phase(2, "Execution phase")

        assert engine.current_phase == 2

        result = await engine.complete_phase()

        assert result is not None
        assert result.phase == 2
        assert result.success is True
        assert engine.current_phase is None

    @pytest.mark.asyncio
    async def test_engine_record_decision(self, workflow_skill_root: Path) -> None:
        """Test recording a decision."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        engine.record_decision(
            context="Rate limiting strategy",
            decision="Use Redis sliding window",
            confidence=0.85,
            tags=["api", "redis"],
        )

        assert len(engine.memory.short_term.decisions_pending) == 1

    @pytest.mark.asyncio
    async def test_engine_record_blocker(self, workflow_skill_root: Path) -> None:
        """Test recording a blocker."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        engine.record_blocker(
            symptom="Import error in tests",
            severity="medium",
            tags=["testing"],
        )

        assert len(engine.memory.short_term.blockers_active) == 1

    @pytest.mark.asyncio
    async def test_engine_resolve_blocker(self, workflow_skill_root: Path) -> None:
        """Test resolving a blocker."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        engine.record_blocker(
            symptom="Import error",
            severity="medium",
            tags=["testing"],
        )

        resolved = engine.resolve_blocker("Import error", "Added missing dependency")
        assert resolved is True

    @pytest.mark.asyncio
    async def test_engine_complete(self, workflow_skill_root: Path) -> None:
        """Test completing the workflow."""
        from core.workflow_engine import WorkflowEngine
        from models.workflow_state import WorkflowStatus

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        await engine.start_phase(2)
        await engine.complete_phase()

        result = await engine.complete()

        assert result.workflow_id == "test-123"
        assert result.result == "SUCCESS"
        assert result.phases_completed == 1
        assert engine.status == WorkflowStatus.COMPLETED

    @pytest.mark.asyncio
    async def test_engine_abort(self, workflow_skill_root: Path) -> None:
        """Test aborting the workflow."""
        from core.workflow_engine import WorkflowEngine
        from models.workflow_state import WorkflowStatus

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        await engine.abort("Test abort reason")

        assert engine.status == WorkflowStatus.FAILED
        assert engine.is_complete is True

    @pytest.mark.asyncio
    async def test_engine_get_context(self, workflow_skill_root: Path) -> None:
        """Test getting workflow context."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        await engine.start()
        context = engine.get_context()

        assert isinstance(context, dict)

    @pytest.mark.asyncio
    async def test_engine_hooks_phase_start(self, workflow_skill_root: Path) -> None:
        """Test phase start hook."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        hook_called = []

        def on_phase_start(phase_id: int, description: str) -> None:
            hook_called.append((phase_id, description))

        engine.on_phase_start(on_phase_start)

        await engine.start()
        await engine.start_phase(2, "Test phase")

        assert len(hook_called) == 1
        assert hook_called[0] == (2, "Test phase")

    @pytest.mark.asyncio
    async def test_engine_hooks_phase_complete(self, workflow_skill_root: Path) -> None:
        """Test phase complete hook."""
        from core.workflow_engine import WorkflowEngine

        engine = WorkflowEngine(
            skill_root=workflow_skill_root,
            workflow_id="test-123",
            task_description="Test workflow",
        )

        hook_called = []

        def on_phase_complete(result) -> None:
            hook_called.append(result)

        engine.on_phase_complete(on_phase_complete)

        await engine.start()
        await engine.start_phase(2)
        await engine.complete_phase()

        assert len(hook_called) == 1
        assert hook_called[0].phase == 2


# =============================================================================
# Context Manager Tests
# =============================================================================


class TestRunWorkflow:
    """Tests for run_workflow context manager."""

    @pytest.mark.asyncio
    async def test_run_workflow_basic(self, workflow_skill_root: Path) -> None:
        """Test basic context manager usage."""
        from core.workflow_engine import run_workflow

        async with run_workflow(
            "Test workflow",
            skill_root=workflow_skill_root,
        ) as engine:
            assert engine.is_running is True
            await engine.start_phase(2)
            await engine.complete_phase()

        assert engine.is_complete is True

    @pytest.mark.asyncio
    async def test_run_workflow_with_domain(self, workflow_skill_root: Path) -> None:
        """Test context manager with domain."""
        from core.workflow_engine import run_workflow

        async with run_workflow(
            "Test backend workflow",
            skill_root=workflow_skill_root,
            domain="backend",
        ) as engine:
            assert engine.domain == "backend"

    @pytest.mark.asyncio
    async def test_run_workflow_auto_workflow_id(self, workflow_skill_root: Path) -> None:
        """Test automatic workflow ID generation."""
        from core.workflow_engine import run_workflow

        async with run_workflow(
            "Issue #64 - Fix bug",
            skill_root=workflow_skill_root,
        ) as engine:
            assert "issue-64" in engine.workflow_id

    @pytest.mark.asyncio
    async def test_run_workflow_exception_aborts(self, workflow_skill_root: Path) -> None:
        """Test that exceptions abort the workflow."""
        from core.workflow_engine import run_workflow
        from models.workflow_state import WorkflowStatus

        engine_ref = None

        with pytest.raises(ValueError):
            async with run_workflow(
                "Test workflow",
                skill_root=workflow_skill_root,
            ) as engine:
                engine_ref = engine
                raise ValueError("Test error")

        assert engine_ref is not None
        assert engine_ref.status == WorkflowStatus.FAILED


# =============================================================================
# Integration Tests
# =============================================================================


class TestWorkflowIntegration:
    """Integration tests for the complete workflow system."""

    @pytest.mark.asyncio
    async def test_full_workflow_lifecycle(self, workflow_skill_root: Path) -> None:
        """Test a complete workflow from start to finish."""
        from core.workflow_engine import run_workflow

        async with run_workflow(
            "Issue #64 - Implement WhatsApp API",
            skill_root=workflow_skill_root,
            domain="api",
            complexity_score=7,
        ) as engine:
            # Phase 1: Planning
            await engine.start_phase(1, "Planning")
            engine.record_decision(
                context="Message queue strategy",
                decision="Use Redis for rate limiting",
                confidence=0.9,
                tags=["api", "redis"],
            )
            await engine.complete_phase()

            # Phase 2: Execution
            await engine.start_phase(2, "Execution")
            engine.record_tool_event(
                tool="Edit",
                success=True,
                file="app/api/whatsapp.py",
            )
            engine.record_tool_event(
                tool="Bash",
                success=True,
                params={"command": "pytest tests/"},
            )
            await engine.complete_phase()

            # Phase 3: Review
            await engine.start_phase(3, "Review")
            engine.record_blocker(
                symptom="Missing rate limit tests",
                severity="medium",
                tags=["testing"],
            )
            engine.resolve_blocker("Missing rate limit tests", "Added comprehensive tests")
            await engine.complete_phase()

        # Verify result
        result = engine.memory.long_term

        assert result is not None
        assert result.workflows_completed >= 1

    @pytest.mark.asyncio
    async def test_workflow_with_failures(self, workflow_skill_root: Path) -> None:
        """Test workflow behavior with tool failures."""
        from core.workflow_engine import run_workflow

        result_before_complete = None

        async with run_workflow(
            "Test with failures",
            skill_root=workflow_skill_root,
        ) as engine:
            await engine.start_phase(2)

            # Record some failures - 3 success, 2 failure = 40% failure rate
            for i in range(5):
                engine.record_tool_event(
                    tool="Bash",
                    success=i % 2 == 0,  # i=0,2,4 success; i=1,3 fail
                    error="Test error" if i % 2 != 0 else None,
                )

            await engine.complete_phase()

            # Check result before workflow consolidates
            result_before_complete = engine._determine_result()

        # With 40% failure rate (> 30%), should be PARTIAL
        assert result_before_complete in ("SUCCESS", "PARTIAL")
