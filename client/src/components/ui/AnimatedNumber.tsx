import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  duration?: number; // ms
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '₹',
  duration = 1000,
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef(value);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = displayValue;
    const endVal = value;
    if (startVal === endVal) return;

    let animId: number;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const current = startVal + (endVal - startVal) * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
      }
    };

    startRef.current = null;
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  // Formats numbers to Indian numbering system (e.g., 12,34,567.89 or 80,000)
  const formatIndianNumber = (num: number) => {
    const parts = num.toFixed(decimals).split('.');
    let lastThree = parts[0].substring(parts[0].length - 3);
    const otherBits = parts[0].substring(0, parts[0].length - 3);
    if (otherBits !== '') {
      lastThree = ',' + lastThree;
    }
    const formatted = otherBits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return parts.length > 1 ? formatted + '.' + parts[1] : formatted;
  };

  return (
    <span className={`font-mono ${className}`}>
      {prefix}
      {formatIndianNumber(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
