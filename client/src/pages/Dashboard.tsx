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
  Zap,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Activity,
  CreditCard as CardIcon
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, AnimatedNumber, Badge } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

/* ──────────────────────────────────────────────
   Custom Tooltip for Chart
   ────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4.5 py-3.5 rounded-xl border border-surface-700/30 shadow-[0_15px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-base font-extrabold text-accent stat-number">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', stroke: '#10b981', shadow: 'rgba(16,185,129,0.4)', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (score >= 50) return { text: 'text-amber-400', stroke: '#f59e0b', shadow: 'rgba(245,158,11,0.4)', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { text: 'text-rose-400', stroke: '#f43f5e', shadow: 'rgba(244,63,94,0.4)', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
  };

  const scoreColors = getScoreColor(healthScore);

  // Generate visual AI recommendations based on user's wallet
  const aiRecommendations = [];
  if (walletCards.length > 0) {
    const hasSbi = walletCards.some(c => c.id === 'sbi-cashback');
    const hasAce = walletCards.some(c => c.id === 'axis-ace');
    const hasAmazon = walletCards.some(c => c.id === 'icici-amazon-pay');
    const hasMillennia = walletCards.some(c => c.id === 'hdfc-millennia');
    const hasInfinia = walletCards.some(c => c.id === 'hdfc-infinia');

    if (hasSbi) {
      aiRecommendations.push({
        title: 'Online Shopping Booster',
        description: 'Swipe SBI Cashback to capture 5% unlimited returns on web orders.',
        badge: '5% Cashback',
        icon: Sparkles,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20'
      });
    }
    if (hasAce) {
      aiRecommendations.push({
        title: 'Food Delivery & Cabs',
        description: 'Swipe Axis ACE to receive 4% cashback on Swiggy and Zomato.',
        badge: '4% Cashback',
        icon: Zap,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20'
      });
    }
    if (hasAmazon) {
      aiRecommendations.push({
        title: 'Amazon Shopping Reward',
        description: 'ICICI Amazon Pay yields 5% flat cashback on Prime shopping purchases.',
        badge: '5% Cashback',
        icon: Wallet,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20'
      });
    }
    if (hasInfinia) {
      aiRecommendations.push({
        title: 'Super-Premium Travel',
        description: 'Use HDFC Infinia on SmartBuy for 10x reward points on flight bookings.',
        badge: '10x Rewards',
        icon: Award,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
      });
    }
    if (hasMillennia && !hasInfinia) {
      aiRecommendations.push({
        title: 'SmartBuy Travel Benefits',
        description: 'Book hotels via HDFC Millennia on SmartBuy to waive annual fee.',
        badge: '5% Multiplier',
        icon: Layers,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20'
      });
    }

    if (aiRecommendations.length < 2) {
      const topCard = walletCards[0];
      aiRecommendations.push({
        title: 'Maximize Everyday Transactions',
        description: `Use your ${topCard.name} for offline retail shops to waive fees.`,
        badge: `${topCard.cashbackRate.default}% Default`,
        icon: Sparkles,
        color: 'text-accent',
        bg: 'bg-accent/10',
        border: 'border-accent/20'
      });
    }
  } else {
    aiRecommendations.push({
      title: 'No Cards in Wallet',
      description: 'Go to Wallet and add cards to activate intelligent optimization triggers.',
      badge: 'Unlock Insights',
      icon: Sparkles,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20'
    });
  }

  // Get name of user for customized welcome
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'User';

  return (
    <div className="space-y-8 pb-8">

      {/* ── Welcome Banner / Premium Hero Section ── */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 border border-white/5 shadow-2xl glass-card">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow-green opacity-40 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] bg-accent/12 border border-accent/25 text-accent font-black px-2.5 py-0.75 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-accent" />
                AI Smart Optimizer Enabled
              </span>
              <span className="text-[10px] bg-surface-800/80 border border-surface-700/50 text-surface-400 font-bold px-2 py-0.5 rounded-full tracking-wide">
                v1.2.0
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hello, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="text-sm text-surface-400 max-w-xl font-medium leading-relaxed">
              Your credit card portfolio is optimized. Swiping cards strategically is saving you <span className="text-accent font-bold">14.2% more</span> cashback this quarter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => navigate('/advisor')}
              icon={<Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />}
              size="md"
              className="shadow-[0_4px_25px_rgba(16,185,129,0.35)]"
            >
              Ask AI Advisor
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/wallet')}
              icon={<Plus className="w-4 h-4" />}
              size="md"
            >
              Manage Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. Health Score Ring Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="perspective-1000"
        >
          <Card className="flex flex-col justify-between h-full border border-surface-800/40 shadow-xl relative overflow-hidden group hover:border-surface-700/40 transition-all duration-300">
            {/* Background texture grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h3 className="text-xs font-black text-surface-400 flex items-center gap-1.5 uppercase tracking-widest">
                  Benefit Health
                  <span title="Based on cashback categories unlocked by your cards">
                    <HelpCircle className="w-3.5 h-3.5 text-surface-500 cursor-help" />
                  </span>
                </h3>
                <p className="text-xs text-surface-400 leading-relaxed font-medium">
                  {healthScore >= 80
                    ? 'Excellent coverage! Max category cashback captured.'
                    : healthScore >= 50
                    ? 'Good coverage. Add an online card to reach 80+.'
                    : 'Select your credit cards to initialize evaluation.'}
                </p>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-surface-850 stroke-current"
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
                    style={{ filter: `drop-shadow(0 0 8px ${scoreColors.shadow})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-0.5">
                    <span className={`text-lg font-black stat-number leading-none ${scoreColors.text}`}>
                      {healthScore}
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${healthScore >= 50 ? 'bg-accent' : 'bg-rose-450'}`} />
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${healthScore >= 80 ? 'bg-emerald-400' : healthScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                    </span>
                  </div>
                  <span className="text-[7.5px] text-surface-500 font-bold uppercase tracking-wider mt-0.5">Score</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-surface-850/60">
              <Badge variant={healthScore >= 80 ? 'success' : healthScore >= 50 ? 'warning' : 'danger'} size="sm" dot>
                {healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Critical'}
              </Badge>
              <span className="text-[10px] text-surface-500 font-medium">Updated just now</span>
            </div>
          </Card>
        </motion.div>

        {/* 2. Total Savings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Card className="flex flex-col justify-between h-full border border-surface-800/40 shadow-xl relative overflow-hidden group hover:border-surface-700/40 transition-all duration-300">
            {/* Mesh Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-500/6 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <div className="absolute inset-0 bg-radial-glow-green opacity-20 pointer-events-none" />

            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <span className="text-[9px] text-surface-500 font-black uppercase tracking-widest">Total Savings</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-surface-400">₹</span>
                  <h2 className="text-3xl font-extrabold stat-number text-white tracking-tight leading-none">
                    <AnimatedNumber value={totalSavings || 5836.95} decimals={2} />
                  </h2>
                </div>
                <p className="text-[10px] text-surface-500 font-medium">vs. generic debit card spending</p>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                  <TrendingUp className="w-4.5 h-4.5 text-accent" />
                </div>
                <Badge variant="success" size="sm">↑ 14.2%</Badge>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-1.5 rounded-full bg-surface-850 overflow-hidden border border-surface-800/30 p-[1px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-300"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-surface-500 font-semibold">
                <span>72% of annual milestone reached</span>
                <span className="text-accent font-bold">₹10,000 Goal</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 3. Credit Card Widget - Best Card This Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="perspective-1000"
        >
          <Card className="flex flex-col justify-between h-full border border-surface-800/40 shadow-xl relative overflow-hidden group hover:border-surface-700/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-surface-500 font-black uppercase tracking-widest">Best Performer</span>
              <Badge variant="accent" size="sm" dot>Top Card</Badge>
            </div>

            {bestCard ? (
              <div className="mt-4 space-y-4">
                {/* 3D-styled mini credit card */}
                <div 
                  className="premium-card-3d relative w-full aspect-[1.586/1] rounded-2xl p-4 overflow-hidden flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-white/8 group/card cursor-pointer text-white premium-card-shine"
                  style={{ background: `linear-gradient(135deg, ${bestCard.gradient[0]}, ${bestCard.gradient[1]})` }}
                  onClick={() => navigate('/compare')}
                >
                  {/* Frosted shine reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none transition-transform duration-1000 group-hover/card:translate-x-full" />
                  
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest font-black opacity-60">Bank Wallet</span>
                      <span className="text-xs font-black tracking-wide mt-0.5">{bestCard.bank}</span>
                    </div>
                    {/* Simulated smart card emblem */}
                    <div className="w-7 h-5 rounded-md bg-gradient-to-r from-amber-400/80 via-yellow-100/90 to-amber-500/80 border border-amber-300/30 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 grid grid-cols-3 gap-[1px] p-[2px] opacity-20">
                        <div className="border border-slate-950/50 rounded-sm" />
                        <div className="border border-slate-950/50 rounded-sm" />
                        <div className="border border-slate-950/50 rounded-sm" />
                        <div className="border border-slate-950/50 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-2">
                    <p className="text-[10px] font-black tracking-wider drop-shadow-md truncate">{bestCard.name}</p>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-mono tracking-widest opacity-80">•••• •••• •••• 9240</span>
                      <span className="text-[8px] bg-white/12 px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">{bestCard.network}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="min-w-0">
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Cashback Accrued</p>
                    <p className="text-sm font-extrabold stat-number text-accent mt-0.5">₹{maxSaved || '5,000'}</p>
                  </div>
                  <button
                    onClick={() => navigate('/compare')}
                    className="text-[10px] text-surface-400 hover:text-accent font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer group"
                  >
                    Compare
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-surface-400 leading-relaxed font-medium">Add credit cards inside your secure wallet configuration to evaluate performance.</p>
                <Button size="sm" variant="outline" onClick={() => navigate('/wallet')} icon={<Plus className="w-3.5 h-3.5" />}>
                  Add Cards
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Chart + AI Recommendations Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Savings Trend Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <Card className="space-y-5 h-full border border-surface-800/40 shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  Savings Analytics
                </h3>
                <p className="text-xs text-surface-500 font-medium">Cashback + reward points monthly accumulation trend</p>
              </div>
              <Badge variant="accent" size="sm">6 Month View</Badge>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 6, left: -26, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="transparent"
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="transparent"
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.15)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#060e1e', strokeWidth: 2, filter: 'drop-shadow(0 0 6px #10b981)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* 2. AI Smart Recommendations & Health Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* AI Recommendation Section */}
          <Card className="border border-surface-800/40 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent shadow-[0_1px_10px_rgba(16,185,129,0.2)]" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-accent fill-accent animate-pulse" />
                  AI Optimization Feed
                </h3>
                <span className="text-[8px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Live Recommendations
                </span>
              </div>

              {/* Feed items */}
              <div className="space-y-3.5">
                {aiRecommendations.slice(0, 2).map((rec, index) => {
                  const RecIcon = rec.icon;
                  return (
                    <div 
                      key={index} 
                      className={`flex gap-3 p-3.5 rounded-2xl border ${rec.border} ${rec.bg} hover:brightness-110 transition-all duration-300`}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center border ${rec.border} shrink-0`}>
                        <RecIcon className={`w-4 h-4 ${rec.color}`} />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{rec.title}</h4>
                          <span className="text-[8px] text-surface-400 font-bold tracking-wide uppercase shrink-0 bg-slate-900/60 px-1.5 py-0.25 rounded border border-surface-850">{rec.badge}</span>
                        </div>
                        <p className="text-[10px] text-surface-400 leading-relaxed font-medium">{rec.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => navigate('/advisor')}
              className="w-full mt-4 flex items-center justify-between p-3 rounded-2xl border border-surface-850/60 bg-surface-900/10 hover:bg-surface-850/30 text-xs font-bold text-surface-300 hover:text-white transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <CardIcon className="w-4 h-4 text-accent" />
                Run Purchase Advisor Optimizer
              </span>
              <ArrowRight className="w-4 h-4 text-surface-550 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* ── Wallet Health Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38 }}
      >
        <Card className="border border-surface-800/40 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-center pb-4 border-b border-surface-850/60">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Wallet Health Analytics
              </h3>
              <p className="text-xs text-surface-500 font-medium">Real-time compilation of wallet reward coverage</p>
            </div>
            <Badge variant="neutral" size="sm">Portfolio Stats</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
            {[
              {
                label: 'Total Cards Owned',
                value: `${walletCards.length} Cards`,
                sub: 'Active in wallet',
                color: 'text-white'
              },
              {
                label: 'Cashback Accrued',
                value: `₹${cashbackEarned.toFixed(2)}`,
                sub: 'Current month',
                color: 'text-emerald-400'
              },
              {
                label: 'Reward Points',
                value: `${rewardPoints} pts`,
                sub: 'Value: ₹${(rewardPoints * 0.25).toFixed(0)}',
                color: 'text-indigo-400'
              },
              {
                label: 'Lounge Visits Rem.',
                value: '14 visits',
                sub: 'Domestic + Intl',
                color: 'text-amber-450'
              },
              {
                label: 'Waiver Milestone Met',
                value: '2/4 cards',
                sub: 'Waivers active',
                color: 'text-accent',
                icon: <CheckCircle className="w-3.5 h-3.5 text-accent" />
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-surface-900/20 p-4 rounded-2xl border border-surface-850/45 hover:border-surface-800/60 transition-all duration-300 group/stat flex flex-col justify-between"
              >
                <span className="text-[9px] text-surface-500 font-black uppercase tracking-widest">{item.label}</span>
                <div className="space-y-1.5 mt-3">
                  <h4 className={`text-base font-extrabold stat-number leading-none flex items-center gap-1.5 ${item.color}`}>
                    {item.icon}
                    {item.value}
                  </h4>
                  <p className="text-[9px] text-surface-600 font-semibold">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Recent Savings Activities ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card className="space-y-5 border border-surface-800/40 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-center pb-4 border-b border-surface-850/60">
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent animate-pulse" />
                Recent Optimized Transactions
              </h3>
              <p className="text-xs text-surface-500 font-medium">Verified optimization activities recorded via CardWise AI integration</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/advisor')}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-accent"
            >
              Log Transaction
            </Button>
          </div>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-surface-850/50">
                  <th className="pb-3 text-[9px] text-surface-500 font-black uppercase tracking-widest">Transaction Description</th>
                  <th className="pb-3 text-[9px] text-surface-500 font-black uppercase tracking-widest">Spent Amount</th>
                  <th className="pb-3 text-[9px] text-surface-500 font-black uppercase tracking-widest">Optimized Card</th>
                  <th className="pb-3 text-[9px] text-surface-500 font-black uppercase tracking-widest text-right">Savings Yield</th>
                  <th className="pb-3 text-[9px] text-surface-500 font-black uppercase tracking-widest text-right">Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {savingsHistory.map((tx) => {
                  const card = CREDIT_CARDS.find(c => c.id === tx.cardId);
                  
                  // Extract customized merchant logos or brand colors
                  const descLower = tx.description.toLowerCase();
                  let merchantBadge = 'bg-surface-850 border border-surface-800 text-surface-300';
                  if (descLower.includes('amazon')) merchantBadge = 'bg-amber-950/20 border border-amber-500/20 text-amber-400';
                  else if (descLower.includes('swiggy')) merchantBadge = 'bg-orange-950/20 border border-orange-500/20 text-orange-400';
                  else if (descLower.includes('zomato')) merchantBadge = 'bg-rose-950/20 border border-rose-500/20 text-rose-450';
                  else if (descLower.includes('uber')) merchantBadge = 'bg-slate-900 border border-slate-700 text-slate-100';
                  else if (descLower.includes('apple') || descLower.includes('iphone')) merchantBadge = 'bg-indigo-950/20 border border-indigo-500/20 text-indigo-400';

                  return (
                    <tr key={tx.id} className="border-b border-surface-850/25 hover:bg-surface-900/10 transition-colors group">
                      <td className="py-4 text-xs font-bold text-white flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[9px] rounded-md font-black uppercase tracking-wide ${merchantBadge}`}>
                          {descLower.includes('amazon') ? 'AMZN' : descLower.includes('swiggy') ? 'SWGY' : descLower.includes('zomato') ? 'ZTOM' : descLower.includes('uber') ? 'UBER' : descLower.includes('apple') || descLower.includes('iphone') ? 'APPL' : 'RET'}
                        </span>
                        {tx.description}
                      </td>
                      <td className="py-4 text-xs font-mono font-bold text-surface-300 stat-number">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4">
                        {card ? (
                          <span className="inline-flex items-center gap-2.5">
                            <span
                              className="w-5 h-3.5 rounded-sm shadow border border-white/10 shrink-0"
                              style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                            />
                            <span className="text-xs font-semibold text-surface-300 truncate max-w-[140px]">{card.name}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-surface-500">Unregistered Card</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs font-bold stat-number text-accent">+₹{tx.savings.toFixed(2)}</span>
                      </td>
                      <td className="py-4 text-right text-[10px] text-surface-500 font-semibold">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
                {savingsHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-surface-900/60 border border-surface-850/50 flex items-center justify-center shadow-inner">
                          <Wallet className="w-6 h-6 text-surface-600" />
                        </div>
                        <p className="text-xs text-surface-450 font-bold uppercase tracking-wider">No savings activities recorded</p>
                        <Button size="sm" variant="outline" onClick={() => navigate('/advisor')} icon={<Sparkles className="w-3.5 h-3.5" />}>
                          Purchase Advisor
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

