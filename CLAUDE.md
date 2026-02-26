# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite frontend (port 5173) + Express backend (port 3001) concurrently
npm run build      # Production build
npm run lint       # ESLint — zero warnings allowed, unused imports/vars are errors
npm run preview    # Preview production build
```

There is no test suite configured.

## Architecture

**Full-stack crypto portfolio management SPA.**

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express 5 + Prisma + PostgreSQL (proxies CoinGecko API, handles portfolio CRUD)
- **Auth**: Clerk (`@clerk/clerk-react`) — required for portfolio endpoints
- **Styling**: Tailwind CSS (custom `skin-` color tokens via CSS variables) + Styled Components

### State Management

Three layers work together:

1. **`CryptoContext`** (`src/contexts/cryptoContext.tsx`) — global UI state: dark mode, selected currency, chart data, portfolio data, utility functions. Persists key values to localStorage via a custom `useLocalState` hook.

2. **React Query** — server state for coin market data:
   - `useInfiniteCoinsListScroll` — paginated coin list with infinite scroll
   - `useCoinDataQuery` — multi-coin price/volume data for the portfolio/charts

3. **Local `useState`** — form inputs, modals, loading indicators

### Backend API (`server/server.ts`)

All CoinGecko requests are proxied through the backend with in-memory caching (30–60s) and concurrent-request deduplication to avoid 429 rate limits.
∏
**Standardized response envelope:**
```ts
{ ok: true, data: T }
{ ok: false, error: { code: number, message: string }, retryAfter?: string }
```

**CoinGecko proxy routes:**
- `GET /api/coingecko/markets` — paginated coin list (cached 30s)
- `GET /api/coingecko/market-chart` — price/volume history (cached 60s)
- `GET /api/coingecko/getCoinPriceVolume` — bulk coin data

**Portfolio routes** (Clerk JWT required):
- `GET/POST /api/portfolio`
- `PUT/DELETE /api/portfolio/:id`
- `PUT /api/portfolio/coin-data/:coinId`

### Frontend API Layer (`src/api.tsx`)

Abstracts CoinGecko calls. In development, it can serve mock JSON from `src/mocks/` instead of hitting the real API.

### Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | Entry point — wraps app in Clerk, React Query, and CryptoProvider |
| `src/App.tsx` | Router setup and top-level layout (Header) |
| `src/contexts/cryptoContext.tsx` | Global state + utility functions |
| `src/api.tsx` | CoinGecko API adapter (mock-aware) |
| `server/server.ts` | Express backend with proxy + portfolio CRUD |
| `prisma/schema.prisma` | PostgreSQL `Portfolio` model |

### Environment Variables

Required in `.env`:
- `VITE_API_URL` — backend URL for the frontend to call
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk server key
- `DATABASE_URL` — PostgreSQL connection string
