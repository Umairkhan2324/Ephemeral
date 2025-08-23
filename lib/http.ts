export function ensureRequestId(headers: Headers): string {
  const existing = headers.get("x-request-id") || headers.get("x-correlation-id")
  if (existing) return existing
  // Use Web Crypto if available (Edge/runtime-safe), otherwise fallback.
  // @ts-ignore - global crypto in edge runtimes
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    // @ts-ignore
    return crypto.randomUUID()
  }
  // Minimal fallback UUID v4-ish
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}


