import { Router, Request, Response, RequestHandler } from 'express';
import { analyzePurchase } from '../services/cardMatcher.js';
import { getRecommendation } from '../services/ai.js';
import cardsJson from '../data/cards.json' with { type: 'json' };

const router = Router();
const cards = cardsJson as any[];

const recommendHandler: RequestHandler = async (req, res) => {
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
    
    if (analysis.savings.length === 0) {
      res.status(500).json({ error: 'Error calculating credit card benefits' });
      return;
    }

    const primaryRec = analysis.savings[0];
    const alts = analysis.savings.slice(1, 3); // top 2 alternatives

    const result = await getRecommendation(
      query,
      analysis.amount,
      analysis.category,
      analysis.merchant,
      primaryRec,
      alts
    );

    res.json({
      bestCard: result.bestCard,
      savings: {
        cashback: primaryRec.cashback,
        rewardPoints: primaryRec.rewardPoints,
        rewardValue: primaryRec.rewardValue,
        totalBenefit: primaryRec.totalBenefit
      },
      alternatives: result.alternatives,
      query: {
        original: query,
        parsed: {
          amount: analysis.amount,
          category: analysis.category,
          merchant: analysis.merchant
        }
      }
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

router.post('/recommend', recommendHandler);

export default router;
