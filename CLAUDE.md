# Skim -- Project Instructions

## Tech Stack
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand + Supabase + Claude API + neverthrow + fuse.js

## Architecture
Hexagonal (ports and adapters). See DEVELOPMENT_PLAN.md Section 2.
- Domain imports nothing external (pure TypeScript, zero deps)
- Application imports domain only
- Infrastructure implements port interfaces
- Presentation uses domain types, calls use cases via server actions or route handlers

## Dependency Rule
```
DOMAIN        imports: nothing
APPLICATION   imports: domain
INFRASTRUCTURE imports: domain, application
PRESENTATION  imports: domain (types only)
APP (Next.js) imports: infrastructure, presentation
```
Enforced via TSConfig path aliases + ESLint no-restricted-imports.

## Conventions
- Server Actions for mutations, Route Handlers for paginated reads, Server Components for initial data
- Vitest for unit/component/integration tests, Playwright for E2E
- Co-located test files (SkimValidator.test.ts next to SkimValidator.ts)
- Conventional Commits (feat/fix/chore/test/docs)
- TDD mandatory for domain, application, and reading mode engines
- Dark mode first, mobile first (375px)
- neverthrow for Result types (ok/err)
- Typed DI container with factory methods (no string-based resolve)
- Branded types for IDs (SkimId, UserId, etc.)

## Key References
- Product spec: SKIM_PLAN.md
- Design system: SKIM_DESIGN.md (Section 16 = Tailwind config)
- Content rules: SKIMM_RULES.md
- Development plan: DEVELOPMENT_PLAN.md (THE master doc -- architecture, TDD, build phases, CI/CD)
- Seed content: seed-skimms-stem.json + seed-skimms-culture.json (50 skimms total)

## Commands
```
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest single run
pnpm test:coverage # With coverage
pnpm test:e2e     # Playwright
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm check        # lint + typecheck + test + build (full gate)
```

## Build Phases
- **Phase 1 (Day 1):** Static JSON + localStorage, RSVP + Classic modes, 50 skimms, deploy to Vercel
- **Phase 2 (Day 2):** Supabase backend, all 4 reading modes, AI generation, auth, content creation

Phase 1 has 24 ordered build steps. Phase 2 has 41. See DEVELOPMENT_PLAN.md Section 12.

## Reading Mode Interface
Each mode implements: render(), pause(), resume(), getProgress()
Domain services (Tokenizer, PhraseChunker, ProgressMapper) feed data to renderers.
Token format: { word: string, pause: number, isKey: boolean, section: 'hook' | 'core' | 'snap' }

## Content Validation
SKIMM_RULES.md is the canonical source. SkimValidator enforces all 12 rules:
- Total <= 150 words, Hook <= 20 words, Core <= 100 words, Snap <= 25 words
- Core: no sentence > 20 words, no em-dashes, max 1 parenthetical
- Word count zones: 80-110 green, 110-130 neutral, 130-150 yellow, 150+ red

## 10 Realms
universe, life, numbers, past, mind, earth, code, society, body, art

## Feed Algorithm
score = (got_it_count * 5) + (completion_rate * 3) + (views * 0.1) + freshness_boost - (skip_penalty * 5) - (report_count * 10)

## Coverage Targets
- Domain: 95% | Application: 90% | Adapters: 70% | Reading modes: 85% | Layout: 60%
- Phase 1 overall: 90% | Phase 2 overall: 80%

## Principles
- Plan first (3+ steps = plan mode)
- Test first (red-green-refactor)
- Verify before marking done (tests pass, lint clean, build succeeds)
- Update lessons.md after corrections
- Subagent strategy: one task per subagent, never two touching the same file
- "Would a staff engineer approve this?"
