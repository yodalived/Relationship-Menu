import React from 'react';

interface NewButtonProps {
  onClick: () => void;
}

export function NewButton({ onClick }: NewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium flex-grow md:flex-grow-0 min-w-[100px] flex items-center justify-center"
      title="Create a new menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      New Menu
    </button>
  );
} 