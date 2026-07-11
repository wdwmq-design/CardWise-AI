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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
