import React from 'react';

interface BannerAdProps {
  className?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ className }) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 ${className}`}>
      <p className="font-bold text-lg">Advertisement</p>
      <p className="text-sm">This is a placeholder for a banner ad (e.g., Google AdSense).</p>
    </div>
  );
};

export default BannerAd;
