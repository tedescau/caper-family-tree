"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import type { ElementDefinition } from "cytoscape";
import { cytoscapeStylesheet } from "@/lib/styles";

// Register fCoSE layout
if (typeof window !== "undefined") {
  cytoscape.use(fcose);
}

interface FamilyTreeProps {
  elements: ElementDefinition[];
  onCyReady: (cy: cytoscape.Core) => void;
  onLayoutDone?: () => void;
}

export default function FamilyTree({
  elements,
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

      // Run layout
      const layout = cy.layout({
        name: "fcose",
        quality: "default",
        animate: true,
        animationDuration: 800,
        animationEasing: "ease-out-cubic",
        nodeRepulsion: () => 6000,
        idealEdgeLength: () => 100,
        edgeElasticity: () => 0.45,
        gravity: 0.3,
        gravityRange: 3.8,
        nodeSeparation: 75,
        // Pin Momofuku group at the top center
        fixedNodeConstraint: [
          { nodeId: "momofuku", position: { x: 0, y: -250 } },
        ],
        relativePlacementConstraint: [
          { top: "momofuku", bottom: "ko", gap: 120 },
          { top: "momofuku", bottom: "noodle-bar", gap: 120 },
          { top: "momofuku", bottom: "ssam-bar", gap: 120 },
          { top: "ko", bottom: "chase-sinzer", gap: 100 },
          { top: "ko", bottom: "sean-gray", gap: 100 },
          { top: "ko", bottom: "joshua-pinsky", gap: 100 },
        ],
      } as cytoscape.LayoutOptions);

      layout.on("layoutstop", () => {
        onLayoutDone?.();
      });

      layout.run();
    },
    [onCyReady, onLayoutDone]
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
        textureOnViewport={true}
        boxSelectionEnabled={false}
        autounselectify={true}
      />
    </div>
  );
}
