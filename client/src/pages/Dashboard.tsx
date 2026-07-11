import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  Plus, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, AnimatedNumber } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { walletCards, savingsHistory } = useWallet();

  // 1. Calculate stats based on wallet and savings history
  const totalSavings = savingsHistory.reduce((acc, curr) => acc + curr.savings, 0);
  const cashbackEarned = savingsHistory.reduce((acc, curr) => acc + (curr.amount * 0.02), 0); // estimation
  const rewardPoints = Math.round(savingsHistory.reduce((acc, curr) => acc + (curr.amount * 0.05), 0));

  // Find best performing card from history
  const cardSavingsMap = savingsHistory.reduce((acc, curr) => {
    acc[curr.cardId] = (acc[curr.cardId] || 0) + curr.savings;
    return acc;
  }, {} as Record<string, number>);

  let bestCardId = '';
  let maxSaved = 0;
  Object.entries(cardSavingsMap).forEach(([id, saved]) => {
    if (saved > maxSaved) {
      maxSaved = saved;
      bestCardId = id;
    }
  });

  const bestCard = CREDIT_CARDS.find(c => c.id === bestCardId) || walletCards[0] || null;

  // Calculate Benefit Health Score (0-100)
  // Formula: points for variety, points for specific premium cards
  let healthScore = 0;
  if (walletCards.length > 0) {
    const categoriesCovered = new Set<string>();
    walletCards.forEach(c => {
      Object.keys(c.cashbackRate).forEach(cat => {
        if (cat !== 'default' && c.cashbackRate[cat]! > 1) {
          categoriesCovered.add(cat);
        }
      });
    });

    const categoryScore = Math.min(categoriesCovered.size * 15, 60); // max 60 points for category variety
    const cardCountScore = Math.min(walletCards.length * 10, 30); // max 30 points for number of cards
    const premiumScore = walletCards.some(c => c.annualFee > 2000) ? 10 : 0; // 10 points for premium card
    healthScore = categoryScore + cardCountScore + premiumScore;
  }

  // Monthly Trend Chart mock data
  const trendData = [
    { month: 'Jan', savings: 1200 },
    { month: 'Feb', savings: 2100 },
    { month: 'Mar', savings: 1800 },
    { month: 'Apr', savings: 3200 },
    { month: 'May', savings: 2900 },
    { month: 'Jun', savings: totalSavings > 0 ? Math.round(totalSavings * 0.6) : 3400 },
    { month: 'Jul', savings: totalSavings > 0 ? Math.round(totalSavings) : 4100 },
  ];

  // SVG parameters for Health Score ring
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success stroke-success shadow-success/20';
    if (score >= 50) return 'text-warning stroke-warning shadow-warning/20';
    return 'text-danger stroke-danger shadow-danger/20';
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Financial Hub</h1>
          <p className="text-surface-400 font-medium">Maximize every transaction and track your optimized rewards.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/advisor')} 
            icon={<Sparkles className="w-4 h-4" />}
          >
            Ask Purchase Advisor
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/wallet')} 
            icon={<Plus className="w-4 h-4" />}
          >
            Manage Wallet
          </Button>
        </div>
      </div>

      {/* Grid: 3 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Health Score Ring */}
        <Card className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-surface-800 stroke-current"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <motion.circle
                className={getScoreColor(healthScore)}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-mono leading-none">{healthScore}</span>
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-0.5">Score</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              Benefit Health <HelpCircle className="w-4 h-4 text-surface-500 cursor-help" />
            </h3>
            <p className="text-xs text-surface-400 leading-normal">
              {healthScore >= 80 
                ? 'Excellent portfolio! You are capturing maximum category cashback.' 
                : healthScore >= 50 
                ? 'Good coverage. Add an online shopping bonus card to hit 80+.' 
                : 'Poor coverage. Select your owned cards to see your true score.'}
            </p>
          </div>
        </Card>

        {/* Total Savings Card */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider">Total Savings</span>
            <div className="flex items-center gap-1 text-xs text-success bg-success/15 px-2.5 py-0.5 rounded-full font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </div>
          </div>
          <div className="mt-2.5">
            <h2 className="text-3xl font-black font-mono">
              <AnimatedNumber value={totalSavings || 5836.95} decimals={2} />
            </h2>
            <p className="text-xs text-surface-450 mt-1 font-medium">Estimated savings vs. generic debit swipe</p>
          </div>
        </Card>

        {/* Best Performing Card */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider">Best Card This Month</span>
            <span className="text-xs text-accent bg-accent/15 px-2.5 py-0.5 rounded-full font-bold">Best Performer</span>
          </div>
          {bestCard ? (
            <div className="flex items-center gap-4 mt-2">
              <div 
                className="w-14 h-9 rounded-lg shadow-md shrink-0 flex items-center justify-center font-extrabold text-[10px] text-white"
                style={{ background: `linear-gradient(135deg, ${bestCard.gradient[0]}, ${bestCard.gradient[1]})` }}
              >
                {bestCard.bank}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-surface-200 truncate">{bestCard.name}</h4>
                <p className="text-xs text-slate-450 mt-0.5 font-mono">Saved: <span className="text-accent font-bold">₹{maxSaved || 5000}</span></p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-surface-500 mt-2 font-medium">Add cards to view your top performer.</p>
          )}
        </Card>

      </div>

      {/* Main Grid: Trend Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Savings Trend Area Chart (2/3 width) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-surface-200">Savings Trend</h3>
              <p className="text-xs text-surface-550">Cashback + reward points value monthly breakdown</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-accent font-bold bg-accent/10 px-2.5 py-1 rounded-lg">6 Months</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Quick Stats breakdown (1/3 width) */}
        <Card className="space-y-5">
          <h3 className="text-lg font-bold text-surface-200">Wallet Health Stats</h3>
          <div className="space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-surface-800/40">
              <span className="text-sm text-surface-400 font-semibold">Total Cards Owned</span>
              <span className="text-sm font-bold font-mono">{walletCards.length} Cards</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-surface-800/40">
              <span className="text-sm text-surface-400 font-semibold">Cashback Accrued</span>
              <span className="text-sm font-bold font-mono text-accent">₹{cashbackEarned.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-surface-800/40">
              <span className="text-sm text-surface-400 font-semibold">Reward Points Earned</span>
              <span className="text-sm font-bold font-mono text-indigo-400">{rewardPoints} pts</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-surface-800/40">
              <span className="text-sm text-surface-400 font-semibold">Lounge Visits Rem.</span>
              <span className="text-sm font-bold font-mono text-amber-400">14 visits</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-400 font-semibold">Waiver Target Met</span>
              <span className="text-sm font-bold text-success flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> 2/4 cards
              </span>
            </div>

          </div>
        </Card>
      </div>

      {/* Ledger Table: Recent Purchase Savings Log */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-surface-200">Recent Savings Activities</h3>
            <p className="text-xs text-surface-550">Every transaction logged and optimized using CardWise AI</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-800 text-xs text-surface-500 font-bold uppercase">
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Purchase Amt</th>
                <th className="py-3 px-4">Card Used</th>
                <th className="py-3 px-4 text-right">Cashback / Savings</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-850/60 text-sm">
              {savingsHistory.map((tx) => {
                const card = CREDIT_CARDS.find(c => c.id === tx.cardId);
                return (
                  <tr key={tx.id} className="hover:bg-surface-850/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-surface-200">{tx.description}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-surface-300">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      {card ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span 
                            className="w-3.5 h-2.5 rounded-sm shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                          />
                          <span className="text-xs font-medium text-surface-300">{card.name}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-surface-500">Unknown Card</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-accent">+₹{tx.savings.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-xs text-surface-500 font-medium">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                );
              })}
              {savingsHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-surface-550 font-medium">
                    No transactions recorded yet. Try the Purchase Advisor!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default Dashboard;
