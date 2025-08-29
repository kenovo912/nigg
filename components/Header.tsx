import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { BellIcon } from './icons/BellIcon';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSubscribed: boolean;
  onSubscribe: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, isSubscribed, onSubscribe }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            QuickConvert Hub
            </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onSubscribe}
            disabled={isSubscribed}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed relative"
            aria-label="Subscribe to notifications"
            title={isSubscribed ? "You are subscribed to notifications" : "Subscribe to notifications"}
          >
            <BellIcon />
            {isSubscribed && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;