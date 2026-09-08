# AGENTS.md

Two-app repo: `backend/` (Express 5 + Postgres, ESM) and `frontend/` (Create React App 5 + React 19 + Tailwind 3 + recharts + axios). Each is its own npm project with its own `package.json`/`node_modules`. **Run all commands from the subdir, never the root** — the root `package.json` is stale/misleading (its `tailwind` dep isn't the real Tailwind; root `npm test` just errors).

## Running the app (two terminals)

```sh
# backend — http://localhost:5200
cd backend && npm run dev        # nodemon (also: npm start)

# frontend — http://localhost:3000
cd frontend && npm start
```

- Frontend calls the backend at `http://localhost:5200` via `REACT_APP_API` in `frontend/.env` (axios baseURL in `frontend/src/hooks/apiHook.js`). There is **no dev proxy**; backend must be running or the dashboard shows a "Failed to load data" banner.
- `backend/.env` and `frontend/.env` are gitignored and machine-specific (local Postgres creds, ports). Don't commit them or assume their values.

## Backend (`backend/`)

- ESM — `"type": "module"`; use `import`, not `require`.
- Reads `DB_*` from `backend/.env` (defaults: host `localhost`, db `Tutorial`); connects with a `pg` Client in `src/db/db.js`.
- Queries the `post` table. All routes are **GET-only**, mounted under `/api` in `src/router/router.js`:
  - `/api/getAllData`
  - `/api/getDataFromRange?startDate&endDate` (dates as `YYYY-MM-DD`)
  - `/api/getTag?tag=` (array-valued via `ANY($1)`)
- `post` row shape: `id, name, description, expense, income, tag, date` — exactly one of `expense`/`income` is non-zero.

## Frontend (`frontend/`)

- No lint/typecheck scripts. `npm run build` validates compilation; `npm test` is the interactive CRA Jest watch runner.
- Components in `src/components/` are thin renderers. All date/filter/aggregation logic lives in `src/hooks/apiHook.js`: `useFetchData` (fetch + state), `useDashboardData` (memoized filtering/summing/chart grouping), `computeRange` + `PERIODS` (time ranges). Add new finance/date logic there, not in components.

## Conventions

- Tailwind theme tokens (`income` #059669, `expense` #dc2626, `accent` #4f46e5, `surface`, `surface-alt`, Inter, `tabular-nums` for numbers) are in `frontend/tailwind.config.js`; reuse them instead of arbitrary values.
- Amounts formatted via `Intl.NumberFormat` (en-US, USD).
