import type { FamilyData, Person, Restaurant, Group, Relationship } from "./types";
import peopleJson from "./people.json";
import restaurantsJson from "./restaurants.json";
import groupsJson from "./groups.json";
import relationshipsJson from "./relationships.json";

// Data is validated at build time via `npm run validate` (prebuild step).
// No runtime validation needed — just type the static JSON imports.
export const data: FamilyData = {
  people: peopleJson as Person[],
  restaurants: restaurantsJson as Restaurant[],
  groups: groupsJson as Group[],
  relationships: relationshipsJson as Relationship[],
};

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
