"""
Shared fixtures for workflow-task v2.0 tests.
"""

import json
import tempfile
from pathlib import Path
from typing import Generator

import pytest


@pytest.fixture
def temp_project_root() -> Generator[Path, None, None]:
    """Create a temporary project root for testing."""
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        # Create skill structure
        skill_dir = root / ".claude" / "skills" / "workflow-task-v2"
        skill_dir.mkdir(parents=True)

        # Create required directories
        (skill_dir / "memoria").mkdir()
        (skill_dir / "agents" / "memory").mkdir(parents=True)
        (skill_dir / "templates").mkdir()

        # Create SKILL.md marker
        (skill_dir / "SKILL.md").write_text("# workflow-task v2.0\n")

        yield root


@pytest.fixture
def skill_root(temp_project_root: Path) -> Path:
    """Return the skill root directory."""
    return temp_project_root / ".claude" / "skills" / "workflow-task-v2"


@pytest.fixture
def workflow_skill_root(temp_project_root: Path) -> Path:
    """Return the skill root with all required directories for workflow tests."""
    skill_root = temp_project_root / ".claude" / "skills" / "workflow-task-v2"

    # Ensure all directories exist
    (skill_root / "memoria").mkdir(parents=True, exist_ok=True)
    (skill_root / "agents" / "memory").mkdir(parents=True, exist_ok=True)
    (skill_root / "agents" / "prompts").mkdir(parents=True, exist_ok=True)
    (skill_root / "templates").mkdir(exist_ok=True)

    return skill_root


@pytest.fixture
def sample_tool_event() -> dict:
    """Sample tool event data."""
    return {
        "timestamp": "2025-12-28T10:00:00+00:00",
        "tool": "Edit",
        "success": True,
        "file": "app/service.py",
        "error": None,
        "correction": None,
        "params": {"line": 42},
    }


@pytest.fixture
def sample_decision() -> dict:
    """Sample pending decision data."""
    return {
        "context": "Rate limiting strategy",
        "decision": "Use Redis sliding window",
        "confidence": 0.85,
        "tags": ["api", "redis", "performance"],
        "source": "manual",
        "validated_count": 0,
    }


@pytest.fixture
def sample_blocker() -> dict:
    """Sample blocker data."""
    return {
        "symptom": "AsyncMock not awaitable",
        "solution": "Use mock.return_value = AsyncMock()",
        "severity": "medium",
        "tags": ["testing", "async"],
        "phase": 2,
        "resolved": True,
    }


@pytest.fixture
def sample_short_term_data() -> dict:
    """Sample short-term memory data."""
    return {
        "$schema": "2.0",
        "workflow_id": "2025-12-28_issue-64",
        "task_description": "Implement WhatsApp API",
        "session_start": "2025-12-28T10:00:00+00:00",
        "current_phase": 2,
        "phase_status": "IN_PROGRESS",
        "active_domain": "api",
        "complexity_score": 7,
        "tool_events": [],
        "decisions_pending": [],
        "blockers_active": [],
        "context_snapshot": {
            "files_read": [],
            "files_modified": [],
            "patterns_found": {},
        },
        "phase_timings": {},
    }


@pytest.fixture
def sample_long_term_data() -> dict:
    """Sample long-term memory data."""
    return {
        "version": "2.0",
        "project_id": "ideas",
        "updated_at": "2025-12-28T10:00:00+00:00",
        "workflows_completed": 5,
        "decisions": [
            {
                "id": "D001",
                "context": "Rate limiting",
                "decision": "Use Redis",
                "confidence": 0.9,
                "validated_count": 3,
                "failed_count": 0,
                "last_used": "2025-12-28",
                "tags": ["api", "redis"],
            }
        ],
        "blockers": [
            {
                "id": "B001",
                "symptom": "Timeout on large tables",
                "solution": "Use pt-online-schema-change",
                "prevention": "Check table size first",
                "occurrences": 2,
                "last_seen": "2025-12-27",
                "tags": ["database"],
            }
        ],
        "velocity": {
            "by_phase": {
                "execution": {"avg_min": 25.0, "samples": 5},
            },
            "by_complexity": {
                "medium": {"avg_min": 55.0, "success_rate": 0.9, "samples": 3},
            },
        },
        "tools": {
            "Edit": {"success_count": 100, "fail_count": 5},
            "Read": {"success_count": 150, "fail_count": 2},
        },
        "history": [
            {
                "id": "2025-12-27_issue-63",
                "result": "SUCCESS",
                "duration_min": 45.0,
                "domain": "api",
                "complexity": 6,
                "timestamp": "2025-12-27T15:00:00+00:00",
            }
        ],
    }


@pytest.fixture
def sample_agent_memory_data() -> dict:
    """Sample agent memory data."""
    return {
        "domain_id": "api",
        "display_name": "API Expert",
        "version": "1.0",
        "updated_at": "2025-12-28T10:00:00+00:00",
        "tasks_handled": 8,
        "success_rate": 0.92,
        "keywords": {
            "primary": ["endpoint", "rest", "graphql"],
            "secondary": ["router", "handler"],
            "file_patterns": ["**/api/**", "**/routes/**"],
            "exclude": ["test_"],
        },
        "context": {
            "key_concepts": ["API versioning", "Pagination"],
            "common_patterns": ["Router -> UseCase -> Repository"],
            "anti_patterns": ["Business logic in controllers"],
            "preferred_tools": ["Read", "Edit"],
        },
        "decisions": [
            {
                "id": "AD001",
                "scenario": "New REST endpoint",
                "decision": "Use OpenAPI with Pydantic",
                "rationale": "Auto docs + validation",
                "confidence": 0.88,
            }
        ],
        "blockers": [
            {
                "id": "AB001",
                "symptom": "CORS errors",
                "solution": "Configure CORS_ORIGINS",
                "domain_context": "Only in local dev",
            }
        ],
    }
