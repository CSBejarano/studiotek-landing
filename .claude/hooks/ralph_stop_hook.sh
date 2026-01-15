#!/bin/bash
# Ralph Loop Stop Hook - Manages autonomous workflow iteration
#
# This hook is called when the workflow is about to stop.
# It determines whether to allow the stop or continue the Ralph loop.
#
# Exit codes:
#   0 = Allow stop (success, timeout, or Ralph disabled)
#   1 = Block stop, continue loop (retry iteration)
#
# Usage:
#   ./ralph_stop_hook.sh [--help|--test]

SKILL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Handle --help directly for faster response
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Ralph Loop Stop Hook"
    echo ""
    echo "Manages the Ralph Wiggum autonomous loop at workflow Stop events."
    echo ""
    echo "Usage: ralph_stop_hook.sh [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --test        Test mode - check Ralph status"
    echo ""
    echo "Exit Codes:"
    echo "  0    Allow workflow to stop"
    echo "  1    Block stop, continue Ralph loop"
    exit 0
fi

# Export skill root for Python
export WORKFLOW_TASK_ROOT="$SKILL_ROOT"

# Execute Python handler via hook_runner
python3 "$SKILL_ROOT/hooks/python/hook_runner.py" ralph_stop "$@"
exit $?
