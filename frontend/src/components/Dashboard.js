import { useState } from "react";
import TimeFilter from "./TimeFilter";
import TagFilter from "./TagFilter";
import ThemeToggle from "./ThemeToggle";
import SummaryCards from "./SummaryCards";
import IncomeExpenseChart from "./IncomeExpenseChart";
import RecentTransactions from "./RecentTransactions";
import useDashboardData, { useFetchData, computeRange } from "../hooks/apiHook";
import useTheme from "../hooks/useTheme";

export default function Dashboard() {
  const { data, loading, error } = useFetchData();
  const [theme, setTheme] = useTheme();
  const [range, setRange] = useState(() => computeRange("30d"));
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    filteredData,
    totalIncome,
    totalExpense,
    balance,
    chartData,
    recentTransactions,
    availableTags,
  } = useDashboardData(data, loading, range, selectedTags);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              <h1 className="text-xl font-bold tracking-tight text-main">
                Xpensive
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TimeFilter onRangeChange={setRange} />
              <TagFilter
                tags={availableTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            Failed to load data. Is the backend running?
          </div>
        )}

        {loading ? (
          <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-surface-alt"
                />
              ))}
            </div>
            <div className="h-80 rounded-2xl bg-surface-alt" />
            <div className="h-64 rounded-2xl bg-surface-alt" />
          </div>
        ) : (
          <div className="space-y-5">
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              count={filteredData.length}
            />
            <IncomeExpenseChart data={chartData} />
            <RecentTransactions transactions={recentTransactions} />
          </div>
        )}
      </main>
    </div>
  );
}
