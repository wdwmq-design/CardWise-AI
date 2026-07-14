import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, User, Copy, Check } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isSpecial?: boolean; // For recommendation cards embedded as messages
  children?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  timestamp,
  isSpecial = false,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format text: bold **word**, line breaks
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-bold text-white">
                {part}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={isUser ? { opacity: 0, x: 20 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5
          ${isUser
            ? 'bg-accent/15 border-accent/30 text-accent shadow-[0_0_12px_rgba(16,185,129,0.18)]'
            : 'bg-surface-800/80 border-surface-700/50 text-surface-300'
          }
        `}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble + actions */}
      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} max-w-[82%]`}>
        {/* Role label */}
        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-500 px-1">
          {isUser ? 'You' : 'CardWise AI'}
        </span>

        {/* Bubble */}
        <div
          className={`
            relative group rounded-2xl px-4 py-3 text-sm leading-relaxed font-medium
            ${isUser
              ? 'chat-bubble-user rounded-tr-none'
              : isSpecial
                ? 'w-full rounded-tl-none'
                : 'chat-bubble-ai rounded-tl-none'
            }
          `}
        >
          {children ? (
            children
          ) : (
            <p className="whitespace-pre-line">{formatContent(content)}</p>
          )}

          {/* Copy button — only for AI text bubbles, not special */}
          {!isUser && !isSpecial && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200
                         w-6 h-6 flex items-center justify-center rounded-md bg-surface-800 border border-surface-700/60 text-surface-400 hover:text-white"
            >
              {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[9px] text-surface-600 px-1 font-medium">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
