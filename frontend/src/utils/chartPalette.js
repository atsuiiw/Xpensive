// Single source of truth for data-viz colors (recharts needs literal values).
// Mirrors tailwind.config.js tokens: accent = #34d399 (emerald), negative = #fb7185 (rose).
// Categorical ramp is muted so it never competes with the neutrals.

export const CHART = {
  income: '#34d399',
  expense: '#fb7185',
  incomeFill: 'rgba(52, 211, 153, 0.16)',
  expenseFill: 'rgba(251, 113, 133, 0.14)',
};

export const CATEGORY_COLORS = [
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#22d3ee',
  '#f472b6',
  '#94a3b8',
];