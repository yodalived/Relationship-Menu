interface MenuStatsProps {
  sections: number;
  items: number;
  className?: string;
  compact?: boolean;
}

const MenuStats = ({ sections, items, className = "", compact = false }: MenuStatsProps) => {
  // Define styling based on compact prop
  const itemClasses = compact 
    ? "flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-[rgba(158,198,204,0.1)] dark:bg-[rgba(158,198,204,0.05)] px-3 py-1.5 rounded-md border border-[rgba(158,198,204,0.2)]"
    : "flex items-center bg-[rgba(158,198,204,0.15)] dark:bg-[rgba(158,198,204,0.1)] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border border-[rgba(158,198,204,0.3)] shadow-sm whitespace-nowrap";
  
  const iconClasses = compact
    ? "h-4 w-4 mr-1.5 text-[var(--main-text-color)]"
    : "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[var(--main-text-color)]";
  
  const textClasses = compact
    ? "text-gray-600 dark:text-gray-300"
    : "text-gray-800 dark:text-gray-200";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={itemClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className={textClasses}>{sections} Topics</span>
      </div>
      <div className={itemClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className={textClasses}>{items} Items</span>
      </div>
    </div>
  );
};

export default MenuStats; 