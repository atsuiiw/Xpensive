import Panel from '../panel/Panel';

function TrendBadge({ value, positiveIsGood }) {
  if (value == null || Number.isNaN(value)) return null;
  const up = value >= 0;
  const good = positiveIsGood ? up : !up;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        good ? 'bg-accent-soft text-accent' : 'bg-negative-soft text-negative'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-3 w-3 ${up ? '' : 'rotate-180'}`}
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default function StatCard({
  label,
  value,
  trend,
  positiveIsGood = true,
  icon,
  hero = false,
  sub,
  className = '',
}) {
  return (
    <Panel className={`p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-white/70 ring-1 ring-inset ring-hairline">
          {icon}
        </span>
        <TrendBadge value={trend} positiveIsGood={positiveIsGood} />
      </div>
      <p className="text-overline mt-5 text-white/50">{label}</p>
      <p
        className={`mt-1 truncate font-bold tabular-nums tracking-tight ${
          hero ? 'text-stat-hero' : 'text-stat'
        }`}
        title={String(value)}
      >
        {value}
      </p>
      {sub ? <p className="mt-2 text-xs text-white/40">{sub}</p> : null}
    </Panel>
  );
}