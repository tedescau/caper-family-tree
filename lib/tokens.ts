// Design tokens shared between Tailwind and Cytoscape
// Cytoscape renders to <canvas> and can't read CSS vars, so everything is JS

export const colors = {
  primary: "#1a1a1a",
  background: "#E8EBE5",
  cardBg: "#FAFAF7",
  accent: "#6E79D6",
  warmSlate: "#7C8076",
  warmTan: "#B5A48B",
  graphite: "#9CA3AF",
  terracotta: "#C4806E",
  // Node type colors — cleaner B&W per reference
  personBg: "#FAFAF7",
  personBorder: "#1a1a1a",
  restaurantBg: "#1a1a1a",
  restaurantText: "#FAFAF7",
  alumniRestaurantBg: "#FAFAF7",
  alumniRestaurantBorder: "#1a1a1a",
  alumniRestaurantText: "#1a1a1a",
  closedBg: "#D4D4D4",
  closedBorder: "#9CA3AF",
  closedText: "#6B7280",
  groupBg: "#1a1a1a",
  groupText: "#FAFAF7",
} as const;

export const edgeColors: Record<string, { color: string; style: string; width: number }> = {
  alumni: { color: "#1a1a1a", style: "dashed", width: 1.5 },
  founded: { color: "#1a1a1a", style: "solid", width: 2.5 },
  current_staff: { color: colors.warmSlate, style: "solid", width: 1 },
  opened_new: { color: "#1a1a1a", style: "dashed", width: 1.5 },
  belongs_to: { color: colors.graphite, style: "dotted", width: 0.8 },
  family: { color: colors.terracotta, style: "solid", width: 1.5 },
  same_space: { color: colors.graphite, style: "dotted", width: 1 },
};

export const fonts = {
  headline: "'Playfair Display', serif",
  body: "'Spectral', serif",
  accent: "'Instrument Serif', serif",
  ui: "'Inter', sans-serif",
} as const;
