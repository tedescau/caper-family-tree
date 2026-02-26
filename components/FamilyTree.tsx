"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import type { ElementDefinition } from "cytoscape";
import { cytoscapeStylesheet } from "@/lib/styles";

// Register dagre layout
if (typeof window !== "undefined") {
  cytoscape.use(dagre);
}

interface FamilyTreeProps {
  elements: ElementDefinition[];
  positions?: Record<string, { x: number; y: number }>;
  onCyReady: (cy: cytoscape.Core) => void;
  onLayoutDone?: () => void;
}

export default function FamilyTree({
  elements,
  positions,
  onCyReady,
  onLayoutDone,
}: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Wait for fonts before rendering
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsReady(true);
    });
  }, []);

  const handleCy = useCallback(
    (cy: cytoscape.Core) => {
      cyRef.current = cy;
      onCyReady(cy);

      // Use baked positions if available, otherwise compute with dagre
      const layoutOptions = positions
        ? {
            name: "preset",
            positions: (node: cytoscape.NodeSingular) => {
              const pos = positions[node.id()];
              return pos || { x: 0, y: 0 };
            },
            fit: true,
            padding: 50,
          }
        : {
            name: "dagre",
            rankDir: "TB",
            nodeSep: 60,
            rankSep: 100,
            edgeSep: 10,
            fit: true,
            padding: 50,
            animate: false,
          };

      const layout = cy.layout(layoutOptions as cytoscape.LayoutOptions);

      layout.on("layoutstop", () => {
        cy.fit(undefined, 50);
        onLayoutDone?.();
      });

      layout.run();
    },
    [onCyReady, onLayoutDone, positions]
  );

  // Force re-render after fonts load
  useEffect(() => {
    if (fontsReady && cyRef.current) {
      cyRef.current.style().update();
      cyRef.current.forceRender();
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      >
        <p
          className="text-sm opacity-40"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
        >
          Mapping connections...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <CytoscapeComponent
        elements={elements}
        stylesheet={cytoscapeStylesheet}
        cy={handleCy}
        style={{ width: "100%", height: "100%" }}
        minZoom={0.3}
        maxZoom={3}
        wheelSensitivity={0.3}
        boxSelectionEnabled={false}
        autounselectify={true}
      />
    </div>
  );
}
