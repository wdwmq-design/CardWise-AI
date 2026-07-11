import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-light/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">CardWise</span>
          <span className="text-[10px] bg-accent/15 border border-accent/20 text-accent font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
          <Button onClick={() => navigate('/signup')}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 md:py-20 z-10">
        
        {/* Left: Headline & Description */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 text-accent rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Card Optimizer
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Maximize your cashback.<br />
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Swipe smarter.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              CardWise AI tells you which card to swipe, before you swipe it — and shows you exactly how much money that decision just saved you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/signup')} icon={<ChevronRight className="w-5 h-5" />}>
              Create Free Account
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={handleDemoStart}>
              Try Instant Demo (No Auth Required)
            </Button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 text-center lg:text-left"
          >
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-100 font-mono">₹45k+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Avg. Yearly Savings</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-100 font-mono">&lt;2s</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Recommendation Speed</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-100 font-mono">100%</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Secure & Privacy-First</div>
            </div>
          </motion.div>
        </div>

        {/* Right: Premium Interactive Visual */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center"
          >
            {/* Card visual 1 */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [-6, -4, -6]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[80%] aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-700/50 p-5 shadow-2xl flex flex-col justify-between z-0 -translate-x-6 -translate-y-12 rotate-[-6deg] backdrop-blur-md opacity-80"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-300">HDFC Millennia</h3>
                  <p className="text-[10px] text-indigo-400">Cashback Card</p>
                </div>
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-slate-400 text-xs">HDFC</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-slate-500">•••• 8821</span>
                <span className="text-xs font-semibold text-accent font-mono">5% Shop Spends</span>
              </div>
            </motion.div>

            {/* Card visual 2 (Main active card) */}
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                rotate: [3, 5, 3]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-[85%] aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/20 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.15)] flex flex-col justify-between z-10 rotate-[3deg] card-shine"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-100">SBI Cashback</h3>
                  <p className="text-xs text-emerald-400 font-semibold">5% Unlimited Cashback</p>
                </div>
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm">SBI</div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-mono text-slate-400">•••• 5490</span>
                <span className="text-sm font-extrabold text-white font-mono">Winner 🔥</span>
              </div>
            </motion.div>

            {/* Simulated UI Card Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-4 left-4 right-4 glass border border-slate-700/50 rounded-2xl p-4 shadow-2xl z-20 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">Purchase Advisor Recommendation</span>
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-bold">1.8s Response</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-extrabold text-[10px] text-emerald-400">SBI</div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Swipe SBI Cashback Card</h4>
                  <p className="text-[10px] text-slate-400">Savings: <span className="text-accent font-bold">₹4,000</span> (5% online bonus)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </main>

      {/* Feature Section Grid */}
      <section className="bg-slate-950 border-t border-slate-900 py-16 md:py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Maximizing Benefits, AI Style</h2>
            <p className="text-slate-400">Why let thousands of rupees in credit card rewards expire or go unused? Let AI optimize your cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">AI Purchase Advisor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe a purchase in natural language (e.g. "buying an ₹80k iPhone on Flipkart") and get a comparison & recommendation in under 2 seconds.
              </p>
            </Card>

            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Benefit Health Score</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                See your overall optimization level with a score from 0–100. Get actionable tips to increase your score and capture every rupee of value.
              </p>
            </Card>

            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Contextual AI Chatbot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask follow-up questions grounded directly in your wallet cards (e.g., "Why did you recommend Millennia over Regalia for this?").
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/50 py-8 px-6 text-center text-xs text-slate-500 z-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CardWise AI. Built for TechForge Ideathon. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
