import { readFileSync } from "fs";
import { join } from "path";

// Use dynamic import for Zod since we're in a script context
async function main() {
  const { z } = await import("zod");

  const dataDir = join(process.cwd(), "data");

  const people = JSON.parse(readFileSync(join(dataDir, "people.json"), "utf-8"));
  const restaurants = JSON.parse(readFileSync(join(dataDir, "restaurants.json"), "utf-8"));
  const groups = JSON.parse(readFileSync(join(dataDir, "groups.json"), "utf-8"));
  const relationships = JSON.parse(readFileSync(join(dataDir, "relationships.json"), "utf-8"));

  const PersonSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    tags: z.array(z.string()),
    active_since: z.number().optional(),
  });

  const RestaurantSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    opened: z.number(),
    closed: z.number().optional(),
    status: z.enum(["active", "closed"]),
    group: z.string(),
  });

  const GroupSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    type: z.string(),
    founded: z.number(),
    description: z.string(),
  });

  const RelationshipSchema = z.object({
    source: z.string().regex(/^[a-z0-9-]+$/),
    target: z.string().regex(/^[a-z0-9-]+$/),
    type: z.enum(["alumni", "founded", "current_staff", "opened_new", "belongs_to", "family", "same_space"]),
    label: z.string(),
  });

  // Validate each file
  const pResult = z.array(PersonSchema).safeParse(people);
  if (!pResult.success) {
    console.error("❌ people.json validation failed:");
    console.error(JSON.stringify(pResult.error.format(), null, 2));
    process.exit(1);
  }

  const rResult = z.array(RestaurantSchema).safeParse(restaurants);
  if (!rResult.success) {
    console.error("❌ restaurants.json validation failed:");
    console.error(JSON.stringify(rResult.error.format(), null, 2));
    process.exit(1);
  }

  const gResult = z.array(GroupSchema).safeParse(groups);
  if (!gResult.success) {
    console.error("❌ groups.json validation failed:");
    console.error(JSON.stringify(gResult.error.format(), null, 2));
    process.exit(1);
  }

  const relResult = z.array(RelationshipSchema).safeParse(relationships);
  if (!relResult.success) {
    console.error("❌ relationships.json validation failed:");
    console.error(JSON.stringify(relResult.error.format(), null, 2));
    process.exit(1);
  }

  // Referential integrity
  const allIds = new Set([
    ...people.map((p: { id: string }) => p.id),
    ...restaurants.map((r: { id: string }) => r.id),
    ...groups.map((g: { id: string }) => g.id),
  ]);

  const broken = relationships.filter(
    (r: { source: string; target: string }) => !allIds.has(r.source) || !allIds.has(r.target)
  );

  if (broken.length) {
    console.error("❌ Broken references found:");
    for (const b of broken) {
      const parts = [];
      if (!allIds.has(b.source)) parts.push(`source "${b.source}" not found`);
      if (!allIds.has(b.target)) parts.push(`target "${b.target}" not found`);
      console.error(`  ${b.source} → ${b.target}: ${parts.join(", ")}`);
    }
    process.exit(1);
  }

  // Check for duplicate IDs
  const idCounts = new Map<string, number>();
  for (const id of [...people.map((p: { id: string }) => p.id), ...restaurants.map((r: { id: string }) => r.id), ...groups.map((g: { id: string }) => g.id)]) {
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  }
  const dupes = [...idCounts.entries()].filter(([, count]) => count > 1);
  if (dupes.length) {
    console.error("❌ Duplicate IDs found:");
    for (const [id, count] of dupes) {
      console.error(`  "${id}" appears ${count} times`);
    }
    process.exit(1);
  }

  console.log(`✅ Data valid: ${people.length} people, ${restaurants.length} restaurants, ${groups.length} groups, ${relationships.length} relationships`);
}

main().catch((err) => {
  console.error("Validation script failed:", err);
  process.exit(1);
});
