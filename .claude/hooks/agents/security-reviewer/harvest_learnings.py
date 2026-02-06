#!/usr/bin/env python3
"""Harvest learnings for security-reviewer agent."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "shared"))
from harvest_base import extract_learnings, update_yaml_learnings

DOMAIN_YAML = Path("ai_docs/expertise/domain-experts/security.yaml")


def main() -> int:
    """Main entry point for harvesting learnings."""
    agent_output = sys.stdin.read()
    learnings = extract_learnings(agent_output)

    if learnings:
        project_root = Path.cwd()
        yaml_path = project_root / DOMAIN_YAML
        if update_yaml_learnings(yaml_path, learnings):
            print(f"[harvest] Saved {len(learnings)} learnings to {DOMAIN_YAML}", file=sys.stderr)
        else:
            print(f"[harvest] Could not save learnings to {DOMAIN_YAML}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
