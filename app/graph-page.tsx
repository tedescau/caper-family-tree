"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { buildElements } from "@/lib/graph-utils";
import { buildNodeLookup } from "@/data/validated-data";
import type { GraphNode } from "@/data/validated-data";
import NodeCard from "@/components/NodeCard";
import Legend from "@/components/Legend";

const FamilyTree = dynamic(() => import("@/components/FamilyTree"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p
        className="text-sm opacity-40"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
        }}
      >
        Mapping connections...
      </p>
    </div>
  ),
});

export default function GraphPage() {
  const elements = useMemo(() => buildElements(), []);
  const nodeLookup = useMemo(() => buildNodeLookup(), []);

  // Read initial node from URL client-side
  const initialNodeId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("node");
  }, []);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const selectedNodeRef = useRef<GraphNode | null>(null);
  const [layoutDone, setLayoutDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [cyInstance, setCyInstance] = useState<import("cytoscape").Core | null>(
    null
  );

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: GraphNode[] = [];
    nodeLookup.forEach((node) => {
      if (node.label.toLowerCase().includes(q)) {
        results.push(node);
      }
    });
    setSearchResults(results.slice(0, 8));
  }, [searchQuery, nodeLookup]);

  const selectNode = useCallback(
    (id: string | null) => {
      if (!cyInstance) return;

      cyInstance
        .elements()
        .removeClass("selected hover dimmed highlighted neighbor");

      if (!id) {
        setSelectedNode(null);
        selectedNodeRef.current = null;
        // Update URL
        window.history.replaceState(null, "", "/");
        return;
      }

      const cyNode = cyInstance.getElementById(id);
      if (!cyNode.length) return;

      const neighborhood = cyNode.closedNeighborhood();
      cyInstance.elements().not(neighborhood).addClass("dimmed");
      neighborhood.edges().addClass("highlighted");
      neighborhood.nodes().not(cyNode).addClass("neighbor");
      cyNode.addClass("selected");

      cyInstance.animate({
        center: { eles: cyNode },
        duration: 400,
        easing: "ease-out-cubic" as cytoscape.Css.TransitionTimingFunction,
      });

      const node = nodeLookup.get(id) ?? null;
      setSelectedNode(node);
      selectedNodeRef.current = node;
      setSearchQuery("");
      setSearchResults([]);

      // Update URL
      window.history.replaceState(null, "", `?node=${id}`);
    },
    [cyInstance, nodeLookup]
  );

  const handleCyReady = useCallback(
    (cy: import("cytoscape").Core) => {
      setCyInstance(cy);

      cy.on("tap", "node", (evt) => {
        selectNode(evt.target.id());
      });

      cy.on("tap", (evt) => {
        if (evt.target === cy) selectNode(null);
      });

      cy.on("mouseover", "node", (evt) => {
        const node = evt.target;
        node.addClass("hover");
        const neighborhood = node.closedNeighborhood();
        cy.elements().not(neighborhood).addClass("dimmed");
        neighborhood.edges().addClass("highlighted");
      });

      cy.on("mouseout", "node", () => {
        if (!selectedNodeRef.current) {
          cy.elements().removeClass("hover dimmed highlighted");
        }
      });

      // Initial selection from URL
      if (initialNodeId && nodeLookup.has(initialNodeId)) {
        setTimeout(() => selectNode(initialNodeId), 1000);
      }
    },
    [selectNode, initialNodeId, nodeLookup]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-black/5 flex-shrink-0">
        <div
          className="text-sm font-medium tracking-wide uppercase opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Caper
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, restaurants..."
            className="bg-black/5 border-0 rounded-sm px-3 py-1.5 text-sm w-48 md:w-64
                       placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-[#6E79D6]/30
                       font-[family-name:var(--font-instrument)] italic"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full right-0 mt-1 bg-[#FAFAF7] border border-black/8 rounded-sm shadow-md w-64 z-50">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  onClick={() => selectNode(node.id)}
                  className="block w-full text-left px-3 py-2 hover:bg-black/5 transition-colors"
                >
                  <span className="text-sm font-medium">{node.label}</span>
                  <span className="text-[10px] opacity-40 ml-2 uppercase">
                    {node.kind}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Editorial Frame */}
      <div className="text-center py-8 md:py-12 px-4 flex-shrink-0">
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          The Momofuku
          <br />
          Family Tree
        </h1>
        <p
          className="text-base md:text-lg mt-3 max-w-[520px] mx-auto opacity-70"
          style={{ fontFamily: "var(--font-spectral)" }}
        >
          How one restaurant group shaped a generation of New York chefs.
        </p>
        <p
          className="text-xs mt-2 uppercase tracking-widest opacity-40"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          By Caper &middot; Feb 2026
        </p>
      </div>

      {/* Graph */}
      <div className="flex-1 relative px-2 md:px-4">
        <div
          className={`graph-container rounded-sm border border-black/5 bg-[#E2E6DF] ${layoutDone ? "graph-fade-in" : ""}`}
        >
          <FamilyTree
            elements={elements}
            onCyReady={handleCyReady}
            onLayoutDone={() => setLayoutDone(true)}
          />
        </div>

        {/* Desktop: Floating card */}
        {selectedNode && (
          <div className="hidden md:block absolute top-4 right-6 z-40">
            <NodeCard
              node={selectedNode}
              onClose={() => selectNode(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile: Bottom panel */}
      {selectedNode && (
        <div className="md:hidden node-card-panel">
          <NodeCard
            node={selectedNode}
            onClose={() => selectNode(null)}
          />
        </div>
      )}

      {/* Legend */}
      <Legend />

      {/* Footer */}
      <footer className="text-center py-4 opacity-30">
        <p className="text-[10px] font-sans tracking-wide uppercase">
          Built by Caper &times; Every
        </p>
      </footer>
    </div>
  );
}
