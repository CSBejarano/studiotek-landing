"""
Tests for workflow-task v2.0 AgentRegistry.

Tests agent profile loading, domain matching, and context building.
"""

import pytest
from pathlib import Path
import sys

# Add paths for imports
SKILL_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(SKILL_ROOT))


# =============================================================================
# AgentProfile Tests
# =============================================================================


class TestAgentProfile:
    """Tests for AgentProfile dataclass."""

    def test_profile_creation(self) -> None:
        """Test basic profile creation."""
        from models.agent_state import AgentProfile

        profile = AgentProfile(
            domain_id="backend",
            display_name="Backend Expert",
            keywords=["fastapi", "api", "endpoint"],
        )

        assert profile.domain_id == "backend"
        assert profile.display_name == "Backend Expert"
        assert "fastapi" in profile.keywords

    def test_profile_to_dict(self) -> None:
        """Test profile serialization."""
        from models.agent_state import AgentProfile

        profile = AgentProfile(
            domain_id="testing",
            display_name="Testing Expert",
            keywords=["pytest", "mock"],
            file_patterns=["**/tests/**"],
        )
        data = profile.to_dict()

        assert data["domain_id"] == "testing"
        assert data["display_name"] == "Testing Expert"
        assert "pytest" in data["keywords"]
        assert "**/tests/**" in data["file_patterns"]

    def test_profile_from_dict(self) -> None:
        """Test profile deserialization."""
        from models.agent_state import AgentProfile

        data = {
            "domain_id": "database",
            "display_name": "Database Expert",
            "keywords": ["sql", "migration"],
            "tools_preferred": ["Read", "Edit"],
        }
        profile = AgentProfile.from_dict(data)

        assert profile.domain_id == "database"
        assert profile.display_name == "Database Expert"
        assert "sql" in profile.keywords


# =============================================================================
# AgentMatch Tests
# =============================================================================


class TestAgentMatch:
    """Tests for AgentMatch dataclass."""

    def test_match_creation(self) -> None:
        """Test basic match creation."""
        from models.agent_state import AgentMatch

        match = AgentMatch(
            domain_id="backend",
            confidence=0.85,
            matched_keywords=["fastapi", "endpoint"],
        )

        assert match.domain_id == "backend"
        assert match.confidence == 0.85
        assert len(match.matched_keywords) == 2

    def test_match_to_dict(self) -> None:
        """Test match serialization."""
        from models.agent_state import AgentMatch

        match = AgentMatch(
            domain_id="api",
            confidence=0.7,
            matched_keywords=["rest", "json"],
            reasoning="Matched REST keywords",
        )
        data = match.to_dict()

        assert data["domain_id"] == "api"
        assert data["confidence"] == 0.7
        assert "Matched REST keywords" in data["reasoning"]


# =============================================================================
# AgentContext Tests
# =============================================================================


class TestAgentContext:
    """Tests for AgentContext dataclass."""

    def test_context_creation(self) -> None:
        """Test basic context creation."""
        from models.agent_state import AgentProfile, AgentContext

        profile = AgentProfile(domain_id="backend", display_name="Backend")
        context = AgentContext(
            profile=profile,
            key_concepts=["Clean Architecture", "DI"],
            success_rate=0.9,
            tasks_handled=10,
        )

        assert context.profile.domain_id == "backend"
        assert context.success_rate == 0.9
        assert context.tasks_handled == 10

    def test_context_get_prompt_context(self) -> None:
        """Test prompt context generation."""
        from models.agent_state import AgentProfile, AgentContext

        profile = AgentProfile(domain_id="testing", display_name="Testing Expert")
        context = AgentContext(
            profile=profile,
            key_concepts=["TDD", "Mocking"],
            common_patterns=["AAA Pattern"],
            success_rate=0.85,
            tasks_handled=5,
        )

        prompt = context.get_prompt_context()

        assert "Testing Expert" in prompt
        assert "TDD" in prompt
        assert "85%" in prompt


# =============================================================================
# DomainExpert Tests
# =============================================================================


class TestDomainExpert:
    """Tests for DomainExpert dataclass."""

    def test_expert_creation(self) -> None:
        """Test basic expert creation."""
        from models.agent_state import AgentProfile, DomainExpert

        profile = AgentProfile(domain_id="security", display_name="Security Expert")
        expert = DomainExpert(profile=profile)

        assert expert.profile.domain_id == "security"
        assert expert.is_active is False

    def test_expert_activate(self) -> None:
        """Test expert activation."""
        from models.agent_state import AgentProfile, DomainExpert

        profile = AgentProfile(domain_id="infra", display_name="Infra Expert")
        expert = DomainExpert(profile=profile)

        expert.activate()

        assert expert.is_active is True
        assert expert.activated_at is not None

    def test_expert_deactivate(self) -> None:
        """Test expert deactivation."""
        from models.agent_state import AgentProfile, DomainExpert

        profile = AgentProfile(domain_id="frontend", display_name="Frontend")
        expert = DomainExpert(profile=profile)

        expert.activate()
        expert.deactivate()

        assert expert.is_active is False


# =============================================================================
# AgentRegistry Tests
# =============================================================================


class TestAgentRegistry:
    """Tests for AgentRegistry class."""

    def test_registry_creation(self, workflow_skill_root: Path) -> None:
        """Test basic registry creation."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)

        assert len(registry.list_domains()) >= 7  # 7 default domains

    def test_registry_list_domains(self, workflow_skill_root: Path) -> None:
        """Test listing available domains."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        domains = registry.list_domains()

        assert "backend" in domains
        assert "frontend" in domains
        assert "database" in domains
        assert "testing" in domains
        assert "api" in domains
        assert "security" in domains
        assert "infra" in domains

    def test_registry_get_profile(self, workflow_skill_root: Path) -> None:
        """Test getting a domain profile."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        profile = registry.get_profile("backend")

        assert profile is not None
        assert profile.domain_id == "backend"
        assert "fastapi" in profile.keywords

    def test_registry_get_profile_not_found(self, workflow_skill_root: Path) -> None:
        """Test getting a non-existent profile."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        profile = registry.get_profile("nonexistent")

        assert profile is None

    def test_registry_match_backend(self, workflow_skill_root: Path) -> None:
        """Test matching backend domain."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain("Add new FastAPI endpoint for users")

        assert match.domain_id == "backend"
        assert match.confidence >= 0.3
        assert "fastapi" in match.matched_keywords or "endpoint" in match.matched_keywords

    def test_registry_match_testing(self, workflow_skill_root: Path) -> None:
        """Test matching testing domain."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain("Add pytest unit tests for the service")

        assert match.domain_id == "testing"
        assert match.confidence >= 0.3

    def test_registry_match_database(self, workflow_skill_root: Path) -> None:
        """Test matching database domain."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain("Create migration for new users table")

        assert match.domain_id == "database"
        assert match.confidence >= 0.3

    def test_registry_match_security(self, workflow_skill_root: Path) -> None:
        """Test matching security domain."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain("Fix JWT authentication vulnerability")

        assert match.domain_id == "security"
        assert match.confidence >= 0.3

    def test_registry_match_with_files(self, workflow_skill_root: Path) -> None:
        """Test matching with file patterns."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain(
            "Update the component",
            files=["src/components/Button.tsx"],
        )

        # Should match frontend due to .tsx pattern
        assert match.domain_id in ("frontend", "backend")

    def test_registry_match_fallback(self, workflow_skill_root: Path) -> None:
        """Test fallback to default domain."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        match = registry.match_domain("Do something completely unrelated xyz123")

        # Should fallback to backend with lower confidence
        assert match.domain_id == "backend"

    def test_registry_get_agent_context(self, workflow_skill_root: Path) -> None:
        """Test building agent context."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        context = registry.get_agent_context("backend")

        assert context.profile.domain_id == "backend"
        assert context.profile.display_name == "Backend Expert"

    def test_registry_get_agent_context_with_memory(
        self, workflow_skill_root: Path, sample_agent_memory_data: dict
    ) -> None:
        """Test building agent context with memory."""
        from core.agent_registry import AgentRegistry
        from models.memory_state import AgentMemory

        registry = AgentRegistry(workflow_skill_root)
        memory = AgentMemory.from_dict(sample_agent_memory_data)
        context = registry.get_agent_context("api", memory=memory)

        assert context.profile.domain_id == "api"
        assert context.tasks_handled == memory.tasks_handled
        assert context.success_rate == memory.success_rate

    def test_registry_activate_expert(self, workflow_skill_root: Path) -> None:
        """Test activating an expert."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        expert = registry.activate_expert("backend")

        assert expert is not None
        assert expert.is_active is True
        assert expert.context is not None

    def test_registry_deactivate_expert(self, workflow_skill_root: Path) -> None:
        """Test deactivating an expert."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        registry.activate_expert("backend")
        registry.deactivate_expert("backend")

        expert = registry.get_expert("backend")
        assert expert is not None
        assert expert.is_active is False

    def test_registry_deactivate_all(self, workflow_skill_root: Path) -> None:
        """Test deactivating all experts."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        registry.activate_expert("backend")
        registry.activate_expert("testing")
        registry.deactivate_all()

        active = registry.get_active_experts()
        assert len(active) == 0

    def test_registry_get_all_keywords(self, workflow_skill_root: Path) -> None:
        """Test getting all keywords."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        keywords = registry.get_all_keywords()

        assert "backend" in keywords
        assert "testing" in keywords
        assert len(keywords["backend"]) > 0

    def test_registry_find_domains_by_keyword(self, workflow_skill_root: Path) -> None:
        """Test finding domains by keyword."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)
        domains = registry.find_domains_by_keyword("test")

        assert "testing" in domains


# =============================================================================
# Factory Tests
# =============================================================================


class TestAgentRegistryFactory:
    """Tests for agent registry factory."""

    def test_create_agent_registry(self, workflow_skill_root: Path) -> None:
        """Test factory function."""
        from core.agent_registry import create_agent_registry

        registry = create_agent_registry(workflow_skill_root)

        assert registry is not None
        assert len(registry.list_domains()) >= 7


# =============================================================================
# Integration Tests
# =============================================================================


class TestAgentRegistryIntegration:
    """Integration tests for agent registry."""

    def test_full_workflow(self, workflow_skill_root: Path) -> None:
        """Test complete workflow with registry."""
        from core.agent_registry import AgentRegistry

        registry = AgentRegistry(workflow_skill_root)

        # Match a task
        match = registry.match_domain("Add pytest integration tests")
        assert match.domain_id == "testing"

        # Activate the matched expert
        expert = registry.activate_expert(match.domain_id)
        assert expert is not None
        assert expert.is_active is True

        # Get context
        context = expert.context
        assert context is not None

        # Generate prompt context
        prompt = context.get_prompt_context()
        assert "Testing" in prompt

        # Deactivate
        registry.deactivate_all()
        assert len(registry.get_active_experts()) == 0
