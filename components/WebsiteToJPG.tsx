
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { LinkIcon } from './icons/LinkIcon';

const WebsiteToJPG: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  // FIX: Replace NodeJS.Timeout with number for browser compatibility.
  const processRef = useRef<number[]>([]);

  useEffect(() => {
    return () => clearProcesses();
  }, []);

  const clearProcesses = () => {
    // FIX: Use a single clear function as clearTimeout and clearInterval are interchangeable for number IDs in browsers.
    processRef.current.forEach(clearTimeout);
    processRef.current = [];
  };

  const handleCapture = useCallback(() => {
    try {
      new URL(url);
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError(null);
    setIsLoading(true);
    setDownloadUrl(null);
    setProgress(0);

    // FIX: Use window.setInterval to ensure it returns a number, not NodeJS.Timeout.
    const progressInterval = window.setInterval(() => setProgress(prev => Math.min(prev + Math.floor(Math.random() * 10) + 5, 95)), 250);
    processRef.current.push(progressInterval);

    // FIX: Use window.setTimeout to ensure it returns a number, not NodeJS.Timeout.
    const captureTimeout = window.setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);
      setIsPreparing(true);
      setCountdown(5);

      // FIX: Use window.setInterval to ensure it returns a number, not NodeJS.Timeout.
      const countdownInterval = window.setInterval(() => setCountdown(c => c - 1), 1000);
      processRef.current.push(countdownInterval);

      // FIX: Use window.setTimeout to ensure it returns a number, not NodeJS.Timeout.
      const prepareTimeout = window.setTimeout(() => {
        clearInterval(countdownInterval);
        setIsPreparing(false);
        
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff'; // JPG doesn't have transparency, so set a background
        ctx.fillRect(0, 0, 1200, 800);
        ctx.fillStyle = '#333';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Simulated Screenshot of:`, 600, 380);
        ctx.fillText(url, 600, 420);
        
        const blobUrl = canvas.toDataURL('image/jpeg', 0.9);
        setDownloadUrl(blobUrl);
      }, 5000);
      processRef.current.push(prepareTimeout);
    }, 3000);
    processRef.current.push(captureTimeout);
  }, [url]);

  const handleCancel = () => {
    clearProcesses();
    setIsLoading(false);
    setProgress(0);
  };

  const handleClear = () => {
    clearProcesses();
    setUrl('');
    setError(null);
    setDownloadUrl(null);
    setProgress(0);
    setIsLoading(false);
    setIsPreparing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Website JPG Screenshot</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Enter a URL to capture a webpage and save it as a JPG image.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-6 w-6 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            disabled={isLoading || !!downloadUrl || isPreparing}
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleCapture} disabled={isLoading || !url.trim() || !!downloadUrl || isPreparing} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
            {isLoading ? <Loader /> : 'Capture Screenshot'}
          </button>
          <button onClick={handleClear} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
            Clear
          </button>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><strong className="font-bold">Error: </strong><span>{error}</span></div>}

      {(isLoading || downloadUrl || isPreparing) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Result:</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
            {isLoading && (
              <div className="flex flex-col items-center">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Capturing webpage... {Math.round(progress)}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">Cancel</button>
              </div>
            )}
            {isPreparing && (
              <div className="text-center">
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Preparing your download...</p>
                <p className="text-gray-600 dark:text-gray-400">Your download will start in {countdown} seconds.</p>
                <p className="text-sm text-gray-500 mt-2">(This is a simulated ad-sponsored wait time)</p>
              </div>
            )}
            {downloadUrl && (
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Capture Successful!</p>
                <a href={downloadUrl} download="website-screenshot.jpg" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                  <DownloadIcon /> Download JPG
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteToJPG;