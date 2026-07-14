import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Gift,
  ArrowLeftRight,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { AnimatedNumber } from '../ui';

interface Alternative {
  cardName: string;
  bank: string;
  gradient: [string, string];
  totalBenefit: number;
  tradeoff: string;
}

interface RecommendationCardProps {
  bestCardName: string;
  bestCardBank: string;
  gradient: [string, string];
  cashback: number;
  rewardPoints: number;
  rewardValue: number;
  totalSavings: number;
  reasoning: string;
  alternatives: Alternative[];
  preference: string;
  onLogPurchase: () => void;
  onAskFollowUp: () => void;
  onStartOver: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  bestCardName,
  bestCardBank,
  gradient,
  cashback,
  rewardPoints,
  rewardValue,
  totalSavings,
  reasoning,
  alternatives,
  preference,
  onLogPurchase,
  onAskFollowUp,
  onStartOver,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-3"
    >
      {/* Winner Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-900/90 to-surface-950/90 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] glow-border">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Radial background glow */}
        <div className="absolute inset-0 pointer-events-none radial-glow-green opacity-60" />

        <div className="relative p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Card chip visual */}
              <div
                className="w-14 h-9 rounded-xl flex items-center justify-center font-black text-[9px] text-white card-shine shadow-md shrink-0"
                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
              >
                {bestCardBank}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Best Card for You
                </p>
                <h3 className="text-sm font-extrabold text-white leading-tight">{bestCardName}</h3>
                <p className="text-[10px] text-surface-400 font-medium">{bestCardBank} Bank</p>
              </div>
            </div>

            {/* Total savings */}
            <div className="text-right shrink-0">
              <div className="text-xl font-black text-accent stat-number">
                ₹<AnimatedNumber value={totalSavings} decimals={2} />
              </div>
              <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">
                Total Benefit
              </p>
            </div>
          </div>

          {/* Savings breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Cashback', value: `₹${cashback.toFixed(2)}`, icon: <CreditCard className="w-3 h-3" />, color: 'text-emerald-400' },
              { label: 'Reward Pts', value: `${rewardPoints} pts`, icon: <Gift className="w-3 h-3" />, color: 'text-indigo-400' },
              { label: 'Pts Value', value: `₹${rewardValue.toFixed(2)}`, icon: <TrendingUp className="w-3 h-3" />, color: 'text-violet-400' },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-surface-900/50 border border-surface-800/60"
              >
                <span className={`${color} opacity-80`}>{icon}</span>
                <span className="text-[9px] text-surface-500 font-bold uppercase tracking-wider">{label}</span>
                <span className={`text-xs font-black stat-number ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          <div className="p-3 rounded-xl bg-surface-900/40 border border-surface-800/50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest text-surface-400">
                Why this card?
              </span>
            </div>
            <p className="text-xs text-surface-200 leading-relaxed">{reasoning}</p>
          </div>

          {/* Preference tag */}
          {preference && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-surface-500 font-bold uppercase tracking-widest">Your preference:</span>
              <span className="text-[9px] bg-accent/10 border border-accent/25 text-accent font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {preference}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="rounded-2xl border border-surface-800/60 bg-surface-900/40 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-800/40 flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-surface-500 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-surface-400">
              Better Alternatives
            </span>
          </div>
          <div className="divide-y divide-surface-800/30">
            {alternatives.map((alt, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-800/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-7 rounded-lg flex items-center justify-center font-black text-[8px] text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${alt.gradient[0]}, ${alt.gradient[1]})` }}
                  >
                    {alt.bank}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-200 leading-tight">{alt.cardName}</p>
                    <p className="text-[10px] text-surface-500 font-medium mt-0.5">{alt.tradeoff}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black stat-number text-surface-300">₹{alt.totalBenefit.toFixed(2)}</p>
                  <p className="text-[9px] text-surface-600 uppercase font-bold">benefit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pl-0">
        <button
          onClick={onLogPurchase}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl
                     bg-gradient-to-r from-accent to-accent-light text-slate-950 font-bold text-xs
                     hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:brightness-110
                     border border-accent-light/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Log Purchase
        </button>
        <button
          onClick={onAskFollowUp}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl
                     bg-surface-800/60 hover:bg-surface-700/60 text-surface-200 font-bold text-xs
                     border border-surface-700/60 hover:border-surface-600/60
                     transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Ask Follow-up
        </button>
        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl
                     bg-transparent hover:bg-surface-800/40 text-surface-400 hover:text-white font-bold text-xs
                     border border-surface-800/60 hover:border-surface-700
                     transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
