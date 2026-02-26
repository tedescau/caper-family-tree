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
   { "id": "firstname-lastname", "name": "First Last", "title": "Role", "bio": "1-2 sentences.", "tags": ["chef"], "active_since": 2020 }
   ```
2. Add relationships to `data/relationships.json`
3. Run `npm run validate`

### Add a new restaurant
1. Add to `data/restaurants.json`:
   ```json
   { "id": "name", "name": "Name", "city": "New York", "neighborhood": "East Village", "opened": 2024, "status": "active", "group": "alumni" }
   ```
2. Add relationships connecting people to this restaurant
3. Run `npm run validate`

### Add a new restaurant group
1. Add the group to `data/groups.json`
2. Add all restaurants with `"group": "your-group-id"`
3. Add all people
4. Add all relationships
5. Run `npm run validate`

### Fix a data error
Read the file, find by ID, edit the field, validate.

## Relationship Types

| Type | Meaning | Edge Style |
|------|---------|------------|
| `founded` | Created / founded | Solid black, thick |
| `alumni` | Worked there, moved on | Dashed indigo |
| `current_staff` | Currently works there | Solid gray, thin |
| `opened_new` | Opened own spot after leaving | Dashed tan |
| `belongs_to` | Part of a group | Solid light gray |
| `family` | Family connection | Solid terracotta |
| `same_space` | Took over same physical space | Dotted gray |

ONLY use these types.

## Deploy

1. Edit data files
2. `npm run validate`
3. `git add data/`
4. `git commit -m "data: add [what you added]"`
5. `git push`

Vercel auto-deploys a preview URL. Merge to main for production.

## Troubleshooting

- **Node floating alone:** No relationships in relationships.json
- **Graph won't load:** JSON syntax error. Run `npm run validate`
- **Undo changes:** `git checkout -- data/filename.json`
- **Blank graph:** Check browser console for errors

## Tech Stack

- **Next.js 16** — App Router, static export
- **Cytoscape.js** — Graph rendering (canvas)
- **cytoscape-fcose** — Force-directed layout with constraints
- **Tailwind CSS** — Page styling
- **Zod** — Data validation

## What NOT to Edit

Unless you know what you're doing: `components/`, `lib/`, `app/`, `hooks/`
