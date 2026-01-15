"""
Agent Registry v2.0

Manages domain expert agents including:
- Loading agent profiles from registry.yaml
- Matching tasks to domains
- Building agent context from memory
- Activating/deactivating experts

Usage:
    registry = AgentRegistry(skill_root)
    match = registry.match_domain("Add FastAPI endpoint for users")
    context = registry.get_agent_context(match.domain_id)
"""

import fnmatch
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Try to import yaml
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

# Import models
try:
    from ..models.agent_state import (
        AgentProfile,
        AgentMatch,
        AgentContext,
        DomainExpert,
        DEFAULT_AGENT_PROFILES,
    )
    from ..models.memory_state import AgentMemory
except ImportError:
    from models.agent_state import (
        AgentProfile,
        AgentMatch,
        AgentContext,
        DomainExpert,
        DEFAULT_AGENT_PROFILES,
    )
    from models.memory_state import AgentMemory


class AgentRegistry:
    """
    Registry for domain expert agents.

    Handles loading, matching, and context building for agents.
    """

    def __init__(self, skill_root: Path):
        """
        Initialize the agent registry.

        Args:
            skill_root: Path to the skill directory
        """
        self._skill_root = skill_root
        self._agents_dir = skill_root / "agents"
        self._registry_path = self._agents_dir / "registry.yaml"
        self._memory_dir = self._agents_dir / "memory"
        self._prompts_dir = self._agents_dir / "prompts"

        # Loaded state
        self._profiles: Dict[str, AgentProfile] = {}
        self._experts: Dict[str, DomainExpert] = {}
        self._config: Dict[str, Any] = {}

        # Load registry
        self._load_registry()

    # =========================================================================
    # LOADING
    # =========================================================================

    def _load_registry(self) -> None:
        """Load agent profiles from registry.yaml."""
        if self._registry_path.exists() and HAS_YAML:
            try:
                with open(self._registry_path) as f:
                    data = yaml.safe_load(f)

                self._config = data.get("matching", {})

                for domain_id, agent_data in data.get("agents", {}).items():
                    profile = self._parse_profile(domain_id, agent_data)
                    self._profiles[domain_id] = profile
                    self._experts[domain_id] = DomainExpert(
                        profile=profile,
                        prompt_template=str(self._prompts_dir / f"{domain_id}.md"),
                    )
            except Exception:
                # Fallback to defaults
                self._load_defaults()
        else:
            self._load_defaults()

    def _load_defaults(self) -> None:
        """Load default agent profiles."""
        for domain_id, profile in DEFAULT_AGENT_PROFILES.items():
            self._profiles[domain_id] = profile
            self._experts[domain_id] = DomainExpert(
                profile=profile,
                prompt_template=str(self._prompts_dir / f"{domain_id}.md"),
            )

    def _parse_profile(self, domain_id: str, data: Dict[str, Any]) -> AgentProfile:
        """Parse profile from registry data."""
        # Flatten keywords if nested
        keywords = []
        kw_data = data.get("keywords", {})
        if isinstance(kw_data, dict):
            keywords.extend(kw_data.get("primary", []))
            keywords.extend(kw_data.get("secondary", []))
        elif isinstance(kw_data, list):
            keywords = kw_data

        return AgentProfile(
            domain_id=domain_id,
            display_name=data.get("display_name", domain_id.title()),
            description=data.get("description", ""),
            keywords=keywords,
            file_patterns=data.get("file_patterns", []),
            tools_preferred=data.get("tools_preferred", []),
            anti_patterns=data.get("anti_patterns", []),
        )

    # =========================================================================
    # MATCHING
    # =========================================================================

    def match_domain(
        self,
        task_description: str,
        files: Optional[List[str]] = None,
    ) -> AgentMatch:
        """
        Match a task to the best domain agent.

        Args:
            task_description: Human description of the task
            files: Optional list of files involved

        Returns:
            AgentMatch with best matching domain
        """
        scores: Dict[str, Tuple[float, List[str], List[str]]] = {}
        task_lower = task_description.lower()

        keyword_weight = self._config.get("keyword_weight", 0.6)
        pattern_weight = self._config.get("pattern_weight", 0.4)

        for domain_id, profile in self._profiles.items():
            keyword_score, matched_kw = self._score_keywords(task_lower, profile.keywords)
            pattern_score, matched_patterns = self._score_patterns(files or [], profile.file_patterns)

            total_score = (keyword_score * keyword_weight) + (pattern_score * pattern_weight)
            scores[domain_id] = (total_score, matched_kw, matched_patterns)

        # Find best match
        best_domain = max(scores, key=lambda d: scores[d][0])
        best_score, matched_kw, matched_patterns = scores[best_domain]

        # Check minimum confidence
        min_confidence = self._config.get("min_confidence", 0.3)
        if best_score < min_confidence:
            fallback = self._config.get("fallback_domain", "backend")
            return AgentMatch(
                domain_id=fallback,
                confidence=0.5,
                matched_keywords=[],
                matched_patterns=[],
                reasoning=f"Low confidence ({best_score:.2f}), using fallback: {fallback}",
            )

        return AgentMatch(
            domain_id=best_domain,
            confidence=min(best_score, 1.0),
            matched_keywords=matched_kw,
            matched_patterns=matched_patterns,
            reasoning=self._generate_reasoning(best_domain, matched_kw, matched_patterns),
        )

    def _score_keywords(
        self,
        text: str,
        keywords: List[str],
    ) -> Tuple[float, List[str]]:
        """
        Score keyword matches in text.

        Uses a boost system: each match adds points instead of dividing by total.
        This rewards finding matches without penalizing domains with many keywords.
        Supports stemming-like matching (test matches tests, testing, etc.)
        """
        if not keywords:
            return 0.0, []

        matched = []
        for keyword in keywords:
            kw_lower = keyword.lower()
            # Check for stemmed/substring match - keyword as prefix in words
            # e.g., "test" matches "test", "tests", "testing"
            pattern = r'\b' + re.escape(kw_lower) + r'\w*\b'
            if re.search(pattern, text):
                matched.append(keyword)

        # Boost scoring: each match adds 0.25, capped at 1.0
        # This means 1 match = 0.25, 2 matches = 0.5, 3 matches = 0.75, 4+ = 1.0
        base_boost = self._config.get("keyword_boost", 0.25)
        score = min(len(matched) * base_boost, 1.0)
        return score, matched

    def _score_patterns(
        self,
        files: List[str],
        patterns: List[str],
    ) -> Tuple[float, List[str]]:
        """
        Score file pattern matches.

        Uses boost system like keywords: each match adds points.
        """
        if not patterns or not files:
            return 0.0, []

        matched_patterns = []
        for pattern in patterns:
            for file_path in files:
                if fnmatch.fnmatch(file_path, pattern):
                    if pattern not in matched_patterns:
                        matched_patterns.append(pattern)
                    break

        # Boost scoring: each match adds 0.35, capped at 1.0
        base_boost = self._config.get("pattern_boost", 0.35)
        score = min(len(matched_patterns) * base_boost, 1.0)
        return score, matched_patterns

    def _generate_reasoning(
        self,
        domain_id: str,
        keywords: List[str],
        patterns: List[str],
    ) -> str:
        """Generate reasoning for domain match."""
        parts = []

        if keywords:
            parts.append(f"Matched keywords: {', '.join(keywords[:3])}")

        if patterns:
            parts.append(f"Matched patterns: {', '.join(patterns[:2])}")

        profile = self._profiles.get(domain_id)
        if profile:
            parts.append(f"Domain: {profile.display_name}")

        return "; ".join(parts) if parts else f"Best match: {domain_id}"

    # =========================================================================
    # CONTEXT
    # =========================================================================

    def get_agent_context(
        self,
        domain_id: str,
        memory: Optional[AgentMemory] = None,
    ) -> AgentContext:
        """
        Build agent context for a domain.

        Args:
            domain_id: Domain identifier
            memory: Optional pre-loaded agent memory

        Returns:
            AgentContext with profile and memory data
        """
        profile = self._profiles.get(domain_id)
        if not profile:
            # Use fallback
            fallback = self._config.get("fallback_domain", "backend")
            profile = self._profiles.get(fallback, DEFAULT_AGENT_PROFILES["backend"])

        context = AgentContext(profile=profile)

        if memory:
            context.key_concepts = memory.context.key_concepts
            context.common_patterns = memory.context.common_patterns
            context.relevant_decisions = [d.to_dict() for d in memory.decisions]
            context.known_blockers = [b.to_dict() for b in memory.blockers]
            context.success_rate = memory.success_rate
            context.tasks_handled = memory.tasks_handled

        return context

    def get_expert(self, domain_id: str) -> Optional[DomainExpert]:
        """Get a domain expert by ID."""
        return self._experts.get(domain_id)

    def activate_expert(
        self,
        domain_id: str,
        memory: Optional[AgentMemory] = None,
    ) -> Optional[DomainExpert]:
        """
        Activate a domain expert.

        Args:
            domain_id: Domain to activate
            memory: Optional agent memory

        Returns:
            Activated DomainExpert or None
        """
        expert = self._experts.get(domain_id)
        if not expert:
            return None

        expert.context = self.get_agent_context(domain_id, memory)
        expert.activate()

        return expert

    def deactivate_expert(self, domain_id: str) -> None:
        """Deactivate a domain expert."""
        expert = self._experts.get(domain_id)
        if expert:
            expert.deactivate()

    def deactivate_all(self) -> None:
        """Deactivate all experts."""
        for expert in self._experts.values():
            expert.deactivate()

    # =========================================================================
    # QUERIES
    # =========================================================================

    def list_domains(self) -> List[str]:
        """List all available domain IDs."""
        return list(self._profiles.keys())

    def get_profile(self, domain_id: str) -> Optional[AgentProfile]:
        """Get profile for a domain."""
        return self._profiles.get(domain_id)

    def get_active_experts(self) -> List[DomainExpert]:
        """Get list of currently active experts."""
        return [e for e in self._experts.values() if e.is_active]

    def get_all_keywords(self) -> Dict[str, List[str]]:
        """Get all keywords by domain."""
        return {
            domain_id: profile.keywords
            for domain_id, profile in self._profiles.items()
        }

    def find_domains_by_keyword(self, keyword: str) -> List[str]:
        """Find domains that match a keyword."""
        keyword_lower = keyword.lower()
        matches = []

        for domain_id, profile in self._profiles.items():
            for kw in profile.keywords:
                if keyword_lower in kw.lower():
                    matches.append(domain_id)
                    break

        return matches


# =============================================================================
# FACTORY
# =============================================================================


def create_agent_registry(skill_root: Path) -> AgentRegistry:
    """
    Create an agent registry instance.

    Args:
        skill_root: Path to the skill directory

    Returns:
        Configured AgentRegistry
    """
    return AgentRegistry(skill_root)
