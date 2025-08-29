import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 transition-opacity duration-300">
      <div className="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          QuickConvert Hub
        </h1>
      </div>
      <div className="mt-6">
        <svg
          className="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
       <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your tools...</p>
    </div>
  );
};

export default PageLoader;
