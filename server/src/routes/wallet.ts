import { Router, Request, Response, RequestHandler } from 'express';
import cardsJson from '../data/cards.json' with { type: 'json' };

const router = Router();
const cards = cardsJson as any[];

const getCardsHandler: RequestHandler = (req, res) => {
  res.json(cards);
};

const getCardByIdHandler: RequestHandler = (req, res) => {
  const card = cards.find(c => c.id === req.params.id);
  if (!card) {
    res.status(404).json({ error: 'Card not found' });
    return;
  }
  res.json(card);
};

router.get('/', getCardsHandler);
router.get('/:id', getCardByIdHandler);

export default router;
