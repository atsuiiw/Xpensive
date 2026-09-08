/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand / semantic tokens driven by CSS variables (see src/index.css).
        // income/expense/accent stay constant across themes (brand colors).
        income: "rgb(var(--c-income) / <alpha-value>)",
        expense: "rgb(var(--c-expense) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        // Chrome / surfaces adapt to the active theme.
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--c-surface-alt) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        control: "rgb(var(--c-control) / <alpha-value>)",
        hover: "rgb(var(--c-hover) / <alpha-value>)",
        "primary-soft": "rgb(var(--c-primary-soft) / <alpha-value>)",
        "text-main": "rgb(var(--c-text-main) / <alpha-value>)",
        "text-muted": "rgb(var(--c-text-muted) / <alpha-value>)",
        "text-faint": "rgb(var(--c-text-faint) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
        "border-strong": "rgb(var(--c-border-strong) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
