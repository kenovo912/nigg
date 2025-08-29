
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} QuickConvert Hub. All rights reserved.</p>
        <p className="text-sm mt-1">Files are auto-deleted after 1 hour for your security.</p>
      </div>
    </footer>
  );
};

export default Footer;
