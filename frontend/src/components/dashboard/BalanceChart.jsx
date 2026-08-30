import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Panel from '../panel/Panel';
import { formatCompactCurrency, formatCurrency } from '../../utils/finance';
import { CHART } from '../../utils/chartPalette';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-2.5 text-xs shadow-popover">
      <p className="mb-1.5 font-semibold text-white/70">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.dataKey === 'income' ? CHART.income : CHART.expense }}
          />
          <span className="capitalize text-white/55">{p.dataKey}</span>
          <span className="ml-auto pl-4 font-semibold tabular-nums text-white">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const legendDot = 'inline-block h-2 w-2 rounded-full';

export default function BalanceChart({ series, periodLabel }) {
  return (
    <Panel className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Balance changes</h2>
          <p className="mt-0.5 text-xs capitalize text-white/45">{periodLabel}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <i className={`${legendDot} bg-accent`} /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <i className={`${legendDot} bg-negative`} /> Expense
          </span>
        </div>
      </div>

      <div className="mt-4 h-64 w-full sm:h-72" aria-label="Income and expense over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.income} stopOpacity={0.22} />
                <stop offset="100%" stopColor={CHART.income} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.expense} stopOpacity={0.2} />
                <stop offset="100%" stopColor={CHART.expense} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              dy={8}
            />
            <YAxis
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke={CHART.income}
              strokeWidth={1.75}
              fill="url(#incomeFill)"
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke={CHART.expense}
              strokeWidth={1.75}
              fill="url(#expenseFill)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}