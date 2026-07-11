import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CreditCard, Check, Search, ShieldCheck } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Button, Card, Input } from '../components/ui';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { allAvailableCards, walletCards, addCard, removeCard } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardToggle = async (cardId: string) => {
    if (walletCards.some(c => c.id === cardId)) {
      await removeCard(cardId);
    } else {
      await addCard(cardId);
    }
  };

  const filteredCards = allAvailableCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-light/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10 space-y-8">
        
        {/* Step Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Which cards do you own?</h1>
          <p className="text-slate-400 font-medium">
            Select the cards in your wallet. We do NOT ask for card numbers, CVVs, or OTPs. Ever.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 text-accent rounded-full px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> 100% Secure & Privacy-First
          </div>
        </div>

        {/* Card Search */}
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search by bank or card name... (e.g. SBI, HDFC)"
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Card Grid selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const isSelected = walletCards.some(c => c.id === card.id);
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardToggle(card.id)}
                className={`
                  p-5 rounded-2xl border cursor-pointer relative overflow-hidden flex flex-col justify-between aspect-[1.58/1] transition-all duration-300 select-none
                  ${isSelected
                    ? 'border-accent shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-slate-900'
                    : 'border-surface-800/80 hover:border-surface-700/60 bg-surface-900/40'
                  }
                `}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${card.gradient[0]}dd, ${card.gradient[1]}dd)` 
                    : undefined
                }}
              >
                {/* Selection Check Ring */}
                <div className={`
                  absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border transition-all
                  ${isSelected
                    ? 'bg-accent border-accent text-slate-950 font-bold'
                    : 'border-surface-700 bg-slate-950/40 text-transparent'
                  }
                `}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>

                {/* Card Bank & Network */}
                <div>
                  <span className="text-xs font-semibold opacity-75">{card.bank}</span>
                  <h3 className="text-base font-bold tracking-tight mt-0.5 leading-tight">{card.name}</h3>
                </div>

                {/* Benefits tag / annual fee waiver */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] bg-slate-950/50 px-2 py-0.5 rounded font-mono font-medium tracking-wider">
                    {card.network.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-300 font-semibold">
                    {card.annualFee === 0 ? 'LIFETIME FREE' : `₹${card.annualFee}/yr`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Button
            size="lg"
            className="w-full sm:w-64 font-bold"
            disabled={walletCards.length === 0}
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
          </Button>
          <span className="text-xs text-slate-500 font-medium">
            {walletCards.length} card(s) selected
          </span>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
