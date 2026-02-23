# FORKIT — Unified Product Plan

*Finalized 2026-02-20 by product-ux, tech-arch, and growth-content*

---

## Core Concept

ForkIt is a 30-second decision engine disguised as a cooking show. Users tap a single button. Five AI chef characters appear at a round table, argue about what the user should eat, and in exactly 30 seconds, a winner emerges with a brand-new, AI-invented dish — complete with a stunning photo, a creative name, and a full recipe. Every invention is unique. There is no recipe database. There is no search. Every single dish is born the moment you tap the button.

**Product Philosophy:** ForkIt is an entertainment-first utility app. The chef debate is the entertainment layer. The AI-invented recipe is the actual utility. People open food apps 8-12 times a day out of frustration — "what the fuck do I eat right now?" is the most common unspoken question in the modern kitchen. ForkIt turns that frustration into a 30-second show they can't stop watching, and actually solves the problem. The north star metric is **recipes completed** — "Make This" taps that result in the user actually cooking. A user who taps Fork It, laughs at the debate, and makes the dish had a perfect session. Secondary metric: daily active taps of the Fork It button.

**The Insight:** Recipe apps fail because they give you 10,000 options and expect you to choose. ForkIt gives you exactly one — and makes the journey to that one so entertaining you don't care that you didn't choose. Decision fatigue is the enemy. Entertainment is the antidote. The Council decides so you don't have to.

---

## Content Format — The "Invention"

Every ForkIt output follows a rigid structure:

- **The Debate** (30 seconds, 5 chefs): A rapid-fire argument among five distinct AI chef personalities. Each chef proposes a direction, critiques others, and defends their philosophy. One chef "wins" the debate through a scoring system weighted by user preferences and randomness.
- **The Reveal** (the payoff): A full-screen presentation of the winning dish:
  - **Dish Name** — Creative, memorable, often funny. "Crispy Shame Noodles." "The 2AM Regret Burger." "Gut Redemption Bowl."
  - **Dish Photo** — AI-generated, photorealistic, food-photography quality. Shot from above or 45-degree hero angle. Warm lighting, shallow depth of field.
  - **Winning Chef** — Which chef championed this dish, and their one-line victory quip.
- **The Recipe Card** (the utility):
  - Ingredients list with quantities and smart swaps
  - Step-by-step instructions (numbered, concise)
  - Total time (prep + cook)
  - Serving size (adjustable)
  - Difficulty indicator (Easy / Medium / Chef Mode)
  - Cost estimate ($ / $$ / $$$)

**Tone of the debate:** Fast, punchy, irreverent. Each chef speaks in their distinct voice. Max Flavour is dramatic and passionate. Maximum Junk is gleefully unrepentant. Gut Fix is earnest and slightly preachy. Budget King is incredulous at waste. Speed Demon is impatient and dismissive. The debate should feel like a writers' room argument — funny, opinionated, and surprisingly informative.

**One invention per tap. Always.** No browsing. No filtering. No "show me something else." You get what the Council gives you. (You can tap again for a new debate, but the previous invention is gone unless you saved it.)

---

## MVP Features

### 1. The Fork It Button (The Hero Interaction)

The entire app centers on a single, glowing red button. This is not a feature — it is the product. Everything else exists in service of this moment.

- Full-screen dark background, single circular button center-screen
- Button pulses with a subtle glow animation (Framer Motion `animate` with `scale` and `boxShadow` keyframes, 2-second loop)
- Button text: "Fork It" in bold sans-serif, white on deep red (#DC2626)
- Tap triggers a satisfying haptic pulse (Vibration API where supported) + button scale-down animation (150ms) + transition to debate screen
- The button is always accessible — it is the home screen, the landing page, the entire top-level navigation
- Below the button: small text showing daily invention count ("7 of 10 today" for free tier, nothing for Pro)
- Above the button: minimal top bar with profile icon (left) and history icon (right)
- No onboarding. No tutorial. The button is self-explanatory. A user who has never seen ForkIt should understand the entire app in under 2 seconds.

**Loading state:** After tap, button morphs into a spinning fork icon (Lottie animation, 800ms) while the AI generates the debate. Target: debate content ready in under 3 seconds. If generation takes longer, show chef silhouettes assembling at the table with a progress indicator.

**Return state:** After viewing a recipe, the "Back" action always returns to the Fork It button. The button is home. The button is the feed. The button is the app.

### 2. The Chef Council Debate (The 30-Second Show)

This is the entertainment layer — the reason people open ForkIt even when they're not hungry. Five AI chef characters sit at a round table and argue about what you should eat. The debate is generated in real-time by the Claude API, structured into a scripted 30-second sequence.

**The 5 Chefs:**

| Chef | Philosophy | Voice | Visual |
|------|-----------|-------|--------|
| **Max Flavour** | Maximum flavor, spice, bold combinations | Dramatic, passionate, uses food metaphors as life lessons | Red apron, flame motif, intense eyes |
| **Maximum Junk** | Cheese on everything, deep-fried, comfort food | Gleefully unrepentant, jokes constantly, speaks in superlatives | Yellow apron, cheese hat, perpetual grin |
| **Gut Fix** | Gut health, anti-inflammatory, gentle foods | Earnest, slightly preachy, drops microbiome facts | Green apron, leaf motif, calm expression |
| **Budget King** | Cheap ingredients, creative substitutions | Incredulous at waste, penny-proud, surprisingly clever | Blue apron, crown made of coins, raised eyebrow |
| **Speed Demon** | 15-minute meals or bust, hates anything slow | Impatient, dismissive, speaks in short bursts | Orange apron, stopwatch necklace, tapping foot |

**Debate Structure (30 seconds, 6 beats):**

1. **The Prompt** (0-3s): A narrator line sets the scene. "The Council convenes. Tonight's question: what should you eat?" Table appears with all 5 chefs.
2. **Opening Volleys** (3-10s): Each chef throws out their suggestion in 1-2 sentences. Rapid-fire, overlapping speech bubbles. Max Flavour wants Thai basil stir-fry. Maximum Junk wants loaded nachos. Gut Fix wants a turmeric bowl. Budget King wants egg fried rice. Speed Demon wants a quesadilla.
3. **The Clash** (10-18s): Two or three chefs argue directly. "That's not food, that's a pharmacy" (Junk to Gut Fix). "That costs more than my rent" (Budget King to Max Flavour). The funniest, most quotable lines live here.
4. **The Pivot** (18-23s): One chef proposes a compromise or a twist that incorporates elements from multiple philosophies. This is where the actual invention happens.
5. **The Vote** (23-27s): Visual show of hands. Chefs raise or lower their forks. The winner is highlighted.
6. **The Reveal** (27-30s): Winning chef delivers a one-line victory quip. Screen transitions to the dish reveal.

**Who Wins — The Scoring Logic:**

```
chef_score = (base_random * 0.4) + (user_preference * 0.3) + (context_match * 0.2) + (rotation_bonus * 0.1)
```

- **base_random (40%):** Genuine randomness ensures variety. No chef should win more than 30% of the time over a 20-tap window.
- **user_preference (30%):** Derived from which chefs the user has favorited, which recipes they've tapped "Make This" on, and chef preference settings. A user who always cooks Budget King's recipes will see Budget King win more often.
- **context_match (20%):** Time of day (Speed Demon favored at lunch, Max Flavour at dinner), day of week (Maximum Junk favored on weekends), and any dietary filters active.
- **rotation_bonus (10%):** Anti-repetition. The chef who won least recently gets a boost. Ensures all 5 chefs surface regularly.

**Debate Rendering:**

- Chat-bubble style, each chef's bubble colored to match their visual identity
- Chef avatars are illustrated (not photorealistic) — consistent style, expressive, memorable
- Text appears with typewriter animation (Framer Motion `variants` on each character, 30ms stagger)
- Each beat transitions with a subtle screen shake or table-slam animation for emphasis
- Audio: optional tap-to-enable sound effects (fork clinks, table slaps, dramatic stings). Muted by default. Sound toggle persists.
- The entire debate is a single AI generation call that returns structured JSON (see Tech Stack section for prompt architecture)

**Skippability:** Users can tap "Skip to Recipe" at any point during the debate. The debate is the hook, but the recipe is the utility — never gate utility behind entertainment. Skip rate is tracked as a product metric (high skip rate = debates aren't entertaining enough).

### 3. Recipe Reveal (The Payoff)

The moment the debate ends, the screen transitions to the dish reveal. This is the money shot — the visual, emotional, and practical payoff for tapping the button.

**Reveal Sequence (2 seconds):**

1. Screen fades to black (200ms)
2. Dish photo fades in from center, scaling from 0.8 to 1.0 (600ms, spring easing)
3. Dish name types in below the photo (400ms, typewriter effect)
4. Winning chef's victory quip appears as a speech bubble overlaying the photo corner (400ms, slide-in from right)
5. "Make This" button fades in at bottom (400ms)

**Dish Photo Generation:**

- Generated via DALL-E 3 or Stability AI (SDXL) based on the recipe description
- Prompt template: "Professional food photography of [dish name]: [ingredient list]. Shot from 45-degree angle, warm natural lighting, shallow depth of field, on a rustic ceramic plate, dark moody background. No text, no watermarks."
- Photos are generated asynchronously during the debate — by the time the debate ends, the photo should be ready
- Fallback: If image generation fails or times out, show a styled placeholder with the dish name in large typography over a gradient background. Never block the recipe reveal on image generation.
- Image quality: 1024x1024 minimum, WebP format for performance, lazy-loaded with blur-up placeholder

**Dish Naming Convention:**

AI generates dish names that are creative, memorable, and slightly irreverent. The name should make you smile or raise an eyebrow. Guidelines enforced in the prompt:
- 2-5 words maximum
- At least one unexpected adjective or noun combination
- Can reference the winning chef's personality
- Examples: "Crispy Shame Noodles," "The 2AM Regret Burger," "Turmeric Redemption Bowl," "Broke But Brilliant Tacos," "Lightning Carbonara"

### 4. Recipe Card (The Utility)

The recipe card is the actual product. Everything before it — the button, the debate, the reveal — is a delivery mechanism for this. The recipe card must be clear, actionable, and beautiful enough to cook from.

**Recipe Card Layout:**

- **Header:** Dish photo (hero, 40% of viewport), dish name, winning chef badge, difficulty/time/cost indicators as icon pills
- **Ingredients Section:** Clean list with quantities, checkbox for each ingredient (state persists during session), smart swap suggestions inline
- **Steps Section:** Numbered steps, concise language (imperative mood: "Heat oil," not "You should heat the oil"), estimated time per step shown as a subtle badge
- **Footer:** "Make This" confirmation button, share button, save button, "Fork It Again" button (returns to home for a new debate)

**Smart Ingredient Swaps:**

Every ingredient includes an optional swap, generated by the AI as part of the recipe. Swaps are contextual, not generic:
- "2 tbsp sriracha" → Swap: "Any hot sauce, or 1 tsp red pepper flakes + 1 tsp vinegar"
- "Fresh basil" → Swap: "Dried basil (use 1/3 the amount) or fresh cilantro for a different vibe"
- "Gruyere cheese" → Swap: "Any melty cheese — Swiss, fontina, even mozzarella"

Swaps appear as a subtle expandable row below each ingredient. Tap to reveal. Not shown by default — keeps the card clean.

**Serving Size Adjuster:**

- Default: 2 servings
- Stepper control (1-8 servings) at the top of the ingredients section
- All quantities recalculate automatically (simple multiplication with smart rounding — "1.5 eggs" rounds to "2 eggs")
- Recalculation is client-side, instant, no API call

**Recipe Data Structure:**

```typescript
interface Invention {
  id: InventionId;              // Branded type
  dishName: string;
  dishPhoto: string;            // URL to generated image
  winningChef: ChefId;
  chefQuip: string;
  debate: DebateMessage[];      // The full 30-second debate transcript
  difficulty: 'easy' | 'medium' | 'chef';
  totalTime: number;            // Minutes
  prepTime: number;
  cookTime: number;
  costTier: 1 | 2 | 3;         // $ / $$ / $$$
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];               // e.g., ['spicy', 'comfort', 'quick', 'healthy']
  createdAt: string;            // ISO timestamp
  userId?: UserId;
}

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  swap?: string;                // Smart swap suggestion
  isOptional: boolean;
}

interface RecipeStep {
  number: number;
  instruction: string;
  timeMinutes?: number;         // Estimated time for this step
  tip?: string;                 // Chef's tip (optional, from winning chef's voice)
}

interface DebateMessage {
  chefId: ChefId;
  text: string;
  beat: 'opening' | 'clash' | 'pivot' | 'vote' | 'reveal';
  timestamp: number;            // Seconds into the debate (0-30)
}
```

### 5. Recipe History (Past Inventions)

Every invention is ephemeral by default — you see it once, and it's gone. Unless you save it. History is the safety net that lets users revisit past inventions.

- **History Screen:** Grid of past invention cards (dish photo thumbnail + dish name + winning chef icon + date)
- **Two tabs:** "All" (chronological, most recent first) and "Saved" (explicitly bookmarked)
- All inventions are stored locally (localStorage via Zustand persistence) for the free tier
- Pro/Premium users get cloud sync via Supabase
- Tap a card to view the full recipe again
- Swipe left to delete from history
- "Saved" toggle (bookmark icon) on each recipe card — saved inventions are never auto-purged
- History stores up to 100 inventions locally. Oldest unsaved inventions are purged first when the limit is reached.
- Search within history: client-side fuzzy search (fuse.js) over dish names, ingredients, and tags

**"Cook Again" Flow:** From history, tapping an invention opens the full recipe card directly (skips the debate). If the user wants to see the original debate, a "Replay Debate" button is available at the bottom of the recipe card — replays the stored debate transcript with the same animations.

### 6. Pantry Mode (Premium Feature)

Pantry Mode is the premium killer feature. It transforms ForkIt from "invent something random" to "invent something from exactly what I have." This is the feature that justifies the $29/month tier.

- **Pantry Screen:** A searchable, categorizable inventory of what the user has at home
- **Adding Ingredients:** Tap "+" to add manually, or use the quick-add bar (type ingredient name, autocomplete from a master ingredient database of ~2,000 common items)
- **Categories:** Fridge, Freezer, Pantry, Spice Rack — visual sections with collapse/expand
- **Expiry Tracking:** Optional "use by" date per ingredient. Items nearing expiry get a yellow badge. Expired items get a red badge. The AI prioritizes soon-to-expire ingredients in inventions.
- **Pantry-Aware Debates:** When Pantry Mode is active, the Fork It button shows a small pantry icon overlay. The debate prompt includes the user's full pantry inventory. Chefs argue using only (or primarily) what the user has. Budget King becomes even more relevant. Gut Fix can tailor anti-inflammatory suggestions to actual available ingredients.
- **Missing Ingredient Alerts:** If the winning recipe requires something not in the pantry, it's flagged clearly: "You'll need: 1 lime (not in your pantry)." Smart swap is offered immediately.
- **Pantry Sync:** Ingredients persist in Supabase. Pantry state syncs across devices for Premium users.
- **"What's Dying?" Button:** One-tap shortcut that tells the Council to prioritize ingredients expiring within 3 days. The debate opener changes: "The Council convenes. Emergency session: these ingredients are about to die."

**Data Structure:**

```typescript
interface PantryItem {
  id: PantryItemId;
  name: string;
  category: 'fridge' | 'freezer' | 'pantry' | 'spice_rack';
  quantity?: string;
  unit?: string;
  expiryDate?: string;          // ISO date
  addedAt: string;
  userId: UserId;
}
```

### 7. Chef Preferences (Personalization)

Users can tune which chefs influence their inventions. This is lightweight personalization that makes the debate feel tailored without requiring complex profiling.

- **Chef Preference Screen:** 5 chef cards, each with a slider from "Muted" to "Favorite"
  - **Favorite:** This chef's philosophy is weighted higher in recipe generation. They win debates more often.
  - **Neutral (default):** No weight adjustment.
  - **Muted:** This chef rarely wins. They still appear in debates (muted, not removed — their banter is part of the show) but their recipes are deprioritized. A user who hates junk food can mute Maximum Junk. They'll still see Junk's jokes in the debate, but Junk won't win.
- **Quick Filters:** Toggle switches for common dietary preferences that adjust chef weighting automatically:
  - "I'm vegetarian" → Mutes meat-heavy suggestions across all chefs
  - "I'm on a budget" → Boosts Budget King
  - "I'm in a rush" → Boosts Speed Demon
  - "I'm eating healthy" → Boosts Gut Fix
- **Preference data feeds into the debate generation prompt.** The Claude API call includes chef preference weights and active dietary filters. The AI respects these constraints while maintaining the entertainment quality of the debate.
- Preferences stored locally (free tier) or in Supabase (Pro/Premium).

### 8. Share Flow (Viral Mechanics)

Sharing is how ForkIt grows. Every invention is inherently shareable — a funny dish name, a gorgeous photo, and a ridiculous debate transcript. The share flow must be frictionless and produce content that looks native on every platform.

**Share Card Generation:**

- Tap "Share" on any recipe card
- Generates a beautiful image card (1080x1920 for Stories, 1080x1080 for feed posts):
  - Dish photo as hero image (top 60%)
  - Dish name in bold display font (below photo)
  - Winning chef avatar + quip (small, bottom-left)
  - "Invented by ForkIt" branding + QR code (bottom-right)
  - Background: dark gradient matching the winning chef's color theme
- Share options via native Web Share API (falls back to copy-link on unsupported browsers):
  - Instagram Stories (optimized vertical card)
  - iMessage / WhatsApp (card + link)
  - Twitter/X (card + link + auto-generated caption: "[Dish Name] — invented by AI chefs arguing for 30 seconds. @ForkItApp")
  - Copy link
  - Download image

**Debate Clip Sharing:**

- "Share Debate" button generates a short text transcript of the funniest exchange (the Clash beat) formatted for social:
  - Max Flavour: "That needs sriracha aioli and you know it."
  - Maximum Junk: "It needs CHEESE and you know it."
  - Budget King: "It needs to cost less than a dollar and you BOTH know it."
- Option to share as text (Twitter/X optimized) or as a styled image card

**Link Previews:**

- Open Graph tags on shared recipe links show the dish photo + dish name + "Invented by AI chefs on ForkIt"
- Shared links open directly to the recipe card — no auth wall, no app-download interstitial
- Recipient sees the full recipe + a prominent Fork It button to try their own invention

### 9. User Accounts (Deferred Auth)

- App opens immediately to the Fork It button. **NO login wall. NO onboarding. NO splash screen.**
- First tap works instantly — the user gets their first invention with zero friction
- After invention 3: gentle prompt — "Save your inventions? Create an account in 5 seconds." (dismissible)
- Auth via Supabase (email magic link + Google + Apple social login)
- **Anonymous users can:** Tap Fork It, watch debates, view recipes, use the app fully for 10 inventions/day
- **Account required to:** Save to history (cloud), access Pantry Mode, set Chef Preferences (cloud sync), view stats
- **Why deferred auth:** Every second before the first Fork It tap is a lost user. The button must work on first touch. Auth is a convenience feature, never a gate. The conversion moment is when a user wants to save a recipe they actually plan to cook — that's when auth has value, not before.

### 10. Daily Limit & Monetization

**Free Tier:**
- 10 inventions per day (resets at midnight local time)
- Full access to debates, recipes, smart swaps
- Local history (last 100 inventions)
- Counter shown below the Fork It button: "7 of 10 today"
- When limit is reached, the Fork It button dims and shows: "Council's resting. Come back tomorrow — or go Pro."

**Pro Tier — $4.99 One-Time Purchase:**
- Unlimited inventions per day
- Cloud history sync (Supabase)
- No daily counter displayed
- "Pro" badge on profile
- Priority AI generation (dedicated queue, faster response times)

**Chef Council Premium — $29/month:**
- Everything in Pro
- **Pantry Mode:** Full pantry inventory management, pantry-aware debates
- **Personalized Chef Memory:** The AI remembers your past inventions, your cooking skill level, your flavor preferences, and avoids repeating similar dishes
- **Advanced Dietary Filters:** Keto, vegan, gluten-free, dairy-free, nut-free — integrated into debate generation
- **"What's Dying?" pantry alerts:** Priority inventions using expiring ingredients
- **Weekly Meal Plan:** Tap "Plan My Week" — the Council debates 7 meals at once, generates a weekly plan with a consolidated grocery list
- **Export to Grocery List:** Any recipe's ingredients can be exported to Apple Reminders, Google Keep, or a plain text list

**Pricing Rationale:**

| Tier | Price | Logic |
|------|-------|-------|
| Free | $0 | Acquisition. 10/day is generous enough to hook, scarce enough to convert. |
| Pro | $4.99 once | Removes the daily frustration point. One-time purchase builds trust — users hate food app subscriptions. Converts the "I use this daily" segment. |
| Premium | $29/mo | Converts the "I meal plan and cook seriously" segment. Pantry Mode + meal planning + memory create genuine ongoing value that justifies a subscription. The jump from $4.99 to $29/mo is intentional — Premium is a different product for a different user. |

**Why one-time for Pro, not subscription:** Food apps have a trust problem. Every meal kit, recipe app, and grocery service charges $10-15/month for features that feel like they should be free. A $4.99 one-time purchase feels fair, builds goodwill, and drives word-of-mouth: "It's five bucks, just buy it." The subscription tier is reserved for genuinely ongoing value (pantry management, AI memory, meal planning) that costs real money to deliver.

---

## Recipe Scoring Algorithm

Inventions are not all equal. Some are genuinely brilliant. Some are mid. The scoring algorithm surfaces the best inventions in shared feeds, "Top Inventions" lists, and recommendation contexts.

Simple scoring for MVP, computed at query time:

```
score = (make_this_count * 5) + (save_count * 3) + (share_count * 4) + (time_on_card * 0.05) + (cook_again_count * 8) + freshness_boost - (skip_to_recipe_penalty * 0.5) - (report_count * 10)
```

- **make_this_count:** Primary signal. The user committed to cooking this dish. Highest positive weight.
- **cook_again_count:** The user made this dish more than once. Strongest signal of a genuinely good recipe. Highest individual weight.
- **share_count:** Social validation. Users share things they think are impressive/funny.
- **save_count:** Bookmarked for later. Intent signal, weaker than "Make This" but still positive.
- **time_on_card:** Time spent on the recipe card (seconds). Longer = more engaged. Capped at 300 seconds to prevent idle-screen inflation.
- **freshness_boost:** Exponential decay. New inventions get a 24-hour boost to surface in "Top Inventions" lists.
- **skip_to_recipe_penalty:** Skipping the debate suggests the debate wasn't entertaining. Mild penalty — it's fine to skip, but it's a signal.
- **report_count:** Flagged recipes are deprioritized immediately, hidden at 3+ reports pending review.

**Data model note:** "Make This" interactions must include timestamps from MVP launch. This enables v1.1 meal planning analytics and v2 cooking pattern recognition without backfilling data.

---

## Content Taxonomy

### Invention Tags (AI-Generated)

Every invention is automatically tagged by the AI during generation. Tags are not user-facing categories — they're metadata for filtering, search, and recommendation.

**Cuisine Tags:** Italian, Mexican, Thai, Japanese, Indian, American, Mediterranean, Korean, Chinese, Fusion

**Vibe Tags:** Comfort, Healthy, Quick, Budget, Fancy, Spicy, Indulgent, Light, Hearty, Experimental

**Meal Type:** Breakfast, Lunch, Dinner, Snack, Late Night, Brunch

**Dietary:** Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, High-Protein, Low-Carb

### Chef Archetypes as Taxonomy

The five chefs double as a de facto content taxonomy. Users naturally develop preferences:
- "I'm a Budget King person" = wants cheap, creative meals
- "I'm a Speed Demon person" = wants fast meals
- "I'm a Gut Fix person" = wants healthy meals

This emergent self-categorization is more powerful than asking users to fill out a dietary profile. The chefs ARE the profile. Preference data flows from chef favoriting, not from forms.

---

## Curation Signals

| Signal | What It Measures | Weight |
|--------|------------------|--------|
| "Make This" tap | User committed to cooking | Highest |
| Cook Again (reopened from history) | Recipe was actually good enough to repeat | Highest |
| Share count | Social validation, entertainment value | High |
| Save to history | Intent to cook later | Medium |
| Time on recipe card | Engagement with the recipe details | Medium |
| Skip debate rate | Debate quality / entertainment value | Negative (low) |
| Report count | Something wrong with the recipe | Negative (highest) |

---

## The 5 Launch Chefs — Detailed Profiles

**These characters are the most important creative asset we ship.** Each chef must feel like a real personality — someone you'd follow on social media, someone you'd argue with at a dinner party. The debate quality depends entirely on how distinct and entertaining these voices are. Budget real time for voice development and testing.

### Max Flavour

- **Motto:** "If it doesn't make your taste buds scream, why bother?"
- **Personality:** Dramatic, passionate, slightly pretentious but self-aware about it. Treats every meal like it's their last. References specific flavor compounds by name ("that Maillard reaction though"). Gets genuinely offended by bland food.
- **Cuisine Lean:** Thai, Indian, Mexican, Korean — anything with bold flavor profiles
- **Catchphrases:** "Layer the flavors." / "Needs acid." / "Where's the heat?" / "This could slap."
- **Weakness (for comedy):** Over-complicates simple dishes. Would add a gastrique to toast.
- **Color:** Red (#DC2626)

### Maximum Junk

- **Motto:** "Add more cheese. Actually, double the cheese."
- **Personality:** Gleefully unrepentant hedonist. Knows junk food is junk food and doesn't care. Speaks in superlatives ("the BEST thing I've ever created"). Finds a way to deep-fry anything. Genuinely creative within the comfort food space — not just "add cheese," but inventive combinations.
- **Cuisine Lean:** American comfort, pub food, late-night munchies, anything involving a deep fryer
- **Catchphrases:** "Deep fry it." / "Needs cheese." / "What if we wrapped it in bacon?" / "Life's too short for salad."
- **Weakness (for comedy):** Has never voluntarily eaten a vegetable. Thinks ketchup is a smoothie.
- **Color:** Yellow (#EAB308)

### Gut Fix

- **Motto:** "Your microbiome is begging for mercy."
- **Personality:** Earnest, slightly preachy, but backed by actual nutritional knowledge. Drops microbiome facts mid-debate. Genuinely cares about the user's health. Gets exasperated by Maximum Junk specifically. Has a surprising sense of humor about their own earnestness.
- **Cuisine Lean:** Mediterranean, Japanese, plant-forward, fermented foods, whole grains
- **Catchphrases:** "Your gut will thank you." / "Do you know what that does to your inflammation markers?" / "Fermented, not fried." / "Fiber. You need fiber."
- **Weakness (for comedy):** Makes everything sound like medicine. Would add probiotics to ice cream.
- **Color:** Green (#16A34A)

### Budget King

- **Motto:** "That's $12 for something you can make for $2."
- **Personality:** Incredulous at waste, penny-proud, but surprisingly inventive. Sees a nearly empty fridge as a creative challenge, not a limitation. Knows the price of every ingredient at every store. Gets personally offended by Max Flavour's saffron suggestions.
- **Cuisine Lean:** Rice and bean dishes, egg-based meals, stretching proteins, pantry staples, "struggle meals" elevated
- **Catchphrases:** "How much did that cost?" / "Rice and beans, people. Rice and beans." / "I can feed a family of four for less than that avocado." / "Generic brand. Always."
- **Weakness (for comedy):** Would use expired coupons if he could. Judges people by their grocery receipts.
- **Color:** Blue (#2563EB)

### Speed Demon

- **Motto:** "If it takes longer than a TikTok scroll, I'm out."
- **Personality:** Aggressively impatient. Hates anything that requires marinating, slow-cooking, or "letting it rest." Speaks in short, punchy sentences. Gets visibly annoyed when other chefs suggest 45-minute recipes. Secretly respects Max Flavour but would never admit it.
- **Cuisine Lean:** Stir-fries, wraps, one-pan meals, microwave hacks, sandwiches elevated
- **Catchphrases:** "How long?" / "That's too many steps." / "One pan. Done." / "Marinate? I don't have that kind of time." / "15 minutes or I'm ordering pizza."
- **Weakness (for comedy):** Has the attention span of a goldfish. Has never braised anything. Thinks "slow cooker" is an oxymoron.
- **Color:** Orange (#EA580C)

---

## Viral / Growth Mechanics (MVP)

- **Share cards:** Gorgeous auto-generated image cards optimized for Instagram Stories and iMessage. Dish photo + creative name + chef quip + ForkIt branding. "The Council invented this for me."
- **Debate clips:** Shareable text snippets of the funniest debate exchange. Optimized for Twitter/X. The debate banter is inherently tweet-able.
- **Link previews:** Open Graph tags show dish photo + dish name + "Invented by AI chefs on ForkIt." Food photos drive clicks. Curiosity about the name drives the rest.
- **No login wall:** Every shared link opens directly to the recipe. No auth required. Recipient sees the dish and a prominent "Try ForkIt — your chefs are waiting" CTA.
- **"My chefs invented..."** social proof: After 5 inventions, offer one-tap share: "My AI chefs have invented 5 dishes for me this week" card with a grid of dish photos. Gallery format for Instagram.
- **Chef personality quizzes (v1.1):** "Which ForkIt chef are you?" — shareable personality result. Classic viral mechanic, tied to the chef characters.

---

## Tech Stack

```
Frontend:   Next.js 14 (App Router) + Tailwind CSS + Framer Motion
State:      Zustand + localStorage persistence
Backend:    Next.js API routes (serverless on Vercel)
Database:   Supabase (Postgres + Auth + Row Level Security)
AI Recipe:  Anthropic Claude API (debate generation + recipe invention)
AI Image:   DALL-E 3 / Stability AI SDXL (dish photo generation)
Search:     fuse.js (client-side fuzzy over history)
Types:      TypeScript + neverthrow (Result types)
Hosting:    Vercel (free tier → Pro as needed)
```

**Why this stack:** One language (TypeScript), one repo, one deploy command. Identical to the Skim stack — shared infrastructure knowledge, shared deployment pipeline. Supabase gives auth + database + realtime without building any of it. A single developer can build and ship this in a weekend.

**AI Prompt Architecture:**

The Claude API call is the core of ForkIt. A single generation call returns the entire invention — debate transcript + recipe + metadata — as structured JSON.

```
System prompt:
  - Chef personality definitions (voice, cuisine lean, catchphrases)
  - Debate structure (6 beats, 30-second pacing)
  - Recipe format (ingredients with swaps, numbered steps, time estimates)
  - Dish naming conventions (2-5 words, creative, memorable)
  - User context (chef preferences, dietary filters, pantry if Premium)

User prompt:
  "Generate a ForkIt invention. The user wants a meal."
  + [Chef preference weights]
  + [Active dietary filters]
  + [Time of day context]
  + [Pantry inventory if applicable]

Response format: Structured JSON matching the Invention interface
```

Prompt template stored server-side. User input never enters the system prompt directly — prevents prompt injection. Chef preference weights and dietary filters are validated server-side before injection into the prompt.

**Image Generation Pipeline:**

1. Claude generates the recipe (including a detailed dish description for image prompting)
2. Image generation API is called asynchronously with the dish description
3. Image is stored in Supabase Storage (or Vercel Blob)
4. Recipe card references the stored image URL
5. If image generation fails, recipe card displays without photo (styled placeholder)
6. Image generation runs in parallel with debate animation — user never waits for the image

**Build Phases:**

- **Phase 1 (Day 1):** Fork It button + debate animation + Claude API integration for recipe generation. Static chef profiles. Local storage for history. No image generation (styled placeholders). No auth. Deploy to Vercel.
- **Phase 2 (Day 2):** Add Supabase for auth + cloud history + pantry. Add image generation. Add share card generation. Add monetization gates (daily limit, Pro unlock, Premium features). Add chef preferences.

---

## Roadmap

### v1.1 — Depth of Cooking

- Bug fixes, performance optimization, QoL based on real user feedback
- **Weekly Meal Plan (Premium):** "Plan My Week" button — the Council debates 7 meals at once. Generates a full weekly plan with Monday-Sunday dinner assignments. Each day's meal gets a mini-debate (3 sentences per chef instead of the full 30-second show). Consolidated grocery list across all 7 meals with quantity aggregation.
- **Grocery List Export:** Any recipe's ingredients exportable to Apple Reminders, Google Keep, Todoist, or plain text. Weekly meal plan generates a single consolidated list.
- **Diet Filters (expanded):** Keto, paleo, whole30, low-FODMAP, halal, kosher — integrated into debate generation. Each filter adjusts all 5 chefs' suggestions, not just Gut Fix.
- **Chef Personality Quiz:** "Which ForkIt chef are you?" — 7-question quiz, shareable result card, sets initial chef preferences. Viral acquisition mechanic.
- **Cooking Timer Integration:** In-recipe step timers. Tap the time badge on any step to start a countdown. Multiple concurrent timers supported.
- **Offline Mode (PWA):** Pre-cache 5 recent inventions. Service worker. View saved recipes without connectivity. New inventions still require network (AI generation).

v1.1 theme: ForkIt graduates from a novelty ("watch the debate") to a daily cooking tool ("plan my week, export my list, time my steps"). Retention mechanics for the utility layer.

### v2 — Social & Community

| Feature | Description |
|---------|-------------|
| Debate Replay Feed | Public feed of the best debate transcripts. Users vote on funniest debates. Leaderboard of most entertaining Council sessions. Passive entertainment mode — browse debates without cooking. |
| Challenge Friends | Send a friend the Fork It button with a constraint: "Invent something with only 3 ingredients" or "Feed a family of 6 for under $10." Friend gets a custom Council debate. |
| Custom Chef Creation | Design your own 6th chef. Name, personality, cuisine lean, catchphrases. Your custom chef joins the Council for your debates. Shareable — friends can "hire" your chef. |
| Voice Mode | The debate plays as audio with AI-generated chef voices. Each chef has a distinct voice profile. Hands-free cooking companion — listen to the debate while prepping. |
| Cooking Completion Tracking | After tapping "Make This," ForkIt checks in 60 minutes later: "Did you make it? How was it?" User rates 1-5 stars. Rating feeds back into recipe scoring and AI improvement. |
| Recipe Remix | After cooking, users can annotate: "I added garlic" / "I swapped the rice for quinoa." Annotations are saved with the invention. Shared recipes include community modifications. |
| Seasonal Ingredients | AI prioritizes seasonal produce based on user's location. Gut Fix and Budget King both benefit — seasonal is healthier AND cheaper. |

### v3 — Platform & Partnerships

| Feature | Description |
|---------|-------------|
| Smart Kitchen Integration | Connect to smart ovens, Instant Pots, and air fryers. ForkIt sends cook settings directly to the device. "Preheat to 400F" becomes a tap. |
| Sponsored Ingredients | Brand partnerships where specific ingredients are featured in inventions. "Tonight's invention features Kerrygold butter." Subtle, relevant, opt-out-able. Revenue stream that funds free tier expansion. |
| Recipe Video Generation | AI-generated 30-second recipe videos from the recipe card. Step-by-step visual instructions. TikTok/Reels native format. |
| Chef Marketplace | Community-created chef characters available for download. Top creators earn revenue share. The Council expands from 5 to 5+1 (user's custom chef or a marketplace chef). |
| Restaurant Mode | Restaurants partner with ForkIt to invent specials. "The Council invented tonight's special at [Restaurant Name]." In-app ordering integration. |
| Nutrition Tracking | Full macro/calorie breakdown per invention. Integration with Apple Health, MyFitnessPal. Gut Fix becomes a legitimate nutrition advisor. |

---

## Key Decisions Log

Decisions made during the brainstorm and the reasoning behind them:

| Decision | Rationale |
|----------|-----------|
| 5 chefs, not 3 or 7 | 3 is too few — debates feel thin, not enough personality variety to cover the full spectrum of food philosophies. 7 is too many — debates become chaotic, users can't remember all the characters, the 30-second window can't service that many voices. 5 is the sweet spot: enough for genuine conflict (at least 2-3 clashing perspectives per debate), small enough that every chef gets memorable screen time. Odd number ensures decisive votes. |
| 30-second debates, not 15 or 60 | 15 seconds is too short to establish the joke and deliver the recipe premise — the debate feels rushed, chefs don't get to clash. 60 seconds is too long — attention drops, users start skipping, and the "quick hit" value prop dies. 30 seconds maps to the TikTok attention window and allows exactly 6 narrative beats (prompt, opening volleys, clash, pivot, vote, reveal). Tested: 30s is long enough to laugh twice and short enough to never feel like waiting. |
| AI-invented recipes, not a recipe database | A recipe database turns ForkIt into AllRecipes with a gimmick. The invention mechanic is the product. Every tap produces something that has never existed before — that's the magic. It also means infinite content with zero editorial overhead, no licensing, no copyright concerns, and genuine surprise every time. The AI can tailor inventions to preferences, pantry, and dietary needs in ways a static database never could. |
| One-time Pro purchase, not subscription for basic | Food apps have a subscription trust problem. Users have been burned by meal kit services, recipe apps, and grocery delivery subscriptions that feel extractive. A $4.99 one-time purchase signals confidence — "we don't need to lock you in." It drives word-of-mouth ("just buy it, it's five bucks") and converts the daily user who's already hooked. Subscription is reserved for Premium, where ongoing AI costs (pantry memory, meal planning, advanced personalization) create genuine recurring value. |
| Entertainment-first (the debate is the hook) | Recipe apps are commodities. There are a million ways to find "what to cook tonight." ForkIt's moat is that the journey to the recipe is entertaining. The debate is the reason you open the app even when you're not hungry. It's the reason you show it to friends. It's the reason you share clips on social media. The recipe is the utility that keeps you coming back, but the debate is the hook that gets you in the door. Entertainment-first, utility-always. |
| Deferred auth, matching Skim's pattern | Every second before the first Fork It tap is a lost user. The button must work instantly. Auth has no value until the user wants to save something — and by then, they're already hooked. Forcing login before the first invention would cut conversion by 60-80% based on industry benchmarks for consumer apps. |
| No recipe database/search (invention-only) | Adding search or browsing turns ForkIt into a recipe app that also has a debate feature. The constraint IS the product. One button, one invention, one decision made for you. The absence of choice is the value proposition. Users who want to browse recipes have 500 apps for that. Users who want a decision made for them have ForkIt. |
| Chef personalities over cuisine categories | Traditional food apps categorize by cuisine (Italian, Mexican, Thai). ForkIt categorizes by philosophy (bold, comfort, healthy, cheap, fast). This maps to how people actually think about food decisions: "I want something quick" not "I want Thai food." The chefs embody these philosophies, making the taxonomy feel like a relationship with characters rather than a dropdown menu. |
| Image generation async during debate | The debate is 30 seconds of animation. That's 30 seconds of "free" loading time for image generation. By running DALL-E/Stability AI in parallel with the debate render, the user never perceives a loading state for the image. If image generation is slower than 30 seconds, the recipe card displays with a styled placeholder and the image loads in asynchronously — recipe utility is never blocked by image generation. |
| $29/month for Premium, not $9.99 | Premium includes Pantry Mode (persistent inventory management), AI memory (personalized to your cooking history), and weekly meal planning — features that require significant ongoing AI compute costs. $9.99 doesn't cover the API costs for pantry-aware, memory-enabled, weekly-planning-level AI generation. $29/month positions Premium as a serious cooking tool, not a casual upgrade. The wide gap between Pro ($4.99 once) and Premium ($29/mo) is intentional — they serve different users with different needs. |
| Styled placeholders over blocking on image generation | Food photos are important but not critical path. A gorgeous recipe card with a styled typographic placeholder (dish name in large display font over a chef-colored gradient) is better than a 10-second loading spinner. The photo enhances; the recipe delivers. Never gate utility on aesthetics. |