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
  CreditCard as CardIcon
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">AI Wallet Manager</h1>
          <p className="text-surface-400 font-medium">Add or remove cards to calibrate the AI recommendation model.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          icon={<Plus className="w-5 h-5" />}
          className="font-bold shadow-glow shadow-accent/15"
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
                      ? 'border-accent shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                      : 'border-surface-800 hover:border-surface-700'
                    }
                  `}
                  style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold opacity-75 tracking-wider">{card.bank}</span>
                      <h3 className="text-lg font-bold tracking-tight mt-0.5 leading-tight">{card.name}</h3>
                    </div>
                    <button
                      onClick={(e) => handleRemoveCard(e, card.id)}
                      className="p-1.5 bg-slate-950/40 hover:bg-danger/25 text-surface-400 hover:text-danger border border-transparent hover:border-danger/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove card from wallet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-[10px] bg-slate-950/40 px-2 py-0.5 rounded font-mono font-bold tracking-widest text-slate-350">
                      {card.network.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/yr`}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {walletCards.length === 0 && (
              <div 
                onClick={() => setIsAddModalOpen(true)}
                className="col-span-full border-2 border-dashed border-surface-800 hover:border-surface-750/70 p-12 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer group transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-900 border border-surface-800/80 flex items-center justify-center text-surface-500 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                  <CardIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-surface-300">Your Wallet is Empty</h4>
                <p className="text-xs text-surface-550 max-w-xs text-center font-medium leading-normal">
                  Add credit cards to enable the AI Purchase Advisor to find the best savings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Card Detail Panel (1/3 width) */}
        <div>
          <AnimatePresence mode="wait">
            {selectedCard ? (
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 25 }}
              >
                <Card className="p-6 border border-surface-800 space-y-6 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{selectedCard.bank} details</span>
                      <h3 className="text-lg font-bold text-surface-100">{selectedCard.name}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedCard(null)} 
                      className="p-1 hover:bg-surface-800 text-surface-550 hover:text-surface-200 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Features & Highlights</span>
                    <ul className="space-y-2">
                      {selectedCard.highlights.map((h: string, idx: number) => (
                        <li key={idx} className="text-xs text-surface-300 flex items-start gap-2 font-medium leading-relaxed">
                          <span className="text-accent mt-1 select-none font-bold">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fee and Waiver Rules */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-850/50">
                    <div>
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Annual Fee</span>
                      <p className="text-sm font-bold text-surface-200 mt-0.5">
                        {selectedCard.annualFee === 0 ? 'N/A' : `₹${selectedCard.annualFee}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Waiver Target</span>
                      <p className="text-xs font-bold text-surface-300 mt-0.5 leading-relaxed">
                        {selectedCard.feeWaiverCriteria}
                      </p>
                    </div>
                  </div>

                  {/* Lounge Access Info */}
                  <div className="pt-4 border-t border-surface-850/50 space-y-2">
                    <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Lounge Access Rules</span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-surface-350 font-medium">
                        <Plane className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Domestic: <span className="font-bold text-surface-200">{selectedCard.loungeAccess.domestic === -1 ? 'Unlimited' : selectedCard.loungeAccess.domestic}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-surface-350 font-medium">
                        <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Intl: <span className="font-bold text-surface-200">{selectedCard.loungeAccess.international === -1 ? 'Unlimited' : selectedCard.loungeAccess.international}</span></span>
                      </div>
                    </div>
                  </div>

                </Card>
              </motion.div>
            ) : (
              <Card className="p-8 text-center border border-dashed border-surface-800 text-surface-550 flex flex-col items-center justify-center gap-2">
                <CardIcon className="w-8 h-8 opacity-40 text-surface-500" />
                <h4 className="text-xs font-bold text-surface-450 uppercase tracking-wide">No Card Selected</h4>
                <p className="text-xs text-surface-550 max-w-[200px] leading-normal font-medium">
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
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2 max-y-[45vh] overflow-y-auto pr-1">
            {filteredAvailableCards.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center justify-between p-3 border border-surface-850 bg-surface-900/35 hover:bg-surface-850/30 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-7 rounded flex items-center justify-center font-black text-[8px] text-white shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})` }}
                  >
                    {card.bank}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-surface-250 leading-tight">{card.name}</h5>
                    <p className="text-[10px] text-surface-500 font-semibold mt-0.5">{card.network.toUpperCase()} • {card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/yr`}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleAddCard(card.id)}
                  size="sm"
                  variant="primary"
                  className="font-semibold text-xs py-1.5"
                >
                  Add Card
                </Button>
              </div>
            ))}

            {filteredAvailableCards.length === 0 && (
              <p className="text-center text-xs text-surface-550 font-bold py-6">All available cards are in your wallet!</p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyWallet;
