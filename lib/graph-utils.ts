import type { ElementDefinition } from "cytoscape";
import { data } from "@/data/validated-data";

/** Groups whose restaurants are "Momofuku properties" (not alumni-opened). */
const MOMOFUKU_GROUPS = new Set(["momofuku", "milk-bar-group"]);

export function buildElements(): ElementDefinition[] {
  const nodes: ElementDefinition[] = [];
  const edges: ElementDefinition[] = [];

  for (const p of data.people) {
    nodes.push({
      data: {
        id: p.id,
        label: p.name,
        kind: "person",
        tags: p.tags,
      },
    });
  }

  for (const r of data.restaurants) {
    const isAlumni = !MOMOFUKU_GROUPS.has(r.group);
    nodes.push({
      data: {
        id: r.id,
        label: r.name,
        kind: "restaurant",
        status: r.status,
        group: r.group,
        isAlumni: isAlumni ? "true" : "false",
      },
    });
  }

  for (const g of data.groups) {
    nodes.push({
      data: {
        id: g.id,
        label: g.name,
        kind: "group",
        groupType: g.type,
      },
    });
  }

  for (let i = 0; i < data.relationships.length; i++) {
    const r = data.relationships[i];
    edges.push({
      data: {
        id: `e-${i}`,
        source: r.source,
        target: r.target,
        relType: r.type,
        label: r.label,
      },
    });
  }

  return [...nodes, ...edges];
}
