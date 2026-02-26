/**
 * Bake graph positions using dagre layout in headless Cytoscape.
 * Run: npm run bake
 * Output: data/positions.json
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

async function main() {
  // Dynamic imports for ESM modules
  const cytoscape = (await import("cytoscape")).default;
  const dagre = (await import("cytoscape-dagre")).default;

  cytoscape.use(dagre);

  const dataDir = join(process.cwd(), "data");

  const people = JSON.parse(readFileSync(join(dataDir, "people.json"), "utf-8"));
  const restaurants = JSON.parse(readFileSync(join(dataDir, "restaurants.json"), "utf-8"));
  const groups = JSON.parse(readFileSync(join(dataDir, "groups.json"), "utf-8"));
  const relationships = JSON.parse(readFileSync(join(dataDir, "relationships.json"), "utf-8"));

  const MOMOFUKU_GROUPS = new Set(["momofuku", "milk-bar-group"]);

  // Build elements
  const elements: any[] = [];

  for (const p of people) {
    elements.push({
      data: {
        id: p.id,
        label: p.name,
        kind: "person",
        tags: p.tags,
      },
    });
  }

  for (const r of restaurants) {
    const isAlumni = !MOMOFUKU_GROUPS.has(r.group);
    elements.push({
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

  for (const g of groups) {
    elements.push({
      data: {
        id: g.id,
        label: g.name,
        kind: "group",
        groupType: g.type,
      },
    });
  }

  for (let i = 0; i < relationships.length; i++) {
    const r = relationships[i];
    elements.push({
      data: {
        id: `e-${i}`,
        source: r.source,
        target: r.target,
        relType: r.type,
        label: r.label,
      },
    });
  }

  // Create headless Cytoscape instance
  const cy = cytoscape({
    headless: true,
    elements,
  });

  // Run dagre layout
  const layout = cy.layout({
    name: "dagre",
    rankDir: "TB",
    nodeSep: 60,
    rankSep: 100,
    edgeSep: 10,
    fit: true,
    padding: 50,
    animate: false,
  } as any);

  layout.run();

  // Export positions
  const positions: Record<string, { x: number; y: number }> = {};
  cy.nodes().forEach((node) => {
    const pos = node.position();
    positions[node.id()] = {
      x: Math.round(pos.x * 100) / 100,
      y: Math.round(pos.y * 100) / 100,
    };
  });

  const outPath = join(dataDir, "positions.json");
  writeFileSync(outPath, JSON.stringify(positions, null, 2) + "\n");

  console.log(`✅ Baked ${Object.keys(positions).length} node positions to ${outPath}`);
}

main().catch((err) => {
  console.error("Bake positions failed:", err);
  process.exit(1);
});
