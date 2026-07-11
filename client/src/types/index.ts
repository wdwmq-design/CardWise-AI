// ============================================
// CardWise AI — Core TypeScript Interfaces
// ============================================

export interface CashbackRate {
  default: number;
  online?: number;
  dining?: number;
  grocery?: number;
  fuel?: number;
  travel?: number;
  entertainment?: number;
  utilities?: number;
  [key: string]: number | undefined;
}

export interface RewardMultiplier {
  default: number;
  [key: string]: number | undefined;
}

export interface CategoryBonus {
  category: string;
  rate: number;
  cap: number;
  description: string;
}

export interface LoungeAccess {
  domestic: number;
  international: number;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  network: 'Visa' | 'Mastercard' | 'Amex' | 'RuPay' | 'Diners';
  annualFee: number;
  feeWaiverCriteria: string;
  cashbackRate: CashbackRate;
  rewardMultiplier: RewardMultiplier;
  rewardPointValue: number;
  categoryBonuses: CategoryBonus[];
  loungeAccess: LoungeAccess;
  travelBenefits: string[];
  fuelSurcharge: boolean;
  maxCashbackPerMonth: number | null;
  highlights: string[];
  color: string;
  gradient: [string, string];
}

export interface CardSavings {
  cardId: string;
  card: CreditCard;
  cashback: number;
  rewardPoints: number;
  rewardValue: number;
  totalBenefit: number;
  appliedBonus: string | null;
  cappedAt: number | null;
}

export interface Recommendation {
  bestCard: {
    cardId: string;
    card: CreditCard;
    reason: string;
  };
  savings: {
    cashback: number;
    rewardPoints: number;
    rewardValue: number;
    totalBenefit: number;
  };
  alternatives: Array<{
    cardId: string;
    card: CreditCard;
    savings: {
      cashback: number;
      rewardPoints: number;
      rewardValue: number;
      totalBenefit: number;
    };
    tradeoff: string;
  }>;
  query: {
    original: string;
    parsed: {
      amount: number;
      category: string;
      merchant: string;
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ComparisonResult {
  query: string;
  amount: number;
  category: string;
  cards: CardSavings[];
  winner: CardSavings;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  walletCardIds: string[];
  createdAt: Date;
}

export interface DashboardStats {
  healthScore: number;
  totalSavings: number;
  cashbackEarned: number;
  rewardPoints: number;
  bestCard: CreditCard | null;
  monthlyTrend: Array<{
    month: string;
    savings: number;
    cashback: number;
    rewards: number;
  }>;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    card: CreditCard;
    savings: number;
    date: string;
  }>;
}

export type ThemeMode = 'dark' | 'light';

export interface PurchaseCategory {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
}

export const PURCHASE_CATEGORIES: PurchaseCategory[] = [
  { id: 'online', name: 'Online Shopping', icon: '🛒', keywords: ['amazon', 'flipkart', 'myntra', 'online', 'website', 'app'] },
  { id: 'dining', name: 'Dining', icon: '🍽️', keywords: ['restaurant', 'food', 'dining', 'zomato', 'swiggy', 'cafe', 'eat'] },
  { id: 'grocery', name: 'Grocery', icon: '🥬', keywords: ['grocery', 'bigbasket', 'blinkit', 'zepto', 'supermarket', 'vegetables'] },
  { id: 'fuel', name: 'Fuel', icon: '⛽', keywords: ['fuel', 'petrol', 'diesel', 'gas', 'pump'] },
  { id: 'travel', name: 'Travel', icon: '✈️', keywords: ['flight', 'hotel', 'travel', 'booking', 'makemytrip', 'cleartrip', 'train'] },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', keywords: ['movie', 'netflix', 'spotify', 'entertainment', 'gaming', 'concert'] },
  { id: 'electronics', name: 'Electronics', icon: '📱', keywords: ['phone', 'laptop', 'iphone', 'samsung', 'macbook', 'electronics', 'gadget', 'tv'] },
  { id: 'utilities', name: 'Utilities', icon: '💡', keywords: ['electricity', 'water', 'internet', 'broadband', 'recharge', 'bill', 'utility'] },
  { id: 'fashion', name: 'Fashion', icon: '👗', keywords: ['clothes', 'fashion', 'shoes', 'wear', 'dress', 'shirt', 'jeans'] },
  { id: 'general', name: 'General', icon: '💳', keywords: [] },
];
