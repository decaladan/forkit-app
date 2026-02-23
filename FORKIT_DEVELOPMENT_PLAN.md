# FORKIT — Development Plan

*Finalized 2026-02-20 by the forkit-dev-planning team (architect, tdd-lead, devops-lead)*

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

ForkIt uses **hexagonal architecture** (ports & adapters). The core idea: business logic lives in the center, untouched by infrastructure concerns. Storage, APIs, AI services, and UI are pluggable adapters around the edges.

```
                    ┌─────────────────────────────┐
                    │        PRESENTATION           │
                    │  React components, hooks       │
                    │  Zustand stores, animations    │
                    │  Debate viewer, recipe cards    │
                    └──────────────┬────────────────┘
                                   │ calls via API routes / server actions
                    ┌──────────────▼────────────────┐
                    │        INFRASTRUCTURE           │
                    │  Next.js routes, adapters        │
                    │  DI container, Supabase          │
                    │  Claude API, Image API, Stripe   │
                    └──────────────┬────────────────┘
                                   │ implements ports, injects into
                    ┌──────────────▼────────────────┐
                    │         APPLICATION              │
                    │  Use cases (orchestration)        │
                    │  depends on domain only           │
                    └──────────────┬────────────────┘
                                   │ uses
                    ┌──────────────▼────────────────┐
                    │           DOMAIN                 │
                    │  Entities, value objects          │
                    │  Services (pure functions)        │
                    │  Ports (interfaces)               │
                    │  *** ZERO dependencies ***        │
                    └─────────────────────────────────┘
```

**Why hexagonal for ForkIt?** The build plan calls for Phase 1 (pre-generated debates + recipes in static JSON, localStorage) and Phase 2 (live Claude API for debate generation, real recipe invention, Supabase backend, image generation, payments). With hexagonal architecture, the domain and application layers are identical in both phases. Only the adapters swap. This is not theoretical elegance -- it's the literal deployment strategy.

**Key architectural difference from Skim:** ForkIt's core animated experience is the **chef debate**, not a reading mode engine. The debate is a 30-second scripted sequence of chef messages with escalation dynamics. In Phase 1, debates are pre-scripted JSON. In Phase 2, debates are generated live by Claude API. The domain layer defines the debate structure and timing; the infrastructure layer provides the content. The presentation layer animates it. Clean separation at every level.

---

## 3. Domain Layer

The domain layer is **pure TypeScript**. Zero external dependencies. Zero I/O. Every function is deterministic and testable without mocks.

### 3.1 Entities

```typescript
// src/domain/entities/Recipe.ts
interface Recipe {
  id: RecipeId;
  name: string;                    // Creative dish name (e.g., "Chaos Ramen")
  tagline: string;                 // One-liner hook (e.g., "What happens when 5 chefs fight over noodles")
  debateSummary: string;           // What happened in the council (1-2 sentences)
  winningChef: ChefId;            // Which chef's philosophy won
  ingredients: Ingredient[];       // Full ingredient list with amounts
  steps: Step[];                   // Ordered cooking instructions
  stats: RecipeStats;             // Engagement metrics
  smartSwaps: SmartSwap[];         // Ingredient substitutions
  snap: string;                    // The memorable final line
  photoUrl: string;                // AI-generated food photo URL
  difficulty: RecipeDifficulty;    // easy | medium | hard
  estimatedTime: number;           // Minutes to prepare + cook
  estimatedCost: CostTier;        // $ | $$ | $$$
  servings: number;
  tags: RecipeTag[];
  userId?: UserId;                 // null for system-generated
  createdAt: Date;
  status: RecipeStatus;
}

// src/domain/entities/Chef.ts
interface Chef {
  id: ChefId;
  name: string;                    // "Max Flavour", "Budget King", etc.
  personality: string;             // Short personality description
  color: string;                   // Hex color for UI theming
  avatar: string;                  // Path to avatar asset
  voicePatterns: string[];         // How this chef talks (for AI prompt engineering)
  foodPhilosophy: string;         // Core cooking philosophy
  priorities: ChefPriority[];     // What this chef optimizes for
}

// src/domain/entities/Debate.ts
interface Debate {
  id: DebateId;
  recipeId: RecipeId;
  messages: DebateMessage[];       // The full debate transcript
  winnerId: ChefId;               // Who won the argument
  duration: number;                // Always 30 seconds
  participantIds: ChefId[];       // Which chefs participated (3-5)
  escalationPeak: number;         // Timestamp of max intensity (0-30s)
  timestamp: Date;
}

// src/domain/entities/DebateMessage.ts
interface DebateMessage {
  chefId: ChefId;
  text: string;                    // What the chef said
  timestamp: number;               // Relative to debate start (0-30s)
  intensity: DebateIntensity;     // calm | heated | explosive
  referencesChef?: ChefId;        // If this message is a direct response
}

// src/domain/entities/Pantry.ts
interface Pantry {
  userId: UserId;
  ingredients: PantryItem[];
  lastUpdated: Date;
}

// src/domain/entities/PantryItem.ts
interface PantryItem {
  name: string;
  category: IngredientCategory;
  addedAt: Date;
  expiresAt?: Date;
}

// src/domain/entities/RecipeInteraction.ts
interface RecipeInteraction {
  id: InteractionId;
  recipeId: RecipeId;
  userId: UserId;
  type: InteractionType;
  createdAt: Date;
}

// src/domain/entities/User.ts
interface User {
  id: UserId;
  username: string;
  email: string;
  preferredChefs: ChefId[];        // Favorite chefs for weighting
  subscription: SubscriptionTier;  // free | premium
  dailyGenerations: number;        // Tracks daily AI usage
  dailyGenerationsReset: Date;     // When the counter resets
  savedRecipeCount: number;
  totalGenerations: number;
  createdAt: Date;
}
```

### 3.2 Value Objects

```typescript
// src/domain/value-objects/Ingredient.ts
interface Ingredient {
  name: string;
  amount: string;                  // "2 cups", "1 tbsp", "a pinch"
  category: IngredientCategory;
  isKey: boolean;                  // Highlighted in recipe card
  estimatedCost?: number;          // Cents, for cost estimation
}

// src/domain/value-objects/Step.ts
interface Step {
  order: number;
  instruction: string;
  durationMinutes?: number;        // Estimated time for this step
  chefTip?: string;               // Optional tip from the winning chef
}

// src/domain/value-objects/SmartSwap.ts
interface SmartSwap {
  original: string;                // Original ingredient
  substitute: string;              // Swap suggestion
  reason: string;                  // Why this works
  swapType: SwapType;             // healthier | cheaper | easier | dietary
}

// src/domain/value-objects/RecipeStats.ts
interface RecipeStats {
  makeThisCount: number;
  saveCount: number;
  shareCount: number;
  skipCount: number;
  viewCount: number;
  total: number;                   // Computed feed score
}

// src/domain/value-objects/RecipeScore.ts
interface RecipeScore {
  makeThisCount: number;
  saveCount: number;
  shareCount: number;
  viewCount: number;
  skipCount: number;
  freshnessBias: number;
  total: number;                   // Computed
}

// src/domain/value-objects/types.ts
type RecipeId = string & { readonly __brand: 'RecipeId' };
type DebateId = string & { readonly __brand: 'DebateId' };
type ChefId = 'max-flavour' | 'maximum-junk' | 'gut-fix' | 'budget-king' | 'speed-demon';
type UserId = string & { readonly __brand: 'UserId' };
type InteractionId = string & { readonly __brand: 'InteractionId' };
type PantryId = string & { readonly __brand: 'PantryId' };
type RecipeTag = string & { readonly __brand: 'RecipeTag' };

type RecipeDifficulty = 'easy' | 'medium' | 'hard';
type CostTier = '$' | '$$' | '$$$';
type RecipeStatus = 'generating' | 'published' | 'hidden' | 'reported';
type DebateIntensity = 'calm' | 'heated' | 'explosive';
type InteractionType = 'make_this' | 'save' | 'share' | 'skip';
type SubscriptionTier = 'free' | 'premium';
type SwapType = 'healthier' | 'cheaper' | 'easier' | 'dietary';
type IngredientCategory = 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'sauce' | 'oil' | 'other';

type ChefPriority = 'flavour' | 'indulgence' | 'gut-health' | 'budget' | 'speed' | 'nutrition';
```

### 3.3 The Five Chefs

The chef council is the soul of ForkIt. Each chef has a distinct personality, food philosophy, and debate style. These are **domain constants**, not configuration.

```typescript
// src/domain/constants/chefs.ts
export const CHEFS: Record<ChefId, Chef> = {
  'max-flavour': {
    id: 'max-flavour',
    name: 'Max Flavour',
    personality: 'The flavour obsessive. Everything must taste incredible. Will add butter to anything.',
    color: '#FF6B35',
    avatar: '/chefs/max-flavour.png',
    voicePatterns: [
      'Look, if it doesn\'t make your eyes roll back...',
      'Flavour is non-negotiable.',
      'You know what this needs? More garlic.',
    ],
    foodPhilosophy: 'Life is too short for bland food. Every bite should be a moment.',
    priorities: ['flavour'],
  },
  'maximum-junk': {
    id: 'maximum-junk',
    name: 'Maximum Junk',
    personality: 'The comfort food champion. Deep fry it. Add cheese. No guilt.',
    color: '#FFD23F',
    avatar: '/chefs/maximum-junk.png',
    voicePatterns: [
      'Oh come on, live a little!',
      'You know what makes everything better? Cheese.',
      'Health is a spectrum and I\'m on the fun end.',
    ],
    foodPhilosophy: 'Food should make you happy. Period. No apologies.',
    priorities: ['indulgence'],
  },
  'gut-fix': {
    id: 'gut-fix',
    name: 'Gut Fix',
    personality: 'The health warrior. Probiotics, fiber, anti-inflammatory. Your gut will thank you.',
    color: '#06D6A0',
    avatar: '/chefs/gut-fix.png',
    voicePatterns: [
      'Your microbiome is literally begging for this.',
      'Do you even know what that does to your gut lining?',
      'Fermented. Always fermented.',
    ],
    foodPhilosophy: 'You are what you eat, and your gut bacteria agree.',
    priorities: ['gut-health', 'nutrition'],
  },
  'budget-king': {
    id: 'budget-king',
    name: 'Budget King',
    personality: 'The frugal genius. Maximum taste per dollar. Waste nothing.',
    color: '#118AB2',
    avatar: '/chefs/budget-king.png',
    voicePatterns: [
      'That\'s $14 an ounce. Are you insane?',
      'I can make that for a third of the price.',
      'Leftovers are just pre-planned meals.',
    ],
    foodPhilosophy: 'Great food doesn\'t require a great budget. Creativity beats cash.',
    priorities: ['budget'],
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    personality: 'The time optimizer. 15 minutes or it\'s not worth making. One pan maximum.',
    color: '#EF476F',
    avatar: '/chefs/speed-demon.png',
    voicePatterns: [
      'That takes HOW long?',
      'One pan. That\'s all you get.',
      'If it takes longer than ordering delivery, what\'s the point?',
    ],
    foodPhilosophy: 'Time is the most expensive ingredient. Respect it.',
    priorities: ['speed'],
  },
} as const;
```

### 3.4 Domain Services

All domain services are **pure functions**. No classes with state. No side effects. No I/O.

| Service | Purpose | Key Rules |
|---------|---------|-----------|
| `RecipeValidator` | Enforces all FORKIT_RULES content rules | Name <= 60 chars, tagline <= 120 chars, 3-20 ingredients, 2-15 steps, snap <= 30 words, no step > 50 words |
| `RecipeScorer` | Computes feed score | `score = (make_this * 8) + (save * 5) + (share * 10) + (views * 0.1) + freshness_boost - (skip * 3)` |
| `DebateScripter` | Generates debate timing and escalation | 30s total, 5-8 messages, intensity escalates (calm -> heated -> explosive), peak at 20-25s, resolution at 28-30s |
| `ChefPersonality` | Maps chef traits to food preferences | Given a dish concept, returns each chef's likely opinion, argument angle, and intensity |
| `PantryMatcher` | Matches pantry contents to possible recipes | Scores by ingredient overlap, suggests missing items, minimum 60% match threshold |
| `CostEstimator` | Estimates recipe cost from ingredients | Sums ingredient costs, applies regional multiplier, returns CostTier ($/<$10, $$/$10-25, $$$/>$25) |
| `SwapGenerator` | Generates smart ingredient substitutions | Maps common swaps (butter->olive oil, cream->coconut cream), categorizes by swap type |
| `DifficultyCalculator` | Assesses recipe difficulty | Factors: step count, technique complexity, ingredient rarity, total time. Returns easy/medium/hard |
| `FeedRanker` | Sorts recipes by computed score | 24h freshness boost with exponential decay, winner-chef diversity bonus |
| `DailyLimitChecker` | Checks and enforces daily generation limits | Free: 3/day, Premium: 20/day, resets at midnight UTC |

### 3.5 Domain Validation Rules (FORKIT_RULES)

These rules are enforced programmatically in `RecipeValidator`:

1. Recipe name <= 60 characters
2. Recipe name is not empty
3. Tagline <= 120 characters
4. Tagline is not empty
5. Ingredients count: minimum 3, maximum 20
6. Each ingredient has a non-empty name and amount
7. Steps count: minimum 2, maximum 15
8. No step instruction > 50 words
9. Each step has a non-empty instruction
10. Snap <= 30 words
11. Snap is not empty
12. Debate has exactly 5-8 messages
13. Debate duration is exactly 30 seconds
14. Debate messages are ordered by timestamp
15. Debate intensity escalates (no explosive before a calm after the peak)
16. Winning chef is a participant in the debate
17. Smart swaps reference actual ingredients in the recipe
18. Difficulty matches calculated difficulty (within 1 level tolerance)
19. Estimated time > 0 and <= 480 minutes (8 hours max)
20. Servings >= 1 and <= 20

### 3.6 Debate Escalation Curve

The `DebateScripter` enforces a specific narrative arc for every debate:

```
Intensity
    ^
    |                          ****
    |                       ***    *
    |                    ***        *
    |                 ***            **
    |              **                  **
    |           **                       **
    |        **                            *
    |     **                                 *
    |  **                                      *
    +---+----+----+----+----+----+----+----------->
    0   5    10   15   20   25   28   30   Time (s)

    |--calm--|---heated---|--explosive--|--resolve--|
```

- **0-10s:** Calm opening. Chefs state positions. 2-3 messages.
- **10-20s:** Heated debate. Chefs clash. Direct responses. 2-3 messages.
- **20-25s:** Explosive peak. The signature moment. 1-2 messages.
- **25-30s:** Resolution. Winning chef delivers final argument. 1 message.

### 3.7 Feed Scoring Algorithm

```
score = (make_this_count * 8) + (save_count * 5) + (share_count * 10)
      + (view_count * 0.1) + freshness_boost
      - (skip_count * 3)

freshness_boost = max(0, 100 - (hours_since_creation * 4.17))
// Decays linearly from 100 to 0 over 24 hours

diversity_bonus = chef_not_seen_in_last_5 ? 15 : 0
// Prevents same winning chef appearing consecutively

final_score = score + diversity_bonus
```

---

## 4. Application Layer

The application layer contains **use cases** -- each a single class that orchestrates domain services and port calls. Use cases depend on domain only. They never import infrastructure.

### 4.1 Use Case Catalog

#### Feed & Discovery
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `GenerateRecipe` | userId?, chefPreferences? | Result<{debate: Debate, recipe: Recipe}, Error> | THE core use case. Tap Fork It -> debate -> recipe. Orchestrates AI debate, recipe generation, photo generation, validation. |
| `GetRecipeHistory` | userId, cursor, limit | PaginatedResult<Recipe> | Fetch user's generated recipe history, newest first |
| `GetRecipeById` | id | RecipeWithDebate or null | Fetch recipe with its associated debate |
| `SearchRecipes` | query | SearchResult[] | Fuzzy search via SearchService port |
| `GetDailyStats` | userId | DailyStats | Generations used, remaining, streak |
| `GetFeedRecipes` | cursor, limit | PaginatedResult<RecipeWithStats> | Fetch recipes, compute scores via FeedRanker, return ranked page |

#### Recipe Interactions
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `SaveRecipe` | recipeId, userId | RecipeInteraction | Add to favorites. Optimistic UI on client. |
| `UnsaveRecipe` | recipeId, userId | void | Remove from favorites |
| `SkipRecipe` | recipeId, userId | void | Record skip, affects feed ranking |
| `ShareRecipe` | recipeId, userId, format | ShareCard | Generate share card image |
| `RecordMakeThis` | recipeId, userId | RecipeInteraction | User signals they'll cook this |

#### AI Orchestration
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `RunCouncilDebate` | topic?, pantryIngredients?, chefPreferences? | Result<Debate, Error> | Orchestrates the 30-second chef debate via AIDebateService. Validates output against DebateScripter rules. |
| `GenerateRecipeFromDebate` | debate, winnerId | Result<Recipe, Error> | Takes debate context + winning chef -> full recipe via AIRecipeService. Validates against RecipeValidator. |
| `GenerateRecipePhoto` | recipe | Result<string, Error> | Generates food photo via ImageGenerationService. Returns URL. |
| `GenerateFromPantry` | userId | Result<{debate: Debate, recipe: Recipe}, Error> | Premium: reads pantry, generates constrained debate + recipe |

#### Pantry Management (Premium)
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `AddPantryItem` | userId, ingredient | PantryItem | Add ingredient to user's pantry |
| `RemovePantryItem` | userId, ingredientName | void | Remove ingredient from pantry |
| `GetPantry` | userId | Pantry | Fetch full pantry with categories |
| `SuggestFromPantry` | userId | PantrySuggestion[] | Uses PantryMatcher to suggest possible recipes from current pantry |
| `ClearExpiredItems` | userId | number | Remove expired pantry items, return count removed |

#### User Management
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `AuthenticateUser` | provider, token | User | Supabase auth flow |
| `GetUserProfile` | userId | UserProfile | Stats, saved recipes, generation history |
| `UpdateChefPreferences` | userId, chefIds | void | Update preferred chefs for debate weighting |
| `CheckDailyLimit` | userId | DailyLimitStatus | Free: 3/day, Premium: 20/day |
| `UpgradeSubscription` | userId, paymentToken | Result<User, PaymentError> | Process Stripe payment, upgrade to premium |

#### Progressive Disclosure
| Use Case | Input | Output | Description |
|----------|-------|--------|-------------|
| `CheckPantryUnlock` | generationCount | UnlockEvent or null | Pantry mode unlocked at 5 generations |
| `CheckShareNudge` | sessionGenerationCount | boolean | Nudge after 3 recipes in one session |
| `CheckAuthPrompt` | generationCount, isAuthenticated | boolean | After generation 2, not yet authenticated |
| `CheckPremiumPrompt` | dailyLimitHit, isAuthenticated | boolean | Show upgrade prompt when free limit reached |

### 4.2 Use Case Pattern

Every use case follows this structure:

```typescript
// src/application/use-cases/ai/GenerateRecipe.ts
export class GenerateRecipe {
  constructor(
    private debateService: AIDebateService,
    private recipeService: AIRecipeService,
    private imageService: ImageGenerationService,
    private recipeRepo: RecipeRepository,
    private debateRepo: DebateRepository,
    private limitChecker: typeof checkDailyLimit,
    private recipeValidator: typeof validateRecipe,
    private debateScripter: typeof validateDebate,
  ) {}

  async execute(input: GenerateRecipeInput): Promise<Result<GenerateRecipeOutput, GenerationError>> {
    // 1. Check daily limit
    const limitStatus = this.limitChecker(input.userId, input.subscription);
    if (limitStatus.isErr()) return err(limitStatus.error);

    // 2. Generate debate via AI
    const debateResult = await this.debateService.generateDebate(input.topic, input.chefPreferences);
    if (debateResult.isErr()) return err(debateResult.error);

    // 3. Validate debate structure
    const debateValidation = this.debateScripter(debateResult.value);
    if (!debateValidation.valid) return err(new ValidationError(debateValidation.errors));

    // 4. Generate recipe from debate winner
    const recipeResult = await this.recipeService.generateRecipe(
      debateResult.value,
      debateResult.value.winnerId
    );
    if (recipeResult.isErr()) return err(recipeResult.error);

    // 5. Validate recipe
    const recipeValidation = this.recipeValidator(recipeResult.value);
    if (!recipeValidation.valid) return err(new ValidationError(recipeValidation.errors));

    // 6. Generate photo
    const photoResult = await this.imageService.generatePhoto(recipeResult.value);
    const photoUrl = photoResult.isOk() ? photoResult.value : '/fallback-photo.png';

    // 7. Persist
    const recipe = { ...recipeResult.value, photoUrl };
    const [savedRecipe, savedDebate] = await Promise.all([
      this.recipeRepo.save(recipe),
      this.debateRepo.save(debateResult.value),
    ]);

    return ok({ debate: savedDebate, recipe: savedRecipe });
  }
}
```

### 4.3 Result Type

All use cases that can fail return `Result<T, E>` from `neverthrow`:

```typescript
// Using neverthrow (pnpm add neverthrow)
import { Result, ok, err } from 'neverthrow';

// In use cases:
async execute(input: GenerateRecipeInput): Promise<Result<GenerateRecipeOutput, GenerationError>> {
  const limitCheck = checkDailyLimit(input.userId, input.subscription);
  if (limitCheck.isErr()) return err(limitCheck.error);
  // ...
  return ok({ debate, recipe });
}
```

`neverthrow` provides a battle-tested Result type with `.map()`, `.mapErr()`, `.andThen()` for chaining, plus `ResultAsync` for composing async operations. No custom monad needed. Zero dependencies. Re-export via `src/application/shared/Result.ts`: `export { ok, err, Result, ResultAsync } from 'neverthrow';`

---

## 5. Ports & Adapters

### 5.1 Ports (Interfaces)

Ports live in `src/domain/ports/`. They define WHAT the domain needs, not HOW it's provided.

```typescript
// src/domain/ports/RecipeRepository.ts
interface RecipeRepository {
  save(recipe: Recipe): Promise<Recipe>;
  findById(id: RecipeId): Promise<Recipe | null>;
  findByUser(userId: UserId, cursor?: string, limit?: number): Promise<PaginatedResult<Recipe>>;
  findTrending(cursor?: string, limit?: number): Promise<PaginatedResult<RecipeWithStats>>;
  findByChef(chefId: ChefId, cursor?: string, limit?: number): Promise<PaginatedResult<Recipe>>;
  findByTag(tag: RecipeTag, cursor?: string, limit?: number): Promise<PaginatedResult<Recipe>>;
  findSaved(userId: UserId): Promise<Recipe[]>;
  updateStatus(id: RecipeId, status: RecipeStatus): Promise<void>;
  findByIds(ids: RecipeId[]): Promise<Recipe[]>;
  findRandom(excludeChefs?: ChefId[]): Promise<Recipe | null>;
  getDailyGenerationCount(userId: UserId, since: Date): Promise<number>;
}

// src/domain/ports/DebateRepository.ts
interface DebateRepository {
  save(debate: Debate): Promise<Debate>;
  findById(id: DebateId): Promise<Debate | null>;
  findByRecipe(recipeId: RecipeId): Promise<Debate | null>;
}

// src/domain/ports/UserRepository.ts
interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updatePreferences(id: UserId, prefs: Partial<UserPreferences>): Promise<void>;
  updateSubscription(id: UserId, tier: SubscriptionTier): Promise<void>;
  incrementDailyGenerations(id: UserId): Promise<void>;
  resetDailyGenerations(id: UserId): Promise<void>;
}

// src/domain/ports/InteractionRepository.ts
interface InteractionRepository {
  save(interaction: RecipeInteraction): Promise<RecipeInteraction>;
  delete(userId: UserId, recipeId: RecipeId, type: InteractionType): Promise<void>;
  findByUserAndRecipe(userId: UserId, recipeId: RecipeId): Promise<RecipeInteraction[]>;
  findSavedByUser(userId: UserId): Promise<RecipeInteraction[]>;
  countByRecipeAndType(recipeId: RecipeId, type: InteractionType): Promise<number>;
}

// src/domain/ports/PantryRepository.ts
interface PantryRepository {
  getPantry(userId: UserId): Promise<Pantry | null>;
  addItem(userId: UserId, item: PantryItem): Promise<PantryItem>;
  removeItem(userId: UserId, ingredientName: string): Promise<void>;
  clearExpired(userId: UserId): Promise<number>;
  updateLastModified(userId: UserId): Promise<void>;
}

// src/domain/ports/AIDebateService.ts
interface AIDebateService {
  generateDebate(
    topic?: string,
    chefPreferences?: ChefId[],
    pantryConstraints?: string[]
  ): Promise<Result<Debate, AIError>>;
}

// src/domain/ports/AIRecipeService.ts
interface AIRecipeService {
  generateRecipe(
    debate: Debate,
    winnerId: ChefId
  ): Promise<Result<Recipe, AIError>>;
}

// src/domain/ports/ImageGenerationService.ts
interface ImageGenerationService {
  generatePhoto(recipe: Recipe): Promise<Result<string, ImageError>>;
}

// src/domain/ports/PaymentService.ts
interface PaymentService {
  createCheckoutSession(userId: UserId, tier: SubscriptionTier): Promise<Result<string, PaymentError>>;
  verifyPayment(sessionId: string): Promise<Result<PaymentConfirmation, PaymentError>>;
  cancelSubscription(userId: UserId): Promise<Result<void, PaymentError>>;
}

// src/domain/ports/SearchService.ts
interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  indexRecipe(recipe: Recipe): void;
  removeRecipe(id: RecipeId): void;
}

// src/domain/ports/ShareCardService.ts
interface ShareCardService {
  generateCard(recipe: Recipe, format: 'portrait' | 'stories' | 'square'): Promise<Blob>;
}
```

### 5.2 Adapters

Adapters live in `src/infrastructure/adapters/`. Each adapter implements exactly one port.

#### Phase 1 Adapters (Day 1 -- Static)

| Adapter | Port | Storage |
|---------|------|---------|
| `JsonRecipeRepository` | RecipeRepository | Reads from `src/data/recipes.json` (20 pre-generated recipes) |
| `JsonDebateRepository` | DebateRepository | Reads from `src/data/debates.json` (20 pre-scripted debates) |
| `LocalInteractionRepository` | InteractionRepository | localStorage |
| `FuseSearchService` | SearchService | fuse.js client-side index |
| `NoOpAIDebateService` | AIDebateService | Returns pre-scripted debate from JSON pool |
| `NoOpAIRecipeService` | AIRecipeService | Returns pre-generated recipe from JSON pool |
| `NoOpImageService` | ImageGenerationService | Returns pre-assigned photo URL from recipe data |
| `NoOpPaymentService` | PaymentService | Returns "Coming soon" error |
| `NoOpPantryRepository` | PantryRepository | Returns "Premium feature" error |
| `NoOpShareCardService` | ShareCardService | Returns placeholder |

#### Phase 2 Adapters (Day 2 -- Full AI)

| Adapter | Port | Storage |
|---------|------|---------|
| `SupabaseRecipeRepository` | RecipeRepository | Supabase Postgres |
| `SupabaseDebateRepository` | DebateRepository | Supabase Postgres |
| `SupabaseUserRepository` | UserRepository | Supabase Postgres + Auth |
| `SupabaseInteractionRepository` | InteractionRepository | Supabase Postgres |
| `SupabasePantryRepository` | PantryRepository | Supabase Postgres |
| `ClaudeDebateService` | AIDebateService | Anthropic Claude API |
| `ClaudeRecipeService` | AIRecipeService | Anthropic Claude API |
| `DalleImageService` | ImageGenerationService | OpenAI DALL-E 3 API (or Stability AI) |
| `StripePaymentService` | PaymentService | Stripe API |
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
  const recipeRepo: RecipeRepository =
    env === 'test'
      ? new InMemoryRecipeRepository()
      : env === 'development' && !process.env.SUPABASE_URL
        ? new JsonRecipeRepository()
        : new SupabaseRecipeRepository();

  const debateRepo: DebateRepository =
    env === 'test'
      ? new InMemoryDebateRepository()
      : env === 'development' && !process.env.SUPABASE_URL
        ? new JsonDebateRepository()
        : new SupabaseDebateRepository();

  const interactionRepo: InteractionRepository =
    env === 'test'
      ? new InMemoryInteractionRepository()
      : env === 'development' && !process.env.SUPABASE_URL
        ? new LocalInteractionRepository()
        : new SupabaseInteractionRepository();

  const aiDebateService: AIDebateService =
    env === 'test'
      ? new MockAIDebateService()
      : process.env.CLAUDE_API_KEY
        ? new ClaudeDebateService()
        : new NoOpAIDebateService();

  const aiRecipeService: AIRecipeService =
    env === 'test'
      ? new MockAIRecipeService()
      : process.env.CLAUDE_API_KEY
        ? new ClaudeRecipeService()
        : new NoOpAIRecipeService();

  const imageService: ImageGenerationService =
    env === 'test'
      ? new MockImageService()
      : process.env.IMAGE_API_KEY
        ? new DalleImageService()
        : new NoOpImageService();

  const paymentService: PaymentService =
    env === 'test'
      ? new MockPaymentService()
      : process.env.STRIPE_SECRET_KEY
        ? new StripePaymentService()
        : new NoOpPaymentService();

  const pantryRepo: PantryRepository =
    env === 'test'
      ? new InMemoryPantryRepository()
      : process.env.SUPABASE_URL
        ? new SupabasePantryRepository()
        : new NoOpPantryRepository();

  const searchService: SearchService = new FuseSearchService();

  // ... same pattern for remaining ports

  // Use case factories -- typed, no string-based resolve
  return {
    recipeRepo,
    debateRepo,
    interactionRepo,
    pantryRepo,
    aiDebateService,
    aiRecipeService,
    imageService,
    paymentService,
    searchService,
    // ... all repos

    // Every use case gets a typed factory method
    generateRecipe: () => new GenerateRecipe(
      aiDebateService, aiRecipeService, imageService,
      recipeRepo, debateRepo, checkDailyLimit, validateRecipe, validateDebate
    ),
    getRecipeById: () => new GetRecipeById(recipeRepo, debateRepo),
    getRecipeHistory: () => new GetRecipeHistory(recipeRepo),
    getFeedRecipes: () => new GetFeedRecipes(recipeRepo, rankRecipes),
    saveRecipe: () => new SaveRecipe(interactionRepo),
    runCouncilDebate: () => new RunCouncilDebate(aiDebateService, validateDebate),
    generateRecipeFromDebate: () => new GenerateRecipeFromDebate(aiRecipeService, validateRecipe),
    generateRecipePhoto: () => new GenerateRecipePhoto(imageService),
    addPantryItem: () => new AddPantryItem(pantryRepo),
    getPantry: () => new GetPantry(pantryRepo),
    authenticateUser: () => new AuthenticateUser(userRepo),
    checkDailyLimit: () => new CheckDailyLimit(userRepo),
    upgradeSubscription: () => new UpgradeSubscription(paymentService, userRepo),
    // ... etc
  } as const;
}

export const container = createContainer(getEnvironment());
```

**Why environment-based over phase-based:** Tests always get in-memory adapters (fast, deterministic). Development without API keys gets JSON/localStorage with pre-generated data. Production and development-with-keys get real adapters. The `NEXT_PUBLIC_PHASE` env var is temporary scaffolding that goes away once Phase 2 ships -- the environment detection is permanent.

### 6.2 Environment Configuration

```typescript
// src/infrastructure/config/env.ts
export const env = {
  phase: process.env.NEXT_PUBLIC_PHASE || '2',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  claudeApiKey: process.env.CLAUDE_API_KEY!,       // server-only
  imageApiKey: process.env.IMAGE_API_KEY!,          // server-only (DALL-E or Stability)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,  // server-only
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, // public
  dailyLimitFree: parseInt(process.env.DAILY_LIMIT_FREE || '3'),
  dailyLimitPremium: parseInt(process.env.DAILY_LIMIT_PREMIUM || '20'),
} as const;
```

Required `.env.local` variables:

| Variable | Phase 1 | Phase 2 | Scope |
|----------|---------|---------|-------|
| `NEXT_PUBLIC_PHASE` | `1` | `2` | public |
| `NEXT_PUBLIC_SUPABASE_URL` | not needed | required | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | not needed | required | public |
| `CLAUDE_API_KEY` | not needed | required | server-only |
| `IMAGE_API_KEY` | not needed | required | server-only |
| `STRIPE_SECRET_KEY` | not needed | required | server-only |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | not needed | required | public |
| `DAILY_LIMIT_FREE` | `3` (default) | `3` (default) | server-only |
| `DAILY_LIMIT_PREMIUM` | `20` (default) | `20` (default) | server-only |

---

## 7. Presentation Layer

### 7.1 Component Architecture

Components depend on **domain types only** for type safety. They call use cases via API routes or server actions -- never importing infrastructure directly.

#### Debate Viewer -- The Core Animated Experience

The debate viewer is to ForkIt what RSVP is to Skim: the signature UI moment. It renders a 30-second animated debate between AI chefs.

```typescript
// src/presentation/components/debate/DebateViewer.tsx
interface DebateViewerProps {
  debate: Debate;
  onComplete: () => void;         // Called when 30s debate finishes
  autoPlay: boolean;
  speed: number;                  // 0.5x to 2x playback speed
}

// Each message animates in with:
// 1. Chef avatar slides in from the side
// 2. Speech bubble types out (typewriter effect)
// 3. Intensity affects animation (calm=smooth, heated=shake, explosive=flash)
// 4. Messages stack vertically with auto-scroll
// 5. Winner announcement at the end with confetti
```

#### Recipe Card -- The Reveal

After the debate, the winning recipe reveals with a dramatic animation:

```typescript
// src/presentation/components/recipe/RecipeCard.tsx
interface RecipeCardProps {
  recipe: Recipe;
  debate: Debate;                 // For showing debate summary
  onMakeThis: () => void;
  onSave: () => void;
  onShare: () => void;
  onSkip: () => void;
}

// Sections:
// 1. Hero photo (AI-generated, full bleed)
// 2. Recipe name + tagline
// 3. Winning chef badge + debate summary
// 4. Stats bar (difficulty, time, cost, servings)
// 5. Ingredients list (expandable)
// 6. Steps (expandable, numbered)
// 7. Smart swaps (collapsible)
// 8. Snap line (final memorable line)
// 9. Action bar (Make This!, Save, Share)
```

### 7.2 State Management (Zustand)

Five stores, each owning a distinct concern:

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `generationStore` | Current generation state: idle, debating, revealing, complete | none (ephemeral) |
| `feedStore` | Feed state, pagination cursor, recipe history | none (refetches) |
| `debateStore` | Current debate playback state, speed, progress | none (ephemeral) |
| `userStore` | Auth state, user preferences, subscription tier, session ID | localStorage |
| `pantryStore` | Pantry state for premium users | localStorage |

### 7.3 Custom Hooks

Hooks bridge presentation and domain logic:

| Hook | Purpose |
|------|---------|
| `useForkIt` | The main generation hook: triggers debate -> recipe flow, manages loading/error states |
| `useDebatePlayback` | Debate animation timing engine, message sequencing, intensity transitions |
| `useRecipeReveal` | Manages the reveal animation after debate completion |
| `useRecipeFeed` | Fetches feed, handles pagination, manages recipe history |
| `useSaveRecipe` | Save toggle, optimistic UI, API call |
| `useMakeThis` | Make This! tap handling, optimistic UI |
| `useShareRecipe` | Share card generation, native share API, clipboard fallback |
| `usePantry` | Pantry CRUD for premium users |
| `useDailyLimit` | Tracks remaining generations, shows upgrade prompt |
| `useChefPreferences` | Manages chef preference selection |
| `useProgressiveDisclosure` | Pantry unlock, auth prompts, share nudges, premium prompts |
| `useKeyboardShortcuts` | Desktop: Space to fork, arrows to navigate, S to save |
| `usePrefersReducedMotion` | Respects `prefers-reduced-motion: reduce` -- disables debate animation, shows static debate log |
| `useDebateSpeed` | Debate playback speed control (0.5x - 2x) |

---

## 8. Folder Structure

```
src/
├── domain/                              # PURE -- zero external dependencies
│   ├── entities/
│   │   ├── Recipe.ts
│   │   ├── Chef.ts
│   │   ├── Debate.ts
│   │   ├── DebateMessage.ts
│   │   ├── Pantry.ts
│   │   ├── PantryItem.ts
│   │   ├── RecipeInteraction.ts
│   │   └── User.ts
│   ├── value-objects/
│   │   ├── Ingredient.ts
│   │   ├── Step.ts
│   │   ├── SmartSwap.ts
│   │   ├── RecipeStats.ts
│   │   ├── RecipeScore.ts
│   │   └── types.ts
│   ├── constants/
│   │   └── chefs.ts                     # The 5 chefs (domain constants)
│   ├── services/
│   │   ├── RecipeValidator.ts
│   │   ├── RecipeValidator.test.ts      # co-located tests
│   │   ├── RecipeScorer.ts
│   │   ├── RecipeScorer.test.ts
│   │   ├── DebateScripter.ts
│   │   ├── DebateScripter.test.ts
│   │   ├── ChefPersonality.ts
│   │   ├── ChefPersonality.test.ts
│   │   ├── PantryMatcher.ts
│   │   ├── PantryMatcher.test.ts
│   │   ├── CostEstimator.ts
│   │   ├── CostEstimator.test.ts
│   │   ├── SwapGenerator.ts
│   │   ├── SwapGenerator.test.ts
│   │   ├── DifficultyCalculator.ts
│   │   ├── DifficultyCalculator.test.ts
│   │   ├── FeedRanker.ts
│   │   ├── FeedRanker.test.ts
│   │   ├── DailyLimitChecker.ts
│   │   └── DailyLimitChecker.test.ts
│   └── ports/
│       ├── RecipeRepository.ts
│       ├── DebateRepository.ts
│       ├── UserRepository.ts
│       ├── InteractionRepository.ts
│       ├── PantryRepository.ts
│       ├── AIDebateService.ts
│       ├── AIRecipeService.ts
│       ├── ImageGenerationService.ts
│       ├── PaymentService.ts
│       ├── SearchService.ts
│       └── ShareCardService.ts
│
├── application/
│   ├── use-cases/
│   │   ├── feed/
│   │   │   ├── GetFeedRecipes.ts
│   │   │   ├── GetRecipeById.ts
│   │   │   ├── GetRecipeHistory.ts
│   │   │   ├── SearchRecipes.ts
│   │   │   └── GetDailyStats.ts
│   │   ├── generation/
│   │   │   ├── GenerateRecipe.ts
│   │   │   ├── GenerateRecipe.test.ts
│   │   │   ├── RunCouncilDebate.ts
│   │   │   ├── RunCouncilDebate.test.ts
│   │   │   ├── GenerateRecipeFromDebate.ts
│   │   │   ├── GenerateRecipeFromDebate.test.ts
│   │   │   ├── GenerateRecipePhoto.ts
│   │   │   └── GenerateFromPantry.ts
│   │   ├── interaction/
│   │   │   ├── SaveRecipe.ts
│   │   │   ├── UnsaveRecipe.ts
│   │   │   ├── SkipRecipe.ts
│   │   │   ├── ShareRecipe.ts
│   │   │   └── RecordMakeThis.ts
│   │   ├── pantry/
│   │   │   ├── AddPantryItem.ts
│   │   │   ├── RemovePantryItem.ts
│   │   │   ├── GetPantry.ts
│   │   │   ├── SuggestFromPantry.ts
│   │   │   └── ClearExpiredItems.ts
│   │   ├── user/
│   │   │   ├── AuthenticateUser.ts
│   │   │   ├── GetUserProfile.ts
│   │   │   ├── UpdateChefPreferences.ts
│   │   │   ├── CheckDailyLimit.ts
│   │   │   └── UpgradeSubscription.ts
│   │   └── progression/
│   │       ├── CheckPantryUnlock.ts
│   │       ├── CheckShareNudge.ts
│   │       ├── CheckAuthPrompt.ts
│   │       └── CheckPremiumPrompt.ts
│   └── shared/
│       ├── Result.ts                    # re-exports from neverthrow
│       └── PaginatedResult.ts
│
├── infrastructure/
│   ├── adapters/
│   │   ├── supabase/
│   │   │   ├── SupabaseRecipeRepository.ts
│   │   │   ├── SupabaseDebateRepository.ts
│   │   │   ├── SupabaseUserRepository.ts
│   │   │   ├── SupabaseInteractionRepository.ts
│   │   │   ├── SupabasePantryRepository.ts
│   │   │   ├── SupabaseAuthAdapter.ts
│   │   │   └── supabase-client.ts
│   │   ├── json/
│   │   │   ├── JsonRecipeRepository.ts
│   │   │   └── JsonDebateRepository.ts
│   │   ├── local-storage/
│   │   │   └── LocalInteractionRepository.ts
│   │   ├── claude/
│   │   │   ├── ClaudeDebateService.ts
│   │   │   ├── ClaudeRecipeService.ts
│   │   │   └── prompts.ts              # Prompt templates for debate + recipe generation
│   │   ├── dalle/
│   │   │   └── DalleImageService.ts
│   │   ├── stripe/
│   │   │   └── StripePaymentService.ts
│   │   ├── fuse/
│   │   │   └── FuseSearchService.ts
│   │   ├── canvas/
│   │   │   └── CanvasShareCardService.ts
│   │   └── noop/
│   │       ├── NoOpAIDebateService.ts
│   │       ├── NoOpAIRecipeService.ts
│   │       ├── NoOpImageService.ts
│   │       ├── NoOpPaymentService.ts
│   │       ├── NoOpPantryRepository.ts
│   │       └── NoOpShareCardService.ts
│   ├── di/
│   │   └── container.ts
│   └── config/
│       └── env.ts
│
├── app/                                 # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                         # Landing / Fork It button
│   ├── (feed)/
│   │   └── page.tsx                     # Recipe feed / history
│   ├── recipe/[id]/
│   │   └── page.tsx                     # Single recipe view
│   ├── pantry/
│   │   └── page.tsx                     # Pantry management (Premium)
│   ├── profile/
│   │   └── page.tsx                     # User profile + saved recipes
│   ├── pricing/
│   │   └── page.tsx                     # Premium upgrade page
│   ├── api/
│   │   ├── recipes/
│   │   │   ├── route.ts                 # GET (feed), POST (generate)
│   │   │   └── [id]/
│   │   │       ├── route.ts             # GET single recipe
│   │   │       ├── save/route.ts        # POST save, DELETE unsave
│   │   │       ├── skip/route.ts        # POST skip
│   │   │       ├── make-this/route.ts   # POST make this
│   │   │       └── share/route.ts       # POST generate share card
│   │   ├── generate/
│   │   │   ├── route.ts                 # POST: full generation pipeline
│   │   │   └── from-pantry/route.ts     # POST: generate from pantry
│   │   ├── debate/
│   │   │   └── route.ts                 # POST: run council debate
│   │   ├── pantry/
│   │   │   ├── route.ts                 # GET pantry, POST add item
│   │   │   ├── [item]/route.ts          # DELETE remove item
│   │   │   └── suggest/route.ts         # GET suggestions from pantry
│   │   ├── search/route.ts
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── payments/
│   │   │   ├── checkout/route.ts        # POST create checkout session
│   │   │   └── webhook/route.ts         # POST Stripe webhook
│   │   └── user/
│   │       ├── route.ts                 # GET profile
│   │       └── preferences/route.ts     # PUT chef preferences
│   └── actions/
│       ├── recipeActions.ts             # saveRecipe, skipRecipe, makeThis
│       ├── generationActions.ts         # generateRecipe, generateFromPantry
│       └── pantryActions.ts             # addPantryItem, removePantryItem
│
├── presentation/
│   ├── components/
│   │   ├── debate/
│   │   │   ├── DebateViewer.tsx         # The 30-second animated debate
│   │   │   ├── DebateViewer.test.tsx
│   │   │   ├── DebateMessage.tsx        # Single chef message bubble
│   │   │   ├── ChefAvatar.tsx           # Animated chef avatar
│   │   │   ├── IntensityIndicator.tsx   # Visual intensity meter
│   │   │   ├── WinnerAnnouncement.tsx   # Debate resolution + confetti
│   │   │   └── DebateSpeedControl.tsx   # Playback speed slider
│   │   ├── recipe/
│   │   │   ├── RecipeCard.tsx           # Full recipe display
│   │   │   ├── RecipeCard.test.tsx
│   │   │   ├── RecipeHero.tsx           # Hero photo + name + tagline
│   │   │   ├── IngredientList.tsx       # Expandable ingredient list
│   │   │   ├── StepList.tsx             # Numbered cooking steps
│   │   │   ├── SmartSwaps.tsx           # Ingredient substitutions panel
│   │   │   ├── RecipeStatsBar.tsx       # Difficulty, time, cost, servings
│   │   │   ├── SnapLine.tsx             # The memorable final line
│   │   │   └── ChefBadge.tsx            # Winning chef attribution
│   │   ├── generation/
│   │   │   ├── ForkItButton.tsx         # THE button. The whole point.
│   │   │   ├── ForkItButton.test.tsx
│   │   │   ├── GenerationFlow.tsx       # Orchestrates: button -> debate -> reveal
│   │   │   ├── GeneratingState.tsx      # Loading animation during generation
│   │   │   └── DailyLimitBanner.tsx     # Shows remaining generations
│   │   ├── feed/
│   │   │   ├── Feed.tsx                 # Recipe feed / history
│   │   │   ├── FeedCard.tsx             # Recipe preview card in feed
│   │   │   └── FeedTabs.tsx             # All / Saved / Mine tabs
│   │   ├── interaction/
│   │   │   ├── MakeThisButton.tsx       # Primary CTA on recipe card
│   │   │   ├── SaveButton.tsx           # Bookmark toggle
│   │   │   ├── ShareButton.tsx          # Share card generation
│   │   │   └── ActionBar.tsx            # Bottom action bar (Make This, Save, Share)
│   │   ├── pantry/
│   │   │   ├── PantryManager.tsx        # Pantry ingredient management
│   │   │   ├── PantryItem.tsx           # Single pantry item row
│   │   │   ├── AddIngredientForm.tsx    # Form to add ingredient
│   │   │   └── PantrySuggestions.tsx    # "You could make..." suggestions
│   │   ├── chef/
│   │   │   ├── ChefSelector.tsx         # Chef preference picker
│   │   │   ├── ChefCard.tsx             # Individual chef card
│   │   │   └── ChefPersonalityModal.tsx # Chef detail modal
│   │   ├── auth/
│   │   │   └── AuthPrompt.tsx           # Auth prompt bottom sheet
│   │   ├── premium/
│   │   │   ├── PremiumPrompt.tsx        # Upgrade prompt
│   │   │   └── PricingCard.tsx          # Pricing display
│   │   ├── onboarding/
│   │   │   ├── PantryUnlockCard.tsx     # Pantry unlocked at 5 generations
│   │   │   ├── ShareNudge.tsx           # Share prompt after 3 recipes in session
│   │   │   └── FirstForkGuide.tsx       # First-time user guide overlay
│   │   └── shared/
│   │       ├── BottomSheet.tsx
│   │       ├── PillBadge.tsx
│   │       ├── Navigation.tsx           # Bottom tab navigation
│   │       ├── ChefColorBar.tsx         # Colored bar per chef
│   │       ├── CostIndicator.tsx        # $ / $$ / $$$ display
│   │       ├── DifficultyBadge.tsx      # Easy / Medium / Hard
│   │       ├── TimeEstimate.tsx         # Clock + time display
│   │       └── Confetti.tsx             # Winner celebration effect
│   ├── hooks/
│   │   ├── useForkIt.ts
│   │   ├── useDebatePlayback.ts
│   │   ├── useRecipeReveal.ts
│   │   ├── useRecipeFeed.ts
│   │   ├── useSaveRecipe.ts
│   │   ├── useMakeThis.ts
│   │   ├── useShareRecipe.ts
│   │   ├── usePantry.ts
│   │   ├── useDailyLimit.ts
│   │   ├── useChefPreferences.ts
│   │   ├── useProgressiveDisclosure.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useDebateSpeed.ts
│   └── store/
│       ├── generationStore.ts
│       ├── feedStore.ts
│       ├── debateStore.ts
│       ├── userStore.ts
│       └── pantryStore.ts
│
├── data/
│   ├── recipes.json                     # 20 pre-generated launch recipes
│   └── debates.json                     # 20 pre-scripted debates
│
└── lib/
    ├── cn.ts                            # clsx + twMerge
    └── constants.ts                     # CHEFS, COST_TIERS, DIFFICULTY_LEVELS, daily limits

test/                                    # Shared test infrastructure (outside src/)
├── __fixtures__/
│   ├── recipes.ts                       # createTestRecipe factory
│   ├── debates.ts                       # createTestDebate factory
│   ├── users.ts                         # createTestUser factory
│   ├── chefs.ts                         # createTestChef factory
│   └── interactions.ts                  # createTestInteraction factory
├── helpers/
│   └── render.tsx                       # custom RTL render with providers
└── setup.ts                             # global Vitest setup

e2e/                                     # Playwright E2E tests
├── generation.spec.ts                   # Fork It -> debate -> recipe
├── feed.spec.ts                         # Feed browsing, save, skip
├── auth.spec.ts                         # Sign up, sign in, state persistence
├── pantry.spec.ts                       # Pantry management (Premium)
├── share.spec.ts                        # Share card generation
└── payment.spec.ts                      # Premium upgrade flow
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

```javascript
// .eslintrc.js (excerpt)
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        // Domain cannot import anything outside domain
        { group: ['@/application/*', '@/infrastructure/*', '@/presentation/*'], message: 'Domain layer cannot import from outer layers.' },
      ],
    }],
  },
  overrides: [
    {
      files: ['src/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/application/*', '@/infrastructure/*', '@/presentation/*', 'next/*', 'react', 'react-dom'], message: 'Domain layer must have zero external dependencies.' },
          ],
        }],
      },
    },
    {
      files: ['src/application/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/infrastructure/*', '@/presentation/*'], message: 'Application layer can only import from domain.' },
          ],
        }],
      },
    },
    {
      files: ['src/presentation/**/*.ts', 'src/presentation/**/*.tsx'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/infrastructure/*', '@/application/*'], message: 'Presentation layer can only import domain types.' },
          ],
        }],
      },
    },
  ],
}
```

---

## 10. Next.js App Router Integration

Next.js App Router components are **infrastructure adapters** -- they wire the hexagonal architecture to HTTP.

### 10.0 Data Fetching Convention

Three patterns, each with a clear use case. No mixing.

| Pattern | When to Use | Examples |
|---------|-------------|---------|
| **Server Actions** | Mutations (create, update, delete) | SaveRecipe, SkipRecipe, RecordMakeThis, AddPantryItem |
| **Route Handlers** | Paginated data fetching, AI generation, external endpoints | GET /api/recipes (cursor pagination), POST /api/generate (long-running AI), auth callback, Stripe webhook |
| **Server Components** | Initial page data (no client interaction needed) | FeedPage fetches initial 10 recipes, RecipePage fetches single recipe + debate |

**Why this split:** Server Actions avoid the boilerplate of POST route handlers for simple mutations. Route Handlers are needed for paginated reads (cursor in query params), long-running AI generation (streaming response), and external callbacks (OAuth, Stripe webhooks). Server Components eliminate the fetch waterfall for initial page data.

### 10.1 Route Handlers (API Endpoints)

```typescript
// src/app/api/recipes/route.ts
import { container } from '@/infrastructure/di/container';

export async function GET(request: NextRequest) {
  const getFeed = container.getFeedRecipes();
  const cursor = request.nextUrl.searchParams.get('cursor');
  const result = await getFeed.execute({ cursor, limit: 10 });
  return NextResponse.json(result);
}

// src/app/api/generate/route.ts
import { container } from '@/infrastructure/di/container';

export async function POST(request: NextRequest) {
  const generateRecipe = container.generateRecipe();
  const body = await request.json();
  const result = await generateRecipe.execute(body);
  if (result.isErr()) {
    const status = result.error instanceof RateLimitError ? 429 : 400;
    return NextResponse.json({ error: result.error.message }, { status });
  }
  return NextResponse.json(result.value, { status: 201 });
}
```

### 10.2 Server Actions

```typescript
// src/app/actions/recipeActions.ts
'use server'
import { container } from '@/infrastructure/di/container';

export async function saveRecipe(recipeId: string) {
  const useCase = container.saveRecipe();
  return useCase.execute({ recipeId, userId: await getCurrentUserId() });
}

export async function skipRecipe(recipeId: string) {
  const useCase = container.skipRecipe();
  return useCase.execute({ recipeId, userId: await getCurrentUserId() });
}

export async function recordMakeThis(recipeId: string) {
  const useCase = container.recordMakeThis();
  return useCase.execute({ recipeId, userId: await getCurrentUserId() });
}
```

### 10.3 Server Components (Initial Data)

```typescript
// src/app/(feed)/page.tsx
import { container } from '@/infrastructure/di/container';

export default async function FeedPage() {
  const getFeed = container.getFeedRecipes();
  const initialRecipes = await getFeed.execute({ limit: 10 });
  return <Feed initialRecipes={initialRecipes} />;
}

// src/app/recipe/[id]/page.tsx
import { container } from '@/infrastructure/di/container';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const getRecipe = container.getRecipeById();
  const recipeWithDebate = await getRecipe.execute({ id: params.id });
  if (!recipeWithDebate) notFound();
  return <RecipeCard recipe={recipeWithDebate.recipe} debate={recipeWithDebate.debate} />;
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
          /\
         /  \          E2E (Playwright)
        /    \         ~ 10-15 tests
       /------\
      /        \       Component Tests (Testing Library)
     /          \      ~ 40-50 tests
    /------------\
   /              \    Integration Tests (Use Cases + Mock Ports)
  /                \   ~ 60-70 tests
 /------------------\
/                    \ Unit Tests (Domain Services, pure functions)
/____________________\ ~ 120+ tests
```

### 11.3 Per-Layer Testing Strategy

#### Domain Layer -- Unit Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/domain/services/RecipeValidator.test.ts` next to `RecipeValidator.ts`)
- **Mocks:** None. Pure functions. No I/O.
- **Speed:** < 1 second total
- **Run on:** every file save (Vitest watch mode)

| Test Suite | What It Tests |
|------------|---------------|
| `RecipeValidator.test.ts` | All 20 validation rules from FORKIT_RULES |
| `RecipeScorer.test.ts` | Score formula with known inputs, freshness decay, diversity bonus |
| `DebateScripter.test.ts` | Escalation curve validation, 30s constraint, message ordering, intensity progression |
| `ChefPersonality.test.ts` | Chef opinion generation, voice pattern matching, priority mapping |
| `PantryMatcher.test.ts` | Ingredient overlap scoring, minimum threshold, missing ingredient suggestions |
| `CostEstimator.test.ts` | Cost tier boundaries ($10, $25), regional multiplier, edge cases (no ingredients) |
| `SwapGenerator.test.ts` | Common swap mappings, swap type categorization, no self-swaps |
| `DifficultyCalculator.test.ts` | Step count factor, technique complexity, ingredient rarity, time factor |
| `FeedRanker.test.ts` | Sort order with varying scores, tie-breaking, diversity bonus |
| `DailyLimitChecker.test.ts` | Free limit (3), premium limit (20), reset behavior, edge cases |

Example tests:

```typescript
// src/domain/services/RecipeValidator.test.ts
describe('RecipeValidator', () => {
  it('rejects recipe with name > 60 characters', () => {
    const result = validateRecipe({
      ...validRecipe,
      name: 'A'.repeat(61),
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Recipe name exceeds 60 characters');
  });

  it('rejects recipe with fewer than 3 ingredients', () => {
    const result = validateRecipe({
      ...validRecipe,
      ingredients: [makeIngredient('salt'), makeIngredient('pepper')],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Recipe must have at least 3 ingredients');
  });

  it('rejects recipe with step instruction > 50 words', () => {
    const longStep = { order: 1, instruction: Array(51).fill('word').join(' ') };
    const result = validateRecipe({
      ...validRecipe,
      steps: [longStep],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Step instruction exceeds 50 words');
  });

  it('accepts valid recipe at all boundaries', () => {
    const result = validateRecipe(validRecipe);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// src/domain/services/DebateScripter.test.ts
describe('DebateScripter', () => {
  it('validates debate is exactly 30 seconds', () => {
    const result = validateDebate({
      ...validDebate,
      duration: 31,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Debate duration must be exactly 30 seconds');
  });

  it('validates escalation curve -- no calm after explosive', () => {
    const messages = [
      { chefId: 'max-flavour', text: 'test', timestamp: 5, intensity: 'explosive' },
      { chefId: 'budget-king', text: 'test', timestamp: 10, intensity: 'calm' },
      { chefId: 'max-flavour', text: 'test', timestamp: 15, intensity: 'explosive' },
    ];
    const result = validateDebate({ ...validDebate, messages });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Debate intensity cannot decrease after peak');
  });

  it('validates 5-8 messages in debate', () => {
    const result = validateDebate({
      ...validDebate,
      messages: validDebate.messages.slice(0, 3), // Only 3 messages
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Debate must have 5-8 messages');
  });

  it('validates winner is a debate participant', () => {
    const result = validateDebate({
      ...validDebate,
      winnerId: 'gut-fix',
      participantIds: ['max-flavour', 'budget-king', 'speed-demon'],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Winner must be a debate participant');
  });
});
```

#### Application Layer -- Integration Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/application/use-cases/generation/GenerateRecipe.test.ts`)
- **Mocks:** In-memory port implementations (same shape as Phase 1 adapters)
- **Speed:** < 5 seconds total

| Test Suite | What It Tests |
|------------|---------------|
| `GenerateRecipe.test.ts` | Full generation pipeline: daily limit check -> debate -> recipe -> photo -> persist. Error paths for each stage. |
| `RunCouncilDebate.test.ts` | Debate generation + validation. Handles AI errors, retries on invalid debates. |
| `GenerateRecipeFromDebate.test.ts` | Recipe creation from debate context. Validates output. Handles AI errors. |
| `GetFeedRecipes.test.ts` | Fetches, ranks, paginates. Correct cursor handling. Diversity bonus applied. |
| `SaveRecipe.test.ts` | Creates interaction, handles duplicate saves. |
| `CheckDailyLimit.test.ts` | Free tier (3/day), premium (20/day), boundary testing, midnight reset. |
| `AddPantryItem.test.ts` | Validates ingredient, persists, handles duplicates. |
| `SuggestFromPantry.test.ts` | Pantry matching with various overlap percentages. |
| `UpgradeSubscription.test.ts` | Payment flow, subscription update, error handling. |
| `CheckPantryUnlock.test.ts` | Returns unlock event at exactly 5 generations. |

Mock port pattern:

```typescript
class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<RecipeId, Recipe> = new Map();

  async save(recipe: Recipe): Promise<Recipe> {
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async findById(id: RecipeId): Promise<Recipe | null> {
    return this.recipes.get(id) ?? null;
  }

  async findByUser(userId: UserId, cursor?: string, limit?: number): Promise<PaginatedResult<Recipe>> {
    const userRecipes = [...this.recipes.values()]
      .filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return paginate(userRecipes, cursor, limit);
  }
  // ... etc
}

class MockAIDebateService implements AIDebateService {
  private nextDebate: Debate | null = null;
  private shouldFail = false;

  setNextDebate(debate: Debate) { this.nextDebate = debate; }
  setShouldFail(fail: boolean) { this.shouldFail = fail; }

  async generateDebate(): Promise<Result<Debate, AIError>> {
    if (this.shouldFail) return err(new AIError('Generation failed'));
    if (this.nextDebate) return ok(this.nextDebate);
    return ok(createTestDebate());
  }
}
```

These in-memory implementations are reused as Phase 1 adapters and as test fixtures. Write once, use everywhere.

#### Infrastructure Layer -- Adapter Integration Tests

- **Framework:** Vitest
- **Location:** Co-located (`src/infrastructure/adapters/supabase/SupabaseRecipeRepository.test.ts`)
- **Dependencies:** Supabase local (`supabase start`), msw for HTTP mocks
- **Speed:** < 30 seconds total
- **Run:** on CI, before deploy

| Test Suite | What It Tests |
|------------|---------------|
| `SupabaseRecipeRepository.test.ts` | CRUD against local Supabase. Pagination. Chef filter. User filter. |
| `SupabaseDebateRepository.test.ts` | Save + find by recipe. Message ordering preserved. |
| `JsonRecipeRepository.test.ts` | Reads and parses actual recipes.json correctly. |
| `JsonDebateRepository.test.ts` | Reads and parses actual debates.json correctly. |
| `FuseSearchService.test.ts` | Index creation, fuzzy matching, relevance order. |
| `ClaudeDebateService.test.ts` | HTTP mock: correct prompt sent, response parsed, retries on malformed output. |
| `ClaudeRecipeService.test.ts` | HTTP mock: correct prompt sent, response parsed, ingredients extracted. |
| `DalleImageService.test.ts` | HTTP mock: correct prompt sent, image URL returned. |
| `StripePaymentService.test.ts` | HTTP mock: checkout session created, webhook verified. |

#### Presentation Layer -- Component Tests

- **Framework:** Vitest + React Testing Library
- **Location:** Co-located (`src/presentation/components/debate/DebateViewer.test.tsx`)
- **Mocks:** API responses via msw

| Test Suite | What It Tests |
|------------|---------------|
| `DebateViewer.test.tsx` | Messages appear in sequence, intensity styles applied, winner announcement at end, auto-scroll, speed control |
| `ForkItButton.test.tsx` | Tap triggers generation, loading state, disabled during generation, daily limit disable |
| `RecipeCard.test.tsx` | All sections render, expandable ingredient list, expandable steps, smart swaps panel |
| `SaveButton.test.tsx` | Toggle on/off, optimistic UI, handles errors |
| `MakeThisButton.test.tsx` | Tap animation, API call, disabled states |
| `PantryManager.test.tsx` | Add/remove items, category grouping, expired item indicator |
| `ChefSelector.test.tsx` | Select/deselect chefs, maximum 3 preferences, visual feedback |
| `GenerationFlow.test.tsx` | State transitions: idle -> debating -> revealing -> complete |
| `DailyLimitBanner.test.tsx` | Shows remaining count, premium upgrade prompt at limit |

**Debate animation tests must use `vi.useFakeTimers()`.** Real timers make these tests non-deterministic and slow. Advance time with `vi.advanceTimersByTime(ms)`.

**All interactive components** (ForkItButton, SaveButton, MakeThisButton, PantryManager, ChefSelector, BottomSheet) include an axe-core accessibility test: `expect(await axe(container)).toHaveNoViolations()` via `vitest-axe`.

#### E2E Tests

- **Framework:** Playwright
- **Location:** `e2e/`
- **Run:** before deploy to production

| Test | What It Covers |
|------|----------------|
| `generation.spec.ts` | Tap Fork It -> debate plays -> recipe reveals -> can save/share |
| `feed.spec.ts` | Browse feed -> save recipe -> view saved -> unsave |
| `auth.spec.ts` | Generate 2 -> auth prompt -> sign in -> state persists |
| `pantry.spec.ts` | Add items -> get suggestions -> generate from pantry |
| `share.spec.ts` | Share button -> card generated -> correct format |
| `payment.spec.ts` | Hit limit -> upgrade prompt -> checkout -> premium features unlocked |

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
| Presentation (Debate animation, recipe card) | 85% | Core user experience, must be rock-solid |
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

**Goal:** Deployable app with the Fork It button, pre-scripted debates, pre-generated recipes with AI photos. A user taps the button, watches a debate between chefs, sees a recipe reveal, and says "holy shit this is fun."

#### Phase 1 Scope

| Category | What Gets Built |
|----------|----------------|
| **Domain** | All entities, all value objects, all domain services (complete), chef constants |
| **Application** | `GenerateRecipe` (Phase 1 version: picks from JSON pool), `GetRecipeById`, `GetRecipeHistory`, `GetFeedRecipes`, `SearchRecipes`, `SaveRecipe`, `SkipRecipe`, `RecordMakeThis`, `CheckDailyLimit` (local), `CheckAuthPrompt` |
| **Infrastructure** | `JsonRecipeRepository`, `JsonDebateRepository`, `LocalInteractionRepository`, `FuseSearchService`, `NoOpAIDebateService`, `NoOpAIRecipeService`, `NoOpImageService`, `NoOpPaymentService`, `NoOpPantryRepository`, DI container (Phase 1 mode) |
| **Presentation** | Fork It button, debate viewer (animated), recipe reveal, recipe card, feed, save/skip buttons, daily limit banner, navigation (3 tabs), search bar, first-fork guide |
| **Data** | `recipes.json` with 20 pre-generated recipes, `debates.json` with 20 pre-scripted debates, pre-generated food photos |
| **Tests** | All domain unit tests, use case integration tests, debate viewer component test, generation flow E2E |
| **Deploy** | Vercel, one command |

#### Phase 1 Build Order

```
1.  Project setup (Next.js 14, Tailwind, Vitest, Framer Motion, Zustand, tsconfig paths)
2.  Domain types (entities, value objects, branded types)
3.  Domain constants (5 chefs with personalities, voice patterns, colors)
4.  Domain services + tests (RecipeValidator, DebateScripter, RecipeScorer, ChefPersonality, CostEstimator, DifficultyCalculator, SwapGenerator, FeedRanker, DailyLimitChecker)
5.  Application shared (Result type, PaginatedResult)
6.  Application use cases + tests (GenerateRecipe [Phase 1], GetRecipeById, GetRecipeHistory, GetFeedRecipes, SearchRecipes, SaveRecipe, SkipRecipe, RecordMakeThis, CheckDailyLimit)
7.  Infrastructure: JsonRecipeRepository + JsonDebateRepository + tests (reads from JSON files)
8.  Infrastructure: LocalInteractionRepository (localStorage for saves/skips)
9.  Infrastructure: FuseSearchService + tests
10. Infrastructure: NoOp adapters (AI, image, payment, pantry, share card)
11. Infrastructure: DI container (Phase 1 mode)
12. Data: recipes.json (20 launch recipes with ingredients, steps, smart swaps)
13. Data: debates.json (20 pre-scripted debates with escalation curves)
14. Data: Pre-generated food photos (20 images, stored in public/photos/)
15. Presentation: Tailwind config (design system tokens, CSS variables, chef colors)
16. Presentation: shared components (BottomSheet, PillBadge, Navigation, ChefColorBar, Confetti)
17. Presentation: DebateViewer + DebateMessage + ChefAvatar + IntensityIndicator + WinnerAnnouncement + tests
18. Presentation: debate playback hook (useDebatePlayback -- message timing engine)
19. Presentation: RecipeCard + RecipeHero + IngredientList + StepList + SmartSwaps + RecipeStatsBar + SnapLine + ChefBadge
20. Presentation: ForkItButton + GenerationFlow + GeneratingState + DailyLimitBanner + tests
21. Presentation: ActionBar (MakeThisButton + SaveButton + ShareButton placeholder)
22. Presentation: Feed + FeedCard + FeedTabs
23. Presentation: SearchBar + basic search results
24. Presentation: FirstForkGuide (first-time user overlay)
25. App routes: main page (Fork It button), feed page, recipe/[id] page
26. API routes: GET /api/recipes, GET /api/recipes/[id], POST /api/generate, GET /api/search
27. Server actions: saveRecipe, skipRecipe, recordMakeThis
28. E2E: generation flow test (Fork It -> debate -> recipe reveal)
29. E2E: feed flow test (browse -> save -> view saved)
30. Deploy to Vercel
```

#### Phase 1 Definition of Done

- [ ] Fork It button triggers generation flow on tap
- [ ] Debate plays 30-second animated sequence with chef messages
- [ ] Chef avatars appear with correct colors and personalities
- [ ] Debate intensity escalates visually (calm -> heated -> explosive)
- [ ] Winner announced with confetti animation
- [ ] Recipe card reveals with hero photo, name, tagline
- [ ] Ingredients list expands/collapses
- [ ] Steps list shows numbered instructions
- [ ] Smart swaps panel shows substitutions
- [ ] Snap line renders at the bottom of recipe card
- [ ] Stats bar shows difficulty, time, cost, servings
- [ ] Make This! button animates on tap
- [ ] Save button toggles (bookmark)
- [ ] Daily limit banner shows remaining generations (3/day local)
- [ ] Feed shows recipe history with newest first
- [ ] Search finds recipes by name, ingredient, chef
- [ ] Navigation tabs: Fork It, Feed, Profile (shell)
- [ ] First-Fork Guide overlay for new users
- [ ] `prefers-reduced-motion` disables debate animation, shows static log
- [ ] All domain tests pass (95%+ coverage)
- [ ] All use case tests pass (90%+ coverage)
- [ ] Generation flow E2E passes
- [ ] Feed flow E2E passes
- [ ] Deployed to Vercel, loads in < 2 seconds

### Phase 2 -- Day 2: "The Real Deal"

**Goal:** Complete MVP with live AI generation, real debates, real recipe invention, user accounts, pantry mode, payments, share cards.

#### Phase 2 Scope

| Category | What Gets Built |
|----------|----------------|
| **Application** | All remaining use cases (auth, AI orchestration, pantry, payments, progressive disclosure, sharing) |
| **Infrastructure** | All Supabase adapters, `ClaudeDebateService`, `ClaudeRecipeService`, `DalleImageService`, `StripePaymentService`, `CanvasShareCardService`, Supabase Auth, DB migrations |
| **Presentation** | Pantry manager, chef selector, auth prompt, premium prompt, pricing page, share card UI, pantry unlock, share nudge, chef personality modal |
| **Tests** | Adapter integration tests, component tests for pantry + auth + payment, E2E for generation + auth + pantry + payment flows |

#### Phase 2 Build Order

```
1.  Supabase setup (project, local dev, schema migrations)
2.  DB schema: recipes, debates, users, interactions, pantry tables + RLS policies
3.  Infrastructure: SupabaseRecipeRepository + tests
4.  Infrastructure: SupabaseDebateRepository + tests
5.  Infrastructure: SupabaseUserRepository + tests
6.  Infrastructure: SupabaseInteractionRepository + tests
7.  Infrastructure: SupabasePantryRepository + tests
8.  Infrastructure: SupabaseAuthAdapter
9.  Infrastructure: DI container (Phase 2 mode, swap adapters)
10. Infrastructure: ClaudeDebateService + prompt templates + tests (AI debate generation)
11. Infrastructure: ClaudeRecipeService + prompt templates + tests (AI recipe generation)
12. Infrastructure: DalleImageService + tests (food photo generation)
13. Infrastructure: StripePaymentService + tests (checkout, webhook verification)
14. Application: RunCouncilDebate (live AI) + tests
15. Application: GenerateRecipeFromDebate (live AI) + tests
16. Application: GenerateRecipePhoto + tests
17. Application: GenerateRecipe (full pipeline: debate -> recipe -> photo) + tests
18. Application: GenerateFromPantry + tests
19. Application: AuthenticateUser, GetUserProfile, UpdateChefPreferences + tests
20. Application: CheckDailyLimit (Supabase-backed), UpgradeSubscription + tests
21. Application: AddPantryItem, RemovePantryItem, GetPantry, SuggestFromPantry, ClearExpiredItems + tests
22. Application: ShareRecipe + tests
23. Application: CheckPantryUnlock, CheckShareNudge, CheckPremiumPrompt + tests
24. API routes: POST /api/generate (live AI), POST /api/generate/from-pantry
25. API routes: POST /api/debate (live council debate)
26. API routes: pantry CRUD (GET, POST, DELETE)
27. API routes: POST /api/payments/checkout, POST /api/payments/webhook
28. API routes: GET /api/auth/callback, GET /api/user, PUT /api/user/preferences
29. Server actions: generateRecipe, generateFromPantry, addPantryItem, removePantryItem
30. Presentation: AuthPrompt (bottom sheet after generation 2)
31. Presentation: ChefSelector + ChefCard + ChefPersonalityModal + tests
32. Presentation: PantryManager + PantryItem + AddIngredientForm + PantrySuggestions + tests
33. Presentation: PremiumPrompt + PricingCard (upgrade flow)
34. Presentation: Pricing page
35. Presentation: PantryUnlockCard (unlocked at 5 generations)
36. Presentation: ShareNudge (after 3 recipes in session)
37. Infrastructure: CanvasShareCardService (portrait, stories, square formats)
38. Presentation: Share card generation UI
39. Presentation: Profile page (stats, saved recipes, generation history)
40. Seed Supabase with 20 launch recipes + debates
41. E2E: full generation flow (live AI debate -> recipe -> photo)
42. E2E: auth flow (generate -> prompt -> sign in -> state persists)
43. E2E: pantry flow (add items -> suggestions -> generate from pantry)
44. E2E: payment flow (hit limit -> upgrade -> premium features)
45. Deploy Phase 2 to Vercel
```

#### Phase 2 Definition of Done

- [ ] All Phase 1 items still work
- [ ] User can sign up / sign in (Google + email)
- [ ] Live AI debate generation via Claude API (unique every time)
- [ ] Live AI recipe generation from debate context
- [ ] AI-generated food photos for every recipe
- [ ] Save, skip, Make This! persist to Supabase
- [ ] Feed algorithm uses real engagement data
- [ ] Chef selector lets users set preferred chefs (max 3)
- [ ] Chef preferences influence debate generation
- [ ] Pantry management works (add, remove, categorize, expiry)
- [ ] Generate from pantry produces pantry-constrained recipes
- [ ] Pantry mode unlocks at 5 total generations
- [ ] Daily limit enforced: 3/day free, 20/day premium
- [ ] Premium upgrade via Stripe checkout works
- [ ] Stripe webhook processes payment and upgrades account
- [ ] Share card generation works (3 formats)
- [ ] Share nudge appears after 3 recipes in session
- [ ] Auth prompt at generation 2 for anonymous users
- [ ] Premium prompt when daily limit hit
- [ ] Profile page shows stats, saved recipes, history
- [ ] All tests pass
- [ ] All E2E tests pass
- [ ] Deployed to Vercel

---

## 13. Phase Dependency Graph

```
Phase 1 Build Order:
  Setup (scaffolding)
    └── Phase 1A: Domain + Data (entities, services, chefs, JSON data)
         ├── Phase 1B: Debate Engine (the "wow" moment)
         │    └── Phase 1C: Recipe Card + Feed (recipe reveal + history)
         │         └── Phase 1D: Actions + Search + Navigation (save, skip, search, tabs)
         │              └── MILESTONE: Phase 1 Deploy (static site, 20 recipes, animated debates)
         │
         └── Phase 2B: Pantry + Chef Selector (needs 1A domain services)

Phase 2 Build Order:
  Phase 2A: Supabase Backend + AI Services (can start in parallel with 1C/1D)
    ├── Phase 2C: Live AI Generation (needs 2A for persistence + AI adapters)
    │    └── Phase 2D: Payments + Sharing + Polish (final convergence)
    └── Phase 2B: Pantry (needs 2A for Supabase pantry repo)
         └── Phase 2D also depends on 2B for pantry-based generation

  MILESTONE: Phase 2 Deploy (full MVP) = 2A + 2B + 2C + 2D complete
```

### Parallelization Opportunities

- Phase 2A (backend + AI services) can start while Phase 1C/1D are being built
- Phase 2B (pantry + chef selector) can be built in parallel with Phase 2A (if mock ports used initially)
- Phase 2C (live AI generation) starts once 2A lands (needs real Claude/Image adapters)
- Phase 2D (payments + sharing + polish) is the final convergence phase

### Phase-to-Layer Mapping

The domain layer is **complete after Phase 1A**. Everything after that is application use cases, adapters, and presentation.

| Phase | Domain | Application | Infrastructure | Presentation |
|-------|--------|-------------|---------------|-------------|
| Setup | Folder structure, types, branded IDs | Folder structure, Result type | DI shell, env config | Tailwind config, globals.css, layout |
| 1A | All entities, VOs, all services, chef constants | Feed use cases, save/skip, daily limit (local) | JSON + localStorage adapters, Fuse, NoOp adapters | -- |
| 1B | (complete) | (complete for Phase 1) | -- | Debate viewer, chef avatars, intensity indicator, winner announcement |
| 1C | (complete) | (complete for Phase 1) | -- | Recipe card, hero, ingredients, steps, swaps, stats, snap |
| 1D | (complete) | (complete for Phase 1) | -- | Fork It button, generation flow, feed, search, navigation, actions |
| 2A | (complete) | Auth, engagement use cases | Supabase adapters (swap in), Auth, Claude adapters, DALL-E adapter | Auth prompt, deferred auth |
| 2B | (complete) | Pantry use cases, chef preferences | SupabasePantryRepository | Pantry manager, chef selector, pantry unlock |
| 2C | (complete) | AI orchestration use cases, GenerateFromPantry | ClaudeDebateService, ClaudeRecipeService, DalleImageService | Live generation UI updates |
| 2D | (complete) | Payment, sharing, stats use cases | StripePaymentService, CanvasShareCardService | Premium, pricing, share, profile, polish |

### Tests Per Phase

| Phase | Test Count | TDD Required | Key Tests |
|-------|-----------|-------------|-----------|
| Setup | ~1 | No | Smoke test (domain types compile) |
| 1A | ~70 | Yes | RecipeValidator (20 rules), DebateScripter (escalation curve, timing, intensity), ChefPersonality, CostEstimator, DifficultyCalculator, SwapGenerator, FeedRanker, DailyLimitChecker, use cases with mocked ports |
| 1B | ~20 | Yes | Debate message sequencing, intensity styles, chef avatar rendering, winner announcement, speed control, auto-scroll, reduced-motion fallback |
| 1C | ~15 | Partial | Recipe card sections, expand/collapse, smart swaps, stats bar, snap line, chef badge |
| 1D | ~15 | Partial | Fork It button states, generation flow transitions, feed rendering, search results, navigation tabs |
| 2A | ~20 | Yes | Supabase CRUD, RLS policies, auth flow, Claude API prompt/response, DALL-E integration |
| 2B | ~15 | Yes | Pantry add/remove, category grouping, expiry, PantryMatcher thresholds, chef selector states |
| 2C | ~20 | Yes | Full AI pipeline (debate -> recipe -> photo), retries, validation, rate limiting, pantry-constrained generation |
| 2D | ~15 + 6 E2E | Partial | Stripe checkout, webhook, share cards, accessibility (axe-core), keyboard shortcuts, 6 critical E2E journeys |
| **Total** | **~210** | | |

---

## 14. DevOps & CI/CD

### 14.1 Local Development

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

### 14.2 Package Scripts

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
    "test:int": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "typecheck": "tsc --noEmit",
    "check": "pnpm lint && pnpm typecheck && pnpm test:run && pnpm build",
    "db:migrate": "supabase db push",
    "db:reset": "supabase db reset",
    "db:seed": "tsx scripts/seed.ts"
  }
}
```

### 14.3 CI Pipeline (GitHub Actions) -- Three-Job Split

The CI is split into three jobs optimized for speed. Most PRs get fast feedback (<30s). Full suite runs only when needed.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  # Job 1: Fast (<30s) -- Runs on EVERY PR
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

  # Job 2: Integration (<60s) -- Only when infrastructure changes
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

  # Job 3: E2E (<3min) -- Only on PRs to main
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
- API keys (Claude, DALL-E, Stripe) set as server-only environment variables in Vercel

### 14.5 Branch Strategy

```
main              <- production, auto-deploys to Vercel
├── phase-1       <- Phase 1 work, merges to main when done
└── phase-2       <- Phase 2 work, merges to main when done
```

Feature branches off `phase-1` or `phase-2` for individual features.

### 14.6 Commit Conventions (Conventional Commits)

```
feat(debate): implement 30-second debate animation with escalation curve
fix(recipe): correct ingredient count validation boundary
chore(config): add Framer Motion and Zustand dependencies
test(debate): add unit tests for debate escalation curve validation
docs(adr): add chef personality system design decision
feat(generation): implement Fork It -> debate -> recipe pipeline
fix(pantry): handle duplicate ingredient names on add
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
- [ ] Debate animation tested at all speeds (0.5x, 1x, 2x)
- [ ] Reduced motion mode verified

## Design Spec Reference
[Link to relevant FORKIT_DESIGN.md section]
```

---

## 15. Development Workflow

### 15.1 For Each Feature

```
1. PLAN   -- What are we building? What tests will prove it works?
2. TEST   -- Write failing tests first
3. BUILD  -- Write minimal code to pass tests
4. VERIFY -- All tests pass, lint passes, build succeeds
5. REVIEW -- Read the diff. Is there a simpler way?
6. LEARN  -- Update lessons.md with any discoveries
```

### 15.2 Subagent Strategy

Use subagents (Claude Code /task) for parallelizable work:

- **One subagent per domain service** -- write RecipeValidator + tests, DebateScripter + tests, CostEstimator + tests, etc. in parallel
- **One subagent per adapter** -- SupabaseRecipeRepository, ClaudeDebateService, DalleImageService, StripePaymentService, etc.
- **One subagent per component** -- DebateViewer, RecipeCard, ForkItButton, PantryManager, etc.
- **One subagent per AI prompt template** -- debate prompt, recipe prompt, photo prompt
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
- [ ] Component follows design system (FORKIT_DESIGN.md)
- [ ] Recipe validation follows FORKIT_RULES
- [ ] Debate validation follows escalation curve rules
- [ ] Accessibility: focus management, aria attributes, reduced motion
- [ ] Chef personality voice patterns consistent
- [ ] AI prompts reviewed for quality and safety

---

## 16. Documentation Strategy

### 16.1 Living Documents

| Document | Location | Purpose |
|----------|----------|---------|
| `FORKIT_PLAN.md` | project root | Product spec (what to build) |
| `FORKIT_DESIGN.md` | project root | Design system (how it looks) |
| `FORKIT_RULES.md` | project root | Content rules (how recipes are validated) |
| `FORKIT_DEVELOPMENT_PLAN.md` | project root | This file (how to build it) |

### 16.2 Code-Level Documentation

- **Domain services:** JSDoc on each exported function (input, output, rules it enforces)
- **Ports:** JSDoc on each interface method (what it does, not how)
- **Use cases:** JSDoc on `execute()` method (what the use case does, error cases)
- **Chef constants:** JSDoc on voice patterns (how they're used in AI prompts)
- **AI prompt templates:** Inline comments explaining prompt engineering decisions
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

Key ADRs expected during development:

| ADR | Decision |
|-----|----------|
| Debate Duration | Why 30 seconds (not 15, not 60) |
| Chef Count | Why 5 chefs (not 3, not 7) |
| AI Provider Split | Why Claude for debate/recipe, DALL-E for images |
| Phase 1 Data Strategy | Why 20 pre-generated (not 10, not 50) |
| Payment Provider | Why Stripe (not Paddle, not Lemonsqueezy) |
| Image Generation | Why DALL-E 3 (or Stability AI) over alternatives |

---

## 17. Claude Code Workflow

### 17.1 MCP Servers

- **Supabase MCP** -- Database interaction, schema management, RLS policy testing
- **Vercel MCP** -- Deployment status, environment variable management (if available)
- **Stripe MCP** -- Payment testing, webhook simulation (if available)

### 17.2 Custom Slash Commands

- `/forkit-validate` -- Validate a recipe's structure + content against FORKIT_RULES
- `/debate-check` -- Validate a debate's escalation curve, timing, and intensity progression
- `/design-audit` -- Compare current component implementation against FORKIT_DESIGN.md specs
- `/test-debate` -- Run debate viewer through test scenarios (all intensity levels, speed settings)
- `/prompt-review` -- Review AI prompt templates for quality, safety, and consistency

### 17.3 Hooks

- **Pre-commit:** Run lint + type check + tests on staged files (via Husky + lint-staged)
- **Post-save:** Auto-format with Prettier

### 17.4 Memory/Knowledge Files

- `.claude/knowledge/services/forkit-web.md` -- Main app service documentation
- `.claude/knowledge/services/supabase.md` -- Database schema, RLS policies
- `.claude/knowledge/services/ai-prompts.md` -- AI prompt templates and engineering notes
- `.claude/learnings/patterns.md` -- Coding patterns established during development
- `.claude/learnings/gotchas.md` -- Edge cases and pitfalls discovered

---

## 18. Monitoring & Observability

### 18.1 Error Handling Strategy

- **Client errors:** Global error boundary (Next.js `error.tsx` per route segment)
- **API errors:** Consistent response format: `{ error: string, code: number }`
- **AI generation errors:** Retry up to 3 times with exponential backoff. Show "chefs are arguing too much, try again" on final failure.
- **Image generation errors:** Fall back to `/fallback-photo.png`. Recipe still generates without photo.
- **Payment errors:** Clear user-facing error messages. Never expose Stripe internals.
- **Offline resilience:** Queue save/skip/make-this actions in localStorage, sync on reconnect
- **Graceful degradation:** If Supabase is down, fall back to cached/static recipes. If Claude API is down, serve from pre-generated pool.

### 18.2 Production Metrics

| Category | Metrics |
|----------|---------|
| Core | Fork It taps/day, debate completion rate, recipe reveal rate, Make This! rate, save rate, skip rate |
| AI | Debate generation latency, recipe generation latency, image generation latency, AI error rate, retry rate |
| Performance | Time to First Debate (<3s target), debate animation frame rate (60fps target), recipe reveal time |
| Errors | Client-side error rate, API error rate, auth failure rate, payment failure rate, AI malformed output rate |
| Growth | Share card generation count, link preview clicks, user registrations, premium conversions |
| Revenue | Premium subscriber count, MRR, churn rate, daily generation limit hit rate |
| Pantry | Pantry adoption rate (% of premium users), avg items per pantry, pantry-based generation rate |

### 18.3 Tools (MVP)

- Vercel Analytics (built-in, free tier)
- Console error reporting (upgrade to Sentry when traffic justifies)
- Supabase dashboard for database metrics
- Stripe dashboard for payment metrics
- Custom AI metrics logger (generation latency, retry counts, validation failure reasons)

---

## 19. CLAUDE.md Specification

The project-level `CLAUDE.md` should contain:

```markdown
# ForkIt -- Project Instructions

## Tech Stack
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand + Supabase + Claude API + Image Generation API (DALL-E 3 or Stability AI) + neverthrow + fuse.js

## Architecture
Hexagonal (ports and adapters). See FORKIT_DEVELOPMENT_PLAN.md Section 2.
- Domain imports nothing external (pure TypeScript, zero deps)
- Application imports domain only
- Infrastructure implements port interfaces
- Presentation uses domain types, calls use cases via server actions or route handlers

## Dependency Rule
DOMAIN imports: nothing
APPLICATION imports: domain
INFRASTRUCTURE imports: domain, application
PRESENTATION imports: domain (types only)
APP (Next.js) imports: infrastructure, presentation
Enforced via TSConfig path aliases + ESLint no-restricted-imports.

## Conventions
- Server Actions for mutations, Route Handlers for paginated reads + AI generation, Server Components for initial data
- Vitest for unit/component/integration tests, Playwright for E2E
- Co-located test files (RecipeValidator.test.ts next to RecipeValidator.ts)
- Conventional Commits (feat/fix/chore/test/docs)
- TDD mandatory for domain, application, and debate/generation engines
- Dark mode first, mobile first (375px)
- neverthrow for Result types (ok/err)
- Typed DI container with factory methods (no string-based resolve)
- Branded types for IDs (RecipeId, DebateId, UserId, etc.)

## Key References
- Product spec: FORKIT_PLAN.md
- Design system: FORKIT_DESIGN.md
- Content rules: FORKIT_RULES.md
- Development plan: FORKIT_DEVELOPMENT_PLAN.md (THE master doc -- architecture, TDD, build phases, CI/CD)

## Commands
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest single run
pnpm test:coverage # With coverage
pnpm test:e2e     # Playwright
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm check        # lint + typecheck + test + build (full gate)

## Build Phases
- Phase 1 (Day 1): Static JSON + localStorage, pre-scripted debates, 20 recipes, deploy to Vercel
- Phase 2 (Day 2): Supabase backend, live AI debate + recipe generation, image generation, auth, pantry, payments

## The Five Chefs
max-flavour, maximum-junk, gut-fix, budget-king, speed-demon
Each has: personality, color, avatar, voicePatterns, foodPhilosophy, priorities

## Core Flow
Fork It button -> 30s animated debate -> winning chef -> recipe reveal -> Make This! / Save / Share

## Recipe Validation
FORKIT_RULES.md is the canonical source. RecipeValidator enforces all 20 rules.
Name <= 60 chars, 3-20 ingredients, 2-15 steps, no step > 50 words, snap <= 30 words.

## Debate Validation
30s duration, 5-8 messages, escalation curve (calm -> heated -> explosive -> resolve),
winner must be a participant.

## Feed Algorithm
score = (make_this * 8) + (save * 5) + (share * 10) + (views * 0.1) + freshness_boost - (skip * 3)

## Coverage Targets
Domain: 95% | Application: 90% | Adapters: 70% | Debate/Recipe presentation: 85% | Layout: 60%
Phase 1 overall: 90% | Phase 2 overall: 80%

## Principles
- Plan first (3+ steps = plan mode)
- Test first (red-green-refactor)
- Verify before marking done (tests pass, lint clean, build succeeds)
- Update lessons.md after corrections
- Subagent strategy: one task per subagent, never two touching the same file
- "Would a staff engineer approve this?"
```

---

## 20. Lessons & Self-Improvement

### 20.1 Lessons File

```
tasks/lessons.md
```

After EVERY correction, bug fix, or unexpected discovery, append to this file:

```
## [Date] -- Brief title
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
| Debate timing drift | Use `requestAnimationFrame` not `setInterval` for debate message animation timing. |
| AI returning invalid debate structure | ClaudeDebateService validates AI output against DebateScripter rules. Retries up to 3 times on validation failure. |
| AI returning invalid recipe | ClaudeRecipeService validates AI output against RecipeValidator rules. Retries up to 3 times. |
| Image generation slow/failing | Photo generation is fire-and-forget with fallback URL. Recipe renders immediately; photo updates when available. |
| Stripe webhook processing failure | Idempotent webhook handler. Stores event ID to prevent double processing. |
| localStorage full | Catch quota exceeded errors in LocalStorage adapters. Degrade gracefully. |
| Daily limit race condition | Check-and-increment is atomic in Supabase (single UPDATE with WHERE clause). |
| Phase 1 pre-generated data running out | 20 recipes with random selection + cooldown (don't show same recipe within 5 taps). |
| Chef personality drift in AI output | Voice patterns are included in every Claude API prompt. Prompt tests verify chef consistency. |
| Debate messages not in timestamp order | DebateScripter validates monotonically increasing timestamps. |
| Cost estimation inaccuracy | CostEstimator uses conservative estimates. Display says "estimated" not "exact". |
| Pantry expiry dates missing | Expiry is optional. UI shows "no expiry" rather than omitting the field. |
| Premium feature accessed by free users | Every premium use case checks subscription tier before executing. |
| Confetti performance on low-end devices | Confetti uses CSS animations (not Canvas). Respects reduced-motion. Max 50 particles. |
| Recipe photo prompt injection | Image generation prompt is templated server-side. User input is sanitized. |

---

*This document is the single source of truth for how ForkIt is built. It integrates the hexagonal architecture (architect), TDD testing strategy (tdd-lead), and phased build plan (devops-lead). When this plan and the code disagree, update one of them -- never leave them out of sync.*
