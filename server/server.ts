import 'dotenv/config'
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { clerkClient, requireAuth, getAuth } from "@clerk/express"

const prisma = new PrismaClient();
const app: any = express();
app.use(cors());
app.use(express.json());

type CacheEntry = { expiresAt: number; data: any };
const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<any>>();

function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

//helper for normalizing backend response

type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { code: number; message: string }; retryAfter?: string | null };

function sendOk<T>(res: any, data: T, cacheSeconds?: number) {
  if (cacheSeconds) res.set("Cache-Control", `public, max-age=${cacheSeconds}`);
  const body: ApiOk<T> = { ok: true, data };
  return res.json(body);
}

function sendErr(res: any, code: number, message: string, retryAfter?: string | null) {
  if (retryAfter) res.set("Retry-After", retryAfter);
  const body: ApiErr = { ok: false, error: { code, message }, retryAfter: retryAfter ?? null };
  return res.status(code).json(body);
}

app.post('/api/portfolio', requireAuth(), async (req, res) => {
  const { coin, purchaseAmount, purchaseDate, history } = req.body;
  const {userId} = req.auth();
  console.log("req.auth:", req.auth);
  try {
    const saved = await prisma.portfolio.create({
      data: {
        userId,
        coinId: coin.id,
        // coinName: coin.name,
        coinData: coin,
        purchaseAmount: parseFloat(purchaseAmount),
        purchaseDate: new Date(purchaseDate),
        historyData: history,
      },
    });

    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save coin.' });
  }
});

app.get('/api/portfolio', requireAuth(), async (req, res) => {
  const {userId} = req.auth()
  try {
    const data = await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Optional: latest first
    });
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data.' });
  }
});

app.delete('/api/portfolio/:id', requireAuth(),async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.portfolio.delete({
      where: { id },
    });

    res.json({ message: 'Portfolio item deleted.' });
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

app.put('/api/portfolio/:id', requireAuth(),async (req, res) => {
  const { id } = req.params;
  const { coinData, purchaseAmount, purchaseDate, historyData } = req.body;

  try {
    const updatedItem = await prisma.portfolio.update({
      where: { id },
      data: {
        coinData,
        purchaseAmount: parseFloat(purchaseAmount),
        purchaseDate: new Date(purchaseDate),
        // coinName: coinData.name,
        // coinId: coinData.id,
        historyData,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Failed to update portfolio item:', error);
    res.status(500).json({ error: 'Failed to update portfolio item.' });
  }
});

app.put('/api/portfolio/coin-data/:coinId', async (req, res) => {
  const { coinId } = req.params;
  const { coinData } = req.body;

  try {
    const updated = await prisma.portfolio.updateMany({
      where: { coinId },
      data: {
        //coinName: coinData.name,
        coinData,
      },
    });

    res.json({ message: `Updated ${updated.count} entries for ${coinId}` });
  } catch (error) {
    console.error('Failed to bulk update coin data:', error);
    res.status(500).json({ error: 'Failed to update coin data.' });
  }
});

app.get("/api/coingecko/market-chart", async (req, res) => {
  try {
    const { coinId, currency, days } = req.query;

    if (!coinId || !currency || !days) {
      return res.status(400).json({ error: "Missing params" });
    }

    const isShortRange = days === "2";

    const url = isShortRange
      ? `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
      : `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&interval=daily`;

    const response = await fetch(url);

    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      return sendErr(res, 429, "Rate limited by CoinGecko", retryAfter);
    }

    if (!response.ok) {
      return sendErr(res, response.status, `CoinGecko error ${response.status}`);
    }

    const data = await response.json();
    return sendOk(res, data, 60); // charts can cache longer (e.g. 60s)
  } catch {
    return sendErr(res, 500, "CoinGecko proxy failed");
  }
});

// app.get("/api/coingecko/markets", async (req, res) => {
//   try {
//     const {
//       vs_currency = "usd",
//       order = "market_cap_desc",
//       per_page = "25",
//       page = "1",
//       sparkline = "true",
//       price_change_percentage = "1h,24h,7d",
//     } = req.query;

//     const url =
//       "https://api.coingecko.com/api/v3/coins/markets" +
//       `?vs_currency=${encodeURIComponent(String(vs_currency))}` +
//       `&order=${encodeURIComponent(String(order))}` +
//       `&per_page=${encodeURIComponent(String(per_page))}` +
//       `&page=${encodeURIComponent(String(page))}` +
//       `&sparkline=${encodeURIComponent(String(sparkline))}` +
//       `&price_change_percentage=${encodeURIComponent(
//         String(price_change_percentage)
//       )}`;

//     const resp = await fetch(url, { headers: { accept: "application/json" } });

//     if (!resp.ok) {
//       const text = await resp.text();
//       return res.status(resp.status).send(text);
//     }

//     const data = await resp.json();
//     res.json(data);
//   } catch (e) {
//     res.status(500).json({ error: "CoinGecko markets proxy failed" });
//   }
// });

app.get("/api/coingecko/markets", async (req, res) => {
  try {
    const {
      vs_currency = "usd",
      order = "market_cap_desc",
      per_page = "25",
      page = "1",
      sparkline = "true",
      price_change_percentage = "1h,24h,7d",
    } = req.query;

    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      `?vs_currency=${encodeURIComponent(String(vs_currency))}` +
      `&order=${encodeURIComponent(String(order))}` +
      `&per_page=${encodeURIComponent(String(per_page))}` +
      `&page=${encodeURIComponent(String(page))}` +
      `&sparkline=${encodeURIComponent(String(sparkline))}` +
      `&price_change_percentage=${encodeURIComponent(String(price_change_percentage))}`;

    const cacheKey = `markets:${url}`;

    // ✅ 1) Serve from cache
    const cached = getCache(cacheKey);
    if (cached) {
      res.set("Cache-Control", "public, max-age=30");
      return res.json(cached);
    }

    // ✅ 2) De-dupe concurrent identical requests
    if (inFlight.has(cacheKey)) {
      const data = await inFlight.get(cacheKey)!;
      res.set("Cache-Control", "public, max-age=30");
      return res.json(data);
    }

    // ✅ 3) Fetch upstream (store promise first to dedupe)
    const p = (async () => {
      const resp = await fetch(url, { headers: { accept: "application/json" } });

      // Pass through rate limit status + Retry-After if present
      if (resp.status === 429) {
        const retryAfter = resp.headers.get("retry-after");
        const text = await resp.text();
        const err: any = new Error("Rate limited by CoinGecko");
        err.status = 429;
        err.retryAfter = retryAfter;
        err.body = text;
        throw err;
      }

      if (!resp.ok) {
        const text = await resp.text();
        const err: any = new Error(`CoinGecko error ${resp.status}`);
        err.status = resp.status;
        err.body = text;
        throw err;
      }

      return await resp.json();
    })();

    inFlight.set(cacheKey, p);

    try {
      const data = await p;

      // ✅ Cache for 30 seconds (tune: 15–60s)
      setCache(cacheKey, data, 30_000);

      res.set("Cache-Control", "public, max-age=30");
      return res.json(data);
    } finally {
      inFlight.delete(cacheKey);
    }
  } catch (e: any) {
    if (e?.status === 429) {
      if (e.retryAfter) res.set("Retry-After", String(e.retryAfter));
      return res.status(429).send(e.body ?? "Too Many Requests");
    }
    return res.status(e?.status ?? 500).send(e?.body ?? "Proxy failed");
  }
});






app.listen(3001, () => console.log(`Server running on http://localhost:3001`)); 