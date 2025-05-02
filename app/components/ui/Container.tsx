import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container mx-auto px-2 sm:px-4 py-4 sm:py-8 ${className}`}>
      {children}
    </div>
  );
} 