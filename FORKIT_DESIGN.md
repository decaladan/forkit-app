# FORKIT -- Design System

*Compiled 2026-02-20 by the forkit-design team (brand-content, visual-designer, ux-interaction)*

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library](#5-component-library)
6. [Main Layout](#6-main-layout)
7. [Core Experience Visuals](#7-core-experience-visuals)
8. [Chef Picker / Council UI](#8-chef-picker--council-ui)
9. [Content Presentation](#9-content-presentation)
10. [Chef Visual Identity](#10-chef-visual-identity)
11. [Empty States & Onboarding](#11-empty-states--onboarding)
12. [Share Cards](#12-share-cards)
13. [Animations & Transitions](#13-animations--transitions)
14. [Responsive & Mobile-First](#14-responsive--mobile-first)
15. [Accessibility](#15-accessibility)
16. [Tailwind Configuration](#16-tailwind-configuration)
17. [Navigation](#17-navigation)
18. [Pantry Management UI](#18-pantry-management-ui)
19. [UI Copy & Brand Voice Reference](#19-ui-copy--brand-voice-reference)
20. [Gesture Map & Interaction Patterns](#20-gesture-map--interaction-patterns)
21. [Edge Cases](#21-edge-cases)

---

## 1. Brand Identity

### 1.1 Brand Emotion: "Chaotic Fun That Actually Helps"

ForkIt evokes the feeling of: **"Holy shit that was hilarious AND now I know what to eat."**

Not anxious paralysis (what do I eat?). Not boring utility (recipe search). Not pretentious performance (food influencer). ForkIt is **chaotic energy channeled into real utility** -- five AI chefs screaming at each other until a dish emerges from the chaos.

**Three emotional pillars:**
- **Chaos** -- the chefs fighting is pure entertainment ("Did Max just call Budget King's casserole a war crime?")
- **Surprise** -- you never know what dish will emerge ("Wait, THAT'S what they agreed on?")
- **Relief** -- decision paralysis is instantly solved ("Thank god, I know what to eat now")

### 1.2 Logo

**Wordmark with embedded fork, no standalone symbol for MVP.**

- Mixed case: **ForkIt**
- Custom sans-serif with one distinguishing detail: the "k" crossbar is replaced with a miniature fork silhouette (two tines) angled upward-right, suggesting both a utensil and forward momentum
- Letter-spacing: -0.01em (tight for impact)
- Weight: Bold (700)
- The capital "F" and "I" create natural visual anchors

**Lockup for share cards / social:** Wordmark centered above a thin horizontal line with a small fork icon sitting on the line, as if stuck into a table.

**Why no symbol:** At launch ForkIt is a mobile-first web app. The wordmark IS the brand. A fork icon can come in v2 when there is an app icon to design.

### 1.3 Brand Voice

**A food-obsessed friend who's had too much coffee.** Irreverent but never mean. Funny but never trying too hard. Direct but never cold. Slightly chaotic but never confusing.

| Context | Do Not Write | Write Instead |
|---------|-------------|---------------|
| Empty history | "No results found." | "Nothing yet. Hit the button." |
| After recipe reveal | "Recipe generated." | "Your council has spoken." |
| Daily limit reached | "You have reached your daily limit." | "10 inventions left today. Make 'em count." |
| Premium upsell | "Upgrade to premium for more features." | "Want unlimited chaos? Go Pro." |
| Recipe saved | "Recipe saved successfully." | "Saved. It's not going anywhere." |
| Error state | "An error occurred. Please try again." | "Something broke. Fork it, try again?" |
| Chef arguing | (generic AI text) | "Max just called that idea 'culinary treason.'" |
| Share prompt | "Share this recipe." | "Another masterpiece nobody asked for." |
| First recipe | (nothing) | "Your first invention. Historic." |
| Pantry empty | "No items in your pantry." | "Your pantry's empty. That's... honest." |

**Voice rules:**
- Profanity is allowed in brand voice ("fork it" is THE catchphrase) but never in error states
- Periods for statements, question marks only for genuine choices
- Contractions always ("you're" not "you are")
- Maximum 10 words per UI string
- No emoji in UI text -- the chefs ARE the personality
- "Fork it" is always two words, never hyphenated in brand copy

### 1.4 Competitive Visual Positioning

| Competitor | Their Look | ForkIt's Difference |
|------------|-----------|---------------------|
| HelloFresh | Clean, bright, stock photography | Dark, chaotic, illustrated characters. Entertainment, not meal kits. |
| Supercook | Utilitarian, database-feeling | Personality-driven. Chefs, not search results. |
| ChatGPT recipes | Plain text, no personality | Visual spectacle. The debate IS the product. |
| TikTok food | Neon, fast-cut, attention-grabbing | Contained chaos. One button, one debate, one dish. |
| Yummly | Pinterest-style grid, aspirational | Irreverent, not aspirational. Fun, not envy. |

**One sentence:** "A late-night cooking show and a debate club had a baby, and it grew up as a mobile app on dark mode."

---

## 2. Color System

### 2.1 Strategy: Dark Mode Primary

Dark is the default. Reasons:
1. The Council Debate happens on a dark stage -- five chefs arguing under a spotlight is dramatically better on dark
2. Food photography pops against dark backgrounds (every food photographer knows this)
3. The Fork It button glowing red against black is THE brand moment
4. Night-time "what do I eat?" sessions are the primary use case -- dark mode saves eyes

Light mode is available via toggle. Not hidden, not second-class.

### 2.2 Dark Mode Palette (Primary)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-primary` | `#0A0A0A` | `bg-forkit-bg` | App background, debate stage |
| `bg-elevated` | `#141414` | `bg-forkit-elevated` | Bottom sheets, modals, recipe cards |
| `bg-subtle` | `#1A1A1A` | `bg-forkit-subtle` | Input fields, hover states, chef speech bubble bg |
| `bg-stage` | `#111111` | `bg-forkit-stage` | Council debate background (slight distinction from app bg) |
| `text-primary` | `#F5F5F5` | `text-forkit-primary` | Headlines, dish names, interactive elements |
| `text-secondary` | `#A0A0A0` | `text-forkit-secondary` | Descriptions, ingredient lists, metadata |
| `text-tertiary` | `#666666` | `text-forkit-tertiary` | Timestamps, disabled states, placeholders |
| `accent` | `#E53935` | `text-forkit-accent` | Fork It button, brand moments ("ForkIt Red") |
| `accent-hover` | `#EF5350` | `text-forkit-accent-hover` | Hover/press states on primary actions |
| `accent-muted` | `rgba(229,57,53,0.12)` | `bg-forkit-accent/12` | Accent background tints for tags, pills |
| `accent-glow` | `rgba(229,57,53,0.25)` | `bg-forkit-accent/25` | Fork It button glow, pulse ring |
| `border` | `#1E1E1E` | `border-forkit` | Dividers, card borders (barely visible) |
| `error` | `#FF4444` | `text-forkit-error` | Error states only |
| `success` | `#66BB6A` | `text-forkit-success` | Success states, "Make This" confirmation, fresh/appetizing green |

**The accent is "ForkIt Red" (#E53935).** A bold, appetizing red -- not blood-red aggressive, not ketchup-cheap. Think "the glow of a neon sign at a great restaurant." It appears only on the Fork It button, brand moments, and primary CTAs. Everything else is monochrome or chef-colored. The red against the near-black background at button scale creates an irresistible focal point -- warm, urgent, appetizing.

### 2.3 Light Mode Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-primary` | `#FAFAFA` | `bg-forkit-bg` | App background |
| `bg-elevated` | `#FFFFFF` | `bg-forkit-elevated` | Cards, bottom sheets |
| `bg-subtle` | `#F0F0F0` | `bg-forkit-subtle` | Input fields, hover states |
| `bg-stage` | `#F5F5F5` | `bg-forkit-stage` | Council debate background |
| `text-primary` | `#111111` | `text-forkit-primary` | Headlines, dish names |
| `text-secondary` | `#555555` | `text-forkit-secondary` | Descriptions |
| `text-tertiary` | `#999999` | `text-forkit-tertiary` | Metadata |
| `accent` | `#C62828` | `text-forkit-accent` | Fork It button (slightly darkened for light-bg contrast) |
| `accent-hover` | `#B71C1C` | `text-forkit-accent-hover` | Hover/press states |
| `accent-muted` | `rgba(198,40,40,0.10)` | `bg-forkit-accent/10` | Accent background tints |
| `border` | `#E5E5E5` | `border-forkit` | Dividers |

### 2.4 Dark/Light Mode Toggle

Switching between dark and light mode uses a 300ms crossfade on all CSS custom properties. Same approach as the rest of the system -- no jarring flash.

```css
:root {
  transition: background-color 300ms ease-in-out,
              color 300ms ease-in-out;
}
```

All `var(--forkit-*)` properties transition simultaneously.

### 2.5 Semantic Colors (Both Modes)

| Semantic Token | Dark Mode | Light Mode | Usage |
|----------------|-----------|------------|-------|
| `timer-safe` | `#66BB6A` | `#43A047` | 20-30s remaining: plenty of time |
| `timer-warning` | `#FFA726` | `#F57C00` | 10-20s: debate is heating up |
| `timer-critical` | `#EF5350` | `#E53935` | 0-10s: urgent, decision incoming |
| `premium-gold` | `#FFD700` | `#D4A017` | Pro badge, premium features |

### 2.6 Chef Colors (Signature Palette)

These are NOT part of the general color system -- they belong to the chefs. Documented here for reference; detailed in Section 10.

| Chef | Hex | Usage |
|------|-----|-------|
| Max Flavour | `#FF6B35` | Avatar ring, speech bubble accent, win state |
| Maximum Junk | `#FFD700` | Avatar ring, speech bubble accent, win state |
| Gut Fix | `#7CB342` | Avatar ring, speech bubble accent, win state |
| Budget King | `#26A69A` | Avatar ring, speech bubble accent, win state |
| Speed Demon | `#AB47BC` | Avatar ring, speech bubble accent, win state |

---

## 3. Typography

### 3.1 Font Stack

**Primary:** Inter (variable font)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Why Inter: designed for screens, excellent at all sizes (11px metadata to 56px dish names), variable font support for smooth weight transitions, free, fast to load.

**Display weight for key moments:** The Fork It button text and dish name reveal use Inter weight 800 (Extra Bold). This creates visual distinction without introducing a second typeface.

**Chef speech bubbles:** Inter at weight 400 with 16px size and 1.4 line-height. The speech bubble container (shape, color, animation) provides the "spoken" feel -- the type itself stays clean.

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Tailwind |
|-------|------|--------|-------------|----------------|----------|
| `dish-name` | 36px | 800 | 1.1 | -0.01em | `text-4xl font-extrabold leading-tight tracking-tight` |
| `dish-name-sm` | 28px | 700 | 1.15 | -0.01em | `text-3xl font-bold leading-tight tracking-tight` |
| `forkit-button` | 24px | 800 | 1.0 | 0.02em | `text-2xl font-extrabold leading-none tracking-wide` |
| `chef-speech` | 16px | 400 | 1.4 | 0 | `text-base font-normal leading-snug` |
| `chef-name` | 14px | 600 | 1.0 | 0.02em | `text-sm font-semibold tracking-wide` |
| `section-header` | 20px | 600 | 1.3 | 0 | `text-xl font-semibold leading-snug` |
| `body` | 15px | 400 | 1.5 | 0 | `text-[15px] font-normal leading-normal` |
| `ingredient` | 15px | 400 | 1.6 | 0 | `text-[15px] font-normal leading-relaxed` |
| `step` | 16px | 400 | 1.6 | 0 | `text-base font-normal leading-relaxed` |
| `metadata` | 13px | 400 | 1.4 | 0 | `text-[13px] font-normal` |
| `badge` | 12px | 500 | 1.0 | 0.05em | `text-xs font-medium tracking-wider` |
| `caption` | 11px | 400 | 1.3 | 0 | `text-[11px] font-normal` |
| `timer` | 48px | 700 | 1.0 | 0 | `text-5xl font-bold leading-none` |

### 3.3 Dish Name -- The Most Important Typographic Element

- 36px, weight 800 (Extra Bold -- the dish name must feel like an announcement)
- Centered horizontally, offset ~5% above vertical center
- Max 2 lines; if longer, dynamically scale to 28px (`dish-name-sm`) using `clamp()`
- Reveal animation: characters stagger-fade from 0 to 1 opacity over 600ms (see Section 13)
- Letter-spacing: -0.01em (tight for impact, like a restaurant menu)

```tsx
// Container: flex-center, slight upward offset
<motion.h1
  className={cn(
    "text-4xl font-extrabold leading-tight tracking-tight",
    "text-forkit-primary text-center",
    "max-w-[80vw]"
  )}
  initial="hidden"
  animate="visible"
  variants={dishNameVariants}
>
  {dishName}
</motion.h1>
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: 4px. All spacing is a multiple of 4.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `xs` | 4px | `p-1`, `gap-1` | Tight padding (inside badges, between dots) |
| `sm` | 8px | `p-2`, `gap-2` | Between inline elements, speech bubble internal padding |
| `md` | 12px | `p-3`, `gap-3` | Card internal padding, between speech bubbles |
| `lg` | 16px | `p-4`, `gap-4` | Section spacing, standard component padding |
| `xl` | 24px | `p-6`, `gap-6` | Between major sections, recipe card padding |
| `2xl` | 32px | `p-8`, `gap-8` | Large section gaps |
| `3xl` | 48px | `p-12`, `gap-12` | Share card padding, major whitespace |
| `4xl` | 64px | `p-16`, `gap-16` | Viewport-level spacing |

### 4.2 Layout Principles

- **Mobile-first:** Design at 375px width, scale up
- **Full viewport:** Home screen and Council Debate occupy 100vh
- **Content-centered:** Recipe card content maxes out at 600px wide even on desktop
- **The button IS the layout:** On home screen, the Fork It button is the gravitational center -- everything orbits it
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

### 5.1 Fork It Button (THE Primary Action)

The most important element in the entire application. This button IS the product.

**Resting state:**
```tsx
<motion.button
  className={cn(
    "relative w-[200px] h-[200px] rounded-full",
    "bg-forkit-accent",
    "flex items-center justify-center",
    "shadow-[0_0_40px_rgba(229,57,53,0.3)]",
    "active:scale-95"
  )}
  animate={{
    boxShadow: [
      "0 0 40px rgba(229,57,53,0.3)",
      "0 0 60px rgba(229,57,53,0.5)",
      "0 0 40px rgba(229,57,53,0.3)",
    ],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <span className="text-2xl font-extrabold leading-none tracking-wide text-white">
    FORK IT
  </span>
</motion.button>
```

**Visual spec:**
- 200x200px circle (mobile). Scales to 240x240px on tablet+.
- `bg-forkit-accent` (#E53935) solid fill
- Constant ambient glow: `box-shadow: 0 0 40px rgba(229,57,53,0.3)` pulsing to `0 0 60px rgba(229,57,53,0.5)` on a 2s loop
- Text: "FORK IT" in all caps, 24px, weight 800, white (#FFFFFF)
- No border. The glow IS the border.

**Pulse animation (idle):**
The button breathes. A subtle scale pulse from 1.0 to 1.02 on a 3s loop, combined with the glow pulse. This creates an irresistible "press me" magnetism.

```tsx
const forkItPulse = {
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 40px rgba(229,57,53,0.3)",
      "0 0 60px rgba(229,57,53,0.5)",
      "0 0 40px rgba(229,57,53,0.3)",
    ],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
```

**Interaction sequence:**
1. Press down: scale to 0.92 (100ms spring, `stiffness: 500, damping: 30`)
2. Release: scale springs back to 1.0 (200ms spring)
3. Glow intensifies: `box-shadow` flares to `0 0 80px rgba(229,57,53,0.7)` (200ms)
4. Button slides down off-screen (400ms ease-in)
5. Council Debate screen takes over

**Disabled state (during debate):**
```tsx
<button className="w-[200px] h-[200px] rounded-full bg-forkit-accent/30 cursor-not-allowed">
  <span className="text-2xl font-extrabold text-white/40">FORK IT</span>
</button>
```

**Spring physics:** Press animation uses `{ type: "spring", stiffness: 500, damping: 30 }`. The high stiffness makes the press feel immediate and physical -- like pushing a big red button.

### 5.2 "Make This" Button (Secondary Action)

The post-reveal CTA -- user commits to cooking the dish.

```tsx
<button className={cn(
  "w-full py-4 rounded-2xl",
  "bg-forkit-success text-white",
  "font-semibold text-[17px]",
  "transition-all duration-150",
  "active:scale-[0.97]"
)}>
  Make This
</button>
```

**Interaction sequence:**
1. Tap: scale to 0.97 (150ms)
2. Background brightens slightly (`#76C87A`) for 200ms
3. Text changes to "Making it!" with a brief checkmark animation (300ms)
4. After 800ms, reverts to "Make This" in muted state: `bg-forkit-success/20 text-forkit-success/60`

**Spring animation:** `{ type: "spring", stiffness: 400, damping: 25 }` for the tap response.

### 5.3 Chef Avatar (Interactive)

```tsx
<div className={cn(
  "relative w-12 h-12 rounded-full",
  "bg-forkit-elevated",
  "border-2",
  `border-chef-${chefId}`,
  "overflow-hidden",
  "flex items-center justify-center"
)}>
  <Image
    src={`/chefs/${chefId}.svg`}
    alt={chefName}
    width={48}
    height={48}
    className="w-full h-full object-cover"
  />
  {isSpeaking && (
    <motion.div
      className={cn(
        "absolute inset-0 rounded-full",
        `border-2 border-chef-${chefId}`
      )}
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )}
</div>
```

- 48x48px circle (mobile), 56x56px (tablet+)
- 2px border in chef's signature color
- Illustrated character (SVG) -- not photorealistic
- Speaking state: pulsing ring animation in chef color
- Winner state: scale up 1.2x + crown badge overlay

### 5.4 Speech Bubble

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: -10 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className={cn(
    "relative max-w-[240px] px-4 py-3 rounded-2xl",
    "bg-forkit-subtle",
    "text-forkit-primary text-base leading-snug",
    "border border-forkit"
  )}
>
  {/* Tail pointing toward chef avatar */}
  <div className={cn(
    "absolute -bottom-1.5 left-4",
    "w-3 h-3 rotate-45",
    "bg-forkit-subtle border-b border-r border-forkit"
  )} />
  <p>{message}</p>
</motion.div>
```

- Max-width: 240px (forces short, punchy messages)
- Background: `bg-forkit-subtle` (#1A1A1A)
- Border: 1px `border-forkit` (#1E1E1E)
- Rounded: 16px (`rounded-2xl`)
- Tail: rotated square element pointing toward the speaking chef
- Text: 16px, weight 400, `text-forkit-primary`
- Entry animation: spring scale from 0.8 + 20px vertical offset
- Exit: fade + shrink + upward drift (100ms)

**Chef-specific bubble accent:** A 2px left-border in the chef's signature color distinguishes who is speaking:

```tsx
<motion.div className={cn(
  "relative max-w-[240px] px-4 py-3 rounded-2xl",
  "bg-forkit-subtle",
  `border-l-2 border-l-chef-${chefId}`,
  "border border-forkit"
)}>
```

### 5.5 Debate Timer

```tsx
<div className="relative flex items-center justify-center">
  {/* Circular progress ring */}
  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
    <circle
      cx="32" cy="32" r="28"
      className="fill-none stroke-forkit-subtle"
      strokeWidth="3"
    />
    <motion.circle
      cx="32" cy="32" r="28"
      className={cn(
        "fill-none",
        timeLeft > 20 && "stroke-forkit-success",
        timeLeft > 10 && timeLeft <= 20 && "stroke-[#FFA726]",
        timeLeft <= 10 && "stroke-forkit-accent"
      )}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={175.9} // 2 * PI * 28
      strokeDashoffset={175.9 * (1 - timeLeft / 30)}
    />
  </svg>
  {/* Time text */}
  <span className={cn(
    "absolute text-2xl font-bold leading-none",
    timeLeft > 20 && "text-forkit-success",
    timeLeft > 10 && timeLeft <= 20 && "text-[#FFA726]",
    timeLeft <= 10 && "text-forkit-accent"
  )}>
    {timeLeft}
  </span>
</div>
```

- 64x64px SVG circle (mobile), 72x72px (tablet+)
- Circular progress ring depletes clockwise
- Color transitions: green (20-30s) -> amber (10-20s) -> red (0-10s)
- Number text: centered inside ring, 24px bold
- At 10s: ring pulses (scale 1.0 to 1.05 on 1s loop)
- At 5s: ring pulses faster (0.5s loop) and gains red glow
- At 0s: ring flashes white (100ms) and disappears

### 5.6 Recipe Photo Card

```tsx
<div className={cn(
  "relative w-full aspect-[4/3] rounded-2xl overflow-hidden",
  "bg-forkit-elevated"
)}>
  <Image
    src={recipe.photoUrl}
    alt={recipe.dishName}
    fill
    className="object-cover"
    priority
  />
  {/* Bottom gradient overlay for text legibility */}
  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
</div>
```

- Aspect ratio: 4:3 (landscape, food photography standard)
- Rounded corners: 16px (`rounded-2xl`)
- Bottom gradient: 33% height, black at 60% opacity fading to transparent
- Loading state: subtle shimmer animation on `bg-forkit-subtle`

### 5.7 Ingredient List Item

```tsx
<div className="flex items-start gap-3 py-2">
  <div className={cn(
    "mt-1 w-5 h-5 rounded-full flex-shrink-0",
    "border border-forkit",
    isChecked && "bg-forkit-success border-forkit-success"
  )}>
    {isChecked && <CheckIcon className="w-3 h-3 text-white mx-auto" />}
  </div>
  <div className="flex-1">
    <span className={cn(
      "text-[15px] leading-relaxed",
      isChecked ? "text-forkit-tertiary line-through" : "text-forkit-primary"
    )}>
      {quantity} {unit} {ingredient}
    </span>
    {swap && (
      <SmartSwapPill swap={swap} />
    )}
  </div>
</div>
```

- Checkbox: 20x20px circle, border-only when unchecked, filled green when checked
- Checked state: text gets `line-through` and drops to tertiary color
- Tap target: full row height, minimum 44px
- Smart swap pill appears inline after the ingredient text

### 5.8 Smart Swap Pill

```tsx
<button className={cn(
  "inline-flex items-center gap-1 ml-2",
  "px-2 py-0.5 rounded-full",
  "text-[11px] font-medium",
  "text-forkit-accent bg-forkit-accent/10",
  "hover:bg-forkit-accent/20",
  "transition-colors duration-150"
)}>
  <ArrowsRightLeftIcon className="w-3 h-3" />
  {swapText}
</button>
```

- Appears next to ingredients that have alternatives
- Tap to expand: shows swap option with brief explanation ("No butter? Use coconut oil.")
- Accent-colored text on accent-muted background
- 11px, medium weight

### 5.9 Step Card

```tsx
<div className={cn(
  "flex gap-4 py-4",
  "border-b border-forkit last:border-b-0"
)}>
  <span className={cn(
    "flex-shrink-0 w-8 h-8 rounded-full",
    "bg-forkit-subtle",
    "flex items-center justify-center",
    "text-sm font-semibold text-forkit-secondary"
  )}>
    {stepNumber}
  </span>
  <div className="flex-1">
    <p className="text-base leading-relaxed text-forkit-primary">
      {instruction}
    </p>
    {tip && (
      <p className="mt-2 text-[13px] text-forkit-tertiary italic">
        {tip}
      </p>
    )}
  </div>
</div>
```

- Step number: 32x32px circle, `bg-forkit-subtle`, centered number
- Instruction: 16px, normal weight, relaxed line-height
- Chef tip (optional): 13px, italic, tertiary color
- Separated by 1px borders

### 5.10 Bottom Sheet (Generic)

```tsx
<div className={cn(
  "fixed inset-x-0 bottom-0 z-50",
  "bg-forkit-elevated rounded-t-2xl",
  "border-t border-forkit",
  "px-5 pb-safe pt-4",
  "shadow-2xl shadow-black/30"
)}>
  {/* Drag handle */}
  <div className="w-8 h-1 rounded-full bg-forkit-tertiary/30 mx-auto mb-4" />
  {children}
</div>
```

- Rounded top corners (16px radius)
- Elevated background
- Drag handle: 32px wide, 4px tall, centered
- Bottom safe area padding (`pb-safe`)
- Backdrop: semi-transparent black overlay on content behind

### 5.11 Pro Badge

```tsx
<span className={cn(
  "inline-flex items-center gap-1",
  "px-2 py-0.5 rounded-full",
  "text-[11px] font-semibold tracking-wider uppercase",
  "text-[#FFD700] bg-[#FFD700]/12"
)}>
  PRO
</span>
```

- Gold text (#FFD700) on gold-tinted background
- Uppercase, tracking-wider, 11px semibold
- Appears next to premium features and on user profiles

### 5.12 Daily Limit Counter

```tsx
<div className="flex items-center gap-2">
  <div className="flex gap-0.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-2 h-2 rounded-full",
          i < remaining
            ? "bg-forkit-accent"
            : "bg-forkit-subtle"
        )}
      />
    ))}
  </div>
  <span className="text-[11px] text-forkit-tertiary">
    {remaining} left today
  </span>
</div>
```

- 10 dots (8px each), filled dots = remaining inventions
- Depleted dots: `bg-forkit-subtle`
- Active dots: `bg-forkit-accent`
- Compact: sits in top bar or settings screen

### 5.13 Text Input Fields

```tsx
<input className={cn(
  "w-full px-4 py-3 rounded-lg",
  "bg-forkit-subtle border border-forkit/50",
  "text-forkit-primary text-[15px]",
  "placeholder:text-forkit-tertiary",
  "focus:outline-none focus:border-forkit-accent/50 focus:ring-1 focus:ring-forkit-accent/20",
  "transition-colors duration-150"
)} />
```

---

## 6. Main Layout

### 6.1 Home Screen -- The Button Screen

The home screen has ONE job: get the user to press Fork It.

```
+------------------------------------------+  <- 100vh
|  [safe-area-top]                          |
|                                           |
|  [ForkIt wordmark]         [Pro] [gear]   |  <- Top bar (fixed)
|                                           |
|  [daily limit dots: oooooo****]           |  <- Subtle, top area
|                                           |
|                                           |
|                                           |
|               +--------+                  |
|              /  FORK IT  \                |  <- THE BUTTON, center
|              \           /                |     200px, glowing red
|               +--------+                  |
|                                           |
|  "What should I eat?"                     |  <- Tagline, muted
|                                           |
|                                           |
|  [History]  [Feed]  [Home]  [Pantry]      |  <- Bottom nav (fixed)
|  [safe-area-bottom]                       |
+------------------------------------------+
```

**Top bar:**
- Fixed position, transparent background
- Left: ForkIt wordmark (14px, bold, `text-forkit-primary`)
- Right: Pro badge (if applicable) + settings gear icon

**Center zone:**
- Fork It button: absolute center, vertically and horizontally
- Below button (16px gap): tagline text "What should I eat?" in 15px `text-forkit-tertiary`
- Daily limit counter above button (24px gap), only visible on free tier
- The button's glow provides ambient light to the area around it

**Bottom bar:**
- Fixed bottom navigation (see Section 17)

### 6.2 Council Debate Screen

```
+------------------------------------------+  <- 100vh
|  [safe-area-top]                          |
|                                           |
|  [Timer: 27]                [X close]     |  <- Top bar
|                                           |
|                                           |
|          [Chef 2]   [Chef 3]              |
|      [Chef 1]    [table]    [Chef 4]      |  <- Round table layout
|                [Chef 5]                   |     5 avatars, circular
|                                           |
|                                           |
|  +--------------------------------------+ |
|  | [avatar] Chef speech bubble here.     | |  <- Active debate
|  +--------------------------------------+ |     messages stack
|  | [avatar] "No way, that's trash."      | |     from bottom
|  +--------------------------------------+ |
|  | [avatar] "Trust me on this one."      | |
|  +--------------------------------------+ |
|                                           |
|  [safe-area-bottom]                       |
+------------------------------------------+
```

**Top area:**
- Timer: top-left, circular progress ring (see Section 5.5)
- Close button: top-right, 44x44px, `text-forkit-tertiary`, `X` icon

**Council table (upper half):**
- 5 chef avatars arranged in a rough pentagon/arc
- Dark stage background (`bg-forkit-stage`)
- Active speaker: avatar pulses with chef-color ring
- Inactive speakers: slightly dimmed (opacity 0.7)
- Small chef name labels below each avatar

**Debate feed (lower half):**
- Speech bubbles stack from bottom, latest at bottom
- Max 3 visible at once; older bubbles fade and slide up
- Auto-scrolls to latest message
- Each bubble has chef-color left border

### 6.3 Recipe Reveal Screen

```
+------------------------------------------+  <- 100vh
|  [safe-area-top]                          |
|                                           |
|  [back arrow]    "Your Council Has Spoken" |
|                                           |
|  +--------------------------------------+ |
|  |                                      | |
|  |        [Recipe Photo 4:3]            | |  <- Dramatic reveal
|  |                                      | |
|  +--------------------------------------+ |
|                                           |
|  [Dish Name -- 36px, extrabold]           |
|  [Winning chef badge + time + servings]   |
|                                           |
|  [Quick stats row]                        |
|  15 min  ·  4 servings  ·  $8            |
|                                           |
|  [ ======= Make This ======= ]           |  <- Full-width CTA
|                                           |
|  [Share]  [Save]  [Swap Chef]             |  <- Action row
|                                           |
|  [safe-area-bottom]                       |
+------------------------------------------+
```

### 6.4 Recipe Card (Full Detail)

```
+------------------------------------------+
|  [safe-area-top]                          |
|                                           |
|  [back]              [share] [save]       |
|                                           |
|  +--------------------------------------+ |
|  |        [Recipe Photo 4:3]            | |
|  +--------------------------------------+ |
|                                           |
|  [Dish Name]                              |
|  [Chef avatar + "by Max Flavour"]         |
|  [15 min  ·  4 servings  ·  $8]          |
|                                           |
|  --- Ingredients (7) ---                  |
|  o  2 chicken breasts         [swap]      |
|  o  1 cup rice                            |
|  o  2 tbsp soy sauce          [swap]      |
|  ...                                      |
|                                           |
|  --- Steps (5) ---                        |
|  (1)  Heat oil in a large pan...          |
|  (2)  Season chicken with...              |
|  (3)  Cook for 6-8 minutes...             |
|       Chef tip: "Don't crowd the pan"     |
|  ...                                      |
|                                           |
|  --- Smart Swaps ---                      |
|  [swap pill] [swap pill] [swap pill]      |
|                                           |
|  [ ======= Make This ======= ]           |
|                                           |
|  [safe-area-bottom]                       |
+------------------------------------------+
```

---

## 7. Core Experience Visuals

### 7.1 Fork It Button -- The Idle State

The home screen's visual center. On the dark background, the button is a red beacon.

**Visual spec:**
- Background: pure `bg-forkit-bg` (#0A0A0A). Minimal other elements.
- Button: 200px diameter, `bg-forkit-accent`, soft pulsing glow
- Text beneath: "What should I eat?" in 15px `text-forkit-tertiary`, centered
- The glow creates a subtle red-tinted zone around the button (radius ~120px), adding depth to the dark background
- No other bright elements compete for attention

**After-hours variant (10pm-6am):**
Tagline changes from "What should I eat?" to "Late night? Fork it." -- same visual treatment, different copy. Time-based, no user action needed.

### 7.2 Council Debate -- The Show

This is the entertainment core. Five chefs argue for 30 seconds. It must feel like watching a live debate.

**Stage lighting:**
- Background: `bg-forkit-stage` (#111111) -- slightly lighter than app bg to create a "stage" feel
- Subtle radial gradient from center: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)` -- simulates overhead spotlight
- Chef avatars are the brightest elements on screen

**Debate escalation visual phases:**

| Phase | Time | Visual Change |
|-------|------|---------------|
| Opening | 30-25s | Calm. Bubbles arrive at normal pace (1 every 2s). Chef colors at normal saturation. |
| Discussion | 25-15s | Pace increases (1 every 1.5s). Occasional overlapping bubbles. |
| Heated | 15-8s | Fast (1 every 1s). Bubbles are slightly larger. Timer turns amber. Chef avatars bounce subtly. |
| Climax | 8-3s | Rapid-fire (1 every 0.7s). Bubbles shake slightly on entry. Timer pulses red. Background gains subtle warm tint. |
| Decision | 3-0s | All bubbles fade. Chefs go silent. Timer counts down dramatically. Screen dims slightly. |

**Speech bubble behavior:**
- Maximum 3 visible bubbles at once
- Older bubbles compress (scale 0.95) and fade (opacity 0.5) as new ones arrive
- Each bubble is max 240px wide, forcing short punchy messages
- Bubble entry: spring animation from below (`y: 20 -> 0, scale: 0.8 -> 1`)
- Bubble exit: fade up and out (`y: 0 -> -10, opacity: 1 -> 0`, 100ms)

**Chef agreement/disagreement indicators:**
- Agreement: chef avatar briefly glows green (200ms pulse)
- Disagreement: chef avatar shakes horizontally (2 oscillations over 300ms, 3px amplitude)
- These are subtle -- the speech bubbles carry the narrative, avatars provide ambient reaction

### 7.3 Recipe Reveal -- The Payoff

The moment chaos becomes utility. Must feel dramatic, satisfying, and appetizing.

**Reveal sequence (total: ~2.5s):**

1. **Black screen** (0ms): Full `bg-forkit-bg`, nothing visible
2. **Winner announcement** (0-400ms): Winning chef's name + avatar fade in at center: "[Chef Avatar] Max Flavour wins." -- 17px, semibold, chef color. Fade in 300ms, hold 400ms.
3. **Name fade out** (400-600ms): Chef announcement fades out (200ms)
4. **Photo reveal** (600-1400ms): Recipe photo scales from 0.9 to 1.0 + fades from 0 to 1 opacity over 800ms. Photo starts slightly zoomed and settles. `ease-out`.
5. **Dish name** (1200-1800ms): Stagger-fades in character by character (30ms per character). 36px, extrabold. Appears below photo.
6. **Details cascade** (1800-2500ms): Quick stats (time, servings, cost) fade in as a row. "Make This" button scales in from 0.95 with spring physics.

```tsx
const revealSequence = {
  chefAnnounce: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  photo: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut", delay: 0.6 },
  },
  dishName: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay: 1.2 },
  },
  details: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut", delay: 1.8 },
  },
  makeThis: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 2.0 },
  },
};
```

**Winner celebration (behind photo):**
- Confetti burst in winning chef's color (subtle, 15 particles, 1s duration, gravity-affected)
- Particles use the chef's signature color at 60% opacity
- Appears behind the photo card, visible around the edges
- Reduced motion: no confetti, just the sequential fade-ins

### 7.4 History / Past Inventions

```
+------------------------------------------+
|  [safe-area-top]                          |
|                                           |
|  Your Inventions          [filter icon]   |
|                                           |
|  +------+  +------+  +------+            |
|  |photo |  |photo |  |photo |            |  <- 2-column grid
|  |      |  |      |  |      |            |
|  |name  |  |name  |  |name  |            |
|  |chef  |  |chef  |  |chef  |            |
|  +------+  +------+  +------+            |
|  +------+  +------+  +------+            |
|  |photo |  |photo |  |photo |            |
|  |      |  |      |  |      |            |
|  |name  |  |name  |  |name  |            |
|  |chef  |  |chef  |  |chef  |            |
|  +------+  +------+  +------+            |
|                                           |
|  [Bottom nav]                             |
+------------------------------------------+
```

**Grid card spec:**
```tsx
<div className={cn(
  "rounded-xl overflow-hidden",
  "bg-forkit-elevated",
  "border border-forkit"
)}>
  <div className="aspect-square relative">
    <Image src={recipe.photoUrl} alt={recipe.dishName} fill className="object-cover" />
  </div>
  <div className="p-3">
    <p className="text-[15px] font-semibold text-forkit-primary line-clamp-1">
      {recipe.dishName}
    </p>
    <div className="flex items-center gap-1.5 mt-1">
      <ChefAvatar id={recipe.chefId} size={16} />
      <span className="text-[11px] text-forkit-tertiary">{recipe.chefName}</span>
    </div>
  </div>
</div>
```

- 2-column grid, 12px gap
- Square photo (aspect-square) for compact grid
- Dish name: 15px semibold, single line clamp
- Chef mini-avatar (16px) + chef name in caption size
- Tap opens full recipe card

---

## 8. Chef Picker / Council UI

### 8.1 Chef Preferences (Settings)

Users can customize which chefs participate in their Council. Minimum 2, maximum 5.

```tsx
<div className="space-y-3">
  <h3 className="text-[15px] font-semibold text-forkit-primary mb-4">
    Your Council
  </h3>
  {chefs.map(chef => (
    <button
      key={chef.id}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl",
        "transition-colors duration-150",
        chef.active ? "bg-forkit-subtle border border-forkit" : "opacity-40"
      )}
    >
      <ChefAvatar id={chef.id} size={48} />
      <div className="flex-1 text-left">
        <p className={cn(
          "text-[15px] font-semibold",
          chef.active ? "text-forkit-primary" : "text-forkit-tertiary"
        )}>
          {chef.name}
        </p>
        <p className="text-[13px] text-forkit-secondary">
          {chef.tagline}
        </p>
      </div>
      <div className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
        chef.active
          ? `border-chef-${chef.id} bg-chef-${chef.id}`
          : "border-forkit-tertiary/30"
      )}>
        {chef.active && <CheckIcon className="w-3.5 h-3.5 text-white" />}
      </div>
    </button>
  ))}
  <p className="text-[11px] text-forkit-tertiary text-center mt-2">
    Pick 2-5 chefs for your council.
  </p>
</div>
```

**Behavior:**
- All 5 chefs active by default
- Toggle tap: spring scale on the row (0.97 -> 1.0), checkbox fills/empties with 150ms transition
- Minimum 2 chefs enforced: if user tries to deselect leaving only 1, show shake animation on remaining active chef + toast "You need at least 2 chefs."
- Chef order in debate follows the order shown here (top to bottom = left to right around the table)

### 8.2 Council Formation Animation

When the user taps Fork It, the 5 active chefs "assemble":

**Sequence (total: ~800ms):**
1. **Scatter** (0ms): Chef avatars are positioned off-screen in random directions
2. **Fly in** (0-600ms): Each avatar flies to its table position with staggered timing (100ms between each). Spring physics: `{ type: "spring", stiffness: 200, damping: 15 }`.
3. **Settle** (600-800ms): Avatars land with a subtle bounce. A brief flash of each chef's color pulses outward (200ms, 30% opacity).
4. **Ready** (800ms+): Timer starts. First speech bubble appears after 500ms.

```tsx
const chefEntrance = {
  initial: (i: number) => ({
    x: offScreenPositions[i].x,
    y: offScreenPositions[i].y,
    scale: 0.5,
    opacity: 0,
  }),
  animate: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  },
  transition: (i: number) => ({
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: i * 0.1,
  }),
};
```

### 8.3 Winner Selection Animation

When the timer hits 0:

1. **All silent** (0-300ms): Bubbles clear. Chefs dim to 40% opacity.
2. **Spotlight** (300-800ms): Winning chef scales to 1.3x, full opacity. Their color ring intensifies. Other chefs fade to 20% opacity.
3. **Crown** (800-1200ms): A small crown badge (SVG, 16px) springs in above the winning chef's avatar.
4. **Transition** (1200ms+): Screen crossfades to Recipe Reveal (Section 7.3).

```tsx
const winnerSpotlight = {
  winner: {
    scale: 1.3,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.3 },
  },
  loser: {
    scale: 0.9,
    opacity: 0.2,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.3 },
  },
  crown: {
    initial: { scale: 0, y: 10, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 400, damping: 15, delay: 0.8 },
  },
};
```

---

## 9. Content Presentation

### 9.1 Recipe Card -- The Visual Hierarchy

The recipe card must feel like a beautifully plated dish -- organized, appetizing, inviting.

```
HERO (Photo)  ->  NAME (announcement)  ->  DETAILS (practical)  ->  ACTION (make it)
```

Each layer steps down in visual intensity, creating a natural reading flow from inspiration to action.

**Photo:**
- Full-width, 4:3 aspect ratio
- Bottom gradient overlay for text legibility
- Rounded corners: 16px top, 0 bottom (card edge)
- Tap to view full-screen (pan and zoom enabled)

**Dish Name:**
- 36px, weight 800, `text-forkit-primary`
- Maximum 2 lines, clamp with ellipsis if longer
- 16px below photo bottom

**Quick Stats Row:**
- 12px below dish name
- `[clock icon] 15 min  ·  [servings icon] 4  ·  [$] ~$8`
- 13px, `text-forkit-secondary`
- Icons: 14x14px, inline, same secondary color

**Winning Chef Badge:**
- 8px below stats row
- Mini avatar (24px) + "by Max Flavour" in 13px `text-forkit-secondary`
- Chef name in chef's signature color

### 9.2 Ingredient Section

**Section header:**
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold text-forkit-primary">
    Ingredients
  </h2>
  <span className="text-[13px] text-forkit-tertiary">
    {ingredients.length} items
  </span>
</div>
```

- Section label: 20px, weight 600, `text-forkit-primary`
- Count: right-aligned, 13px, tertiary
- Each ingredient row: 44px minimum height (touch target)
- Checkbox toggle with line-through on check
- Smart swap pills inline (see Section 5.8)

### 9.3 Steps Section

**Step rendering:**
- Number in circle (32px, `bg-forkit-subtle`)
- Instruction text: 16px, normal, relaxed line-height
- Chef tips: italic, 13px, tertiary, prefixed with chef avatar mini (16px)
- Time callouts within steps: bold, accent color ("Cook for **6-8 minutes**")
- 1px border between steps

### 9.4 Smart Swaps Section (Bottom of Card)

```tsx
<div className="bg-forkit-subtle rounded-xl p-4 mt-6">
  <h3 className="text-[15px] font-semibold text-forkit-primary mb-3">
    Smart Swaps
  </h3>
  <div className="space-y-3">
    {swaps.map(swap => (
      <div key={swap.id} className="flex items-start gap-3">
        <ArrowsRightLeftIcon className="w-4 h-4 text-forkit-accent mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[15px] text-forkit-primary">
            <span className="line-through text-forkit-tertiary">{swap.original}</span>
            {" -> "}
            <span className="font-medium">{swap.replacement}</span>
          </p>
          <p className="text-[13px] text-forkit-tertiary mt-0.5">
            {swap.reason}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
```

- Contained in a subtle-bg rounded box
- Arrow icon in accent color
- Original ingredient: strikethrough, tertiary
- Replacement: normal weight, primary color
- Reason: 13px, tertiary, below

---

## 10. Chef Visual Identity

### 10.1 The Five Chefs

Each chef is a distinct character with their own visual identity, personality, and argument style. They are illustrated in a flat, slightly cartoonish style -- think halfway between an emoji and a Headspace character. Expressive, simple, recognizable at 48px.

### 10.2 Chef Color Palette

| Chef | Hex | Tailwind Custom | Rationale |
|------|-----|-----------------|-----------|
| Max Flavour | `#FF6B35` | `chef-max` | Fiery orange-red. Heat, passion, bold flavors. |
| Maximum Junk | `#FFD700` | `chef-junk` | Cheese yellow / gold. Indulgent, over-the-top, fun. |
| Gut Fix | `#7CB342` | `chef-gut` | Sage green. Health, freshness, vegetables, balance. |
| Budget King | `#26A69A` | `chef-budget` | Teal. Dollar-bill adjacent, resourceful, clever. |
| Speed Demon | `#AB47BC` | `chef-speed` | Electric purple. Energy, urgency, efficiency. |

**Selection criteria:** Each color must be instantly distinguishable at speech-bubble-border size (2px wide). All tested for dark-mode vibrancy and cross-chef distinction at avatar ring size (48px). On light mode, colors darken by 10% for contrast. No two chefs share a color hue family.

### 10.3 Chef Profiles

**Max Flavour** -- The Bold One
- **Color:** `#FF6B35` (Fiery Orange)
- **Avatar:** Round face, flame-styled hair (orange/red gradient), wide confident grin, small chef's toque tilted rakishly
- **Speech style:** Passionate, dramatic, uses food metaphors for everything. "That dish needs HEAT. We're not making hospital food here."
- **Bubble accent:** Orange-red left border, slightly warmer `bg-forkit-subtle` tint
- **Win celebration:** Avatar bursts into animated flame ring (300ms, chef color at 40% opacity radiating outward)
- **Signature phrase:** "Go big or go home."
- **Argues for:** Complex flavors, spice, technique, restaurant-quality

**Maximum Junk** -- The Guilty Pleasure
- **Color:** `#FFD700` (Cheese Yellow)
- **Avatar:** Round face, messy hair, half-lidded relaxed eyes, slight smirk, backwards cap
- **Speech style:** Chill, funny, unapologetically junky. "Bro, just put cheese on it. Problem solved."
- **Bubble accent:** Gold left border
- **Win celebration:** Avatar does a brief victory dance (2-frame wobble animation, 400ms)
- **Signature phrase:** "Cheese fixes everything."
- **Argues for:** Comfort food, fast food upgrades, maximum indulgence

**Gut Fix** -- The Health Nut
- **Color:** `#7CB342` (Sage Green)
- **Avatar:** Round face, neat short hair, calm expression, small glasses, subtle leaf earring
- **Speech style:** Measured, slightly preachy but self-aware about it. "Look, I know nobody asked, but your gut will thank you."
- **Bubble accent:** Green left border
- **Win celebration:** Avatar glows with a soft green pulse (300ms, 2 pulses)
- **Signature phrase:** "Your gut will thank you."
- **Argues for:** Whole foods, probiotics, balanced meals, vegetables

**Budget King** -- The Frugal Genius
- **Color:** `#26A69A` (Teal)
- **Avatar:** Round face, sharp eyes, subtle crown (small, teal), knowing smile, raised eyebrow
- **Speech style:** Clever, resourceful, slightly smug about savings. "That's $3 worth of ingredients and $30 worth of flavor."
- **Bubble accent:** Teal left border
- **Win celebration:** Avatar's crown glints (brief shine animation, 200ms, white highlight)
- **Signature phrase:** "Rich flavor, not rich prices."
- **Argues for:** Cheap ingredients, clever substitutions, pantry staples, stretch meals

**Speed Demon** -- The Efficiency Expert
- **Color:** `#AB47BC` (Electric Purple)
- **Avatar:** Round face, slicked-back hair, intense focused eyes, slight forward lean, lightning bolt earring
- **Speech style:** Impatient, energetic, time-obsessed. "15 minutes. That's all I need. Stop overcomplicating it."
- **Bubble accent:** Purple left border
- **Win celebration:** Avatar zooms off-screen right and zooms back from left (300ms, spring physics)
- **Signature phrase:** "Time is the only ingredient that matters."
- **Argues for:** Quick recipes, minimal prep, one-pan meals, 15-minute dishes

### 10.4 Chef Avatar in Feed

```tsx
// Standard avatar with chef ring
<div className={cn(
  "relative w-12 h-12 rounded-full overflow-hidden",
  `ring-2 ring-chef-${chefId}`
)}>
  <Image src={`/chefs/${chefId}.svg`} alt={chefName} fill className="object-cover" />
</div>

// Mini avatar (for attribution lines)
<div className={cn(
  "w-4 h-4 rounded-full overflow-hidden",
  `ring-1 ring-chef-${chefId}`
)}>
  <Image src={`/chefs/${chefId}.svg`} alt={chefName} fill className="object-cover" />
</div>
```

### 10.5 Chef Disagreement Patterns

When two chefs clash, their speech bubbles enter simultaneously with a "vs" badge between them:

```tsx
<div className="flex items-start gap-2">
  <SpeechBubble chef={chef1} message={msg1} side="left" />
  <span className={cn(
    "flex-shrink-0 px-1.5 py-0.5 rounded-full",
    "text-[10px] font-bold text-forkit-accent",
    "bg-forkit-accent/12",
    "self-center"
  )}>
    VS
  </span>
  <SpeechBubble chef={chef2} message={msg2} side="right" />
</div>
```

---

## 11. Empty States & Onboarding

### 11.1 First-Open Experience

**Rule: Button visible in under 1 second.** No splash screen, no tutorial carousel, no "welcome to ForkIt."

**Sequence:**
1. App loads -> black screen fades in (200ms) -> Fork It button appears center screen with a dramatic glow-up animation (button scales from 0.5 to 1.0 + glow intensifies over 600ms)
2. Below button: "What should I eat?" appears (300ms fade, 200ms after button)
3. Small hint text below: "Tap it. Trust us." at 20% opacity, fades after 3s. Never shown again.
4. User taps -> Council Debate starts (their first experience)
5. After first recipe reveal: bottom sheet slides up: "That was fun, right?" with "Make an account" and "Just browsing" options

The Fork It button IS the onboarding. The chaos of the debate is the explanation.

### 11.2 Empty History

```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <ForkIcon className="w-16 h-16 text-forkit-tertiary/40 mb-4" />
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    Nothing yet.
  </p>
  <p className="text-[15px] text-forkit-secondary mb-6">
    Hit the button. Let the chefs fight.
  </p>
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="px-8 py-3 rounded-full bg-forkit-accent text-white font-semibold text-[15px]"
  >
    Fork It
  </motion.button>
</div>
```

### 11.3 Empty Pantry

```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <ShoppingBagIcon className="w-16 h-16 text-forkit-tertiary/40 mb-4" />
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    Your pantry's empty.
  </p>
  <p className="text-[15px] text-forkit-secondary mb-6">
    Add what you've got. The chefs will work with it.
  </p>
  <button className="px-6 py-3 rounded-full bg-forkit-accent text-white font-semibold text-[15px]">
    Stock Your Pantry
  </button>
</div>
```

### 11.4 Daily Limit Reached (Free Tier)

NOT a modal. An inline card that replaces the Fork It button on the home screen:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  className={cn(
    "max-w-[300px] mx-auto",
    "bg-forkit-elevated rounded-2xl p-6",
    "border border-forkit",
    "text-center"
  )}
>
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    That's 10 for today.
  </p>
  <p className="text-[15px] text-forkit-secondary mb-5">
    Come back tomorrow, or go unlimited.
  </p>
  <button className="w-full py-3 rounded-full bg-[#FFD700] text-[#111111] font-semibold mb-3">
    Go Pro -- Unlimited
  </button>
  <p className="text-[11px] text-forkit-tertiary">
    Resets at midnight.
  </p>
</motion.div>
```

- Appears where the Fork It button normally lives
- Pro upsell button in premium gold
- "Resets at midnight" beneath in caption size
- No aggressive copy. No FOMO language.

### 11.5 Auth Prompt (After First Recipe)

```tsx
<BottomSheet>
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    That was fun, right?
  </p>
  <p className="text-[15px] text-forkit-secondary mb-5">
    Save your recipes and pick your chefs.
  </p>
  <button className="w-full py-3 rounded-full bg-forkit-accent text-white font-semibold mb-3">
    Continue with Google
  </button>
  <button className="w-full py-3 rounded-full border border-forkit text-forkit-secondary font-medium mb-3">
    Continue with email
  </button>
  <button className="w-full py-2 text-forkit-tertiary text-[13px]">
    Just browsing
  </button>
</BottomSheet>
```

### 11.6 Pro Subscription Tiers

**Profile badge:**
```tsx
<span className={cn(
  "text-[13px] font-medium",
  tier === "free" && "text-forkit-tertiary",
  tier === "pro" && "text-[#FFD700]"
)}>
  {tier === "free" ? "Free" : "Pro"}
</span>
```

- Free: tertiary text, understated
- Pro: gold text (#FFD700) with subtle glow animation

**Pro unlock notification:**
```tsx
<motion.div
  initial={{ y: -48, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -48, opacity: 0 }}
  className="fixed top-safe inset-x-0 z-50 text-center py-3"
>
  <span className="text-[15px] font-medium text-[#FFD700]">
    Welcome to Pro. Unlimited chaos unlocked.
  </span>
</motion.div>
```

### 11.7 Streak Discovery (After 3 Consecutive Days)

```tsx
<motion.div className="fixed inset-x-4 bottom-20 z-40 bg-forkit-elevated rounded-2xl p-5 border border-forkit">
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    3 days of forking it.
  </p>
  <p className="text-[15px] text-forkit-secondary mb-4">
    You're building a habit. Keep going?
  </p>
  <div className="flex gap-3">
    <button className="px-5 py-2.5 rounded-full bg-forkit-accent text-white font-medium">
      Track it
    </button>
    <button className="px-5 py-2.5 text-forkit-tertiary font-medium">
      Nah
    </button>
  </div>
</motion.div>
```

---

## 12. Share Cards

### 12.1 Recipe Share Card

The most important growth asset. Must be screenshot-worthy even without context. The food photo and dish name do the selling.

**Dimensions:** 1080x1350px (Instagram portrait) + 1080x1920px (Stories) + 1080x1080px (square)

**Layout:**
```
+------------------------------------------+
|  [48px padding]                           |
|                                           |
|  +--------------------------------------+ |
|  |                                      | |
|  |        [Recipe Photo 4:3]            | |  <- Rounded 16px, dominant
|  |                                      | |
|  +--------------------------------------+ |
|  [24px gap]                               |
|  [Dish Name]                              |  <- 28px, weight 700, text-primary
|  [8px gap]                                |
|  [Chef avatar] Invented by Max Flavour   |  <- 14px, chef color name
|  [16px gap]                               |
|  15 min  ·  4 servings  ·  $8            |  <- 13px, text-secondary
|                                           |
|  [flexible space]                         |
|                                           |
|  ForkIt              [QR 80x80]          |  <- Wordmark 14px, muted
|  "Fork it, let's eat"   forkit.app/xyz   |  <- 11px, tertiary tagline
|  [48px padding]                           |
+------------------------------------------+
```

**Background:**
- Dark card: #0A0A0A with very subtle noise texture (`opacity: 0.03`)
- Light card: #FAFAFA with same noise

**QR code:** 80x80px, monochrome (matches text color), bottom-right, links to specific recipe.

### 12.2 "Look What I Made" Card

```
+------------------------------------------+
|  [48px padding]                           |
|                                           |
|  I made 5 things this week.              |  <- 22px, weight 600, text-primary
|  [24px gap]                               |
|  1. Spicy Honey Garlic Chicken           |  <- 16px, text-secondary
|  2. Budget Ramen Upgrade                  |
|  3. 10-Minute Pesto Pasta                |
|  4. Gut-Reset Smoothie Bowl              |
|  5. Cheese Tornado Nachos                |
|                                           |
|  [flexible space]                         |
|                                           |
|  ForkIt                  [QR 80x80]      |
|  All invented by AI chefs. forkit.app    |  <- "All invented by AI chefs" in accent
|  [48px padding]                           |
+------------------------------------------+
```

"All invented by AI chefs" is the viral hook -- it invites the question "wait, what?"

### 12.3 Debate Moment Card

A shareable snapshot of a funny debate moment.

```
+------------------------------------------+
|  [48px padding]                           |
|                                           |
|  [Chef avatar]                            |
|  [Speech bubble with funny quote]         |  <- Large, 20px, the star
|  [8px gap]                                |
|  -- Max Flavour, on tacos               |  <- 14px, chef color, italic
|                                           |
|  [flexible space]                         |
|                                           |
|  ForkIt                  [QR 80x80]      |
|  "Your council awaits"   forkit.app      |
|  [48px padding]                           |
+------------------------------------------+
```

- Features the funniest/most quotable line from a debate
- Chef avatar and signature color prominent
- Large quote text for readability in social feeds

### 12.4 Open Graph / Link Preview

```html
<meta property="og:title" content="[Dish Name] -- invented by [Chef Name]" />
<meta property="og:description" content="5 AI chefs debated. This is what they came up with. Fork it." />
<meta property="og:image" content="[recipe share card image URL]" />
<meta property="og:type" content="article" />
```

The dish name + "invented by [Chef]" as og:title creates intrigue. "5 AI chefs debated" as description drives clicks -- it's too weird not to click.

---

## 13. Animations & Transitions

### 13.1 Principles

- **Entertainment-grade:** The debate IS animation. Animations are not decorative -- they ARE the product.
- **Fast for UI, theatrical for debate:** UI transitions 150-300ms. Debate animations can be slower and more dramatic.
- **Eased:** `ease-out` for entries, `ease-in` for exits, springs for physical interactions.
- **Interruptible:** All animations can be cancelled by user interaction. User tapping during reveal skips to final state.
- **Spring for touch, bezier for transitions:** Direct-manipulation responses (button press, drag) use spring physics. State transitions (crossfades, slides) use cubic-bezier.

### 13.2 Animation Inventory

| Element | Trigger | Duration | Easing | Description |
|---------|---------|----------|--------|-------------|
| Fork It button pulse | Idle | 3s loop | ease-in-out | Scale 1.0->1.02->1.0 + glow intensity oscillation |
| Fork It button press | Tap down | 100ms | spring (500/30) | Scale to 0.92 |
| Fork It button release | Tap up | 200ms | spring (300/20) | Scale back to 1.0, glow flare to 0.7 opacity |
| Chef entrance | Debate start | ~600ms | spring (200/15), stagger 100ms | Avatars fly to table positions from off-screen |
| Speech bubble in | New message | ~250ms | spring (300/20) | Scale 0.8->1.0 + y:20->0 + opacity 0->1 |
| Speech bubble out | Replaced | 100ms | ease-in | Fade + shrink + upward drift |
| Chef speaking ring | Active speaker | 1.5s loop | ease-in-out | Ring pulse: scale 1->1.3->1 + opacity 0.6->0->0.6 |
| Chef shake (disagree) | Disagreement | 300ms | ease-in-out | 2 horizontal oscillations, 3px amplitude |
| Timer color shift | Threshold | 300ms | ease-in-out | Green->amber at 20s, amber->red at 10s |
| Timer pulse (urgent) | <10s | 1s loop (0.5s at <5s) | ease-in-out | Scale 1.0->1.05->1.0 |
| Winner spotlight | Timer hits 0 | 500ms | spring (300/20) | Winner scales 1.3, losers fade to 0.2 |
| Crown badge | Winner selected | ~300ms | spring (400/15) | Scale 0->1 + y:10->0 above avatar |
| Recipe photo reveal | Reveal sequence | 800ms | ease-out | Scale 0.9->1.0 + opacity 0->1 |
| Dish name stagger | Reveal sequence | ~600ms | ease-out, 30ms/char | Characters fade in sequentially |
| Confetti burst | Winner announced | 1s | gravity (custom) | 15 particles in chef color, gravity-affected |
| "Make This" button in | Reveal complete | ~300ms | spring (300/20) | Scale 0.95->1.0 + opacity |
| Bottom sheet open | Trigger | ~300ms | spring (25/350) | Slides up + backdrop fade |
| Bottom sheet close | Dismiss | 200ms | ease-in | Slides down |
| History card appear | Scroll into view | 200ms | ease-out | Opacity 0->1 + y:10->0 (staggered 50ms) |
| Daily limit dot deplete | Invention used | 300ms | ease-out | Dot color fades from accent to subtle |
| Mode toggle (dark/light) | Settings tap | 300ms | ease-in-out | CSS variable crossfade |
| Bottom nav tab switch | Tap | 150ms | spring (400/25) | Active icon scales 1.05, fills with accent |

### 13.3 Framer Motion Variants

```tsx
// Fork It button idle pulse
const forkItPulse = {
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 40px rgba(229,57,53,0.3)",
      "0 0 60px rgba(229,57,53,0.5)",
      "0 0 40px rgba(229,57,53,0.3)",
    ],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Speech bubble
const bubbleVariants = {
  enter: { opacity: 0, scale: 0.8, y: 20 },
  center: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0, scale: 0.9, y: -10,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

// Chef entrance (staggered)
const chefEntrance = {
  hidden: (i: number) => ({
    x: [200, -200, 200, -200, 0][i],
    y: [-200, -200, 200, 200, 200][i],
    scale: 0.5,
    opacity: 0,
  }),
  visible: (i: number) => ({
    x: 0, y: 0, scale: 1, opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: i * 0.1,
    },
  }),
};

// Winner spotlight
const winnerVariants = {
  winner: {
    scale: 1.3, opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.3 },
  },
  loser: {
    scale: 0.9, opacity: 0.2,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.3 },
  },
};

// Recipe reveal photo
const photoReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.6 },
  },
};

// Dish name character stagger
const dishNameVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};
const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Bottom sheet
const sheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 350 },
  },
  exit: {
    y: "100%", opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Confetti particle
const confettiParticle = (angle: number, distance: number, color: string) => ({
  initial: { x: 0, y: 0, opacity: 0.6, scale: 1 },
  animate: {
    x: Math.cos(angle) * distance,
    y: [Math.sin(angle) * distance * 0.5, Math.sin(angle) * distance + 100],
    opacity: [0.6, 0.6, 0],
    scale: [1, 0.8, 0.4],
  },
  transition: { duration: 1, ease: "easeOut" },
});
```

### 13.4 Reduced Motion

Respect `prefers-reduced-motion: reduce`:

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

// When reduced motion is preferred:
// - Fork It button: no pulse, static glow
// - Chef entrance: instant position, no fly-in
// - Speech bubbles: instant appear/disappear, no spring
// - Debate escalation: no shake, no bounce
// - Recipe reveal: instant display of all elements
// - Confetti: disabled entirely
// - Timer: color changes instant, no pulse
// - All UI transitions: instant
```

---

## 14. Responsive & Mobile-First

### 14.1 Breakpoints

| Breakpoint | Width | Tailwind | Primary Use |
|------------|-------|----------|-------------|
| Mobile | < 768px | Default | Primary design target. Full-screen layouts. |
| Tablet | 768-1023px | `md:` | Slightly wider content, larger button. |
| Desktop | 1024px+ | `lg:` | Centered content column, app shell expands. |

### 14.2 Mobile-First Approach

Everything is designed for 375px width first. Scaling up is additive:

**Mobile (default):**
- Full-screen home, debate, and reveal
- Side padding: 20px (`px-5`)
- Fork It button: 200px diameter
- Bottom bar is primary navigation
- Touch targets: minimum 44x44px
- Speech bubbles: max-width 240px

**Tablet (md:):**
- Side padding increases to 32px (`md:px-8`)
- Content max-width: 600px, centered
- Fork It button: 240px diameter
- Chef avatars: 56px (from 48px)
- Speech bubbles: max-width 280px

**Desktop (lg:):**
- Content column: 600px max-width, centered in viewport
- Optional: sidebar with history (could be deferred)
- Keyboard shortcuts (see below)
- Cursor hover states on interactive elements
- Fork It button: 240px, with hover-intensified glow

### 14.3 Safe Areas

```css
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

All fixed-position elements (top bar, bottom nav, sheets) respect device safe areas.

### 14.4 Touch Targets

- Minimum touch target: 44x44px (Apple HIG)
- Fork It button: 200x200px (well above minimum)
- "Make This" button: 56px height minimum
- Chef avatars in settings: 48x48px with full-row tap target
- Bottom nav items: 44x44px each
- Ingredient checkboxes: full row is tap target (44px min height)
- Back button: 44x44px

### 14.5 Desktop Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / Enter | Fork It (on home), Make This (on recipe) |
| Escape | Close bottom sheet, dismiss overlay, go back |
| 1-5 | Toggle chef selection (in settings) |
| S | Share current recipe |
| H | Go to history |
| Arrow Left/Right | Navigate history grid |
| Arrow Up/Down | Scroll recipe card |

---

## 15. Accessibility

### 15.1 Reduced Motion

Respect `prefers-reduced-motion: reduce` (already documented in Section 13.4).

### 15.2 Focus Management

- All interactive elements have visible focus rings: `focus-visible:ring-2 focus-visible:ring-forkit-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-forkit-bg`
- Focus ring only appears on keyboard navigation (`:focus-visible`), not on mouse/touch
- Tab order follows visual layout: top bar -> main content -> bottom nav
- Bottom sheet traps focus when open; Escape closes and returns focus to trigger element
- Chef picker: arrow keys navigate between chefs, Enter/Space toggles

### 15.3 Screen Reader Support

- Fork It button: `aria-label="Start a new recipe debate"`, `role="button"`
- Debate timer: `role="timer"`, `aria-live="polite"`, `aria-label="Debate timer, {timeLeft} seconds remaining"`
- Speech bubbles: `aria-live="polite"` on the debate container so screen readers announce new messages
- Chef avatars: `aria-label="{chefName}, {isActive ? 'speaking' : 'listening'}"`
- Recipe card: `role="article"`, `aria-label="Recipe: {dishName}, by {chefName}"`
- Ingredient checkbox: `role="checkbox"`, `aria-checked`, `aria-label="{quantity} {unit} {ingredient}"`
- "Make This" button: `aria-label="Make this recipe"`, `aria-pressed` after tap
- Daily limit: `aria-label="{remaining} of 10 inventions remaining today"`
- Bottom sheet: `role="dialog"`, `aria-modal="true"`, `aria-label` describing the sheet content
- History grid: `role="grid"` with `role="gridcell"` on each card

### 15.4 Color Contrast

All text meets WCAG AA minimum contrast ratios:
- `text-primary` (#F5F5F5) on `bg-primary` (#0A0A0A): 18.1:1
- `text-secondary` (#A0A0A0) on `bg-primary` (#0A0A0A): 9.2:1
- `text-tertiary` (#666666) on `bg-primary` (#0A0A0A): 4.6:1 (meets AA for large text only -- used only for metadata/captions at 13px+)
- `accent` (#E53935) on `bg-primary` (#0A0A0A): 5.1:1 (passes AA for normal text)
- Chef colors on dark backgrounds:
  - Max Flavour (#FF6B35) on #0A0A0A: 5.8:1
  - Maximum Junk (#FFD700) on #0A0A0A: 12.4:1
  - Gut Fix (#7CB342) on #0A0A0A: 6.3:1
  - Budget King (#26A69A) on #0A0A0A: 5.7:1
  - Speed Demon (#AB47BC) on #0A0A0A: 4.6:1 (passes AA for large text / bold 14px+)
- Light mode equivalents verified similarly
- All interactive elements pass at their usage size

### 15.5 Touch Accessibility

- All touch targets minimum 44x44px (Apple HIG, WCAG 2.5.5)
- Adequate spacing between tap targets (minimum 8px gap)
- Speech bubbles are read-only -- no accidental interactions during debate
- Fork It button is 200px -- impossible to miss
- No gesture-only interactions -- every swipe has a button alternative

### 15.6 Debate Accessibility

- Speech bubbles are announced via `aria-live` for screen readers
- Timer countdown is announced at 10s, 5s, and 0s intervals
- Winner announcement: `aria-live="assertive"` -- "{chefName} wins with {dishName}"
- Users who cannot perceive animations still get the full content through text announcements

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
        forkit: {
          bg: "var(--forkit-bg)",
          elevated: "var(--forkit-elevated)",
          subtle: "var(--forkit-subtle)",
          stage: "var(--forkit-stage)",
          primary: "var(--forkit-primary)",
          secondary: "var(--forkit-secondary)",
          tertiary: "var(--forkit-tertiary)",
          accent: "var(--forkit-accent)",
          "accent-hover": "var(--forkit-accent-hover)",
          border: "var(--forkit-border)",
          error: "var(--forkit-error)",
          success: "var(--forkit-success)",
        },
        chef: {
          max: "#FF6B35",
          junk: "#FFD700",
          gut: "#7CB342",
          budget: "#26A69A",
          speed: "#AB47BC",
        },
        premium: {
          gold: "#FFD700",
          "gold-dark": "#D4A017",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "dish-name": [
          "36px",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "dish-name-sm": [
          "28px",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "forkit-button": [
          "24px",
          { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "800" },
        ],
        "chef-speech": [
          "16px",
          { lineHeight: "1.4", fontWeight: "400" },
        ],
        "chef-name": [
          "14px",
          { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "section-header": [
          "20px",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        timer: [
          "48px",
          { lineHeight: "1", fontWeight: "700" },
        ],
      },
      borderColor: {
        forkit: "var(--forkit-border)",
      },
      animation: {
        "button-pulse": "button-pulse 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "chef-speak": "chef-speak 1.5s ease-in-out infinite",
        "timer-urgent": "timer-urgent 1s ease-in-out infinite",
        "timer-critical": "timer-critical 0.5s ease-in-out infinite",
        "pro-glow": "pro-glow 3s ease-in-out infinite alternate",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        "button-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 40px rgba(229,57,53,0.3)",
          },
          "50%": {
            boxShadow: "0 0 60px rgba(229,57,53,0.5)",
          },
        },
        "chef-speak": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.3)", opacity: "0" },
        },
        "timer-urgent": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "timer-critical": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "pro-glow": {
          "0%": { textShadow: "0 0 4px #FFD700" },
          "100%": { textShadow: "0 0 8px #FFD700, 0 0 16px #FFD700" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
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
    --forkit-bg: #0A0A0A;
    --forkit-elevated: #141414;
    --forkit-subtle: #1A1A1A;
    --forkit-stage: #111111;
    --forkit-primary: #F5F5F5;
    --forkit-secondary: #A0A0A0;
    --forkit-tertiary: #666666;
    --forkit-accent: #E53935;
    --forkit-accent-hover: #EF5350;
    --forkit-border: #1E1E1E;
    --forkit-error: #FF4444;
    --forkit-success: #66BB6A;
  }

  /* Light mode */
  .light {
    --forkit-bg: #FAFAFA;
    --forkit-elevated: #FFFFFF;
    --forkit-subtle: #F0F0F0;
    --forkit-stage: #F5F5F5;
    --forkit-primary: #111111;
    --forkit-secondary: #555555;
    --forkit-tertiary: #999999;
    --forkit-accent: #C62828;
    --forkit-accent-hover: #B71C1C;
    --forkit-border: #E5E5E5;
    --forkit-error: #DC3545;
    --forkit-success: #43A047;
  }

  body {
    @apply bg-forkit-bg text-forkit-primary font-sans antialiased;
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

  /* Stage spotlight gradient */
  .bg-stage-spotlight {
    background:
      radial-gradient(
        circle at 50% 30%,
        rgba(255, 255, 255, 0.03) 0%,
        transparent 70%
      ),
      var(--forkit-stage);
  }

  /* Bottom bar gradient fade */
  .bg-fade-up {
    background: linear-gradient(
      to top,
      var(--forkit-bg) 0%,
      var(--forkit-bg) 60%,
      transparent 100%
    );
  }

  /* Photo gradient overlay */
  .bg-photo-overlay {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 100%
    );
  }

  /* Noise texture overlay */
  .bg-noise {
    background-image: url("data:image/svg+xml,..."); /* inline noise SVG */
    background-repeat: repeat;
    opacity: 0.03;
  }

  /* Shimmer loading state */
  .bg-shimmer {
    background: linear-gradient(
      90deg,
      var(--forkit-subtle) 25%,
      var(--forkit-elevated) 50%,
      var(--forkit-subtle) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  /* Fork It button glow */
  .glow-forkit {
    box-shadow: 0 0 40px rgba(229, 57, 53, 0.3);
  }

  /* Chef color ring utilities */
  .ring-chef-max { --tw-ring-color: #FF6B35; }
  .ring-chef-junk { --tw-ring-color: #FFD700; }
  .ring-chef-gut { --tw-ring-color: #7CB342; }
  .ring-chef-budget { --tw-ring-color: #26A69A; }
  .ring-chef-speed { --tw-ring-color: #AB47BC; }

  /* Border-left chef accent for speech bubbles */
  .border-l-chef-max { border-left-color: #FF6B35; }
  .border-l-chef-junk { border-left-color: #FFD700; }
  .border-l-chef-gut { border-left-color: #7CB342; }
  .border-l-chef-budget { border-left-color: #26A69A; }
  .border-l-chef-speed { border-left-color: #AB47BC; }
}
```

---

## 17. Navigation

### 17.1 Bottom Tab Bar (4 Tabs)

Fixed bottom bar, always visible. Clean, minimal.

**Tabs (left to right):**
1. **Home** (fork-and-knife icon) -- the Fork It button screen, default landing
2. **History** (clock-arrow icon) -- past inventions in grid
3. **Pantry** (shopping-bag icon) -- ingredient management (premium badge if locked)
4. **Profile** (avatar circle) -- settings, subscription, chef preferences, stats

```tsx
<nav className={cn(
  "fixed bottom-0 inset-x-0 z-50",
  "h-14 pb-safe",
  "bg-forkit-bg/80 backdrop-blur-xl",
  "border-t border-forkit",
  "flex items-center justify-around"
)}>
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={cn(
        "flex flex-col items-center gap-0.5 p-2",
        tab.active ? "text-forkit-accent" : "text-forkit-tertiary"
      )}
    >
      <tab.Icon className={cn("w-6 h-6", tab.active && "scale-105")} />
      <span className="text-[10px]">{tab.label}</span>
      {tab.id === "pantry" && !isPro && (
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-premium-gold" />
      )}
    </button>
  ))}
</nav>
```

**Behavior:**
- Translucent blur background (`backdrop-blur-xl`)
- Active tab: accent-colored filled icon + subtle scale-up (1.05x)
- Inactive: outlined icon in tertiary color
- Tapping active Home tab: if already on home, Fork It button plays entrance animation again
- Pantry tab: small gold dot indicator if user is on free tier (indicating premium)

**Auto-hide logic:**
- During Council Debate: tab bar hides (debate occupies full viewport)
- During Recipe Reveal sequence: tab bar hides
- On Recipe Card (full detail): tab bar visible
- On all other screens: always visible

**Home tab interaction:**
- Tap navigates to home screen with Fork It button
- The button's red glow provides a subtle "beacon" that draws the eye even in the nav bar context

### 17.2 History Tab -- Past Inventions

Two display modes:

**Grid view (default):** 2-column grid of recipe photo cards (see Section 7.4)

**List view (toggle):** Single-column list with horizontal cards:
```tsx
<div className="flex gap-3 p-3 bg-forkit-elevated rounded-xl border border-forkit">
  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
    <Image src={recipe.photoUrl} alt={recipe.dishName} fill className="object-cover" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-[15px] font-semibold text-forkit-primary line-clamp-1">
      {recipe.dishName}
    </p>
    <div className="flex items-center gap-1.5 mt-1">
      <ChefAvatar id={recipe.chefId} size={16} />
      <span className="text-[11px] text-forkit-tertiary">{recipe.chefName}</span>
    </div>
    <span className="text-[11px] text-forkit-tertiary mt-1">
      {recipe.timeAgo}
    </span>
  </div>
</div>
```

**Filter options:**
- All (default)
- By chef (tap chef avatar to filter)
- By "Made it" (recipes user marked as cooked)
- Sort: newest first (default), oldest first

### 17.3 Profile Tab

```
+------------------------------------------+
|  [safe-area-top]                          |
|                                           |
|  [User avatar]                            |
|  [Username]                               |
|  [Free / Pro badge]                       |
|                                           |
|  --- Stats ---                            |
|  [42 inventions] [12 made] [5-day streak] |
|                                           |
|  --- Your Council ---                     |
|  [Chef picker -- see Section 8.1]         |
|                                           |
|  --- Settings ---                         |
|  [Dark/Light mode toggle]                 |
|  [Dietary preferences]                    |
|  [Notification preferences]               |
|  [Subscription management]                |
|                                           |
|  --- About ---                            |
|  [Terms] [Privacy] [Support]              |
|                                           |
|  [Sign out]                               |
|  [safe-area-bottom]                       |
+------------------------------------------+
```

---

## 18. Pantry Management UI

### 18.1 Premium Feature Gate

Pantry is a Pro feature. Free tier users see:

```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <LockClosedIcon className="w-12 h-12 text-premium-gold/60 mb-4" />
  <p className="text-[17px] text-forkit-primary font-medium mb-1">
    Pantry is a Pro feature.
  </p>
  <p className="text-[15px] text-forkit-secondary mb-6">
    Tell the chefs what you've got. They'll get creative.
  </p>
  <button className="px-6 py-3 rounded-full bg-premium-gold text-[#111111] font-semibold text-[15px]">
    Unlock Pantry -- Go Pro
  </button>
</div>
```

### 18.2 Pantry Main View (Pro)

```
+------------------------------------------+
|  [safe-area-top]                          |
|                                           |
|  Your Pantry                 [+ Add]      |
|                                           |
|  [Search: "Find an ingredient..."]        |
|                                           |
|  --- Proteins (4) ---                     |
|  [x] Chicken breast                       |
|  [x] Ground beef                          |
|  [x] Eggs                                 |
|  [x] Tofu                                 |
|                                           |
|  --- Grains & Carbs (3) ---               |
|  [x] Rice                                 |
|  [x] Pasta                                |
|  [x] Bread                                |
|                                           |
|  --- Vegetables (5) ---                   |
|  [x] Onions                               |
|  [x] Garlic                               |
|  [x] Bell peppers                         |
|  [x] Spinach                              |
|  [x] Tomatoes                             |
|                                           |
|  --- Dairy (2) ---                        |
|  [x] Cheese                               |
|  [x] Butter                               |
|                                           |
|  --- Pantry Staples (3) ---               |
|  [x] Olive oil                            |
|  [x] Soy sauce                            |
|  [x] Salt & pepper                        |
|                                           |
|  [Bottom nav]                             |
+------------------------------------------+
```

### 18.3 Ingredient Item

```tsx
<div className={cn(
  "flex items-center gap-3 py-3 px-4",
  "active:bg-forkit-subtle",
  "transition-colors duration-100"
)}>
  <div className={cn(
    "w-5 h-5 rounded flex-shrink-0 flex items-center justify-center",
    "border border-forkit",
    isActive && "bg-forkit-success border-forkit-success"
  )}>
    {isActive && <CheckIcon className="w-3 h-3 text-white" />}
  </div>
  <span className={cn(
    "flex-1 text-[15px]",
    isActive ? "text-forkit-primary" : "text-forkit-tertiary line-through"
  )}>
    {ingredientName}
  </span>
  <button className="p-1 text-forkit-tertiary">
    <TrashIcon className="w-4 h-4" />
  </button>
</div>
```

- Rounded checkbox (not circle -- distinguishes from recipe ingredient list)
- Active (in pantry): primary text, green checkbox
- Inactive (out of stock): tertiary text, line-through, empty checkbox
- Swipe left to delete (with red "Remove" action behind)
- Tap to toggle in/out of stock

### 18.4 Add Ingredient

**Quick add bar:**
```tsx
<div className={cn(
  "fixed bottom-14 inset-x-0 z-40",
  "px-5 py-3",
  "bg-forkit-bg/80 backdrop-blur-xl",
  "border-t border-forkit"
)}>
  <div className="flex gap-2">
    <input
      className={cn(
        "flex-1 px-4 py-3 rounded-xl",
        "bg-forkit-subtle border border-forkit/50",
        "text-forkit-primary text-[15px]",
        "placeholder:text-forkit-tertiary",
        "focus:border-forkit-accent/50 focus:ring-1 focus:ring-forkit-accent/20"
      )}
      placeholder="Add an ingredient..."
    />
    <button className="px-4 py-3 rounded-xl bg-forkit-accent text-white font-medium">
      Add
    </button>
  </div>
</div>
```

- Autocomplete suggestions appear above the input as a floating list
- Suggestions use fuzzy matching (fuse.js)
- Categories are auto-assigned based on ingredient type
- Bulk add: comma-separated input ("chicken, rice, garlic") adds all three

### 18.5 Pantry Integration with Debate

When pantry has items and user taps Fork It:
- Chefs consider pantry ingredients in their suggestions
- Speech bubble occasionally references pantry: "You've got chicken and rice -- let me work with that."
- Recipe results prioritize pantry ingredients
- Ingredients NOT in pantry are flagged with a small shopping-bag icon in the recipe ingredient list

---

## 19. UI Copy & Brand Voice Reference

### 19.1 Complete Voice Table

| Context | Copy |
|---------|------|
| Home screen tagline | "What should I eat?" |
| Home screen tagline (late night) | "Late night? Fork it." |
| First tap hint | "Tap it. Trust us." |
| Debate starting | "The council is assembling..." |
| Debate active | (chef speech bubbles -- see Section 10) |
| Timer at 10s | (no text -- timer color change to red) |
| Winner announcement | "Your council has spoken." |
| Recipe reveal | (dish name + details, no extra copy) |
| After first recipe | "That was fun, right?" |
| Make This (tapped) | "Making it!" |
| Recipe saved | "Saved. It's not going anywhere." |
| Share prompt | "Another masterpiece nobody asked for." |
| Daily limit (3 left) | "3 left today. Make 'em count." |
| Daily limit (0 left) | "That's 10 for today." |
| Daily limit (tomorrow) | "Come back tomorrow, or go unlimited." |
| Pro unlock | "Welcome to Pro. Unlimited chaos unlocked." |
| Pantry locked | "Pantry is a Pro feature." |
| Empty history | "Nothing yet. Hit the button." |
| Empty pantry | "Your pantry's empty. That's... honest." |
| Streak (3 days) | "3 days of forking it." |
| Error state | "Something broke. Fork it, try again?" |
| Offline state | "No connection. Fork it later?" |
| Auth prompt title | "That was fun, right?" |
| Auth prompt body | "Save your recipes and pick your chefs." |
| Chef settings header | "Your Council" |
| Chef minimum warning | "You need at least 2 chefs." |
| Pantry add placeholder | "Add an ingredient..." |
| Search placeholder | "Search your inventions..." |
| Report submitted | "Thanks. We'll look into it." |
| Network retry | "Couldn't load. Pull to retry." |

### 19.2 Voice Rules

- **Contractions always:** "you're" not "you are", "that's" not "that is"
- **Max 10 words** per UI string. If it's longer, rewrite.
- **No emoji** in UI text. The chefs are the personality.
- **Periods for statements,** question marks only for genuine choices
- **"Fork it" is sacred.** Use it sparingly, never in error states.
- **Never exclamation marks** in error states or empty states
- **Imperative voice preferred.** "Hit the button." not "You could try pressing the button."
- **No condescending positivity.** Not "Great job!" Not "You're doing amazing!" The voice is a chill friend, not a life coach.

### 19.3 Chef Speech Patterns

Each chef has distinct verbal tics:

| Chef | Speech Pattern | Example |
|------|---------------|---------|
| Max Flavour | Dramatic, uses "NEED" and "BOLD" | "This dish NEEDS cumin. I'm not arguing." |
| Maximum Junk | Casual, uses "bro" and food slang | "Bro, just deep fry it. Trust." |
| Gut Fix | Measured, references health | "Your microbiome would prefer we add kimchi." |
| Budget King | Dollar-aware, clever | "$2 of rice, $1 of beans. You're welcome." |
| Speed Demon | Time references, impatient | "That takes 45 minutes. I can do better in 10." |

---

## 20. Gesture Map & Interaction Patterns

### 20.1 Home Screen Gestures

- **Tap Fork It button:** Start debate
- **Long-press Fork It button (500ms):** Quick-pick mode -- skips debate, immediate recipe. Haptic feedback on trigger.
- **Swipe down:** Refresh (if applicable -- mostly static)

### 20.2 Debate Screen Gestures

- **Tap anywhere during debate:** No effect (debate is non-interactive -- users watch)
- **Tap close button (X):** Cancel debate, return to home. Confirmation: "Leave the debate?" with "Stay" / "Leave" options.
- **No horizontal swipes:** The debate is a linear experience

### 20.3 Recipe Card Gestures

- **Scroll vertically:** Navigate recipe sections (photo -> name -> ingredients -> steps)
- **Tap ingredient checkbox:** Toggle checked state
- **Swipe left on ingredient:** Reveal "Remove" action (red)
- **Tap photo:** Full-screen photo view with pinch-to-zoom
- **Long-press recipe card (from history):** Share card preview. Haptic feedback on trigger.

### 20.4 History Screen Gestures

- **Scroll vertically:** Browse past inventions
- **Tap card:** Open full recipe
- **Pull to refresh:** Sync with server
- **Long-press card:** Quick actions bottom sheet (Share, Delete, Make Again)

### 20.5 Pantry Gestures

- **Tap ingredient:** Toggle in/out of stock
- **Swipe left on ingredient:** Delete action
- **Pull to refresh:** Sync pantry with server

### 20.6 Progressive Disclosure Timeline

| Event | Trigger | Message/UX |
|-------|---------|------------|
| First open | App launch | Straight to Fork It button. No walls. Glow-up entrance. |
| First tap hint | 3s idle on home | "Tap it. Trust us." ghost text (20% opacity, 3s, once) |
| First debate | Button tap | Full debate experience, no skipping |
| Auth prompt | After first recipe | "That was fun, right?" bottom sheet (dismissible) |
| Daily limit shown | After 7th invention | Daily limit dots become visible in UI |
| Pantry tease | After 3rd invention | Small banner: "Got ingredients at home? Go Pro for Pantry." |
| Streak discovery | 3 consecutive days | Inline card: "3 days of forking it." |
| Pro upsell (soft) | After 5th invention | Toast: "Pro users get unlimited inventions." |
| Pro upsell (hard) | Daily limit hit | Replaces Fork It button with upgrade card |

---

## 21. Edge Cases

### 21.1 Content Edge Cases

- **Empty debate (no messages generated):** Show "The council is thinking..." loading state for 3s, then fallback: "The chefs couldn't decide. Fork it again?" with retry button.
- **Single-chef debate (user selected only 2):** Debate is a back-and-forth between 2 chefs. Layout adjusts: avatars face each other across the table, no pentagon formation.
- **API timeout during debate:** Timer pauses. Show "The chefs lost their train of thought. Trying again..." Auto-retry once. On second failure: return to home with error toast.
- **Recipe photo fails to load:** Show `bg-forkit-subtle` with fork-and-knife icon at 20% opacity. Recipe card still fully functional without photo.
- **Extremely long dish name (>50 chars):** Scale down to `dish-name-sm` (28px). Clamp to 2 lines with ellipsis.
- **Network error during recipe save:** Queue locally. Sync when connection returns. Show "Saved locally. Will sync when you're back online."

### 21.2 Debate Edge Cases

- **User closes app during debate:** On reopen, debate is lost. User returns to home screen. No partial recipe saved.
- **Timer reaches 0 before any messages:** Should not happen (messages are pre-generated). Failsafe: skip to recipe reveal with randomly selected winner.
- **All chefs agree immediately (no argument):** Still run the 30s timer but with collaborative messages instead of arguments. Rare but valid state. "We actually agree on this one. Weird."
- **Two chefs tie for winner:** Tiebreaker goes to the chef with higher user preference score. If still tied: random selection.

### 21.3 Interaction Edge Cases

- **Double-tap Fork It:** Second tap is no-op. Button enters disabled state after first tap completes (300ms debounce).
- **Fork It while offline:** Show "No connection. Fork it later?" toast. Button does not enter pressed state.
- **Rapid tab switching:** Each tab loads independently. No race conditions in navigation state.
- **Swipe during bottom sheet:** Bottom sheet dismisses. Underlying content does not scroll simultaneously.
- **Back gesture during debate:** Pauses timer, shows "Leave the debate?" confirmation. "Stay" resumes timer.
- **"Make This" while not authenticated:** Trigger auth prompt. After auth, "Make This" is applied retroactively.
- **Pantry bulk add with duplicates:** Silently de-duplicate. No error message for user-friendly behavior.

### 21.4 Premium / Monetization Edge Cases

- **Pro subscription expires mid-session:** Current session is unaffected. On next app open, pantry is locked, daily limits re-enabled. No mid-recipe interruption.
- **Free user tries to access pantry:** Gate screen (Section 18.1). No crash, no blank screen.
- **Daily limit counter at midnight:** Dots refill with a brief cascade animation (100ms per dot). If user is actively in app at midnight: "You've got 10 fresh inventions. Fork it."
- **Subscription purchase fails:** Payment provider error is shown. User remains on free tier. No partial state.

### 21.5 Device Edge Cases

- **Very small screen (<320px):** Fork It button scales to 160px. Speech bubbles max-width drops to 200px. Layout remains functional.
- **Very large screen (>1440px):** Content column stays at 600px max-width. Extra space is dark background. No side panels (v1).
- **Landscape orientation:** Not optimized. Show gentle prompt: "ForkIt works best in portrait." Content still scrollable but layout may not be ideal.
- **Screen reader during debate:** Full aria-live support (Section 15.6). Debate is experienced as a real-time conversation feed.
- **Low-end device (slow animations):** Detect via `navigator.hardwareConcurrency < 4`. Reduce confetti particle count to 5. Simplify spring physics to linear easing. Skip glow effects.

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark mode primary | Yes | Debate stage, food photography, and the red button all work better on dark. Night-time use case. |
| Accent color | ForkIt Red #E53935 | Bold, appetizing red. Not aggressive, not cheap. "Neon sign at a great restaurant." |
| Font | Inter (variable) | Screen-optimized, excellent at all sizes, free, fast. Extra Bold (800) for button + dish name. |
| Illustrated chefs, not photorealistic | Character appeal | Illustrated = expressive at small size, consistent style, unique brand. Photorealistic = uncanny valley at 48px. |
| 5 distinct chef colors | Instant recognition | Each chef is identifiable by color alone at speech-bubble-border size (2px). |
| Fork It button: 200px, glowing | THE product IS a button | One button. One action. The glow makes it irresistible. Everything else is secondary. |
| 30-second debate timer | Entertainment + utility | Short enough to feel fast, long enough for 5 chefs to say something funny. |
| Dark stage background for debate | Theatrical | The debate is a show. Dark stage + bright avatars + colored speech bubbles = entertainment. |
| Recipe photo at 4:3 | Food photography standard | Landscape crop is how food looks best. Square crops cut off plating. |
| Confetti in chef color | Subtle celebration | 15 particles at 60% opacity. Fun but not Candy Crush. Disabled in reduced motion. |
| Max 10 words per UI string | Snappy voice | The app should feel like a witty friend, not a paragraph. |
| Premium gold (#FFD700) for Pro | Universal "premium" signal | Gold = premium in every culture. Stands out against both dark and light mode. |
| No emoji in UI | Chefs are the personality | The 5 illustrated characters carry all emotional expression. Emoji would dilute them. |
| Pantry as Pro feature | Clear value prop | Free = the button + debate + recipe. Pro = pantry + unlimited. Simple upgrade story. |
| Spring physics for button/bubbles | Tactile feel | Springs make digital interactions feel physical. The big button NEEDS to feel like a real button. |
| Reduced motion: full fallback | Accessibility | Every animation has an instant alternative. Content and functionality are never gated by animation. |
