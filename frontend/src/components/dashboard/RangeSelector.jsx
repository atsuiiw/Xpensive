import { useState } from 'react';
import { RANGE_OPTIONS, RANGES, describeRange } from '../../utils/dateRange';
import { useRange } from '../../context/RangeContext';
import Panel from '../panel/Panel';

const unitButton = (active) =>
  `rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 ${
    active ? 'bg-accent text-canvas' : 'text-white/60 hover:bg-white/10 hover:text-white'
  }`;

export default function RangeSelector() {
  const { rangeKey, setRangeKey, custom, setCustom } = useRange();
  const [customOpen, setCustomOpen] = useState(false);

  const handleSelect = (key) => {
    if (key === RANGES.CUSTOM && rangeKey === RANGES.CUSTOM) {
      setCustomOpen((open) => !open);
      return;
    }
    setRangeKey(key);
    setCustomOpen(key === RANGES.CUSTOM);
  };

  const setValue = (raw) =>
    setCustom((c) => ({ ...c, value: Math.min(3650, Math.max(1, Math.floor(Number(raw) || 1))) }));
  const setUnit = (unit) => setCustom((c) => ({ ...c, unit }));

  return (
    <div className="relative">
      <Panel className="rounded-full">
        <div className="flex flex-wrap items-center justify-center gap-0.5 p-1">
          {RANGE_OPTIONS.map((opt) => {
            const active = rangeKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelect(opt.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:px-4 ${
                  active
                    ? 'bg-accent text-canvas'
                    : 'text-white/60 hover:bg-white/10 hover:text-white active:bg-white/15'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Panel>

      {rangeKey === RANGES.CUSTOM && customOpen && (
        <Panel className="absolute right-0 top-full z-30 mt-3 w-72 p-4 shadow-popover animate-fade-up">
          <label htmlFor="custom-range-value" className="text-overline block text-white/45">
            Show the past
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="custom-range-value"
              type="number"
              min="1"
              max="3650"
              value={custom.value}
              onChange={(e) => setValue(e.target.value)}
              className="w-24 rounded-xl border border-hairline bg-surface-sunken px-3 py-2 text-center text-sm font-semibold tabular-nums text-white outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            />
            <div className="flex rounded-xl border border-hairline bg-surface-sunken p-0.5">
              <button type="button" className={unitButton(custom.unit === 'days')} onClick={() => setUnit('days')}>
                Days
              </button>
              <button type="button" className={unitButton(custom.unit === 'months')} onClick={() => setUnit('months')}>
                Months
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Filtering for <span className="font-medium text-white/70">{describeRange(RANGES.CUSTOM, custom)}</span>.
          </p>
        </Panel>
      )}
    </div>
  );
}