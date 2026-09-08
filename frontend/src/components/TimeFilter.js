import { useEffect, useRef, useState } from "react";
import { PERIODS, computeRange } from "../hooks/apiHook";

const PERIOD_LABELS = [
  { key: PERIODS.today, label: "Today" },
  { key: PERIODS["7d"], label: "7 Days" },
  { key: PERIODS["14d"], label: "14 Days" },
  { key: PERIODS["30d"], label: "30 Days" },
  { key: PERIODS.month, label: "This Month" },
  { key: PERIODS.custom, label: "Custom" },
];

export default function TimeFilter({ onRangeChange }) {
  const [period, setPeriod] = useState(PERIODS["30d"]);
  const [customValue, setCustomValue] = useState(7);
  const [customUnit, setCustomUnit] = useState("day");

  const onRangeChangeRef = useRef(onRangeChange);
  onRangeChangeRef.current = onRangeChange;

  useEffect(() => {
    onRangeChangeRef.current(computeRange(period, customValue, customUnit));
  }, [period, customValue, customUnit]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-xl bg-control p-1">
        {PERIOD_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              period === key
                ? "bg-card text-main shadow-sm"
                : "text-muted hover:text-main"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {period === PERIODS.custom && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={customValue}
            onChange={(e) => setCustomValue(parseInt(e.target.value) || 0)}
            className="w-20 rounded-lg border border-border-strong bg-card px-3 py-1.5 text-sm text-main focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />
          <select
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            className="rounded-lg border border-border-strong bg-card px-2 py-1.5 text-sm text-main focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="day">Days</option>
            <option value="month">Months</option>
          </select>
        </div>
      )}
    </div>
  );
}
