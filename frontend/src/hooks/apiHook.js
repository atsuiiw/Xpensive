import { useEffect, useMemo, useState } from "react";
import axios from "axios";


export const api = axios.create({
  baseURL: process.env.API_URI,
});

export const PERIODS = {
  today: "today",
  "7d": "7d",
  "14d": "14d",
  "30d": "30d",
  month: "month",
  custom: "custom",
};

/* ---------- helpers ---------- */

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toYMD(dateStr) {
  return String(dateStr).slice(0, 10);
}

function parseDate(str) {
  const ymd = toYMD(str);
  return new Date(`${ymd}T00:00:00`);
}

export function computeRange(period, customValue, customUnit, endDate) {
  const end = endDate || new Date();
  let start = new Date(end);

  switch (period) {
    case PERIODS.today:
      break;
    case PERIODS["7d"]:
      start.setDate(end.getDate() - 6);
      break;
    case PERIODS["14d"]:
      start.setDate(end.getDate() - 13);
      break;
    case PERIODS["30d"]:
      start.setDate(end.getDate() - 29);
      break;
    case PERIODS.month:
      start.setMonth(end.getMonth(), 1);
      break;
    case PERIODS.custom: {
      const value = customValue > 0 ? customValue : 1;
      if (customUnit === "month") {
        start.setMonth(end.getMonth() - value, 1);
      } else {
        start.setDate(end.getDate() - (value - 1));
      }
      break;
    }
    default:
      break;
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

/* ---------- data fetching ---------- */

export async function getAllData() {
  const { data } = await api.get("/api/getAllData");
  return data;
}

export function useFetchData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get("/api/getAllData")
      .then((res) => {
        if (active) {
          setData(
            res.data.map((row) => ({ ...row, date: toYMD(row.date) }))
          );
          setError(null);
          console.log(res.data);
        }
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

/* ---------- derived dashboard data ---------- */

export default function useDashboardData(data, loading, range, selectedTags) {
  return useMemo(() => {
    if (!data || loading || !range) {
      return {
        filteredData: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        chartData: [],
        recentTransactions: [],
        availableTags: [],
      };
    }

    const { startDate, endDate } = range;
    const s = parseDate(startDate);
    const e = parseDate(endDate);

    let rows = data.filter((row) => {
      const d = parseDate(row.date);
      return d >= s && d <= e;
    });

    if (selectedTags && selectedTags.length > 0) {
      rows = rows.filter((row) => selectedTags.includes(row.tag));
    }

    let totalIncome = 0;
    let totalExpense = 0;
    rows.forEach((row) => {
      totalIncome += Number(row.income) || 0;
      totalExpense += Number(row.expense) || 0;
    });

    const grouped = {};
    rows.forEach((row) => {
      if (!grouped[row.date]) {
        grouped[row.date] = { date: row.date, income: 0, expense: 0 };
      }
      grouped[row.date].income += Number(row.income) || 0;
      grouped[row.date].expense += Number(row.expense) || 0;
    });

    const chartData = [];
    const cursor = parseDate(range.startDate);
    const end = parseDate(range.endDate);
    while (cursor <= end) {
      const key = formatDate(cursor);
      const existing = grouped[key];
      chartData.push(
        existing
          ? { date: key, income: existing.income, expense: existing.expense }
          : { date: key, income: 0, expense: 0 }
      );
      cursor.setDate(cursor.getDate() + 1);
    }

    const recentTransactions = [...rows].sort(
      (a, b) => parseDate(b.date) - parseDate(a.date)
    );

    const availableTags = [...new Set((data || []).map((r) => r.tag))].sort();

    return {
      filteredData: rows,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      chartData,
      recentTransactions,
      availableTags,
    };
  }, [data, loading, range, selectedTags]);
}
