import StatCard from './StatCard';
import { formatCurrency } from '../../utils/finance';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-5 w-5',
};

const IconExpense = (
  <svg {...iconProps}>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

const IconIncome = (
  <svg {...iconProps}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const IconBalance = (
  <svg {...iconProps}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

// Asymmetric metrics row: one hero "Net change" stat anchored against the two
// leaner Income/Expense cards. One landing point, not three equal boxes.
export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      <StatCard
        hero
        className="sm:col-span-2"
        label="Net change"
        sub="vs the previous period"
        value={formatCurrency(stats.balanceChange)}
        trend={stats.trend.balanceChange}
        positiveIsGood
        icon={IconBalance}
      />
      <StatCard
        label="Income"
        value={formatCurrency(stats.income)}
        trend={stats.trend.income}
        positiveIsGood
        icon={IconIncome}
      />
      <StatCard
        label="Expense"
        value={formatCurrency(stats.expense)}
        trend={stats.trend.expense}
        positiveIsGood={false}
        icon={IconExpense}
      />
    </div>
  );
}