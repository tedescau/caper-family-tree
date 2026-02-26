// Design tokens shared between Tailwind and Cytoscape
// Cytoscape renders to <canvas> and can't read CSS vars, so everything is JS

export const colors = {
  primary: "#030712",
  background: "#E2E6DF",
  cardBg: "#FAFAF7",
  accent: "#6E79D6",
  warmSlate: "#7C8076",
  warmTan: "#B5A48B",
  graphite: "#9CA3AF",
  terracotta: "#C4806E",
} as const;

export const edgeColors: Record<string, { color: string; style: string; width: number }> = {
  alumni: { color: colors.accent, style: "dashed", width: 1.5 },
  founded: { color: colors.primary, style: "solid", width: 2.5 },
  current_staff: { color: colors.warmSlate, style: "solid", width: 1 },
  opened_new: { color: colors.warmTan, style: "dashed", width: 1.5 },
  belongs_to: { color: colors.graphite, style: "solid", width: 1 },
  family: { color: colors.terracotta, style: "solid", width: 1.5 },
  same_space: { color: colors.graphite, style: "dotted", width: 1 },
};

export const fonts = {
  headline: "'Playfair Display', serif",
  body: "'Spectral', serif",
  accent: "'Instrument Serif', serif",
  ui: "'Inter', sans-serif",
} as const;
