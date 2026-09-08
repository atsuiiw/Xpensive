const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function Card({ label, value, accent, count }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className={`h-1 w-full ${accent}`} />
      <div className="p-5">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-main">
          {fmt.format(value)}
        </p>
        {count !== undefined && (
          <p className="mt-1 text-xs text-faint">{count} entries</p>
        )}
      </div>
    </div>
  );
}

export default function SummaryCards({ totalIncome, totalExpense, balance, count }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card label="Income" value={totalIncome} accent="bg-emerald-500" count={count} />
      <Card label="Expenses" value={totalExpense} accent="bg-red-500" count={count} />
      <Card
        label="Net Balance"
        value={balance}
        accent={balance >= 0 ? "bg-emerald-500" : "bg-red-500"}
        count={count}
      />
    </div>
  );
}
