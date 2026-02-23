# SKIM — Unified Product Plan

*Finalized 2026-02-19 by product-ux, tech-arch, and growth-content*

---

## Core Concept

Skim is a micro-learning feed app (website). Think TikTok for knowledge. Users scroll through "skims" — super short explanations of concepts across science, math, history, psychology, and more. Each skim takes 15-45 seconds to consume. Features multiple reading modes including RSVP speed reading. Users can create their own skims, which get views and "Got it!" reactions, and rank by quality on the feed. 50 editorially polished sample skims at launch. If a concept doesn't exist, users can generate one with AI.

**Product Philosophy:** Skim is a learning tool that borrows engagement mechanics from social media — not a social network with learning content. The north star metric is **concepts retained, not time spent.** A user who learns 5 things in 3 minutes and leaves had a perfect session.

---

## Content Format — The "Skim Stack"

Every skim follows a rigid three-part structure:

- **Hook** (1 line, ~15 words): A question or surprising fact. Genuinely answered by the Core. No clickbait.
- **Core** (3-5 lines, ~80-100 words): The actual explanation. Plain language. "Smart 14-year-old" reading level. No jargon without immediate definition.
- **Snap** (1 line, ~15-25 words): The mic-drop takeaway. Memorable, quotable, shareable.

**Word limit: 150 words max, counted in words (not characters).** Sweet spot: 80-120 words.

**Tone:** Conversational, confident, slightly playful. Like a brilliant friend explaining something at a bar. Never condescending, never dry textbook.

**One concept per skim. Always.** If a concept needs a prerequisite, link to it.

**Subtitle-friendly writing:** Avoid long subordinate clauses that don't break cleanly into 3-5 word phrases. Instead of "The theory of evolution, which was first proposed by Darwin in 1859, explains..." write "Darwin proposed evolution in 1859. The idea is simple..." This isn't an extra constraint — it's what "plain language" already implies.

**In Speed, Subtitle, and Teleprompter modes:** The Snap line appears with a visual flourish (bold, color accent) to create a dopamine hit at the end.

---

## MVP Features

### 1. The Feed (Full-Screen, Vertical Scroll)

- One skim per screen (TikTok model, NOT Twitter timeline)
- Vertical snap-scroll (`scroll-snap-type: y mandatory`)
- Swipe up = next, swipe down = previous, tap = pause/resume
- Full-screen forces immersion — consume or swipe past
- Infinite scroll with cursor-based pagination
- "Daily Pick" at top of feed (algorithmic: highest "Got it!" rate in last 24 hours, minimum 50 views to qualify)
- First 3 skims are curated onboarding skims (hardcoded `onboarding_skims` config), showcasing range across Realms

### 2. Four Reading Modes

Four modes arranged on a **speed-control spectrum** — from maximum speed / zero control to full control / self-paced. Each mode triggers a distinct cognitive state, serving different learner preferences and content types.

All modes share the same token array data structure: `{ word: "entropy", pause: 1.3, isKey: true }`. Subtitle phrase chunking is computed at runtime via heuristics — no additional token fields needed for MVP.

Architecture: Strategy pattern. Each mode implements a shared `ReadingModeRenderer` interface (render, pause, resume, getProgress). The feed component swaps renderers. Adding a mode = adding one component.

**A. Speed Mode — RSVP (DEFAULT for new users)**

The signature Skim experience. This is what makes someone say "holy shit" and show their friend. Cognitive state: meditative laser focus.

- Words flash one at a time, center-screen
- Default 300 WPM, adjustable 150-600 via thumb slider on right edge
- Center-aligned words with key terms highlighted in accent color
- Adaptive speed: slow for long words (>8 chars), technical terms, numbers; fast for articles ("the", "a", "is")
- Punctuation pauses (period = 200ms, comma = 100ms)
- Progress bar at bottom. Tap anywhere to pause/resume.
- Best for: quick, punchy 1-dot content. The forced single-word cadence creates an almost meditative state.

**B. Subtitle Mode (introduced via progressive disclosure after skim 5)**

Text appears like movie subtitles — phrase by phrase at the bottom of the screen. The learner becomes a viewer, not a reader. Cognitive state: passive cinematic absorption.

- Phrases of 2-5 words appear at the bottom of the screen with fade-in/fade-out transitions (Framer Motion)
- Phrase chunking uses runtime heuristics: break before conjunctions/prepositions ("but", "and", "in", "for", "with"), break after punctuation, min 2 words / max 5 words per chunk, keep quoted phrases together
- Screen real estate above subtitles available for skim title, visual accents, or calm background — premium feel
- Speed adjustable via same WPM slider (controls phrase display duration)
- Progress bar at bottom. Tap anywhere to pause/resume.
- Respects mobile safe areas (notch, home indicator) for bottom positioning
- Best for: narrative content (history, psychology). The cinematic feel adds emotional weight. Makes learning feel effortless.

**C. Teleprompter Mode (introduced via progressive disclosure after skim 10)**

Full text scrolls continuously upward like a news teleprompter. The lean-forward reading mode. Cognitive state: active guided reading.

- Full skim text rendered in a container that scrolls upward at a constant speed (CSS transform: translateY with linear timing)
- Scroll speed derived from WPM setting. Adjustable via same slider.
- Gradient fade at top and bottom edges (CSS mask-image) — text is most legible in the center zone, creating a natural focal point without explicit UI chrome
- Subtle easing at Hook-to-Core and Core-to-Snap transitions — scroll decelerates slightly at section boundaries for organic pacing
- Users can see upcoming text and glance back at receding text — peripheral context aids comprehension on dense topics
- Progress bar at bottom. Tap anywhere to pause/resume.
- Best for: 2-dot and 3-dot technical content ("What is CRISPR?", "How does encryption work?") where surrounding context aids comprehension.

**D. Classic Mode (always available via mode picker)**

- Full skim text as a beautifully typeset card
- Key terms bolded automatically, estimated read time shown
- For users who prefer traditional self-paced reading
- The accessibility safety net — always available, never gated

**The Snap Flourish:** In Speed, Subtitle, and Teleprompter modes, the Snap line appears with a visual flourish (bold, accent color, slight scale-up) to create a dopamine hit at the end. In Teleprompter, the scroll decelerates as the Snap line enters the focal zone for a cinematic close.

**Progressive Disclosure:** Speed Mode (RSVP) is default. Classic is always visible via mode picker icon. After skim 5, introduce Subtitle mode: "Want to see phrases instead of single words? Try Subtitle mode." After skim 10, introduce Teleprompter: "Want to read at your own pace with a gentle push? Try Teleprompter." Users never face more than one new choice at a time. All prompts are dismissible and modes remain accessible via settings after dismissal. User sets preferred default in settings, can switch per-skim. App remembers preference.

**Mode Picker UX:** Bottom-sheet triggered by a reading-mode icon in the toolbar. Shows all unlocked modes arranged left-to-right on the speed-control spectrum (RSVP > Subtitle > Teleprompter > Classic). Locked modes appear grayed-out with unlock hint text. One-tap switch. Dismissible.

**Mid-Skim Mode Switching:** Users can switch modes while reading a skim. The new renderer picks up at the same progress point (word index / total words). Transition: 300ms crossfade, no jarring cuts. RSVP-to-Subtitle fades in the phrase containing the current word. Any-to-Teleprompter fades in at the scroll position matching current progress. Any-to-Classic shows static text scrolled to the approximate reading position.

**Content-Mode Affinity (v2):** Data model supports an optional `suggestedMode` field per skim. Different content types shine in different modes:
- Narrative skims (history, psychology) → Subtitle (cinematic, emotional weight)
- Dense/technical skims (CRISPR, encryption) → Teleprompter (context from surrounding text aids comprehension)
- Quick/punchy skims (1-dot difficulty) → RSVP (laser focus, dopamine hit)
- Complex/re-readable skims → Classic (self-paced, scan back)

For the 50 launch skims, editorially tag the best mode for each. When a user has unlocked that mode, show a gentle nudge: "Try this one in Subtitle mode." Not enforced — just a suggestion.

**Shareability by Mode:** RSVP is the best demo mode ("watch this"). Subtitle is second — the "whoa, it's like a movie" reaction makes it screen-recording friendly. Teleprompter is cool but less visually distinct in recordings. Classic has no demo value but is essential for accessibility.

### 3. "Got it!" — The Core Reaction

After each skim, two primary actions:

- **"Got it!"** (primary, larger button) — "I learned something"
- **Bookmark icon** (secondary, smaller) — "save for later"

In the "..." overflow menu: Like (heart) for acknowledging quality writing even if you already knew the concept, plus Share options (native Web Share API + share card generation).

"Got it!" is the defining metric of Skim. It measures whether a skim actually taught something, not just whether it was entertaining. This signal drives the feed algorithm, curation, and creator incentives. The end-of-skim moment stays clean and purposeful.

### 4. Content Creation (The "60-Second Create" Flow)

1. Tap "+" button
2. Type or select a topic
3. Skim Builder enforces Hook / Core / Snap sections
4. Word count indicator with sweet-spot nudge:
   - 60-100 words: green ("Tight and punchy")
   - 100-130 words: neutral
   - 130-150 words: yellow ("Consider trimming")
   - 150+ words: hard stop (rejected)
5. Set difficulty (1-3 dots) — system shows NLP-suggested default, creator confirms or overrides
6. Preview in all unlocked reading modes
7. Tag with 1-3 topics + assign to a Realm
8. Optional: Tap "Suggest improvements" for one-shot AI feedback on hook strength, clarity, and snap impact
9. Publish

### 5. AI Skim Generation

- Triggered when search returns no results: "No skim yet. Generate one?"
- Backend calls Claude API with structured prompt enforcing Hook/Core/Snap format, plain language, analogy required
- User sees draft in an edit screen — can tweak before publishing
- Published with "AI-assisted" badge
- Human-created versions can outrank AI versions via "Got it!" rate
- Rate limit: 3 AI generations per day per user (increase based on usage data)
- Prompt template stored server-side (prevents prompt injection)

### 6. Search

- Client-side fuzzy search using fuse.js over titles, tags, Realms, AND full skim text (hook + core + snap)
- Search results displayed as preview cards
- "No results? Generate with AI" prompt when search returns empty

### 7. User Accounts (Deferred Auth)

- App opens immediately to the feed. NO login wall. NO onboarding.
- First 3 skims are curated (not algorithm-driven) for a controlled first impression
- After skim 3: gentle "Save your progress?" prompt (dismissible)
- Auth via Supabase (email + social login)
- Anonymous users can: browse the full feed, use all reading modes
- Account required to: create skims, tap "Got it!", bookmark, view stats

### 8. Streaks (Opt-In, Discovered Organically)

- No streak counter on first open
- After 3 consecutive days of reading, a celebration: "You've been learning 3 days in a row!"
- Option to "Track your streak" — if accepted, counter appears in profile
- If dismissed, never shown again until manually enabled in settings
- Simple counter in localStorage. No goals, no guilt.

### 9. Creator Stats Page

- Total views, total "Got it!" count, number of skims published
- Best-performing skim highlighted
- Realms they cover
- No push notifications in MVP — the stats page IS the dopamine

### 10. Reporting

- Single "Report" button on each skim (in overflow menu)
- Optional free-text reason
- Multiple reports trigger automatic hide from feed pending review
- Granular flag categories (Inaccurate / Confusing / Misleading) deferred to v2

---

## Feed Algorithm

Simple scoring for MVP, computed at query time:

```
score = (got_it_count * 5) + (completion_rate * 3) + (views * 0.1) + freshness_boost - (skip_penalty * 5) - (report_count * 10)
```

- **got_it_count:** Primary quality signal — did the skim teach something?
- **completion_rate:** Did users finish the skim or swipe away early? (In Speed, Subtitle, and Teleprompter modes, tracked by whether the skim reached the final word)
- **freshness_boost:** Exponential decay. New skims get a 48-hour boost window (~500 impressions to test)
- **skip_penalty:** View time < 2 seconds counts as skip
- **report_count:** Multiple reports = immediate priority loss + hide pending review

**Tabs:** "Trending" (pure score) + tag-filtered views (tap a tag to see all skims with that tag, excluding the one just read).

**Skim of the Day:** Algorithmic. Highest "Got it!" rate in last 24 hours among skims with 50+ views. Displayed prominently at top of feed.

**Personalized "For You" tab:** Deferred to v2. Requires tracking user category affinity. Explicitly no "Following" tab — content quality remains the sole feed signal.

**Data model note:** "Got it!" interactions must include timestamps from MVP launch. This enables v1.1 Quick Review scheduling (Leitner intervals) and v2 Mage Level scoring without backfilling data.

---

## Content Taxonomy

### Realms (~10 broad categories)

Universe (physics, astronomy) | Life (biology, evolution) | Numbers (math, stats) | Past (history, archaeology) | Mind (psychology, neuroscience) | Earth (geology, climate) | Code (CS, tech) | Society (economics, politics) | Body (medicine, health) | Art (music theory, color, design)

Plus **"Surprise Me"** button — serves a random skim from a Realm the user hasn't explored. First-class navigation element, not a hidden feature.

### Tags (freeform, user-created)

Community-curated. Browsable, followable. Examples: #quantumweird, #everydayphysics, #mathisbeautiful

### Difficulty (creator-tagged with NLP suggestion)

- One dot: No background needed
- Two dots: Some context helps
- Three dots: Niche but fascinating

Creator sets difficulty during creation. System suggests a default based on language complexity analysis. Creator confirms or overrides. Trust the creator — they know whether a concept requires background knowledge. (Concept complexity and language complexity are different things: "E = mc squared" uses simple words but explains a mind-bending idea.)

---

## Curation Signals

| Signal | What It Measures | Weight |
|--------|------------------|--------|
| "Got it!" rate | Did the skim teach something? | Highest |
| Completion rate | Did users finish or skip? | High |
| Skip rate (<2s) | Immediate bounce | Negative (high) |
| Report count | Something wrong | Negative (highest) |

---

## The 50 Sample Skims

**These are the most important content we ship.** Editorially polished, not raw AI output. Budget real time for writing and revision. Each must exemplify the Hook/Core/Snap format perfectly. AI can draft them, but every skim must be hand-edited for tone, clarity, and that perfect Snap line.

Distribution: 5 per Realm. 60% one-dot, 30% two-dot, 10% three-dot.

| Realm | Topics |
|-------|--------|
| Universe | Why is the sky blue? / How big is the observable universe? / What is a black hole? / Why do stars twinkle? / What is dark matter? |
| Life | How does evolution actually work? / Why do we have fingerprints? / How do vaccines work? / What is CRISPR? / Why can't you tickle yourself? |
| Numbers | Why can't we divide by zero? / The birthday paradox / What is infinity? / Why does 0.999... = 1? / What is the golden ratio? |
| Past | What killed the dinosaurs? / How were the pyramids built? / Why did Rome fall? / Who invented zero? / What started World War I? |
| Mind | The Dunning-Kruger effect / Why do we dream? / What is deja vu? / How does memory work? / Why do we procrastinate? |
| Earth | Why do tectonic plates move? / How do hurricanes form? / Why is the ocean salty? / What causes the Northern Lights? / How old is the Earth? |
| Code | How does Wi-Fi work? / What is an algorithm? / How does encryption work? / What is machine learning? / How does the internet actually work? |
| Society | What is inflation, really? / How does gerrymandering work? / What is the GDP? / Why do economies crash? / What is the tragedy of the commons? |
| Body | Why do we yawn? / How does your immune system work? / Why do we get hiccups? / What happens when you sleep? / Why does your heart beat? |
| Art | Why do minor keys sound sad? / What is the rule of thirds? / How does color theory work? / Why is the Mona Lisa famous? / What makes a melody catchy? |

---

## Viral / Growth Mechanics (MVP)

- **Share cards:** Tap share generates a beautiful image card (skim text on clean background + Skim logo + QR code). "Did you know?" prefix. Optimized for Instagram Stories, iMessage, WhatsApp.
- **Link previews:** Open Graph tags show the Hook line as preview text. Curiosity gap drives clicks.
- **"I just learned" social proof:** After 5 skims in a session, offer one-tap share: "I just learned 5 things on Skim" card with topic titles.
- **No login wall:** Every shared link opens directly to the skim, no auth required. Frictionless viral loop.

---

## Tech Stack

```
Frontend:   Next.js 14 (App Router) + Tailwind CSS + Framer Motion
State:      Zustand + localStorage persistence
Backend:    Next.js API routes (serverless on Vercel)
Database:   Supabase (Postgres + Auth + Row Level Security)
AI:         Anthropic Claude API
Search:     fuse.js (client-side fuzzy, full-text index)
Hosting:    Vercel (free tier)
```

**Why this stack:** One language (TypeScript), one repo, one deploy command. Supabase gives auth + database + realtime without building any of it. A single developer can build and ship this in a weekend.

**Build phases:**

- **Phase 1 (Day 1):** Static site with 50 skims in JSON. RSVP engine + Classic mode working. Feed with sorting. Deploy to Vercel.
- **Phase 2 (Day 2):** Add Supabase for "Got it!" tracking, views, bookmarks. Add AI generation. Add user accounts. Add Subtitle mode + Teleprompter mode. Add share card generation.

---

## Roadmap

### v1.1 — Depth of Learning

- Bug fixes, performance optimization, QoL based on real user feedback
- **Skim Chains:** Ordered sequences of 3-7 skims explaining a bigger concept. Community-curated. "Netflix binge" for learning. Pre-curate 5-8 chains from the initial 50 skims.
- **Quick Review + Mage Level (minimal):** Lightweight spaced repetition with gamification. Validates that users want retention mechanics before investing in full quiz system (v2).
  - **Trigger:** Unlocked after a user taps "Got it!" on 10+ skims. Discovered organically, like streaks.
  - **Review format:** The skim's Hook appears as a question. User thinks, then taps to reveal the Snap as the answer. Self-reported: "Remembered" or "Forgot." No AI grading, no multiple choice. Zero content overhead — leverages existing Hook/Core/Snap structure.
  - **Scoring:** Score only goes up. +10 XP for "Remembered," +3 XP for "Forgot but reviewed." No punishment for forgetting. No score decay. Every session is a win. Micro-celebration on each review: brief animation + contextual message ("Nice, you remembered!" / "Good — now you'll remember next time!"). Closes the feedback loop so review feels rewarding, not like homework.
  - **Mage Level:** Flavor text on profile based on XP thresholds. Apprentice (0-50) / Scholar (50-200) / Sage (200-500) / Mage (500+). Fun theming, low stakes. No leaderboard.
  - **Scheduling:** Basic Leitner system (3 boxes). Correct = longer interval, wrong = back to box 1. Intervals: Box 1 = 1 day, Box 2 = 3 days, Box 3 = 7 days.
  - **UX placement:** Post-session prompt. After 5+ skims consumed in a session, when the user naturally slows down (pause > 5 seconds), surface: "Before you go — quick review of 3 things you learned this week?" If dismissed, doesn't reappear until the next session. Never interleaved in the feed, never a pre-feed gate.
  - **Philosophy:** Approach motivation (gaining XP), not avoidance motivation (preventing loss). Matches Skim's anti-guilt philosophy: opt-in streaks, no login wall, no pressure.
  - **Data model:** Designed to support future full Mage Level gamification (v2). Ensure "Got it!" tracking includes timestamps per user per skim for review scheduling.
- **Lightweight Remix:** Fork a skim with a different angle. Original author gets attribution link. Full diff enforcement and voting deferred to v2.
- **Offline PWA:** Pre-cache next 20 skims. Service worker. Learn on the subway with zero connectivity.
- **"Best in Mode" badges:** Per-mode completion rate tracking surfaces which reading mode works best for each skim. Discovery mechanic that encourages mode exploration.

v1.1 theme: Skim Chains push learning forward (sequences), Quick Review pulls it backward (retention). Together they deepen Skim from a content feed into a learning system.

### v2 — Engagement & Community

| Feature | Description |
|---------|-------------|
| Skim Battles | Scheduled same-concept head-to-head events. Community votes on best explanation. Weekly tentpole moments. Distinct from Remix — Battles are platform-initiated events, Remix is user-initiated forking. |
| Full Remix | 50% text diff enforcement + community voting on preferred version. Builds on lightweight v1.1 Remix. |
| Mage Level (full) | Builds on v1.1 Quick Review + minimal Mage Level. AI-generated quiz questions for richer review beyond Hook-as-question. Optimized spaced repetition intervals (1, 3, 7, 30 days) tuned with v1.1 review data. Detailed review analytics (retention rate by Realm, weakest topics). Score never decreases — maintains anti-guilt philosophy from v1.1. |
| Favorite Creators | Lightweight one-directional bookmark for finding a creator's content again. Private list — no follower counts visible to others, no notifications to the followed creator. Accessible from creator profile pages. No separate "Following" feed tab — the quality-scored algorithmic feed remains the sole discovery surface. |
| Personalized Feed | "For You" tab with category affinity tracking. Weight followed Realms and tags higher. Explicitly NO "Following" tab — content quality (Got it! rate) remains the primary feed signal, not social connections. |
| Push Notifications | "Here's one thing you don't know yet:" daily digest with teaser. One per day max. |
| ORP Highlighting | Optimal Recognition Point highlighting in Speed Mode — slightly left of center on each word for faster recognition. Power user enhancement. |
| Granular Report Flags | Replace single "Report" with specific categories: Inaccurate, Confusing, Misleading. |
| AI Creation Coaching | Real-time suggestions while writing: "Add an analogy?" / "Simplify this sentence?" |

### v3 — Maturity

| Feature | Description |
|---------|-------------|
| Expert Endorsement | Verified accounts (teachers, professors, scientists) can endorse skims as accurate. Quality seal system. |
| Creator Streaks | Creation frequency rewards with quality gates to prevent spam. Requires mature quality signals before implementation. |
| Embeddable Skims | Bloggers, teachers, and journalists can embed a skim in articles. Each embed links back to Skim. |
| Email Digest | Weekly curated email with top skims across Realms. |

---

## Key Decisions Log

Decisions made during the brainstorm and the reasoning behind them:

| Decision | Rationale |
|----------|-----------|
| RSVP as default, not Classic | First impressions matter more than daily comfort. RSVP is the "wow" moment. Classic is always one tap away. |
| "Got it!" over Like as primary CTA | Measures learning, not entertainment. Drives content quality. Defines the brand. |
| 150 words, not 80 or 120 | Need room for Hook + Core with analogy + Snap on complex topics. Sweet-spot nudge guides toward brevity. |
| Creator-tagged difficulty, not NLP-only | Concept complexity differs from language complexity. Trust the creator with NLP as a suggestion. |
| No login wall | Every second before the first skim is a lost user. Auth is deferred, never gating. |
| Algorithmic Skim of the Day, not editorial | Scales without bottleneck. Min 50-view threshold prevents gaming. |
| Single Report button for MVP | Simpler UX. "Something's wrong" is sufficient signal. Granular categories add complexity without changing response (hide from feed). |
| Creator Streaks deferred, not rejected | The concept has merit with quality gates. Premature without mature quality signals. |
| Skim Chains before Skim Battles | Chains work with existing content and drive binge sessions. Battles need content volume to work well. |
| 4 reading modes, not 3 | RSVP, Subtitle, Teleprompter, and Classic sit on a clear speed-control spectrum. Follow Mode (highlight sweep) was cut — hardest to build, least distinctive UX. Subtitle and Teleprompter serve its territory better with more intuitive metaphors (movie subtitles, news teleprompter). Progressive disclosure prevents choice paralysis. |
| Follow system deferred, not adopted | A follow system changes Skim from "learning tool with social mechanics" to "social network with learning content" — an identity shift. The quality-based feed (Got it! rate) must remain the primary discovery surface. Follows create rich-get-richer dynamics and incentivize posting frequency over quality. Tag following already serves content-first discovery. Replaced with lightweight "Favorite Creators" bookmark in v2. |
| No dual feed tabs (For You + Following) | Dual feeds create decision fatigue at the entry point. A "Following" tab bypasses the quality filter, showing mediocre skims from followed creators above excellent skims from strangers. The algorithmic quality feed is the product's core differentiator. Cut from all versions. |
| Quick Review in v1.1, Mage Level in v2 | Split the knowledge scoring system: validate that users want retention mechanics (v1.1 Quick Review) before investing in gamification (v2 Mage Level). Hook-as-question leverages existing content structure at zero AI cost. |
| Score only goes up | Anti-guilt philosophy must extend to the review system. Losing XP for forgetting contradicts Skim's low-pressure vibe. +10 for remembering, +3 for forgetting-but-reviewing. Absence becomes opportunity (more reviews available = more XP available), not punishment. |
| Review as post-session prompt, not in-feed or separate tab | Three options were considered: interleaved in feed (feels like ads, breaks discovery flow), separate tab (dies in consumer apps — nobody taps it), pre-feed gate (adds friction, contradicts "no login wall" philosophy). Post-session prompt wins: after 5+ skims, when user naturally slows down, surface "Before you go — quick review of 3 things you learned this week?" Respects browse-first flow, catches users winding down, dismissible, max one prompt per session. |
