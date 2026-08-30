import { useMemo, useState } from 'react';
import Panel from '../panel/Panel';
import { useRange } from '../../context/RangeContext';
import { filterByRange, formatCurrency } from '../../utils/finance';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function Amount({ type, amount }) {
  const income = type === 'income';
  return (
    <span className={`font-semibold tabular-nums ${income ? 'text-accent' : 'text-white'}`}>
      {income ? '+' : '−'}
      {formatCurrency(amount)}
    </span>
  );
}

export default function TransactionList({ transactions, periodLabel }) {
  const { range } = useRange();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const inRange = filterByRange(transactions, range).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const q = query.trim().toLowerCase();
    if (!q) return inRange;
    return inRange.filter((t) =>
      [t.category, t.note, t.tag].some((s) => (s || '').toLowerCase().includes(q))
    );
  }, [transactions, range, query]);

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Transactions</h2>
          <p className="mt-0.5 text-xs capitalize text-white/45" aria-live="polite">
            {rows.length} of {filterByRange(transactions, range).length} · {periodLabel}
          </p>
        </div>
        <label className="relative block">
          <span className="sr-only">Search transactions</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, note, tag…"
            className="w-64 max-w-full rounded-xl border border-hairline bg-surface-sunken px-3.5 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </label>
      </div>

      {rows.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-hairline px-4 py-10 text-center text-sm text-white/40">
          {query ? 'No transactions match your search.' : 'No transactions in this range.'}
        </p>
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-xl border border-hairline md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Transactions in {periodLabel}</caption>
              <thead>
                <tr className="border-b border-hairline bg-surface-sunken text-left text-xs uppercase tracking-wider text-white/40">
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Note</th>
                  <th scope="col" className="px-4 py-3 font-medium">Tag</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b border-hairline/60 last:border-b-0">
                    <td className="whitespace-nowrap px-4 py-3 text-white/60 tabular-nums">
                      {dateFmt.format(new Date(t.date))}
                    </td>
                    <td className="px-4 py-3 font-medium text-white/90">{t.category}</td>
                    <td className="max-w-[16rem] truncate px-4 py-3 text-white/55">{t.note}</td>
                    <td className="px-4 py-3">
                      {t.tag ? (
                        <span className="rounded-full border border-hairline bg-surface-raised px-2 py-0.5 text-xs text-white/60">
                          {t.tag}
                        </span>
                      ) : (
                        <span className="text-white/25">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Amount type={t.type} amount={t.amount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 space-y-2 md:hidden">
            {rows.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-sunken px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white/90">{t.category}</p>
                  <p className="truncate text-xs text-white/45">
                    {dateFmt.format(new Date(t.date))}
                    {t.note ? ` · ${t.note}` : ''}
                    {t.tag ? ` · ${t.tag}` : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Amount type={t.type} amount={t.amount} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}