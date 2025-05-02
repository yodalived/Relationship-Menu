import React from 'react';

type Direction = 'up' | 'right' | 'down' | 'left';

interface IconChevronProps {
  direction?: Direction;
  className?: string;
}

export default function IconChevron({ 
  direction = 'down', 
  className = 'h-5 w-5'
}: IconChevronProps) {
  // Calculate rotation based on direction
  const getRotation = () => {
    switch (direction) {
      case 'up': return 'rotate-180';
      case 'right': return '-rotate-90';
      case 'left': return 'rotate-90';
      case 'down': 
      default: return '';
    }
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${getRotation()} ${className}`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 9l-7 7-7-7" 
      />
    </svg>
  );
} 