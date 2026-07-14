import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex gap-3 items-start"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-surface-800/80 border border-surface-700/50 flex items-center justify-center text-surface-300 shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-500 px-1">
          CardWise AI
        </span>
        <div className="chat-bubble-ai rounded-tl-none px-4 py-3.5 flex items-center gap-1.5">
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              className="typing-dot"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
