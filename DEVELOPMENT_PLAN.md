# SKIM — Development Plan

*Finalized 2026-02-19 by the skim-dev-planning team (architect, tdd-lead, devops-lead)*

---

## Table of Contents

1. [Engineering Principles](#1-engineering-principles)
2. [Architecture Overview](#2-architecture-overview)
3. [Domain Layer](#3-domain-layer)
4. [Application Layer](#4-application-layer)
5. [Ports & Adapters](#5-ports--adapters)
6. [Infrastructure Layer](#6-infrastructure-layer)
7. [Presentation Layer](#7-presentation-layer)
8. [Folder Structure](#8-folder-structure)
9. [Dependency Rule](#9-dependency-rule)
10. [Next.js App Router Integration](#10-nextjs-app-router-integration)
11. [TDD Strategy](#11-tdd-strategy)
12. [Build Phases](#12-build-phases)
13. [Phase Dependency Graph](#13-phase-dependency-graph)
14. [DevOps & CI/CD](#14-devops--cicd)
15. [Development Workflow](#15-development-workflow)
16. [Documentation Strategy](#16-documentation-strategy)
17. [Claude Code Workflow](#17-claude-code-workflow)
18. [Monitoring & Observability](#18-monitoring--observability)
19. [CLAUDE.md Specification](#19-claudemd-specification)
20. [Lessons & Self-Improvement](#20-lessons--self-improvement)

---

## 1. Engineering Principles

These principles govern every decision in this project. They are non-negotiable.

### 1.1 Plan Mode Default

Enter plan mode for ANY non-trivial task. Write detailed specs before writing code. A 10-minute plan saves hours of rework. Every feature starts with:
- What are we building?
- What are the acceptance criteria?
- What tests will prove it works?
- What are the edge cases?

### 1.2 Test-First, Always

No production code without a failing test first. The test defines the contract. The implementation fulfills it. Red-green-refactor is the rhythm, not an aspiration.

### 1.3 Verification Before Done

Never mark a task complete without proving it works. "It compiles" is not verification. "All tests pass, I checked the UI, and edge cases are covered" is verification. Every task ends with:
- All tests pass (`pnpm test`)
- Lint passes (`pnpm lint`)
- Build succeeds (`pnpm build`)
- Manual spot-check if UI is involved

### 1.4 Self-Improvement Loop

After ANY correction or discovery, update `lessons.md`. Write rules to prevent the same mistake. The codebase gets smarter with every session.

### 1.5 Demand Elegance (Balanced)

Pause and ask "is there a more elegant way?" before committing to an approach. But don't over-engineer simple fixes. Three lines of clear code beat a premature abstraction.

### 1.6 Autonomous Bug Fixing

When you see a bug, fix it. Point at logs, errors, failing tests -- then resolve them. Don't wait for permission to fix what's broken.

### 1.7 Simplicity First

The right amount of complexity is the minimum needed for the current task. No feature flags for hypothetical futures. No abstractions for one-time operations. No design for requirements that don't exist yet.

### 1.8 Minimal Impact

When changing code, change only what's necessary. A bug fix doesn't need surrounding code cleaned up. A new feature doesn't need the adjacent module refactored.

---

## 2. Architecture Overview

Skim uses **hexagonal architecture** (ports & adapters). The core idea: business logic lives in the center, untouched by infrastructure concerns. Storage, APIs, and UI are pluggable adapters around the edges.

```
                    ┌─────────────────────────┐
                    │      PRESENTATION        │
                    │  React components, hooks  │
                    │  Zustand stores           │
                    └────────────┬──────────────┘
                                 │ calls via API routes / server actions
                    ┌────────────▼──────────────┐
                    │      INFRASTRUCTURE        │
                    │  Next.js routes, adapters   │
                    │  DI container, Supabase     │
                    └────────────┬──────────────┘
                                 │ implements ports, injects into
                    ┌────────────▼──────────────┐
                    │       APPLICATION          │
                    │  Use cases (orchestration)  │
                    │  depends on domain only     │
                    └────────────┬──────────────┘
                                 │ uses
                    ┌────────────▼──────────────┐
                    │         DOMAIN             │
                    │  Entities, value objects    │
                    │  Services (pure functions)  │
                    │  Ports (interfaces)         │
                    │  *** ZERO dependencies ***  │
                    └───────────────────────────┘
```

**Why hexagonal for Skim?** The build plan calls for Phase 1 (static JSON, localStorage) and Phase 2 (Supabase, Claude API). With hexagonal architecture, the domain and application layers are identical in both phases. Only the adapters swap. This is not theoretical elegance -- it's the literal deployment strategy.

---

## 3. Domain Layer

The domain layer is **pure TypeScript**. Zero external dependencies. Zero I/O. Every function is deterministic and testable without mocks.

### 3.1 Entities

```typescript
// src/domain/entities/Skim.ts
interface Skim {
  id: SkimId;
  hook: SkimSection;
  core: SkimSection;
  snap: SkimSection;
  realm: Realm;
  difficulty: Difficulty;
  tags: Tag[];
  authorId: UserId;
  aiAssisted: boolean;
  suggestedMode?: ReadingMode;
  createdAt: Date;
  status: SkimStatus;
}

// src/domain/entities/User.ts
interface User {
  id: UserId;
  username: string;
  email: string;
  preferredMode: ReadingMode;
  skimCount: number;
  streakDays: number;
  streakTracking: boolean;
  createdAt: Date;
}

// src/domain/entities/Reaction.ts
interface Reaction {
  id: ReactionId;
  skimId: SkimId;
  userId: UserId;
  type: ReactionType;
  createdAt: Date;             // timestamps from day 1 for Leitner scheduling
}

// src/domain/entities/Report.ts
interface Report {
  id: ReportId;
  skimId: SkimId;
  userId: UserId;
  reason?: string;
  createdAt: Date;
}

// src/domain/entities/SkimView.ts
interface SkimView {
  id: ViewId;
  skimId: SkimId;
  userId?: UserId;             // nullable for anonymous users
  sessionId: string;
  durationMs: number;
  completed: boolean;
  readingMode: ReadingMode;
  createdAt: Date;
}
```

### 3.2 Value Objects

```typescript
// src/domain/value-objects/Token.ts
interface Token {
  word: string;
  pause: number;               // multiplier: 1.0 normal, 1.5 period, 1.25 comma
  isKey: boolean;
  section: 'hook' | 'core' | 'snap';
}

// src/domain/value-objects/SkimSection.ts
interface SkimSection {
  text: string;
  tokens: Token[];
}

// src/domain/value-objects/SkimScore.ts
interface SkimScore {
  gotItCount: number;
  completionRate: number;
  views: number;
  skipCount: number;
  reportCount: number;
  freshnessBias: number;
  total: number;               // computed
}

// src/domain/value-objects/types.ts
type SkimId = string & { readonly __brand: 'SkimId' };
type UserId = string & { readonly __brand: 'UserId' };
type ReactionId = string & { readonly __brand: 'ReactionId' };
type ReportId = string & { readonly __brand: 'ReportId' };
type ViewId = string & { readonly __brand: 'ViewId' };
type Tag = string & { readonly __brand: 'Tag' };

type Realm = 'universe' | 'life' | 'numbers' | 'past' | 'mind' | 'earth' | 'code' | 'society' | 'body' | 'art';
type Difficulty = 1 | 2 | 3;
type ReadingMode = 'rsvp' | 'subtitle' | 'teleprompter' | 'classic';
type ReactionType = 'got_it' | 'like' | 'bookmark';
type SkimStatus = 'draft' | 'published' | 'hidden' | 'reported';
```

### 3.3 Domain Services

All domain services are **pure functions**. No classes with state. No side effects. No I/O.

| Service | Purpose | Key Rules |
|---------|---------|-----------|
| `SkimValidator` | Enforces all SKIMM_RULES content rules | 150 word max, 20 word max per Core sentence, no em-dashes in Core, max 1 parenthetical in Core, Hook <= 20 words, Snap <= 25 words |
| `SkimScorer` | Computes feed score | `score = (got_it_count * 5) + (completion_rate * 3) + (views * 0.1) + freshness_boost - (skip_penalty * 5) - (report_count * 10)` |
| `Tokenizer` | Converts skim text to Token[] | Pause multipliers (1.5x period, 1.25x comma), key term detection, adaptive speed (slow for >8 chars, fast for articles) |
| `PhraseChunker` | Groups tokens into subtitle phrases | Break before conjunctions/prepositions, min 2 / max 5 words per chunk, keep quoted phrases together |
| `WordCounter` | Counts words, returns zone | green (80-110), neutral (110-130), yellow (130-150), red (150+) |
| `FeedRanker` | Sorts skims by computed score | 48h freshness boost with exponential decay |
| `ProgressMapper` | Maps reading progress between modes | word index <-> phrase index <-> scroll percentage |
| `OnboardingSkimSelector` | Selects curated first-3 skims for new users | Picks by realm diversity + difficulty 1 + highest got_it rate |
| `ViewAnalyzer` | Computes view metrics from raw view data | Completion rate, avg duration, mode distribution |

### 3.4 Domain Validation Rules (from SKIMM_RULES)

These rules are enforced programmatically in `SkimValidator`:

1. Total word count <= 150
2. Hook <= 20 words (1-2 sentences max)
3. Core <= 100 words
4. Core: no sentence > 20 words
5. Core: no em-dashes
6. Core: max 1 parenthetical
7. Snap <= 25 words
8. Exactly 1-3 tags
9. Exactly 1 Realm (from the 10 valid Realms)
10. Difficulty must be 1, 2, or 3
11. No banned Hook openers ("Did you know...?", "Ever wonder why...?", etc.)
12. No banned filler phrases in Core ("Interestingly,", "In fact,", etc.)

---

## 4. Application Layer

The application layer contains **use cases** -- each a single class that orchestrates domain services and port calls. Use cases depend on domain only. They never import infrastructure.

### 4.1 Use Case Catalog

#### Feed & Discovery
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `GetFeedSkims` | cursor, limit | PaginatedResult<SkimWithMetrics> | Fetch skims, compute scores via FeedRanker, return ranked page |
| `GetSkimOfTheDay` | none | SkimWithMetrics or null | Highest got_it rate in 24h with 50+ views |
| `GetSkimsByRealm` | realm, cursor, limit | PaginatedResult<Skim> | Filter + rank by realm |
| `GetSkimsByTag` | tag, cursor, limit | PaginatedResult<Skim> | Filter + rank by tag |
| `GetSurpriseMe` | excludeRealms | Skim | Random skim from unexplored realm |
| `SearchSkims` | query | SearchResult[] | Fuzzy search via SearchService port |

#### Skim CRUD
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `CreateSkim` | hook, core, snap, realm, difficulty, tags | Result<Skim, ValidationError> | Validate (SkimValidator), tokenize, persist |
| `UpdateSkim` | id, fields | Result<Skim, ValidationError> | Re-validate, re-tokenize, update |
| `GetSkimById` | id | SkimWithMetrics or null | Fetch with computed metrics |
| `PreviewSkim` | hook, core, snap | TokenizedSkim | Tokenize without persisting (creation flow preview) |

#### AI
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `GenerateAISkim` | topic, userId | Result<AISkimDraft, Error> | Call AIService, validate result, enforce 3/day rate limit |
| `GetAIFeedback` | hook, core, snap | AIFeedback | One-shot improvement suggestions |

#### Engagement
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `RecordGotIt` | skimId, userId | Reaction | Create got_it reaction with timestamp |
| `ToggleBookmark` | skimId, userId | boolean | Add or remove bookmark |
| `RecordLike` | skimId, userId | Reaction | Create like reaction |
| `RecordSkimView` | skimId, sessionId, mode, duration, completed | void | Track view metrics |
| `ReportSkim` | skimId, userId, reason? | void | Create report, auto-hide if threshold met |

#### User
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `AuthenticateUser` | provider, token | User | Supabase auth flow |
| `GetUserProfile` | userId | UserProfile | Stats, bookmarks, published skims |
| `GetCreatorStats` | userId | CreatorStats | Views, got_it count, best skim |

#### Progressive Disclosure
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `CheckModeUnlock` | skimCount | UnlockEvent or null | Subtitle at 5, Teleprompter at 10 |
| `CheckStreakStatus` | userId | StreakEvent or null | 3 consecutive days triggers discovery |
| `CheckShareNudge` | sessionSkimCount | boolean | 5+ skims in session |
| `CheckAuthPrompt` | skimCount, isAuthenticated | boolean | After skim 3, not yet authenticated |

### 4.2 Use Case Pattern

Every use case follows this structure:

```typescript
export class CreateSkim {
  constructor(
    private skimRepo: SkimRepository,
    private tokenizer: typeof tokenize
  ) {}

  async execute(input: CreateSkimInput): Promise<Result<Skim, ValidationError>> {
    // 1. Validate domain rules
    const validation = validateSkim(input.hook, input.core, input.snap);
    if (!validation.valid) return Err(validation.errors);

    // 2. Run domain services
    const hookSection = { text: input.hook, tokens: this.tokenizer(input.hook, 'hook') };
    const coreSection = { text: input.core, tokens: this.tokenizer(input.core, 'core') };
    const snapSection = { text: input.snap, tokens: this.tokenizer(input.snap, 'snap') };

    // 3. Build entity
    const skim: Skim = { id: generateId(), hook: hookSection, core: coreSection, snap: snapSection, ... };

    // 4. Persist via port
    return Ok(await this.skimRepo.save(skim));
  }
}
```

### 4.3 Result Type

All use cases that can fail return `Result<T, E>` from `neverthrow`:

```typescript
// Using neverthrow (pnpm add neverthrow)
import { Result, ok, err } from 'neverthrow';

// In use cases:
async execute(input: CreateSkimInput): Promise<Result<Skim, ValidationError>> {
  const validation = validateSkim(input.hook, input.core, input.snap);
  if (!validation.valid) return err(validation.errors);
  // ...
  return ok(skim);
}
```

`neverthrow` provides a battle-tested Result type with `.map()`, `.mapErr()`, `.andThen()` for chaining, plus `ResultAsync` for composing async operations. No custom monad needed. Zero dependencies. Re-export via `src/application/shared/Result.ts`: `export { ok, err, Result, ResultAsync } from 'neverthrow';`

---

## 5. Ports & Adapters

### 5.1 Ports (Interfaces)

Ports live in `src/domain/ports/`. They define WHAT the domain needs, not HOW it's provided.

```typescript
// src/domain/ports/SkimRepository.ts
interface SkimRepository {
  save(skim: Skim): Promise<Skim>;
  findById(id: SkimId): Promise<Skim | null>;
  findByRealm(realm: Realm, cursor?: string, limit?: number): Promise<PaginatedResult<Skim>>;
  findByTag(tag: Tag, cursor?: string, limit?: number): Promise<PaginatedResult<Skim>>;
  findTrending(cursor?: string, limit?: number): Promise<PaginatedResult<SkimWithMetrics>>;
  findSkimOfTheDay(): Promise<SkimWithMetrics | null>;
  findByAuthor(userId: UserId): Promise<Skim[]>;
  findRandom(excludeRealms: Realm[]): Promise<Skim | null>;
  updateStatus(id: SkimId, status: SkimStatus): Promise<void>;
  findByIds(ids: SkimId[]): Promise<Skim[]>;
}

// src/domain/ports/UserRepository.ts
interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updatePreferences(id: UserId, prefs: Partial<UserPreferences>): Promise<void>;
}

// src/domain/ports/ReactionRepository.ts
interface ReactionRepository {
  save(reaction: Reaction): Promise<Reaction>;
  delete(userId: UserId, skimId: SkimId, type: ReactionType): Promise<void>;
  findByUserAndSkim(userId: UserId, skimId: SkimId): Promise<Reaction[]>;
  findBookmarksByUser(userId: UserId): Promise<Reaction[]>;
  countBySkimAndType(skimId: SkimId, type: ReactionType): Promise<number>;
}

// src/domain/ports/ViewRepository.ts
interface ViewRepository {
  save(view: SkimView): Promise<void>;
  getMetrics(skimId: SkimId): Promise<SkimMetrics>;
}

// src/domain/ports/ReportRepository.ts
interface ReportRepository {
  save(report: Report): Promise<void>;
  countBySkim(skimId: SkimId): Promise<number>;
}

// src/domain/ports/AIService.ts
interface AIService {
  generateSkim(topic: string): Promise<AISkimDraft>;
  suggestImprovements(hook: string, core: string, snap: string): Promise<AIFeedback>;
}

// src/domain/ports/SearchService.ts
interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  indexSkim(skim: Skim): void;
  removeSkim(id: SkimId): void;
}

// src/domain/ports/ShareCardService.ts
interface ShareCardService {
  generateCard(skim: Skim, format: 'portrait' | 'stories' | 'square'): Promise<Blob>;
  generateSessionCard(skimTitles: string[], sessionMinutes: number): Promise<Blob>;
}
```

### 5.2 Adapters

Adapters live in `src/infrastructure/adapters/`. Each adapter implements exactly one port.

#### Phase 1 Adapters (Day 1 -- Static)

| Adapter | Port | Storage |
|---------|------|---------|
| `JsonSkimRepository` | SkimRepository | Reads from `src/data/skims.json` |
| `LocalReactionRepository` | ReactionRepository | localStorage |
| `LocalViewRepository` | ViewRepository | localStorage |
| `FuseSearchService` | SearchService | fuse.js client-side index |
| `NoOpAIService` | AIService | Returns "Coming soon" error |
| `NoOpShareCardService` | ShareCardService | Returns placeholder |

#### Phase 2 Adapters (Day 2 -- Supabase)

| Adapter | Port | Storage |
|---------|------|---------|
| `SupabaseSkimRepository` | SkimRepository | Supabase Postgres |
| `SupabaseUserRepository` | UserRepository | Supabase Postgres + Auth |
| `SupabaseReactionRepository` | ReactionRepository | Supabase Postgres |
| `SupabaseViewRepository` | ViewRepository | Supabase Postgres |
| `SupabaseReportRepository` | ReportRepository | Supabase Postgres |
| `ClaudeAIService` | AIService | Anthropic Claude API |
| `CanvasShareCardService` | ShareCardService | Canvas API |
| `SupabaseAuthAdapter` | (auth-specific) | @supabase/auth-helpers-nextjs |

**The domain and application layers are identical in both phases.** Only adapters change.

---

## 6. Infrastructure Layer

### 6.1 Dependency Injection

Typed factory pattern. No DI framework. Environment-based adapter selection with type-safe keys.

```typescript
// src/infrastructure/di/container.ts
type Environment = 'test' | 'development' | 'production';

function getEnvironment(): Environment {
  if (process.env.NODE_ENV === 'test') return 'test';
  if (process.env.NODE_ENV === 'development') return 'development';
  return 'production';
}

function createContainer(env: Environment) {
  // Adapter selection based on environment
  const skimRepo: SkimRepository =
    env === 'test'
      ? new InMemorySkimRepository()
      : env === 'development' && !process.env.SUPABASE_URL
        ? new JsonSkimRepository()
        : new SupabaseSkimRepository();

  const reactionRepo: ReactionRepository =
    env === 'test'
      ? new InMemoryReactionRepository()
      : env === 'development' && !process.env.SUPABASE_URL
        ? new LocalReactionRepository()
        : new SupabaseReactionRepository();

  // ... same pattern for all ports

  // Use case factories -- typed, no string-based resolve
  return {
    skimRepo,
    reactionRepo,
    // ... all repos

    // Every use case gets a typed factory method
    getFeedSkims: () => new GetFeedSkims(skimRepo, rankSkims),
    createSkim: () => new CreateSkim(skimRepo, tokenize),
    recordGotIt: () => new RecordGotIt(reactionRepo),
    // ... etc
  } as const;
}

export const container = createContainer(getEnvironment());
```

**Why environment-based over phase-based:** Tests always get in-memory adapters (fast, deterministic). Development without Supabase gets JSON/localStorage. Production and development-with-Supabase get Supabase adapters. The `NEXT_PUBLIC_PHASE` env var is temporary scaffolding that goes away once Phase 2 ships -- the environment detection is permanent.

### 6.2 Environment Configuration

```typescript
// src/infrastructure/config/env.ts
export const env = {
  phase: process.env.NEXT_PUBLIC_PHASE || '2',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  claudeApiKey: process.env.CLAUDE_API_KEY!,  // server-only
} as const;
```

Required `.env.local` variables:

| Variable | Phase 1 | Phase 2 | Scope |
|----------|---------|---------|-------|
| `NEXT_PUBLIC_PHASE` | `1` | `2` | public |
| `NEXT_PUBLIC_SUPABASE_URL` | not needed | required | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | not needed | required | public |
| `CLAUDE_API_KEY` | not needed | required | server-only |

---

## 7. Presentation Layer

### 7.1 Component Architecture

Components depend on **domain types only** for type safety. They call use cases via API routes or server actions -- never importing infrastructure directly.

#### Reading Mode Strategy Pattern

From the product plan: "Each mode implements a shared `ReadingModeRenderer` interface."

```typescript
// src/presentation/components/reading-modes/ReadingModeRenderer.tsx
interface ReadingModeRenderer {
  render(tokens: Token[], progress: number): React.ReactNode;
  pause(): void;
  resume(): void;
  getProgress(): number;
}
```

Four implementations: `RSVPMode`, `SubtitleMode`, `TeleprompterMode`, `ClassicMode`. The feed component swaps renderers based on user preference. Adding a new mode = adding one component that implements this interface.

### 7.2 State Management (Zustand)

Four stores, each owning a distinct concern:

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `feedStore` | Feed state, pagination cursor, current skim index | none (refetches) |
| `readingModeStore` | Current mode, WPM setting, playback state, progress | localStorage |
| `userStore` | Auth state, user preferences, session ID | localStorage |
| `creationStore` | Skim builder state (hook/core/snap text, tags, realm) | none (ephemeral) |

### 7.3 Custom Hooks

Hooks bridge presentation and domain logic:

| Hook | Purpose |
|------|---------|
| `useSkimFeed` | Fetches feed, handles pagination, manages 3-skim render window |
| `useReadingMode` | Mode selection, WPM control, mode memory |
| `useTokenPlayback` | RSVP/Subtitle/Teleprompter word-by-word timing engine |
| `useProgressMapping` | Maps progress between modes on mid-skim switch |
| `usePhraseChunking` | Groups tokens into subtitle phrases using PhraseChunker |
| `useGotIt` | Got it! tap handling, optimistic UI, API call |
| `useBookmark` | Bookmark toggle, optimistic UI |
| `useSkimView` | View tracking (start, completion, duration, mode) |
| `useProgressiveDisclosure` | Mode unlock checks, auth prompts, share nudges |
| `useStreak` | Streak tracking and discovery |
| `useKeyboardShortcuts` | Desktop keyboard shortcuts (Space, arrows, 1-4, etc.) |
| `usePrefersReducedMotion` | Respects `prefers-reduced-motion: reduce` |
| `useWPM` | WPM slider state, haptic feedback at snap points |

---

## 8. Folder Structure

```
src/
├── domain/                          # PURE -- zero external dependencies
│   ├── entities/
│   │   ├── Skim.ts
│   │   ├── User.ts
│   │   ├── Reaction.ts
│   │   ├── Report.ts
│   │   └── SkimView.ts
│   ├── value-objects/
│   │   ├── Token.ts
│   │   ├── SkimSection.ts
│   │   ├── SkimScore.ts
│   │   └── types.ts
│   ├── services/
│   │   ├── SkimScorer.ts
│   │   ├── SkimScorer.test.ts           # co-located tests
│   │   ├── SkimValidator.ts
│   │   ├── SkimValidator.test.ts
│   │   ├── Tokenizer.ts
│   │   ├── Tokenizer.test.ts
│   │   ├── PhraseChunker.ts
│   │   ├── PhraseChunker.test.ts
│   │   ├── WordCounter.ts
│   │   ├── WordCounter.test.ts
│   │   ├── FeedRanker.ts
│   │   ├── FeedRanker.test.ts
│   │   ├── ProgressMapper.ts
│   │   ├── ProgressMapper.test.ts
│   │   ├── OnboardingSkimSelector.ts
│   │   ├── OnboardingSkimSelector.test.ts
│   │   ├── ViewAnalyzer.ts
│   │   └── ViewAnalyzer.test.ts
│   └── ports/
│       ├── SkimRepository.ts
│       ├── UserRepository.ts
│       ├── ReactionRepository.ts
│       ├── ViewRepository.ts
│       ├── ReportRepository.ts
│       ├── AIService.ts
│       ├── SearchService.ts
│       └── ShareCardService.ts
│
├── application/
│   ├── use-cases/
│   │   ├── feed/
│   │   │   ├── GetFeedSkims.ts
│   │   │   ├── GetSkimOfTheDay.ts
│   │   │   ├── GetSkimsByRealm.ts
│   │   │   ├── GetSkimsByTag.ts
│   │   │   ├── GetSurpriseMe.ts
│   │   │   └── SearchSkims.ts
│   │   ├── skim/
│   │   │   ├── CreateSkim.ts
│   │   │   ├── UpdateSkim.ts
│   │   │   ├── GetSkimById.ts
│   │   │   └── PreviewSkim.ts
│   │   ├── ai/
│   │   │   ├── GenerateAISkim.ts
│   │   │   └── GetAIFeedback.ts
│   │   ├── engagement/
│   │   │   ├── RecordGotIt.ts
│   │   │   ├── ToggleBookmark.ts
│   │   │   ├── RecordLike.ts
│   │   │   ├── RecordSkimView.ts
│   │   │   └── ReportSkim.ts
│   │   ├── user/
│   │   │   ├── AuthenticateUser.ts
│   │   │   ├── GetUserProfile.ts
│   │   │   └── GetCreatorStats.ts
│   │   └── progression/
│   │       ├── CheckModeUnlock.ts
│   │       ├── CheckStreakStatus.ts
│   │       ├── CheckShareNudge.ts
│   │       └── CheckAuthPrompt.ts
│   └── shared/
│       ├── Result.ts                    # re-exports from neverthrow
│       └── PaginatedResult.ts
│
├── infrastructure/
│   ├── adapters/
│   │   ├── supabase/
│   │   │   ├── SupabaseSkimRepository.ts
│   │   │   ├── SupabaseUserRepository.ts
│   │   │   ├── SupabaseReactionRepository.ts
│   │   │   ├── SupabaseViewRepository.ts
│   │   │   ├── SupabaseReportRepository.ts
│   │   │   ├── SupabaseAuthAdapter.ts
│   │   │   └── supabase-client.ts
│   │   ├── json/
│   │   │   └── JsonSkimRepository.ts
│   │   ├── local-storage/
│   │   │   ├── LocalReactionRepository.ts
│   │   │   └── LocalViewRepository.ts
│   │   ├── claude/
│   │   │   └── ClaudeAIService.ts
│   │   ├── fuse/
│   │   │   └── FuseSearchService.ts
│   │   └── canvas/
│   │       └── CanvasShareCardService.ts
│   ├── di/
│   │   └── container.ts
│   └── config/
│       └── env.ts
│
├── app/                             # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (feed)/
│   │   └── page.tsx
│   ├── explore/
│   │   └── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── skim/[id]/
│   │   └── page.tsx
│   ├── api/
│   │   ├── skims/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── got-it/route.ts
│   │   │       ├── bookmark/route.ts
│   │   │       ├── like/route.ts
│   │   │       ├── view/route.ts
│   │   │       └── report/route.ts
│   │   ├── ai/
│   │   │   ├── generate/route.ts
│   │   │   └── feedback/route.ts
│   │   ├── search/route.ts
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   └── share/
│   │       └── card/route.ts
│   └── actions/
│       └── skimActions.ts
│
├── presentation/
│   ├── components/
│   │   ├── feed/
│   │   │   ├── Feed.tsx
│   │   │   ├── SkimCard.tsx
│   │   │   ├── SkimOfTheDay.tsx
│   │   │   └── FeedTabs.tsx
│   │   ├── reading-modes/
│   │   │   ├── ReadingModeRenderer.tsx
│   │   │   ├── RSVPMode.tsx
│   │   │   ├── SubtitleMode.tsx
│   │   │   ├── TeleprompterMode.tsx
│   │   │   ├── ClassicMode.tsx
│   │   │   └── ModePicker.tsx
│   │   ├── engagement/
│   │   │   ├── GotItButton.tsx
│   │   │   ├── BookmarkButton.tsx
│   │   │   ├── OverflowMenu.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── creation/
│   │   │   ├── SkimBuilder.tsx
│   │   │   ├── SectionEditor.tsx
│   │   │   ├── WordCountIndicator.tsx
│   │   │   ├── DifficultyPicker.tsx
│   │   │   └── RealmPicker.tsx
│   │   ├── explore/
│   │   │   ├── RealmBrowser.tsx
│   │   │   ├── RealmCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── SurpriseMeButton.tsx
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── CreatorStats.tsx
│   │   │   └── BookmarksList.tsx
│   │   ├── auth/
│   │   │   └── AuthPrompt.tsx
│   │   ├── onboarding/
│   │   │   ├── ModeUnlockCard.tsx
│   │   │   ├── StreakDiscovery.tsx
│   │   │   ├── ShareNudge.tsx
│   │   │   └── PauseHint.tsx
│   │   └── shared/
│   │       ├── BottomSheet.tsx
│   │       ├── PillBadge.tsx
│   │       ├── DifficultyDots.tsx
│   │       ├── WPMSlider.tsx
│   │       ├── Navigation.tsx
│   │       └── SnapFlourish.tsx
│   ├── hooks/
│   │   ├── useSkimFeed.ts
│   │   ├── useReadingMode.ts
│   │   ├── useTokenPlayback.ts
│   │   ├── useProgressMapping.ts
│   │   ├── usePhraseChunking.ts
│   │   ├── useGotIt.ts
│   │   ├── useBookmark.ts
│   │   ├── useSkimView.ts
│   │   ├── useProgressiveDisclosure.ts
│   │   ├── useStreak.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useWPM.ts
│   └── store/
│       ├── feedStore.ts
│       ├── readingModeStore.ts
│       ├── userStore.ts
│       └── creationStore.ts
│
├── data/
│   └── skims.json                   # 50 launch skims
│
└── lib/
    ├── cn.ts                        # clsx + twMerge
    └── constants.ts                 # REALMS, MODES, WPM defaults

test/                                    # Shared test infrastructure (outside src/)
├── __fixtures__/
│   ├── skims.ts                     # createTestSkim factory
│   ├── users.ts                     # createTestUser factory
│   └── interactions.ts              # createTestInteraction factory
├── helpers/
│   └── render.tsx                   # custom RTL render with providers
└── setup.ts                         # global Vitest setup

e2e/                                     # Playwright E2E tests
├── feed.spec.ts
├── creation.spec.ts
├── auth.spec.ts
├── mode-switch.spec.ts
├── search.spec.ts
└── share.spec.ts
```

---

## 9. Dependency Rule

```
DOMAIN        imports: nothing
APPLICATION   imports: domain
INFRASTRUCTURE imports: domain, application
PRESENTATION  imports: domain (types only)
APP (Next.js) imports: infrastructure, presentation
```

**Enforcement:** TSConfig path aliases + ESLint import rules.

```typescript
// tsconfig.json paths
{
  "@/domain/*": ["src/domain/*"],
  "@/application/*": ["src/application/*"],
  "@/infrastructure/*": ["src/infrastructure/*"],
  "@/presentation/*": ["src/presentation/*"],
  "@/lib/*": ["src/lib/*"]
}
```

ESLint rule: `no-restricted-imports` prevents domain from importing infrastructure, application from importing infrastructure or presentation, etc. Violations fail CI.

---

## 10. Next.js App Router Integration

Next.js App Router components are **infrastructure adapters** -- they wire the hexagonal architecture to HTTP.

### 10.0 Data Fetching Convention

Three patterns, each with a clear use case. No mixing.

| Pattern | When to Use | Examples |
|---------|-------------|---------|
| **Server Actions** | Mutations (create, update, delete) | RecordGotIt, ToggleBookmark, CreateSkim, ReportSkim |
| **Route Handlers** | Paginated data fetching, external endpoints | GET /api/skims (cursor pagination), auth callback, share card generation |
| **Server Components** | Initial page data (no client interaction needed) | FeedPage fetches initial 10 skims, SkimPage fetches single skim |

**Why this split:** Server Actions avoid the boilerplate of POST route handlers for simple mutations. Route Handlers are needed for paginated reads (cursor in query params) and external callbacks (OAuth, webhooks). Server Components eliminate the fetch waterfall for initial page data.

### 10.1 Route Handlers (API Endpoints)

```typescript
// src/app/api/skims/route.ts
import { container } from '@/infrastructure/di/container';

export async function GET(request: NextRequest) {
  const getFeed = container.getGetFeedSkims();
  const cursor = request.nextUrl.searchParams.get('cursor');
  const result = await getFeed.execute({ cursor, limit: 10 });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const createSkim = container.getCreateSkim();
  const body = await request.json();
  const result = await createSkim.execute(body);
  if (result.isErr()) return NextResponse.json(result.error, { status: 400 });
  return NextResponse.json(result.value, { status: 201 });
}
```

### 10.2 Server Actions

```typescript
// src/app/actions/skimActions.ts
'use server'
import { container } from '@/infrastructure/di/container';

export async function recordGotIt(skimId: string) {
  const useCase = container.getRecordGotIt();
  return useCase.execute({ skimId, userId: await getCurrentUserId() });
}
```

### 10.3 Server Components (Initial Data)

```typescript
// src/app/(feed)/page.tsx
import { container } from '@/infrastructure/di/container';

export default async function FeedPage() {
  const getFeed = container.getGetFeedSkims();
  const initialSkims = await getFeed.execute({ limit: 10 });
  return <Feed initialSkims={initialSkims} />;
}
```

---

## 11. TDD Strategy

### 11.1 Test-First Workflow

For every feature:

1. **Write the failing test** -- define the expected behavior
2. **Run the test** -- confirm it fails (red)
3. **Write minimal code** to make it pass (green)
4. **Refactor** -- clean up while tests stay green
5. **Repeat**

### 11.2 Testing Pyramid

```
          ╱╲
         ╱  ╲          E2E (Playwright)
        ╱    ╲         ~ 10-15 tests
       ╱──────╲
      ╱        ╲       Component Tests (Testing Library)
     ╱          ╲      ~ 30-40 tests
    ╱────────────╲
   ╱              ╲    Integration Tests (Use Cases + Mock Ports)
  ╱                ╲   ~ 50-60 tests
 ╱────────────────────╲
╱                      ╲ Unit Tests (Domain Services, pure functions)
╱________________________╲ ~ 100+ tests
```

### 11.3 Per-Layer Testing Strategy

#### Domain Layer -- Unit Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/domain/services/SkimValidator.test.ts` next to `SkimValidator.ts`)
- **Mocks:** None. Pure functions. No I/O.
- **Speed:** < 1 second total
- **Run on:** every file save (Vitest watch mode)

| Test Suite | What It Tests |
|------------|---------------|
| `SkimValidator.test.ts` | All 12 quality gate rules from SKIMM_RULES |
| `SkimScorer.test.ts` | Score formula with known inputs, freshness decay |
| `Tokenizer.test.ts` | Pause multipliers, key term detection, section boundaries, adaptive speed |
| `PhraseChunker.test.ts` | Conjunction/preposition breaks, min 2 / max 5 words, quoted phrases |
| `WordCounter.test.ts` | All 4 zones (green/neutral/yellow/red), exact boundaries |
| `FeedRanker.test.ts` | Sort order with varying scores, tie-breaking |
| `ProgressMapper.test.ts` | RSVP <-> Subtitle <-> Teleprompter progress mapping |

Example test:

```typescript
// src/domain/services/SkimValidator.test.ts
describe('SkimValidator', () => {
  it('rejects skim with total > 150 words', () => {
    const result = validateSkim(
      'Hook text here',
      'A'.repeat(151).split('').join(' '),  // 151 words
      'Snap line'
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Total word count exceeds 150');
  });

  it('rejects Core sentence > 20 words', () => {
    const longSentence = Array(21).fill('word').join(' ') + '.';
    const result = validateSkim('Hook', longSentence, 'Snap');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Core sentence exceeds 20 words');
  });

  it('rejects em-dashes in Core', () => {
    const result = validateSkim('Hook', 'This is a test — with an em-dash.', 'Snap');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Em-dashes not allowed in Core');
  });
});
```

#### Application Layer -- Integration Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/application/use-cases/skim/CreateSkim.test.ts` next to `CreateSkim.ts`)
- **Mocks:** In-memory port implementations (same shape as Phase 1 adapters)
- **Speed:** < 5 seconds total

| Test Suite | What It Tests |
|------------|---------------|
| `CreateSkim.test.ts` | Validates, tokenizes, persists. Rejects invalid input. |
| `GetFeedSkims.test.ts` | Fetches, ranks, paginates. Correct cursor handling. |
| `RecordGotIt.test.ts` | Creates reaction, handles duplicate taps. |
| `ReportSkim.test.ts` | Creates report, auto-hides after threshold. |
| `GenerateAISkim.test.ts` | Calls AI, validates result, enforces rate limit. |
| `CheckModeUnlock.test.ts` | Returns unlock event at 5 and 10 skims. |

Mock port pattern:

```typescript
class InMemorySkimRepository implements SkimRepository {
  private skims: Map<SkimId, Skim> = new Map();

  async save(skim: Skim): Promise<Skim> {
    this.skims.set(skim.id, skim);
    return skim;
  }

  async findById(id: SkimId): Promise<Skim | null> {
    return this.skims.get(id) ?? null;
  }
  // ... etc
}
```

These in-memory implementations are reused as Phase 1 adapters and as test fixtures. Write once, use everywhere.

#### Infrastructure Layer -- Adapter Integration Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/infrastructure/adapters/supabase/SupabaseSkimRepository.test.ts`)
- **Dependencies:** Supabase local (`supabase start`), msw for HTTP mocks
- **Speed:** < 30 seconds total
- **Run:** on CI, before deploy

| Test Suite | What It Tests |
|------------|---------------|
| `SupabaseSkimRepository.test.ts` | CRUD against local Supabase. Pagination. Realm filter. |
| `JsonSkimRepository.test.ts` | Reads and parses actual skims.json correctly. |
| `FuseSearchService.test.ts` | Index creation, fuzzy matching, relevance order. |
| `ClaudeAIService.test.ts` | HTTP mock: correct prompt sent, response parsed. |

#### Presentation Layer -- Component Tests

- **Framework:** Vitest + React Testing Library
- **Location:** Co-located (`src/presentation/components/reading-modes/RSVPMode.test.tsx`)
- **Mocks:** API responses via msw

| Test Suite | What It Tests |
|------------|---------------|
| `RSVPMode.test.tsx` | Renders words from token array in sequence. Pauses on tap. |
| `SubtitleMode.test.tsx` | Renders phrase chunks. Fade transitions. |
| `GotItButton.test.tsx` | Tap sequence: initial -> filled -> confirmed -> disabled. |
| `SkimBuilder.test.tsx` | Word count zones, validation feedback, section editors. |
| `ModePicker.test.tsx` | Lock/unlock states, mode selection, auto-dismiss. |

**RSVP timing tests must use `vi.useFakeTimers()`.** Real timers make these tests non-deterministic and slow. Advance time with `vi.advanceTimersByTime(ms)`.

**All interactive components** (GotItButton, ModePicker, SkimBuilder, BottomSheet) include an axe-core accessibility test: `expect(await axe(container)).toHaveNoViolations()` via `vitest-axe`.

#### E2E Tests

- **Framework:** Playwright
- **Location:** `e2e/`
- **Run:** before deploy to production

| Test | What It Covers |
|------|----------------|
| `feed.spec.ts` | Load feed -> RSVP plays -> swipe up -> next skim loads |
| `creation.spec.ts` | Write skim -> validation -> preview modes -> publish |
| `auth.spec.ts` | Browse 3 skims -> auth prompt -> sign in -> state persists |
| `mode-switch.spec.ts` | Switch modes mid-skim -> progress preserved -> crossfade |
| `search.spec.ts` | Search -> results -> tap result -> skim loads |
| `share.spec.ts` | Share button -> card generated -> correct format |

### 11.4 Test Naming Convention

```
[filename].test.ts        -- unit and integration tests
[filename].spec.ts        -- E2E tests (Playwright)
```

### 11.5 Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Domain | 95% | Pure functions, near-total coverage (some complex validator edge branches exempt) |
| Application | 90% | Every use case path including errors |
| Infrastructure (Adapters) | 70% | Test the contract, not every edge case of third-party libs |
| Presentation (Reading modes) | 85% | Core user experience, must be rock-solid |
| Presentation (Layout/nav) | 60% | Structural, less logic |
| E2E | Critical paths | Not measured by coverage, measured by user journey |

**Phase targets:**
| Phase | Overall Floor |
|-------|--------------|
| Phase 1 | 90% |
| Phase 2 | 80% |

---

## 12. Build Phases

### Phase 1 -- Day 1: "The Wow Moment"

**Goal:** Deployable site with 50 skims, RSVP engine, Classic mode, working feed. A user can open the site, see RSVP for the first time, and say "holy shit."

#### Phase 1 Scope

| Category | What Gets Built |
|----------|----------------|
| **Domain** | All entities, all value objects, all domain services (complete) |
| **Application** | `GetFeedSkims`, `GetSkimById`, `GetSkimsByRealm`, `SearchSkims`, `PreviewSkim`, `CheckModeUnlock`, `CheckAuthPrompt` |
| **Infrastructure** | `JsonSkimRepository`, `LocalReactionRepository`, `LocalViewRepository`, `FuseSearchService`, `NoOpAIService`, DI container (phase 1 mode) |
| **Presentation** | Feed (snap-scroll), RSVP mode, Classic mode, ModePicker (2 modes), GotItButton, BookmarkButton, ProgressBar, WPMSlider, Navigation (4 tabs), SearchBar, RealmBrowser |
| **Data** | `skims.json` with 50 polished skims |
| **Tests** | All domain unit tests, use case integration tests, RSVP component test, feed E2E |
| **Deploy** | Vercel, one command |

#### Phase 1 Build Order

```
1. Project setup (Next.js 14, Tailwind, Vitest, tsconfig paths)
2. Domain types (entities, value objects, branded types)
3. Domain services + tests (SkimValidator, Tokenizer, WordCounter, SkimScorer, FeedRanker, PhraseChunker, ProgressMapper)
4. Application shared (Result type, PaginatedResult)
5. Application use cases + tests (GetFeedSkims, GetSkimById, SearchSkims, PreviewSkim)
6. Infrastructure: JsonSkimRepository + tests (reads skims.json)
7. Infrastructure: FuseSearchService + tests
8. Infrastructure: DI container (phase 1)
9. Data: skims.json (50 launch skims, tokenized)
10. Presentation: Tailwind config (design system tokens, CSS variables, realm colors)
11. Presentation: shared components (BottomSheet, PillBadge, DifficultyDots, Navigation)
12. Presentation: RSVP mode + token playback hook + tests
13. Presentation: Classic mode
14. Presentation: Feed (snap-scroll, 3-skim window, infinite load)
15. Presentation: SkimCard (top bar, bottom bar, content zone)
16. Presentation: GotItButton + BookmarkButton
17. Presentation: WPMSlider + ProgressBar
18. Presentation: ModePicker (RSVP + Classic only)
19. Presentation: SearchBar + RealmBrowser + SurpriseMeButton
20. Presentation: Explore page, Profile page (shell)
21. App routes: feed page, explore page, skim/[id] page
22. API routes: GET /api/skims, GET /api/skims/[id], GET /api/search
23. E2E: feed flow test
24. Deploy to Vercel
```

#### Phase 1 Definition of Done

- [ ] 50 skims load in feed with snap-scroll
- [ ] RSVP plays at 300 WPM with adaptive speed, pause on tap
- [ ] Classic mode shows typeset card
- [ ] WPM slider adjusts speed 150-600
- [ ] Progress bar fills during playback
- [ ] Got it! button animates (spring fill)
- [ ] Bookmark button toggles
- [ ] Search finds skims by title, tag, realm, full text
- [ ] Realm browser shows 10 realms
- [ ] Surprise Me serves random skim
- [ ] First 3 skims are curated onboarding skims
- [ ] All domain tests pass (100% coverage)
- [ ] All use case tests pass
- [ ] Feed E2E passes
- [ ] Deployed to Vercel, loads in < 2 seconds

### Phase 2 -- Day 2: "The Full Product"

**Goal:** Complete MVP with Supabase backend, user accounts, all 4 reading modes, AI generation, content creation, share cards.

#### Phase 2 Scope

| Category | What Gets Built |
|----------|----------------|
| **Application** | All remaining use cases (auth, reactions, AI, creation, reporting, progression, stats) |
| **Infrastructure** | All Supabase adapters, `ClaudeAIService`, `CanvasShareCardService`, Supabase Auth, DB migrations |
| **Presentation** | Subtitle mode, Teleprompter mode, SkimBuilder (creation flow), AuthPrompt, ProfilePage, CreatorStats, ModeUnlockCard, StreakDiscovery, ShareNudge, PauseHint, OverflowMenu (share/report) |
| **Tests** | Adapter integration tests, component tests for new modes, E2E for creation + auth flows |

#### Phase 2 Build Order

```
1. Supabase setup (project, local dev, schema migrations)
2. DB schema: skims, users, reactions, views, reports tables + RLS policies
3. Infrastructure: SupabaseSkimRepository + tests
4. Infrastructure: SupabaseUserRepository + tests
5. Infrastructure: SupabaseReactionRepository + tests
6. Infrastructure: SupabaseViewRepository + tests
7. Infrastructure: SupabaseReportRepository + tests
8. Infrastructure: SupabaseAuthAdapter
9. Infrastructure: DI container (phase 2 mode, swap adapters)
10. Infrastructure: ClaudeAIService + tests (AI prompt template for Hook/Core/Snap)
11. Application: CreateSkim, UpdateSkim + tests
12. Application: RecordGotIt, ToggleBookmark, RecordLike, RecordSkimView + tests
13. Application: ReportSkim + tests (auto-hide threshold)
14. Application: GenerateAISkim, GetAIFeedback + tests (rate limiting)
15. Application: AuthenticateUser, GetUserProfile, GetCreatorStats + tests
16. Application: CheckStreakStatus, CheckShareNudge + tests
17. API routes: POST /api/skims, POST /api/skims/[id]/got-it, bookmark, like, view, report
18. API routes: POST /api/ai/generate, POST /api/ai/feedback
19. API routes: GET /api/auth/callback, POST /api/share/card
20. Server actions: recordGotIt, toggleBookmark, recordLike
21. Presentation: Subtitle mode + tests
22. Presentation: Teleprompter mode + tests
23. Presentation: ModePicker (all 4 modes, lock/unlock states)
24. Presentation: Mid-skim mode switching (progress mapping, 300ms crossfade)
25. Presentation: SkimBuilder (Hook/Core/Snap editors, WordCountIndicator, DifficultyPicker, RealmPicker)
26. Presentation: Preview in all modes
27. Presentation: AuthPrompt (bottom sheet after skim 3)
28. Presentation: ProfilePage (stats, bookmarks, published skims)
29. Presentation: CreatorStats
30. Presentation: ModeUnlockCard (subtitle at 5, teleprompter at 10)
31. Presentation: StreakDiscovery (3 days)
32. Presentation: ShareNudge (5 skims in session)
33. Presentation: PauseHint (first skim ghost text)
34. Presentation: OverflowMenu (like, share, copy link, report)
35. Infrastructure: CanvasShareCardService (portrait, stories, square formats)
36. Presentation: Share card generation UI
37. Seed Supabase with 50 launch skims
38. E2E: creation flow
39. E2E: auth flow
40. E2E: mode switching
41. Deploy Phase 2 to Vercel
```

#### Phase 2 Definition of Done

- [ ] All Phase 1 items still work
- [ ] User can sign up / sign in (Google + email)
- [ ] Got it!, bookmark, like persist to Supabase
- [ ] View tracking works (duration, completion, mode)
- [ ] Feed algorithm uses real engagement data
- [ ] Skim of the Day computed from real data
- [ ] Subtitle mode works with phrase chunking
- [ ] Teleprompter mode works with continuous scroll
- [ ] Mode switching mid-skim preserves progress
- [ ] Mode unlock prompts appear at skim 5 and 10
- [ ] Content creation flow works (Hook/Core/Snap builder)
- [ ] Word count validation enforces all SKIMM_RULES
- [ ] AI skim generation works (Claude API)
- [ ] AI-assisted badge shown on generated skims
- [ ] Rate limit: 3 AI generations/day/user
- [ ] Share card generation works (3 formats)
- [ ] Report button works, auto-hide at threshold
- [ ] Creator stats page shows real data
- [ ] Streak discovery triggers at 3 consecutive days
- [ ] Auth prompt at skim 3 for anonymous users
- [ ] All tests pass
- [ ] All E2E tests pass
- [ ] Deployed to Vercel

---

## 13. Phase Dependency Graph

```
Phase 1 Build Order:
  Setup (scaffolding)
    └── Phase 1A: Domain + Data (entities, services, JSON adapters)
         ├── Phase 1B: RSVP Engine (the "wow" moment)
         │    └── Phase 1C: Classic + Feed Shell (second mode + feed UX)
         │         └── Phase 1D: Explore + Navigation (search, realms, tabs)
         │              └── MILESTONE: Phase 1 Deploy (static site, 50 skims, 2 modes)
         │
         └── Phase 2B: Subtitle + Teleprompter (needs 1B renderer interface)

Phase 2 Build Order:
  Phase 2A: Supabase Backend (can start in parallel with 1C/1D)
    ├── Phase 2C: Creation + AI (needs auth from 2A)
    │    └── Phase 2D: Sharing + Stats + Polish (final convergence)
    └── Phase 2D also depends on 2A directly

  MILESTONE: Phase 2 Deploy (full MVP) = 2A + 2B + 2C + 2D complete
```

### Parallelization Opportunities

- Phase 2A (backend) can start while Phase 1C/1D are being built
- Phase 2B (Subtitle + Teleprompter) can be built in parallel with Phase 2A
- Phase 2C (creation + AI) starts once 2A lands
- Phase 2D (sharing + polish) is the final convergence phase

### Phase-to-Layer Mapping

The domain layer is **complete after Phase 1A**. Everything after that is application use cases, adapters, and presentation.

| Phase | Domain | Application | Infrastructure | Presentation |
|-------|--------|-------------|---------------|-------------|
| Setup | Folder structure, types, branded IDs | Folder structure, Result type | DI shell, env config | Tailwind config, globals.css, layout |
| 1A | All entities, VOs, all services | Feed use cases, PreviewSkim | JSON + localStorage adapters, Fuse | -- |
| 1B | (complete) | (complete) | -- | RSVP renderer, WPM slider, progress bar |
| 1C | (complete) | (complete) | -- | Classic, Feed, Got It, Bookmark, sheets |
| 1D | (complete) | (complete) | -- | Navigation, Explore, Search, Realm browser |
| 2A | (complete) | Auth, engagement use cases | Supabase adapters (swap in), Auth | Auth prompt, deferred auth |
| 2B | (complete) | CheckModeUnlock | -- | Subtitle, Teleprompter, mode picker |
| 2C | (complete) | CreateSkim, AI use cases | ClaudeAIService | Skim builder, creation flow |
| 2D | (complete) | Stats, profile use cases | ShareCardService | Share, profile, a11y, polish |

### Tests Per Phase

| Phase | Test Count | TDD Required | Key Tests |
|-------|-----------|-------------|-----------|
| Setup | ~1 | No | Smoke test (domain types compile) |
| 1A | ~60 | Yes | SkimValidator (12 rules), Tokenizer, PhraseChunker, WordCounter, FeedRanker, SkimScorer, ProgressMapper, use cases with mocked ports |
| 1B | ~15 | Yes | RSVP word display, WPM timing, pause/resume, key terms, snap flourish, progress bar |
| 1C | ~20 | Partial | Classic rendering, feed snap-scroll, Got It states, bookmark toggle, mode switching |
| 1D | ~10 | No | Tab switching, search results, Realm filtering, empty state |
| 2A | ~15 | Yes | Supabase CRUD, RLS policies, auth flow, engagement use cases |
| 2B | ~20 | Yes | Subtitle chunking, Teleprompter scroll, progressive disclosure, mode switching matrix |
| 2C | ~15 | Yes | Skim builder validation, AI generation (MSW), rate limiting |
| 2D | ~15 + 5 E2E | Partial | Share cards, accessibility (axe-core), keyboard shortcuts, 5 critical E2E journeys |
| **Total** | **~185** | | |

---

## 14. DevOps & CI/CD

### 13.1 Local Development

```bash
# First time
pnpm install
cp .env.example .env.local      # fill in values
supabase start                   # local Supabase (Phase 2 only)

# Daily
pnpm dev                         # Next.js dev server (port 3000)
pnpm test                        # Vitest watch mode
pnpm test:e2e                    # Playwright (requires dev server running)
```

### 13.2 Package Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && eslint src/ --ext .ts,.tsx",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "typecheck": "tsc --noEmit",
    "check": "pnpm lint && pnpm typecheck && pnpm test:run && pnpm build"
  }
}
```

### 14.3 CI Pipeline (GitHub Actions) — Three-Job Split

The CI is split into three jobs optimized for speed. Most PRs get fast feedback (<30s). Full suite runs only when needed.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  # Job 1: Fast (<30s) — Runs on EVERY PR
  fast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:run --coverage
      - run: pnpm build
      - uses: codecov/codecov-action@v4

  # Job 2: Integration (<60s) — Only when infrastructure changes
  integration:
    runs-on: ubuntu-latest
    needs: fast
    if: contains(github.event.pull_request.changed_files, 'src/infrastructure/')
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:int

  # Job 3: E2E (<3min) — Only on PRs to main
  e2e:
    runs-on: ubuntu-latest
    needs: fast
    if: github.base_ref == 'main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

**Performance budgets:** Unit+component <30s, integration <60s, E2E <3min, total <5min. Single test >5s = investigate.

### 14.4 Deploy Pipeline

- **Vercel** auto-deploys on push to `main`
- Preview deploys on every PR
- Environment variables set in Vercel dashboard (not committed)
- `NEXT_PUBLIC_PHASE` controls Phase 1 vs Phase 2 adapter selection

### 14.5 Branch Strategy

```
main              <- production, auto-deploys to Vercel
├── phase-1       <- Phase 1 work, merges to main when done
└── phase-2       <- Phase 2 work, merges to main when done
```

Feature branches off `phase-1` or `phase-2` for individual features.

---

### 14.6 Commit Conventions (Conventional Commits)

```
feat(rsvp): implement adaptive speed for long words
fix(feed): correct snap-scroll behavior on iOS Safari
chore(config): add Inter font loading
test(rsvp): add unit tests for punctuation pause timing
docs(adr): add reading mode strategy pattern decision
```

### 14.7 PR Template

```markdown
## What
[One sentence describing the change]

## Why
[Context and motivation]

## How
[Technical approach]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing on mobile viewport (375px)
- [ ] Dark mode verified
- [ ] Accessibility checked (axe-core, keyboard nav)

## Design Spec Reference
[Link to relevant SKIM_DESIGN.md section]
```

---

## 15. Development Workflow

### 15.1 For Each Feature

```
1. PLAN   — What are we building? What tests will prove it works?
2. TEST   — Write failing tests first
3. BUILD  — Write minimal code to pass tests
4. VERIFY — All tests pass, lint passes, build succeeds
5. REVIEW — Read the diff. Is there a simpler way?
6. LEARN  — Update lessons.md with any discoveries
```

### 15.2 Subagent Strategy

Use subagents (Claude Code /task) for parallelizable work:

- **One subagent per domain service** -- write SkimValidator + tests, Tokenizer + tests, etc. in parallel
- **One subagent per adapter** -- SupabaseSkimRepository, ClaudeAIService, etc.
- **One subagent per component** -- RSVPMode, SubtitleMode, GotItButton, etc.
- **Never two subagents touching the same file**

### 15.3 Code Review Checklist

Before merging any change:

- [ ] Tests pass (`pnpm test:run`)
- [ ] Lint clean (`pnpm lint`)
- [ ] Types check (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No domain layer imports from infrastructure
- [ ] No application layer imports from presentation
- [ ] New domain services have 100% test coverage
- [ ] Use cases handle error paths
- [ ] No hardcoded values that should be in constants
- [ ] Component follows design system (SKIM_DESIGN.md)
- [ ] Content validation follows SKIMM_RULES
- [ ] Accessibility: focus management, aria attributes, reduced motion

---

## 16. Documentation Strategy

### 16.1 Living Documents

| Document | Location | Purpose |
|----------|----------|---------|
| `SKIM_PLAN.md` | project root | Product spec (what to build) |
| `SKIM_DESIGN.md` | project root | Design system (how it looks) |
| `SKIMM_RULES.md` | project root | Content rules (how skims are written) |
| `DEVELOPMENT_PLAN.md` | project root | This file (how to build it) |

### 16.2 Code-Level Documentation

- **Domain services:** JSDoc on each exported function (input, output, rules it enforces)
- **Ports:** JSDoc on each interface method (what it does, not how)
- **Use cases:** JSDoc on `execute()` method (what the use case does, error cases)
- **Components:** No JSDoc unless the component has non-obvious behavior
- **Do NOT add comments that restate the code.** Comments explain WHY, not WHAT.

### 16.3 Architecture Decision Records

For significant architecture decisions, create a brief ADR in the PR description:

```
## ADR: [Decision Title]
**Context:** What situation prompted this decision?
**Decision:** What did we decide?
**Rationale:** Why this approach over alternatives?
**Consequences:** What are the tradeoffs?
```

---

## 20. Lessons & Self-Improvement

### 20.1 Lessons File

```
tasks/lessons.md
```

After EVERY correction, bug fix, or unexpected discovery, append to this file:

```
## [Date] — Brief title
**What happened:** One sentence.
**Root cause:** One sentence.
**Rule to prevent recurrence:** One sentence.
```

### 20.2 Common Pitfalls (Pre-Loaded)

These are known risks based on the architecture:

| Pitfall | Prevention |
|---------|------------|
| Domain importing infrastructure | ESLint `no-restricted-imports` rule |
| Tests that depend on external services | All domain tests are pure. Use case tests use in-memory ports. |
| Leaking Supabase types into domain | Domain types are defined in `src/domain/`. Adapters map Supabase rows to domain types. |
| Next.js server/client confusion | Server components can call use cases directly. Client components call via API routes or server actions. |
| Forgetting to tokenize on skim create/update | CreateSkim and UpdateSkim use cases always run tokenizer. |
| RSVP timing drift | Use `requestAnimationFrame` not `setInterval` for word display timing. |
| Feed score computed incorrectly in Phase 1 | Phase 1 has no real engagement data. FeedRanker falls back to freshness + curated order. |
| localStorage full | Catch quota exceeded errors in LocalStorage adapters. Degrade gracefully. |
| Word count indicator ranges | SKIMM_RULES.md is the canonical source (80-110 green), not SKIM_PLAN.md (60-100 green). |
| Seed data missing tokens | The `seed-skimms-*.json` files contain raw Hook/Core/Snap text but no Token arrays. Tokenization happens in Phase 1A. |

---

## 17. Claude Code Workflow

### 17.1 MCP Servers

- **Supabase MCP** -- Database interaction, schema management, RLS policy testing
- **Vercel MCP** -- Deployment status, environment variable management (if available)

### 17.2 Custom Slash Commands

- `/skim-check` -- Validate a skim's Hook/Core/Snap structure + word count against SKIMM_RULES.md
- `/design-audit` -- Compare current component implementation against SKIM_DESIGN.md specs
- `/test-mode` -- Run reading mode renderer through test scenarios

### 17.3 Hooks

- **Pre-commit:** Run lint + type check + tests on staged files (via Husky + lint-staged)
- **Post-save:** Auto-format with Prettier

### 17.4 Memory/Knowledge Files

- `.claude/knowledge/services/skim-web.md` -- Main app service documentation
- `.claude/knowledge/services/supabase.md` -- Database schema, RLS policies
- `.claude/learnings/patterns.md` -- Coding patterns established during development
- `.claude/learnings/gotchas.md` -- Edge cases and pitfalls discovered

---

## 18. Monitoring & Observability

### 18.1 Error Handling Strategy

- **Client errors:** Global error boundary (Next.js `error.tsx` per route segment)
- **API errors:** Consistent response format: `{ error: string, code: number }`
- **Offline resilience:** Queue Got it! and bookmark actions in localStorage, sync on reconnect
- **Graceful degradation:** If Supabase is down, fall back to cached/static skims

### 18.2 Production Metrics

| Category | Metrics |
|----------|---------|
| Core | Got it! rate, completion rate, skip rate (<2s), views per skim |
| Performance | Time to First Skim (<2s target), RSVP engine frame rate, feed scroll performance |
| Errors | Client-side error rate, API error rate, auth failure rate |
| Growth | Share card generation count, link preview clicks, user registrations |
| Reading modes | Mode usage distribution, mode switch frequency, WPM distribution |

### 18.3 Tools (MVP)

- Vercel Analytics (built-in, free tier)
- Console error reporting (upgrade to Sentry when traffic justifies)
- Supabase dashboard for database metrics

---

## 19. CLAUDE.md Specification

The project-level `CLAUDE.md` should contain:

```markdown
# Skim -- Project Instructions

## Tech Stack
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand + Supabase + Claude API

## Architecture
Hexagonal (ports and adapters). See DEVELOPMENT_PLAN.md Section 2.
- Domain imports nothing external
- Application imports domain only
- Infrastructure implements port interfaces
- Presentation uses domain types, calls use cases via server actions or route handlers

## Conventions
- Server Actions for mutations, Route Handlers for paginated reads, Server Components for initial data
- Vitest for unit/component/integration tests, Playwright for E2E
- Conventional Commits (feat/fix/chore/test/docs)
- TDD mandatory for domain, application, and reading mode engines
- Dark mode first, mobile first (375px)

## Key References
- Product spec: SKIM_PLAN.md
- Design system: SKIM_DESIGN.md (Section 16 = Tailwind config)
- Content rules: SKIMM_RULES.md
- Development plan: DEVELOPMENT_PLAN.md

## Commands
pnpm dev / build / test / test:run / test:e2e / lint / typecheck / check

## Reading Mode Interface
Each mode implements: render(), pause(), resume(), getProgress()
Domain services (Tokenizer, PhraseChunker, ProgressMapper) feed data to renderers.

## Content Validation
SKIMM_RULES.md is the canonical source. SkimValidator enforces all 12 rules.
Word count zones: 80-110 green, 110-130 neutral, 130-150 yellow, 150+ red.

## Principles
- Plan first (3+ steps = plan mode)
- Test first (red-green-refactor)
- Verify before marking done
- Update tasks/lessons.md after corrections
- "Would a staff engineer approve this?"
```

---

*This document is the single source of truth for how Skim is built. It integrates the hexagonal architecture (architect), TDD testing strategy (tdd-lead), and phased build plan (devops-lead). When this plan and the code disagree, update one of them -- never leave them out of sync.*
