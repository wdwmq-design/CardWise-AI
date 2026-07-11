import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect'
}) => {
  const baseStyles = 'animate-shimmer bg-linear-to-r from-surface-850 via-surface-800 to-surface-850 bg-[length:200%_100%]';
  
  const variants = {
    text: 'h-4 w-3/4 rounded-sm',
    circle: 'rounded-full',
    rect: 'rounded-md',
    card: 'rounded-2xl h-32 w-full',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
    />
  );
};

export default Skeleton;
