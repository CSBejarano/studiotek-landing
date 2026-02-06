// ============================================================================
// Structured Logger Factory
// ============================================================================

export interface Logger {
  info: (msg: string, ...args: unknown[]) => void;
  warn: (msg: string, ...args: unknown[]) => void;
  error: (msg: string, ...args: unknown[]) => void;
  debug: (msg: string, ...args: unknown[]) => void;
}

/**
 * Creates a structured logger for a given module.
 * @param module - Module name (e.g. 'VOICE-CHAT', 'COOKIES')
 */
export function createLogger(module: string): Logger {
  return {
    info(msg: string, ...args: unknown[]) {
      console.log(`[${module}] ${msg}`, ...args);
    },
    warn(msg: string, ...args: unknown[]) {
      console.warn(`[${module}] WARN: ${msg}`, ...args);
    },
    error(msg: string, ...args: unknown[]) {
      console.error(`[${module}] ERROR: ${msg}`, ...args);
    },
    debug(msg: string, ...args: unknown[]) {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[${module}] DEBUG: ${msg}`, ...args);
      }
    },
  };
}
