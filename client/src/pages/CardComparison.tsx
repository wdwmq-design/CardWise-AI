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
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-surface-200">Card Comparison Engine</h3>
            <p className="text-xs text-surface-500 font-medium">Compare savings side-by-side for a specific purchase amount across your wallet.</p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. Booking flights on Cleartrip for ₹15,000"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-surface-900 border border-surface-800 text-surface-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-surface-600 font-medium"
          />
          <Button type="submit" className="px-6 font-bold" isLoading={loading} disabled={!query.trim()}>
            Compare Spends
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-surface-500 font-bold uppercase tracking-wider">Quick Prompts:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); }}
              className="text-xs bg-surface-850 hover:bg-surface-800 text-surface-350 hover:text-surface-150 px-3 py-1.5 rounded-lg border border-surface-800 transition-all cursor-pointer"
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
          className="space-y-6"
        >
          {/* Winner highlight widget */}
          {comparisonResults.savings.length > 0 && (
            <Card glow className="p-6 border border-accent/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                  <Award className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <Badge variant="success" size="sm" className="font-bold">Winner Highlight</Badge>
                  <h4 className="text-lg font-bold text-surface-200 mt-1">
                    Use your {comparisonResults.savings[0].card.name}
                  </h4>
                  <p className="text-xs text-surface-450 mt-0.5">
                    It yields <span className="text-accent font-bold">₹{comparisonResults.savings[0].totalBenefit.toFixed(2)}</span> in total benefit for this transaction.
                  </p>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <div className="text-sm text-surface-450 font-bold uppercase">Estimated Category</div>
                <div className="text-base font-extrabold text-accent mt-0.5">
                  {comparisonResults.category.toUpperCase()}
                </div>
              </div>
            </Card>
          )}

          {/* Comparison Table Ledger */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-800 text-xs text-surface-500 font-bold uppercase bg-surface-950/20">
                    <th className="py-4 px-6">Card Profile</th>
                    <th className="py-4 px-6 text-center">Cashback Yield</th>
                    <th className="py-4 px-6 text-center">Reward Points</th>
                    <th className="py-4 px-6 text-center">Points Value</th>
                    <th className="py-4 px-6 text-right">Total Saving</th>
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
                            ? 'bg-accent/5 hover:bg-accent/10 border-l-4 border-l-accent' 
                            : 'hover:bg-surface-850/15'
                          }
                        `}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-11 h-7 rounded flex items-center justify-center font-black text-[8px] text-white shrink-0 shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${item.card.gradient[0]}, ${item.card.gradient[1]})` }}
                            >
                              {item.card.bank}
                            </div>
                            <div>
                              <h5 className="font-bold text-surface-200 leading-tight flex items-center gap-1.5">
                                {item.card.name}
                                {isWinner && <span className="text-[10px] bg-accent/20 text-accent font-extrabold px-1.5 py-0.2 rounded uppercase">Best</span>}
                              </h5>
                              <p className="text-[10px] text-surface-500 font-semibold mt-0.5">{item.card.network.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-surface-300">
                          ₹{item.cashback.toFixed(2)}
                          {item.appliedBonus && (
                            <span className="block text-[9px] text-accent font-bold mt-0.5">{item.appliedBonus}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-surface-300">
                          {item.rewardPoints} pts
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-semibold text-indigo-400">
                          ₹{item.rewardValue.toFixed(2)}
                        </td>
                        <td className={`py-4 px-6 text-right font-mono font-bold text-base
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
