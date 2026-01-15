#!/usr/bin/env python3
"""
Hook Logger - Logging utility for workflow-task hooks.

Provides consistent logging to file and stderr for monitoring hooks.
"""

import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


class HookLogger:
    """Logger for workflow-task hooks with file and stderr output."""

    def __init__(self, hook_name: str, log_dir: Optional[Path] = None):
        """
        Initialize the hook logger.

        Args:
            hook_name: Name of the hook (pre_workflow, post_phase, etc.)
            log_dir: Directory for log files. Defaults to ../logs relative to this file.
        """
        self.hook_name = hook_name

        if log_dir is None:
            # Default: .claude/skills/workflow-task/logs/
            log_dir = Path(__file__).parent.parent.parent / "logs"

        self.log_dir = log_dir
        self.log_file = log_dir / "hooks.log"
        self.session_log = log_dir / f"session_{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.log"

        # Ensure log directory exists
        self.log_dir.mkdir(parents=True, exist_ok=True)

    def _format_message(self, level: str, message: str) -> str:
        """Format a log message with timestamp and metadata."""
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        return f"[{timestamp}] [{level}] [{self.hook_name}] {message}"

    def _write(self, formatted_msg: str, to_stderr: bool = False):
        """Write message to log file and optionally stderr."""
        # Write to main log file
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(formatted_msg + "\n")
        except Exception as e:
            print(f"[hook_logger] Failed to write to {self.log_file}: {e}", file=sys.stderr)

        # Write to daily session log
        try:
            with open(self.session_log, "a", encoding="utf-8") as f:
                f.write(formatted_msg + "\n")
        except Exception:
            pass  # Daily log is optional

        # Optionally write to stderr
        if to_stderr:
            print(formatted_msg, file=sys.stderr)

    def info(self, message: str, to_stderr: bool = False):
        """Log an info message."""
        self._write(self._format_message("INFO", message), to_stderr)

    def warn(self, message: str, to_stderr: bool = True):
        """Log a warning message."""
        self._write(self._format_message("WARN", message), to_stderr)

    def error(self, message: str, to_stderr: bool = True):
        """Log an error message."""
        self._write(self._format_message("ERROR", message), to_stderr)

    def debug(self, message: str, to_stderr: bool = False):
        """Log a debug message."""
        if os.environ.get("WORKFLOW_TASK_DEBUG", "").lower() == "true":
            self._write(self._format_message("DEBUG", message), to_stderr)

    def hook_start(self, context: dict = None):
        """Log hook execution start."""
        ctx_str = ""
        if context:
            tool = context.get("tool_name", "")
            if tool:
                ctx_str = f" tool={tool}"
        self.info(f"Hook started{ctx_str}")

    def hook_end(self, success: bool = True, message: str = ""):
        """Log hook execution end."""
        status = "SUCCESS" if success else "FAILED"
        msg = f"Hook completed: {status}"
        if message:
            msg += f" - {message}"
        self.info(msg)

    def event(self, event_type: str, details: str = ""):
        """Log a specific event."""
        msg = f"Event: {event_type}"
        if details:
            msg += f" | {details}"
        self.info(msg)


def get_logger(hook_name: str) -> HookLogger:
    """Get a logger instance for the specified hook."""
    return HookLogger(hook_name)
