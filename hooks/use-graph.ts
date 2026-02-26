"use client";

import { useCallback, useRef, useState } from "react";
import type cytoscape from "cytoscape";
import type { GraphNode } from "@/data/validated-data";

export function useGraph(nodeLookup: Map<string, GraphNode>) {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const selectNode = useCallback(
    (id: string | null) => {
      const cy = cyRef.current;
      if (!cy) return;

      // Clear previous
      cy.elements().removeClass("selected hover dimmed highlighted neighbor");

      if (!id) {
        setSelectedNode(null);
        return;
      }

      const node = cy.getElementById(id);
      if (!node.length) return;

      // Highlight neighborhood
      const neighborhood = node.closedNeighborhood();
      cy.elements().not(neighborhood).addClass("dimmed");
      neighborhood.edges().addClass("highlighted");
      neighborhood.nodes().not(node).addClass("neighbor");
      node.addClass("selected");

      // Center on node
      cy.animate({
        center: { eles: node },
        duration: 400,
        easing: "ease-out-cubic",
      });

      setSelectedNode(nodeLookup.get(id) ?? null);
    },
    [nodeLookup]
  );

  const handleCyReady = useCallback(
    (cy: cytoscape.Core) => {
      cyRef.current = cy;

      cy.on("tap", "node", (evt) => {
        selectNode(evt.target.id());
      });

      cy.on("tap", (evt) => {
        if (evt.target === cy) selectNode(null);
      });

      // Desktop hover
      cy.on("mouseover", "node", (evt) => {
        if (selectedNode) return; // Don't override selection
        const node = evt.target;
        node.addClass("hover");
        const neighborhood = node.closedNeighborhood();
        cy.elements().not(neighborhood).addClass("dimmed");
        neighborhood.edges().addClass("highlighted");
      });

      cy.on("mouseout", "node", () => {
        if (selectedNode) return;
        cy.elements().removeClass("hover dimmed highlighted");
      });
    },
    [selectNode, selectedNode]
  );

  return {
    cyRef,
    selectedNode,
    selectNode,
    handleCyReady,
  };
}
