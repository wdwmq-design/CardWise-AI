// ============================================
// CardWise AI — Wallet Context
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CreditCard, CardSavings } from '../types';
import { CREDIT_CARDS, getCardsByIds, analyzePurchase } from '../data/cards';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface WalletContextType {
  walletCards: CreditCard[];
  allAvailableCards: CreditCard[];
  loading: boolean;
  addCard: (cardId: string) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  getRecommendationForPurchase: (query: string) => { savings: CardSavings[]; amount: number; category: string; merchant: string };
  savingsHistory: Array<{
    id: string;
    description: string;
    amount: number;
    cardId: string;
    savings: number;
    date: string;
  }>;
  recordSavings: (description: string, amount: number, cardId: string, savings: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Default starter cards for demo/guest experience
const DEFAULT_CARD_IDS = ['hdfc-millennia', 'sbi-cashback', 'icici-amazon-pay', 'axis-ace'];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user, isDemo } = useAuth();
  const [walletCards, setWalletCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingsHistory, setSavingsHistory] = useState<WalletContextType['savingsHistory']>([]);

  // Load savings history from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cardwise_savings_history');
    if (savedHistory) {
      try {
        setSavingsHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing savings history', e);
      }
    } else {
      // Seed default transactions for high visual polish on fresh load
      const defaultHistory = [
        { id: '1', description: 'Bought Apple iPhone 15 Pro', amount: 120000, cardId: 'sbi-cashback', savings: 5000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '2', description: 'Swiggy Dinner Order', amount: 1850, cardId: 'axis-ace', savings: 74, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '3', description: 'Amazon shopping: Office Chair', amount: 12499, cardId: 'icici-amazon-pay', savings: 624.95, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '4', description: 'Uber Ride to Airport', amount: 950, cardId: 'axis-ace', savings: 38, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
      ];
      setSavingsHistory(defaultHistory);
      localStorage.setItem('cardwise_savings_history', JSON.stringify(defaultHistory));
    }
  }, []);

  // Fetch or setup wallet card IDs
  useEffect(() => {
    if (!user) {
      setWalletCards([]);
      setLoading(false);
      return;
    }

    const fetchWallet = async () => {
      setLoading(true);
      try {
        if (isDemo) {
          // In demo mode, load from localStorage or fall back to default seed list
          const localWallet = localStorage.getItem(`wallet_${user.uid}`);
          if (localWallet) {
            const ids = JSON.parse(localWallet);
            setWalletCards(getCardsByIds(ids));
          } else {
            setWalletCards(getCardsByIds(DEFAULT_CARD_IDS));
            localStorage.setItem(`wallet_${user.uid}`, JSON.stringify(DEFAULT_CARD_IDS));
          }
        } else {
          // Firestore backend integration
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists() && docSnap.data().walletCardIds) {
            setWalletCards(getCardsByIds(docSnap.data().walletCardIds));
          } else {
            // Document doesn't exist, create it with starter cards
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              walletCardIds: DEFAULT_CARD_IDS,
              createdAt: new Date(),
            }, { merge: true });
            setWalletCards(getCardsByIds(DEFAULT_CARD_IDS));
          }
        }
      } catch (err) {
        console.error('Error fetching card wallet:', err);
        // Resilient fallback to default cards
        setWalletCards(getCardsByIds(DEFAULT_CARD_IDS));
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [user, isDemo]);

  const addCard = useCallback(async (cardId: string) => {
    if (!user) return;
    
    const updatedCards = [...walletCards];
    if (updatedCards.some(c => c.id === cardId)) return; // already added

    const card = CREDIT_CARDS.find(c => c.id === cardId);
    if (!card) return;

    updatedCards.push(card);
    setWalletCards(updatedCards);

    const updatedIds = updatedCards.map(c => c.id);

    try {
      if (isDemo) {
        localStorage.setItem(`wallet_${user.uid}`, JSON.stringify(updatedIds));
      } else {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { walletCardIds: updatedIds });
      }
    } catch (e) {
      console.error('Error updating wallet card:', e);
    }
  }, [user, walletCards, isDemo]);

  const removeCard = useCallback(async (cardId: string) => {
    if (!user) return;

    const updatedCards = walletCards.filter(c => c.id !== cardId);
    setWalletCards(updatedCards);

    const updatedIds = updatedCards.map(c => c.id);

    try {
      if (isDemo) {
        localStorage.setItem(`wallet_${user.uid}`, JSON.stringify(updatedIds));
      } else {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { walletCardIds: updatedIds });
      }
    } catch (e) {
      console.error('Error removing wallet card:', e);
    }
  }, [user, walletCards, isDemo]);

  const getRecommendationForPurchase = useCallback((query: string) => {
    // If wallet is empty, calculate benefits across all available cards so user knows what they are missing
    const cardsToAnalyze = walletCards.length > 0 ? walletCards : CREDIT_CARDS;
    return analyzePurchase(query, cardsToAnalyze);
  }, [walletCards]);

  const recordSavings = useCallback(async (description: string, amount: number, cardId: string, savings: number) => {
    const newTx = {
      id: Date.now().toString(),
      description,
      amount,
      cardId,
      savings,
      date: new Date().toISOString(),
    };
    
    const updatedHistory = [newTx, ...savingsHistory];
    setSavingsHistory(updatedHistory);
    localStorage.setItem('cardwise_savings_history', JSON.stringify(updatedHistory));
  }, [savingsHistory]);

  return (
    <WalletContext.Provider value={{
      walletCards,
      allAvailableCards: CREDIT_CARDS,
      loading,
      addCard,
      removeCard,
      getRecommendationForPurchase,
      savingsHistory,
      recordSavings,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
