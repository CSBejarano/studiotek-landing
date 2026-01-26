"""
Memory Manager v2.0

Orchestrates the 3-tier memory system:
- TIER 1: short_term.json (session, ~50KB max)
- TIER 2: long_term.yaml (project, persistent)
- TIER 3: agents/memory/*.yaml (per agent)

Key responsibilities:
- Load/save each tier
- Promote learnings between tiers
- Consolidate workflow completions
- Provide unified context for phases
"""

import json
import os
import re
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Try to import yaml, fallback to basic parser
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

# Import models (relative import for skill context)
try:
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
    )
except ImportError:
    # Absolute import fallback
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
    )


class MemoryManager:
    """
    Orchestrator for the 3-tier memory system.

    Usage:
        manager = MemoryManager(project_root)
        manager.start_session("issue-64", "Implement WhatsApp API")

        # During workflow
        manager.record_tool_event(...)
        manager.record_decision(...)

        # Complete
        manager.consolidate_workflow(success_rate=1.0)
    """

    # Promotion thresholds
    DECISION_CONFIDENCE_THRESHOLD = 0.8
    DECISION_VALIDATED_THRESHOLD = 2
    BLOCKER_OCCURRENCE_THRESHOLD = 2

    def __init__(self, project_root: Optional[Path] = None):
        """
        Initialize MemoryManager.

        Args:
            project_root: Root directory of the project.
                         Defaults to current working directory.
        """
        self.project_root = Path(project_root) if project_root else Path.cwd()

        # Paths - All data stored in ai_docs/
        self._memoria_dir = self.project_root / "ai_docs" / "memoria"
        self._agents_memory_dir = self.project_root / "ai_docs" / "expertise" / "domain-experts"
        self._templates_dir = self.project_root / "ai_docs" / "templates"

        # State
        self._short_term: Optional[ShortTermMemory] = None
        self._long_term: Optional[LongTermMemory] = None
        self._agent_memories: Dict[str, AgentMemory] = {}

        # Ensure directories exist
        self._memoria_dir.mkdir(parents=True, exist_ok=True)

    # =========================================================================
    # TIER 1: SHORT-TERM MEMORY
    # =========================================================================

    @property
    def short_term(self) -> Optional[ShortTermMemory]:
        """Get current short-term memory."""
        return self._short_term

    @property
    def short_term_path(self) -> Path:
        """Path to short-term memory file."""
        return self._memoria_dir / "short_term.json"

    def start_session(
        self,
        workflow_id: str,
        task_description: str,
        complexity_score: int = 0,
        domain: Optional[str] = None,
    ) -> ShortTermMemory:
        """
        Start a new workflow session (TIER 1).

        Args:
            workflow_id: Unique identifier for the workflow
            task_description: Human description of the task
            complexity_score: Complexity score (0-10)
            domain: Primary domain for this workflow (e.g., 'backend', 'frontend')

        Returns:
            New ShortTermMemory instance
        """
        now = datetime.now(timezone.utc).isoformat()

        self._short_term = ShortTermMemory(
            workflow_id=workflow_id,
            task_description=task_description,
            session_start=now,
            complexity_score=complexity_score,
            active_domain=domain,
        )

        # Persist immediately
        self._save_short_term()

        return self._short_term

    def load_short_term(self) -> Optional[ShortTermMemory]:
        """
        Load existing short-term memory from disk.

        Returns:
            ShortTermMemory if exists, None otherwise
        """
        if not self.short_term_path.exists():
            return None

        try:
            with open(self.short_term_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            self._short_term = ShortTermMemory.from_dict(data)
            return self._short_term
        except (json.JSONDecodeError, KeyError) as e:
            print(f"[MemoryManager] Warning: Failed to load short_term.json: {e}")
            return None

    def _save_short_term(self) -> None:
        """Save short-term memory to disk atomically."""
        if self._short_term is None:
            return

        data = self._short_term.to_dict()
        self._atomic_write_json(self.short_term_path, data)

    def purge_short_term(self) -> None:
        """Delete short-term memory (after workflow completion)."""
        if self.short_term_path.exists():
            self.short_term_path.unlink()
        self._short_term = None

    # =========================================================================
    # TIER 2: LONG-TERM MEMORY
    # =========================================================================

    @property
    def long_term(self) -> Optional[LongTermMemory]:
        """Get current long-term memory."""
        return self._long_term

    @property
    def long_term_path(self) -> Path:
        """Path to long-term memory file."""
        return self._memoria_dir / "long_term.yaml"

    def load_long_term(self) -> LongTermMemory:
        """
        Load long-term memory from disk (TIER 2).

        Creates empty if doesn't exist.

        Returns:
            LongTermMemory instance
        """
        if self._long_term is not None:
            return self._long_term

        if not self.long_term_path.exists():
            self._long_term = LongTermMemory(
                project_id=self.project_root.name,
                updated_at=datetime.now(timezone.utc).isoformat(),
            )
            self._save_long_term()
            return self._long_term

        try:
            data = self._read_yaml(self.long_term_path)
            self._long_term = LongTermMemory.from_dict(data)
            return self._long_term
        except Exception as e:
            print(f"[MemoryManager] Warning: Failed to load long_term.yaml: {e}")
            self._long_term = LongTermMemory(project_id=self.project_root.name)
            return self._long_term

    def _save_long_term(self) -> None:
        """Save long-term memory to disk atomically."""
        if self._long_term is None:
            return

        self._long_term.updated_at = datetime.now(timezone.utc).isoformat()
        data = self._long_term.to_dict()
        self._atomic_write_yaml(self.long_term_path, data)

    # =========================================================================
    # TIER 3: AGENT MEMORY
    # =========================================================================

    def load_agent_memory(self, domain_id: str) -> AgentMemory:
        """
        Load memory for a specific agent (TIER 3).

        Creates from template if doesn't exist.

        Args:
            domain_id: Agent identifier (backend, frontend, etc.)

        Returns:
            AgentMemory instance
        """
        if domain_id in self._agent_memories:
            return self._agent_memories[domain_id]

        agent_path = self._agents_memory_dir / f"{domain_id}.yaml"

        if not agent_path.exists():
            # Create from template
            agent = AgentMemory(
                domain_id=domain_id,
                display_name=domain_id.title() + " Expert",
                updated_at=datetime.now(timezone.utc).isoformat(),
            )
            self._agent_memories[domain_id] = agent
            self._save_agent_memory(domain_id)
            return agent

        try:
            data = self._read_yaml(agent_path)
            agent = AgentMemory.from_dict(data)
            self._agent_memories[domain_id] = agent
            return agent
        except Exception as e:
            print(f"[MemoryManager] Warning: Failed to load {domain_id}.yaml: {e}")
            agent = AgentMemory(domain_id=domain_id, display_name=domain_id.title())
            self._agent_memories[domain_id] = agent
            return agent

    def _save_agent_memory(self, domain_id: str) -> None:
        """Save agent memory to disk atomically."""
        if domain_id not in self._agent_memories:
            return

        agent = self._agent_memories[domain_id]
        agent.updated_at = datetime.now(timezone.utc).isoformat()
        data = agent.to_dict()

        agent_path = self._agents_memory_dir / f"{domain_id}.yaml"
        self._atomic_write_yaml(agent_path, data)

    def save_all_agent_memories(self) -> None:
        """Save all loaded agent memories."""
        for domain_id in self._agent_memories:
            self._save_agent_memory(domain_id)

    def _update_agent_stats_regex(self, domain_id: str, success: bool) -> bool:
        """
        Update agent stats using regex to preserve file format and comments.

        This method updates only tasks_handled, success_rate, and updated_at
        without rewriting the entire file, preserving YAML comments and structure.

        Args:
            domain_id: Agent identifier (backend, frontend, etc.)
            success: Whether the workflow was successful

        Returns:
            True if updated successfully, False otherwise
        """
        agent_path = self._agents_memory_dir / f"{domain_id}.yaml"
        if not agent_path.exists():
            return False

        try:
            content = agent_path.read_text(encoding="utf-8")

            # 1. Extract current values for calculation
            tasks_match = re.search(r"tasks_handled:\s*(\d+)", content)
            rate_match = re.search(r"success_rate:\s*([\d.]+)", content)

            if not tasks_match:
                return False

            current_tasks = int(tasks_match.group(1))
            current_rate = float(rate_match.group(1)) if rate_match else 1.0

            # 2. Calculate new values
            new_tasks = current_tasks + 1
            successes = int(current_rate * current_tasks)
            if success:
                successes += 1
            new_rate = successes / new_tasks

            # 3. Update tasks_handled
            content = re.sub(
                r"tasks_handled:\s*\d+",
                f"tasks_handled: {new_tasks}",
                content,
            )

            # 4. Update success_rate
            content = re.sub(
                r"success_rate:\s*[\d.]+",
                f"success_rate: {new_rate}",
                content,
            )

            # 5. Update updated_at timestamp (handle both quoted and unquoted)
            now = datetime.now(timezone.utc).isoformat()
            content = re.sub(
                r"updated_at:\s*['\"]?[^'\"\n]*['\"]?",
                f"updated_at: '{now}'",
                content,
            )

            # 6. Write back
            agent_path.write_text(content, encoding="utf-8")
            return True

        except Exception as e:
            print(f"[MemoryManager] Error updating agent stats with regex: {e}")
            return False

    def _append_agent_decision_regex(
        self,
        domain_id: str,
        context: str,
        decision: str,
        confidence: float,
        tags: List[str],
    ) -> Optional[str]:
        """
        Append a new decision to agent memory using regex, preserving file format.

        Args:
            domain_id: Agent identifier (backend, frontend, etc.)
            context: The situation or problem being addressed
            decision: The chosen solution or approach
            confidence: Confidence level (0.0 to 1.0)
            tags: Classification tags

        Returns:
            The generated decision ID if successful, None otherwise
        """
        agent_path = self._agents_memory_dir / f"{domain_id}.yaml"
        if not agent_path.exists():
            return None

        try:
            content = agent_path.read_text(encoding="utf-8")

            # Generate new ID by finding the highest existing ID
            existing_ids = re.findall(r'id:\s*"([^"]+)"', content)
            domain_prefix = domain_id.upper()[:2]
            max_num = 0
            for existing_id in existing_ids:
                match = re.search(rf'{domain_prefix}-\w+-(\d+)', existing_id)
                if match:
                    max_num = max(max_num, int(match.group(1)))
            new_id = f"{domain_prefix}-DECISION-{max_num + 1:03d}"

            # Format the new decision in YAML (using original field names from file)
            now = datetime.now(timezone.utc).isoformat()
            tags_str = json.dumps(tags) if tags else "[]"

            new_decision = f'''
  - id: "{new_id}"
    context: "{context}"
    decision: "{decision}"
    confidence_score: {confidence}
    validated_count: 1
    failed_count: 0
    last_used: "{now}"
    tags: {tags_str}
'''

            # Find where to insert (before "# Domain blockers" or "blockers:")
            marker_patterns = [
                r'\n# Domain blockers',
                r'\nblockers:',
                r'\n# File patterns',
                r'\nfile_patterns_discovered:',
            ]

            insert_pos = None
            for pattern in marker_patterns:
                match = re.search(pattern, content)
                if match:
                    insert_pos = match.start()
                    break

            if insert_pos:
                content = content[:insert_pos] + new_decision + content[insert_pos:]
            else:
                # Fallback: append before the last line
                content = content.rstrip() + new_decision + "\n"

            agent_path.write_text(content, encoding="utf-8")
            return new_id

        except Exception as e:
            print(f"[MemoryManager] Error appending decision with regex: {e}")
            return None

    def _append_agent_blocker_regex(
        self,
        domain_id: str,
        symptom: str,
        solution: str,
        description: Optional[str] = None,
        root_cause: Optional[str] = None,
        prevention: Optional[str] = None,
        severity: str = "medium",
        tags: Optional[List[str]] = None,
    ) -> Optional[str]:
        """
        Append a new blocker to agent memory using regex, preserving file format.

        Args:
            domain_id: Agent identifier (backend, frontend, etc.)
            symptom: What the problem looks like
            solution: How to fix it
            description: Detailed description of the blocker
            root_cause: Root cause analysis
            prevention: How to prevent in the future
            severity: Impact level (low, medium, high, critical)
            tags: Classification tags

        Returns:
            The generated blocker ID if successful, None otherwise
        """
        agent_path = self._agents_memory_dir / f"{domain_id}.yaml"
        if not agent_path.exists():
            return None

        try:
            content = agent_path.read_text(encoding="utf-8")

            # Generate new ID by finding the highest existing blocker ID
            existing_ids = re.findall(r'id:\s*"(BLK-[^"]+)"', content)
            max_num = 0
            for existing_id in existing_ids:
                match = re.search(r'BLK-\w+-(\d+)', existing_id)
                if match:
                    max_num = max(max_num, int(match.group(1)))
            new_id = f"BLK-{domain_id.upper()[:4]}-{max_num + 1:03d}"

            # Format the new blocker in YAML (using original field names from file)
            now = datetime.now(timezone.utc).isoformat()
            tags_str = json.dumps(tags) if tags else "[]"

            # Build blocker with optional fields
            new_blocker = f'''
  - id: "{new_id}"
    description: "{description or symptom}"
    symptom: "{symptom}"
    root_cause: "{root_cause or 'To be determined'}"
    solution: "{solution}"
    prevention: "{prevention or 'To be documented'}"
    severity: "{severity}"
    discovered: "{now}"
    resolved: true
    tags: {tags_str}
'''

            # Find where to insert (before "# File patterns" or end of blockers section)
            marker_patterns = [
                r'\n# File patterns',
                r'\nfile_patterns_discovered:',
                r'\n# Project-specific',
                r'\nproject_info:',
            ]

            insert_pos = None
            for pattern in marker_patterns:
                match = re.search(pattern, content)
                if match:
                    insert_pos = match.start()
                    break

            if insert_pos:
                content = content[:insert_pos] + new_blocker + content[insert_pos:]
            else:
                # Fallback: append at end of file
                content = content.rstrip() + new_blocker + "\n"

            agent_path.write_text(content, encoding="utf-8")
            return new_id

        except Exception as e:
            print(f"[MemoryManager] Error appending blocker with regex: {e}")
            return None

    # =========================================================================
    # RECORDING EVENTS
    # =========================================================================

    def record_tool_event(
        self,
        tool: str,
        success: bool,
        file: Optional[str] = None,
        error: Optional[str] = None,
        correction: Optional[str] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Record a tool invocation event.

        Args:
            tool: Tool name (Edit, Read, Bash, etc.)
            success: Whether the call succeeded
            file: File path involved
            error: Error message if failed
            correction: Fix that resolved the error
            params: Additional parameters
        """
        if self._short_term is None:
            return

        event = ToolEvent(
            timestamp=datetime.now(timezone.utc).isoformat(),
            tool=tool,
            success=success,
            file=file,
            error=error,
            correction=correction,
            params=params,
        )
        self._short_term.add_tool_event(event)
        self._save_short_term()

    def record_decision(
        self,
        context: str,
        decision: str,
        confidence: float = 0.5,
        tags: Optional[List[str]] = None,
        source: str = "manual",
    ) -> None:
        """
        Record a pending decision.

        Args:
            context: The situation or problem
            decision: The chosen solution
            confidence: Confidence level (0.0 to 1.0)
            tags: Classification tags
            source: Where this came from (manual, git, DECISIONS.md)
        """
        if self._short_term is None:
            return

        pending = PendingDecision(
            context=context,
            decision=decision,
            confidence=confidence,
            tags=tags or [],
            source=source,
        )
        self._short_term.add_decision(pending)
        self._save_short_term()

    def record_blocker(
        self,
        symptom: str,
        solution: Optional[str] = None,
        severity: str = "medium",
        tags: Optional[List[str]] = None,
    ) -> None:
        """
        Record an active blocker.

        Args:
            symptom: What the problem looks like
            solution: How to fix it (if known)
            severity: Impact level (low, medium, high, critical)
            tags: Classification tags
        """
        if self._short_term is None:
            return

        blocker = ActiveBlocker(
            symptom=symptom,
            solution=solution,
            severity=severity,
            tags=tags or [],
            phase=self._short_term.current_phase,
            resolved=solution is not None,
        )
        self._short_term.add_blocker(blocker)
        self._save_short_term()

    def resolve_blocker(self, symptom: str, solution: str) -> bool:
        """
        Resolve an active blocker by symptom match.

        Args:
            symptom: The blocker symptom to match (substring match)
            solution: How it was resolved

        Returns:
            True if a blocker was found and resolved
        """
        if self._short_term is None:
            return False

        for blocker in self._short_term.blockers_active:
            if symptom.lower() in blocker.symptom.lower() and not blocker.resolved:
                blocker.solution = solution
                blocker.resolved = True
                self._save_short_term()
                return True

        return False

    # =========================================================================
    # PHASE MANAGEMENT
    # =========================================================================

    def start_phase(self, phase_id: int) -> None:
        """
        Start a new phase.

        Args:
            phase_id: Phase number (-1 to 5)
        """
        if self._short_term is None:
            return

        self._short_term.current_phase = phase_id
        self._short_term.phase_status = "IN_PROGRESS"
        self._short_term.phase_timings[phase_id] = PhaseTiming(
            start=datetime.now(timezone.utc).isoformat()
        )
        self._save_short_term()

    def complete_phase(self, phase_id: int) -> float:
        """
        Complete a phase.

        Args:
            phase_id: Phase number

        Returns:
            Duration in minutes
        """
        if self._short_term is None:
            return 0.0

        now = datetime.now(timezone.utc)
        timing = self._short_term.phase_timings.get(phase_id)

        if timing:
            timing.end = now.isoformat()
            start = datetime.fromisoformat(timing.start.replace("Z", "+00:00"))
            duration = (now - start).total_seconds() / 60.0
            timing.duration_min = round(duration, 2)
        else:
            duration = 0.0

        self._short_term.phase_status = "COMPLETED"
        self._save_short_term()

        return duration

    def set_active_domain(self, domain_id: str) -> None:
        """Set the active domain expert."""
        if self._short_term is None:
            return

        self._short_term.active_domain = domain_id
        self._save_short_term()

        # Pre-load agent memory
        self.load_agent_memory(domain_id)

    # =========================================================================
    # PROMOTION & CONSOLIDATION
    # =========================================================================

    def promote_to_long_term(self) -> Dict[str, int]:
        """
        Promote eligible learnings from short-term to long-term.

        Returns:
            Dict with counts of promoted items
        """
        if self._short_term is None or self._long_term is None:
            return {"decisions": 0, "blockers": 0}

        result = {"decisions": 0, "blockers": 0}

        # Promote decisions
        for pending in self._short_term.decisions_pending:
            if self._should_promote_decision(pending):
                validated = ValidatedDecision(
                    id=f"D{len(self._long_term.decisions) + 1:03d}",
                    context=pending.context,
                    decision=pending.decision,
                    confidence=pending.confidence,
                    validated_count=pending.validated_count + 1,
                    last_used=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    tags=pending.tags,
                )
                self._long_term.add_decision(validated)
                result["decisions"] += 1

        # Promote blockers
        for active in self._short_term.blockers_active:
            if self._should_promote_blocker(active):
                solved = SolvedBlocker(
                    id=f"B{len(self._long_term.blockers) + 1:03d}",
                    symptom=active.symptom,
                    solution=active.solution or "Unknown",
                    occurrences=1,
                    last_seen=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    tags=active.tags,
                )
                self._long_term.add_blocker(solved)
                result["blockers"] += 1

        self._save_long_term()
        return result

    def _should_promote_decision(self, decision: PendingDecision) -> bool:
        """Check if a decision should be promoted."""
        return (
            decision.confidence >= self.DECISION_CONFIDENCE_THRESHOLD
            and decision.validated_count >= self.DECISION_VALIDATED_THRESHOLD
        )

    def _should_promote_blocker(self, blocker: ActiveBlocker) -> bool:
        """Check if a blocker should be promoted."""
        return blocker.resolved and blocker.solution is not None

    def promote_to_agent(self, domain_id: str) -> Dict[str, int]:
        """
        Promote learnings to agent memory using regex append.

        This method appends new decisions and blockers to the agent memory file
        without rewriting the entire file, preserving comments and original format.

        Args:
            domain_id: Target agent

        Returns:
            Dict with counts of promoted items
        """
        if self._short_term is None:
            return {"decisions": 0, "blockers": 0}

        result = {"decisions": 0, "blockers": 0}

        # Add domain-specific decisions using regex append
        for pending in self._short_term.decisions_pending:
            if self._is_domain_relevant(pending.tags, domain_id):
                new_id = self._append_agent_decision_regex(
                    domain_id=domain_id,
                    context=pending.context,
                    decision=pending.decision,
                    confidence=pending.confidence,
                    tags=pending.tags,
                )
                if new_id:
                    result["decisions"] += 1

        # Add domain-specific blockers using regex append
        for active in self._short_term.blockers_active:
            if active.resolved and self._is_domain_relevant(active.tags, domain_id):
                new_id = self._append_agent_blocker_regex(
                    domain_id=domain_id,
                    symptom=active.symptom,
                    solution=active.solution or "Unknown",
                    severity=active.severity,
                    tags=active.tags,
                )
                if new_id:
                    result["blockers"] += 1

        return result

    def _is_domain_relevant(self, tags: List[str], domain_id: str) -> bool:
        """Check if tags are relevant to a domain."""
        if not tags:
            return False
        domain_keywords = {
            "backend": ["api", "fastapi", "async", "service", "repository"],
            "frontend": ["react", "vue", "css", "component", "ui"],
            "database": ["sql", "postgres", "migration", "rls", "query"],
            "testing": ["test", "pytest", "mock", "fixture", "coverage"],
            "api": ["rest", "graphql", "openapi", "endpoint", "route"],
            "security": ["auth", "jwt", "owasp", "injection", "rls"],
            "infra": ["docker", "k8s", "ci", "cd", "terraform"],
        }
        keywords = domain_keywords.get(domain_id, [domain_id])
        return any(kw in tag.lower() for tag in tags for kw in keywords)

    def consolidate_workflow(
        self,
        result: Optional[str] = None,
        duration_min: Optional[float] = None,
        success_rate: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Consolidate completed workflow.

        This is called at the end of a workflow to:
        1. Promote learnings to long-term
        2. Promote to agent memory
        3. Update statistics
        4. Purge short-term

        Args:
            result: Workflow result (SUCCESS, PARTIAL, FAILED)
            duration_min: Total duration in minutes
            success_rate: Success rate (0.0 to 1.0), used if result not provided

        Returns:
            Summary of consolidation
        """
        if self._short_term is None:
            return {"error": "No active session"}

        # Ensure long-term is loaded
        self.load_long_term()

        # Calculate total duration if not provided
        if duration_min is None:
            duration_min = 0.0
            for timing in self._short_term.phase_timings.values():
                if timing.duration_min:
                    duration_min += timing.duration_min

        # Determine result if not provided
        if result is None:
            result = "SUCCESS" if success_rate >= 0.8 else "PARTIAL" if success_rate >= 0.5 else "FAILED"

        # Add to history
        entry = WorkflowHistoryEntry(
            id=self._short_term.workflow_id,
            result=result,
            duration_min=round(duration_min, 2),
            domain=self._short_term.active_domain,
            complexity=self._short_term.complexity_score,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self._long_term.add_history(entry)
        self._long_term.workflows_completed += 1

        # Update tool stats
        for event in self._short_term.tool_events:
            if event.tool not in self._long_term.tools:
                self._long_term.tools[event.tool] = ToolStats()
            if event.success:
                self._long_term.tools[event.tool].success_count += 1
            else:
                self._long_term.tools[event.tool].fail_count += 1

        # Update velocity
        self._update_velocity(duration_min, success_rate)

        # Promote learnings
        promoted = self.promote_to_long_term()

        # Promote to agent
        agent_promoted = {"decisions": 0, "blockers": 0}
        if self._short_term.active_domain:
            agent_promoted = self.promote_to_agent(self._short_term.active_domain)
            # Update agent stats using regex to preserve file format
            self._update_agent_stats_regex(
                self._short_term.active_domain,
                success_rate >= 0.8
            )

        # Save long-term
        self._save_long_term()

        # Build summary
        summary = {
            "workflow_id": self._short_term.workflow_id,
            "duration_min": duration_min,
            "success_rate": success_rate,
            "decisions_promoted": promoted["decisions"],
            "blockers_promoted": promoted["blockers"],
            "agent_decisions": agent_promoted["decisions"],
            "agent_blockers": agent_promoted["blockers"],
            "total_tool_events": len(self._short_term.tool_events),
        }

        # Purge short-term
        self.purge_short_term()

        return summary

    def _update_velocity(self, total_duration: float, success_rate: float) -> None:
        """Update velocity statistics."""
        if self._short_term is None or self._long_term is None:
            return

        # Update by phase
        for phase_id, timing in self._short_term.phase_timings.items():
            if timing.duration_min is None:
                continue

            phase_name = self._phase_id_to_name(phase_id)
            if phase_name not in self._long_term.velocity.by_phase:
                self._long_term.velocity.by_phase[phase_name] = PhaseVelocity(
                    avg_min=timing.duration_min,
                    samples=1,
                )
            else:
                pv = self._long_term.velocity.by_phase[phase_name]
                # Running average
                new_avg = (pv.avg_min * pv.samples + timing.duration_min) / (pv.samples + 1)
                pv.avg_min = round(new_avg, 2)
                pv.samples += 1

        # Update by complexity
        complexity = self._short_term.complexity_score
        if complexity <= 3:
            level = "low"
        elif complexity <= 7:
            level = "medium"
        else:
            level = "high"

        if level not in self._long_term.velocity.by_complexity:
            self._long_term.velocity.by_complexity[level] = ComplexityVelocity(
                avg_min=total_duration,
                success_rate=success_rate,
                samples=1,
            )
        else:
            cv = self._long_term.velocity.by_complexity[level]
            new_avg = (cv.avg_min * cv.samples + total_duration) / (cv.samples + 1)
            new_sr = (cv.success_rate * cv.samples + success_rate) / (cv.samples + 1)
            cv.avg_min = round(new_avg, 2)
            cv.success_rate = round(new_sr, 3)
            cv.samples += 1

    def _phase_id_to_name(self, phase_id: int) -> str:
        """Convert phase ID to name."""
        names = {
            -1: "continuity",
            0: "pre_phase",
            1: "planning",
            2: "execution",
            3: "review",
            4: "qa",
            5: "validation",
        }
        return names.get(phase_id, f"phase_{phase_id}")

    # =========================================================================
    # CONTEXT RETRIEVAL
    # =========================================================================

    def get_context(
        self,
        phase_id: int = 0,
        task_description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Get combined context from all memory tiers.

        Args:
            phase_id: Current phase
            task_description: Task for agent matching

        Returns:
            Combined context dict
        """
        context: Dict[str, Any] = {
            "phase": phase_id,
            "phase_name": self._phase_id_to_name(phase_id),
        }

        # Add short-term context
        if self._short_term:
            context["workflow_id"] = self._short_term.workflow_id
            context["task"] = self._short_term.task_description
            context["complexity"] = self._short_term.complexity_score
            context["active_domain"] = self._short_term.active_domain
            context["files_modified"] = self._short_term.context_snapshot.files_modified

        # Add long-term suggestions
        if self._long_term:
            # Find relevant decisions
            relevant_decisions = []
            for d in self._long_term.decisions[-10:]:  # Last 10
                relevant_decisions.append({
                    "context": d.context,
                    "decision": d.decision,
                    "confidence": d.confidence,
                })
            context["suggested_decisions"] = relevant_decisions

            # Add velocity estimate
            phase_name = self._phase_id_to_name(phase_id)
            if phase_name in self._long_term.velocity.by_phase:
                pv = self._long_term.velocity.by_phase[phase_name]
                context["estimated_duration_min"] = pv.avg_min

        # Add agent context
        if self._short_term and self._short_term.active_domain:
            agent = self._agent_memories.get(self._short_term.active_domain)
            if agent:
                context["domain_context"] = {
                    "key_concepts": agent.context.key_concepts,
                    "common_patterns": agent.context.common_patterns,
                    "anti_patterns": agent.context.anti_patterns,
                    "preferred_tools": agent.context.preferred_tools,
                }

        return context

    # =========================================================================
    # FILE I/O UTILITIES
    # =========================================================================

    def _atomic_write_json(self, path: Path, data: Dict[str, Any]) -> None:
        """Write JSON file atomically using temp file + rename."""
        path.parent.mkdir(parents=True, exist_ok=True)

        fd, temp_path = tempfile.mkstemp(
            suffix=".json",
            prefix=".",
            dir=path.parent,
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            os.replace(temp_path, path)
        except Exception:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            raise

    def _atomic_write_yaml(self, path: Path, data: Dict[str, Any]) -> None:
        """Write YAML file atomically using temp file + rename."""
        path.parent.mkdir(parents=True, exist_ok=True)

        fd, temp_path = tempfile.mkstemp(
            suffix=".yaml",
            prefix=".",
            dir=path.parent,
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                if HAS_YAML:
                    yaml.dump(
                        data,
                        f,
                        default_flow_style=False,
                        allow_unicode=True,
                        sort_keys=False,
                    )
                else:
                    # Fallback to basic YAML serialization
                    self._write_basic_yaml(f, data)
            os.replace(temp_path, path)
        except Exception:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            raise

    def _read_yaml(self, path: Path) -> Dict[str, Any]:
        """Read YAML file."""
        with open(path, "r", encoding="utf-8") as f:
            if HAS_YAML:
                return yaml.safe_load(f) or {}
            else:
                return self._parse_basic_yaml(f.read())

    def _write_basic_yaml(self, f, data: Any, indent: int = 0) -> None:
        """Basic YAML writer without dependencies."""
        prefix = "  " * indent

        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, (dict, list)) and value:
                    f.write(f"{prefix}{key}:\n")
                    self._write_basic_yaml(f, value, indent + 1)
                elif isinstance(value, list) and not value:
                    f.write(f"{prefix}{key}: []\n")
                elif isinstance(value, dict) and not value:
                    f.write(f"{prefix}{key}: {{}}\n")
                elif value is None:
                    f.write(f"{prefix}{key}: null\n")
                elif isinstance(value, bool):
                    f.write(f"{prefix}{key}: {str(value).lower()}\n")
                elif isinstance(value, str):
                    if "\n" in value or ":" in value:
                        f.write(f'{prefix}{key}: "{value}"\n')
                    else:
                        f.write(f"{prefix}{key}: {value}\n")
                else:
                    f.write(f"{prefix}{key}: {value}\n")
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, dict):
                    f.write(f"{prefix}-\n")
                    self._write_basic_yaml(f, item, indent + 1)
                else:
                    f.write(f"{prefix}- {item}\n")

    def _parse_basic_yaml(self, content: str) -> Dict[str, Any]:
        """
        Basic YAML parser without dependencies.

        Supports:
        - Simple key: value pairs
        - Nested dictionaries (via indentation)
        - Lists of scalars (- item)
        - Lists of dictionaries (- key: value)
        - Quoted strings
        - Basic types (int, float, bool, null)
        """
        lines = content.split("\n")
        return self._parse_yaml_lines(lines, 0, 0)[0]

    def _get_indent(self, line: str) -> int:
        """Get indentation level of a line."""
        return len(line) - len(line.lstrip())

    def _parse_value(self, value: str) -> Any:
        """Parse a YAML value string to Python type."""
        value = value.strip()
        if value == "" or value == "{}":
            return {}
        elif value == "[]":
            return []
        elif value == "null" or value == "~":
            return None
        elif value == "true":
            return True
        elif value == "false":
            return False
        elif (value.startswith('"') and value.endswith('"')) or \
             (value.startswith("'") and value.endswith("'")):
            return value[1:-1]
        else:
            try:
                return int(value)
            except ValueError:
                try:
                    return float(value)
                except ValueError:
                    return value

    def _parse_yaml_lines(
        self, lines: List[str], start_idx: int, base_indent: int
    ) -> Tuple[Dict[str, Any], int]:
        """
        Parse YAML lines starting from start_idx with given base indentation.

        Returns:
            Tuple of (parsed dict, next line index to process)
        """
        result: Dict[str, Any] = {}
        idx = start_idx
        current_key: Optional[str] = None
        current_list: Optional[List[Any]] = None

        while idx < len(lines):
            line = lines[idx]
            stripped = line.strip()

            # Skip empty lines and comments
            if not stripped or stripped.startswith("#"):
                idx += 1
                continue

            indent = self._get_indent(line)

            # If we've dedented past our base, we're done with this block
            if indent < base_indent and stripped:
                break

            # Handle list items
            if stripped.startswith("- "):
                list_content = stripped[2:].strip()

                # Determine which list this belongs to
                if current_key is not None and isinstance(result.get(current_key), list):
                    target_list = result[current_key]
                elif current_list is not None:
                    target_list = current_list
                else:
                    # Orphan list item - skip
                    idx += 1
                    continue

                # Check if it's a key: value pair (start of dict in list)
                if ":" in list_content:
                    key, _, value = list_content.partition(":")
                    key = key.strip()
                    value = value.strip()

                    # Start a new dict for this list item
                    item_dict: Dict[str, Any] = {}

                    if value:
                        item_dict[key] = self._parse_value(value)
                    else:
                        item_dict[key] = {}

                    # Look ahead for more keys at higher indent
                    idx += 1
                    item_indent = indent + 2  # Expected indent for item properties

                    while idx < len(lines):
                        next_line = lines[idx]
                        next_stripped = next_line.strip()

                        if not next_stripped or next_stripped.startswith("#"):
                            idx += 1
                            continue

                        next_indent = self._get_indent(next_line)

                        # If dedented or same level with dash, item is complete
                        if next_indent <= indent:
                            break
                        if next_stripped.startswith("- "):
                            break

                        # Parse key: value at item level
                        if ":" in next_stripped:
                            k, _, v = next_stripped.partition(":")
                            k = k.strip()
                            v = v.strip()

                            if v:
                                item_dict[k] = self._parse_value(v)
                            else:
                                # Could be a nested list
                                item_dict[k] = []
                                # Look ahead for list items
                                idx += 1
                                while idx < len(lines):
                                    peek_line = lines[idx]
                                    peek_stripped = peek_line.strip()

                                    if not peek_stripped or peek_stripped.startswith("#"):
                                        idx += 1
                                        continue

                                    peek_indent = self._get_indent(peek_line)

                                    if peek_indent <= next_indent:
                                        break

                                    if peek_stripped.startswith("- "):
                                        item_dict[k].append(
                                            self._parse_value(peek_stripped[2:].strip())
                                        )
                                        idx += 1
                                    else:
                                        break
                                continue

                        idx += 1

                    target_list.append(item_dict)
                    continue
                else:
                    # Simple list item
                    target_list.append(self._parse_value(list_content))
                    idx += 1
                    continue

            # Handle key: value pairs
            if ":" in stripped:
                key, _, value = stripped.partition(":")
                key = key.strip()
                value = value.strip()

                if value:
                    result[key] = self._parse_value(value)
                    current_key = None
                else:
                    # Value is on next lines (could be dict or list)
                    # Look ahead to determine type
                    next_idx = idx + 1
                    while next_idx < len(lines):
                        next_line = lines[next_idx]
                        next_stripped = next_line.strip()
                        if next_stripped and not next_stripped.startswith("#"):
                            break
                        next_idx += 1

                    if next_idx < len(lines):
                        next_stripped = lines[next_idx].strip()
                        if next_stripped.startswith("- "):
                            result[key] = []
                            current_key = key
                        else:
                            result[key] = {}
                            current_key = key
                    else:
                        result[key] = {}
                        current_key = key

            idx += 1

        return result, idx


def create_memory_manager(project_root: Optional[Path] = None) -> MemoryManager:
    """
    Factory function to create a MemoryManager.

    Args:
        project_root: Root directory of the project

    Returns:
        Configured MemoryManager instance
    """
    return MemoryManager(project_root)
