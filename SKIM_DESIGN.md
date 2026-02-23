# SKIM -- Design System

*Compiled 2026-02-19 by the skim-design team (brand-content, visual-designer, ux-interaction)*

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library](#5-component-library)
6. [Feed Layout](#6-feed-layout)
7. [Reading Mode Visuals](#7-reading-mode-visuals)
8. [Mode Picker](#8-mode-picker)
9. [Content Presentation](#9-content-presentation)
10. [Realm Visual Identity](#10-realm-visual-identity)
11. [Empty States & Onboarding](#11-empty-states--onboarding)
12. [Share Cards](#12-share-cards)
13. [Animations & Transitions](#13-animations--transitions)
14. [Responsive & Mobile-First](#14-responsive--mobile-first)
15. [Accessibility](#15-accessibility)
16. [Tailwind Configuration](#16-tailwind-configuration)
17. [Navigation](#17-navigation)
18. [Content Creation Flow](#18-content-creation-flow)
19. [UI Copy & Brand Voice Reference](#19-ui-copy--brand-voice-reference)
20. [Gesture Map & Interaction Patterns](#20-gesture-map--interaction-patterns)
21. [Edge Cases](#21-edge-cases)

---

## 1. Brand Identity

### 1.1 Brand Emotion: "Quiet Confidence"

Skim evokes the feeling of: **"I just got smarter in 30 seconds."**

Not anxious urgency (Duolingo). Not corporate productivity (Blinkist). Not gamified chaos (Quizlet). Skim is **calm mastery** -- the feeling after a great conversation where someone explained something perfectly.

**Three emotional pillars:**
- **Curiosity** -- the hook that pulls you in ("Wait, really?")
- **Clarity** -- the core that makes it click ("Oh, THAT'S how it works")
- **Confidence** -- the snap that makes you feel smarter ("Now I know that forever")

### 1.2 Logo

**Wordmark-first, no symbol for MVP.**

- All lowercase: **skim**
- Custom sans-serif with one distinguishing detail: the crossbar of the "k" is angled sharply upward-right, suggesting forward motion / skimming across a surface
- Letter-spacing: -0.02em (slightly tight for cohesion)
- Weight: Medium (500)
- The dot on the "i" is standard (only replace with accent mark if it reads cleanly at 16px)

**Lockup for share cards / social:** Wordmark with a subtle trailing speed-line after the "m", like a stone skipping across water.

**Why no symbol:** At launch Skim is a website, not a native app. The wordmark IS the brand. A symbol can come in v2 when there is an app to icon-ify.

### 1.3 Brand Voice

**A brilliant friend who happens to be a great teacher.** Confident but never condescending. Slightly playful but never silly. Direct but never cold.

| Context | Do Not Write | Write Instead |
|---------|-------------|---------------|
| Empty search | "No results found." | "Nothing here yet. Want to create this skim?" |
| After "Got it!" | "Response recorded." | "Nice. That one sticks." |
| Streak discovered | "You have a 3-day streak!" | "3 days in a row. You're on a roll." |
| Mode unlock | "New feature available: Subtitle Mode" | "Ready for something new? Try reading in phrases." |
| AI generation | "AI is generating content." | "Writing you a skim... one sec." |
| Word limit hit | "Error: exceeds 150 words." | "Too long -- a good skim fits in 150 words. What can you cut?" |
| Report submitted | "Report submitted successfully." | "Thanks. We'll take a look." |
| Bookmark saved | "Bookmarked." | "Saved for later." |
| Error state | "An error occurred. Please try again." | "Something broke. Try again?" |
| First "Got it!" | (nothing) | "Your first Got it! That's what it's all about." |

**Voice rules:**
- Never use exclamation marks in error states
- Periods for statements, question marks only for genuine choices
- Contractions always ("you're" not "you are")
- Maximum 12 words per UI string
- No emoji in UI text -- typography is the personality

### 1.4 Competitive Visual Positioning

| Competitor | Their Look | Skim's Difference |
|------------|-----------|-------------------|
| Blinkist | Warm, rounded, illustration-heavy | Cold precision. No illustrations. Text IS the content. |
| Duolingo | Bright, cartoonish, gamified | Mature, monochrome, zero cartoon elements. |
| Quizlet | Blue/white, utilitarian | Darker, more editorial. Magazine, not flashcard app. |
| TikTok | Chaotic, neon, attention-grabbing | Controlled, deliberate, attention-FOCUSING. |

**One sentence:** "A premium magazine and a speed-reading app had a baby, and it grew up on dark mode."

---

## 2. Color System

### 2.1 Strategy: Dark Mode Primary

Dark is the default. Reasons:
1. RSVP (default mode) is dramatically better on dark -- a single word glowing against darkness is meditative
2. ElevenLabs-inspired premium tech aesthetic
3. Screen recordings for sharing look better on dark backgrounds
4. Subtitle mode is inherently a dark-background experience (cinema subtitles)

Light mode is available via toggle. Not hidden, not second-class.

### 2.2 Dark Mode Palette (Primary)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-primary` | `#0A0A0A` | `bg-skim-bg` | App background, skim card background |
| `bg-elevated` | `#141414` | `bg-skim-elevated` | Bottom sheets, modals, mode picker |
| `bg-subtle` | `#1A1A1A` | `bg-skim-subtle` | Input fields, hover states |
| `text-primary` | `#F5F5F5` | `text-skim-primary` | Headlines, Hook text, interactive elements |
| `text-secondary` | `#A0A0A0` | `text-skim-secondary` | Core text, descriptions, metadata |
| `text-tertiary` | `#666666` | `text-skim-tertiary` | Timestamps, disabled states, placeholders |
| `accent` | `#6C8EEF` | `text-skim-accent` | Key terms, Snap text, primary actions ("Skim Blue") |
| `accent-hover` | `#8BA4F5` | `text-skim-accent-hover` | Hover/press states |
| `accent-muted` | `rgba(108,142,239,0.10)` | `bg-skim-accent/10` | Accent background tints for tags, pills |
| `accent-glow` | `rgba(108,142,239,0.20)` | `bg-skim-accent/20` | Subtle glow effects on Snap flourish |
| `border` | `#1E1E1E` | `border-skim` | Dividers, card borders (barely visible) |
| `error` | `#FF4444` | `text-skim-error` | Error states only |
| `success` | `#44FF88` | `text-skim-success` | Success states, "Got it!" confirmation flash |

**The accent is "Skim Blue" (#6C8EEF).** A calm, intellectual blue -- not Twitter-aggressive, not ElevenLabs-cold. Think "confident wisdom." It appears only on the Snap line, key terms, and primary actions. Everything else is monochrome. On the dark background, the blue provides clean contrast against the warm off-white text (#F5F5F7) at RSVP speed, where luminance distinction matters most. The Snap flourish uses a blue-to-violet gradient (#6C8EEF to #A78BFA) for a distinctive brand moment.

### 2.3 Light Mode Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-primary` | `#FAFAFA` | `bg-skim-bg` | App background |
| `bg-elevated` | `#FFFFFF` | `bg-skim-elevated` | Cards, bottom sheets |
| `bg-subtle` | `#F0F0F0` | `bg-skim-subtle` | Input fields, hover states |
| `text-primary` | `#111111` | `text-skim-primary` | Headlines, Hook text |
| `text-secondary` | `#555555` | `text-skim-secondary` | Core text |
| `text-tertiary` | `#999999` | `text-skim-tertiary` | Metadata |
| `accent` | `#5A7DE0` | `text-skim-accent` | Key terms, Snap (slightly darkened for light-bg contrast) |
| `accent-hover` | `#4A6BD0` | `text-skim-accent-hover` | Hover/press states |
| `accent-muted` | `rgba(90,125,224,0.10)` | `bg-skim-accent/10` | Accent background tints |
| `border` | `#E5E5E5` | `border-skim` | Dividers |

### 2.4 Dark/Light Mode Toggle

Switching between dark and light mode uses a 300ms crossfade on all CSS custom properties. This prevents a jarring flash while being fast enough to feel instant.

```css
:root {
  transition: background-color 300ms ease-in-out,
              color 300ms ease-in-out;
}
```

All `var(--skim-*)` properties transition simultaneously. The crossfade applies to the body background and all text/border colors that reference the CSS variables.

### 2.5 Semantic Colors (Both Modes)

| Semantic Token | Dark Mode | Light Mode | Usage |
|----------------|-----------|------------|-------|
| `word-count-green` | `#34C759` | `#28A745` | 60-100 words: "Tight and punchy" |
| `word-count-yellow` | `#FFD60A` | `#D4A017` | 130-150 words: "Consider trimming" |
| `word-count-red` | `#FF453A` | `#DC3545` | 150+ words: hard stop |

---

## 3. Typography

### 3.1 Font Stack

**Primary:** Inter (variable font)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Why Inter: designed for screens, excellent at all sizes (11px metadata to 48px RSVP), variable font support for smooth weight transitions, free, fast to load.

**Wordmark only:** Custom or lightly modified Inter with angled "k" crossbar. Keeps brand and UI typographically harmonious.

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Tailwind |
|-------|------|--------|-------------|----------------|----------|
| `rsvp-word` | 48px | 600 | 1.0 | 0.01em | `text-5xl font-semibold leading-none tracking-wide` |
| `subtitle-phrase` | 22px | 400 | 1.3 | 0 | `text-[22px] font-normal leading-tight` |
| `teleprompter-text` | 20px | 400 | 1.7 | 0 | `text-xl font-normal leading-relaxed` |
| `hook` | 22px | 600 | 1.35 | 0 | `text-[22px] font-semibold leading-snug` |
| `snap` | 19px | 600 | 1.4 | 0 | `text-[19px] font-semibold leading-snug` |
| `core` | 17px | 400 | 1.6 | 0 | `text-[17px] font-normal leading-relaxed` |
| `body` | 15px | 400 | 1.5 | 0 | `text-[15px] font-normal leading-normal` |
| `metadata` | 13px | 400 | 1.4 | 0 | `text-[13px] font-normal` |
| `badge` | 12px | 500 | 1.0 | 0.05em | `text-xs font-medium tracking-wider` |
| `caption` | 11px | 400 | 1.3 | 0 | `text-[11px] font-normal` |

### 3.3 RSVP Word -- The Most Important Typographic Element

- 48px, weight 600 (semibold -- compensates for light-on-dark optical thinning)
- Centered horizontally, offset ~5% above vertical center (natural eye-rest position)
- Fixed-width container to prevent lateral jitter between short and long words
- Key terms render in accent color instead of primary text color
- Letter-spacing: 0.01em (slightly open for speed readability)
- **Long word handling:** Words longer than 10 characters dynamically scale down from 48px to a minimum of 36px using `clamp()`. This prevents overflow on 375px viewports while maintaining readability. Formula: `font-size: clamp(36px, calc(48px - (charCount - 10) * 2px), 48px)`.

```tsx
// Container: fixed width, flex-center, slight upward offset
<div className="fixed inset-0 flex items-center justify-center -translate-y-[5vh]">
  <span className={cn(
    "text-5xl font-semibold leading-none tracking-wide",
    "w-[80vw] text-center",
    isKey ? "text-skim-accent" : "text-skim-primary"
  )}>
    {word}
  </span>
</div>
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: 4px. All spacing is a multiple of 4.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `xs` | 4px | `p-1`, `gap-1` | Tight padding (inside badges) |
| `sm` | 8px | `p-2`, `gap-2` | Hook-to-Core gap, between inline elements |
| `md` | 12px | `p-3`, `gap-3` | Card internal padding |
| `lg` | 16px | `p-4`, `gap-4` | Core-to-Snap gap, section spacing, standard component padding |
| `xl` | 24px | `p-6`, `gap-6` | Between major sections |
| `2xl` | 32px | `p-8`, `gap-8` | Large section gaps |
| `3xl` | 48px | `p-12`, `gap-12` | Share card padding, major whitespace |
| `4xl` | 64px | `p-16`, `gap-16` | Viewport-level spacing |

### 4.2 Layout Principles

- **Mobile-first:** Design at 375px width, scale up
- **Full viewport:** Skims occupy 100vh (with snap-scroll)
- **Content-centered:** Text content maxes out at 600px wide even on desktop
- **Generous whitespace:** The whitespace IS the premium feel -- never fill space just because it's empty
- **Safe areas:** Respect notch, home indicator, status bar on all mobile devices

### 4.3 Grid

No formal grid. Content is centered with max-width constraints:

```
Mobile (375px):   px-5 (20px side padding)
Tablet (768px):   px-8 (32px side padding), max-w-[600px] mx-auto
Desktop (1024px+): max-w-[600px] mx-auto (content stays narrow, app frame expands)
```

---

## 5. Component Library

### 5.1 "Got it!" Button (Primary Action)

The most important interactive element in Skim.

**Resting state:**
```tsx
<button className={cn(
  "px-8 py-3 rounded-full",
  "text-skim-accent font-semibold text-[17px]",
  "border border-skim-accent/30",
  "bg-transparent",
  "transition-all duration-150",
  "active:scale-95"
)}>
  Got it!
</button>
```

**Interaction sequence:**
1. Tap: scale-down to 0.95 (150ms)
2. Fill: background floods with accent color (200ms ease-out)
3. Text inverts to `bg-primary` color
4. Hold for 600ms
5. Text + background fade to muted confirmed state (text in accent/40, bg in accent/10)
6. Button shows "Got it!" in muted state permanently for that skim

"Got it!" text stays visible at all times -- no checkmark, no icon swap. The text IS the brand. Every tap reinforces it.

**Spring animation:** The fill animation uses Framer Motion spring physics: `{ type: "spring", stiffness: 400, damping: 30 }`. This gives the fill a snappy, physical quality -- fast in, gentle settle -- that feels like pressing a real button.

**During playback (RSVP, Subtitle, Teleprompter):**
- Button reduces to 60% opacity (`opacity-60`) and is non-interactive while a reading mode is actively playing
- On pause or skim completion, button returns to full opacity and becomes tappable
- This prevents accidental taps during RSVP speed-reading and signals "finish reading first"

**Post-tap (confirmed):**
```tsx
<button className="px-8 py-3 rounded-full bg-skim-accent/10 text-skim-accent/40" disabled>
  Got it!
</button>
```

### 5.2 Bookmark Button (Secondary Action)

```tsx
<button className={cn(
  "p-2 rounded-lg",
  "text-skim-tertiary",
  "hover:text-skim-secondary hover:bg-skim-subtle",
  "transition-colors duration-150"
)}>
  <BookmarkIcon className="w-5 h-5" />
</button>
```

Active (bookmarked): `text-skim-accent` with filled icon.

**Bookmark toggle animation:**
- Tap: spring scale 0.85 -> 1.0 (`{ type: "spring", stiffness: 400, damping: 15 }`)
- Simultaneously: outline icon cross-fades to filled icon (150ms)
- Unbookmark: reverse -- filled to outline with same spring, no scale-down
- Haptic: light impact on bookmark, none on unbookmark

### 5.3 Overflow Menu ("..." Button)

```tsx
<button className="p-2 rounded-lg text-skim-tertiary hover:text-skim-secondary">
  <EllipsisHorizontalIcon className="w-5 h-5" />
</button>
```

Opens bottom sheet with actions separated by role:

```tsx
<BottomSheet>
  <div className="flex flex-col">
    {/* Engagement actions */}
    <SheetRow icon={HeartIcon} label="Like" />
    <SheetRow icon={ShareIcon} label="Share" />
    <SheetRow icon={LinkIcon} label="Copy link" />

    {/* Divider */}
    <div className="h-px bg-skim-border my-2" />

    {/* Moderation */}
    <SheetRow icon={FlagIcon} label="Report" className="text-skim-tertiary" />
  </div>
</BottomSheet>
```

Each row: 48px height, `px-4`, icon 20x20 left-aligned, label 15px text-skim-primary, full-width tap target. Report row uses tertiary text to de-emphasize.

### 5.4 Pill Badge (Realm / AI-Assisted / Tag)

**Realm badge:**
```tsx
<span className={cn(
  "inline-flex items-center",
  "px-2.5 py-0.5 rounded-full",
  "text-xs font-medium tracking-wider uppercase",
  // Color set dynamically per Realm (see Section 10)
  `text-realm-${realm}`,
  `bg-realm-${realm}/12`
)}>
  {realmName}
</span>
```

**AI-assisted badge:**
```tsx
<span className={cn(
  "inline-flex items-center gap-1",
  "px-2 py-0.5 rounded-full",
  "text-[11px] font-normal",
  "text-skim-tertiary bg-skim-subtle"
)}>
  <SparkleIcon className="w-3 h-3" />
  AI-assisted
</span>
```

**Tag badge:**
```tsx
<span className={cn(
  "inline-flex items-center",
  "px-2 py-0.5 rounded-full",
  "text-xs font-normal",
  "text-skim-secondary bg-skim-subtle",
  "hover:bg-skim-subtle/80 cursor-pointer"
)}>
  #{tagName}
</span>
```

### 5.5 Difficulty Dots

```tsx
<div className="flex items-center gap-1">
  {[1, 2, 3].map(dot => (
    <span
      key={dot}
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        dot <= difficulty
          ? "bg-skim-primary"
          : "border border-skim-primary/30"
      )}
    />
  ))}
</div>
```

- 6px diameter (w-1.5 h-1.5)
- 4px gap (gap-1)
- Filled: primary text color
- Unfilled: border only, 30% opacity
- Tooltip on long-press shows descriptive text

### 5.6 WPM Slider

Vertical slider on the right edge of the screen:

```tsx
<div className={cn(
  "fixed right-3 top-1/2 -translate-y-1/2",
  "flex flex-col items-center gap-2",
  "opacity-40 hover:opacity-100 focus-within:opacity-100",
  "transition-opacity duration-300"
)}>
  <span className="text-[11px] text-skim-tertiary font-medium">{wpm}</span>
  <input
    type="range"
    min={150} max={600} step={10}
    orient="vertical"
    className="h-32 w-1 appearance-none bg-skim-subtle rounded-full"
  />
</div>
```

- Thin track (4px), small circular thumb (16px)
- Current WPM label above thumb
- Semi-transparent when idle (opacity-40), full on touch
- Range: 150-600 WPM, tick marks at 150, 300, 450, 600
- Only visible in active modes (RSVP, Subtitle, Teleprompter), hidden in Classic

### 5.7 Progress Bar

```tsx
<div className="fixed bottom-0 left-0 right-0 h-[3px] bg-transparent z-50">
  <div
    className="h-full bg-skim-accent transition-[width] duration-100 ease-linear"
    style={{ width: `${progress}%` }}
  />
</div>
```

- 3px height (`h-[3px]`)
- Accent color at full opacity
- Fixed to absolute bottom of viewport
- Fills left to right as skim progresses
- In Teleprompter mode: doubles as scroll position indicator

**Scrub interaction:**
- Long-press (200ms) on progress bar expands hit area to 24px height
- Drag horizontally to scrub through skim content
- While scrubbing: tooltip appears above thumb showing section label ("Hook", "Core", "Snap") and progress percentage
- Tooltip: `px-2 py-1 rounded bg-skim-elevated text-[11px] text-skim-secondary`, positioned 8px above bar
- Release: skim resumes from scrubbed position (RSVP restarts at nearest word boundary, Teleprompter jumps to scroll position)
- In Classic mode: progress bar is static (shows read-time estimate), no scrub

### 5.8 Creator Attribution

```tsx
<div className="flex items-center gap-1.5 text-[13px] text-skim-tertiary">
  <span>by</span>
  <button className="text-skim-secondary hover:text-skim-primary transition-colors">
    {username}
  </button>
  <span>&middot;</span>
  <span>{relativeTime}</span>
</div>
```

- No avatar in the feed -- content first, social second
- Avatars appear only on creator profile pages
- Tapping username navigates to creator profile
- Timestamps are relative ("2h ago", "3d ago")

### 5.9 Text Input Fields

```tsx
<input className={cn(
  "w-full px-4 py-3 rounded-lg",
  "bg-skim-subtle border border-skim/50",
  "text-skim-primary text-[15px]",
  "placeholder:text-skim-tertiary",
  "focus:outline-none focus:border-skim-accent/50 focus:ring-1 focus:ring-skim-accent/20",
  "transition-colors duration-150"
)} />
```

### 5.10 Bottom Sheet (Generic)

```tsx
<div className={cn(
  "fixed inset-x-0 bottom-0 z-50",
  "bg-skim-elevated rounded-t-2xl",
  "border-t border-skim",
  "px-5 pb-safe pt-4",
  "shadow-2xl shadow-black/30"
)}>
  {/* Drag handle */}
  <div className="w-8 h-1 rounded-full bg-skim-tertiary/30 mx-auto mb-4" />
  {children}
</div>
```

- Rounded top corners (16px radius)
- Elevated background
- Drag handle: 32px wide, 4px tall, centered
- Bottom safe area padding (`pb-safe` via Tailwind plugin or manual `env(safe-area-inset-bottom)`)
- Backdrop: semi-transparent black overlay on content behind

---

## 6. Feed Layout

### 6.1 Full-Screen Vertical Snap-Scroll

```tsx
<main className={cn(
  "h-screen w-screen overflow-y-scroll",
  "snap-y snap-mandatory",
  "scroll-smooth"
)}>
  {skims.map(skim => (
    <article
      key={skim.id}
      className={cn(
        "h-screen w-screen",
        "snap-start snap-always",
        "flex flex-col",
        "bg-skim-bg"
      )}
    >
      <SkimContent skim={skim} />
    </article>
  ))}
</main>
```

- One skim per screen (100vh)
- `scroll-snap-type: y mandatory`
- Swipe up = next, swipe down = previous
- Each skim is a full-viewport flex column

**Feed pre-loading:**
- Render current skim + 1 ahead + 1 behind (3-skim window)
- Pre-tokenize the next skim's RSVP word list while current skim is playing
- Skims outside the 3-skim window are unmounted to conserve memory
- On fast-scroll (flick past multiple skims), skip intermediate renders -- only mount the landing skim
- Infinite scroll: fetch next batch of 10 skims when user reaches skim N-3 of current batch

### 6.2 Skim Screen Layout

```
+------------------------------------------+  <- 100vh
|  [safe-area-top]                          |
|                                           |
|  [Realm badge]              [Difficulty]  |  <- Top bar (fixed)
|                                           |
|                                           |
|              [Hook text]                  |  <- ~35% from top
|              [8px gap]                    |
|              [Core text]                  |  <- Center zone
|              [16px gap]                   |
|              [Snap text]                  |
|                                           |
|  [by username  ·  2h ago]                 |  <- Attribution
|                                           |
|                                           |
|  [Mode] [Got it!] [Bookmark] [...]        |  <- Bottom bar (fixed)
|                                           |
|  [====progress bar===============]        |  <- 3px, very bottom
|  [safe-area-bottom]                       |
+------------------------------------------+
```

**Top bar:**
- Fixed position, transparent background
- Left: Realm badge
- Right: Difficulty dots + read time estimate (e.g., "~20s")
- Padding: `px-5 pt-safe`

**Content zone:**
- Flex-grow, centered vertically with slight upward bias
- Max-width: 600px, centered
- Side padding: 20px mobile, 32px tablet+

**Bottom bar:**
- Fixed position, transparent background (gradient fade from transparent to bg-primary)
- Layout: `flex items-center justify-between px-5 pb-safe`
- Left: Mode picker icon
- Center: "Got it!" button (largest element)
- Right: Bookmark icon + overflow menu

### 6.3 Daily Pick / Skim of the Day

The first item in the feed when applicable. Visual distinction:

```tsx
<div className="relative">
  {/* Subtle accent border glow */}
  <div className="absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-skim-accent/40 to-transparent" />
  <span className="text-[11px] font-medium tracking-wider uppercase text-skim-accent">
    Skim of the Day
  </span>
</div>
```

- Small "Skim of the Day" label in accent color, uppercase
- Thin gradient accent line above
- Everything else is identical to a normal skim -- the content speaks for itself

### 6.4 Feed Tabs

```tsx
<div className="flex items-center gap-6 px-5 py-3 border-b border-skim">
  <button className={cn(
    "text-[15px] font-medium pb-2",
    isActive ? "text-skim-primary border-b-2 border-skim-accent" : "text-skim-tertiary"
  )}>
    Trending
  </button>
  {/* Tag-filtered tabs appear dynamically */}
</div>
```

- "Trending" is the default tab
- Tag-filtered views appear as additional tabs when a tag is tapped
- Active tab: primary text + accent bottom border (2px)
- Inactive: tertiary text, no border

---

## 7. Reading Mode Visuals

### 7.1 Speed Mode (RSVP) -- Default

The signature Skim experience. A single word appears center-screen against darkness.

**Layout:**
```
+------------------------------------------+
|                                           |
|                                           |
|                                           |
|                                           |
|            [single word]                  |  <- Centered, -5vh offset
|                                           |
|                                           |
|                                           |
|                    [WPM slider right edge] |
|  [====progress bar===============]        |
+------------------------------------------+
```

**Visual spec:**
- Background: pure `bg-primary` (#0A0A0A in dark). Nothing else on screen.
- Word: 48px, font-semibold, text-primary. Key terms in accent color.
- Fixed-width container prevents lateral jitter
- WPM slider on right edge (semi-transparent until touched)
- Progress bar at bottom (3px)
- Tap anywhere = pause/resume. On pause: word freezes, slight dim (opacity 0.7)

**The Snap Flourish (RSVP):**
When the Snap section begins, words render in accent color (#6C8EEF) at weight 600 (semibold). The final word of the Snap triggers:
- Color shifts from Skim Blue (#6C8EEF) to soft violet (#A78BFA) over 300ms
- Simultaneously scales from 1.0 to 1.05 over 300ms
- Hold at 1.05 / violet for 500ms
- Ease back to 1.0 / blue over 200ms
- Two effects only (scale + color shift). No glow pulse. Restraint IS the premium.

**Section transition pauses (RSVP):**
- **Hook -> Core boundary:** 200ms pause (brief breath before settling in)
- **Core -> Snap boundary:** 400ms pause (builds anticipation before the payoff)
- **After final Snap word:** Hold flourish for 500ms, then skim marks as complete
- These pauses are in addition to normal punctuation pauses (1.5x for periods, 1.25x for commas)

### 7.2 Subtitle Mode

Phrases appear at the bottom of the screen like movie subtitles.

**Layout:**
```
+------------------------------------------+
|                                           |
|  [Realm badge]       [Skim title (muted)] |
|                                           |
|                                           |
|                                           |  <- Calm negative space
|                                           |
|                                           |
|                                           |
|                                           |
|      [phrase appears here]                |  <- Bottom third
|                    [WPM slider right edge] |
|  [====progress bar===============]        |
+------------------------------------------+
```

**Visual spec:**
- Background: `bg-primary`. Upper 2/3 of screen is empty (or shows Realm badge + skim title in very muted text).
- Phrases: 22px, font-normal, centered in the bottom third of the viewport
- Key terms within phrases: accent color
- Fade-in/fade-out transitions: 150ms ease-in for appear, 100ms ease-out for disappear (Framer Motion)
- Mobile safe areas respected -- subtitle area sits above home indicator

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={phraseIndex}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
    className="fixed bottom-[15vh] inset-x-0 text-center px-8"
  >
    <span className="text-[22px] leading-tight text-skim-primary">
      {renderPhraseWithKeyTerms(phrase)}
    </span>
  </motion.div>
</AnimatePresence>
```

**The Snap Flourish (Subtitle):**
Snap phrases appear in accent color, semibold. Final phrase gets the scale-up flourish.

**Section transition pauses (Subtitle):**
- **Core -> Snap boundary:** 400ms blank screen (no phrase displayed) before Snap phrases begin
- This creates the same anticipation beat as RSVP's pause, adapted for phrase-based display

**Light mode note:** In light mode, Subtitle phrases still render on the full `bg-primary` (#FAFAFA). The cinematic quality is slightly reduced but acceptable. No dark strip in light mode -- that would feel inconsistent.

### 7.3 Teleprompter Mode

Full text scrolls upward continuously.

**Layout:**
```
+------------------------------------------+
|  [gradient fade: transparent to bg]       |  <- Top mask
|                                           |
|  [...scrolling text above focal zone...]  |
|                                           |
|  [ === focal zone === ]                   |  <- Center, most legible
|                                           |
|  [...scrolling text below focal zone...]  |
|                                           |
|  [gradient fade: transparent to bg]       |  <- Bottom mask
|                    [WPM slider right edge] |
|  [====progress bar===============]        |
+------------------------------------------+
```

**Visual spec:**
- Full skim text rendered in a scrolling container
- Text: 20px, font-normal, 1.7 line-height (generous for readability)
- Scroll direction: upward at constant speed derived from WPM
- Gradient masks: top and bottom edges fade text to bg-primary via `mask-image`
- Center zone (~40% of viewport height) is fully opaque -- the natural focal point
- Key terms: accent color inline
- Hook/Core/Snap sections: subtle speed deceleration at boundaries (CSS easing)

```tsx
<div className={cn(
  "fixed inset-0 overflow-hidden",
  "px-5 flex items-center justify-center"
)}>
  <div
    className="max-w-[600px] w-full"
    style={{
      maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
    }}
  >
    <motion.div
      animate={{ y: scrollTarget }}
      transition={{ duration: scrollDuration, ease: "linear" }}
      className="text-xl leading-relaxed text-skim-secondary"
    >
      {renderSkimWithSections(skim)}
    </motion.div>
  </div>
</div>
```

**The Snap Flourish (Teleprompter):**
As the Snap line enters the focal zone, scroll decelerates to 60% speed over 600ms (ease-in-out). Snap text renders in accent color, semibold. No hard pause -- the deceleration itself creates the dramatic emphasis. Skim marks as complete when the Snap line reaches the top of the focal zone.

### 7.4 Classic Mode

Static, beautifully typeset card. Self-paced reading.

**Layout:**
```
+------------------------------------------+
|  [Realm badge]     [Difficulty] [~20s]    |
|                                           |
|                                           |
|  [Hook text -- 22px, semibold]            |
|                                           |
|  [Core text -- 17px, regular, muted]      |
|  [Key terms in accent color]              |
|                                           |
|  [Snap text -- 19px, semibold, accent]    |
|                                           |
|  [by username  ·  2h ago]                 |
|  [tags: #quantum  #physics]               |
|                                           |
|  [Mode] [Got it!] [Bookmark] [...]        |
|  [====progress bar===============]        |
+------------------------------------------+
```

**Visual spec:**
- No animation. No timer. Pure typography.
- Hook: 22px/600/text-primary
- Core: 17px/400/text-secondary. Key terms in accent color (not bold).
- Snap: 19px/600/accent
- 8px gap between Hook and Core
- 16px gap between Core and Snap
- Read time estimate: displayed near difficulty dots ("~20s")
- Tags: displayed below attribution as small pill badges
- Content vertically centered with slight upward bias

---

## 8. Mode Picker

### 8.1 Bottom Sheet Design

Triggered by a reading-mode icon (four horizontal lines of decreasing length) in the bottom toolbar.

```tsx
<BottomSheet>
  <h3 className="text-[15px] font-semibold text-skim-primary mb-4">
    Reading Mode
  </h3>

  <div className="flex items-start justify-between gap-2">
    {modes.map(mode => (
      <button
        key={mode.id}
        disabled={mode.locked}
        className={cn(
          "flex-1 flex flex-col items-center gap-2 py-3 rounded-lg",
          "transition-colors duration-150",
          mode.active && "bg-skim-subtle",
          mode.locked && "opacity-30"
        )}
      >
        <mode.Icon className={cn(
          "w-6 h-6",
          mode.active ? "text-skim-accent" : "text-skim-secondary"
        )} />
        <span className={cn(
          "text-[13px] font-medium",
          mode.active ? "text-skim-primary" : "text-skim-secondary"
        )}>
          {mode.name}
        </span>
        {mode.active && (
          <div className="w-6 h-0.5 rounded-full bg-skim-accent" />
        )}
        {mode.locked && (
          <LockIcon className="w-3 h-3 text-skim-tertiary" />
        )}
      </button>
    ))}
  </div>

  {/* Speed spectrum labels */}
  <div className="flex justify-between mt-2 px-2">
    <span className="text-[11px] text-skim-tertiary">fastest</span>
    <span className="text-[11px] text-skim-tertiary">self-paced</span>
  </div>
</BottomSheet>
```

**Modes left to right:** RSVP | Subtitle | Teleprompter | Classic

**Behavior:**
- One-tap to switch. New mode activates immediately.
- Sheet auto-dismisses 200ms after selection
- Locked modes: grayed out, tap shows unlock hint text ("Read 5 more skims to unlock")
- Selected mode: accent-colored icon + accent underline bar
- Current skim resumes at the same progress point after mode switch (300ms crossfade)

### 8.2 Mode Icons

Simple, monoline, 24x24:
- **RSVP:** Single vertical line (representing one word at a time)
- **Subtitle:** Two short horizontal lines at bottom (representing subtitle phrases)
- **Teleprompter:** Three horizontal lines with downward arrow (representing scrolling text)
- **Classic:** Paragraph icon (small rectangle with lines)

### 8.3 Mid-Skim Mode Switching

Users can switch modes during active playback. The system maps progress between modes:

**Progress mapping:**
- RSVP tracks progress by word index (e.g., word 45 of 120 = 37.5%)
- Subtitle tracks by phrase index mapped to the same word range
- Teleprompter tracks by scroll position mapped to word percentage
- Classic has no progress -- it's static

**Switch behavior:**
- Current mode pauses immediately
- 300ms crossfade transition to new mode
- New mode resumes at the equivalent progress point:
  - RSVP -> Subtitle: find the phrase containing the current word, start from that phrase
  - RSVP -> Teleprompter: scroll to the paragraph containing the current word
  - Any -> Classic: show full skim, scroll position set to current section (Hook/Core/Snap)
  - Classic -> Any animated mode: start from beginning of the section the user was viewing
- If switching during Snap flourish: flourish is cancelled, new mode begins at the Snap section

**Mode memory:**
- The user's chosen mode persists across skims (stored in local state)
- Swiping to a new skim starts in the user's preferred mode
- Mode choice is saved to user profile on authenticated sessions

---

## 9. Content Presentation

### 9.1 Hook / Core / Snap -- The Visual Rhythm

The three-part structure must feel like three acts, not three paragraphs:

```
LOUD (Hook)  ->  settle in (Core)  ->  REMEMBER THIS (Snap)
```

The dip in visual intensity for the Core creates a "valley" that makes the Snap feel like a peak.

**Hook:**
- No section label. Position (top) IS the label.
- 22px, weight 600, full opacity text-primary
- If it's a question, the question mark should feel like an invitation

**Core:**
- 8px below Hook
- 17px, weight 400, text-secondary (muted, ~0.85 visual intensity)
- Key terms: accent color, same weight (don't bold -- creates visual noise in 100 words)
- This is the "reading zone" -- comfortable, not shouting

**Snap:**
- 16px below Core (slightly more gap -- signals conclusion)
- 19px, weight 600, accent color
- In animated modes: gets the flourish (scale 1.0 -> 1.05 over 300ms)

### 9.2 Key Term Highlighting

Key terms (`isKey: true` in token data) stand out without breaking reading flow:

- **Style:** Accent color text only. No background highlight, no underline, no bold change.
- **Subtlety principle:** If reading at speed you barely notice; if you slow down they pop.
- **RSVP:** Single word in accent color against the void. Maximum drama.
- **Subtitle:** Accent-colored words within phrase chunk.
- **Teleprompter:** Inline accent color as text scrolls.
- **Classic:** Inline accent color. No other treatment.

### 9.3 Word Count Indicator (Creation Flow)

In the skim builder, a live word count indicator:

```tsx
<div className="flex items-center gap-2">
  <span className={cn(
    "text-[13px] font-medium",
    wordCount <= 100 && "text-skim-success",
    wordCount > 100 && wordCount <= 130 && "text-skim-secondary",
    wordCount > 130 && wordCount <= 150 && "text-yellow-400",
    wordCount > 150 && "text-skim-error"
  )}>
    {wordCount}/150
  </span>
  {wordCount <= 100 && <span className="text-[11px] text-skim-tertiary">Tight and punchy</span>}
  {wordCount > 130 && wordCount <= 150 && <span className="text-[11px] text-yellow-400">Consider trimming</span>}
  {wordCount > 150 && <span className="text-[11px] text-skim-error">Too long</span>}
</div>
```

---

## 10. Realm Visual Identity

### 10.1 Realm Colors

Each Realm has one signature color used sparingly: badge pill, browse screen header, optional 2-3% bg tint on skim cards.

| Realm | Hex | Tailwind Approx. | Rationale |
|-------|-----|-------------------|-----------|
| Universe | `#4A6CF7` | custom blue-violet | Cosmic, abstract, space (deeper than Snap flourish violet to avoid conflict) |
| Life | `#34D399` | `emerald-400` | Biology, growth, nature |
| Numbers | `#AF52DE` | custom purple | Mathematical, abstract, non-literal |
| Past | `#D4A574` | custom sandstone | Antique, historical, warm |
| Mind | `#FB7185` | `rose-400` | Psychology, emotion |
| Earth | `#2DD4BF` | `teal-400` | Ocean, geological, mineral |
| Code | `#22D3EE` | `cyan-400` | Terminal, digital, electric |
| Society | `#FF9F0A` | custom amber | Civic, institutional, energy |
| Body | `#FF453A` | custom red | Health, vitality, blood |
| Art | `#E879F9` | `fuchsia-400` | Creative, expressive, rich |

**Selection criteria:** Tailwind 400-weight range as baseline, with custom overrides where thematic fit or dark-mode distinction demanded it. Universe uses a deeper blue-violet to avoid clashing with the Snap flourish gradient (#A78BFA). Numbers is purple (math = abstract). Society is amber (civic energy). Body is red (vitality/blood). All tested for dark-mode vibrancy and cross-Realm distinction at badge size. On light mode, shift to 500-weight variants for contrast.

### 10.2 Realm Badge in Feed

```tsx
// Dark mode
<span className="text-realm-universe bg-realm-universe/12 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wider uppercase">
  Universe
</span>

// Light mode: text darkened 10% for contrast
<span className="text-realm-universe/90 bg-realm-universe/8 ...">
  Universe
</span>
```

### 10.3 Realm Browse Screen

```
+------------------------------------------+
| [back arrow]                              |
|                                           |
|  UNIVERSE                                 |  <- 28px, weight 700, Realm color
|  physics  ·  astronomy                    |  <- 14px, text-secondary
|  [thin horizontal line in Realm color]    |  <- 2px accent separator
|                                           |
|  [Skim cards filtered to this Realm]      |
+------------------------------------------+
```

### 10.4 "Surprise Me" Button

```tsx
<button className={cn(
  "relative px-6 py-3 rounded-full",
  "bg-transparent",
  "text-skim-primary font-medium text-[15px]",
  "overflow-hidden"
)}>
  {/* Animated gradient border */}
  <span className={cn(
    "absolute inset-0 rounded-full",
    "border-2 border-transparent",
    "bg-gradient-conic from-realm-universe via-realm-life via-realm-numbers via-realm-past via-realm-mind via-realm-earth via-realm-code via-realm-society via-realm-body to-realm-art",
    "bg-[length:200%_200%]",
    "animate-[gradient-rotate_8s_linear_infinite]",
    "[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
    "[mask-composite:exclude]",
    "p-[2px]"
  )} />
  Surprise Me
</button>
```

- Slow-cycling gradient border through all Realm colors (8s CSS animation loop)
- Interior is transparent/bg-primary
- On tap: brief color shuffle (400ms) before navigating

---

## 11. Empty States & Onboarding

### 11.1 First-Open Experience

**Rule: Content in under 2 seconds.** No splash screen, no tutorial, no "welcome to Skim."

**Sequence:**
1. App loads -> full-screen RSVP starts immediately with onboarding meta-skim
2. Meta-skim Hook: "What if you could learn anything in 30 seconds?"
3. Meta-skim Snap: "You just did."
4. Swipe up -> "Why is the sky blue?" (real content, Universe Realm)
5. Swipe up -> "The Dunning-Kruger effect" (Mind Realm)
6. After skim 3: bottom sheet slides up: "Save your progress?"

The first skim IS the onboarding. The wow factor of RSVP is the explanation.

**"Tap to pause" hint:** After the first 3 words of the very first skim, a ghost text "tap anywhere to pause" appears at 30% opacity for 2 seconds, then fades. Never shown again.

### 11.2 Empty Search Results

```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <SearchIcon className="w-12 h-12 text-skim-tertiary/50 mb-4" />
  <p className="text-[17px] text-skim-primary font-medium mb-1">
    Nothing here yet.
  </p>
  <p className="text-[15px] text-skim-secondary mb-6">
    Want to make the first skim about "{searchTerm}"?
  </p>
  <div className="flex gap-3">
    <button className="px-5 py-2.5 rounded-full bg-skim-accent text-skim-bg font-medium text-[15px]">
      Generate with AI
    </button>
    <button className="px-5 py-2.5 rounded-full border border-skim text-skim-secondary font-medium text-[15px]">
      Write it yourself
    </button>
  </div>
</div>
```

### 11.3 No Skims Yet (New Creator Profile)

```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <PenIcon className="w-12 h-12 text-skim-tertiary/50 mb-4" />
  <p className="text-[17px] text-skim-primary font-medium mb-1">
    No skims yet.
  </p>
  <p className="text-[15px] text-skim-secondary mb-6">
    Your first one takes 60 seconds.
  </p>
  <button className="px-5 py-2.5 rounded-full bg-skim-accent text-skim-bg font-medium text-[15px]">
    Create a Skim
  </button>
</div>
```

### 11.4 Mode Unlock Prompts

NOT a modal. An inline card that slides up after a skim finishes:

```tsx
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className={cn(
    "fixed inset-x-4 bottom-20 z-40",
    "bg-skim-elevated rounded-2xl p-5",
    "border border-skim"
  )}
>
  <ModeIcon className="w-8 h-8 text-skim-accent mb-3" />
  <p className="text-[17px] text-skim-primary font-medium mb-1">
    Try reading in phrases.
  </p>
  <p className="text-[15px] text-skim-secondary mb-4">
    It feels like watching a movie.
  </p>
  <div className="flex gap-3">
    <button className="px-5 py-2.5 rounded-full bg-skim-accent text-skim-bg font-medium">
      Try it now
    </button>
    <button className="px-5 py-2.5 text-skim-tertiary font-medium">
      Maybe later
    </button>
  </div>
</motion.div>
```

- "Try it now" replays the SAME skim in the new mode for instant comparison
- Appears once per mode unlock. If dismissed, mode is in the picker but never re-prompted.
- No confetti, no "Congratulations!"
- **Dismiss behavior:** Swipe down to dismiss, or tap "Maybe later". No auto-dismiss timer -- user controls when it goes away. If user swipes to next skim, card dismisses naturally.

### 11.5 Auth Prompt (After Skim 3)

```tsx
<BottomSheet>
  <p className="text-[17px] text-skim-primary font-medium mb-1">
    Save your progress?
  </p>
  <p className="text-[15px] text-skim-secondary mb-5">
    Create an account to track what you've learned.
  </p>
  <button className="w-full py-3 rounded-full bg-skim-accent text-skim-bg font-semibold mb-3">
    Continue with Google
  </button>
  <button className="w-full py-3 rounded-full border border-skim text-skim-secondary font-medium mb-3">
    Continue with email
  </button>
  <button className="w-full py-2 text-skim-tertiary text-[13px]">
    Not now
  </button>
</BottomSheet>
```

### 11.6 Mage Level Progression (v1.1)

**Profile badge:**
```tsx
<span className={cn(
  "text-[13px] font-medium",
  level === "apprentice" && "text-skim-tertiary",
  level === "scholar" && "text-skim-primary",
  level === "sage" && "text-skim-accent",
  level === "mage" && "text-skim-accent animate-subtle-glow"
)}>
  {levelTitle}
</span>
```

- Apprentice (0-50 XP): tertiary text, understated
- Scholar (50-200 XP): primary text, present
- Sage (200-500 XP): accent color, distinctive
- Mage (500+ XP): accent color with subtle CSS glow animation

**XP progress bar on profile:**
```tsx
<div className="w-full h-1 rounded-full bg-skim-subtle overflow-hidden">
  <div
    className="h-full bg-skim-accent rounded-full transition-[width] duration-500"
    style={{ width: `${progressPercent}%` }}
  />
</div>
```

**Level-up notification:**
```tsx
<motion.div
  initial={{ y: -48, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -48, opacity: 0 }}
  className="fixed top-safe inset-x-0 z-50 text-center py-3"
>
  <span className="text-[15px] font-medium text-skim-accent">
    You're now a Scholar.
  </span>
</motion.div>
```

Brief top-of-screen message. No modal, no fireworks.

### 11.7 Streak Discovery (After 3 Consecutive Days)

```tsx
<motion.div className="fixed inset-x-4 bottom-20 z-40 bg-skim-elevated rounded-2xl p-5 border border-skim">
  <p className="text-[17px] text-skim-primary font-medium mb-1">
    3 days in a row.
  </p>
  <p className="text-[15px] text-skim-secondary mb-4">
    You're on a roll. Want to track your streak?
  </p>
  <div className="flex gap-3">
    <button className="px-5 py-2.5 rounded-full bg-skim-accent text-skim-bg font-medium">
      Track it
    </button>
    <button className="px-5 py-2.5 text-skim-tertiary font-medium">
      Nah
    </button>
  </div>
</motion.div>
```

---

## 12. Share Cards

### 12.1 Standard Share Card

The most important growth asset. Must be screenshot-worthy even without context.

**Dimensions:** 1080x1350px (Instagram portrait) + 1080x1920px (Stories) + 1080x1080px (square, for X/Twitter and general sharing)

**Layout:**
```
+------------------------------------------+
|  [48px padding]                           |
|                                           |
|  DID YOU KNOW?                            |  <- 14px, uppercase, accent, tracking +0.1em (conditional — see below)
|  [24px gap]                               |
|  [Hook text]                              |  <- 26px, weight 600, text-primary
|  [16px gap]                               |
|  [Core text]                              |  <- 16px, weight 400, text-secondary, lh 1.6
|  [16px gap]                               |
|  [Snap text]                              |  <- 18px, weight 600, accent
|                                           |
|  [flexible space]                         |
|                                           |
|  skim                      [QR 80x80]    |  <- Wordmark 14px, muted
|  [Realm badge]           skim.app/xyz     |  <- 11px, tertiary
|  [48px padding]                           |
+------------------------------------------+
```

**Background:**
- Dark card: #0A0A0A with very subtle noise texture (CSS: `background-image: url(noise.svg); opacity: 0.03`)
- Light card: #FAFAFA with same noise

**"Did you know?" prefix — conditional logic:**
- If Hook ends with "?" (it's a question): **no prefix**. The question IS the hook. E.g., "Why can't we divide by zero?" stands alone.
- If Hook is a statement: **show "DID YOU KNOW?" prefix** to add curiosity gap. E.g., "DID YOU KNOW? Your fingerprints are completely unique."

**QR code:** 80x80px, monochrome (matches text color), bottom-right, links to specific skim

### 12.2 "I Just Learned" Card

```
+------------------------------------------+
|  [48px padding]                           |
|                                           |
|  I just learned 5 things.                 |  <- 22px, weight 600, text-primary
|  [24px gap]                               |
|  1. Why the sky is blue                   |  <- 16px, weight 400, text-secondary
|  2. The Dunning-Kruger effect             |
|  3. How encryption works                  |
|  4. Why we dream                          |
|  5. What is inflation, really?            |
|                                           |
|  [flexible space]                         |
|                                           |
|  skim                      [QR 80x80]    |
|  All in 4 minutes.        skim.app       |  <- "All in X minutes" in accent
|  [48px padding]                           |
+------------------------------------------+
```

"All in X minutes" is the viral hook -- it quantifies the value proposition.

### 12.3 Open Graph / Link Preview

```html
<meta property="og:title" content="[Hook line]" />
<meta property="og:description" content="[Snap line] -- Learn more on Skim" />
<meta property="og:image" content="[share card image URL]" />
<meta property="og:type" content="article" />
```

The Hook line as og:title creates a curiosity gap. The Snap line as og:description gives a taste of the payoff. Together they drive clicks.

---

## 13. Animations & Transitions

### 13.1 Principles

- **Purposeful:** Every animation communicates something. No decorative motion.
- **Fast:** Most transitions 150-300ms. Nothing over 500ms except the Snap flourish.
- **Eased:** `ease-out` for entries, `ease-in` for exits, `linear` for progress indicators.
- **Interruptible:** All animations can be cancelled by user interaction.
- **Spring for touch, bezier for transitions:** Direct-manipulation responses (tap feedback, drag release) use Framer Motion spring physics. State transitions (crossfades, slides, opacity changes) use cubic-bezier easing. This creates a consistent tactile feel: springs feel physical, beziers feel smooth.

### 13.2 Animation Inventory

| Element | Trigger | Duration | Easing | Description |
|---------|---------|----------|--------|-------------|
| RSVP word swap | Word change | 0ms | instant | No transition -- words just appear. Instant is the point. |
| RSVP key term color | isKey word | 80ms | ease-out | Color snaps to accent over 80ms (first 40% of word display at 300 WPM) |
| Snap flourish | Snap section start | 300ms scale+color, 500ms hold | ease-out | Scale 1.0->1.05 + color blue->violet, hold, ease back |
| Subtitle phrase | Phrase change | 150ms in, 100ms out | ease-out / ease-in | Fade + 10px vertical shift |
| Teleprompter scroll | Continuous | Derived from WPM | linear | Constant upward scroll |
| Teleprompter Snap decel | Snap enters focal zone | 600ms | ease-in-out | Speed drops to 60%. No pause -- deceleration is the flourish. |
| Mode switch crossfade | Mode change | 300ms | ease-in-out | Current mode fades out, new fades in |
| "Got it!" fill | Tap | 200ms | ease-out | Background floods with accent, text inverts |
| "Got it!" settle | Post-fill | 600ms hold, 300ms fade | ease-out | Text + bg fade to muted confirmed state |
| Bottom sheet open | Trigger | ~300ms | spring (damping 25, stiffness 350) | Slides up from bottom + backdrop fade. Spring physics for tactile feel. |
| Bottom sheet close | Dismiss/select | 200ms | ease-in | Slides down |
| Mode unlock card | After skim complete | 400ms | spring (damping 20) | Slides up with slight bounce |
| Level-up banner | XP threshold crossed | 300ms in, 300ms out (2s hold) | ease-out / ease-in | Slides down from top |
| Progress bar | Continuous | 100ms | linear | Width transition, smooth fill |
| Feed snap-scroll | Swipe | Native | Native scroll-snap | Browser-native snap behavior |
| Bookmark toggle | Tap | ~200ms | spring (stiffness 400, damping 15) | Scale 0.85 -> 1.0 spring + 150ms outline-to-fill crossfade. Light haptic on bookmark. |

### 13.3 Framer Motion Variants

```tsx
// Bottom sheet
const sheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 350 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

// Subtitle phrase
const subtitleVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.1, ease: "easeIn" } }
};

// Mode unlock card
const unlockVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 300 }
  }
};

// Snap flourish (scale + blue-to-violet color shift)
const snapFlourish = {
  initial: { scale: 1, color: "#6C8EEF" },
  animate: {
    scale: [1, 1.05, 1.05, 1],
    color: ["#6C8EEF", "#A78BFA", "#A78BFA", "#6C8EEF"],
    transition: { duration: 1.1, times: [0, 0.27, 0.72, 1], ease: "easeInOut" }
  }
};
```

### 13.4 Reduced Motion

Respect `prefers-reduced-motion: reduce`:

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

// When reduced motion is preferred:
// - RSVP: works as-is (no animation)
// - Subtitle: instant swap instead of fade
// - Teleprompter: instant scroll position updates
// - Snap flourish: accent color only, no scale
// - All UI transitions: instant
```

---

## 14. Responsive & Mobile-First

### 14.1 Breakpoints

| Breakpoint | Width | Tailwind | Primary Use |
|------------|-------|----------|-------------|
| Mobile | < 768px | Default | Primary design target. Full-screen feed. |
| Tablet | 768-1023px | `md:` | Slightly wider content area, same layout. |
| Desktop | 1024px+ | `lg:` | Centered content column, app shell expands. |

### 14.2 Mobile-First Approach

Everything is designed for 375px width first. Scaling up is additive:

**Mobile (default):**
- Full-screen feed, 100vh per skim
- Side padding: 20px (`px-5`)
- Bottom bar is primary navigation
- WPM slider on right edge
- Touch targets: minimum 44x44px

**Tablet (md:):**
- Side padding increases to 32px (`md:px-8`)
- Content max-width: 600px, centered
- Same vertical feed experience

**Desktop (lg:):**
- Content column: 600px max-width, centered in viewport
- Optional: sidebar with Realm navigation (could be deferred)
- Keyboard shortcuts: Space to pause, arrow keys for WPM, number keys for mode switch
- Cursor hover states on interactive elements

### 14.3 Safe Areas

```css
/* Tailwind @apply or direct CSS */
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

All fixed-position elements (top bar, bottom bar, progress bar) respect device safe areas.

### 14.4 Touch Targets

- Minimum touch target: 44x44px (Apple HIG)
- "Got it!" button: 48px height minimum
- Mode picker buttons: 44x44px each
- WPM slider thumb: 44x44px hit area (visual can be smaller)
- Overflow menu: 44x44px
- Swipe zones: full viewport width for feed navigation

### 14.5 Desktop Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Pause/resume (RSVP, Subtitle, Teleprompter) |
| Up/Down Arrow | Adjust WPM by 25 |
| 1-4 | Switch mode (1=RSVP, 2=Subtitle, 3=Teleprompter, 4=Classic) |
| Enter | "Got it!" |
| B | Bookmark |
| S | Share |
| J / K | Next / Previous skim |
| Escape | Close mode picker / dismiss bottom sheet / cancel current action |

---

## 15. Accessibility

### 15.1 Reduced Motion

Respect `prefers-reduced-motion: reduce` (already documented in Section 13.4).

### 15.2 Focus Management

- All interactive elements have visible focus rings: `focus-visible:ring-2 focus-visible:ring-skim-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-skim-bg`
- Focus ring only appears on keyboard navigation (`:focus-visible`), not on mouse/touch
- Tab order follows visual layout: top bar -> content -> bottom bar
- Bottom sheet traps focus when open; Escape closes and returns focus to trigger element
- Mode picker: arrow keys navigate between modes, Enter/Space selects

### 15.3 Screen Reader Support

- Skim cards: `role="article"`, `aria-label="Skim about {hook text}, by {author}"`
- RSVP mode: `aria-live="assertive"` on the word container so screen readers announce each word (can be toggled off in settings to avoid excessive announcements)
- "Got it!" button: `aria-pressed="true"` after tap, `aria-label="Mark as learned"`
- Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Mode picker: `role="radiogroup"` with each mode as `role="radio"`
- Locked modes: `aria-disabled="true"`, `aria-description="Read {n} more skims to unlock"`
- Bottom sheet: `role="dialog"`, `aria-modal="true"`, `aria-label` describing the sheet content

### 15.4 Color Contrast

- All text meets WCAG AA minimum contrast ratios:
  - `text-primary` (#F5F5F5) on `bg-primary` (#0A0A0A): 18.1:1
  - `text-secondary` (#A0A0A0) on `bg-primary` (#0A0A0A): 9.2:1
  - `text-tertiary` (#666666) on `bg-primary` (#0A0A0A): 4.6:1 (meets AA for large text only -- used only for metadata/captions at 13px+)
  - `accent` (#6C8EEF) on `bg-primary` (#0A0A0A): 6.8:1
- Light mode equivalents verified similarly
- Realm colors on dark backgrounds: all above 4.5:1 at badge size (12px bold = "large text" per WCAG)

### 15.5 Touch Accessibility

- All touch targets minimum 44x44px (Apple HIG, WCAG 2.5.5)
- Adequate spacing between tap targets (minimum 8px gap) to prevent mis-taps
- Swipe gestures have button alternatives (arrow buttons on desktop, tap targets on mobile)
- No gesture-only interactions -- every gesture has an equivalent tap/button alternative

---

## 16. Tailwind Configuration

### 16.1 tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        skim: {
          bg: "var(--skim-bg)",
          elevated: "var(--skim-elevated)",
          subtle: "var(--skim-subtle)",
          primary: "var(--skim-primary)",
          secondary: "var(--skim-secondary)",
          tertiary: "var(--skim-tertiary)",
          accent: "var(--skim-accent)",
          "accent-hover": "var(--skim-accent-hover)",
          border: "var(--skim-border)",
          error: "var(--skim-error)",
          success: "var(--skim-success)",
        },
        realm: {
          universe: "#4A6CF7",
          life: "#34D399",
          numbers: "#AF52DE",
          past: "#D4A574",
          mind: "#FB7185",
          earth: "#2DD4BF",
          code: "#22D3EE",
          society: "#FF9F0A",
          body: "#FF453A",
          art: "#E879F9",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "rsvp": ["48px", { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "600" }],
        "subtitle": ["22px", { lineHeight: "1.3", fontWeight: "400" }],
        "teleprompter": ["20px", { lineHeight: "1.7", fontWeight: "400" }],
        "hook": ["22px", { lineHeight: "1.35", fontWeight: "600" }],
        "snap": ["19px", { lineHeight: "1.4", fontWeight: "600" }],
        "core": ["17px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      borderColor: {
        skim: "var(--skim-border)",
      },
      animation: {
        "subtle-glow": "subtle-glow 3s ease-in-out infinite alternate",
        "gradient-rotate": "gradient-rotate 8s linear infinite",
      },
      keyframes: {
        "subtle-glow": {
          "0%": { textShadow: "0 0 4px var(--skim-accent)" },
          "100%": { textShadow: "0 0 8px var(--skim-accent), 0 0 16px var(--skim-accent)" },
        },
        "gradient-rotate": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 16.2 CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Dark mode (default) */
  :root {
    --skim-bg: #0A0A0A;
    --skim-elevated: #141414;
    --skim-subtle: #1A1A1A;
    --skim-primary: #F5F5F5;
    --skim-secondary: #A0A0A0;
    --skim-tertiary: #666666;
    --skim-accent: #6C8EEF;
    --skim-accent-hover: #8BA4F5;
    --skim-border: #1E1E1E;
    --skim-error: #FF4444;
    --skim-success: #44FF88;
  }

  /* Light mode */
  .light {
    --skim-bg: #FAFAFA;
    --skim-elevated: #FFFFFF;
    --skim-subtle: #F0F0F0;
    --skim-primary: #111111;
    --skim-secondary: #555555;
    --skim-tertiary: #999999;
    --skim-accent: #5A7DE0;
    --skim-accent-hover: #4A6BD0;
    --skim-border: #E5E5E5;
    --skim-error: #DC3545;
    --skim-success: #28A745;
  }

  body {
    @apply bg-skim-bg text-skim-primary font-sans antialiased;
  }
}
```

### 16.3 Utility Classes

```css
@layer utilities {
  /* Safe area padding */
  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* Teleprompter gradient mask */
  .mask-teleprompter {
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    );
  }

  /* Bottom bar gradient fade */
  .bg-fade-up {
    background: linear-gradient(
      to top,
      var(--skim-bg) 0%,
      var(--skim-bg) 60%,
      transparent 100%
    );
  }

  /* Noise texture overlay */
  .bg-noise {
    background-image: url("data:image/svg+xml,..."); /* inline noise SVG */
    background-repeat: repeat;
    opacity: 0.03;
  }
}
```

---

## 17. Navigation

### 17.1 Bottom Tab Bar (4 Tabs)

Fixed bottom bar, always visible. Inspired by X's simplicity.

**Tabs (left to right):**
1. **Feed** (home icon) -- main vertical feed, default landing
2. **Explore** (compass icon) -- Realm browser + search + "Surprise Me"
3. **Create** (+ icon inside accent-colored circle, `bg-skim-accent w-7 h-7 rounded-full`) -- new skim creation. The accent circle distinguishes Create as a generative action without elevating it above the tab bar.
4. **Profile** (avatar circle) -- stats, bookmarks, settings, streak

```tsx
<nav className={cn(
  "fixed bottom-0 inset-x-0 z-50",
  "h-14 pb-safe",
  "bg-skim-bg/80 backdrop-blur-xl",
  "border-t border-skim",
  "flex items-center justify-around"
)}>
  {tabs.map(tab => (
    <button className={cn(
      "flex flex-col items-center gap-0.5 p-2",
      tab.active ? "text-skim-accent" : "text-skim-tertiary"
    )}>
      <tab.Icon className={cn("w-6 h-6", tab.active && "scale-105")} />
      <span className="text-[10px]">{tab.label}</span>
    </button>
  ))}
</nav>
```

**Behavior:**
- Translucent blur background (backdrop-blur-xl)
- Active tab: accent-colored filled icon + subtle scale-up (1.05x)
- Inactive: outlined icon in tertiary color
- Tapping active Feed tab scrolls to top

**Auto-hide logic (feed only):**
- Hides on scroll-down in feed (200ms slide-down, `ease-in`)
- Reappears on scroll-up (200ms slide-up, `ease-out`) or any tap on screen
- During active RSVP/Subtitle/Teleprompter playback: tab bar is hidden to maximize immersion
- Tab bar reappears on pause, skim completion, or "Got it!" tap
- On non-feed screens (Explore, Create, Profile): tab bar is always visible, never auto-hides

**Create tab interaction:**
- Tap opens the skim builder (Section 18). No intermediate screen.
- The accent circle uses a 200ms spring scale-down on press (0.9x) and spring-back on release
- If user is not authenticated, tapping Create triggers the auth prompt (Section 11.5) first

### 17.2 Explore Tab -- Realm Browser

Three zones stacked vertically:
1. **Search bar** (sticky top) -- placeholder text cycles every 3s with fade transition
2. **Surprise Me button** -- full-width pill with animated gradient border
3. **Realm grid** -- 2-column grid of Realm cards

**Search placeholder rotation:**
- "Search skims..."
- "Try why is the sky blue"
- "Try Dunning-Kruger effect"
- "Try how does encryption work"
- "Try why do we dream"
- "Try the birthday paradox"

Rules: always lowercase after "Try", always a real topic from launch skims, mix across Realms.

---

## 18. Content Creation Flow

### 18.1 The Skim Builder

Three clearly labeled section cards: Hook / Core / Snap

**Section card visual:**
```tsx
<div className={cn(
  "rounded-xl p-4",
  "bg-skim-elevated",
  "border border-skim",
  isFocused && "border-skim-accent/40"
)}>
  <label className="text-[13px] font-medium text-skim-tertiary uppercase tracking-wider mb-2">
    {sectionName}
  </label>
  <textarea className="w-full bg-transparent text-skim-primary text-[15px] leading-relaxed resize-none" />
</div>
```

- Each section card has a 1px border (`border-skim`) in resting state
- On focus: border shifts to `border-skim-accent/40` (subtle accent highlight, 150ms transition)
- Cards are stacked vertically with 12px gap between them
- Section label (Hook/Core/Snap) is above the textarea, uppercase, 13px, tertiary color

**Section placeholders:**
- Hook: "Start with a question or surprise"
- Core: "Explain it like you would to a friend"
- Snap: "The one line they'll remember"

**Word count indicator:**
- 60-100 words: green -- "Tight and punchy"
- 100-130 words: neutral (text-secondary)
- 131-150 words: amber -- "Consider trimming"
- 150+ words: red -- "Too long -- cut to 150 words to publish"

**Other creation copy:**
- AI feedback button: "Get feedback"
- Difficulty tooltip: "How much does a reader need to know already?"
- Difficulty labels: 1 dot "No background needed" / 2 dots "Some context helps" / 3 dots "Niche but fascinating"

### 18.2 Preview + Publish

- Preview shows skim in all unlocked reading modes (tab between them)
- Publish flow: tap Publish -> brief transition to the published skim in Classic mode
- Toast at top: "Published. Your skim is live."
- Below the skim: "Share it?" with share options
- No confetti, no fireworks. Seeing your content live IS the celebration.

---

## 19. UI Copy & Brand Voice Reference

### 19.1 Complete Voice Table

| Context | Copy |
|---------|------|
| Empty search | "Nothing here yet. Want to create this skim?" |
| After "Got it!" (first ever) | "Your first Got it! That's what it's all about." |
| After "Got it!" (normal) | No text -- button state change only |
| Streak discovered (3 days) | "3 days in a row. You're on a roll." |
| Subtitle unlock (skim 5) | "Try reading in phrases. It feels like watching a movie." |
| Teleprompter unlock (skim 10) | "Try the teleprompter. Full text, gentle scroll." |
| AI generation loading | "Writing you a skim... one sec." |
| Word limit hit | "Too long -- a good skim fits in 150 words. What can you cut?" |
| Report submitted | "Thanks. We'll take a look." |
| Bookmark saved | "Saved for later." |
| Error state | "Something broke. Try again?" |
| Share nudge (5+ skims) | "You just learned 5 things. Share that." |
| Auth prompt (skim 3) | "Save your progress?" |
| Publish toast | "Published. Your skim is live." |

### 19.2 Voice Rules

- **Contractions always:** "you're" not "you are", "don't" not "do not"
- **Max 12 words** per UI string. If it's longer, rewrite.
- **No emoji** in UI text. Typography is the personality.
- **Periods for statements,** question marks only for genuine choices
- **Never exclamation marks** in error states. "Got it!" is the ONE exception.
- **Statement first, then invitation.** Not question-first. "Try reading in phrases." not "Want to try reading in phrases?"
- **No "Want to...?" framing.** Use imperative or declarative.

---

## 20. Gesture Map & Interaction Patterns

### 20.1 Feed Gestures
- **Swipe up/down:** Navigate between skims
- **Tap reading area:** Pause/resume (in RSVP, Subtitle, Teleprompter)
- **Long-press (300ms):** Share card preview (Instagram Reels-style). Haptic feedback on trigger.
- **No horizontal swipes:** Clean, no confusion

### 20.2 Pause/Resume
- Tap anywhere in reading area to pause
- Pause state: word/phrase freezes, subtle dim (opacity 0.7), small pause icon fades in (500ms)
- Tap again to resume: overlay lifts, content continues from same position

### 20.3 WPM Slider
- Small WPM pill in top-right corner: `[ 300 ]` (11px, text-tertiary, rounded pill)
- **Collapsed pill visual:** `px-2 py-1 rounded-full bg-skim-subtle/50 backdrop-blur-sm` -- shows just the number (e.g., "300") in 11px text-skim-tertiary
- Tap pill to reveal full vertical slider (200ms spring animation: `{ type: "spring", damping: 20, stiffness: 300 }`)
- Slider auto-hides after 3 seconds of inactivity
- Snaps to 25 WPM increments with haptic ticks
- Range: 150-600 WPM
- Only visible in active modes (RSVP, Subtitle, Teleprompter); hidden in Classic

### 20.4 Progressive Disclosure Timeline

| Skim # | Event | Message/UX |
|--------|-------|------------|
| 0 | First open | Straight to feed, RSVP auto-starts. No walls. |
| 1 | Pause hint | "tap anywhere to pause" ghost text (30% opacity, 2s, once) |
| 1-3 | Curated skims | Onboarding content across Realms |
| 3 | Auth prompt | "Save your progress?" bottom sheet (dismissible) |
| 5 | Subtitle unlock | Inline card: "Try reading in phrases." |
| 5 | Share nudge | "You just learned 5 things. Share that." |
| 10 | Teleprompter unlock | Inline card: "Try the teleprompter." |
| 3 days | Streak | "3 days in a row. You're on a roll." |

---

## 21. Edge Cases

### 21.1 Content Edge Cases

- **Empty feed:** Show empty state (Section 11.1). Never show a blank screen.
- **Single-word Hook:** Still renders at 22px/600. No special handling needed.
- **Very long Snap (20+ words):** Snap text wraps normally. Scale-up flourish still applies to the full Snap block, not individual lines.
- **Missing Realm:** Default to `text-skim-tertiary` and `bg-skim-subtle` badge. No crash.
- **No Core text (Hook + Snap only):** Valid format. Core gap collapses. Hook and Snap render closer together.
- **Network error during feed load:** Show "Couldn't load skims. Pull to retry." in `text-skim-secondary`, centered.
- **Offline with cached skims:** Serve cached feed silently. No offline banner unless user tries to interact (Got it!, bookmark).

### 21.2 RSVP Edge Cases

- **Hyphenated words:** Treat as single display unit. "self-driving" shows as one word, not two.
- **Numbers and symbols:** Display as-is. "42" is one word. "$100M" is one word.
- **Punctuation pauses:** End-of-sentence words (period, question mark, exclamation) hold for 1.5x the normal word duration. Commas hold for 1.25x.
- **Empty word (double space in content):** Skip silently. Never show a blank flash.

### 21.3 Mode Switch Edge Cases

- **Switch during Snap flourish:** Flourish is cancelled. New mode begins at the Snap section.
- **Switch at skim completion (100%):** Mode changes but skim stays completed. No replay.
- **Rapid mode switching (spam taps):** Each switch cancels the previous 300ms crossfade. Only the final mode renders. No animation queue buildup.

### 21.4 Interaction Edge Cases

- **Double-tap "Got it!":** Second tap is no-op. Button is disabled after first tap completes.
- **"Got it!" while offline:** Queue the action locally. Sync when connection returns. Button still transitions to confirmed state immediately.
- **Bookmark while not authenticated:** Trigger auth prompt (Section 11.5) instead of bookmarking. After auth, bookmark is applied retroactively.
- **Swipe during bottom sheet:** Bottom sheet dismisses. Swipe does not also advance the feed.
- **Back gesture during RSVP:** Pauses RSVP, navigates back. On return, RSVP resumes from where it paused.

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark mode primary | Yes | RSVP on dark is the brand moment. ElevenLabs-inspired. |
| Accent color | Skim Blue #6C8EEF | Calm intellectual blue. Better luminance contrast against warm off-white at RSVP speed. Snap flourish uses blue-to-violet (#6C8EEF->#A78BFA) gradient for brand moment. |
| Font | Inter (variable) | Screen-optimized, excellent at all sizes, free, fast. |
| No avatars in feed | Content-first | Avatars trigger social-media pattern recognition. Creator names suffice for attribution. |
| Wordmark, no symbol | Simplicity | Four-letter word is already clean. Symbol adds noise for a website launch. |
| No emoji in UI | Typography is personality | The voice and type hierarchy carry the brand without emoji. |
| 300ms mode crossfade | Balanced | Fast enough to not interrupt, slow enough to not jar. |
| Mode picker auto-dismiss 200ms | Quick swap | Mode switch crossfade (300ms) provides confirmation; 200ms dismiss prevents sheet lingering. |
| Inline unlock prompts, not modals | Respect attention | Modals break immersion. Inline cards can be dismissed with a swipe. |
| "Got it!" text stays, no checkmark | Brand reinforcement | "Got it!" text is the brand. Every tap reinforces it. No icon swap -- muted text state is enough. |
| Snap flourish (scale + color) | Dopamine hit | Scale 1.05 + blue-to-violet color shift. Two effects max. Restraint IS the premium. |
| Realm colors (400-weight + custom) | Dark-mode vibrancy | Tailwind 400-weight baseline with 4 custom overrides (Universe, Numbers, Society, Body) for thematic fit and Snap flourish conflict avoidance. |
| Share card conditional "Did you know?" | Context-aware | Only show prefix for statement-Hooks. Question-Hooks don't need it. |
| Mode unlock: swipe-to-dismiss | User agency | No auto-dismiss timer. User controls when prompts go away. |
| Progress bar full opacity | Visibility | 3px accent bar at 100% opacity. Thin enough to be subtle without needing transparency. |
| "Got it!" spring physics | Tactile feel | `stiffness: 400, damping: 30` -- snappy fill with gentle overshoot settle. |
| Reduced motion support | Accessibility | All animations have instant fallbacks for prefers-reduced-motion. |
