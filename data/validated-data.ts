import { FamilyDataSchema } from "./schema";
import type { FamilyData, Person, Restaurant, Group } from "./schema";
import peopleJson from "./people.json";
import restaurantsJson from "./restaurants.json";
import groupsJson from "./groups.json";
import relationshipsJson from "./relationships.json";

const raw = {
  people: peopleJson,
  restaurants: restaurantsJson,
  groups: groupsJson,
  relationships: relationshipsJson,
};

const result = FamilyDataSchema.safeParse(raw);
if (!result.success) {
  throw new Error(
    `Data validation failed:\n${JSON.stringify(result.error.format(), null, 2)}`
  );
}

// Referential integrity check
const allIds = new Set([
  ...result.data.people.map((p) => p.id),
  ...result.data.restaurants.map((r) => r.id),
  ...result.data.groups.map((g) => g.id),
]);

const broken = result.data.relationships.filter(
  (r) => !allIds.has(r.source) || !allIds.has(r.target)
);
if (broken.length) {
  throw new Error(
    `Broken references: ${broken.map((e) => `${e.source} → ${e.target}`).join(", ")}`
  );
}

export const data: FamilyData = result.data;

export type NodeKind = "person" | "restaurant" | "group";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  data: Person | Restaurant | Group;
}

export function buildNodeLookup(): Map<string, GraphNode> {
  const map = new Map<string, GraphNode>();
  for (const p of data.people) {
    map.set(p.id, { id: p.id, kind: "person", label: p.name, data: p });
  }
  for (const r of data.restaurants) {
    map.set(r.id, { id: r.id, kind: "restaurant", label: r.name, data: r });
  }
  for (const g of data.groups) {
    map.set(g.id, { id: g.id, kind: "group", label: g.name, data: g });
  }
  return map;
}
