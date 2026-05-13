# SpendGPT Audit

A lightweight Next.js + TypeScript app for auditing AI tool spend and recommending optimization opportunities. Builders, finance teams, and engineering leaders input their current AI stack (Cursor, Copilot, Claude, ChatGPT, OpenAI API, Anthropic API, Gemini, Windsurf), and the tool evaluates plan fit, suggests cheaper alternatives, and surfaces savings with a personalized AI summary.

## GitHub Repository
https://github.com/divyanshmathur8240/AI_Spend-_Audit

## Deployed URL
https://spendgpt-audit.vercel.app (See [DEPLOYMENT.md](DEPLOYMENT.md) for setup)

## Quick start
1. `npm install`
2. `npm run dev` (starts on http://localhost:3000)
3. `npm run build && npm start` (production build)
4. `npm test` (run audit engine unit tests)
5. `npm run lint` (check code quality)

## Environment
- `ANTHROPIC_API_KEY`: optional, used for AI-generated summaries at `/api/summary`
- `NEXT_PUBLIC_APP_URL`: optional, used to construct shareable report links

## Features
✓ Spend input form for 8 AI tools with plan, monthly spend, seats  
✓ Real-time audit engine with plan-fit and alternative recommendations  
✓ Personalized AI summary via Anthropic API (graceful fallback)  
✓ Local storage persistence across page reloads  
✓ Lead capture + email storage (in-memory placeholder)  
✓ Shareable public result URLs with Open Graph tags  
✓ 5 unit tests covering audit logic  
✓ GitHub Actions CI (lint + tests on push)  
✓ Tailwind CSS for responsive design  

## Architecture
See [ARCHITECTURE.md](ARCHITECTURE.md) for system diagram, data flow, and scalability notes.

## Testing & CI
- `npm test` runs Vitest suite covering plan evaluation, alternative recommendations, savings totals, and edge cases.
- `.github/workflows/ci.yml` runs on every push to main.

## Key decisions
- **Next.js + TypeScript** for fast, type-safe frontend + server routes
- **Tailwind CSS** for pragmatic UI composition
- **Hardcoded audit logic** over AI — audit engine accuracy must be defensible and traceable
- **Anthropic API** for optional summary generation with fallback templated summary
- **In-memory lead store** as MVP; production will use Supabase + transactional email
