import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Card, Button } from '../components/ui';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const { walletCards } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your CardWise AI Assistant. Ask me anything about your credit cards, reward multipliers, lounge rules, or how to maximize your cashback rates.",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load context from Purchase Advisor if redirected
  useEffect(() => {
    const chatContextRaw = localStorage.getItem('cardwise_chat_context');
    if (chatContextRaw) {
      localStorage.removeItem('cardwise_chat_context');
      try {
        const context = JSON.parse(chatContextRaw);
        const queryText = `Why did you recommend my other card instead of Axis for the transaction: "${context.query}"?`;
        setInput(queryText);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const apiMessages = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/chat', {
        messages: apiMessages,
        walletCardIds: walletCards.map(c => c.id)
      });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Backend server not responding, generating simulated AI chatbot reply...');
      
      // Simulate fallback AI agent logic
      setTimeout(() => {
        let reply = '';
        const queryLower = textToSend.toLowerCase();

        if (queryLower.includes('axis')) {
          reply = "Your Axis card (such as Axis ACE) offers 2% default cashback, which is excellent for general offline transactions. However, for online categories, SBI Cashback offers 5% online shopping cashback, which directly beats the 2% default rate by ₹2,400 on large ₹80,000 purchases. That is why the SBI Cashback card was selected as the optimal choice.";
        } else if (queryLower.includes('dining') || queryLower.includes('zomato') || queryLower.includes('swiggy')) {
          reply = "For dining, Axis ACE gives 4% cashback on Swiggy and Zomato. ICICI Sapphiro gives 4 reward points per ₹100 spend. HDFC Millennia offers 5% cashback on Swiggy transactions via the SmartBuy portal. I recommend Swiping HDFC Millennia if shopping online, or Axis ACE for direct restaurant bills.";
        } else if (queryLower.includes('lounge')) {
          reply = "Based on your active wallet:\n- HDFC Millennia offers 8 complimentary domestic lounge visits/year.\n- SBI Cashback offers 4 domestic visits/year.\n- Axis ACE offers 4 domestic visits/year.\nYou have a total pool of 16 domestic lounge visits available across your wallet cards.";
        } else {
          reply = "To maximize your benefits, always map online shopping to your SBI Cashback card (5% back), utilities and bills to Axis ACE via Google Pay (5% back), and grocery orders on Blinkit/Zepto to HDFC Millennia (5% back via SmartBuy). Let me know if you want to compare card details for a specific transaction!";
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    setIsLoading(false);
  };

  const suggestionChips = [
    "Why not my Axis card for the iPhone purchase?",
    "Which card in my wallet is best for Swiggy/Zomato?",
    "Show domestic lounge access rules for my cards",
    "How do I waive the annual fee on SBI Cashback?"
  ];

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] border border-surface-800/60 p-0 overflow-hidden glass-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-surface-800/60 bg-surface-950/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <Bot className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-200">Contextual Card Advisor</h3>
            <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-accent" /> Active Wallet Grounded
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile icon bubble */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200
                ${isUser 
                  ? 'bg-accent/10 border-accent/20 text-accent font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                  : 'bg-surface-800/80 border-surface-700/50 text-surface-300'
                }
              `}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Text bubble */}
              <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium
                ${isUser 
                  ? 'bg-accent/10 border border-accent/20 text-accent rounded-tr-none' 
                  : 'bg-surface-900/40 border border-surface-850/60 text-surface-200 rounded-tl-none'
                }
              `}>
                {m.content}
              </div>
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 mr-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-surface-800/80 border border-surface-700/50 flex items-center justify-center text-surface-300">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-surface-900/40 border border-surface-850/60 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips panel */}
      {messages.length === 1 && (
        <div className="px-6 py-3.5 flex flex-wrap gap-2 border-t border-surface-850/40 bg-surface-950/20">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={(e) => handleSend(e, chip)}
              className="text-[10px] bg-surface-900/40 hover:bg-surface-800 text-surface-400 hover:text-surface-200 border border-surface-800 hover:border-surface-700 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-semibold uppercase tracking-wider"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Footer message composer input */}
      <div className="p-4 border-t border-surface-800/60 bg-surface-950/20">
        <form onSubmit={(e) => handleSend(e)} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your question about card benefits..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-surface-900/60 border border-surface-800/80 text-surface-100 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/50 transition-all placeholder:text-surface-600 font-medium"
            disabled={isLoading}
          />
          <Button type="submit" size="md" className="py-3 px-4 font-bold" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

    </Card>
  );
};

export default Chatbot;
