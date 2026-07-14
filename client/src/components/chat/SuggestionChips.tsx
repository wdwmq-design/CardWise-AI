import React from 'react';
import { motion } from 'motion/react';

interface SuggestionChipsProps {
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  chips,
  onSelect,
  disabled = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      className="flex flex-wrap gap-2 pl-11"
    >
      {chips.map((chip, idx) => (
        <motion.button
          key={chip}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: idx * 0.06 }}
          onClick={() => !disabled && onSelect(chip)}
          disabled={disabled}
          className="
            suggestion-chip
            text-xs font-semibold px-3.5 py-1.5 rounded-full
            bg-surface-900/60 hover:bg-surface-800/80
            border border-surface-700/60 hover:border-accent/40
            text-surface-300 hover:text-accent
            transition-all duration-200 cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
            backdrop-blur-sm
          "
        >
          {chip}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;
