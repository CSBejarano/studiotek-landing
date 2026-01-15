#!/bin/bash
# Post-workflow hook - Consolidates memory and promotes learnings
SKILL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$SKILL_ROOT/hooks/python/hook_runner.py" post_workflow "$@"
exit $?
