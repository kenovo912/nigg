
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './Loader';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const MP4ToMP3Converter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropError, setDropError] = useState<boolean>(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isFileInfoVisible, setFileInfoVisible] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // FIX: Replace NodeJS.Timeout with number for browser compatibility.
  const processRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // FIX: Use a single clear function as clearTimeout and clearInterval are interchangeable for number IDs in browsers.
      processRef.current.forEach(clearTimeout);
    };
  }, []);
  
  useEffect(() => {
    if (file) {
      // FIX: Use window.setTimeout to ensure it returns a number, not NodeJS.Timeout.
      const timer = window.setTimeout(() => setFileInfoVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setFileInfoVisible(false);
    }
  }, [file]);

  const clearProcesses = () => {
     // FIX: Use a single clear function as clearTimeout and clearInterval are interchangeable for number IDs in browsers.
     processRef.current.forEach(clearTimeout);
    processRef.current = [];
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type !== 'video/mp4') {
        setInlineError('Unsupported file type. Please upload a .mp4 file.');
        setDropError(true);
        // FIX: Use window.setTimeout to ensure it returns a number, not NodeJS.Timeout.
        window.setTimeout(() => { setDropError(false); setInlineError(null); }, 2000);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      handleClear();
      setFile(selectedFile);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = useCallback(() => {
    if (!file) return;
    setIsLoading(true);

    // FIX: Use window.setInterval to ensure it returns a number, not NodeJS.Timeout.
    const progressInterval = window.setInterval(() => setProgress(prev => Math.min(prev + Math.floor(Math.random() * 10) + 5, 95)), 250);
    processRef.current.push(progressInterval);
    
    // FIX: Use window.setTimeout to ensure it returns a number, not NodeJS.Timeout.
    const timeoutId = window.setTimeout(() => {
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
        const blob = new Blob([file], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      }, 5000);
      processRef.current.push(prepareTimeout);
    }, 3000);
    processRef.current.push(timeoutId);
  }, [file]);

  const handleCancel = () => {
    clearProcesses();
    handleClear();
  };

  const handleClear = () => {
    clearProcesses();
    setFile(null); setError(null); setDownloadUrl(null); setProgress(0); setIsLoading(false); setIsPreparing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const getOutputFilename = () => {
    if (!file) return 'converted.mp3';
    const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
    return `${nameWithoutExtension}.mp3`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">MP4 to MP3 Converter</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Extract audio from an MP4 video file.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {!file && (
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'} ${dropError ? '!border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
            onDragEnter={e => handleDragEvents(e, true)} onDragLeave={e => handleDragEvents(e, false)} onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`} />
            {inlineError ? <p className="mt-4 font-semibold text-lg text-red-600 dark:text-red-400 text-center">{inlineError}</p> : isDragging ? <p className="mt-4 font-semibold text-lg text-indigo-600 dark:text-indigo-300">Release to drop file</p> : <> <p className="mt-4 text-center text-gray-600 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop an MP4 file</p> <p className="text-sm text-gray-500 dark:text-gray-500">Supported: .mp4</p> </>}
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)} className="hidden" accept=".mp4,video/mp4" />
          </div>
        )}
        
        {file && (
          <div className={`text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 ease-out transform ${isFileInfoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleConvert} disabled={isLoading || !file || !!downloadUrl || isPreparing} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
            {isLoading ? <Loader /> : 'Convert to MP3'}
          </button>
          <button onClick={handleClear} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors">
            Choose New File
          </button>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}

      {(isLoading || downloadUrl || isPreparing) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Result:</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
            {isLoading && (
              <div className="flex flex-col items-center">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Extracting audio... {Math.round(progress)}%</p>
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
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Extraction Successful!</p>
                <a href={downloadUrl} download={getOutputFilename()} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                  <DownloadIcon /> Download MP3
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MP4ToMP3Converter;