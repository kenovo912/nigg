import React, { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './Loader';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const WebPToPNGConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropError, setDropError] = useState<boolean>(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isFileInfoVisible, setFileInfoVisible] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // FIX: Replace NodeJS.Timeout with number for browser compatibility.
  const conversionProcessRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      conversionProcessRef.current.forEach(timerId => clearTimeout(timerId as number));
    };
  }, []);
  
  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => setFileInfoVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setFileInfoVisible(false);
    }
  }, [file]);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type !== 'image/webp') {
        setInlineError('Unsupported file type. Please upload a .webp file.');
        setDropError(true);
        setTimeout(() => { setDropError(false); setInlineError(null); }, 2000);
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

    const progressInterval = setInterval(() => setProgress(prev => Math.min(prev + Math.floor(Math.random() * 10) + 5, 100)), 200);
    conversionProcessRef.current.push(progressInterval);

    setTimeout(() => {
      clearInterval(progressInterval);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL('image/png');
            setDownloadUrl(pngDataUrl);
          } else {
            setError("Could not process the image.");
          }
          setIsLoading(false);
        };
        img.onerror = () => { setError("Could not load the image file."); setIsLoading(false); };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => { setError("Failed to read the file."); setIsLoading(false); };
      reader.readAsDataURL(file);
    }, 2000);
  }, [file]);
  
  const handleCancel = () => {
    conversionProcessRef.current.forEach(timerId => clearTimeout(timerId as number));
    handleClear();
  };

  const handleClear = () => {
    setFile(null); setError(null); setDownloadUrl(null); setProgress(0); setIsLoading(false);
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
    if (!file) return 'converted.png';
    const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
    return `${nameWithoutExtension}.png`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">WebP to PNG Converter</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Upload a WebP image to convert it into a PNG file.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {!file && (
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'} ${dropError ? '!border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
            onDragEnter={e => handleDragEvents(e, true)} onDragLeave={e => handleDragEvents(e, false)} onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`} />
            {inlineError ? <p className="mt-4 font-semibold text-lg text-red-600 dark:text-red-400 text-center">{inlineError}</p> : isDragging ? <p className="mt-4 font-semibold text-lg text-indigo-600 dark:text-indigo-300">Release to drop file</p> : <> <p className="mt-4 text-center text-gray-600 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop a WebP image</p> <p className="text-sm text-gray-500 dark:text-gray-500">Supported: .webp</p> </>}
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)} className="hidden" accept=".webp,image/webp" />
          </div>
        )}
        
        {file && (
          <div className={`text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 ease-out transform ${isFileInfoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleConvert} disabled={isLoading || !file || !!downloadUrl} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
            {isLoading ? <Loader /> : 'Convert to PNG'}
          </button>
          <button onClick={handleClear} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors">
            Choose New File
          </button>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}

      {(isLoading || downloadUrl) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Result:</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
            {isLoading && (
              <div className="flex flex-col items-center">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Converting... {Math.round(progress)}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
                <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">Cancel</button>
              </div>
            )}
            {downloadUrl && (
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Conversion Successful!</p>
                <a href={downloadUrl} download={getOutputFilename()} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                  <DownloadIcon /> Download PNG
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebPToPNGConverter;