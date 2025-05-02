import React from 'react';
import Link from 'next/link';

export function PrivacySection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 className="text-xl font-bold text-[var(--main-text-color)]">Privacy Information</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <strong className="text-[var(--main-text-color)]">100% Private:</strong> 
              <span className="ml-2 text-gray-600 dark:text-gray-300">All your relationship menu data stays locally in your browser until you explicitly share it with someone via a link or as a json file.</span>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <strong className="text-[var(--main-text-color)]">Local Storage:</strong> 
              <span className="ml-2 text-gray-600 dark:text-gray-300">Your relationship menu is automatically saved in your browser's local storage, so you can safely reload the page or return later without losing any data.</span>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <Link href="/privacy-policy" className="text-[var(--main-text-color)] hover:underline font-medium">More details on how your data is handled.</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 