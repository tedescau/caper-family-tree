# feat: Caper Family Tree v0

**Type:** Feature (co-marketing build)
**Partner:** Caper Media (Daniel Tsinis, Max)
**Owner:** Austin (Every)
**Timeline:** 1 day for v0, handoff after launch
**Status:** Ready to build
**Deepened:** 2026-02-26 (8 parallel research agents)

---

## Enhancement Summary

**Key improvements from research:**
1. **fCoSE layout** instead of CoSE — supports hierarchy constraints + lateral connections
2. **Editorial page frame** — title, subtitle, byline above graph (journalism, not a dashboard)
3. **Magazine-style detail cards** — Playfair Display headers, Instrument Serif connections, Spectral body
4. **Font loading defense** — `await document.fonts.ready` before Cytoscape init (prevents fallback font bug)
5. **Build-time Zod validation** — catches broken IDs and bad data before deploy
6. **Expanded muted color palette** — 7 relationship colors that look like uncoated print stock
7. **Simplified scope** — cut embed route, OG generation, fuzzy search, bottom sheet gestures for v0

**Scope reduced ~40%** from original plan. Focus on what makes it impressive: the graph, the data quality, the design.

---

## Overview

Build an interactive "Family Tree" visualization for Caper Media showing restaurant industry relationships — people, restaurants, business connections, and alumni networks. The v0 focuses on the Momofuku umbrella as a proof of concept. The same data layer will eventually feed Caper's editorial reporting.

This is a co-marketing partnership: Every builds the v0, teaches the Caper team to maintain it with Claude Code, and positions it as an example of what's possible with AI-assisted development.

---

## Design Direction

From Daniel (Feb 21): **Black Playfair text on #E2E6DF background.**

### Brand System

| Role | Font | Usage |
|------|------|-------|
| Headlines | Playfair Display 700 | Page title, person names in cards |
| Body | Spectral 400 | Bios, descriptions |
| Accents | Instrument Serif 400 italic | Connection lists, search placeholder |
| UI | Inter 400/500 | Category labels, meta text, legend |

### Color Palette

**Core:**
- Primary text: `#030712` (near-black)
- Background: `#E2E6DF` (warm off-white, Daniel's spec)
- Card background: `#FAFAF7` (slightly warmer than page)
- Accent: `#6E79D6` (muted indigo)

**Relationship edge colors** (muted, uncoated-stock feel):

| Relationship | Color | Line Style |
|---|---|---|
| `alumni` / mentored | `#6E79D6` muted indigo | Dashed |
| `founded` / opened | `#030712` near-black | Solid, thick |
| `current_staff` | `#7C8076` warm slate | Solid, thin |
| `opened_new` | `#B5A48B` warm tan | Dashed with arrow |
| `belongs_to` | `#9CA3AF` light graphite | Solid, gray |
| `family` | `#C4806E` faded terracotta | Solid, no arrow |
| `same_space` | `#9CA3AF` light graphite | Dotted |

**Global edge default opacity: `0.45`** — prevents visual tangle at 50 edges. Selected edges go to `1.0`.

### Node Rendering (Editorial, Not Generic)

| Node Type | Shape | Style |
|-----------|-------|-------|
| Person | Circle (56px) | `#E2E6DF` fill, thin `#030712` border, Playfair Display initials centered |
| Restaurant (active) | Pill / round-rect | `#E2E6DF` fill, solid `#030712` border, Instrument Serif name |
| Restaurant (closed) | Pill / round-rect | Same but `border-style: dashed`, `opacity: 0.45` on label |
| Group / Org | Diamond (40px) | Transparent fill, thin `#030712` border, Inter label below |

**Hover state:** Border widens to 2.5px, shifts to `#6E79D6`. Neighborhood highlight: selected node's edges go full opacity, neighbors at `0.8`, everything else fades to `0.1`.

### Page Layout (Editorial Frame)

**This is an editorial piece that happens to be interactive, not an interactive tool that happens to have content.**

```
┌──────────────────────────────────────────────┐
│  [Caper wordmark]               [Search] [?] │  ← Sticky header, 56px
├──────────────────────────────────────────────┤
│                                              │
│  The Momofuku                                │  ← Playfair Display 48px
│  Family Tree                                 │
│                                              │
│  How one restaurant group shaped a           │  ← Spectral 18px, max-w 520px
│  generation of New York chefs.               │
│                                              │
│  By Caper · Feb 2026                         │  ← Inter 12px, uppercase
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │         [ Interactive Graph ]           │  │  ← 80vh, full width
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [Legend — horizontal strip below graph]      │  ← Not overlaid
│                                              │
└──────────────────────────────────────────────┘
```

### Detail Cards (Magazine Sidebar Style)

```
┌─────────────────────────────────┐
│                                 │
│  CHEF · ACTIVE SINCE 2018      │  ← Inter 10px, tracking +0.08em, 50% opacity
│                                 │
│  Chase Sinzer                   │  ← Playfair Display 20px, weight 700
│                                 │
│  Claud · Penny                  │  ← Instrument Serif 14px, italic, #6E79D6
│                                 │
│  ─────────                      │  ← 1px rule, 12% opacity
│                                 │
│  Ko alum who opened two of the  │  ← Spectral 13px/1.55, 80% opacity
│  East Village's most talked-    │
│  about restaurants in 2022-24.  │
│                                 │
│  2 active · 0 closed            │  ← Inter 11px, 50% opacity
│                                 │
└─────────────────────────────────┘
```

- **Desktop:** Floating card anchored near node, 280px wide, `border-radius: 2px` (editorial, not app-like)
- **Mobile:** Fixed-position panel at bottom with close button (CSS only, no gesture library)

### Loading State

No spinner. Show the editorial frame (title, subtitle) immediately. In the graph area, display a faint hand-drawn network SVG sketch at `opacity: 0.08` with a gentle pulse animation. Text: *"Mapping connections..."* in Instrument Serif italic.

When Cytoscape finishes layout, cross-fade the graph in over 600ms.

---

## Data: The Momofuku Tree

Research saved at `.claude/data/momofuku-family-tree.json` — 17 restaurants, 16 people, 6 organizations, 37 relationship edges.

**Key corrections from research (vs. the hand-drawn diagram):**
- Nikita Malhotra opened **Smithereens** (with Nick Tamburo), NOT Penny. Penny was Chase Sinzer + Joshua Pinsky.
- Telly Justice **never worked at Momofuku**. HAGS took over the original Noodle Bar space — relationship is `same_space`, not `alumni`.
- Theo Ouya is bar manager at Bar Contra, not the owner.
- It's "Sergeantsville Inn" not "Sargentsville Inn."
- "Moonburger" doesn't exist — the David Chang burger concept was Moon Palace (Las Vegas, closed 2022).
- Paddy Spence leads Momofuku Goods specifically, not the overall group.

**Notable narrative angles:**
- The 2024 Alumni Wave: Ko's Nov 2023 closure released a generation of talent (Penny, Smithereens, Kiko, Sergeantsville Inn all launched in 2024)
- Ko as the incubator: nearly every alumni venture traces back to Ko, not Noodle Bar
- Zabar dynasty: Marguerite Zabar Mariscal is great-granddaughter of Zabar's founder
- Momofuku Goods ($67M revenue in 2024) now outpaces the restaurant business

---

## Technical Architecture

### Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14+ (App Router, static export) | `next/font/google` handles font loading (critical for canvas), Vercel-native preview URLs |
| Graph | Cytoscape.js + react-cytoscapejs + cytoscape-fcose | fCoSE supports hierarchy constraints + lateral connections |
| Styling | Tailwind CSS + Cytoscape stylesheets | Tailwind for page chrome, JS tokens for graph styles (Cytoscape can't read CSS vars) |
| Data | 4 JSON files in repo + Zod validation | Git-tracked, Claude Code editable, build-time safety |
| Hosting | Vercel | Zero-config deploys, preview URLs per branch, free tier |

### Why fCoSE (Not CoSE)

The Momofuku tree is a hybrid graph — hierarchical (Momofuku → Ko → alumni) with lateral connections (partnerships, same-space). fCoSE supports **constraint-based layout**:

```typescript
const layout = {
  name: 'fcose',
  quality: 'default',
  animate: true,
  animationDuration: 800,
  nodeRepulsion: () => 4500,
  idealEdgeLength: () => 80,
  edgeElasticity: () => 0.45,
  gravity: 0.25,
  // Pin Momofuku at the top, align generations horizontally
  fixedNodeConstraint: [
    { nodeId: 'momofuku', position: { x: 0, y: -200 } }
  ],
  relativePlacementConstraint: [
    { top: 'momofuku', bottom: 'momofuku-ko', gap: 100 },
    { top: 'momofuku-ko', bottom: 'chase-sinzer', gap: 100 },
  ],
};
```

CoSE produces organic blobs. fCoSE produces structured hierarchy with organic lateral connections. Same API surface — just `npm install cytoscape-fcose`.

### Project Structure

```
caper-family-tree/
├── app/
│   ├── page.tsx                  # Server component: reads searchParams, validates
│   ├── graph-page.tsx            # Client component: coordinates graph + UI
│   └── layout.tsx                # Root layout with fonts, metadata, OG tags
├── components/
│   ├── FamilyTree.tsx            # Cytoscape wrapper (dynamic import, ssr: false)
│   ├── NodeCard.tsx              # Detail card (switches on node.kind)
│   └── Legend.tsx                # Horizontal relationship type key
├── data/
│   ├── people.json               # All people (flat registry)
│   ├── restaurants.json          # All restaurants (flat registry)
│   ├── groups.json               # Restaurant groups / orgs
│   ├── relationships.json        # All edges
│   ├── schema.ts                 # Zod schemas + TypeScript types
│   └── validated-data.ts         # Build-time merge + validation
├── hooks/
│   └── use-graph.ts              # Cytoscape ↔ React state bridge
├── lib/
│   ├── graph-utils.ts            # JSON → Cytoscape elements
│   ├── styles.ts                 # Cytoscape stylesheet (JS tokens)
│   └── tokens.ts                 # Design tokens (shared by Tailwind + Cytoscape)
├── scripts/
│   └── validate-data.ts          # npm run validate (referential integrity)
├── public/
│   └── og.png                    # Static OG screenshot
├── CLAUDE.md                     # Handoff docs for Caper team
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### Critical Implementation Patterns

#### Font Loading Defense (MUST DO)

Cytoscape.js renders to `<canvas>`. If fonts aren't loaded at first render, labels render in fallback font and **never re-render**.

```typescript
// In FamilyTree.tsx — wait for fonts before Cytoscape init
useEffect(() => {
  document.fonts.ready.then(() => {
    if (cyRef.current) {
      cyRef.current.style().update(); // force re-render with correct fonts
      cyRef.current.forceRender();
    }
  });
}, []);
```

#### Dynamic Import (MUST DO)

Cytoscape.js is ~170KB gzipped. Don't block initial paint:

```typescript
import dynamic from 'next/dynamic';

const FamilyTree = dynamic(() => import('../components/FamilyTree'), {
  ssr: false,  // Cytoscape needs DOM/canvas
  loading: () => <GraphSkeleton />,
});
```

#### Cytoscape Performance (MUST DO)

```typescript
const cy = cytoscape({
  textureOnViewport: true,  // renders to offscreen texture during pan/zoom
  wheelSensitivity: 0.3,    // default 1.0 is too fast
  minZoom: 0.3,
  maxZoom: 3,
});
```

#### Cytoscape ↔ React State (Unidirectional)

Events flow **one direction only**: Cytoscape events → React state. Never drive Cytoscape from React re-renders.

```typescript
// hooks/use-graph.ts
const handleCyReady = useCallback((cy: cytoscape.Core) => {
  cyRef.current = cy;

  // Cytoscape → React
  cy.on('tap', 'node', (evt) => {
    setSelectedNode(nodeLookup.get(evt.target.id()) ?? null);
  });
  cy.on('tap', (evt) => {
    if (evt.target === cy) setSelectedNode(null);
  });
  cy.on('mouseover', 'node', (evt) => {
    evt.target.addClass('hover');
    cy.elements().not(evt.target.closedNeighborhood()).addClass('dimmed');
  });
  cy.on('mouseout', 'node', () => {
    cy.elements().removeClass('hover dimmed');
  });
}, [nodeLookup]);
```

#### Deep Linking

```typescript
// app/page.tsx (server component)
export default async function Page({ searchParams }: { searchParams: Promise<{ node?: string }> }) {
  const params = await searchParams;
  const initialSelectedId = params.node && nodeLookup.has(params.node) ? params.node : null;
  return <GraphPage elements={elements} nodeLookup={nodeLookup} initialSelectedId={initialSelectedId} />;
}

// Update URL on selection (shallow, no server round-trip)
useEffect(() => {
  const url = selectedNode ? `?node=${selectedNode.id}` : '/';
  router.replace(url, { scroll: false });
}, [selectedNode]);
```

### Data Model

4 files, each file one concern. IDs use `lowercase-hyphenated` format.

**Build-time validation** (`data/validated-data.ts`) merges all 4 files, validates with Zod, and checks referential integrity:

```typescript
import { FamilyDataSchema } from './schema';
import people from './people.json';
import restaurants from './restaurants.json';
import groups from './groups.json';
import relationships from './relationships.json';

const raw = { people, restaurants, groups, relationships };
const result = FamilyDataSchema.safeParse(raw);
if (!result.success) throw new Error(`Data validation failed:\n${JSON.stringify(result.error.format(), null, 2)}`);

// Cross-reference: every relationship source/target must exist
const allIds = new Set([...people.map(p => p.id), ...restaurants.map(r => r.id), ...groups.map(g => g.id)]);
const broken = relationships.filter(r => !allIds.has(r.source) || !allIds.has(r.target));
if (broken.length) throw new Error(`Broken references: ${broken.map(e => `${e.source} → ${e.target}`).join(', ')}`);
```

Wired into the build:
```json
{
  "scripts": {
    "validate": "tsx scripts/validate-data.ts",
    "build": "npm run validate && next build"
  }
}
```

Bad data = failed Vercel build with a clear error message. Non-engineers see "relationships.json references unknown ID 'chase-sinzr'" instead of a broken graph.

### Mobile

- Cytoscape.js has built-in touch support (pinch-zoom, tap-to-select)
- Viewport meta: `maximum-scale=1, user-scalable=no` (prevents iOS double-tap-zoom conflict)
- Graph fills `100vw × calc(100vh - 56px)` (minus header)
- Detail cards: fixed-position panel at bottom, 60% max-height, with close button
- `taphold` on mobile for hover-like behavior (long press shows neighborhood highlight)

### Accessibility

Cytoscape.js canvas is opaque to screen readers. Add:
- `role="application"` with `aria-label` on graph container
- Hidden `<ul>` listing all nodes for screen readers
- `aria-live="polite"` region announcing focused node
- Keyboard navigation: arrow keys cycle nodes, Enter selects, Escape dismisses card
- `min-zoomed-font-size: 10` hides unreadable labels at low zoom

---

## Implementation Plan

### Phase 1: Scaffold + Data (1-2 hours)

- [ ] `npx create-next-app caper-family-tree` with App Router, Tailwind, TypeScript
- [ ] `npm install cytoscape react-cytoscapejs cytoscape-fcose zod`
- [ ] Add type declarations for react-cytoscapejs (`types/react-cytoscapejs.d.ts`)
- [ ] Self-host Playfair Display, Spectral, Instrument Serif, Inter via `next/font/google`
- [ ] Normalize `.claude/data/momofuku-family-tree.json` → 4 flat JSON files in `data/`
- [ ] Create `data/schema.ts` with Zod schemas (Person, Restaurant, Group, Relationship)
- [ ] Create `data/validated-data.ts` — build-time merge + validation
- [ ] Create `scripts/validate-data.ts` — standalone validation script
- [ ] Wire `npm run validate` into `prebuild`

### Phase 2: Core Graph (2-3 hours)

- [ ] Create `lib/tokens.ts` — design tokens shared by Tailwind + Cytoscape
- [ ] Build `lib/graph-utils.ts` — `buildElements()` and `buildNodeLookup()`
- [ ] Build `lib/styles.ts` — Cytoscape stylesheet using tokens (node shapes, edge colors, hover/dimmed states)
- [ ] Build `hooks/use-graph.ts` — Cytoscape ↔ React state bridge
- [ ] Build `components/FamilyTree.tsx` — dynamic import wrapper + Cytoscape component with fCoSE layout
- [ ] `await document.fonts.ready` before first Cytoscape render
- [ ] `textureOnViewport: true` for mobile performance
- [ ] Build `app/page.tsx` (server) + `app/graph-page.tsx` (client) — editorial frame + graph
- [ ] Implement deep-linking: `?node={id}` centers + highlights on load
- [ ] Build `components/NodeCard.tsx` — discriminated union switch (PersonCard | RestaurantCard | GroupCard)

### Phase 3: Polish (1-2 hours)

- [ ] Build `components/Legend.tsx` — horizontal strip below graph
- [ ] Search: inline `<input>` in header with `.includes()` filter (40 nodes, no fuzzy library)
- [ ] Editorial page frame: title, subtitle, byline, centered hero above graph
- [ ] Mobile: fixed bottom panel for detail cards, `taphold` for long-press
- [ ] Active vs. closed distinction: solid vs. dashed border, opacity
- [ ] Loading state: sketch SVG placeholder → cross-fade on `layoutstop`
- [ ] Static OG image: screenshot the finished graph, save as `public/og.png`
- [ ] Meta tags in `layout.tsx`
- [ ] Error boundary around graph component (retry button, not global error page)

### Phase 4: Deploy + Handoff (1 hour)

- [ ] Deploy to Vercel, connect GitHub repo
- [ ] Coordinate CNAME with Caper (`familytree.caper.media` or similar)
- [ ] Write `CLAUDE.md` with:
  - Common tasks: add person, add restaurant, add relationship, fix error
  - ID conventions (`lowercase-hyphenated`)
  - Relationship types reference table
  - Deploy pipeline (edit → validate → commit → push → preview URL → merge)
  - Troubleshooting (broken JSON, floating nodes, blank graph)
  - `git checkout -- data/` recovery instructions
  - Each section prompts the next logical step (workflow-style, not dead-end reference)
- [ ] Walk Caper team through 1-2 edits via Claude Code
- [ ] Transfer Vercel project ownership

---

## What's Cut for v0 (Revisit in v1)

| Cut | Why | v1 Path |
|-----|-----|---------|
| Embed route | Not needed for launch; add `/embed/[group]` later in 30 min | Separate layout, stripped chrome |
| Dynamic OG images | Static export can't run `@vercel/og`; static screenshot is fine | Puppeteer service or Vercel non-static |
| Fuzzy search | `.includes()` handles 40 nodes; Fuse.js is a config rabbit hole | Add Fuse.js when dataset exceeds 100 nodes |
| Bottom sheet gestures | CSS fixed panel works; gesture library is scope creep | Add gesture support with `framer-motion` |
| Photos/headshots | Need rights-cleared images; initials look editorial | `public/images/people/{id}.jpg` + JSON field |
| Hand-drawn edges | Rough.js integration is a full feature | SVG filter or Rough.js on Cytoscape edges |
| Timeline slider | Data exists (`timeline_events`); UI is a separate feature | Year filter that re-runs layout |
| Auth/paywall | No Beehive subscriber API available yet | Investigate JWT/cookie sharing with Beehive |
| Multiple restaurant groups | Momofuku only for v0 | `?group={id}` param + filtered graph |
| Admin data browser | Not needed at 40 nodes | `/admin` page rendering data as searchable table |

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Next.js vs Vite | Next.js | `next/font/google` handles font loading (critical for canvas); team familiarity; Vercel preview URLs work identically |
| fCoSE vs CoSE | fCoSE | Constraint-based layout for hierarchy + organic lateral connections |
| 4 JSON files vs 1 | 4 files | Smaller blast radius per edit; Claude Code touches fewer unrelated entries; readable git diffs |
| Zod validation | Yes | Non-engineers editing JSON need loud build failures, not silent graph bugs |
| Edge default opacity | 0.45 | 50 edges at full opacity is visual noise; spotlight effect on selection |
| Page frame | Editorial (title above) | "Journalism that happens to be interactive" — not a dashboard |
| Card design | Magazine sidebar | Typographic hierarchy mirrors Caper's editorial voice |
| Mobile cards | CSS fixed panel | No gesture library; works today, upgrade path exists |

---

## Open Questions for Caper

1. **Domain:** Can you set up a CNAME for `familytree.caper.media` (or preferred subdomain)?
2. **Beehive auth:** Does your Beehive setup expose subscriber tier? (For future gating)
3. **Photos:** Do you have rights-cleared headshots for key people, or should we skip for v0?
4. **Data review:** Research found several corrections to the hand-drawn diagram (see above). Want to review before build?
5. **Branding:** Should there be an "Every x Caper" credit, or just Caper branding?
6. **Title copy:** Is "The Momofuku Family Tree" the right title, or something else?

---

## Co-Marketing Deliverables

**For Every:**
- Case study: "How we built an interactive data visualization for a media company in a day with Claude Code"
- Demo for consulting pipeline
- Newsletter/social content about the partnership

**For Caper:**
- Interactive family tree for professional tier subscribers
- Reusable system for adding restaurant groups over time
- Claude Code workflow for non-engineer data maintenance

---

## CLAUDE.md Draft (for Caper Repo)

<details>
<summary>Expand full CLAUDE.md</summary>

```markdown
# Caper Family Tree

Interactive graph visualization of restaurant industry relationships.
Built with Next.js + Cytoscape.js. Data lives in JSON files.

## Quick Start

You are maintaining a graph database stored as JSON files. The graph has
three types of nodes (people, restaurants, groups) and edges between them
(relationships). Your job is to add, edit, and fix data entries.

**CRITICAL RULES:**
1. ALWAYS run `npm run validate` after editing any data file
2. NEVER invent an ID — check existing files first to avoid duplicates
3. IDs use lowercase-hyphenated format: `david-chang`, `momofuku-ko`
4. Every relationship MUST reference IDs that exist in people/restaurants/groups
5. After changes, run `npm run dev` and check the graph renders
6. ALWAYS run `git diff data/` and show the user what changed before committing

## Data Files

| File | Contains | Example |
|------|----------|---------|
| `data/people.json` | People (chefs, owners, staff) | David Chang, Chase Sinzer |
| `data/restaurants.json` | Individual restaurants | Momofuku Ko, Penny, HAGS |
| `data/groups.json` | Restaurant groups / orgs | Momofuku, Milk Bar |
| `data/relationships.json` | All edges between nodes | "chase-sinzer worked at momofuku-ko" |

## Common Tasks

### Add a new person
1. Add to `data/people.json`:
   ```json
   { "id": "firstname-lastname", "name": "First Last", "title": "Role", "bio": "1-2 sentences.", "tags": ["chef"] }
   ```
2. Add relationships to `data/relationships.json`
3. Run `npm run validate`

### Add a new restaurant
1. Add to `data/restaurants.json`:
   ```json
   { "id": "name", "name": "Name", "city": "New York", "opened": 2024, "status": "active" }
   ```
2. Add relationships connecting people to this restaurant
3. Run `npm run validate`

### Fix a data error
Read the file, find by ID, edit the field, validate.

## Relationship Types
| Type | Meaning |
|------|---------|
| `founded` | Created / founded |
| `alumni` | Worked there, moved on |
| `current_staff` | Currently works there |
| `opened_new` | Opened own spot after leaving |
| `belongs_to` | Part of a group |
| `family` | Family connection |
| `same_space` | Took over same physical space |

ONLY use these types.

## Deploy
1. Edit data files → 2. `npm run validate` → 3. `git add data/` → 4. `git commit` → 5. `git push`
Vercel auto-deploys preview. Merge to main for production.

## Troubleshooting
- **Node floating alone:** No relationships in relationships.json
- **Graph won't load:** JSON syntax error. Run `npm run validate`
- **Undo changes:** `git checkout -- data/filename.json`

## What NOT to Edit
Unless you know what you're doing: `components/`, `lib/`, `app/`, `tailwind.config.ts`
```

</details>

---

## Product Roadmap: v0 → Self-Service → Editorial Platform

This is the full arc — from demo to Caper owning and expanding this independently.

### v0: The Demo (This Build)

**What it is:** Momofuku family tree. One restaurant group, ~40 nodes, interactive graph.
**Who maintains it:** Austin builds it, shows Caper.
**Goal:** Make it tangible. Does this feel shippable? Is Caper excited?

### v0.5: The Launch Version (Week 1-2 After Demo)

**What changes:**
- Caper reviews the data, corrects errors, adds missing people/restaurants
- Design polish based on Caper feedback (node sizes, colors, card content)
- Add 1-2 more restaurant groups if Caper wants (e.g., Major Food Group, JG)
- Caper provides headshots/photos for key people (optional)
- Custom subdomain goes live (`familytree.caper.media`)

**Who maintains it:** Austin + Caper together. Austin does code changes, Caper reviews data.

### v1: Caper Self-Service (Week 2-3)

**This is the handoff moment.** After this, Caper operates independently.

**What they get:**
- Claude Code subscription set up for at least one Caper team member
- CLAUDE.md in the repo that teaches Claude how to maintain the data
- The validation pipeline (`npm run validate`) that catches errors before deploy
- Vercel preview URLs so they can review changes before going live

**How adding a new restaurant group works (the critical workflow):**

```
Step 1: Caper editor opens Claude Code in the repo

Step 2: "Add the Major Food Group tree. Here's what I know:
         - Founded by Mario Carbone, Jeff Zalaznick, Rich Torrisi
         - Restaurants: Carbone, The Grill, Dirty French, Sadelle's, Parm...
         - Key alumni: [list]
         - Connections to Momofuku: [any crossover people]"

Step 3: Claude Code:
         - Adds people to data/people.json
         - Adds restaurants to data/restaurants.json
         - Adds "major-food-group" to data/groups.json
         - Adds all relationships to data/relationships.json
         - Runs npm run validate (catches any broken IDs)
         - Shows git diff for review

Step 4: Editor reviews the diff, says "push it"

Step 5: Vercel deploys a preview URL in ~60 seconds

Step 6: Editor checks the preview — new group appears in the graph

Step 7: Merge to main → live on the site
```

**Time per new restaurant group:** 15-30 minutes with Claude Code, depending on how much data the editor brings. Claude does the research and JSON formatting. The editor verifies accuracy.

**What if they don't want to use Claude Code?** The JSON files are human-readable. A technically comfortable editor could hand-edit them. But Claude Code is 10x faster because it handles the JSON formatting, ID conventions, and cross-file references automatically.

### v1.5: Multi-Group Navigation (Month 1-2)

**Problem:** With 3+ restaurant groups, the graph gets crowded. Users need a way to navigate between groups.

**Solution:** Add a `?group={id}` URL parameter that filters the graph to show one group at a time, with cross-group connections shown as subtle outbound edges.

**Implementation:**
- Group selector dropdown in the header (or landing page with group cards)
- Filter `buildElements()` to only include nodes belonging to the selected group + any cross-group connections
- "Show all" mode that displays the full network (useful for finding unexpected connections)
- Each group gets its own URL: `familytree.caper.media?group=momofuku`

**This is a code change, not a data change.** Austin or an engineer would need to build this. But the data model already supports it — every restaurant has a `group` field. This is maybe 2-3 hours of work.

### v2: Editorial Integration (Month 2-3)

**The big unlock Daniel and Max described in the call:** The graph data feeds Caper's editorial reporting.

**What this looks like:**

**A. Embeddable graph cards in newsletters**
- Add `/embed/[group]` route (stripped chrome, iframe-friendly)
- Caper embeds a mini version of the graph in Beehive newsletters
- Reader clicks through to the full interactive version
- For email (no iframes): auto-generate a static screenshot + link

**B. Auto-linking in articles (the ESPN analogy)**
- When Caper writes about "Chase Sinzer" in a newsletter, they manually link to `familytree.caper.media?node=chase-sinzer`
- The deep-link URL centers on that person in the graph
- Future: a browser extension or Beehive plugin that auto-suggests links when it recognizes a name from the graph data

**C. Hover cards fed by graph data**
- The detail cards (name, bio, connections) could be reused as standalone components
- Embed a small "info card" inline in articles when mentioning a person
- This requires an API layer — a simple JSON endpoint that returns person/restaurant data by ID

### v2.5: Data Admin Tool (Month 3+)

**Problem:** At 200+ nodes across 10+ restaurant groups, editing JSON files in Claude Code starts to feel unwieldy. The editorial team wants a visual way to browse and edit the data.

**Options (pick one when the time comes):**

**Option A: Airtable as CMS**
- Move the canonical data to Airtable (spreadsheet UI, multiple editors, no JSON syntax)
- Build a sync script that exports Airtable → JSON files at build time
- Editors use Airtable to add/edit data, the graph auto-updates on deploy
- Cost: Airtable free tier handles 1000 records easily

**Option B: Simple admin page in the app**
- Add `/admin` route with a searchable table of all people, restaurants, groups
- CRUD forms for adding/editing entries
- Still writes to JSON files (or graduates to Supabase at this point)
- More work to build but keeps everything in one place

**Option C: Stay with Claude Code**
- If the team is comfortable with Claude Code, this might be all they need
- The CLAUDE.md and validation pipeline handle the complexity
- Claude Code gets better over time — what's clunky today may be seamless in 6 months

**Recommendation:** Start with Option C (Claude Code). Graduate to Option A (Airtable) if/when the editorial team has 3+ people regularly editing data and JSON-via-Claude-Code becomes a bottleneck.

### v3: The Platform Vision (6+ Months)

**What Daniel described:** "A uniform data layer that feeds both the chart and reporting."

This is where the family tree becomes a **restaurant industry knowledge graph** — not just a visualization, but a queryable database that powers multiple products:

- **The Graph** (what we're building now) — interactive exploration
- **Editorial lookup** — "Tell me everything we know about this person" for fact-checking
- **Trend detection** — "Which restaurant groups have the most alumni starting their own spots?"
- **Relationship mapping** — "Show me all the connections between Momofuku and Major Food Group"
- **Timeline analysis** — "What opened and closed in 2024?"

At this scale, the architecture graduates:
- JSON files → Supabase (Postgres) or Airtable as the canonical data source
- Static build → Server-side rendering with real-time data
- Manual entry → Partially automated via web scraping (Eater, NYT, Resy opening announcements)
- Single graph → Multiple views (timeline, map, directory, org chart)

**This is where it becomes a real competitive moat for Caper's professional tier.** Nobody else in food media has a structured, queryable knowledge graph of restaurant industry relationships.

---

## The Handoff Playbook (What Caper Gets)

When Austin hands this off, Caper receives:

| Asset | What It Is | Where It Lives |
|-------|-----------|----------------|
| **The app** | Next.js + Cytoscape.js visualization | GitHub repo → Vercel |
| **The data** | 4 JSON files with ~40 validated nodes | `data/` directory in repo |
| **CLAUDE.md** | Instructions that teach Claude Code how to maintain data | Root of repo |
| **Validation** | Zod schemas + referential integrity check | `scripts/validate-data.ts` |
| **Deploy pipeline** | Push → Vercel auto-builds → preview URL → merge to ship | GitHub + Vercel |
| **Recovery docs** | How to undo mistakes (`git checkout`, `git revert`) | In CLAUDE.md |
| **This roadmap** | Where to go from v0 to v3 | This document |

**The teaching session (30-60 min):**
1. Austin walks Caper through adding a person + restaurant via Claude Code
2. Show the validation catching a deliberate error
3. Show the preview URL workflow
4. Show how to undo a bad edit
5. Answer questions

**After handoff, Caper can:**
- Add people, restaurants, and groups without touching code
- Add entire new restaurant groups in 15-30 minutes
- Fix data errors in seconds
- Deploy changes to production in under 2 minutes
- Never need Austin for routine data operations

**When Caper would come back to Every:**
- Wants the multi-group navigation UI (v1.5) — code change
- Wants embeddable graph cards (v2) — code change
- Wants to graduate to Airtable or Supabase (v2.5) — architecture change
- Wants the full platform vision (v3) — this is a consulting engagement

---

## References

- Caper design research: `.claude/data/caper-media-design-research.md`
- Momofuku data (raw): `.claude/data/momofuku-family-tree.json`
- Cytoscape.js docs: https://js.cytoscape.org/
- cytoscape-fcose: https://github.com/iVis-at-Bilkent/cytoscape.js-fcose
- react-cytoscapejs: https://github.com/plotly/react-cytoscapejs
- Daniel's email (Feb 21): "black Playfair text displayed on a background that uses this hex: E2E6DF"

### Research Sources
- Cytoscape layout comparison: https://blog.js.cytoscape.org/2020/05/11/layouts/
- The Pudding visual essays: https://pudding.cool/resources/
- awesome-interactive-journalism: https://github.com/wbkd/awesome-interactive-journalism
