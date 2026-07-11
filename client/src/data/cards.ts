// ============================================
// CardWise AI — Credit Card Benefits Dataset
// 10 Major Indian Credit Cards with Accurate Data
// ============================================

import { CreditCard } from '../types';

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia',
    bank: 'HDFC',
    network: 'Visa',
    annualFee: 1000,
    feeWaiverCriteria: 'Spend ₹1,00,000 in a year',
    cashbackRate: { default: 1, online: 2.5, amazon: 2.5, flipkart: 2.5, smartbuy: 5 },
    rewardMultiplier: { default: 2, online: 5 },
    rewardPointValue: 0.3,
    categoryBonuses: [
      { category: 'Online Shopping', rate: 2.5, cap: 750, description: '2.5% cashback on online spends, capped at ₹750/month' },
      { category: 'SmartBuy', rate: 5, cap: 1500, description: '5% cashback on SmartBuy portal' },
    ],
    loungeAccess: { domestic: 8, international: 0 },
    travelBenefits: ['8 complimentary domestic lounge visits/year'],
    fuelSurcharge: true,
    maxCashbackPerMonth: 750,
    highlights: ['2.5% cashback on all online spends', '5% via SmartBuy portal', '8 free lounge visits/year', '1% cashback on offline spends'],
    color: '#1e3a5f',
    gradient: ['#1e3a5f', '#2563eb'],
  },
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Regalia Gold',
    bank: 'HDFC',
    network: 'Visa',
    annualFee: 2500,
    feeWaiverCriteria: 'Spend ₹3,00,000 in a year',
    cashbackRate: { default: 0.5 },
    rewardMultiplier: { default: 4, travel: 8, dining: 4 },
    rewardPointValue: 0.5,
    categoryBonuses: [
      { category: 'Travel', rate: 4, cap: 5000, description: '4 reward points per ₹150 on all spends' },
      { category: 'SmartBuy', rate: 8, cap: 7000, description: '10x rewards on SmartBuy + additional milestone benefits' },
    ],
    loungeAccess: { domestic: 12, international: 6 },
    travelBenefits: ['12 domestic + 6 international lounge visits', 'Travel insurance up to ₹50 lakhs', 'Golf privileges'],
    fuelSurcharge: true,
    maxCashbackPerMonth: null,
    highlights: ['4 reward points per ₹150 spent', 'Travel insurance up to ₹50L', '12 domestic + 6 intl lounge visits', 'Golf privileges at select courses'],
    color: '#7c3aed',
    gradient: ['#7c3aed', '#a855f7'],
  },
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback',
    bank: 'SBI',
    network: 'Visa',
    annualFee: 999,
    feeWaiverCriteria: 'Spend ₹2,00,000 in a year',
    cashbackRate: { default: 1, online: 5 },
    rewardMultiplier: { default: 1 },
    rewardPointValue: 0.25,
    categoryBonuses: [
      { category: 'Online Shopping', rate: 5, cap: 5000, description: '5% cashback on all online purchases, capped at ₹5,000/quarter' },
    ],
    loungeAccess: { domestic: 4, international: 0 },
    travelBenefits: ['4 complimentary domestic lounge visits/year'],
    fuelSurcharge: true,
    maxCashbackPerMonth: 5000,
    highlights: ['5% cashback on ALL online spends', 'No category restriction for online', '₹5,000 cashback cap per quarter', '1% cashback on offline spends'],
    color: '#1d4ed8',
    gradient: ['#1d4ed8', '#3b82f6'],
  },
  {
    id: 'sbi-simplyclick',
    name: 'SBI SimplyCLICK',
    bank: 'SBI',
    network: 'Visa',
    annualFee: 499,
    feeWaiverCriteria: 'Spend ₹1,00,000 in a year',
    cashbackRate: { default: 0.25 },
    rewardMultiplier: { default: 1, online: 5, amazon: 10, cleartrip: 10 },
    rewardPointValue: 0.25,
    categoryBonuses: [
      { category: 'Amazon', rate: 10, cap: 2500, description: '10x reward points on Amazon' },
      { category: 'Cleartrip', rate: 10, cap: 2500, description: '10x reward points on Cleartrip' },
      { category: 'Online Shopping', rate: 5, cap: 2000, description: '5x reward points on all other online spends' },
    ],
    loungeAccess: { domestic: 4, international: 0 },
    travelBenefits: ['4 complimentary domestic lounge visits/year'],
    fuelSurcharge: true,
    maxCashbackPerMonth: 2500,
    highlights: ['10x rewards on Amazon & Cleartrip', '5x rewards on all online spends', 'Welcome gift of ₹500 Amazon voucher', 'Annual fee waiver on ₹1L spend'],
    color: '#0369a1',
    gradient: ['#0369a1', '#0ea5e9'],
  },
  {
    id: 'icici-amazon-pay',
    name: 'ICICI Amazon Pay',
    bank: 'ICICI',
    network: 'Visa',
    annualFee: 0,
    feeWaiverCriteria: 'Lifetime free — no annual fee',
    cashbackRate: { default: 1, amazon: 5, digital: 2, online: 1 },
    rewardMultiplier: { default: 1 },
    rewardPointValue: 1,
    categoryBonuses: [
      { category: 'Amazon', rate: 5, cap: 0, description: '5% cashback on Amazon (with Prime), 3% without Prime' },
      { category: 'Digital Payments', rate: 2, cap: 0, description: '2% cashback on digital payments (bill pay, recharges)' },
    ],
    loungeAccess: { domestic: 0, international: 0 },
    travelBenefits: [],
    fuelSurcharge: true,
    maxCashbackPerMonth: null,
    highlights: ['Lifetime free — ₹0 annual fee', '5% cashback on Amazon (Prime members)', '2% on bill payments & recharges', 'No reward point conversion hassle'],
    color: '#f59e0b',
    gradient: ['#d97706', '#f59e0b'],
  },
  {
    id: 'icici-sapphiro',
    name: 'ICICI Sapphiro',
    bank: 'ICICI',
    network: 'Visa',
    annualFee: 3500,
    feeWaiverCriteria: 'Spend ₹4,00,000 in a year',
    cashbackRate: { default: 0.5 },
    rewardMultiplier: { default: 2, dining: 4, travel: 4 },
    rewardPointValue: 0.5,
    categoryBonuses: [
      { category: 'Dining', rate: 4, cap: 3000, description: '4 reward points per ₹100 on dining' },
      { category: 'Travel', rate: 4, cap: 3000, description: '4 reward points per ₹100 on travel' },
    ],
    loungeAccess: { domestic: 12, international: 4 },
    travelBenefits: ['12 domestic + 4 international lounge visits', 'Travel insurance', 'Concierge services'],
    fuelSurcharge: true,
    maxCashbackPerMonth: null,
    highlights: ['Premium card with concierge service', '2 reward points per ₹100 on all spends', '12 domestic + 4 intl lounge visits', 'Comprehensive travel insurance'],
    color: '#0f766e',
    gradient: ['#0f766e', '#14b8a6'],
  },
  {
    id: 'axis-ace',
    name: 'Axis ACE',
    bank: 'Axis',
    network: 'Visa',
    annualFee: 499,
    feeWaiverCriteria: 'Spend ₹2,00,000 in a year',
    cashbackRate: { default: 2, googlepay: 5, swiggy: 4, zomato: 4, ola: 4, uber: 4 },
    rewardMultiplier: { default: 2 },
    rewardPointValue: 0.5,
    categoryBonuses: [
      { category: 'Google Pay', rate: 5, cap: 500, description: '5% cashback on Google Pay transactions' },
      { category: 'Swiggy/Zomato', rate: 4, cap: 500, description: '4% cashback on Swiggy & Zomato' },
      { category: 'Ola/Uber', rate: 4, cap: 500, description: '4% cashback on Ola & Uber rides' },
    ],
    loungeAccess: { domestic: 4, international: 0 },
    travelBenefits: ['4 complimentary domestic lounge visits/year'],
    fuelSurcharge: true,
    maxCashbackPerMonth: 500,
    highlights: ['5% cashback on Google Pay', '4% on Swiggy, Zomato, Ola, Uber', '2% on everything else', 'Great everyday card'],
    color: '#be123c',
    gradient: ['#9f1239', '#e11d48'],
  },
  {
    id: 'axis-flipkart',
    name: 'Axis Flipkart',
    bank: 'Axis',
    network: 'Visa',
    annualFee: 500,
    feeWaiverCriteria: 'Spend ₹2,00,000 in a year',
    cashbackRate: { default: 1.5, flipkart: 5, myntra: 5, swiggy: 4, uber: 4 },
    rewardMultiplier: { default: 1 },
    rewardPointValue: 1,
    categoryBonuses: [
      { category: 'Flipkart/Myntra', rate: 5, cap: 0, description: '5% unlimited cashback on Flipkart & Myntra' },
      { category: 'Swiggy/Uber', rate: 4, cap: 500, description: '4% cashback on Swiggy & Uber' },
    ],
    loungeAccess: { domestic: 4, international: 0 },
    travelBenefits: [],
    fuelSurcharge: true,
    maxCashbackPerMonth: null,
    highlights: ['5% unlimited cashback on Flipkart & Myntra', '4% on Swiggy & Uber', '1.5% on all other spends', 'Welcome benefits worth ₹500'],
    color: '#eab308',
    gradient: ['#ca8a04', '#eab308'],
  },
  {
    id: 'amex-mrcc',
    name: 'Amex MRCC',
    bank: 'American Express',
    network: 'Amex',
    annualFee: 3500,
    feeWaiverCriteria: 'Spend ₹1,50,000 in a year',
    cashbackRate: { default: 0.5 },
    rewardMultiplier: { default: 1, travel: 5, dining: 2 },
    rewardPointValue: 0.5,
    categoryBonuses: [
      { category: 'Travel (Amex Travel)', rate: 5, cap: 0, description: '5x MR points on Amex Travel' },
      { category: 'Dining', rate: 2, cap: 0, description: '2x MR points at restaurants' },
      { category: 'Milestone Bonus', rate: 0, cap: 0, description: '1,000 bonus MR points on spending ₹20,000 in a month' },
    ],
    loungeAccess: { domestic: 8, international: 2 },
    travelBenefits: ['8 domestic + 2 international lounge visits', 'Amex travel portal access', 'Travel insurance'],
    fuelSurcharge: false,
    maxCashbackPerMonth: null,
    highlights: ['5x MR points on Amex Travel bookings', '1,000 bonus points on ₹20K monthly spend', '2x on dining', 'Premium Amex experiences & offers'],
    color: '#1d4ed8',
    gradient: ['#1e40af', '#3b82f6'],
  },
  {
    id: 'hdfc-infinia',
    name: 'HDFC Infinia',
    bank: 'HDFC',
    network: 'Visa',
    annualFee: 12500,
    feeWaiverCriteria: 'Spend ₹10,00,000 in a year (invite only)',
    cashbackRate: { default: 3.3 },
    rewardMultiplier: { default: 5, smartbuy: 10, travel: 5, dining: 5 },
    rewardPointValue: 1,
    categoryBonuses: [
      { category: 'All Spends', rate: 5, cap: 0, description: '5 reward points per ₹150 on all spends (uncapped)' },
      { category: 'SmartBuy 10x', rate: 10, cap: 25000, description: '10x reward points via SmartBuy portal' },
    ],
    loungeAccess: { domestic: -1, international: -1 },
    travelBenefits: ['Unlimited domestic & international lounge access', 'Priority Pass membership', 'Golf privileges worldwide', 'Travel insurance up to ₹2 crores'],
    fuelSurcharge: true,
    maxCashbackPerMonth: null,
    highlights: ['5 reward pts/₹150 — best-in-class earn rate', 'Unlimited lounge access worldwide', 'Travel insurance up to ₹2 crores', 'Invite-only super premium card'],
    color: '#1a1a2e',
    gradient: ['#0c0c1d', '#312e81'],
  },
];

export function getCardById(id: string): CreditCard | undefined {
  return CREDIT_CARDS.find(card => card.id === id);
}

export function getCardsByIds(ids: string[]): CreditCard[] {
  return ids.map(id => CREDIT_CARDS.find(card => card.id === id)).filter(Boolean) as CreditCard[];
}

// ============================================
// Purchase Analysis (deterministic — no AI needed)
// ============================================

import { CardSavings, PURCHASE_CATEGORIES } from '../types';

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
  // Match patterns like: ₹80,000 or 80000 or 80,000 or Rs.80000 or rs 80k
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

  // Check merchant-specific rates first
  if (merchant && card.cashbackRate[merchant] !== undefined) {
    cashbackRate = card.cashbackRate[merchant]!;
    appliedBonus = `${merchant} bonus rate`;
  }
  // Then check category rates
  else if (category === 'online' && card.cashbackRate.online) {
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

  // Apply monthly cap if exists
  let cappedAt: number | null = null;
  if (card.maxCashbackPerMonth && cashback > card.maxCashbackPerMonth) {
    cappedAt = card.maxCashbackPerMonth;
    cashback = card.maxCashbackPerMonth;
  }

  // Calculate reward points
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
): { savings: CardSavings[]; amount: number; category: string; merchant: string } {
  const amount = extractAmount(query);
  const category = detectCategory(query);
  const merchant = detectMerchant(query);

  const savings = userCards
    .map(card => calculateCardSavings(amount, category, merchant, card))
    .sort((a, b) => b.totalBenefit - a.totalBenefit);

  return { savings, amount, category, merchant };
}
