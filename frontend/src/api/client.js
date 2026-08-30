import axios from 'axios';

// Empty baseURL = relative requests, which the CRA dev proxy
// ("proxy" in package.json) forwards to http://localhost:5200.
// Set REACT_APP_API_URL to target a deployed backend directly.
const api = axios.create({
  baseURL: process.env.APP_API_URL || '',
  timeout: 15000,
});

const round2 = (n) => Math.round(n * 100) / 100;

// post table row -> dashboard transaction shape.
//   { id, name, description, expense, income, tag, date }
//   -> { id, type: 'expense'|'income', amount, category, note, date, tag }
//
// Type rule: exactly one of expense/income is expected to be non-zero per
// row. Rows where both are 0 are skipped. If both were ever positive, the
// larger amount wins and decides the type.
export function mapPostRow(row) {
  const expense = Number(row.expense || 0);
  const income = Number(row.income || 0);

  let type;
  let amount;
  if (expense === 0 && income === 0) return null;
  if (expense >= income) {
    type = 'expense';
    amount = expense;
  } else {
    type = 'income';
    amount = income;
  }

  const date = new Date(row.date);
  if (Number.isNaN(date.getTime())) return null;

  return {
    id: row.id,
    type,
    amount: round2(amount),
    category: row.name || 'Uncategorized',
    note: row.description || '',
    date: date.toISOString(),
    tag: row.tag ?? null,
  };
}

export async function fetchTransactions(config) {
  const { data } = await api.get('/getAllData', config);
  const rows = Array.isArray(data) ? data : [];
  return rows
    .map(mapPostRow)
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
