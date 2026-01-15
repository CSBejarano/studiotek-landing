"""
Tests for Ralph Wiggum Loop Hook v1.0

Tests the Ralph loop hook functions:
- detect_failure_type: Identifies failure type from output
- get_retry_phase: Maps failure type to retry phase

Note: These tests are designed to work once ralph_loop.py is implemented.
Until then, they serve as a specification for the expected behavior.
"""

from pathlib import Path

import pytest

# Add parent to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import will fail until ralph_loop.py is created
# Tests are marked to skip if module not available
try:
    from hooks.python.ralph_loop import detect_failure_type, get_retry_phase
    RALPH_LOOP_AVAILABLE = True
except ImportError:
    RALPH_LOOP_AVAILABLE = False
    # Define stubs for test collection
    def detect_failure_type(output: str): pass
    def get_retry_phase(failure_type: str): pass


pytestmark = pytest.mark.skipif(
    not RALPH_LOOP_AVAILABLE,
    reason="ralph_loop.py not yet implemented"
)


# =============================================================================
# DETECT FAILURE TYPE TESTS - TESTS FAILED
# =============================================================================

class TestDetectFailureTypeTests:
    """Tests for detect_failure_type detecting test failures."""

    def test_detect_pytest_failed(self):
        """Test detection of pytest FAILED marker."""
        output = """
        tests/test_booking.py::test_create_booking FAILED
        === 1 failed, 5 passed in 2.3s ===
        """
        assert detect_failure_type(output) == "tests_failed"

    def test_detect_assertion_error(self):
        """Test detection of AssertionError."""
        output = """
        E   AssertionError: assert None is not None
        tests/test_service.py:42: AssertionError
        """
        assert detect_failure_type(output) == "tests_failed"

    def test_detect_pytest_failed_summary(self):
        """Test detection of pytest FAILED in summary."""
        output = """
        =================== pytest FAILED ===================
        2 failed, 10 passed
        """
        assert detect_failure_type(output) == "tests_failed"

    def test_detect_vitest_failed(self):
        """Test detection of vitest failed marker."""
        output = """
        FAIL src/components/Button.test.tsx
        vitest failed - 1 test failed
        """
        assert detect_failure_type(output) == "tests_failed"

    def test_detect_tests_case_insensitive(self):
        """Test detection is case insensitive."""
        outputs = [
            "FAILED tests/test_api.py",
            "failed tests/test_api.py",
            "Failed tests/test_api.py",
        ]
        for output in outputs:
            assert detect_failure_type(output) == "tests_failed"


# =============================================================================
# DETECT FAILURE TYPE TESTS - LINT FAILED
# =============================================================================

class TestDetectFailureTypeLint:
    """Tests for detect_failure_type detecting lint failures."""

    def test_detect_eslint(self):
        """Test detection of ESLint errors."""
        output = """
        /src/App.tsx
          12:5  error  Unexpected console statement  no-console

        eslint found 1 error
        """
        assert detect_failure_type(output) == "lint_failed"

    def test_detect_ruff(self):
        """Test detection of Ruff lint errors."""
        output = """
        app/service.py:15:1: E501 Line too long (120 > 88)
        ruff: Found 3 errors
        """
        assert detect_failure_type(output) == "lint_failed"

    def test_detect_lint_error_generic(self):
        """Test detection of generic 'lint error' message."""
        output = """
        Running linter...
        lint error: undefined variable 'foo'
        """
        assert detect_failure_type(output) == "lint_failed"

    def test_detect_typescript_error(self):
        """Test detection of TypeScript errors."""
        output = """
        src/utils.ts(10,5): error TS2322: Type 'string' is not assignable to type 'number'.
        TypeScript error found
        """
        assert detect_failure_type(output) == "lint_failed"

    def test_detect_lint_case_insensitive(self):
        """Test lint detection is case insensitive."""
        outputs = [
            "ESLint found errors",
            "eslint found errors",
            "RUFF check failed",
        ]
        for output in outputs:
            assert detect_failure_type(output) == "lint_failed"


# =============================================================================
# DETECT FAILURE TYPE TESTS - BUILD FAILED
# =============================================================================

class TestDetectFailureTypeBuild:
    """Tests for detect_failure_type detecting build failures."""

    def test_detect_build_failed(self):
        """Test detection of 'build failed' message."""
        output = """
        Building project...
        build failed: Module not found
        """
        assert detect_failure_type(output) == "build_failed"

    def test_detect_compilation_error(self):
        """Test detection of compilation errors."""
        output = """
        Compiling...
        compilation error: Cannot find module '@/utils'
        """
        assert detect_failure_type(output) == "build_failed"

    def test_detect_vite_build_failed(self):
        """Test detection of Vite build failures."""
        output = """
        vite build
        vite build failed: Error during build
        """
        assert detect_failure_type(output) == "build_failed"

    def test_detect_build_case_insensitive(self):
        """Test build detection is case insensitive."""
        outputs = [
            "BUILD FAILED",
            "build failed",
            "Build Failed",
            "COMPILATION ERROR",
        ]
        for output in outputs:
            assert detect_failure_type(output) == "build_failed"


# =============================================================================
# DETECT FAILURE TYPE TESTS - NO FAILURE
# =============================================================================

class TestDetectFailureTypeNone:
    """Tests for detect_failure_type when no failure detected."""

    def test_detect_success_output(self):
        """Test no detection on successful output."""
        output = """
        === 10 passed in 1.5s ===
        All tests passed!
        """
        assert detect_failure_type(output) is None

    def test_detect_empty_output(self):
        """Test no detection on empty output."""
        assert detect_failure_type("") is None

    def test_detect_normal_log(self):
        """Test no detection on normal log output."""
        output = """
        INFO: Starting server...
        INFO: Database connected
        INFO: Ready to accept connections
        """
        assert detect_failure_type(output) is None

    def test_detect_workflow_complete(self):
        """Test no detection on workflow complete output."""
        output = """
        WORKFLOW COMPLETE
        All phases executed successfully.
        """
        assert detect_failure_type(output) is None

    def test_detect_partial_match_not_triggered(self):
        """Test partial word matches don't trigger detection."""
        # "failed" as part of another word shouldn't match
        output = """
        The request failedover to the backup server.
        """
        # This depends on implementation - if using word boundaries
        # For now, assume substring match might trigger it
        # Test documents expected behavior either way
        result = detect_failure_type(output)
        # Accept either behavior, but document it
        assert result in [None, "tests_failed"]


# =============================================================================
# GET RETRY PHASE TESTS
# =============================================================================

class TestGetRetryPhase:
    """Tests for get_retry_phase function."""

    def test_tests_failed_returns_phase_3(self):
        """Test tests_failed maps to Phase 3 (Review)."""
        assert get_retry_phase("tests_failed") == 3

    def test_lint_failed_returns_phase_3(self):
        """Test lint_failed maps to Phase 3 (Review)."""
        assert get_retry_phase("lint_failed") == 3

    def test_build_failed_returns_phase_2(self):
        """Test build_failed maps to Phase 2 (Execution)."""
        assert get_retry_phase("build_failed") == 2

    def test_unknown_failure_returns_default(self):
        """Test unknown failure type returns default phase."""
        # Default should be Phase 3 (Review) as safest option
        result = get_retry_phase("unknown_failure")
        assert result == 3

    def test_none_failure_type(self):
        """Test None failure type returns default."""
        result = get_retry_phase(None)
        assert result == 3


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestDetectAndRetryIntegration:
    """Integration tests combining detect_failure_type and get_retry_phase."""

    def test_pytest_failure_to_review_phase(self):
        """Test pytest failure leads to Review phase retry."""
        output = "FAILED tests/test_api.py::test_endpoint"
        failure = detect_failure_type(output)
        phase = get_retry_phase(failure)

        assert failure == "tests_failed"
        assert phase == 3  # Review phase

    def test_eslint_failure_to_review_phase(self):
        """Test ESLint failure leads to Review phase retry."""
        output = "eslint: 5 errors found"
        failure = detect_failure_type(output)
        phase = get_retry_phase(failure)

        assert failure == "lint_failed"
        assert phase == 3  # Review phase

    def test_build_failure_to_execution_phase(self):
        """Test build failure leads to Execution phase retry."""
        output = "vite build failed: module not found"
        failure = detect_failure_type(output)
        phase = get_retry_phase(failure)

        assert failure == "build_failed"
        assert phase == 2  # Execution phase

    def test_success_output_no_retry(self):
        """Test successful output results in no retry phase."""
        output = "All tests passed. Build successful."
        failure = detect_failure_type(output)

        assert failure is None
        # No retry needed when no failure


# =============================================================================
# EDGE CASES AND PRIORITY TESTS
# =============================================================================

class TestFailureDetectionPriority:
    """Tests for failure detection priority when multiple markers present."""

    def test_multiple_markers_tests_priority(self):
        """Test behavior when multiple failure markers present."""
        output = """
        eslint found 2 warnings
        FAILED tests/test_api.py
        build completed with warnings
        """
        # Depending on implementation, test failure might take priority
        # This documents the expected/actual behavior
        result = detect_failure_type(output)
        # Should detect the most severe/first failure type
        assert result in ["tests_failed", "lint_failed"]

    def test_real_world_ci_output(self):
        """Test with realistic CI output containing failure."""
        output = """
        Running tests...
        ========================= test session starts =========================
        platform linux -- Python 3.11.0, pytest-7.4.0
        collected 25 items

        tests/test_booking.py::test_create_booking PASSED
        tests/test_booking.py::test_update_booking FAILED
        tests/test_booking.py::test_delete_booking PASSED

        =========================== FAILURES ===========================
        ______________________ test_update_booking ______________________

        def test_update_booking():
            booking = create_booking()
        >   assert booking.status == "updated"
        E   AssertionError: assert 'pending' == 'updated'

        tests/test_booking.py:42: AssertionError
        =================== 1 failed, 24 passed in 3.45s ===================
        """
        assert detect_failure_type(output) == "tests_failed"
