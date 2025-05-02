import React from 'react';

interface CategoryHeaderProps {
  name: string;
  catIndex: number;
  isEditing: boolean;
  totalCategories: number;
  onNameChange: (catIndex: number, newName: string) => void;
  onMoveUp: (catIndex: number) => void;
  onMoveDown: (catIndex: number) => void;
  onDelete: (catIndex: number) => void;
}

export function CategoryHeader({
  name,
  catIndex,
  isEditing,
  totalCategories,
  onNameChange,
  onMoveUp,
  onMoveDown,
  onDelete
}: CategoryHeaderProps) {
  if (!isEditing) {
    return <h2 id={`category-header-${catIndex}`}>{name}</h2>;
  }
  
  return (
    <div className="flex items-center w-full justify-between" role="group" aria-label={`Edit category ${name}`}>
      <div className="flex-grow px-3">
        <label htmlFor={`category-name-${catIndex}`} className="sr-only">Category name</label>
        <input
          id={`category-name-${catIndex}`}
          type="text"
          value={name}
          onChange={(e) => onNameChange(catIndex, e.target.value)}
          className="w-full bg-transparent text-white text-center font-bold focus:outline-none border-b border-white border-dashed hover:border-solid focus:border-solid placeholder-white/70"
          placeholder="Edit section title..."
          aria-label="Edit section title"
          aria-describedby={`category-header-${catIndex}`}
        />
      </div>
      <div className="flex items-center mr-2" role="toolbar" aria-label="Category actions">
        <button
          type="button"
          onClick={() => onMoveUp(catIndex)}
          disabled={catIndex === 0}
          className={`p-1 mx-0.5 text-white ${catIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
          title="Move section left"
          aria-label="Move section left (or up on small screens)"
        >
          {/* Left arrow for larger screens, Up arrow for mobile */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(catIndex)}
          disabled={catIndex === totalCategories - 1}
          className={`p-1 mx-0.5 text-white ${catIndex === totalCategories - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
          title="Move section right"
          aria-label="Move section right (or down on small screens)"
        >
          {/* Right arrow for larger screens, Down arrow for mobile */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(catIndex)}
          className="p-1 mx-0.5 text-white border border-white/30 rounded hover:bg-red-400/70 hover:border-red-300"
          title="Delete this section"
          aria-label="Delete this section"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
} 