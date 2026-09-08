const amountFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RecentTransactions({ transactions }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-main">
          Recent Balance Changes
        </h2>
        <span className="text-xs font-medium text-faint">
          {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-faint">
          No transactions found for this period
        </p>
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface-alt">
              <tr>
                {["Date", "Name", "Description", "Tag", "Income", "Expense"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-hover transition-colors">
                  <td className="whitespace-nowrap px-5 py-3 text-muted">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-5 py-3 font-medium text-main">
                    {t.name || "—"}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-muted">
                    {t.description || "—"}
                  </td>
                  <td className="px-5 py-3">
                    {t.tag ? (
                      <span className="inline-flex rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-muted">
                        {t.tag}
                      </span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums text-income">
                    {Number(t.income) > 0 ? amountFmt.format(t.income) : "-"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums text-expense">
                    {Number(t.expense) > 0 ? amountFmt.format(t.expense) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
