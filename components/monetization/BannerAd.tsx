import React, { useEffect, useRef } from 'react';

interface BannerAdProps {
  className?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ className }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the container is present and empty to avoid duplicate script injection
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      // Script 1: Configuration
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      // Using innerHTML to set the script content
      configScript.innerHTML = `
        atOptions = {
          'key' : 'd505260bcfdc1ce6cd60fcdfa58172cb',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      // Script 2: Invocation
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/d505260bcfdc1ce6cd60fcdfa58172cb/invoke.js';
      invokeScript.async = true;

      // Append scripts to the container to load the ad
      adContainerRef.current.appendChild(configScript);
      adContainerRef.current.appendChild(invokeScript);
    }
    // No cleanup function is needed as these scripts are meant to be persistent for the ad.
  }, []);

  return (
    <div className={`flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-4 min-h-[90px] ${className}`}>
      <div ref={adContainerRef} style={{ width: '468px', height: '60px' }}>
        {/* Ad script will be injected here by the useEffect hook */}
      </div>
    </div>
  );
};

export default BannerAd;
