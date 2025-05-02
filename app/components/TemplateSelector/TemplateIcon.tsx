// Helper component for rendering icons
import { TemplateIcon as TemplateIconType } from './types';

const TemplateIcon = ({ icon }: { icon?: TemplateIconType }) => {
  // Default icon if none is provided
  const defaultPath = "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10";
  
  // Get the path: either the string itself, or the path property of the icon object
  const iconPath = icon?.path || defaultPath;
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-[var(--main-text-color)]" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d={iconPath} 
      />
    </svg>
  );
};

export default TemplateIcon; 