
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';

type AspectRatio = 'portrait' | 'landscape';

interface GeneratedShort {
  id: number;
  title: string;
  timestamp: string;
  thumbnailUrl: string;
  downloadUrl: string;
}

const YouTubeToShorts: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('portrait');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [generatedShorts, setGeneratedShorts] = useState<GeneratedShort[]>([]);
  const processRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processRef.current) clearInterval(processRef.current);
    };
  }, []);

  const clearProcesses = () => {
    if (processRef.current) clearInterval(processRef.current);
    processRef.current = null;
  };

  const handleGenerate = useCallback(() => {
    if (!url.trim() || !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedShorts([]);
    setProgress(0);

    // FIX: Use window.setInterval to ensure it returns a number, not NodeJS.Timeout.
    processRef.current = window.setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 5) + 1;
        if (next >= 95) {
          clearProcesses();
          return 95;
        }
        return next;
      });
    }, 200);

    setTimeout(() => {
      clearProcesses();
      setProgress(100);
      setIsLoading(false);
      
      const dummyShorts: GeneratedShort[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        title: `Short ${i + 1}`,
        timestamp: `${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`,
        thumbnailUrl: `https://picsum.photos/seed/${i+url}/400/${aspectRatio === 'portrait' ? 711 : 225}`,
        downloadUrl: '#',
      }));
      setGeneratedShorts(dummyShorts);
    }, 4000);
  }, [url, aspectRatio]);

  const handleCancel = () => {
    clearProcesses();
    setIsLoading(false);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">YouTube to Shorts Converter</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Paste a YouTube video link to split it into 60-second clips.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <YouTubeIcon className="h-7 w-7 text-red-600" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            disabled={isLoading || generatedShorts.length > 0}
          />
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-sm font-semibold">Aspect Ratio:</span>
            <div className="flex gap-2">
                <button 
                    onClick={() => setAspectRatio('portrait')}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${aspectRatio === 'portrait' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >Portrait (9:16)</button>
                 <button 
                    onClick={() => setAspectRatio('landscape')}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${aspectRatio === 'landscape' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >Landscape (16:9)</button>
            </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleGenerate} disabled={isLoading || !url.trim() || generatedShorts.length > 0} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
            {isLoading ? <Loader /> : 'Generate Shorts'}
          </button>
           <button onClick={() => { setUrl(''); setGeneratedShorts([]); setError(null); }} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
            New Video
          </button>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><strong className="font-bold">Error: </strong><span>{error}</span></div>}

      {(isLoading || generatedShorts.length > 0) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Generated Shorts:</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
            {isLoading && (
              <div className="flex flex-col items-center">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Processing video... {Math.round(progress)}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">Cancel</button>
              </div>
            )}
            {generatedShorts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {generatedShorts.map(short => (
                    <div key={short.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm">
                        <img src={short.thumbnailUrl} alt={short.title} className="w-full object-cover" />
                        <div className="p-2">
                            <h4 className="font-bold text-sm">{short.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{short.timestamp}</p>
                            <a href={short.downloadUrl} download={`short-${short.id+1}.mp4`} className="mt-2 w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700">
                                <DownloadIcon className="h-4 w-4" /> Download
                            </a>
                        </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeToShorts;