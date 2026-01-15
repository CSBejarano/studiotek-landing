"""
Agent State Models v2.0

Dataclasses for agent state management including:
- AgentProfile: Static agent configuration
- AgentContext: Runtime context for an agent
- AgentMatch: Result of domain matching
- DomainExpert: Complete expert definition
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional


class AgentDomain(Enum):
    """Supported agent domains."""

    BACKEND = "backend"
    FRONTEND = "frontend"
    DATABASE = "database"
    TESTING = "testing"
    API = "api"
    SECURITY = "security"
    INFRA = "infra"


@dataclass
class AgentProfile:
    """
    Static configuration for a domain agent.

    Loaded from agents/registry.yaml.

    Attributes:
        domain_id: Unique domain identifier
        display_name: Human-readable name
        description: What this agent handles
        keywords: Keywords for domain matching
        file_patterns: Glob patterns for file matching
        tools_preferred: Preferred tools for this domain
        anti_patterns: Patterns to avoid
    """

    domain_id: str
    display_name: str
    description: str = ""
    keywords: List[str] = field(default_factory=list)
    file_patterns: List[str] = field(default_factory=list)
    tools_preferred: List[str] = field(default_factory=list)
    anti_patterns: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "domain_id": self.domain_id,
            "display_name": self.display_name,
            "description": self.description,
            "keywords": self.keywords,
            "file_patterns": self.file_patterns,
            "tools_preferred": self.tools_preferred,
            "anti_patterns": self.anti_patterns,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentProfile":
        """Create from dictionary."""
        return cls(
            domain_id=data["domain_id"],
            display_name=data.get("display_name", data["domain_id"].title()),
            description=data.get("description", ""),
            keywords=data.get("keywords", []),
            file_patterns=data.get("file_patterns", []),
            tools_preferred=data.get("tools_preferred", []),
            anti_patterns=data.get("anti_patterns", []),
        )


@dataclass
class AgentMatch:
    """
    Result of matching a task to a domain agent.

    Attributes:
        domain_id: Matched domain ID
        confidence: Match confidence (0.0 to 1.0)
        matched_keywords: Keywords that matched
        matched_patterns: File patterns that matched
        reasoning: Why this domain was matched
    """

    domain_id: str
    confidence: float
    matched_keywords: List[str] = field(default_factory=list)
    matched_patterns: List[str] = field(default_factory=list)
    reasoning: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "domain_id": self.domain_id,
            "confidence": self.confidence,
            "matched_keywords": self.matched_keywords,
            "matched_patterns": self.matched_patterns,
            "reasoning": self.reasoning,
        }


@dataclass
class AgentContext:
    """
    Runtime context for an active agent.

    Built from AgentProfile + AgentMemory.

    Attributes:
        profile: Static agent profile
        key_concepts: Important concepts for this domain
        common_patterns: Patterns commonly used
        relevant_decisions: Past decisions for this domain
        known_blockers: Known blockers with solutions
        success_rate: Historical success rate
        tasks_handled: Number of tasks handled
    """

    profile: AgentProfile
    key_concepts: List[str] = field(default_factory=list)
    common_patterns: List[str] = field(default_factory=list)
    relevant_decisions: List[Dict[str, Any]] = field(default_factory=list)
    known_blockers: List[Dict[str, Any]] = field(default_factory=list)
    success_rate: float = 0.0
    tasks_handled: int = 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "profile": self.profile.to_dict(),
            "key_concepts": self.key_concepts,
            "common_patterns": self.common_patterns,
            "relevant_decisions": self.relevant_decisions,
            "known_blockers": self.known_blockers,
            "success_rate": self.success_rate,
            "tasks_handled": self.tasks_handled,
        }

    def get_prompt_context(self) -> str:
        """
        Generate context string for agent prompt.

        Returns:
            Formatted context for inclusion in prompts
        """
        lines = [
            f"## {self.profile.display_name} Context",
            "",
            f"**Domain:** {self.profile.domain_id}",
            f"**Experience:** {self.tasks_handled} tasks, {self.success_rate:.0%} success rate",
            "",
        ]

        if self.key_concepts:
            lines.append("**Key Concepts:**")
            for concept in self.key_concepts[:5]:
                lines.append(f"- {concept}")
            lines.append("")

        if self.common_patterns:
            lines.append("**Common Patterns:**")
            for pattern in self.common_patterns[:3]:
                lines.append(f"- {pattern}")
            lines.append("")

        if self.relevant_decisions:
            lines.append("**Relevant Past Decisions:**")
            for dec in self.relevant_decisions[:3]:
                lines.append(f"- {dec.get('context', 'N/A')}: {dec.get('decision', 'N/A')}")
            lines.append("")

        if self.known_blockers:
            lines.append("**Known Blockers & Solutions:**")
            for blocker in self.known_blockers[:3]:
                lines.append(f"- {blocker.get('symptom', 'N/A')} → {blocker.get('solution', 'N/A')}")
            lines.append("")

        return "\n".join(lines)


@dataclass
class DomainExpert:
    """
    Complete domain expert definition.

    Combines profile, memory, and runtime state.

    Attributes:
        profile: Static agent profile
        context: Runtime context (built from memory)
        is_active: Whether this expert is currently active
        activated_at: When this expert was activated
        prompt_template: Path to prompt template
    """

    profile: AgentProfile
    context: Optional[AgentContext] = None
    is_active: bool = False
    activated_at: Optional[str] = None
    prompt_template: Optional[str] = None

    def activate(self) -> None:
        """Activate this expert."""
        self.is_active = True
        self.activated_at = datetime.now(timezone.utc).isoformat()

    def deactivate(self) -> None:
        """Deactivate this expert."""
        self.is_active = False

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "profile": self.profile.to_dict(),
            "context": self.context.to_dict() if self.context else None,
            "is_active": self.is_active,
            "activated_at": self.activated_at,
            "prompt_template": self.prompt_template,
        }


# =============================================================================
# Default Profiles
# =============================================================================


DEFAULT_AGENT_PROFILES: Dict[str, AgentProfile] = {
    "backend": AgentProfile(
        domain_id="backend",
        display_name="Backend Expert",
        description="FastAPI, SQLAlchemy, async patterns, Clean Architecture",
        keywords=[
            "fastapi", "api", "endpoint", "route", "handler", "controller",
            "service", "use case", "repository", "async", "await",
        ],
        file_patterns=["**/app/**", "**/src/**", "**/*_service.py", "**/*_use_case.py"],
        tools_preferred=["Read", "Edit", "Grep"],
        anti_patterns=["Business logic in controllers", "N+1 queries"],
    ),
    "frontend": AgentProfile(
        domain_id="frontend",
        display_name="Frontend Expert",
        description="React, Vue, TypeScript, Tailwind CSS, component architecture",
        keywords=[
            "react", "vue", "component", "ui", "css", "tailwind", "button",
            "form", "modal", "hook", "state", "props",
        ],
        file_patterns=["**/components/**", "**/*.tsx", "**/*.jsx", "**/*.vue"],
        tools_preferred=["Read", "Edit", "Write"],
        anti_patterns=["Prop drilling", "Giant components"],
    ),
    "database": AgentProfile(
        domain_id="database",
        display_name="Database Expert",
        description="PostgreSQL, SQLAlchemy, migrations, RLS, indexing",
        keywords=[
            "sql", "migration", "alembic", "schema", "table", "index",
            "query", "rls", "postgres", "database", "model",
        ],
        file_patterns=["**/migrations/**", "**/models/**", "**/*_model.py"],
        tools_preferred=["Read", "Edit", "Bash"],
        anti_patterns=["Missing indexes", "N+1 queries", "Raw SQL injection"],
    ),
    "testing": AgentProfile(
        domain_id="testing",
        display_name="Testing Expert",
        description="Pytest, mocking, fixtures, coverage, TDD",
        keywords=[
            "test", "pytest", "mock", "fixture", "coverage", "unit",
            "integration", "e2e", "assert", "conftest",
        ],
        file_patterns=["**/tests/**", "**/*_test.py", "**/test_*.py", "**/conftest.py"],
        tools_preferred=["Read", "Edit", "Bash"],
        anti_patterns=["Flaky tests", "Missing assertions", "Test pollution"],
    ),
    "api": AgentProfile(
        domain_id="api",
        display_name="API Expert",
        description="REST, GraphQL, OpenAPI, request/response handling",
        keywords=[
            "rest", "graphql", "openapi", "swagger", "endpoint", "request",
            "response", "json", "http", "status code",
        ],
        file_patterns=["**/api/**", "**/routes/**", "**/schemas/**"],
        tools_preferred=["Read", "Edit", "WebFetch"],
        anti_patterns=["Missing validation", "Inconsistent responses"],
    ),
    "security": AgentProfile(
        domain_id="security",
        display_name="Security Expert",
        description="Authentication, authorization, OWASP, JWT, RBAC",
        keywords=[
            "auth", "jwt", "permission", "rbac", "owasp", "vulnerability",
            "token", "password", "encryption", "security",
        ],
        file_patterns=["**/auth/**", "**/security/**", "**/middleware/**"],
        tools_preferred=["Read", "Grep", "Edit"],
        anti_patterns=["Hardcoded secrets", "SQL injection", "XSS"],
    ),
    "infra": AgentProfile(
        domain_id="infra",
        display_name="Infrastructure Expert",
        description="Docker, Kubernetes, CI/CD, Terraform, deployment",
        keywords=[
            "docker", "kubernetes", "k8s", "ci", "cd", "deploy", "terraform",
            "nginx", "redis", "github actions", "pipeline",
        ],
        file_patterns=["**/Dockerfile*", "**/*.yaml", "**/.github/**", "**/deploy/**"],
        tools_preferred=["Read", "Edit", "Bash"],
        anti_patterns=["Secrets in code", "Missing health checks"],
    ),
}
