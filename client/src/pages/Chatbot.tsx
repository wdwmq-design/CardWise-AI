import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Send, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button } from '../components/ui';
import { ChatBubble, TypingIndicator, SuggestionChips, RecommendationCard } from '../components/chat';
import axios from 'axios';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chips?: string[];           // quick-reply chips shown below this message
  isRecommendation?: boolean; // marks the special recommendation bubble
  recommendationData?: RecommendationPayload;
}

interface ConversationState {
  step: number;
  cardNames: string;
  bank: string;
  country: string;
  purchaseItem: string;
  amount: string;
  channel: string;
  scope: string;
  preference: string;
  recommendationDone: boolean;
}

interface RecommendationPayload {
  bestCardName: string;
  bestCardBank: string;
  gradient: [string, string];
  cashback: number;
  rewardPoints: number;
  rewardValue: number;
  totalSavings: number;
  reasoning: string;
  alternatives: Array<{
    cardName: string;
    bank: string;
    gradient: [string, string];
    totalBenefit: number;
    tradeoff: string;
  }>;
  preference: string;
  parsedInfo: any;
  bestCardId: string;
  purchaseAmount: number;
}

// ─────────────────────────────────────────────
// Conversation script: 8 guided questions
// ─────────────────────────────────────────────
const QUESTIONS = [
  {
    key: 'cardNames',
    text: (walletNames: string[]) =>
      walletNames.length > 0
        ? `Hey there! 👋 I'm **CardWise AI** — your personal financial advisor.\n\nI see you have **${walletNames.join(', ')}** in your wallet. Are those the cards you'd like me to consider, or do you have others?`
        : `Hey there! 👋 I'm **CardWise AI** — your personal financial advisor.\n\nWhich **credit cards** do you currently own? (e.g. HDFC Millennia, SBI Cashback, Axis ACE)`,
    chips: (walletNames: string[]) =>
      walletNames.length > 0
        ? [`Yes, use my wallet cards`, `I have different cards`]
        : [],
  },
  {
    key: 'bank',
    text: () => `Which **bank(s)** issued these cards?`,
    chips: () => ['HDFC', 'SBI', 'ICICI', 'Axis', 'American Express', 'Kotak', 'IDFC'],
  },
  {
    key: 'country',
    text: () => `Which **country** are you currently in?`,
    chips: () => ['🇮🇳 India', '🇦🇪 UAE', '🇺🇸 USA', '🌍 Other'],
  },
  {
    key: 'purchaseItem',
    text: () => `What are you **purchasing?** Describe the item or service.`,
    chips: () => ['iPhone / Gadget', 'Flight tickets', 'Groceries', 'Dining / Restaurant', 'Online shopping', 'Fuel'],
  },
  {
    key: 'amount',
    text: () => `What is the **purchase amount?** (in ₹)`,
    chips: () => ['₹500', '₹2,000', '₹5,000', '₹10,000', '₹50,000', '₹1,00,000'],
  },
  {
    key: 'channel',
    text: () => `Is this an **online** or **offline** purchase?`,
    chips: () => ['🌐 Online', '🏪 Offline / In-store'],
  },
  {
    key: 'scope',
    text: () => `Is this a **domestic** or **international** transaction?`,
    chips: () => ['🇮🇳 Domestic', '🌍 International'],
  },
  {
    key: 'preference',
    text: () => `Last one! What's your **reward preference?**`,
    chips: () => ['💰 Max Cashback', '🎁 Reward Points', '✈️ Lounge Access', '📆 EMI / No-cost EMI'],
  },
];

// ─────────────────────────────────────────────
// Helper: generate a unique id
// ─────────────────────────────────────────────
let msgCounter = 0;
function uid(prefix = 'msg') {
  return `${prefix}-${Date.now()}-${++msgCounter}`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const { walletCards, getRecommendationForPurchase, recordSavings } = useWallet();
  const walletNames = walletCards.map(c => c.name);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chipsDisabled, setChipsDisabled] = useState(false);
  const [convState, setConvState] = useState<ConversationState>({
    step: 0,
    cardNames: '',
    bank: '',
    country: '',
    purchaseItem: '',
    amount: '',
    channel: '',
    scope: '',
    preference: '',
    recommendationDone: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ── Show first AI question on mount ──────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check if redirected from PurchaseAdvisor with context
    const chatContextRaw = localStorage.getItem('cardwise_chat_context');
    if (chatContextRaw) {
      localStorage.removeItem('cardwise_chat_context');
      try {
        const context = JSON.parse(chatContextRaw);
        const welcomeMsg: Message = {
          id: uid('welcome'),
          role: 'assistant',
          content: `Hey! 👋 You came from **Purchase Advisor**.\n\nI see you were asking about: *"${context.query}"*\n\nFeel free to ask me anything about that recommendation, or start a new purchase analysis below!`,
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Normal flow: show step 0 after a brief delay
    const timer = setTimeout(() => {
      const q = QUESTIONS[0];
      const firstMsg: Message = {
        id: uid('ai'),
        role: 'assistant',
        content: q.text(walletNames),
        timestamp: new Date(),
        chips: q.chips(walletNames),
      };
      setMessages([firstMsg]);
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Advance conversation after user answers ──────────────
  const advanceConversation = useCallback(
    async (answer: string, currentStep: number, currentState: ConversationState) => {
      setIsTyping(true);
      setChipsDisabled(true);

      // Simulate AI thinking delay (500–900ms)
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

      const nextStep = currentStep + 1;

      if (nextStep < QUESTIONS.length) {
        // Show next question
        const q = QUESTIONS[nextStep];
        const aiMsg: Message = {
          id: uid('ai'),
          role: 'assistant',
          content: q.text(walletNames),
          timestamp: new Date(),
          chips: q.chips(walletNames),
        };
        setMessages(prev => [...prev, aiMsg]);
        setConvState(prev => ({ ...prev, step: nextStep }));
        setChipsDisabled(false);
      } else {
        // All steps done — generate recommendation
        await generateRecommendation(currentState);
      }

      setIsTyping(false);
    },
    [walletNames]
  );

  // ── Build query string from conversation state ───────────
  const buildQuery = (state: ConversationState): string => {
    const parts = [];
    if (state.purchaseItem) parts.push(`I'm buying ${state.purchaseItem}`);
    if (state.amount) {
      const amt = state.amount.replace(/[₹,\s]/g, '');
      if (amt) parts.push(`for ₹${amt}`);
    }
    if (state.channel?.toLowerCase().includes('online')) parts.push('online');
    if (state.channel?.toLowerCase().includes('offline')) parts.push('offline');
    if (state.scope?.toLowerCase().includes('international')) parts.push('international transaction');
    return parts.join(' ') || state.purchaseItem || 'general purchase';
  };

  // ── Generate recommendation ──────────────────────────────
  const generateRecommendation = useCallback(
    async (state: ConversationState) => {
      const query = buildQuery(state);
      const analysis = getRecommendationForPurchase(query);

      if (analysis.savings.length === 0) {
        const errMsg: Message = {
          id: uid('ai'),
          role: 'assistant',
          content: `Hmm, I couldn't find any cards to compare. Please add cards to your wallet first! You can do that from the **My Wallet** page.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errMsg]);
        return;
      }

      const primary = analysis.savings[0];
      const alts = analysis.savings.slice(1, 3);

      let reasoning = '';
      let cashback = primary.cashback;
      let rewardPoints = primary.rewardPoints;
      let rewardValue = primary.rewardValue;
      let totalSavings = primary.totalBenefit;
      let bestCard = primary.card;

      try {
        // Try backend
        const response = await axios.post('http://localhost:3001/api/advisor/recommend', {
          query,
          walletCardIds: walletCards.map(c => c.id),
        });
        const data = response.data;
        const foundCard = CREDIT_CARDS.find(c => c.id === data.bestCard.cardId);
        if (foundCard) bestCard = foundCard;
        cashback = data.savings.cashback;
        rewardPoints = data.savings.rewardPoints;
        rewardValue = data.savings.rewardValue;
        totalSavings = cashback + rewardValue;
        reasoning = data.bestCard.reason || data.reasoning || '';
      } catch {
        // Local fallback reasoning
        const card = primary.card;
        reasoning = `Recommending **${card.name}** because it gives you `;
        if (primary.appliedBonus) {
          const rate = card.cashbackRate[analysis.merchant] ?? card.cashbackRate[analysis.category] ?? card.cashbackRate.default;
          reasoning += `a specialized **${primary.appliedBonus}** of **${rate}%** for this type of purchase.`;
        } else {
          reasoning += `its **${card.cashbackRate.default}% default cashback** on all transactions.`;
        }
        reasoning += ` You earn **₹${cashback.toFixed(2)} cashback** + **${rewardPoints} reward points** (₹${rewardValue.toFixed(2)} value), totalling **₹${totalSavings.toFixed(2)}** in benefits.`;
        if (state.preference.toLowerCase().includes('lounge') && card.loungeAccess.domestic > 0) {
          reasoning += ` This card also offers **${card.loungeAccess.domestic} domestic lounge visits/year**.`;
        }
      }

      const alternatives = alts.map(alt => {
        const diff = primary.totalBenefit - alt.totalBenefit;
        return {
          cardName: alt.card.name,
          bank: alt.card.bank,
          gradient: alt.card.gradient,
          totalBenefit: alt.totalBenefit,
          tradeoff:
            diff > 0
              ? `Saves ₹${diff.toFixed(2)} less due to lower ${analysis.category} rate`
              : `Comparable savings but different reward structure`,
        };
      });

      const recPayload: RecommendationPayload = {
        bestCardName: bestCard.name,
        bestCardBank: bestCard.bank,
        gradient: bestCard.gradient,
        cashback,
        rewardPoints,
        rewardValue,
        totalSavings: cashback + rewardValue,
        reasoning,
        alternatives,
        preference: state.preference,
        parsedInfo: analysis,
        bestCardId: bestCard.id,
        purchaseAmount: analysis.amount,
      };

      // Show a brief intro message then the recommendation card
      const introMsg: Message = {
        id: uid('ai'),
        role: 'assistant',
        content: `✅ Based on everything you've told me, here's my recommendation:`,
        timestamp: new Date(),
      };

      const recMsg: Message = {
        id: uid('rec'),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isRecommendation: true,
        recommendationData: recPayload,
      };

      setMessages(prev => [...prev, introMsg, recMsg]);
      setConvState(prev => ({ ...prev, recommendationDone: true }));
    },
    [walletCards, getRecommendationForPurchase]
  );

  // ── Handle user sending a message ───────────────────────
  const handleSend = useCallback(
    async (e?: React.FormEvent, chipText?: string) => {
      e?.preventDefault();
      const text = (chipText ?? input).trim();
      if (!text || isTyping || convState.recommendationDone) return;

      // Add user bubble
      const userMsg: Message = {
        id: uid('user'),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      // Map current step key → value
      const stepKey = QUESTIONS[convState.step]?.key as keyof ConversationState;
      const nextState = { ...convState, [stepKey]: text };
      setConvState(nextState);

      await advanceConversation(text, convState.step, nextState);
    },
    [input, isTyping, convState, advanceConversation]
  );

  // ── Handle log purchase ──────────────────────────────────
  const handleLogPurchase = useCallback(
    async (data: RecommendationPayload) => {
      await recordSavings(
        convState.purchaseItem || 'Purchase',
        data.purchaseAmount,
        data.bestCardId,
        data.totalSavings
      );
      navigate('/dashboard');
    },
    [convState, recordSavings, navigate]
  );

  // ── Handle ask follow-up ─────────────────────────────────
  const handleAskFollowUp = useCallback((data: RecommendationPayload) => {
    localStorage.setItem(
      'cardwise_chat_context',
      JSON.stringify({
        query: convState.purchaseItem,
        recommendedCardId: data.bestCardId,
        savings: data.totalSavings,
      })
    );
    // Refresh the page to restart the flow in follow-up mode
    window.location.reload();
  }, [convState]);

  // ── Start over ───────────────────────────────────────────
  const handleStartOver = useCallback(() => {
    msgCounter = 0;
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setChipsDisabled(false);
    setConvState({
      step: 0,
      cardNames: '',
      bank: '',
      country: '',
      purchaseItem: '',
      amount: '',
      channel: '',
      scope: '',
      preference: '',
      recommendationDone: false,
    });
    initialized.current = false;

    // Re-trigger the first question
    setTimeout(() => {
      const q = QUESTIONS[0];
      const firstMsg: Message = {
        id: uid('ai'),
        role: 'assistant',
        content: q.text(walletNames),
        timestamp: new Date(),
        chips: q.chips(walletNames),
      };
      setMessages([firstMsg]);
      initialized.current = true;
    }, 100);
  }, [walletNames]);

  // ── Progress bar ─────────────────────────────────────────
  const progress = convState.recommendationDone
    ? 100
    : Math.round((convState.step / QUESTIONS.length) * 100);

  const stepLabel = convState.recommendationDone
    ? 'Complete'
    : `Step ${Math.min(convState.step + 1, QUESTIONS.length)} of ${QUESTIONS.length}`;

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] border border-surface-800/60 p-0 overflow-hidden glass-card relative">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-800/50 bg-surface-950/30 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-accent/30 blur-md" />
            <div className="relative w-9 h-9 rounded-xl bg-surface-900 border border-accent/30 flex items-center justify-center text-accent">
              <Bot className="w-4.5 h-4.5" />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-surface-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-100 leading-none">CardWise AI</h3>
            <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-accent" />
              Financial Advisor · Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">{stepLabel}</span>
              <span className="text-[9px] font-black text-accent">{progress}%</span>
            </div>
            <div className="w-24 h-1 bg-surface-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Restart button */}
          <button
            onClick={handleStartOver}
            title="Start over"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-surface-500 hover:text-white hover:bg-surface-800/60 border border-transparent hover:border-surface-700/40 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map(m => (
            <React.Fragment key={m.id}>
              {m.isRecommendation && m.recommendationData ? (
                // Special recommendation bubble (no ChatBubble wrapper — rendered at full width)
                <div className="pl-11">
                  <RecommendationCard
                    {...m.recommendationData}
                    onLogPurchase={() => handleLogPurchase(m.recommendationData!)}
                    onAskFollowUp={() => handleAskFollowUp(m.recommendationData!)}
                    onStartOver={handleStartOver}
                  />
                </div>
              ) : (
                <ChatBubble
                  role={m.role}
                  content={m.content}
                  timestamp={m.timestamp}
                >
                  {null}
                </ChatBubble>
              )}

              {/* Chips shown after AI messages */}
              {m.role === 'assistant' && m.chips && m.chips.length > 0 && (
                <SuggestionChips
                  chips={m.chips}
                  onSelect={chip => handleSend(undefined, chip)}
                  disabled={chipsDisabled || convState.recommendationDone}
                />
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 px-5 py-4 border-t border-surface-800/50 bg-surface-950/30 backdrop-blur-sm">
        {convState.recommendationDone ? (
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-surface-500 font-medium">Recommendation complete.</span>
            <button
              onClick={handleStartOver}
              className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-light transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Start a new analysis
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isTyping
                    ? 'CardWise AI is typing…'
                    : convState.step < QUESTIONS.length
                      ? `Answer here or tap a chip above…`
                      : 'Type your message…'
                }
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping || convState.recommendationDone}
                className="
                  w-full bg-surface-900/60 hover:bg-surface-900/80
                  border border-surface-800/80 hover:border-surface-700/60
                  focus:border-accent/40 focus:ring-1 focus:ring-accent/25
                  text-surface-100 placeholder:text-surface-600
                  rounded-xl px-4 py-3 text-sm font-medium
                  focus:outline-none transition-all duration-200
                  disabled:opacity-50
                "
              />
            </div>
            <Button
              type="submit"
              size="md"
              className="py-3 px-4 font-bold shrink-0"
              disabled={!input.trim() || isTyping || convState.recommendationDone}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Mobile progress bar */}
        <div className="sm:hidden mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9px] text-surface-600 font-bold shrink-0">{stepLabel}</span>
        </div>
      </div>
    </Card>
  );
};

export default Chatbot;
