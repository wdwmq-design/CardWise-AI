import { Router, Request, Response, RequestHandler } from 'express';
import { chatResponse } from '../services/ai.js';
import cardsJson from '../data/cards.json' with { type: 'json' };

const router = Router();
const cards = cardsJson as any[];

const chatHandler: RequestHandler = async (req, res) => {
  try {
    const { messages, walletCardIds } = req.body;

    if (!messages || !Array.isArray(messages) || !walletCardIds || !Array.isArray(walletCardIds)) {
      res.status(400).json({ error: 'Missing parameters. Provide messages and walletCardIds arrays.' });
      return;
    }

    const userCards = cards.filter(c => walletCardIds.includes(c.id));

    const reply = await chatResponse(messages, userCards);

    res.json({ reply });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

router.post('/', chatHandler);

export default router;
