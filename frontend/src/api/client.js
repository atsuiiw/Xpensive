import axios from 'axios';
import { API_URI } from '../config/api';

// API_URI is resolved from the API_URI env var (see scripts/gen-api-config.mjs
// and .env / .env.production). A relative '/api' hits the backend router
// (mounted at /api in backend/src/index.js) via the CRA dev proxy ("proxy" in
// package.json), which forwards to http://localhost:5200. Set API_URI to a full
// URL to target a deployed backend directly.
const api = axios.create({
  baseURL: API_URI || '/api',
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
