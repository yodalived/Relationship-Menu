import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function IconLike({ className = '', ...props }: IconProps) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`text-green-500 ${className}`}
      {...props}
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="#EAFFED" className="dark:fill-green-700 dark:stroke-green-700" />
      <path 
        d="M6 10L9 13L14 7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="dark:stroke-white"
      />
    </svg>
  );
} 