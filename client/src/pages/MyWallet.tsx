import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Sparkles,
  Plane,
  X,
  CreditCard as CardIcon,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CREDIT_CARDS } from '../data/cards';
import { Card, Button, Modal, Input, Badge } from '../components/ui';

export const MyWallet: React.FC = () => {
  const { walletCards, addCard, removeCard } = useWallet();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find remaining cards not in wallet
  const availableCardsToAdd = CREDIT_CARDS.filter(
    card => !walletCards.some(wc => wc.id === card.id)
  );

  const filteredAvailableCards = availableCardsToAdd.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCardForDetails = (card: any) => {
    setSelectedCard(card);
  };

  const handleAddCard = async (cardId: string) => {
    await addCard(cardId);
    setSearchQuery('');
  };

  const handleRemoveCard = async (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
    await removeCard(cardId);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-surface-50">AI Wallet Manager</h1>
          <p className="text-sm text-surface-500 font-medium mt-0.5">Add or remove cards to calibrate the AI recommendation model.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          icon={<Plus className="w-4.5 h-4.5" />}
          className="font-bold shrink-0"
        >
          Add Credit Card
        </Button>
      </div>

      {/* Main Grid: Card Grid on left, Selected Card details panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Grid list of cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {walletCards.map((card) => {
              const isCurrentlySelected = selectedCard?.id === card.id;
              return (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCardForDetails(card)}
                  className={`
                    p-6 rounded-2xl border cursor-pointer relative overflow-hidden flex flex-col justify-between aspect-[1.58/1] transition-all duration-300 shadow-md card-shine
                    ${isCurrentlySelected 
                      ? 'border-accent shadow-[0_0_24px_rgba(16,185,129,0.35)] scale-[1.01]' 
                      : 'border-surface-800 hover:border-surface-700/60'
                    }
                  `}
                  style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold opacity-80 tracking-widest text-white/95">{card.bank}</span>
                      <h3 className="text-lg font-black tracking-tight mt-1 leading-tight text-white">{card.name}</h3>
                    </div>
                    <button
                      onClick={(e) => handleRemoveCard(e, card.id)}
                      className="p-1.5 bg-slate-950/40 hover:bg-danger/25 text-white/70 hover:text-danger border border-transparent hover:border-danger/20 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Remove card from wallet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-[10px] bg-slate-950/40 px-2 py-0.5 rounded font-mono font-bold tracking-widest text-white/80">
                      {card.network.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-white/95 uppercase tracking-wide">
                      {card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/yr`}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {walletCards.length === 0 && (
              <div 
                onClick={() => setIsAddModalOpen(true)}
                className="col-span-full border-2 border-dashed border-surface-800 hover:border-surface-700/60 p-12 rounded-2xl flex flex-col items-center justify-center gap-3.5 cursor-pointer group transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-900 border border-surface-800/80 flex items-center justify-center text-surface-500 group-hover:text-accent group-hover:border-accent/40 transition-all">
                  <CardIcon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-surface-200">Your Wallet is Empty</h4>
                <p className="text-xs text-surface-500 max-w-xs text-center font-medium leading-relaxed">
                  Add credit cards to enable the AI Purchase Advisor to find the best savings.
                </p>
                <Button size="sm" variant="outline" className="mt-1">Add a Card</Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Card Detail Panel (1/3 width) */}
        <div className="lg:h-fit sticky top-24">
          <AnimatePresence mode="wait">
            {selectedCard ? (
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="p-6 border border-surface-800/60 space-y-6 relative overflow-hidden glass-card">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{selectedCard.bank} details</span>
                      <h3 className="text-base font-bold text-surface-50 mt-1 leading-tight">{selectedCard.name}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedCard(null)} 
                      className="p-1 hover:bg-surface-800/60 text-surface-500 hover:text-surface-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Features & Highlights</span>
                    <ul className="space-y-2.5">
                      {selectedCard.highlights.map((h: string, idx: number) => (
                        <li key={idx} className="text-xs text-surface-300 flex items-start gap-2 font-medium leading-relaxed">
                          <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fee and Waiver Rules */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-800/40">
                    <div className="space-y-1">
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Annual Fee</span>
                      <p className="text-sm font-bold text-surface-150 stat-number">
                        {selectedCard.annualFee === 0 ? 'N/A' : `₹${selectedCard.annualFee.toLocaleString('en-IN')}`}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Waiver Target</span>
                      <p className="text-xs font-semibold text-surface-300 leading-relaxed">
                        {selectedCard.feeWaiverCriteria}
                      </p>
                    </div>
                  </div>

                  {/* Lounge Access Info */}
                  <div className="pt-4 border-t border-surface-800/40 space-y-2.5">
                    <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest block">Lounge Access Rules</span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs text-surface-300 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0">
                          <Plane className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span>Domestic: <span className="font-bold text-surface-100">{selectedCard.loungeAccess.domestic === -1 ? 'Unlimited' : selectedCard.loungeAccess.domestic}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-300 font-medium">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shrink-0">
                          <Plane className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span>Intl: <span className="font-bold text-surface-100">{selectedCard.loungeAccess.international === -1 ? 'Unlimited' : selectedCard.loungeAccess.international}</span></span>
                      </div>
                    </div>
                  </div>

                </Card>
              </motion.div>
            ) : (
              <Card className="p-8 text-center border border-dashed border-surface-800/60 text-surface-500 flex flex-col items-center justify-center gap-3 glass-card">
                <div className="w-10 h-10 rounded-xl bg-surface-900 border border-surface-800/60 flex items-center justify-center text-surface-500">
                  <AlertCircle className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-surface-450 uppercase tracking-widest">No Card Selected</h4>
                <p className="text-xs text-surface-500 max-w-[220px] leading-relaxed font-medium">
                  Click any card to inspect category bonuses, annual fees, and airport lounge rules.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Add Card Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add Credit Card to Wallet"
      >
        <div className="space-y-4">
          <Input 
            placeholder="Search cards by bank or name..."
            icon={<Search className="w-4 h-4 text-surface-550" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {filteredAvailableCards.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center justify-between p-3.5 border border-surface-850 bg-surface-900/35 hover:bg-surface-850/40 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-7 rounded flex items-center justify-center font-black text-[8px] text-white shrink-0 shadow-sm card-shine"
                    style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                  >
                    {card.bank}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-surface-150 leading-tight">{card.name}</h5>
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mt-0.5">{card.network.toUpperCase()} • {card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/yr`}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleAddCard(card.id)}
                  size="sm"
                  className="font-bold text-xs"
                >
                  Add
                </Button>
              </div>
            ))}

            {filteredAvailableCards.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-surface-550 font-bold uppercase tracking-wider">All available cards are in your wallet!</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyWallet;
