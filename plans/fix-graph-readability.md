# fix: Caper Family Tree Graph Readability Overhaul

## Problem Statement

The graph visualization is incomprehensible. From user testing (Austin's screenshots):

1. **Layout jumps around** — fCoSE is non-deterministic. Every page load produces a different layout. Users see a different map each time.
2. **Illegible labels** — Person nodes show two-letter initials (TH, DC, CS) that mean nothing. Restaurant names overlap. Group diamonds have black text on black background (literally invisible).
3. **No visual logic** — The force-directed layout feels random. There's no clear hierarchy or story. A user can't look at this and understand "Momofuku spawned these restaurants, these chefs left and opened these places."
4. **Washed out** — Everything is the same muted gray/cream tone. Closed restaurants at 50% opacity on a light green background are nearly invisible.

**Root cause:** Cytoscape.js + fCoSE force-directed layout is the wrong tool for an editorial visualization. fCoSE is designed for exploring graph databases, not telling stories. It has no seed parameter ([open issue since 2021](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/issues/36)), so determinism is impossible.

## Reference Image Analysis

Caper provided a hand-drawn reference (`/Users/austintedesco/Downloads/IMG_7752.jpg`). Key takeaways:

### Layout Hierarchy (top-down, exactly like dagre)
- **Tier 1 (top):** MOMOFUKU — large, centered, dominant
- **Tier 1 sides:** Zabar's + Marguerite (left), Paddy Spence + Momofuku Goods (right), Care of Chan (far right)
- **Tier 2:** Leadership bubble (Anoop Pillarisetti, Sue Chan), Strange Delight, Moonburger
- **Tier 3:** MOMOFUKU KO — the central hub node, most alumni flow through here
- **Tier 4:** Ko alumni row spread horizontally: Chase Sinzer, Nikita Malhorta, Sean Gray, Sam Yoo, Telly Justice, Theo Ouya
- **Tier 5:** Alumni restaurants: Claud, Penny, Sargaentsville Inn, Golden Diner, HAGS, Bar Contra
- **Tier 6:** Next generation: Nick Tamburo → Smithereens

### Visual Design (simple, functional, premium utility)
- **People:** Plain rectangles with full names (not circles, not initials)
- **Momofuku restaurants:** Plain rectangles
- **Alumni-opened restaurants:** Starburst/jagged border shapes (visually distinct from Momofuku properties)
- **Groups (Momofuku, Goods):** Large text, prominent
- **Edges:** Directional arrows. Solid = "worked at", Dashed = "opened new spot", Wavy = "family connection"
- **Full names on everything** — no abbreviations, no initials
- **Black and white** — not trying to be colorful, just clear

### Design Philosophy (from Austin)
> "Lean into it being more like functional than fully fully overly designed, like it's a premium utility, it's just gotta work. You might be overmapping it or making it even like too interactive."

**Translation:** Stop over-designing. No circles, no diamonds, no fancy hover states. Rectangles + arrows + full names + clear hierarchy. That's it.

## Research Summary

Three research agents investigated alternatives. Key findings:

### The editorial standard
NYT, Bloomberg, The Pudding all use **D3.js with SVG** and **baked positions**. They never ship force-directed layouts to production — an algorithm computes initial positions, then a human art-directs the final layout. The positions are saved as static JSON and served deterministically.

### D3 vs Cytoscape for this use case
| | D3.js | Cytoscape.js |
|---|---|---|
| Design control | Pixel-level (you own every SVG element) | Configuration-based (you tune parameters) |
| Rendering | SVG — CSS-styleable, accessible, selectable text | Canvas — rasterized bitmap, no DOM access |
| Labels | Full `<text>` with CSS fonts, wrapping, positioning | Canvas text, poor quality, no CSS |
| Audience | Data journalists, editorial teams | Bioinformatics, graph DB explorers |
| Determinism | Built-in (fixed-seed RNG since v4) | fCoSE: no. dagre/klay/elk: yes |

### Deterministic Cytoscape alternatives
If staying in Cytoscape, **dagre** is deterministic and hierarchical (top-down tree). So is **klay** (with seed parameter) and **elk** (layered algorithm). All produce the same layout every time.

### The "bake positions" pattern
Run layout once → export `{id, x, y}` for every node → save as JSON → load with `preset` layout in production. Zero jitter, instant render.

## Decision: Two-Phase Approach

### Phase 1 (Ship for v0 demo) — Stay in Cytoscape, switch to dagre + baked positions
- Swap fCoSE for **dagre** (deterministic, hierarchical, top-down)
- Run once, export positions, serve as static JSON
- Fix all visual bugs (invisible groups, initials, overlap)
- Ship something comprehensible this week

### Phase 2 (v1 if Caper wants to invest) — Migrate to D3.js + SVG
- Full editorial control, pixel-perfect label placement
- SVG text (accessible, selectable, CSS-styled)
- Semantic zoom (show more labels at higher zoom)
- Art-directed positions for key nodes

**This plan covers Phase 1 only.**

## Technical Approach

### 1. Replace fCoSE with dagre layout

**Install:**
```bash
npm install cytoscape-dagre dagre
```

**Why dagre:**
- Deterministic — same input always produces same output
- Hierarchical — top-down tree structure (Momofuku → restaurants → alumni → alumni restaurants)
- Well-maintained — official Cytoscape extension
- Small bundle — dagre is ~30KB

**Layout config:**
```typescript
{
  name: 'dagre',
  rankDir: 'TB',        // Top to Bottom
  nodeSep: 60,          // Horizontal spacing
  rankSep: 120,         // Vertical spacing between tiers
  edgeSep: 10,
  fit: true,
  padding: 40,
}
```

**Remove:** All fCoSE-specific code — `fixedNodeConstraint`, `relativePlacementConstraint`, `alignmentConstraint`, `nodeRepulsion`, `idealEdgeLength`, `gravity`, `numIter`.

**Files:** `components/FamilyTree.tsx`, `package.json`

### 2. Bake positions as static JSON

**Script:** `scripts/bake-positions.ts`

```typescript
// 1. Init headless Cytoscape with dagre
// 2. Run layout
// 3. Export positions: cy.nodes().map(n => ({ id: n.id(), ...n.position() }))
// 4. Write to data/positions.json
```

**Add npm script:** `"bake": "tsx scripts/bake-positions.ts"`

**Workflow:** Edit data → `npm run bake` → positions.json updated → deterministic on every load.

**In production:** Use `preset` layout with positions from JSON. No layout computation at runtime.

**Files:** New `scripts/bake-positions.ts`, new `data/positions.json`, `components/FamilyTree.tsx`

### 3. Fix labels — show full names, not initials

**People:** Display full name below the circle, not initials inside it.
- Change `label: "data(firstName)"` → `label: "data(label)"` (full name)
- Keep text below circle: `text-valign: bottom`, `text-margin-y: 8`
- Increase `text-max-width` to `110px` for longer names
- Font: 11px Inter, weight 500

**Restaurants:** Already showing names, but fix overlap by increasing `nodeSep` in dagre.

**Groups:** Fix the invisible text bug.
- Current: black text (`#1a1a1a`) on black diamond (`#1a1a1a`) — invisible
- Fix: white text on black background, or black text with `text-valign: bottom` below the diamond

**Files:** `lib/styles.ts`, `lib/graph-utils.ts`

### 4. Match reference image visual design

**Keep it simple — rectangles + arrows + full names. Per the reference sketch:**

| Node Type | Shape | Style | Label |
|-----------|-------|-------|-------|
| Restaurant Group (Momofuku) | Rectangle | Large, bold text, prominent border | Full name, uppercase |
| Sub-groups (Goods, Milk Bar) | Rectangle | Medium, standard border | Full name |
| Momofuku restaurant | Rectangle | Standard border, clean | Full name |
| Alumni-opened restaurant | Rectangle | **Starburst/jagged or dashed border** — visually distinct | Full name |
| Closed restaurant | Rectangle | Faded, dashed border | Full name |
| Person (any) | Rectangle | Standard, clean | **Full name** (first + last) |

**Edge types (matching the reference legend):**

| Edge Type | Visual | Arrow? |
|-----------|--------|--------|
| alumni ("Worked at Momofuku") | Solid black line | Yes, directional |
| opened_new ("Opened new spot") | Dashed black line | Yes, directional |
| family ("Family connection") | Wavy/squiggly line | No |
| founded | Solid black, thicker | Yes |
| belongs_to | Very thin or hidden | No — structural only |
| current_staff | Solid gray, thin | Yes |
| same_space | Dotted gray | No |

**Color palette:** Mostly black and white. Not trying to be colorful. Clean, functional, like a premium utility.

**Files:** `lib/styles.ts`, `lib/tokens.ts`

### 5. Fix container and viewport

- Graph container: `height: calc(100vh - 280px)` (account for header + title + legend + footer)
- `min-height: 500px`
- Remove radial gradient (distracting) — use flat `#E8EBE5` or similar
- After layout: `cy.fit(undefined, 50)` with generous padding
- Disable animation on initial load (no jumping) — `animate: false` on dagre

**Files:** `app/globals.css`, `components/FamilyTree.tsx`

### 6. Clean up dead code and bugs

- Delete `initials` computation from `graph-utils.ts` (unused)
- Remove all fCoSE constraint arrays from `FamilyTree.tsx`
- Remove `cytoscape-fcose` dependency from `package.json`
- Fix `data(displayLabel)` to work for all restaurants (not just Momofuku-prefixed)
- Remove hard-coded node selectors for David Chang / Marguerite / Christina — use data-driven sizing based on tags or connection count

**Files:** `lib/graph-utils.ts`, `components/FamilyTree.tsx`, `lib/styles.ts`, `package.json`

## Implementation Order

1. `npm install cytoscape-dagre dagre` + remove `cytoscape-fcose`
2. Rewrite `FamilyTree.tsx` — dagre layout, no constraints, no animation
3. Fix `styles.ts` — full names, group text visibility, color hierarchy, edge weights
4. Fix `tokens.ts` — add missing colors
5. Fix `graph-utils.ts` — remove dead initials code, clean displayLabel logic
6. Fix `globals.css` — container height, remove gradient
7. Write `scripts/bake-positions.ts` — export positions after dagre run
8. Generate `data/positions.json` — baked positions
9. Update `FamilyTree.tsx` to use `preset` layout with baked positions in production
10. Test, screenshot, iterate on spacing/sizing
11. Push + deploy to Vercel

## Acceptance Criteria

- [ ] Graph renders identically on every page load (deterministic)
- [ ] Every person shows their full name (no initials)
- [ ] Every restaurant name is readable (no overlap)
- [ ] Group diamonds are visible (not black-on-black)
- [ ] Clear top-down hierarchy: groups → restaurants → people
- [ ] Momofuku is visually dominant at the top
- [ ] Clicking a node highlights its connections clearly
- [ ] Graph fits in viewport without scrolling on desktop
- [ ] Mobile layout is usable (can scroll/zoom, bottom panel works)
- [ ] `npm run validate` passes
- [ ] `npm run build` passes
- [ ] No layout animation/jumping on page load

## Tools & Plugins Assessment

**For this phase (dagre + bake), no new plugins needed.** Cytoscape + dagre handles it.

**For future phases:**
- **Playwright MCP** — installed, will be available after Claude Code restart for visual testing
- **D3.js migration** — would be Phase 2, significant rewrite (~2-3 days)
- **BrowserTools MCP** — could add for Lighthouse/accessibility audits but not blocking

## References

- [cytoscape-dagre](https://github.com/cytoscape/cytoscape.js-dagre) — Cytoscape dagre extension
- [fCoSE seed issue (no fix)](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/issues/36) — Why fCoSE can't be deterministic
- [D3 baked positions pattern](https://observablehq.com/@d3/static-force-directed-graph) — The editorial standard
- [Stuart Thompson label collision](https://observablehq.com/@stuartathompson/preventing-label-overlaps-in-d3) — NYT technique
- [Elijah Meeks on network viz](http://elijahmeeks.com/networkviz/) — Why force-directed fails editorially
