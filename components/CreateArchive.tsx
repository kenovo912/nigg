import React, { useState, useCallback, useRef } from 'react';
import Loader from './Loader';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const CreateArchive: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
      setDownloadUrl(null);
      setProgress(0);
      setError(null);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleCreate = useCallback(() => {
    if (files.length < 1) {
      setError('Please select at least one file to archive.');
      return;
    }
    setError(null);
    setIsLoading(true);
    let progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return p + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      const archiveContent = `This is a simulated ZIP archive containing ${files.length} files:\n\n${files.map(f => `- ${f.name} (${f.size} bytes)`).join('\n')}`;
      const blob = new Blob([archiveContent], { type: 'text/plain' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsLoading(false);
    }, 2500);
  }, [files]);

  const handleClear = () => {
    setFiles([]); setError(null); setDownloadUrl(null); setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Create Archive</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Combine multiple files into a single ZIP archive.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'}`}
          onDragEnter={e => handleDragEvents(e, true)} onDragLeave={e => handleDragEvents(e, false)} onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon />
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop files</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Add one or more files to get started</p>
          <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" multiple />
        </div>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Files to archive ({files.length}):</h3>
              <ul className="max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  {files.map((file, index) => (
                      <li key={index} className="flex justify-between items-center text-sm p-1">
                          <span>{file.name}</span>
                          <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                      </li>
                  ))}
              </ul>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button onClick={handleCreate} disabled={isLoading || files.length === 0} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
            {isLoading ? <Loader /> : 'Create ZIP'}
          </button>
          <button onClick={handleClear} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors">
            Clear All
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
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Archiving... {Math.round(progress)}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
              </div>
            )}
            {downloadUrl && (
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Archive Created!</p>
                <a href={downloadUrl} download="archive.zip" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                  <DownloadIcon /> Download ZIP
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateArchive;