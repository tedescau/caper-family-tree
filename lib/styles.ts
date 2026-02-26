import type { StylesheetStyle } from "cytoscape";
import { colors, edgeColors, fonts } from "./tokens";

export const cytoscapeStylesheet: StylesheetStyle[] = [
  // Base node
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-family": fonts.ui,
      "font-size": "11px",
      color: colors.primary,
      "text-wrap": "wrap",
      "text-max-width": "90px",
      "background-color": colors.background,
      "border-width": 1.5,
      "border-color": colors.primary,
      "overlay-opacity": 0,
      "transition-property":
        "border-width, border-color, opacity, background-color",
      "transition-duration": 150,
    },
  },

  // Person nodes — circle with initials
  {
    selector: 'node[kind = "person"]',
    style: {
      shape: "ellipse",
      width: 56,
      height: 56,
      label: "data(initials)",
      "font-family": fonts.headline,
      "font-size": "16px",
      "font-weight": 700,
      "text-valign": "center",
      "text-halign": "center",
    },
  },

  // Restaurant nodes — round rectangle (pill)
  {
    selector: 'node[kind = "restaurant"]',
    style: {
      shape: "round-rectangle",
      width: "label",
      height: 32,
      "padding-left": "12px",
      "padding-right": "12px",
      "font-family": fonts.accent,
      "font-size": "12px",
      "font-style": "italic",
    },
  },

  // Closed restaurants — dashed border
  {
    selector: 'node[kind = "restaurant"][status = "closed"]',
    style: {
      "border-style": "dashed",
      opacity: 0.55,
    },
  },

  // Group/Org nodes — diamond
  {
    selector: 'node[kind = "group"]',
    style: {
      shape: "diamond",
      width: 40,
      height: 40,
      "background-color": "transparent",
      "font-family": fonts.ui,
      "font-size": "10px",
      "text-valign": "bottom",
      "text-margin-y": 8,
      label: "data(label)",
    },
  },

  // Base edge
  {
    selector: "edge",
    style: {
      width: 1,
      "curve-style": "bezier",
      opacity: 0.45,
      "target-arrow-shape": "triangle",
      "target-arrow-color": colors.graphite,
      "arrow-scale": 0.6,
      "line-color": colors.graphite,
      label: "",
      "font-size": "9px",
      "font-family": fonts.ui,
      color: colors.warmSlate,
      "text-rotation": "autorotate",
      "text-margin-y": -8,
      "text-opacity": 0,
      "transition-property": "opacity, line-color, width",
      "transition-duration": 150,
    },
  },

  // Relationship-specific edge styles
  {
    selector: 'edge[relType = "alumni"]',
    style: {
      "line-color": edgeColors.alumni.color,
      "target-arrow-color": edgeColors.alumni.color,
      "line-style": "dashed" as const,
      width: edgeColors.alumni.width,
    },
  },
  {
    selector: 'edge[relType = "founded"]',
    style: {
      "line-color": edgeColors.founded.color,
      "target-arrow-color": edgeColors.founded.color,
      width: edgeColors.founded.width,
      "target-arrow-shape": "none",
    },
  },
  {
    selector: 'edge[relType = "current_staff"]',
    style: {
      "line-color": edgeColors.current_staff.color,
      "target-arrow-color": edgeColors.current_staff.color,
      width: edgeColors.current_staff.width,
      "target-arrow-shape": "none",
    },
  },
  {
    selector: 'edge[relType = "opened_new"]',
    style: {
      "line-color": edgeColors.opened_new.color,
      "target-arrow-color": edgeColors.opened_new.color,
      "line-style": "dashed" as const,
      width: edgeColors.opened_new.width,
    },
  },
  {
    selector: 'edge[relType = "belongs_to"]',
    style: {
      "line-color": edgeColors.belongs_to.color,
      "target-arrow-color": edgeColors.belongs_to.color,
      width: edgeColors.belongs_to.width,
      "target-arrow-shape": "none",
    },
  },
  {
    selector: 'edge[relType = "family"]',
    style: {
      "line-color": edgeColors.family.color,
      "target-arrow-color": edgeColors.family.color,
      width: edgeColors.family.width,
      "target-arrow-shape": "none",
    },
  },
  {
    selector: 'edge[relType = "same_space"]',
    style: {
      "line-color": edgeColors.same_space.color,
      "target-arrow-color": edgeColors.same_space.color,
      "line-style": "dotted" as const,
      width: edgeColors.same_space.width,
    },
  },

  // Hover state
  {
    selector: "node.hover",
    style: {
      "border-width": 2.5,
      "border-color": colors.accent,
    },
  },

  // Selected node
  {
    selector: "node.selected",
    style: {
      "border-width": 3,
      "border-color": colors.accent,
      "background-color": colors.cardBg,
    },
  },

  // Dimmed state (everything NOT in neighborhood)
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.15,
    },
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.05,
    },
  },

  // Highlighted edges (in neighborhood)
  {
    selector: "edge.highlighted",
    style: {
      opacity: 1,
      "text-opacity": 1,
      label: "data(label)",
    },
  },

  // Neighbor nodes
  {
    selector: "node.neighbor",
    style: {
      opacity: 0.85,
    },
  },
];
