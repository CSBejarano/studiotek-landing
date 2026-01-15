#!/bin/bash
# Pre-workflow hook - Loads memory and prepares context
SKILL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$SKILL_ROOT/hooks/python/hook_runner.py" pre_workflow "$@"
exit $?
