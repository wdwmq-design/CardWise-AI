import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Check, 
  ArrowLeftRight, 
  Info,
  ChevronRight,
  MessageSquare,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, Input, Skeleton, AnimatedNumber, Badge } from '../components/ui';
import axios from 'axios';

export const PurchaseAdvisor: React.FC = () => {
  const navigate = useNavigate();
  const { walletCards, getRecommendationForPurchase, recordSavings } = useWallet();
  
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  
  // Results states
  const [bestCard, setBestCard] = useState<any>(null);
  const [savingsAmt, setSavingsAmt] = useState(0);
  const [rewardPts, setRewardPts] = useState(0);
  const [rewardVal, setRewardVal] = useState(0);
  const [reasoning, setReasoning] = useState('');
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [parsedInfo, setParsedInfo] = useState<any>(null);

  const samplePrompts = [
    "I'm buying an iPhone worth ₹80,000 on Amazon",
    "Ordering Zomato dinner for my family for ₹2,400",
    "Booking flight tickets to Goa on Cleartrip for ₹15,000",
    "Buying groceries on Blinkit for ₹1,200",
  ];

  const handlePromptSelect = (prompt: string) => {
    setQuery(prompt);
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setIsLoading(true);
    setHasSearched(true);

    const start = Date.now();

    // Get mathematical analysis locally
    const analysis = getRecommendationForPurchase(query);
    
    if (analysis.savings.length === 0) {
      setError('Please add cards to your wallet first!');
      setIsLoading(false);
      return;
    }

    const primaryRecommendation = analysis.savings[0];
    const alternates = analysis.savings.slice(1, 3); // top 2 fallback cards

    // Try calling local Express backend API, fall back to local mock generator if backend isn't running
    try {
      const response = await axios.post('http://localhost:3001/api/advisor/recommend', {
        query,
        walletCardIds: walletCards.map(c => c.id)
      });
      
      const data = response.data;
      setBestCard(CREDIT_CARDS.find(c => c.id === data.bestCard.cardId) || primaryRecommendation.card);
      setSavingsAmt(data.savings.cashback);
      setRewardPts(data.savings.rewardPoints);
      setRewardVal(data.savings.rewardValue);
      setReasoning(data.bestCard.reason || data.reasoning);
      
      const mappedAlts = data.alternatives.map((alt: any) => ({
        card: CREDIT_CARDS.find(c => c.id === alt.cardId) || CREDIT_CARDS[0],
        savings: alt.savings.cashback + alt.savings.rewardValue,
        tradeoff: alt.tradeoff
      }));
      setAlternatives(mappedAlts);
    } catch (apiError) {
      console.warn('Backend server not responding, running local AI recommendation algorithm...');
      
      // Local Mock AI reasoning generator
      const card = primaryRecommendation.card;
      let textReasoning = `We recommend swiping the ${card.name} because it gives you `;
      
      if (primaryRecommendation.appliedBonus) {
        textReasoning += `a specialized ${primaryRecommendation.appliedBonus} of ${card.cashbackRate[analysis.merchant] || card.cashbackRate[analysis.category] || card.cashbackRate.default}%`;
      } else {
        textReasoning += `its default rate of ${card.cashbackRate.default}% cashback`;
      }

      textReasoning += ` on this purchase. You will earn ₹${primaryRecommendation.cashback.toFixed(2)} cashback plus ${primaryRecommendation.rewardPoints} reward points (value: ₹${primaryRecommendation.rewardValue.toFixed(2)}), giving you a total saving of ₹${primaryRecommendation.totalBenefit.toFixed(2)}.`;
      
      if (card.annualFee > 0 && card.feeWaiverCriteria) {
        textReasoning += ` This transaction also contributes towards your ${card.feeWaiverCriteria} annual fee milestone.`;
      }

      setBestCard(card);
      setSavingsAmt(primaryRecommendation.cashback);
      setRewardPts(primaryRecommendation.rewardPoints);
      setRewardVal(primaryRecommendation.rewardValue);
      setReasoning(textReasoning);

      const localAlts = alternates.map(alt => {
        let tradeoffMsg = '';
        if (alt.totalBenefit < primaryRecommendation.totalBenefit) {
          tradeoffMsg = `Saves you ₹${(primaryRecommendation.totalBenefit - alt.totalBenefit).toFixed(2)} less due to lower category multiplier.`;
        } else {
          tradeoffMsg = `Same savings rate but slower reward point settlement times.`;
        }
        return {
          card: alt.card,
          savings: alt.totalBenefit,
          tradeoff: tradeoffMsg
        };
      });
      setAlternatives(localAlts);
    }

    const elapsed = Date.now() - start;
    const minWait = 950;
    if (elapsed < minWait) {
      await new Promise(resolve => setTimeout(resolve, minWait - elapsed));
    }
    
    setParsedInfo(analysis);
    setIsLoading(false);
  };

  const handleLogPurchase = async () => {
    if (!bestCard || !parsedInfo) return;
    const totalBenefit = savingsAmt + rewardVal;
    await recordSavings(
      query,
      parsedInfo.amount,
      bestCard.id,
      totalBenefit
    );
    navigate('/dashboard');
  };

  const handleAskFollowUp = () => {
    if (!bestCard) return;
    localStorage.setItem('cardwise_chat_context', JSON.stringify({
      query,
      recommendedCardId: bestCard.id,
      savings: savingsAmt + rewardVal
    }));
    navigate('/chat');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Search Console Card */}
      <Card className="p-6 md:p-8 space-y-6 glass-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-200">Instant Purchase Advisor</h3>
            <p className="text-xs text-surface-500 font-medium">Describe your next transaction to identify the highest earning card.</p>
          </div>
        </div>

        <form onSubmit={handleRecommend} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. I'm buying an iPhone worth ₹80,000 on Flipkart..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-surface-900/60 hover:bg-surface-900/85 border border-surface-800 text-surface-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all placeholder:text-surface-600 font-medium"
            disabled={isLoading}
          />
          <Button type="submit" className="px-6 font-bold text-sm shrink-0" isLoading={isLoading} disabled={!query.trim()}>
            Get Advice
          </Button>
        </form>

        {/* Suggestion Prompts */}
        <div className="space-y-2.5">
          <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Try typing:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptSelect(p)}
                className="text-xs bg-surface-900/50 hover:bg-surface-850/80 text-surface-400 hover:text-surface-200 px-3.5 py-2 rounded-xl border border-surface-800/80 hover:border-surface-750/70 transition-all text-left cursor-pointer font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error render */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-danger/10 border border-danger/20 text-danger text-xs font-semibold rounded-2xl animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
          <span>{error}</span>
        </div>
      )}

      {/* Advice Rendering */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="p-6 md:p-8 space-y-6 glass-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 w-1/2">
                  <Skeleton className="w-16 h-10 rounded-lg shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </motion.div>
        )}

        {!isLoading && hasSearched && bestCard && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="space-y-4 animate-fade-in"
          >
            {/* Primary Recommendation Card */}
            <Card glow className="p-6 md:p-8 space-y-6 glass-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              
              {/* Header: Winner Banner & Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-800/40">
                <div className="flex items-center gap-4">
                  {/* Card Icon */}
                  <div 
                    className="w-14 h-9 rounded-xl shadow-md shrink-0 flex items-center justify-center font-black text-[9px] text-white card-shine"
                    style={{ background: `linear-gradient(135deg, ${bestCard.gradient[0]}, ${bestCard.gradient[1]})` }}
                  >
                    {bestCard.bank}
                  </div>
                  <div>
                    <span className="text-[9px] text-accent font-black uppercase tracking-widest flex items-center gap-1">
                      Recommended Card
                    </span>
                    <h3 className="text-base font-extrabold text-surface-100">{bestCard.name}</h3>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xl font-black stat-number text-accent">
                      <AnimatedNumber value={savingsAmt + rewardVal} decimals={2} />
                    </div>
                    <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">Total Savings</p>
                  </div>
                  <Button onClick={handleLogPurchase} size="sm" className="font-bold text-xs">
                    Log Spends
                  </Button>
                </div>
              </div>

              {/* Explanatory Reasoning block */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-surface-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Info className="w-4 h-4 text-accent shrink-0" /> AI Explanation
                </h4>
                <p className="text-sm text-surface-200 leading-relaxed font-medium">
                  {reasoning}
                </p>
              </div>

              {/* Savings Breakdown Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surface-800/40 text-center">
                <div className="bg-surface-900/30 p-3.5 rounded-xl border border-surface-800/40">
                  <span className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">Cashback</span>
                  <div className="text-base font-bold stat-number text-surface-200 mt-1">₹{savingsAmt.toFixed(2)}</div>
                </div>
                <div className="bg-surface-900/30 p-3.5 rounded-xl border border-surface-800/40">
                  <span className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">Reward Pts</span>
                  <div className="text-base font-bold stat-number text-surface-200 mt-1">{rewardPts} pts</div>
                </div>
                <div className="bg-surface-900/30 p-3.5 rounded-xl border border-surface-800/40">
                  <span className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">Points Value</span>
                  <div className="text-base font-bold stat-number text-indigo-400 mt-1">₹{rewardVal.toFixed(2)}</div>
                </div>
              </div>

              {/* Chat action button */}
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAskFollowUp} 
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                  className="text-xs font-bold text-accent"
                >
                  Ask AI: "Why not my other cards?"
                </Button>
              </div>

            </Card>

            {/* Alternatives section */}
            {alternatives.length > 0 && (
              <Card className="p-6 space-y-4 glass-card">
                <h4 className="text-xs font-bold text-surface-400 flex items-center gap-1.5 uppercase tracking-widest">
                  <ArrowLeftRight className="w-4 h-4 text-surface-550 shrink-0" /> Alternative Choices
                </h4>
                
                <div className="space-y-3">
                  {alternatives.map((alt, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 rounded-xl border border-surface-850/60 bg-surface-900/25 hover:border-surface-800 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-8 rounded-lg flex items-center justify-center font-bold text-[9px] text-white shrink-0 shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${alt.card.gradient[0]}, ${alt.card.gradient[1]})` }}
                        >
                          {alt.card.bank}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-surface-150 leading-tight">{alt.card.name}</h5>
                          <p className="text-[11px] text-surface-500 font-medium mt-0.5">{alt.tradeoff}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold stat-number text-surface-300">₹{alt.savings.toFixed(2)}</div>
                        <span className="text-[9px] text-surface-550 font-bold uppercase">Benefit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PurchaseAdvisor;
