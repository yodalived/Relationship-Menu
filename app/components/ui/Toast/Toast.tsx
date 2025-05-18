import React from 'react';
import { ToastType } from './ToastContext';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type: ToastType;
}

export function Toast({ message, isVisible, type = 'success' }: ToastProps) {
  if (!isVisible) return null;
  
  // Get the appropriate styling based on toast type
  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'warning':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      case 'info':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'success':
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          borderColor: 'border-green-200 dark:border-green-800'
        };
    }
  };

  const { icon, borderColor } = getToastStyles();
  
  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 flex items-center border ${borderColor}`}>
      {icon}
      {message}
    </div>
  );
} 