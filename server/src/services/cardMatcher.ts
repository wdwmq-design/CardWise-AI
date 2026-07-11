import { CreditCard, CardSavings } from '../types/index.js';

export const PURCHASE_CATEGORIES = [
  { id: 'online', name: 'Online Shopping', keywords: ['amazon', 'flipkart', 'myntra', 'online', 'website', 'app'] },
  { id: 'dining', name: 'Dining', keywords: ['restaurant', 'food', 'dining', 'zomato', 'swiggy', 'cafe', 'eat'] },
  { id: 'grocery', name: 'Grocery', keywords: ['grocery', 'bigbasket', 'blinkit', 'zepto', 'supermarket', 'vegetables'] },
  { id: 'fuel', name: 'Fuel', keywords: ['fuel', 'petrol', 'diesel', 'gas', 'pump'] },
  { id: 'travel', name: 'Travel', keywords: ['flight', 'hotel', 'travel', 'booking', 'makemytrip', 'cleartrip', 'train'] },
  { id: 'entertainment', name: 'Entertainment', keywords: ['movie', 'netflix', 'spotify', 'entertainment', 'gaming', 'concert'] },
  { id: 'electronics', name: 'Electronics', keywords: ['phone', 'laptop', 'iphone', 'samsung', 'macbook', 'electronics', 'gadget', 'tv'] },
  { id: 'utilities', name: 'Utilities', keywords: ['electricity', 'water', 'internet', 'broadband', 'recharge', 'bill', 'utility'] },
  { id: 'fashion', name: 'Fashion', keywords: ['clothes', 'fashion', 'shoes', 'wear', 'dress', 'shirt', 'jeans'] },
];

export function detectCategory(query: string): string {
  const lower = query.toLowerCase();
  for (const cat of PURCHASE_CATEGORIES) {
    if (cat.keywords.some(kw => lower.includes(kw))) {
      return cat.id;
    }
  }
  return 'general';
}

export function extractAmount(query: string): number {
  const patterns = [
    /₹\s*([\d,]+(?:\.\d+)?)\s*(?:k|K)/,
    /₹\s*([\d,]+(?:\.\d+)?)/,
    /[Rr][Ss]\.?\s*([\d,]+(?:\.\d+)?)\s*(?:k|K)/,
    /[Rr][Ss]\.?\s*([\d,]+(?:\.\d+)?)/,
    /([\d,]+(?:\.\d+)?)\s*(?:k|K)/,
    /(?:worth|for|of|about|around|approximately|~)\s*₹?\s*([\d,]+(?:\.\d+)?)/i,
    /([\d]{4,}(?:,\d{3})*(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      let amount = parseFloat(match[1].replace(/,/g, ''));
      if (query.toLowerCase().includes('k') && amount < 1000) {
        amount *= 1000;
      }
      return amount;
    }
  }
  return 0;
}

export function detectMerchant(query: string): string {
  const lower = query.toLowerCase();
  const merchants = [
    'amazon', 'flipkart', 'myntra', 'swiggy', 'zomato', 'uber', 'ola',
    'makemytrip', 'cleartrip', 'bigbasket', 'blinkit', 'zepto',
    'netflix', 'spotify', 'google', 'apple'
  ];
  for (const m of merchants) {
    if (lower.includes(m)) return m;
  }
  return '';
}

export function calculateCardSavings(
  amount: number,
  category: string,
  merchant: string,
  card: CreditCard
): CardSavings {
  let cashbackRate = card.cashbackRate.default;
  let appliedBonus: string | null = null;

  if (merchant && card.cashbackRate[merchant] !== undefined) {
    cashbackRate = card.cashbackRate[merchant]!;
    appliedBonus = `${merchant} bonus rate`;
  } else if (category === 'online' && card.cashbackRate.online) {
    cashbackRate = card.cashbackRate.online;
    appliedBonus = 'Online shopping bonus';
  } else if (category === 'dining' && card.cashbackRate.dining) {
    cashbackRate = card.cashbackRate.dining;
    appliedBonus = 'Dining bonus';
  } else if (category === 'grocery' && card.cashbackRate.grocery) {
    cashbackRate = card.cashbackRate.grocery;
    appliedBonus = 'Grocery bonus';
  } else if (category === 'fuel' && card.cashbackRate.fuel) {
    cashbackRate = card.cashbackRate.fuel;
    appliedBonus = 'Fuel bonus';
  } else if (category === 'travel' && card.cashbackRate.travel) {
    cashbackRate = card.cashbackRate.travel;
    appliedBonus = 'Travel bonus';
  } else if (category === 'entertainment' && card.cashbackRate.entertainment) {
    cashbackRate = card.cashbackRate.entertainment;
    appliedBonus = 'Entertainment bonus';
  }

  let cashback = (amount * cashbackRate) / 100;

  let cappedAt: number | null = null;
  if (card.maxCashbackPerMonth && cashback > card.maxCashbackPerMonth) {
    cappedAt = card.maxCashbackPerMonth;
    cashback = card.maxCashbackPerMonth;
  }

  const rewardMultiplier = card.rewardMultiplier[category] || card.rewardMultiplier.default;
  const rewardPoints = Math.floor((amount / 100) * rewardMultiplier);
  const rewardValue = rewardPoints * card.rewardPointValue;
  const totalBenefit = cashback + rewardValue;

  return {
    cardId: card.id,
    card,
    cashback: Math.round(cashback * 100) / 100,
    rewardPoints,
    rewardValue: Math.round(rewardValue * 100) / 100,
    totalBenefit: Math.round(totalBenefit * 100) / 100,
    appliedBonus,
    cappedAt,
  };
}

export function analyzePurchase(
  query: string,
  userCards: CreditCard[]
) {
  const amount = extractAmount(query);
  const category = detectCategory(query);
  const merchant = detectMerchant(query);

  const savings = userCards
    .map(card => calculateCardSavings(amount, category, merchant, card))
    .sort((a, b) => b.totalBenefit - a.totalBenefit);

  return { savings, amount, category, merchant };
}
