import { Router, Request, Response, RequestHandler } from 'express';
import { analyzePurchase } from '../services/cardMatcher.js';
import cardsJson from '../data/cards.json' with { type: 'json' };
import { CardSavings } from '../types/index.js';

const router = Router();
const cards = cardsJson as any[];

const compareHandler: RequestHandler = async (req, res) => {
  try {
    const { query, walletCardIds } = req.body;

    if (!query || !walletCardIds || !Array.isArray(walletCardIds)) {
      res.status(400).json({ error: 'Missing parameters. Provide query and walletCardIds array.' });
      return;
    }

    const userCards = cards.filter(c => walletCardIds.includes(c.id));

    if (userCards.length === 0) {
      res.status(400).json({ error: 'Your card wallet is empty. Please add cards first.' });
      return;
    }

    const analysis = analyzePurchase(query, userCards);

    res.json({
      query,
      amount: analysis.amount,
      category: analysis.category,
      merchant: analysis.merchant,
      cards: analysis.savings.map((item: CardSavings) => ({
        cardId: item.cardId,
        card: item.card,
        cashback: item.cashback,
        rewardPoints: item.rewardPoints,
        rewardValue: item.rewardValue,
        totalBenefit: item.totalBenefit,
        appliedBonus: item.appliedBonus,
        cappedAt: item.cappedAt
      })),
      winner: analysis.savings[0]
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

router.post('/compare', compareHandler);

export default router;
