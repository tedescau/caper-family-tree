import type { StylesheetStyle } from "cytoscape";
import { colors, edgeColors, fonts } from "./tokens";

export const cytoscapeStylesheet: StylesheetStyle[] = [
  // ── Base node ──────────────────────────────────────────────
  {
    selector: "node",
    style: {
      shape: "round-rectangle",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-family": fonts.ui,
      "font-size": "11px",
      "font-weight": 500,
      color: colors.primary,
      "text-wrap": "wrap",
      "text-max-width": "110px",
      "background-color": colors.personBg,
      "border-width": 1.5,
      "border-color": colors.primary,
      "overlay-opacity": 0,
      width: "label",
      height: 32,
      "padding-left": "12px",
      "padding-right": "12px",
      "transition-property":
        "border-width, border-color, opacity, background-color",
      "transition-duration": 150,
    },
  },

  // ── Person nodes — rectangle with full name ────────────────
  {
    selector: 'node[kind = "person"]',
    style: {
      width: "label",
      height: 32,
      "padding-left": "14px",
      "padding-right": "14px",
      label: "data(label)",
      "font-family": fonts.ui,
      "font-size": "11px",
      "font-weight": 500,
      "background-color": colors.personBg,
      "border-color": colors.personBorder,
      "border-width": 1.5,
      color: colors.primary,
    },
  },

  // Founders & leadership — slightly bolder
  {
    selector: 'node[kind = "person"][?tags]',
    style: {} as any, // base — overridden by tag selectors below
  },

  // ── Momofuku restaurant nodes — dark fill ──────────────────
  {
    selector: 'node[kind = "restaurant"][isAlumni = "false"]',
    style: {
      width: "label",
      height: 32,
      "padding-left": "14px",
      "padding-right": "14px",
      "font-family": fonts.accent,
      "font-size": "11px",
      "font-style": "italic",
      "background-color": colors.restaurantBg,
      "border-width": 0,
      color: colors.restaurantText,
      label: "data(label)",
    },
  },

  // ── Alumni-opened restaurants — white fill, dashed border ──
  {
    selector: 'node[kind = "restaurant"][isAlumni = "true"]',
    style: {
      width: "label",
      height: 32,
      "padding-left": "14px",
      "padding-right": "14px",
      "font-family": fonts.accent,
      "font-size": "11px",
      "font-style": "italic",
      "background-color": colors.alumniRestaurantBg,
      "border-width": 2,
      "border-style": "dashed" as const,
      "border-color": colors.alumniRestaurantBorder,
      color: colors.alumniRestaurantText,
      label: "data(label)",
    },
  },

  // ── Closed restaurants — faded ─────────────────────────────
  {
    selector: 'node[kind = "restaurant"][status = "closed"]',
    style: {
      "background-color": colors.closedBg,
      "border-style": "dashed" as const,
      "border-width": 1,
      "border-color": colors.closedBorder,
      opacity: 0.6,
      color: colors.closedText,
    },
  },

  // ── Group/Org nodes — large rectangle, dark fill ───────────
  {
    selector: 'node[kind = "group"]',
    style: {
      shape: "round-rectangle",
      width: "label",
      height: 40,
      "padding-left": "18px",
      "padding-right": "18px",
      "background-color": colors.groupBg,
      "border-width": 0,
      "font-family": fonts.ui,
      "font-size": "12px",
      "font-weight": 700,
      "text-transform": "uppercase" as any,
      color: colors.groupText,
      label: "data(label)",
    },
  },

  // Momofuku group — largest, dominant
  {
    selector: 'node[id = "momofuku"]',
    style: {
      height: 48,
      "padding-left": "24px",
      "padding-right": "24px",
      "font-size": "14px",
      "border-width": 2,
      "border-color": colors.warmTan,
    },
  },

  // ── Base edge ──────────────────────────────────────────────
  {
    selector: "edge",
    style: {
      width: 1.2,
      "curve-style": "bezier",
      opacity: 0.35,
      "target-arrow-shape": "triangle",
      "target-arrow-color": colors.primary,
      "arrow-scale": 0.5,
      "line-color": colors.primary,
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

  // ── Relationship-specific edges ────────────────────────────
  {
    selector: 'edge[relType = "alumni"]',
    style: {
      "line-color": edgeColors.alumni.color,
      "target-arrow-color": edgeColors.alumni.color,
      "line-style": "dashed" as const,
      width: edgeColors.alumni.width,
      opacity: 0.45,
    },
  },
  {
    selector: 'edge[relType = "founded"]',
    style: {
      "line-color": edgeColors.founded.color,
      "target-arrow-color": edgeColors.founded.color,
      width: edgeColors.founded.width,
      opacity: 0.7,
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
      opacity: 0.3,
    },
  },
  {
    selector: 'edge[relType = "opened_new"]',
    style: {
      "line-color": edgeColors.opened_new.color,
      "target-arrow-color": edgeColors.opened_new.color,
      "line-style": "dashed" as const,
      width: edgeColors.opened_new.width,
      opacity: 0.6,
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.6,
    },
  },
  {
    selector: 'edge[relType = "belongs_to"]',
    style: {
      "line-color": edgeColors.belongs_to.color,
      "target-arrow-color": edgeColors.belongs_to.color,
      width: edgeColors.belongs_to.width,
      "target-arrow-shape": "none",
      opacity: 0.15,
      "line-style": "dotted" as const,
    },
  },
  {
    selector: 'edge[relType = "family"]',
    style: {
      "line-color": edgeColors.family.color,
      "target-arrow-color": edgeColors.family.color,
      width: edgeColors.family.width,
      "target-arrow-shape": "none",
      opacity: 0.5,
    },
  },
  {
    selector: 'edge[relType = "same_space"]',
    style: {
      "line-color": edgeColors.same_space.color,
      "target-arrow-color": edgeColors.same_space.color,
      "line-style": "dotted" as const,
      width: edgeColors.same_space.width,
      opacity: 0.3,
    },
  },

  // ── Interaction states ─────────────────────────────────────
  {
    selector: "node.hover",
    style: {
      "border-width": 3,
      "border-color": colors.accent,
      "underlay-color": colors.accent,
      "underlay-opacity": 0.08,
      "underlay-padding": 6,
    },
  },
  {
    selector: "node.selected",
    style: {
      "border-width": 3,
      "border-color": colors.accent,
      "underlay-color": colors.accent,
      "underlay-opacity": 0.12,
      "underlay-padding": 8,
    },
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.12,
    },
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.04,
    },
  },
  {
    selector: "edge.highlighted",
    style: {
      opacity: 1,
      "text-opacity": 1,
      label: "data(label)",
    },
  },
  {
    selector: "node.neighbor",
    style: {
      opacity: 0.85,
    },
  },
];
