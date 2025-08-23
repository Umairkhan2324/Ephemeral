import type { Database } from "@/types/supabase"
import { CATEGORY_CONFIG, type CategoryKey } from "./classifierConfig"
import { serverEnv } from "@/config/env"

type Server = Database["public"]["Tables"]["servers"]["Row"]

function normalize(str: string) {
  return (str || "").toLowerCase()
}

function tokenize(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean)
}

function safeTest(re: RegExp, text: string): boolean {
  const flags = re.flags.replace("g", "")
  const clone = new RegExp(re.source, flags)
  return clone.test(text)
}

function inferCategory(serverName: string): CategoryKey | null {
  const name = normalize(serverName)
  const keys = Object.keys(CATEGORY_CONFIG) as CategoryKey[]
  for (const k of keys) {
    if (k !== "general" && name.includes(k)) return k
  }
  return null
}

// Optional explicit map: CSV "serverId:categoryKey,serverId:categoryKey"
const EXPLICIT_MAP: Record<string, CategoryKey> = {}
if (serverEnv.serverCategoryMapCsv) {
  for (const entry of serverEnv.serverCategoryMapCsv.split(/[,\s]+/).filter(Boolean)) {
    const [id, key] = entry.split(":")
    if (id && key && key in CATEGORY_CONFIG) EXPLICIT_MAP[id] = key as CategoryKey
  }
}

// Provider pool (models and tokens)
const HF_MODELS = (serverEnv.hfModelsCsv || "facebook/bart-large-mnli").split(/[,\s]+/).filter(Boolean)
const HF_TOKENS = (serverEnv.huggingFaceTokensCsv || serverEnv.huggingFaceToken || "").split(/[,\s]+/).filter(Boolean)
let rrIndex = 0

function nextProvider(): { model: string; token?: string } {
  const model = HF_MODELS[rrIndex % HF_MODELS.length]
  const token = HF_TOKENS.length ? HF_TOKENS[rrIndex % HF_TOKENS.length] : undefined
  rrIndex++
  return { model, token }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("ml_timeout")), ms)
    p.then((v) => { clearTimeout(t); resolve(v) }).catch((e) => { clearTimeout(t); reject(e) })
  })
}

async function classifyWithML(content: string, categories: string[]): Promise<string | null> {
  if (!serverEnv.ml.enabled || serverEnv.ml.regexOnly) return null
  const attempts = Math.max(HF_MODELS.length, 1)
  for (let i = 0; i < attempts; i++) {
    const { model, token } = nextProvider()
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`
      const req = fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: content, parameters: { candidate_labels: categories } }),
      })
      const res = await withTimeout(req, serverEnv.ml.timeoutMs)
      if (!res.ok) continue
      const data = await res.json()
      if (data.labels && data.scores && data.labels[0]) return data.labels[0]
    } catch {
      continue
    }
  }
  return null
}

function pickServerForCategory(servers: Server[], key: CategoryKey): string | null {
  // 1) explicit map
  for (const s of servers) {
    if (EXPLICIT_MAP[s.id] === key) return s.id
  }
  // 2) server name includes category
  const direct = servers.find((s) => normalize(s.name).includes(key))
  if (direct) return direct.id
  // 3) name/synonym overlap score
  const cfg = CATEGORY_CONFIG[key]
  const tokens = new Set<string>([key, ...(cfg.synonyms || [])].map(normalize))
  let best: { id: string; score: number } | null = null
  for (const s of servers) {
    let score = 0
    for (const t of tokenize(s.name)) if (tokens.has(t)) score += 1
    if (!best || score > best.score) best = { id: s.id, score }
  }
  return best && best.score > 0 ? best.id : null
}

export async function classifyServerId(content: string, servers: Server[]): Promise<{ serverId: string; reason: string }> {
  if (!servers.length) {
    throw new Error("No servers available to classify")
  }

  const text = normalize(content)
  const contentTokens = tokenize(content)

  const categories = Object.keys(CATEGORY_CONFIG).filter((k) => k !== "general") as CategoryKey[]
  const mlLabel = await classifyWithML(content, categories)
  if (mlLabel && (mlLabel as string) in CATEGORY_CONFIG) {
    const mapped = pickServerForCategory(servers, mlLabel as CategoryKey)
    if (mapped) return { serverId: mapped, reason: `ML → ${mlLabel}` }
  }

  let bestCat: { key: CategoryKey; score: number } | null = null
  for (const key of categories) {
    const cfg = CATEGORY_CONFIG[key]
    let score = 0
    for (const [re, weight] of cfg.include) if (safeTest(re, text)) score += weight
    if (cfg.exclude) for (const [re, weight] of cfg.exclude) if (safeTest(re, text)) score -= weight
    if (!bestCat || score > bestCat.score) bestCat = { key, score }
  }

  const THRESHOLD = 2
  if (bestCat && bestCat.score >= THRESHOLD) {
    const mapped = pickServerForCategory(servers, bestCat.key)
    if (mapped) return { serverId: mapped, reason: `Regex → ${bestCat.key}` }
  }

  let bestServer: { id: string; score: number; reason: string } | null = null
  for (const s of servers) {
    const cat = inferCategory(s.name)
    let score = 0
    let reason = ""
    if (cat) {
      const cfg = CATEGORY_CONFIG[cat]
      for (const [re, weight] of cfg.include) if (safeTest(re, text)) score += weight
      if (cfg.exclude) for (const [re, weight] of cfg.exclude) if (safeTest(re, text)) score -= weight
      const bag = new Set<string>([...tokenize(s.name), ...(cfg.synonyms || [])])
      for (const t of contentTokens) if (bag.has(t)) score += 1
      reason = `server '${s.name}' via '${cat}' score=${score}`
    } else {
      const bag = new Set<string>(tokenize(s.name))
      for (const t of contentTokens) if (bag.has(t)) score += 1
      reason = `server '${s.name}' via name overlap score=${score}`
    }
    if (!bestServer || score > bestServer.score) bestServer = { id: s.id, score, reason }
  }

  if (bestServer && bestServer.score < 1) {
    const general = servers.find((s) => normalize(s.name) === "general")
    if (general) return { serverId: general.id, reason: "fallback to 'general' server (weak score)" }
  }

  return { serverId: bestServer!.id, reason: bestServer!.reason }
}


