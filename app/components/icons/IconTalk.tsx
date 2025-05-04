import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function IconTalk({ className = '' }: IconProps) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`text-purple-500 ${className}`}
    >
      <path 
        d="M4 5.5C4 4.67157 4.67157 4 5.5 4H14.5C15.3284 4 16 4.67157 16 5.5V12.5C16 13.3284 15.3284 14 14.5 14H11L10 16L9 14H5.5C4.67157 14 4 13.3284 4 12.5V5.5Z" 
        fill="#F0EDFF"
        className="dark:fill-purple-500 dark:stroke-purple-500"
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
