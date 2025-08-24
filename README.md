# Ephemeral

Ephemeral is a Gen Z–first, topic-based social platform where posts disappear. It helps communities share quick thoughts, tips, and micro-stories without the pressure of permanence. Content is automatically routed to the most relevant “server” (topic) using a production-minded hybrid classifier (weighted regex + ML zero‑shot with Hugging Face providers and timeouts), so users don’t have to pick the right place every time.

## What Ephemeral aims to solve

- Reduce posting friction: users can just write; the system figures out where it belongs
- Lower social pressure: time-bound, auto-expiring content encourages spontaneity
- Keep feeds relevant: per-topic servers + classification improve content discovery
- Ship safely at scale: feature flags, rate limiting, idempotency and structured logging make rollouts resilient

## Key features

- Auto-classified posts using a hybrid approach:
  - Weighted regex bank with excludes and synonyms
  - ML zero‑shot via Hugging Face models with provider pool (multiple models/tokens), timeouts, and fallback to regex
- Ephemeral content: posts expire and are cleaned by a cron route
- API hardening: per-user rate limiting and best-effort idempotency on create
- Authentication and data via Supabase
- Clean Architecture–lite layering: `domain/`, `application/`, `adapters/`
- Structured logging + redaction and request-scoped IDs
- Feature flags to gate new work and enable safe rollback
- Modern UI: Next.js App Router + shadcn/ui + Tailwind (bento panels, glow, carousel)

## Architecture (at a glance)

- Next.js App Router (SSR) with dynamic routes for auth-aware pages (`export const dynamic = "force-dynamic"` where needed)
- Supabase for auth, RLS, and data access (SSR client on the server; browser client on the client)
- Domain classifier: `domain/classifier.ts` + `domain/classifierConfig.ts`
- Application orchestration: `application/PostService.ts`
- Adapters for data access: `adapters/supabase/*Repository.ts`
- Hardening: `app/api/posts/route.ts` applies validation, auth, rate limiting and idempotency
- Observability: `lib/logger.ts`, `lib/redaction.ts`, `lib/http.ts`
- Config: `config/env.ts` (validated, typed env)

## Getting started

1. Clone and install

```bash
git clone <your-fork-or-origin>
cd Ephemeral
npm i
```

2. Configure environment

Create `.env.local` and set at minimum:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Classifier (optional, recommended for ML)
HUGGINGFACE_API_TOKENS=tokenA,tokenB   # optional multi-token pool
HF_MODELS=facebook/bart-large-mnli,typeform/distilbert-base-uncased-mnli
ML_CLASSIFIER_ENABLED=true
ML_CLASSIFIER_TIMEOUT_MS=1500
REGEX_ONLY_MODE=false

# Optional explicit map: "serverId:category,serverId:category"
SERVER_CATEGORY_MAP=

# Rate limiting (defaults used if omitted)
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX=60
```

3. Run the app

```bash
npm run dev
```

## Contributing

We welcome contributions! Please use the following Git workflow and guidelines.

### Quick start

```bash
# Ensure your local main is up-to-date
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/<your-feature-slug>

# Make changes, commit, push
git add -A
git commit -m "feat: short description"
git push -u origin feature/<your-feature-slug>

# Open a Pull Request to main
```

### Branch naming

- `feature/<name>` for new features
- `fix/<name>` for bug fixes
- `chore/<name>` for refactors, tooling, docs, etc.

### Commit message style

Prefer Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:` …

### PR checklist

- Scope: one logical change per PR; small and focused
- Description: what/why, screenshots for UI, and any risk/flag toggles
- Tests/build: app builds locally (`npm run build`) and runs (`npm run dev`)
- Lint/typecheck: no new linter errors; TypeScript types remain safe
- Security: no secrets committed; respect RLS and do not bypass adapters
- Docs: update README or code-level docs where relevant

### Code guidelines

- Follow the layering:
  - Domain logic in `domain/`
  - Orchestration in `application/`
  - IO in `adapters/` (e.g., Supabase repositories)
- Use `config/env.ts` for configuration; do not read raw `process.env` elsewhere
- Gate risky features with flags (see `features.ts`)
- Use the provided logger/redaction for any structured logs
- UI: prefer shadcn/ui components and Tailwind utilities; keep mobile responsiveness first

### Classifier contributions

- Expand `domain/classifierConfig.ts` synonyms, include/exclude patterns, and weights
- Keep regexes safe (no catastrophic backtracking); prefer word-boundary tokens
- For ML, add models to `HF_MODELS` and test timeout/fallback behavior

## License (MIT)

Copyright (c) 2025 Ephemeral contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

