import { z } from "zod"

// Validate and expose server-side environment variables. Never log raw values.
const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Server-only flags and secrets
  CRON_SECRET: z.string().optional(),
  USE_APP_SERVICES: z.string().optional(),
  USE_API_POSTS: z.string().optional(),
  HARDEN_CRON: z.string().optional(),
  DISABLE_NEW_STACK: z.string().optional(),

  RATE_LIMIT_WINDOW: z.string().optional(),
  RATE_LIMIT_MAX: z.string().optional(),
  HUGGINGFACE_API_TOKEN: z.string().optional(),
  HUGGINGFACE_API_TOKENS: z.string().optional(),
  HF_MODELS: z.string().optional(),
  ML_CLASSIFIER_ENABLED: z.string().optional(),
  ML_CLASSIFIER_TIMEOUT_MS: z.string().optional(),
  REGEX_ONLY_MODE: z.string().optional(),
  SERVER_CATEGORY_MAP: z.string().optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  // Do not print actual env values, only error summary.
  const message = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
  throw new Error(`Invalid environment configuration: ${message}`)
}

const env = parsed.data

export const serverEnv = {
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  siteUrl: env.NEXT_PUBLIC_SITE_URL,

  cronSecret: env.CRON_SECRET,
  flags: {
    useAppServices: env.USE_APP_SERVICES === "true",
    useApiPosts: env.USE_API_POSTS === "true",
    hardenCron: env.HARDEN_CRON === "true",
    disableNewStack: env.DISABLE_NEW_STACK === "true",
  },
  rateLimit: {
    window: Number.parseInt(env.RATE_LIMIT_WINDOW || "60", 10),
    max: Number.parseInt(env.RATE_LIMIT_MAX || "60", 10),
  },
  huggingFaceToken: env.HUGGINGFACE_API_TOKEN,
  huggingFaceTokensCsv: env.HUGGINGFACE_API_TOKENS,
  hfModelsCsv: env.HF_MODELS,
  ml: {
    enabled: env.ML_CLASSIFIER_ENABLED !== "false",
    timeoutMs: Number.parseInt(env.ML_CLASSIFIER_TIMEOUT_MS || "1500", 10),
    regexOnly: env.REGEX_ONLY_MODE === "true",
  },
  serverCategoryMapCsv: env.SERVER_CATEGORY_MAP,
} as const

export type ServerEnv = typeof serverEnv


