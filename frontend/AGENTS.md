# AGENTS.md

Create React App (react-scripts 5) + React 19 + Tailwind 3 + recharts. No lint/typecheck scripts beyond CRA's built-in (default `react-app` eslint config); `npm run build` validates compilation, `npm test` runs the interactive Jest watch runner.

## Running the app

- `npm start` -> CRA dev server on `:3000`.
- The CRA dev proxy (`"proxy": "http://localhost:5200"` in `package.json`) forwards API requests to the backend, which lives **outside this repo** at `../backend` (Express 5 + `pg`, `npm run dev`, port 5200; needs Postgres via its uncommitted `.env`). Without it the dashboard shows a fetch error. Set `REACT_APP_API_URL` to override the proxy target. The backend is in the parent Xpensive git repo, not this one.

## Architecture / data flow

- Transactions come from `GET /getAllData` (backend `post` table), fetched in `src/context/TransactionsContext.jsx` via `src/api/client.js`.
- `src/data/Data.js` is dead placeholder/mock data — **not imported anywhere**. Do not rely on it or `CATEGORIES` from it.
- `mapPostRow` in `src/api/client.js:20` is the canonical DB-row -> UI shape mapping. Type rule: exactly one of `expense`/`income` is non-zero per row; if both are positive the larger amount wins and decides the type. Keep it in sync with the backend `post` schema (`id, name, description, expense, income, tag, date`).

## Conventions

- `tailwind.config.js` defines app-specific theme tokens (Inter font, `glass`/`glow-emerald`/`glow-rose` shadows, `drift`/`fade-up` animations). Reuse these instead of inline arbitrary values.
- Finance/date math lives in pure, React-free utils `src/utils/finance.js` and `src/utils/dateRange.js`; put new aggregation logic there.

    