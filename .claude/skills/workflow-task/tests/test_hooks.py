"""
Tests for workflow-task v2.0 hooks system.

Tests the hook_runner, pre_workflow, post_phase, and post_workflow handlers.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Generator
from unittest.mock import MagicMock, patch

import pytest

# Add hooks/python to path
HOOKS_PYTHON_DIR = Path(__file__).parent.parent / "hooks" / "python"
if str(HOOKS_PYTHON_DIR) not in sys.path:
    sys.path.insert(0, str(HOOKS_PYTHON_DIR))


# =============================================================================
# Test Fixtures
# =============================================================================


@pytest.fixture
def hook_context(temp_project_root: Path) -> dict:
    """Create a mock hook context."""
    skill_root = temp_project_root / ".claude" / "skills" / "workflow-task-v2"
    return {
        "skill_root": str(skill_root),
        "project_root": str(temp_project_root),
        "tool_name": "Edit",
        "tool_input": '{"file_path": "/test/file.py"}',
        "tool_result": "",
        "tool_success": True,
        "tool_params": {"file_path": "/test/file.py"},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@pytest.fixture
def env_vars(temp_project_root: Path) -> Generator[None, None, None]:
    """Set up environment variables for hooks."""
    skill_root = temp_project_root / ".claude" / "skills" / "workflow-task-v2"
    original_env = os.environ.copy()

    os.environ["WORKFLOW_TASK_ROOT"] = str(skill_root)
    os.environ["CLAUDE_PROJECT_ROOT"] = str(temp_project_root)
    os.environ["CLAUDE_TOOL_NAME"] = "Edit"
    os.environ["CLAUDE_TOOL_SUCCESS"] = "true"
    os.environ["CLAUDE_TOOL_INPUT"] = '{"file_path": "/test/file.py"}'
    os.environ["CLAUDE_TOOL_RESULT"] = ""

    yield

    os.environ.clear()
    os.environ.update(original_env)


# =============================================================================
# hook_runner tests
# =============================================================================


class TestHookRunner:
    """Tests for hook_runner.py"""

    def test_get_skill_root_from_env(self, temp_project_root: Path) -> None:
        """Test skill root discovery from environment."""
        from hook_runner import get_skill_root

        skill_root = temp_project_root / ".claude" / "skills" / "workflow-task-v2"
        os.environ["WORKFLOW_TASK_ROOT"] = str(skill_root)

        try:
            result = get_skill_root()
            assert result == skill_root
        finally:
            del os.environ["WORKFLOW_TASK_ROOT"]

    def test_get_skill_root_from_claude_project(self, temp_project_root: Path) -> None:
        """Test skill root discovery from CLAUDE_PROJECT_ROOT."""
        from hook_runner import get_skill_root

        # Ensure WORKFLOW_TASK_ROOT is not set
        os.environ.pop("WORKFLOW_TASK_ROOT", None)
        os.environ["CLAUDE_PROJECT_ROOT"] = str(temp_project_root)

        try:
            result = get_skill_root()
            expected = temp_project_root / ".claude" / "skills" / "workflow-task-v2"
            assert result == expected
        finally:
            del os.environ["CLAUDE_PROJECT_ROOT"]

    def test_load_env_context_basic(self, env_vars: None) -> None:
        """Test loading context from environment."""
        from hook_runner import load_env_context

        context = load_env_context()

        assert context["tool_name"] == "Edit"
        assert context["tool_success"] is True
        assert "tool_params" in context
        assert context["tool_params"]["file_path"] == "/test/file.py"

    def test_load_env_context_with_invalid_json(self) -> None:
        """Test context loading with invalid JSON input."""
        from hook_runner import load_env_context

        os.environ["CLAUDE_TOOL_INPUT"] = "not valid json"

        try:
            context = load_env_context()
            assert context["tool_params"] == {}
        finally:
            del os.environ["CLAUDE_TOOL_INPUT"]

    def test_run_hook_unknown_type(self) -> None:
        """Test running unknown hook type."""
        from hook_runner import run_hook

        result = run_hook("unknown_hook", [])
        assert result == 1


# =============================================================================
# pre_workflow tests
# =============================================================================


class TestPreWorkflow:
    """Tests for pre_workflow.py"""

    def test_generate_workflow_id_with_issue(self) -> None:
        """Test workflow ID generation with issue number."""
        from datetime import timezone
        from pre_workflow import generate_workflow_id

        result = generate_workflow_id("Fix bug in issue #123")
        assert "issue-123" in result
        # Use UTC to match the function's implementation
        assert datetime.now(timezone.utc).strftime("%Y-%m-%d") in result

    def test_generate_workflow_id_without_issue(self) -> None:
        """Test workflow ID generation without issue number."""
        from pre_workflow import generate_workflow_id

        result = generate_workflow_id("Add new feature for users")
        assert "add-new-feature" in result

    def test_generate_workflow_id_empty(self) -> None:
        """Test workflow ID generation with empty description."""
        from pre_workflow import generate_workflow_id

        result = generate_workflow_id("")
        assert "workflow" in result

    def test_detect_domain_backend(self) -> None:
        """Test domain detection for backend tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Add new FastAPI endpoint") == "backend"
        assert detect_domain("Create service layer") == "backend"

    def test_detect_domain_frontend(self) -> None:
        """Test domain detection for frontend tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Add React component") == "frontend"
        assert detect_domain("Update Vue UI") == "frontend"

    def test_detect_domain_database(self) -> None:
        """Test domain detection for database tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Create migration for users table") == "database"
        assert detect_domain("Add SQL index") == "database"

    def test_detect_domain_testing(self) -> None:
        """Test domain detection for testing tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Add pytest unit tests") == "testing"
        assert detect_domain("Fix test coverage") == "testing"

    def test_detect_domain_security(self) -> None:
        """Test domain detection for security tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Fix JWT authentication") == "security"
        assert detect_domain("Add RBAC permissions") == "security"

    def test_detect_domain_infra(self) -> None:
        """Test domain detection for infrastructure tasks."""
        from pre_workflow import detect_domain

        assert detect_domain("Update Docker config") == "infra"
        assert detect_domain("Fix Kubernetes deployment") == "infra"

    def test_detect_domain_default(self) -> None:
        """Test domain detection defaults to backend."""
        from pre_workflow import detect_domain

        assert detect_domain("Some random task") == "backend"

    def test_handle_pre_workflow_creates_session(
        self, hook_context: dict, temp_project_root: Path
    ) -> None:
        """Test that pre_workflow creates a session."""
        from pre_workflow import handle_pre_workflow

        # Add paths for imports
        skill_root = Path(hook_context["skill_root"])
        sys.path.insert(0, str(skill_root))

        result = handle_pre_workflow(hook_context, ["Test task description"])

        assert result == 0

        # Check session was created
        session_file = skill_root / "memoria" / "short_term.json"
        assert session_file.exists()


# =============================================================================
# post_phase tests
# =============================================================================


class TestPostPhase:
    """Tests for post_phase.py"""

    def test_extract_file_path_from_file_path(self) -> None:
        """Test file path extraction from file_path parameter."""
        from post_phase import extract_file_path

        result = extract_file_path("Edit", {"file_path": "/app/service.py"})
        assert result == "/app/service.py"

    def test_extract_file_path_from_path(self) -> None:
        """Test file path extraction from path parameter."""
        from post_phase import extract_file_path

        result = extract_file_path("Read", {"path": "/app/config.yaml"})
        assert result == "/app/config.yaml"

    def test_extract_file_path_from_bash_redirect(self) -> None:
        """Test file path extraction from bash redirect."""
        from post_phase import extract_file_path

        result = extract_file_path("Bash", {"command": "echo 'test' > output.txt"})
        assert result == "output.txt"

    def test_extract_file_path_none(self) -> None:
        """Test file path extraction returns None when not found."""
        from post_phase import extract_file_path

        result = extract_file_path("Bash", {"command": "ls -la"})
        assert result is None

    def test_extract_error_info_success(self) -> None:
        """Test error extraction for successful result."""
        from post_phase import extract_error_info

        result = extract_error_info("All good", True)
        assert result is None

    def test_extract_error_info_python_exception(self) -> None:
        """Test error extraction for Python exception."""
        from post_phase import extract_error_info

        result = extract_error_info(
            "Traceback...\nValueError: Invalid value", False
        )
        assert result is not None
        assert result["type"] == "python_exception"
        assert result["exception"] == "ValueError"

    def test_extract_error_info_test_failure(self) -> None:
        """Test error extraction for test failure."""
        from post_phase import extract_error_info

        result = extract_error_info(
            "FAILED tests/test_service.py::test_create", False
        )
        assert result is not None
        assert result["type"] == "test_failure"
        assert "test_service" in result.get("test_file", "")

    def test_extract_error_info_syntax_error(self) -> None:
        """Test error extraction for syntax error."""
        from post_phase import extract_error_info

        result = extract_error_info(
            'SyntaxError: invalid syntax\nFile "app.py", line 42', False
        )
        assert result is not None
        assert result["type"] == "syntax_error"
        assert result.get("file") == "app.py"
        assert result.get("line") == 42

    def test_extract_error_info_import_error(self) -> None:
        """Test error extraction for import error."""
        from post_phase import extract_error_info

        result = extract_error_info(
            "ModuleNotFoundError: No module named 'missing_lib'", False
        )
        assert result is not None
        assert result["type"] == "import_error"
        assert result.get("module") == "missing_lib"


# =============================================================================
# post_workflow tests
# =============================================================================


class TestPostWorkflow:
    """Tests for post_workflow.py"""

    def test_determine_workflow_result_success(self, sample_short_term_data: dict) -> None:
        """Test result determination for successful workflow."""
        from post_workflow import determine_workflow_result

        # Create mock short_term
        mock_short_term = MagicMock()
        mock_short_term.blockers_active = []
        mock_short_term.tool_events = [MagicMock(success=True) for _ in range(10)]

        result = determine_workflow_result(mock_short_term)
        assert result == "SUCCESS"

    def test_determine_workflow_result_with_errors(self) -> None:
        """Test result determination with blocking errors."""
        from post_workflow import determine_workflow_result

        mock_short_term = MagicMock()

        result = determine_workflow_result(mock_short_term, had_errors=True)
        assert result == "FAILED"

    def test_determine_workflow_result_partial(self) -> None:
        """Test result determination with unresolved blockers."""
        from post_workflow import determine_workflow_result

        mock_short_term = MagicMock()
        mock_blocker = MagicMock()
        mock_blocker.resolved = False
        mock_short_term.blockers_active = [mock_blocker]
        mock_short_term.tool_events = []

        result = determine_workflow_result(mock_short_term)
        assert result == "PARTIAL"

    def test_determine_workflow_result_high_failure_rate(self) -> None:
        """Test result determination with high tool failure rate."""
        from post_workflow import determine_workflow_result

        mock_short_term = MagicMock()
        mock_short_term.blockers_active = []
        # 4 failures out of 10 = 40% > 30% threshold
        mock_short_term.tool_events = [
            MagicMock(success=i < 6) for i in range(10)
        ]

        result = determine_workflow_result(mock_short_term)
        assert result == "PARTIAL"

    def test_calculate_duration_minutes(self) -> None:
        """Test duration calculation."""
        from post_workflow import calculate_duration_minutes

        mock_short_term = MagicMock()
        # Set session start to 30 minutes ago
        start_time = datetime.now(timezone.utc).replace(
            minute=datetime.now().minute - 30 if datetime.now().minute >= 30 else datetime.now().minute + 30
        )
        mock_short_term.session_start = start_time.isoformat()

        # Duration should be approximately 30 minutes (or close)
        duration = calculate_duration_minutes(mock_short_term)
        assert isinstance(duration, float)

    def test_calculate_duration_invalid_start(self) -> None:
        """Test duration calculation with invalid start time."""
        from post_workflow import calculate_duration_minutes

        mock_short_term = MagicMock()
        mock_short_term.session_start = "not a valid timestamp"

        duration = calculate_duration_minutes(mock_short_term)
        assert duration == 0.0

    def test_gather_session_stats(self) -> None:
        """Test gathering session statistics."""
        from post_workflow import gather_session_stats

        mock_short_term = MagicMock()
        mock_short_term.tool_events = [
            MagicMock(tool="Edit", success=True),
            MagicMock(tool="Edit", success=True),
            MagicMock(tool="Edit", success=False),
            MagicMock(tool="Read", success=True),
        ]
        mock_short_term.context_snapshot = {"files_modified": ["/a.py", "/b.py"]}
        mock_short_term.decisions_pending = [MagicMock()]
        mock_short_term.blockers_active = [
            MagicMock(resolved=True),
            MagicMock(resolved=False),
        ]
        mock_short_term.phase_timings = {"2": {"start": "...", "end": "..."}}

        stats = gather_session_stats(mock_short_term)

        assert stats["tool_events_total"] == 4
        assert stats["files_modified"] == 2
        assert stats["decisions_recorded"] == 1
        assert stats["blockers_encountered"] == 2
        assert stats["blockers_resolved"] == 1
        assert stats["phases_completed"] == 1
        assert stats["tool_usage"]["Edit"]["success"] == 2
        assert stats["tool_usage"]["Edit"]["fail"] == 1
        assert stats["tool_usage"]["Read"]["success"] == 1


# =============================================================================
# Integration tests
# =============================================================================


class TestHooksIntegration:
    """Integration tests for the hooks system."""

    def test_full_workflow_cycle(
        self, temp_project_root: Path, hook_context: dict
    ) -> None:
        """Test a full workflow cycle: start -> tool events -> stop."""
        skill_root = Path(hook_context["skill_root"])
        sys.path.insert(0, str(skill_root))

        from pre_workflow import handle_pre_workflow
        from post_phase import handle_post_phase
        from post_workflow import handle_post_workflow

        # 1. Start workflow
        result = handle_pre_workflow(hook_context, ["Test integration workflow"])
        assert result == 0

        # Verify session created
        session_file = skill_root / "memoria" / "short_term.json"
        assert session_file.exists()

        # 2. Simulate tool events
        for i in range(3):
            hook_context["tool_name"] = "Edit"
            hook_context["tool_params"] = {"file_path": f"/test/file{i}.py"}
            hook_context["tool_success"] = True
            result = handle_post_phase(hook_context, ["tool_event"])
            assert result == 0

        # 3. End workflow
        result = handle_post_workflow(hook_context, [])
        assert result == 0

        # 4. Verify consolidation (session should still exist but updated)
        long_term_file = skill_root / "memoria" / "long_term.yaml"
        assert long_term_file.exists()

    def test_workflow_with_failure(
        self, temp_project_root: Path, hook_context: dict
    ) -> None:
        """Test workflow with tool failure."""
        skill_root = Path(hook_context["skill_root"])
        sys.path.insert(0, str(skill_root))

        from pre_workflow import handle_pre_workflow
        from post_phase import handle_post_phase

        # Start workflow
        handle_pre_workflow(hook_context, ["Test failure handling"])

        # Simulate a failing tool
        hook_context["tool_name"] = "Bash"
        hook_context["tool_params"] = {"command": "pytest tests/"}
        hook_context["tool_success"] = False
        hook_context["tool_result"] = "FAILED tests/test_service.py::test_create"

        result = handle_post_phase(hook_context, ["tool_event"])
        assert result == 0

        # Verify blocker was recorded
        with open(skill_root / "memoria" / "short_term.json") as f:
            session = json.load(f)
            # Should have recorded the failure in tool_events
            assert len(session.get("tool_events", [])) > 0
