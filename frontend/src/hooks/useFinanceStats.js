import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import { useRange } from '../context/RangeContext';
import { getPreviousRange } from '../utils/dateRange';
import {
  filterByRange,
  computeTotals,
  groupByCategory,
  buildSeries,
  percentChange,
} from '../utils/finance';

// Everything the dashboard renders, derived from fetched transactions + selected range.
export function useFinanceStats() {
  const { transactions: Data, loading, error, refetch } = useTransactions();
  const { rangeKey, custom, range } = useRange();

  const stats = useMemo(() => {
    const transactions = filterByRange(Data, range);
    const totals = computeTotals(transactions);

    const prevTotals = computeTotals(
      filterByRange(Data, getPreviousRange(range))
    );

    const expenses = transactions.filter((t) => t.type === 'expense');
    const categories = groupByCategory(expenses);

    return {
      range,
      rangeKey,
      custom,
      transactionCount: transactions.length,
      expense: totals.expense,
      income: totals.income,
      balanceChange: totals.balanceChange,
      totalSpending: totals.expense,
      trend: {
        expense: percentChange(totals.expense, prevTotals.expense),
        income: percentChange(totals.income, prevTotals.income),
        balanceChange: percentChange(
          Math.max(totals.balanceChange, 0),
          Math.max(prevTotals.balanceChange, 0)
        ),
      },
      categories,
      series: buildSeries(transactions, range),
    };
  }, [Data, range, rangeKey, custom]);

  return { ...stats, loading, error, refetch };
}
