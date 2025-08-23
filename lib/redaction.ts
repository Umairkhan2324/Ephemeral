// Utilities to mask sensitive values before logging.

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const TOKEN_LIKE_REGEX = /(bearer\s+)?([a-z0-9-_]{20,})/gi
const UUID_REGEX = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi

export function redactString(value: string): string {
  return value
    .replace(EMAIL_REGEX, "[email]")
    .replace(TOKEN_LIKE_REGEX, "[token]")
    .replace(UUID_REGEX, "[id]")
}

export function redactObject<T>(obj: T): T {
  try {
    return JSON.parse(
      redactString(
        JSON.stringify(obj, (_key, v) => {
          if (typeof v === "string") return v
          return v
        })
      )
    )
  } catch {
    return obj
  }
}


