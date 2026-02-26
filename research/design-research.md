# Caper Media -- Design Research Notes

**Researched:** 2026-02-26
**Site:** https://caper.media/
**Platform:** Beehiiv (with Typedream website builder integration)
**Cloudflare protected** -- site blocks automated scraping, so some details are inferred from CSS analysis + press coverage.

---

## What Caper Is

Caper is a food media startup covering "the people, money, ambition, power and chaos that fuels the food world." Think Puck but for food. Founded by Max Tcheyan (The Athletic, Puck) and Dan Tsinis (Roku, Puck, Disney), with Dana Brown (former Vanity Fair deputy editor) as EIC. $2.5M seed funded. Launched on Beehiiv in soft-launch mode, applying The Athletic's city-based model to food.

Core team: Chris Crowley (NY Mag), Emma Orlow (Eater), Annie Armstrong (Artnet News), Ella Quittner, Matthew Schneier. ~6 employees.

**Positioning:** "Pro-sumer thesis" -- serves hospitality industry professionals while attracting food-obsessed consumers. Deep narrative journalism, not lists/reviews.

---

## Typography (from CSS analysis of caper.media)

Caper loads six Google Fonts families. This is a deliberate, editorial-forward type system.

### Primary Fonts

| Font | Role | Style | Weights |
|------|------|-------|---------|
| **Inter** | UI / Headers / Body / Buttons | Sans-serif | System stack fallback |
| **Playfair Display** | Display / Editorial headlines | Serif, high-contrast transitional | 400-900, italic |
| **Spectral** | Long-form body text / Editorial | Serif, warm and readable | 200-800, italic |
| **Instrument Serif** | Accent headlines / Pull quotes | Serif, elegant | 400 regular + italic |
| **Instrument Sans** | Secondary UI / Captions | Sans-serif | 400-700 |
| **IBM Plex Sans** | Tertiary / Utility text | Sans-serif | 100-700, italic |

### Typography Takeaways

- **Serif-forward editorial identity.** Playfair Display and Spectral are the brand signatures -- they signal premium journalism, not tech/startup vibes.
- **Playfair Display** is the high-impact display face: high contrast between thick and thin strokes, classic editorial feel (think Vanity Fair, Vogue, luxury magazines). Used for headlines.
- **Spectral** is the workhorse reading font: designed specifically for screen reading with a warm, humanist quality. Lower contrast than Playfair, comfortable for long articles.
- **Instrument Serif** adds a third texture -- more contemporary and minimal than Playfair, likely used for bylines, pull quotes, or section markers.
- **Inter** handles all the functional UI (nav, buttons, metadata, forms) -- clean and invisible, lets the serifs be the stars.
- **IBM Plex Sans** is probably for small utility text (dates, tags, captions).

### Font Loading

All loaded via Google Fonts with `font-display: swap` for performance. No custom/paid typefaces detected.

---

## Color Palette

### Core Colors (from CSS custom properties)

| Color | Hex | Usage |
|-------|-----|-------|
| **Dark Navy** | `#030712` | Primary brand color, text on light backgrounds |
| **Off-White** | `#F9FAFB` | Text on dark backgrounds, secondary background |
| **Pure White** | `#FFFFFF` | Primary background |
| **Dark Text** | `#222222` | Text on white/tertiary backgrounds |

### Extended Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Indigo Accent** | `#6E79D6` | Links, interactive elements, accent (light mode) |
| **Bright Indigo** | `#7381FF` | Accent in dark mode |
| **Neutral Light** | `#F5F5F5` | Subtle backgrounds, cards |
| **Neutral Dark** | `#2A2A2A` | Dark mode surfaces |

### Status/Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Red | `#D02727` | Error state |
| Error | `#FA5252` | Form validation |
| Green | `#39C383` | Success |
| Success | `#12B76A` | Confirmation |
| Amber | `#FDB022` | Warning |
| Warning | `#FDBD47` | Caution |

### Color Takeaways

- **Very restrained palette.** Near-black + white + one indigo accent. This is a "content-first" approach where the writing and imagery are the visual stars, not the chrome.
- **Not warm at all** -- the dark navy (#030712) is almost pure black with a slight blue undertone. The accent indigo (#6E79D6) is cool and muted, not bright.
- **Dark mode support** built in via CSS custom properties -- the indigo shifts brighter (#7381FF) in dark mode.
- **No food-y colors.** No warm reds, oranges, greens. This is deliberately anti-"food blog." The palette says journalism and media, not recipes and cooking.

---

## Layout & Structure

### CSS Framework
- **Tailwind CSS** -- extensive utility class usage throughout
- **Typedream** -- Beehiiv's acquired website builder (detected in page config)

### Grid System
- 12-column CSS grid (`grid-cols-12`)
- Flexbox for component-level alignment
- Responsive breakpoints: mobile (max-width 667px), tablet, desktop
- Container max-widths: 42rem (2xl) through 72rem (6xl)

### Spacing
- 8px base unit scaling
- Consistent spacing increments: 0.25rem to 4rem
- Gap patterns: 1rem, 1.5rem, 2rem as primary spacing values

### Design Tokens
- Border radius: **8px** (`--wt-border-radius`) -- softly rounded, not pill-shaped
- Shadows: Subtle and layered (`0px 3px 12px`, `0px 10px 40px -10px`) -- depth without heaviness

### Animations
- Entrance effects: fade-in, slide-in (up/down/left/right), scale-in
- Duration: ~1 second
- Purpose: Page load polish, not interactive flourishes

---

## Brand & Visual Identity

### The Hand-Drawn Aesthetic

This is Caper's most distinctive design choice:

- **Hand-drawn logo** signed by the founding team. They rotate which co-founder's "Caper" signature appears.
- Design philosophy described as "doodling on a cocktail napkin" in a restaurant -- intentionally imperfect, warm, human.
- The site "features a lot of hand drawn work" per press coverage.
- This creates deliberate tension: **the typography and color system is premium/editorial, but the illustrations and branding are loose and human.** That contrast IS the brand.

### Name Origin
- Double meaning: "caper" the ingredient (Mediterranean, the founder's northern Italian heritage) + "caper" as adventure/scheme.
- Conveys: not taking themselves too seriously, celebration, storytelling.

### Mood Board Summary
- **Premium journalism meets restaurant-napkin sketches**
- Think: Vanity Fair's editorial seriousness + a cool independent zine's illustration style
- Dark, restrained, content-first -- NOT a colorful food media brand
- Confident, understated, grown-up

---

## Platform Architecture

### Beehiiv Setup
- **Custom domain:** caper.beehiiv.com redirects 301 to caper.media
- **Website builder:** Typedream (Beehiiv's acquired AI website builder)
- **Payments:** Stripe integration (subscription model)
- **Security:** Cloudflare Turnstile
- **Error tracking:** Sentry (production environment)
- **Scheduling:** Cal.com OAuth integration (for meetings/calls)
- **Ads:** Beehiiv ad network (PixelJS integration detected)
- **Release:** v622 at time of research

### Beehiiv Features in Use
- Custom domain with full DNS control
- Website builder (not just newsletter landing page)
- Stripe payment processing for paid subscriptions
- Ad network monetization
- Author profile pages (e.g., /emma-orlow)

---

## Business Model

- **Subscription-based** with paid tiers (pricing not publicly confirmed)
- **Journalist equity:** Writers get salary + subscription-driven bonuses + equity from day one
- **Ad revenue:** Beehiiv ad network integration active
- **Positioning:** Premium food journalism (Puck model), not volume content

---

## Comparisons & Inspirations

| Aspect | Caper Approach |
|--------|---------------|
| vs. Puck | Same model (insider journalism + subscription) but for food |
| vs. The Athletic | City-based coverage model adapted to food scenes |
| vs. Eater/Grub Street | Narrative-driven, not service journalism (no "best of" lists) |
| vs. Every | Similar premium newsletter feel; Beehiiv vs custom platform |

---

## Design System Summary for Reproduction

If building something that matches Caper's visual language:

### Must-Have
1. **Playfair Display** for headlines (bold, italic variants)
2. **Spectral** for body text (regular + italic)
3. **Inter** for UI elements (nav, buttons, forms)
4. Dark navy (`#030712`) as primary text/brand color
5. White (`#FFFFFF`) backgrounds, off-white (`#F9FAFB`) for secondary
6. Single indigo accent (`#6E79D6`) for links/CTAs
7. 8px border radius on cards/buttons
8. Hand-drawn or illustration-based brand marks

### Recommended
1. **Instrument Serif** for accent type (bylines, pull quotes)
2. Subtle box shadows for depth
3. 12-column grid with generous whitespace
4. Entrance animations (fade-in, slide-up)
5. Dark mode support with CSS custom properties
6. Content-first layout -- imagery and text dominate, minimal UI chrome

### Avoid
1. Bright, warm "foodie" colors (reds, oranges, yellows)
2. Heavy UI frameworks or component-heavy design
3. Pill-shaped buttons or overly rounded corners
4. Stock photography aesthetic
5. Dense, cluttered layouts

---

## Sources

- caper.media CSS/HTML analysis (direct fetch)
- [Andrea Strong, "Caper Digs In"](https://andreastrong.substack.com/p/caper-digs-in) -- founding story, design philosophy, team details
- [Matt Rodbard, "Food Media's Very Interesting 2026"](https://mattrodbard.substack.com/p/food-medias-very-interesting-2026) -- industry context
- [Emily Sundberg Substack note](https://substack.com/@emilysundberg/note/c-189258691) -- early team announcements
- [LinkedIn: Caper](https://www.linkedin.com/company/capermedia) -- company details, team
- [Beehiiv blog: Typedream acquisition](https://blog.beehiiv.com/p/beehiiv-acquires-ai-based-website-builder-typedream) -- platform architecture
