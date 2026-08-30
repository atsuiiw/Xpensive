import { useMemo, useState } from 'react';
import Panel from '../panel/Panel';
import { formatCurrency } from '../../utils/finance';
import { CATEGORY_COLORS } from '../../utils/chartPalette';

const chip = (active) =>
  `rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 ${
    active
      ? 'border-transparent bg-accent text-canvas'
      : 'border-hairline bg-surface-raised text-white/60 hover:text-white'
  }`;

export default function SpendingByCategory({ stats, periodLabel }) {
  const [selected, setSelected] = useState(() => new Set());

  const toggle = (category) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });

  const shown = useMemo(
    () =>
      selected.size === 0
        ? stats.categories
        : stats.categories.filter((c) => selected.has(c.category)),
    [selected, stats.categories]
  );

  const maxTotal = shown.length ? Math.max(...shown.map((c) => c.total)) : 0;
  const shownSum = shown.reduce((acc, c) => acc + c.total, 0);

  return (
    <Panel className="flex flex-col p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Total spending</h2>
        <p className="mt-0.5 text-xs text-white/45 capitalize">{periodLabel}</p>
        <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
          {formatCurrency(shownSum)}
        </p>
        <p className="mt-1 text-xs text-white/40">
          {selected.size === 0
            ? `across ${stats.categories.length} categories`
            : `${shown.length} of ${stats.categories.length} categories`}
        </p>
      </div>

      {stats.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Filter categories">
          <button type="button" onClick={() => setSelected(new Set())} className={chip(selected.size === 0)}>
            All
          </button>
          {stats.categories.map((c) => (
            <button
              key={c.category}
              type="button"
              aria-pressed={selected.has(c.category)}
              onClick={() => toggle(c.category)}
              className={chip(selected.has(c.category))}
            >
              {c.category}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-4 overflow-y-auto pr-1">
        {shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-white/40">
            No expenses recorded for this selection.
          </p>
        ) : (
          shown.map((c, i) => {
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            const pct = maxTotal ? Math.round((c.total / maxTotal) * 100) : 0;
            return (
              <div key={c.category}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="truncate text-white/75">{c.category}</span>
                  </span>
                  <span className="ml-3 shrink-0 font-semibold tabular-nums">{formatCurrency(c.total)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}