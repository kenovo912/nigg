import React from 'react';

export const WrenchIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.245 15.17l4.773 4.773z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M14.121 8.879l-4.773 4.773M3 21l3.375-3.375" 
        />
    </svg>
);
