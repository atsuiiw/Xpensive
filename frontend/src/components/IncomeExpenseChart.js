import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Chart chrome colors come from the same CSS variables that drive the rest of
// the UI, so they follow the active theme. Brand income/expense colors stay
// constant across themes. CSS vars are resolved to concrete rgb() values here
// because SVG presentation attributes (fill/stroke) don't reliably support
// var() directly. The values re-read on every render, so toggling the theme
// (which re-renders the tree) picks up the new palette automatically.
const INCOME = "#059669";
const EXPENSE = "#dc2626";

function cssVar(name) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value ? `rgb(${value})` : undefined;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-muted mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="capitalize text-muted">{p.name}:</span>
          <span className="font-semibold tabular-nums text-main">{fmt.format(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ data }) {
  const GRID = cssVar("--c-border");
  const TICK = cssVar("--c-text-faint");
  const AXIS = cssVar("--c-border");
  const LEGEND = cssVar("--c-text-main");

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center">
        <p className="text-sm text-faint">No data available for this period</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-main mb-4 px-1">
        Income &amp; Expense
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={INCOME} stopOpacity={0.35} />
                <stop offset="95%" stopColor={INCOME} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={EXPENSE} stopOpacity={0.35} />
                <stop offset="95%" stopColor={EXPENSE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: TICK }}
              tickLine={false}
              axisLine={{ stroke: AXIS }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 12, fill: TICK }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 8, color: LEGEND }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={INCOME}
              strokeWidth={2}
              fill="url(#incomeFill)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={EXPENSE}
              strokeWidth={2}
              fill="url(#expenseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
