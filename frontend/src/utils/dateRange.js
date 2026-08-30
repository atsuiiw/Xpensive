// Time-range math shared by every dashboard widget.

export const RANGES = {
  TODAY: 'today',
  LAST_7_DAYS: 'last-7-days',
  LAST_1_MONTH: 'last-1-month',
  LAST_6_MONTHS: 'last-6-months',
  LAST_1_YEAR: 'last-1-year',
  CUSTOM: 'custom',
};

export const RANGE_OPTIONS = [
  { key: RANGES.TODAY, label: 'Today' },
  { key: RANGES.LAST_7_DAYS, label: '7D' },
  { key: RANGES.LAST_1_MONTH, label: '1M' },
  { key: RANGES.LAST_6_MONTHS, label: '6M' },
  { key: RANGES.LAST_1_YEAR, label: '1Y' },
  { key: RANGES.CUSTOM, label: 'Custom' },
];

const DAY_MS = 86_400_000;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date, n) {
  const d = new Date(date);
  const targetDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(targetDay, daysInMonth));
  return d;
}

function startOfWeekMonday(date) {
  const d = startOfDay(date);
  const shift = (d.getDay() + 6) % 7;
  return addDays(d, -shift);
}

// Resolve a range selection to an explicit { start, end } window ending "now".
export function getRange(rangeKey, custom = { value: 14, unit: 'days' }) {
  const now = new Date();
  let start;

  switch (rangeKey) {
    case RANGES.TODAY:
      start = startOfDay(now);
      break;
    case RANGES.LAST_7_DAYS:
      start = addDays(startOfDay(now), -6);
      break;
    case RANGES.LAST_1_MONTH:
      start = addDays(addMonths(startOfDay(now), -1), 1);
      break;
    case RANGES.LAST_6_MONTHS:
      start = addDays(addMonths(startOfDay(now), -6), 1);
      break;
    case RANGES.LAST_1_YEAR:
      start = addDays(addMonths(startOfDay(now), -12), 1);
      break;
    case RANGES.CUSTOM: {
      const value = Math.max(1, Math.floor(Number(custom.value) || 1));
      start =
        custom.unit === 'months'
          ? addDays(addMonths(startOfDay(now), -value), 1)
          : addDays(startOfDay(now), -(value - 1));
      break;
    }
    default:
      start = addDays(startOfDay(now), -6);
  }

  return { key: rangeKey, start, end: now };
}

// The equal-length window immediately before the given one (for trend deltas).
export function getPreviousRange({ start, end }) {
  const durationMs = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - durationMs),
    end: new Date(start.getTime()),
  };
}

// Chart granularity that fits the span.
export function chooseBucket(spanMs) {
  if (spanMs <= 2 * DAY_MS) return 'hour';
  if (spanMs <= 45 * DAY_MS) return 'day';
  if (spanMs <= 240 * DAY_MS) return 'week';
  return 'month';
}

export function describeRange(rangeKey, custom = {}) {
  switch (rangeKey) {
    case RANGES.TODAY:
      return 'Today';
    case RANGES.LAST_7_DAYS:
      return 'the past 7 days';
    case RANGES.LAST_1_MONTH:
      return 'the past month';
    case RANGES.LAST_6_MONTHS:
      return 'the past 6 months';
    case RANGES.LAST_1_YEAR:
      return 'the past year';
    case RANGES.CUSTOM:
      return custom.unit === 'months'
        ? `the past ${custom.value} month${Number(custom.value) === 1 ? '' : 's'}`
        : `the past ${custom.value} day${Number(custom.value) === 1 ? '' : 's'}`;
    default:
      return 'the selected period';
  }
}

export function formatBucketLabel(date, bucket) {
  switch (bucket) {
    case 'hour':
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00', '');
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'short' }) + (date.getMonth() === 0 ? ` ’${String(date.getFullYear()).slice(2)}` : '');
    default:
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export { startOfDay, addDays, addMonths, startOfWeekMonday };
