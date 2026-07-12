import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeftRight, 
  HelpCircle, 
  Sparkles, 
  Search, 
  Award,
  TrendingUp,
  Percent,
  Coins
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, Input, Badge } from '../components/ui';

export const CardComparison: React.FC = () => {
  const { walletCards, getRecommendationForPurchase } = useWallet();
  const [query, setQuery] = useState('');
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    
    // Call the local evaluation engine
    const results = getRecommendationForPurchase(query);
    setComparisonResults(results);
    setLoading(false);
  };

  const sampleQueries = [
    "Buying laptop for ₹55,000",
    "Swiggy delivery for ₹850",
    "Cleartrip flight tickets for ₹12,000",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Compare Query Card */}
      <Card className="p-6 space-y-6 glass-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <ArrowLeftRight className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-200">Card Comparison Engine</h3>
            <p className="text-xs text-surface-500 font-medium">Compare savings side-by-side for a specific purchase amount across your wallet.</p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. Booking flights on Cleartrip for ₹15,000"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-surface-900/60 hover:bg-surface-900/85 border border-surface-800/80 text-surface-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all placeholder:text-surface-600 font-medium"
          />
          <Button type="submit" className="px-6 font-bold text-sm shrink-0" isLoading={loading} disabled={!query.trim()}>
            Compare Spends
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Quick Prompts:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); }}
              className="text-xs bg-surface-900/50 hover:bg-surface-850/80 text-surface-400 hover:text-surface-200 px-3.5 py-1.5 rounded-xl border border-surface-800/80 hover:border-surface-750/70 transition-all cursor-pointer font-semibold"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>

      {/* Comparison Results Table */}
      {comparisonResults && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="space-y-6 animate-fade-in"
        >
          {/* Winner highlight widget */}
          {comparisonResults.savings.length > 0 && (
            <Card glow className="p-6 border border-accent/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 relative overflow-hidden glass-card">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Award className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <Badge variant="success" size="sm" className="font-bold">Winner Highlight</Badge>
                  <h4 className="text-base font-extrabold text-surface-100 mt-1">
                    Use your {comparisonResults.savings[0].card.name}
                  </h4>
                  <p className="text-xs text-surface-500 mt-0.5 font-medium">
                    It yields <span className="text-accent font-bold stat-number">₹{comparisonResults.savings[0].totalBenefit.toFixed(2)}</span> in total benefit for this transaction.
                  </p>
                </div>
              </div>
              
              <div className="text-left sm:text-right shrink-0">
                <div className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Estimated Category</div>
                <div className="text-xs font-black text-accent bg-accent/10 border border-accent/25 px-2.5 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider">
                  {comparisonResults.category}
                </div>
              </div>
            </Card>
          )}

          {/* Comparison Table Ledger */}
          <Card className="p-0 overflow-hidden glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-surface-800/60 bg-surface-950/20">
                    <th className="py-4 px-6 text-[10px] text-surface-600 font-bold uppercase tracking-widest">Card Profile</th>
                    <th className="py-4 px-6 text-center text-[10px] text-surface-600 font-bold uppercase tracking-widest">Cashback Yield</th>
                    <th className="py-4 px-6 text-center text-[10px] text-surface-600 font-bold uppercase tracking-widest">Reward Points</th>
                    <th className="py-4 px-6 text-center text-[10px] text-surface-600 font-bold uppercase tracking-widest">Points Value</th>
                    <th className="py-4 px-6 text-right text-[10px] text-surface-600 font-bold uppercase tracking-widest">Total Saving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-850/60 text-sm">
                  {comparisonResults.savings.map((item: any, idx: number) => {
                    const isWinner = idx === 0;
                    return (
                      <tr 
                        key={item.cardId} 
                        className={`transition-colors
                          ${isWinner 
                            ? 'bg-accent/5 hover:bg-accent/8 border-l-4 border-l-accent' 
                            : 'hover:bg-surface-800/20'
                          }
                        `}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-11 h-7 rounded flex items-center justify-center font-black text-[8px] text-white shrink-0 shadow-sm card-shine"
                              style={{ background: `linear-gradient(135deg, ${item.card.gradient[0]}, ${item.card.gradient[1]})` }}
                            >
                              {item.card.bank}
                            </div>
                            <div>
                              <h5 className="font-bold text-surface-200 leading-tight flex items-center gap-1.5">
                                {item.card.name}
                                {isWinner && <span className="text-[9px] bg-accent/20 border border-accent/25 text-accent font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">Best</span>}
                              </h5>
                              <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-0.5">{item.card.network.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-surface-300">
                          ₹{item.cashback.toFixed(2)}
                          {item.appliedBonus && (
                            <span className="block text-[9px] text-accent font-bold mt-0.5 uppercase tracking-wider">{item.appliedBonus}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-surface-400">
                          {item.rewardPoints} pts
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-indigo-400">
                          ₹{item.rewardValue.toFixed(2)}
                        </td>
                        <td className={`py-4 px-6 text-right font-mono font-bold text-sm md:text-base
                          ${isWinner ? 'text-accent' : 'text-surface-200'}
                        `}>
                          ₹{item.totalBenefit.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

        </motion.div>
      )}

    </div>
  );
};

export default CardComparison;
