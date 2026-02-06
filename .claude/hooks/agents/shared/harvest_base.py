"""Base module for harvesting learnings from agent outputs."""

import re
import yaml
from datetime import datetime, timezone
from pathlib import Path


def extract_learnings(text: str) -> list[str]:
    """Extract learnings from text containing '### Aprendizajes' section.

    Looks for a markdown section starting with '### Aprendizajes' followed
    by a list of items prefixed with '- '.

    Args:
        text: Agent output text potentially containing learnings section.

    Returns:
        List of learning strings extracted from the section.
    """
    pattern = r"### Aprendizajes\n((?:- .+\n?)+)"
    match = re.search(pattern, text)
    if not match:
        return []
    learnings_text = match.group(1)
    learnings = [
        line.strip("- ").strip()
        for line in learnings_text.strip().split("\n")
        if line.strip().startswith("-")
    ]
    return learnings


def update_yaml_learnings(yaml_path: Path, learnings: list[str]) -> bool:
    """Update domain expert YAML with new learnings.

    Appends new learnings to the 'learnings' array in the YAML file,
    each with a timestamp. Also updates 'updated_at' field.

    Args:
        yaml_path: Path to the domain expert YAML file.
        learnings: List of learning strings to add.

    Returns:
        True if updated successfully, False otherwise.
    """
    if not yaml_path.exists() or not learnings:
        return False

    with open(yaml_path) as f:
        data = yaml.safe_load(f)

    # Add new learnings with timestamp
    existing = data.get("learnings", [])
    if existing is None:
        existing = []

    timestamp = datetime.now(timezone.utc).isoformat()
    for learning in learnings:
        existing.append({
            "text": learning,
            "added_at": timestamp
        })

    data["learnings"] = existing
    data["updated_at"] = timestamp

    with open(yaml_path, "w") as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    return True
