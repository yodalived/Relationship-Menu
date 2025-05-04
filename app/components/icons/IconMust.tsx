import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function IconMust({ className = '', ...props }: IconProps) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`text-blue-500 ${className}`}
      {...props}
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="#DEF0FF" className="dark:fill-blue-700 dark:stroke-blue-700" />
      <path 
        d="M10 5V12M10 15V15.01" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="dark:stroke-white"
      />
    </svg>
  );
} 