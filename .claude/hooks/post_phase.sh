#!/bin/bash
# Post-phase hook - Records tool events and updates memory
SKILL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$SKILL_ROOT/hooks/python/hook_runner.py" post_phase "$@"
exit $?
