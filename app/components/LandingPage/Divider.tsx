import React from 'react';

export const Divider: React.FC = () => {
  return (
    <div className="my-12 flex items-center justify-center">
      <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
      <div className="px-4">
        <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-lg font-medium rounded-full px-4 py-2 shadow-sm">or</span>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
    </div>
  );
}; 