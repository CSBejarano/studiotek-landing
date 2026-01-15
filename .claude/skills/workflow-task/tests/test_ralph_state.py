"""
Tests for Ralph Wiggum Loop State Models v1.0

Tests the Ralph loop state management:
- RalphFailureEntry dataclass
- RalphLoopState dataclass with retry logic
- Serialization/deserialization
"""

from datetime import datetime
from pathlib import Path

import pytest

# Add parent to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from models.ralph_state import RalphLoopState, RalphFailureEntry


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
def sample_failure_entry() -> dict:
    """Sample failure entry data."""
    return {
        "iteration": 3,
        "phase": 4,
        "reason": "tests_failed",
        "action": "retry_from_phase_3",
        "timestamp": "2026-01-13T10:00:00",
    }


@pytest.fixture
def sample_ralph_state_data() -> dict:
    """Sample Ralph state data for testing."""
    return {
        "enabled": True,
        "iteration": 5,
        "max_iterations": 30,
        "completion_promise": "TASK COMPLETE",
        "completion_detected": False,
        "overnight_mode": True,
        "log_file": "/tmp/ralph.log",
        "started_at": "2026-01-13T09:00:00",
        "phase_retries": {"3": 2, "4": 1},
        "failure_log": [
            {
                "iteration": 2,
                "phase": 3,
                "reason": "lint_failed",
                "action": "retry_from_phase_3",
                "timestamp": "2026-01-13T09:15:00",
            },
            {
                "iteration": 4,
                "phase": 4,
                "reason": "tests_failed",
                "action": "retry_from_phase_3",
                "timestamp": "2026-01-13T09:30:00",
            },
        ],
    }


# =============================================================================
# RALPH FAILURE ENTRY TESTS
# =============================================================================

class TestRalphFailureEntry:
    """Tests for RalphFailureEntry dataclass."""

    def test_create_failure_entry(self, sample_failure_entry):
        """Test creating a RalphFailureEntry."""
        entry = RalphFailureEntry(**sample_failure_entry)

        assert entry.iteration == 3
        assert entry.phase == 4
        assert entry.reason == "tests_failed"
        assert entry.action == "retry_from_phase_3"
        assert entry.timestamp == "2026-01-13T10:00:00"

    def test_failure_entry_to_dict(self, sample_failure_entry):
        """Test converting RalphFailureEntry to dict."""
        entry = RalphFailureEntry(**sample_failure_entry)
        data = entry.to_dict()

        assert data["iteration"] == 3
        assert data["phase"] == 4
        assert data["reason"] == "tests_failed"
        assert data["action"] == "retry_from_phase_3"
        assert data["timestamp"] == "2026-01-13T10:00:00"

    def test_failure_entry_from_dict(self, sample_failure_entry):
        """Test creating RalphFailureEntry from dict."""
        entry = RalphFailureEntry.from_dict(sample_failure_entry)

        assert entry.iteration == 3
        assert entry.phase == 4
        assert entry.reason == "tests_failed"

    def test_failure_entry_different_reasons(self):
        """Test failure entries with different failure reasons."""
        reasons = ["tests_failed", "lint_failed", "build_failed"]

        for reason in reasons:
            entry = RalphFailureEntry(
                iteration=1,
                phase=3,
                reason=reason,
                action=f"retry_for_{reason}",
                timestamp="2026-01-13T10:00:00",
            )
            assert entry.reason == reason


# =============================================================================
# RALPH LOOP STATE INITIALIZATION TESTS
# =============================================================================

class TestRalphLoopStateInitialization:
    """Tests for RalphLoopState initialization and defaults."""

    def test_ralph_state_default_values(self):
        """Test RalphLoopState has correct default values."""
        state = RalphLoopState()

        # Verify all defaults
        assert state.enabled is False
        assert state.iteration == 1
        assert state.max_iterations == 50
        assert state.completion_promise == "WORKFLOW COMPLETE"
        assert state.completion_detected is False
        assert state.overnight_mode is False
        assert state.log_file is None
        assert state.started_at is None
        assert state.phase_retries == {}
        assert state.failure_log == []

        # Safety limits
        assert state.MAX_PHASE_RETRIES == 3
        assert state.MAX_FAILURE_LOG == 100

    def test_ralph_state_custom_values(self):
        """Test RalphLoopState with custom values."""
        state = RalphLoopState(
            enabled=True,
            iteration=10,
            max_iterations=25,
            completion_promise="DONE",
            overnight_mode=True,
        )

        assert state.enabled is True
        assert state.iteration == 10
        assert state.max_iterations == 25
        assert state.completion_promise == "DONE"
        assert state.overnight_mode is True

    def test_ralph_state_create_new_factory(self):
        """Test RalphLoopState.create_new factory method."""
        state = RalphLoopState.create_new(
            max_iterations=20,
            completion_promise="FEATURE DONE",
            overnight_mode=True,
            log_file="/tmp/test.log",
        )

        assert state.enabled is True
        assert state.iteration == 1
        assert state.max_iterations == 20
        assert state.completion_promise == "FEATURE DONE"
        assert state.overnight_mode is True
        assert state.log_file == "/tmp/test.log"
        assert state.started_at is not None
        assert state.phase_retries == {}
        assert state.failure_log == []


# =============================================================================
# RALPH LOOP STATE RETRY LOGIC TESTS
# =============================================================================

class TestRalphLoopStateRetryLogic:
    """Tests for RalphLoopState retry logic."""

    def test_should_retry_phase_no_retries(self):
        """Test should_retry_phase when no retries have occurred."""
        state = RalphLoopState()

        # All phases should be retryable
        for phase in range(6):
            assert state.should_retry_phase(phase) is True

    def test_should_retry_phase_under_limit(self):
        """Test should_retry_phase when under retry limit."""
        state = RalphLoopState()
        state.phase_retries = {"3": 1, "4": 2}

        # Phase 3 has 1 retry (under 3 limit)
        assert state.should_retry_phase(3) is True

        # Phase 4 has 2 retries (under 3 limit)
        assert state.should_retry_phase(4) is True

        # Phase 2 has 0 retries
        assert state.should_retry_phase(2) is True

    def test_should_retry_phase_at_limit(self):
        """Test should_retry_phase when at retry limit (max 3)."""
        state = RalphLoopState()
        state.phase_retries = {"3": 3}  # At limit

        # Phase 3 should NOT be retryable
        assert state.should_retry_phase(3) is False

        # Other phases should still be retryable
        assert state.should_retry_phase(2) is True
        assert state.should_retry_phase(4) is True

    def test_should_retry_phase_over_limit(self):
        """Test should_retry_phase when over retry limit."""
        state = RalphLoopState()
        state.phase_retries = {"3": 5}  # Over limit (shouldn't happen normally)

        assert state.should_retry_phase(3) is False

    def test_get_retry_count(self):
        """Test get_retry_count returns correct counts."""
        state = RalphLoopState()
        state.phase_retries = {"2": 1, "3": 2, "4": 0}

        assert state.get_retry_count(2) == 1
        assert state.get_retry_count(3) == 2
        assert state.get_retry_count(4) == 0
        assert state.get_retry_count(5) == 0  # Not in dict

    def test_reset_phase_retries(self):
        """Test reset_phase_retries clears all retries."""
        state = RalphLoopState()
        state.phase_retries = {"2": 1, "3": 2, "4": 3}

        state.reset_phase_retries()

        assert state.phase_retries == {}
        assert state.get_retry_count(2) == 0
        assert state.get_retry_count(3) == 0


# =============================================================================
# RALPH LOOP STATE RECORD RETRY TESTS
# =============================================================================

class TestRalphLoopStateRecordRetry:
    """Tests for RalphLoopState record_retry method."""

    def test_record_retry_increments_count(self):
        """Test record_retry increments phase retry count."""
        state = RalphLoopState(iteration=5)

        state.record_retry(3, "tests_failed", "retry_from_phase_3")

        assert state.phase_retries["3"] == 1

        state.record_retry(3, "lint_failed", "retry_from_phase_3")

        assert state.phase_retries["3"] == 2

    def test_record_retry_adds_failure_entry(self):
        """Test record_retry adds entry to failure_log."""
        state = RalphLoopState(iteration=5)

        state.record_retry(4, "tests_failed", "retry_from_phase_3")

        assert len(state.failure_log) == 1
        entry = state.failure_log[0]

        assert entry.iteration == 5
        assert entry.phase == 4
        assert entry.reason == "tests_failed"
        assert entry.action == "retry_from_phase_3"
        assert entry.timestamp is not None

    def test_record_retry_multiple_phases(self):
        """Test record_retry for different phases."""
        state = RalphLoopState(iteration=1)

        state.record_retry(2, "build_failed", "retry_from_phase_2")
        state.iteration = 2
        state.record_retry(3, "lint_failed", "retry_from_phase_3")
        state.iteration = 3
        state.record_retry(4, "tests_failed", "retry_from_phase_3")

        assert state.phase_retries == {"2": 1, "3": 1, "4": 1}
        assert len(state.failure_log) == 3

    def test_record_retry_fifo_limit(self):
        """Test record_retry enforces FIFO limit on failure_log."""
        state = RalphLoopState(iteration=1)
        state.MAX_FAILURE_LOG = 3  # Override for test

        # Add 5 entries
        for i in range(5):
            state.iteration = i + 1
            state.record_retry(3, f"reason_{i}", f"action_{i}")

        # Should only have last 3
        assert len(state.failure_log) == 3
        assert state.failure_log[0].iteration == 3
        assert state.failure_log[2].iteration == 5


# =============================================================================
# RALPH LOOP STATE IS_ACTIVE TESTS
# =============================================================================

class TestRalphLoopStateIsActive:
    """Tests for RalphLoopState is_active method."""

    def test_is_active_when_enabled(self):
        """Test is_active returns True when enabled and under limit."""
        state = RalphLoopState(
            enabled=True,
            iteration=5,
            max_iterations=50,
            completion_detected=False,
        )

        assert state.is_active() is True

    def test_is_active_when_disabled(self):
        """Test is_active returns False when disabled."""
        state = RalphLoopState(
            enabled=False,
            iteration=5,
            max_iterations=50,
            completion_detected=False,
        )

        assert state.is_active() is False

    def test_is_active_when_completion_detected(self):
        """Test is_active returns False when completion detected."""
        state = RalphLoopState(
            enabled=True,
            iteration=5,
            max_iterations=50,
            completion_detected=True,
        )

        assert state.is_active() is False

    def test_is_active_at_max_iterations(self):
        """Test is_active returns True at exactly max_iterations."""
        state = RalphLoopState(
            enabled=True,
            iteration=50,
            max_iterations=50,
            completion_detected=False,
        )

        # At limit, still active
        assert state.is_active() is True

    def test_is_active_over_max_iterations(self):
        """Test is_active returns False when over max_iterations."""
        state = RalphLoopState(
            enabled=True,
            iteration=51,
            max_iterations=50,
            completion_detected=False,
        )

        assert state.is_active() is False

    def test_is_active_edge_cases(self):
        """Test is_active edge cases."""
        # Iteration 1, max 1
        state = RalphLoopState(enabled=True, iteration=1, max_iterations=1)
        assert state.is_active() is True

        # Iteration 2, max 1
        state.iteration = 2
        assert state.is_active() is False


# =============================================================================
# RALPH LOOP STATE SERIALIZATION TESTS
# =============================================================================

class TestRalphLoopStateSerialization:
    """Tests for RalphLoopState to_dict and from_dict."""

    def test_to_dict_complete(self, sample_ralph_state_data):
        """Test to_dict includes all fields."""
        state = RalphLoopState.from_dict(sample_ralph_state_data)
        data = state.to_dict()

        assert data["enabled"] is True
        assert data["iteration"] == 5
        assert data["max_iterations"] == 30
        assert data["completion_promise"] == "TASK COMPLETE"
        assert data["completion_detected"] is False
        assert data["overnight_mode"] is True
        assert data["log_file"] == "/tmp/ralph.log"
        assert data["started_at"] == "2026-01-13T09:00:00"
        assert data["phase_retries"] == {"3": 2, "4": 1}
        assert len(data["failure_log"]) == 2

    def test_to_dict_failure_log_serialized(self):
        """Test to_dict properly serializes failure_log entries."""
        state = RalphLoopState(iteration=1)
        state.record_retry(3, "tests_failed", "retry_from_phase_3")

        data = state.to_dict()

        assert len(data["failure_log"]) == 1
        entry = data["failure_log"][0]
        assert entry["phase"] == 3
        assert entry["reason"] == "tests_failed"

    def test_from_dict_complete(self, sample_ralph_state_data):
        """Test from_dict restores all fields."""
        state = RalphLoopState.from_dict(sample_ralph_state_data)

        assert state.enabled is True
        assert state.iteration == 5
        assert state.max_iterations == 30
        assert state.completion_promise == "TASK COMPLETE"
        assert state.overnight_mode is True
        assert state.log_file == "/tmp/ralph.log"
        assert len(state.failure_log) == 2
        assert state.phase_retries == {"3": 2, "4": 1}

    def test_from_dict_failure_log_restored(self, sample_ralph_state_data):
        """Test from_dict properly restores failure_log entries."""
        state = RalphLoopState.from_dict(sample_ralph_state_data)

        assert len(state.failure_log) == 2

        entry = state.failure_log[0]
        assert isinstance(entry, RalphFailureEntry)
        assert entry.iteration == 2
        assert entry.phase == 3
        assert entry.reason == "lint_failed"

    def test_from_dict_defaults_for_missing(self):
        """Test from_dict uses defaults for missing fields."""
        data = {"enabled": True}  # Minimal data

        state = RalphLoopState.from_dict(data)

        assert state.enabled is True
        assert state.iteration == 1
        assert state.max_iterations == 50
        assert state.completion_promise == "WORKFLOW COMPLETE"
        assert state.failure_log == []
        assert state.phase_retries == {}

    def test_roundtrip_serialization(self, sample_ralph_state_data):
        """Test full roundtrip: from_dict -> to_dict -> from_dict."""
        state1 = RalphLoopState.from_dict(sample_ralph_state_data)
        data = state1.to_dict()
        state2 = RalphLoopState.from_dict(data)

        assert state1.enabled == state2.enabled
        assert state1.iteration == state2.iteration
        assert state1.max_iterations == state2.max_iterations
        assert state1.completion_promise == state2.completion_promise
        assert state1.phase_retries == state2.phase_retries
        assert len(state1.failure_log) == len(state2.failure_log)

    def test_empty_state_roundtrip(self):
        """Test roundtrip with default empty state."""
        state1 = RalphLoopState()
        data = state1.to_dict()
        state2 = RalphLoopState.from_dict(data)

        assert state2.enabled is False
        assert state2.iteration == 1
        assert state2.failure_log == []
