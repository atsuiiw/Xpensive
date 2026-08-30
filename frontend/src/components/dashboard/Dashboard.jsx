import { useFinanceStats } from '../../hooks/useFinanceStats';
import { useTransactions } from '../../context/TransactionsContext';
import { useRange } from '../../context/RangeContext';
import { describeRange } from '../../utils/dateRange';
import Panel from '../panel/Panel';
import RangeSelector from './RangeSelector';
import StatsGrid from './StatsGrid';
import BalanceChart from './BalanceChart';
import SpendingByCategory from './SpendingByCategory';
import TransactionList from '../transactions/TransactionList';

function StatusCard({ tone = 'default', children }) {
  const tones = {
    default: 'text-white/70',
    danger: 'text-negative',
  };
  return (
    <div className="mx-auto mt-24 max-w-md">
      <Panel className={`px-8 py-10 ${tones[tone]}`}>
        <div className="flex flex-col items-center gap-4 text-center">{children}</div>
      </Panel>
    </div>
  );
}

function Wordmark({ periodLabel }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-canvas">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="h-5 w-5">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Xpensive</h1>
        <p className="text-xs capitalize text-white/45">Overview · {periodLabel}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = useFinanceStats();
  const { transactions, loading, error, refetch } = useTransactions();
  const { rangeKey, custom } = useRange();
  const periodLabel = describeRange(rangeKey, custom);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl animate-fade-up px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <StatusCard>
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
          <p className="text-sm tracking-wide">Loading transactions…</p>
        </StatusCard>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl animate-fade-up px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <StatusCard tone="danger">
          <p className="text-sm font-medium">Couldn&rsquo;t load your transactions.</p>
          <p className="text-xs text-white/50">
            Make sure the backend is running on port 5200.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="rounded-xl border border-hairline bg-surface-raised px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Retry
          </button>
        </StatusCard>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl animate-fade-up px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Wordmark periodLabel={periodLabel} />
        <RangeSelector />
      </header>

      {transactions.length === 0 ? (
        <section className="mt-8">
          <StatusCard>
            <p className="text-sm font-medium">No transactions found.</p>
            <p className="text-xs text-white/50">Add entries in the database to see your overview.</p>
          </StatusCard>
        </section>
      ) : (
        <>
          <section aria-label="Key metrics" className="mt-8">
            <StatsGrid stats={stats} />
          </section>

          <section
            aria-label="Balance and spending details"
            className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5"
          >
            <div className="lg:col-span-3">
              <BalanceChart series={stats.series} periodLabel={periodLabel} />
            </div>
            <div className="lg:col-span-2">
              <SpendingByCategory stats={stats} periodLabel={periodLabel} />
            </div>
          </section>

          <section aria-label="Transactions" className="mt-5">
            <TransactionList transactions={transactions} periodLabel={periodLabel} />
          </section>
        </>
      )}
    </main>
  );
}