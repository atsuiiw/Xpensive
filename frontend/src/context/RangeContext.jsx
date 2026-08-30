import { createContext, useContext, useMemo, useState } from 'react';
import { RANGES, getRange } from '../utils/dateRange';

const RangeContext = createContext(null);

export function RangeProvider({ children }) {
  const [rangeKey, setRangeKey] = useState(RANGES.LAST_7_DAYS);
  const [custom, setCustom] = useState({ value: 14, unit: 'days' });

  const range = useMemo(() => getRange(rangeKey, custom), [rangeKey, custom]);

  const value = useMemo(
    () => ({ rangeKey, setRangeKey, custom, setCustom, range }),
    [rangeKey, custom, range]
  );

  return <RangeContext.Provider value={value}>{children}</RangeContext.Provider>;
}

export function useRange() {
  const ctx = useContext(RangeContext);
  if (!ctx) throw new Error('useRange must be used inside <RangeProvider>');
  return ctx;
}
