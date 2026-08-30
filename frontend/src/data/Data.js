function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260822);

const between = (min, max) => min + rand() * (max - min);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const EXPENSE_BLUEPRINTS = [
  { category: 'Food & Drinks', min: 4, max: 42, chance: 0.92 },
  { category: 'Transport', min: 2, max: 18, chance: 0.55 },
  { category: 'Shopping', min: 15, max: 220, chance: 0.3 },
  { category: 'Entertainment', min: 8, max: 60, chance: 0.35 },
  { category: 'Health & Fitness', min: 10, max: 90, chance: 0.14 },
  { category: 'Groceries', min: 35, max: 130, chance: 0.3 },
];

const NOTES = {
  'Food & Drinks': ['Morning coffee', 'Lunch', 'Dinner out', 'Boba tea', 'Brunch'],
  Transport: ['Bus fare', 'Rideshare', 'Fuel', 'Parking'],
  Shopping: ['Clothes', 'Electronics', 'Home goods', 'Gift'],
  Entertainment: ['Cinema', 'Streaming service', 'Concert', 'Games'],
  'Health & Fitness': ['Gym membership', 'Pharmacy', 'Dentist', 'Supplements'],
  Groceries: ['Weekly groceries', 'Market run'],
};

function generatePlaceholderData(daysBack) {
  const records = [];
  let id = 1;
  const now = new Date();

  const push = (date, type, category, amount, note) =>
    records.push({
      id: id++,
      type,
      amount: Math.round(amount * 100) / 100,
      category,
      note: note || '',
      date: date.toISOString(),
    });

  for (let d = daysBack; d >= 0; d--) {
    const day = new Date(now);
    day.setDate(day.getDate() - d);
    day.setHours(0, 0, 0, 0);

    EXPENSE_BLUEPRINTS.forEach((bp) => {
      if (rand() < bp.chance) {
        const at = new Date(day);
        at.setHours(7 + Math.floor(rand() * 14), Math.floor(rand() * 60), 0, 0);
        push(at, 'expense', bp.category, between(bp.min, bp.max), pick(NOTES[bp.category]));
      }
    });

    if (day.getDate() === 25) {
      const at = new Date(day);
      at.setHours(9, 30, 0, 0);
      push(at, 'income', 'Salary', between(3800, 4300), 'Monthly salary');
    }

    if (rand() < 0.08) {
      const at = new Date(day);
      at.setHours(12 + Math.floor(rand() * 8), Math.floor(rand() * 60), 0, 0);
      push(at, 'income', 'Freelance', between(120, 850), 'Side project');
    }
  }

  return records.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const [Data] = [
  // Swap this line for your database query result, e.g. fetchedRecords:
  generatePlaceholderData(400),
];

export const CATEGORIES = [...new Set(Data.filter((r) => r.type === 'expense').map((r) => r.category))];
