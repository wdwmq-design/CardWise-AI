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
  TrendingDown,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, AnimatedNumber, Badge } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

/* ──────────────────────────────────────────────
   Custom Tooltip for Chart
   ────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-xl border border-surface-700/30 shadow-xl">
        <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-base font-bold text-accent stat-number">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { walletCards, savingsHistory } = useWallet();

  // 1. Calculate stats based on wallet and savings history
  const totalSavings = savingsHistory.reduce((acc, curr) => acc + curr.savings, 0);
  const cashbackEarned = savingsHistory.reduce((acc, curr) => acc + (curr.amount * 0.02), 0);
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
    const categoryScore = Math.min(categoriesCovered.size * 15, 60);
    const cardCountScore = Math.min(walletCards.length * 10, 30);
    const premiumScore = walletCards.some(c => c.annualFee > 2000) ? 10 : 0;
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
  const stroke = 7;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', stroke: '#10b981', shadow: 'rgba(16,185,129,0.4)' };
    if (score >= 50) return { text: 'text-amber-400', stroke: '#f59e0b', shadow: 'rgba(245,158,11,0.4)' };
    return { text: 'text-rose-400', stroke: '#f43f5e', shadow: 'rgba(244,63,94,0.4)' };
  };

  const scoreColors = getScoreColor(healthScore);

  const statsCards = [
    {
      label: 'Total Savings',
      value: totalSavings || 5836.95,
      badge: '+14.2%',
      badgeVariant: 'success' as const,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      decimals: 2,
    },
    {
      label: 'Cashback Accrued',
      value: cashbackEarned || 1247.30,
      badge: 'This month',
      badgeVariant: 'info' as const,
      icon: Zap,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10',
      decimals: 2,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-surface-50">
            Your Financial Hub
          </h1>
          <p className="text-sm text-surface-500 font-medium">
            Maximize every transaction · Track optimized rewards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/advisor')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
            size="sm"
          >
            Ask AI Advisor
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/wallet')}
            icon={<Plus className="w-3.5 h-3.5" />}
            size="sm"
          >
            Manage Wallet
          </Button>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Health Score Ring Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Card className="flex items-center gap-5 h-full">
            {/* Ring */}
            <div className="relative w-24 h-24 shrink-0">
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
                  stroke={scoreColors.stroke}
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  style={{ filter: `drop-shadow(0 0 6px ${scoreColors.shadow})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black stat-number ${scoreColors.text}`}>{healthScore}</span>
                <span className="text-[9px] text-surface-600 font-bold uppercase tracking-widest mt-0.5">Score</span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <h3 className="text-sm font-bold text-surface-200 flex items-center gap-1.5">
                Benefit Health
                <HelpCircle className="w-3.5 h-3.5 text-surface-600 cursor-help shrink-0" />
              </h3>
              <p className="text-xs text-surface-500 leading-relaxed">
                {healthScore >= 80
                  ? 'Excellent! Max category cashback captured.'
                  : healthScore >= 50
                  ? 'Good coverage — add an online card to hit 80+.'
                  : 'Select your cards in Wallet to get your score.'}
              </p>
              <Badge variant={healthScore >= 80 ? 'success' : healthScore >= 50 ? 'warning' : 'danger'} size="sm" dot>
                {healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Total Savings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Card className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Total Savings</span>
                <div>
                  <h2 className="text-2xl font-black stat-number text-surface-50 leading-none">
                    <AnimatedNumber value={totalSavings || 5836.95} decimals={2} />
                  </h2>
                  <p className="text-[11px] text-surface-600 mt-1.5 font-medium">vs. generic debit card spending</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <Badge variant="success" size="sm">↑ 14.2%</Badge>
              </div>
            </div>
            <div className="mt-4 h-1 rounded-full bg-surface-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-surface-600 mt-1 font-medium">72% of annual goal reached</p>
          </Card>
        </motion.div>

        {/* Best Card This Month */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Card className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Best Card This Month</span>
              <Badge variant="accent" size="sm" dot>Top</Badge>
            </div>
            {bestCard ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-9 rounded-xl shadow-md shrink-0 flex items-center justify-center font-black text-[10px] text-white card-shine"
                    style={{ background: `linear-gradient(135deg, ${bestCard.gradient[0]}, ${bestCard.gradient[1]})` }}
                  >
                    {bestCard.bank}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-surface-100 truncate">{bestCard.name}</h4>
                    <p className="text-xs text-surface-500 font-mono mt-0.5">
                      Saved: <span className="text-accent font-bold">₹{maxSaved || 5000}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/compare')}
                  className="w-full text-xs text-surface-500 hover:text-accent flex items-center gap-1 transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  View full comparison
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-surface-500 font-medium">Add cards to see your top performer.</p>
                <Button size="sm" variant="outline" onClick={() => navigate('/wallet')} icon={<Plus className="w-3 h-3" />}>
                  Add Cards
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Chart + Stats Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Savings Trend Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="space-y-4 h-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-surface-200">Savings Trend</h3>
                <p className="text-xs text-surface-600 mt-0.5">Cashback + reward points monthly breakdown</p>
              </div>
              <Badge variant="accent" size="sm">6 Months</Badge>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Inter' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Inter' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1, strokeDasharray: '4 2' }} />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#060e1e', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Wallet Health Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <Card className="space-y-4 h-full">
            <h3 className="text-sm font-bold text-surface-200">Wallet Health Stats</h3>
            <div className="space-y-0.5">

              {[
                {
                  label: 'Total Cards Owned',
                  value: `${walletCards.length} Cards`,
                  color: 'text-surface-100',
                },
                {
                  label: 'Cashback Accrued',
                  value: `₹${cashbackEarned.toFixed(2)}`,
                  color: 'text-emerald-400',
                },
                {
                  label: 'Reward Points Earned',
                  value: `${rewardPoints} pts`,
                  color: 'text-indigo-400',
                },
                {
                  label: 'Lounge Visits Rem.',
                  value: '14 visits',
                  color: 'text-amber-400',
                },
                {
                  label: 'Waiver Target Met',
                  value: '2/4 cards',
                  color: 'text-emerald-400',
                  icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2.5 border-b border-surface-800/30 last:border-0"
                >
                  <span className="text-xs text-surface-500 font-medium">{item.label}</span>
                  <span className={`text-xs font-bold stat-number flex items-center gap-1 ${item.color}`}>
                    {item.icon}
                    {item.value}
                  </span>
                </div>
              ))}

            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Recent Savings Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-surface-200">Recent Savings Activities</h3>
              <p className="text-xs text-surface-600 mt-0.5">Every transaction logged and optimized using CardWise AI</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/advisor')}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Log a Purchase
            </Button>
          </div>

          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-surface-800/60">
                  <th className="py-2.5 px-5 text-[10px] text-surface-600 font-bold uppercase tracking-widest">Transaction</th>
                  <th className="py-2.5 px-4 text-[10px] text-surface-600 font-bold uppercase tracking-widest">Amount</th>
                  <th className="py-2.5 px-4 text-[10px] text-surface-600 font-bold uppercase tracking-widest">Card Used</th>
                  <th className="py-2.5 px-4 text-[10px] text-surface-600 font-bold uppercase tracking-widest text-right">Savings</th>
                  <th className="py-2.5 px-5 text-[10px] text-surface-600 font-bold uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody>
                {savingsHistory.map((tx) => {
                  const card = CREDIT_CARDS.find(c => c.id === tx.cardId);
                  return (
                    <tr key={tx.id} className="border-b border-surface-800/20 hover:bg-surface-800/20 transition-colors group">
                      <td className="py-3.5 px-5 text-sm font-semibold text-surface-200">{tx.description}</td>
                      <td className="py-3.5 px-4 text-sm font-mono font-medium text-surface-400">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        {card ? (
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="w-4 h-3 rounded-sm shadow-sm shrink-0"
                              style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                            />
                            <span className="text-xs font-medium text-surface-400 truncate max-w-[120px]">{card.name}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-surface-600">Unknown Card</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-sm font-bold stat-number text-emerald-400">+₹{tx.savings.toFixed(2)}</span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-surface-600 font-medium">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  );
                })}
                {savingsHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-800/60 border border-surface-700/40 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-surface-600" />
                        </div>
                        <p className="text-sm text-surface-500 font-medium">No transactions yet.</p>
                        <Button size="sm" variant="outline" onClick={() => navigate('/advisor')} icon={<Sparkles className="w-3.5 h-3.5" />}>
                          Try Purchase Advisor
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

    </div>
  );
};

export default Dashboard;
