import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, ShieldAlert, CreditCard, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleDemoStart = () => {
    loginAsDemo();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen text-surface-100 flex flex-col relative overflow-x-hidden" style={{ background: '#060e1e' }}>
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-light/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-indigo-500/3 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between z-10 border-b border-surface-850/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-4.5 h-4.5 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-surface-50">CardWise</span>
            <span className="text-[9px] bg-accent/15 border border-accent/25 text-accent font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">AI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          <Button size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 py-12 md:py-20 z-10">
        
        {/* Left: Headline & Description */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/25 text-accent rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Next-Gen AI Card Optimizer
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-surface-50">
              Maximize your cashback.<br />
              <span className="gradient-text">Swipe smarter.</span>
            </h1>
            <p className="text-base md:text-lg text-surface-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              CardWise AI tells you which card to swipe, before you swipe it — and shows you exactly how much money that decision just saved you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
          >
            <Button size="lg" className="w-full sm:w-auto font-bold" onClick={() => navigate('/signup')} icon={<ChevronRight className="w-4 h-4" />}>
              Create Free Account
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold" onClick={handleDemoStart}>
              Try Instant Demo (No Auth)
            </Button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-surface-850/40 text-center lg:text-left"
          >
            <div>
              <div className="text-xl md:text-2xl font-black text-surface-100 stat-number">₹45k+</div>
              <div className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-1">Avg. Yearly Savings</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-surface-100 stat-number">&lt;2s</div>
              <div className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-1">Response Speed</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-surface-100 stat-number">100%</div>
              <div className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-1">Secure & Privacy</div>
            </div>
          </motion.div>
        </div>

        {/* Right: Premium Interactive Visual */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center"
          >
            {/* Card visual 1 */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [-6, -4, -6]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[80%] aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-700/30 p-5 shadow-2xl flex flex-col justify-between z-0 -translate-x-6 -translate-y-12 rotate-[-6deg] opacity-75 card-shine"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-white/90">HDFC Millennia</h3>
                  <p className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider">Cashback Card</p>
                </div>
                <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/70 text-[9px]">HDFC</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono text-slate-500 tracking-widest">•••• 8821</span>
                <span className="text-[10px] font-bold text-accent font-mono">5% Shop Spends</span>
              </div>
            </motion.div>

            {/* Card visual 2 (Main active card) */}
            <motion.div
              animate={{ 
                y: [0, 6, 0],
                rotate: [3, 5, 3]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-[85%] aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-5.5 shadow-[0_20px_50px_rgba(16,185,129,0.22)] flex flex-col justify-between z-10 rotate-[3deg] card-shine"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-extrabold text-white">SBI Cashback</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">5% Unlimited Cashback</p>
                </div>
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-xs">SBI</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-white/60 tracking-widest">•••• 5490</span>
                <span className="text-[11px] font-black text-white bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">Winner 🔥</span>
              </div>
            </motion.div>

            {/* Simulated UI Card Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-4 left-4 right-4 glass-card border border-surface-700/30 rounded-2xl p-4.5 shadow-2xl z-20 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">AI Recommendation</span>
                <span className="text-[9px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full font-bold">1.8s Response</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-black text-[9px] text-emerald-400">SBI</div>
                <div>
                  <h4 className="text-xs font-bold text-surface-200">Swipe SBI Cashback Card</h4>
                  <p className="text-[10px] text-surface-400 font-medium">Savings: <span className="text-accent font-bold">₹4,000</span> (5% online bonus)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </main>

      {/* Feature Section Grid */}
      <section className="border-t border-surface-850/40 py-16 md:py-24 px-6 z-10" style={{ background: 'rgba(9, 18, 38, 0.4)' }}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-surface-50">Maximizing Benefits, AI Style</h2>
            <p className="text-sm md:text-base text-surface-400 font-medium leading-relaxed">
              Why let thousands of rupees in credit card rewards expire or go unused? Let AI optimize your cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="space-y-4 p-6 glass-card">
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-100">AI Purchase Advisor</h3>
              <p className="text-xs md:text-sm text-surface-400 leading-relaxed font-medium">
                Describe a purchase in natural language (e.g. "buying an ₹80k iPhone on Flipkart") and get a comparison & recommendation in under 2 seconds.
              </p>
            </Card>

            <Card hover className="space-y-4 p-6 glass-card">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-100">Benefit Health Score</h3>
              <p className="text-xs md:text-sm text-surface-400 leading-relaxed font-medium">
                See your overall optimization level with a score from 0–100. Get actionable tips to increase your score and capture every rupee of value.
              </p>
            </Card>

            <Card hover className="space-y-4 p-6 glass-card">
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-100">Contextual AI Chatbot</h3>
              <p className="text-xs md:text-sm text-surface-400 leading-relaxed font-medium">
                Ask follow-up questions grounded directly in your wallet cards (e.g., "Why did you recommend Millennia over Regalia for this?").
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-850/30 py-8 px-6 text-center text-[11px] text-surface-500 z-10 mt-auto" style={{ background: '#060e1e' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© 2026 CardWise AI. Built for TechForge Ideathon. All Rights Reserved.</p>
          <div className="flex gap-4 font-semibold uppercase tracking-wider text-[10px]">
            <a href="#" className="hover:text-surface-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-surface-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
