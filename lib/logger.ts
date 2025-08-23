import { redactObject, redactString } from "./redaction"

type LogLevel = "debug" | "info" | "warn" | "error"

function baseLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const time = new Date().toISOString()
  const payload = meta ? redactObject(meta) : undefined
  const line = JSON.stringify({ level, time, message: redactString(message), ...payload })
  // Use console methods but with structured single-line JSON
  switch (level) {
    case "debug":
      console.debug(line)
      break
    case "info":
      console.info(line)
      break
    case "warn":
      console.warn(line)
      break
    case "error":
      console.error(line)
      break
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => baseLog("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => baseLog("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => baseLog("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => baseLog("error", message, meta),
}

export function withRequest(meta: { requestId?: string }) {
  const ctx = { requestId: meta.requestId }
  return {
    debug: (message: string, m?: Record<string, unknown>) => logger.debug(message, { ...ctx, ...m }),
    info: (message: string, m?: Record<string, unknown>) => logger.info(message, { ...ctx, ...m }),
    warn: (message: string, m?: Record<string, unknown>) => logger.warn(message, { ...ctx, ...m }),
    error: (message: string, m?: Record<string, unknown>) => logger.error(message, { ...ctx, ...m }),
  }
}


