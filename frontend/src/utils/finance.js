// Pure aggregation helpers over [Data]. No React, no UI — easy to test/reuse.

import { chooseBucket, formatBucketLabel, startOfWeekMonday, addMonths } from './dateRange';

export const CURRENCY = 'USD';

const round2 = (n) => Math.round(n * 100) / 100;

// Transactions whose date falls inside the window (inclusive).
export function filterByRange(data, { start, end }) {
  const s = start.getTime();
  const e = end.getTime();
  return data.filter((t) => {
    const d = new Date(t.date).getTime();
    return d >= s && d <= e;
  });
}

export function sumByType(transactions, type) {
  return round2(
    transactions.reduce((acc, t) => (t.type === type ? acc + Number(t.amount || 0) : acc), 0)
  );
}

export function computeTotals(transactions) {
  const income = sumByType(transactions, 'income');
  const expense = sumByType(transactions, 'expense');
  return { income, expense, balanceChange: round2(income - expense) };
}

// [{ category, total, count }] sorted high → low.
export function groupByCategory(expenses) {
  const map = new Map();
  expenses.forEach((t) => {
    const entry = map.get(t.category) || { category: t.category, total: 0, count: 0 };
    entry.total += Number(t.amount || 0);
    entry.count += 1;
    map.set(t.category, entry);
  });
  return [...map.values()]
    .map((e) => ({ ...e, total: round2(e.total) }))
    .sort((a, b) => b.total - a.total);
}

// Time-bucketed chart series with zero-filled gaps:
// [{ label, income, expense }]
export function buildSeries(transactions, { start, end }) {
  const bucket = chooseBucket(end.getTime() - start.getTime());

  const keyOf = (date) => {
    if (bucket === 'hour') return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    if (bucket === 'week') {
      const ws = startOfWeekMonday(date);
      return `${ws.getFullYear()}-${ws.getMonth()}-${ws.getDate()}`;
    }
    if (bucket === 'month') return `${date.getFullYear()}-${date.getMonth()}`;
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const groups = new Map();
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const k = keyOf(date);
    if (!groups.has(k)) groups.set(k, { income: 0, expense: 0 });
    const g = groups.get(k);
    if (t.type === 'income') g.income += Number(t.amount || 0);
    else g.expense += Number(t.amount || 0);
  });

  const points = [];
  const cursor = new Date(start);
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < 5000) {
    const g = groups.get(keyOf(cursor));
    points.push({
      label: formatBucketLabel(cursor, bucket),
      income: g ? round2(g.income) : 0,
      expense: g ? round2(g.expense) : 0,
    });
    if (bucket === 'hour') cursor.setHours(cursor.getHours() + 1);
    else if (bucket === 'day') cursor.setDate(cursor.getDate() + 1);
    else if (bucket === 'week') cursor.setDate(cursor.getDate() + 7);
    else cursor.setTime(addMonths(cursor, 1).getTime());
    guard += 1;
  }

  return points;
}

export function percentChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  return currencyFmt.format(Number(value || 0));
}

export function formatCompactCurrency(value) {
  const v = Number(value || 0);
  if (Math.abs(v) >= 1000) {
    return `${v < 0 ? '-' : ''}$${(Math.abs(v) / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}k`;
  }
  return `$${Math.round(v)}`;
}
