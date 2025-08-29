import React from 'react';

export const TranslateIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 5h12M9 3v2m4 13l4-4-4-4M19 17v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2h2v-2h2v-2h2v-2h2V9a2 2 0 012-2z" 
        />
    </svg>
);
