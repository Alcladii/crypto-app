import 'dotenv/config'
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { clerkClient, requireAuth, getAuth } from "@clerk/express"

const prisma = new PrismaClient();
const app: any = express();
app.use(cors());
app.use(express.json());

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




app.listen(3001, () => console.log(`Server running on http://localhost:3001`)); 