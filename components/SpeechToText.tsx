import React, { useState, useCallback, useRef, useEffect } from 'react';
import { transcribeAudio } from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon } from './icons/UploadIcon';

const SpeechToText: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropError, setDropError] = useState<boolean>(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isFileInfoVisible, setFileInfoVisible] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => setFileInfoVisible(true), 10); // Short delay to allow CSS transition
      return () => clearTimeout(timer);
    } else {
      setFileInfoVisible(false);
    }
  }, [file]);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
        if (!selectedFile.type.startsWith('audio/')) {
            setInlineError('Please select a valid audio file.');
            setDropError(true);
            setTimeout(() => {
                setDropError(false);
                setInlineError(null);
            }, 2000);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }
        setError(null);
        setDropError(false);
        setInlineError(null);
        setTranscript('');
        setFile(selectedFile);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(isEntering);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleTranscribe = useCallback(async () => {
    if (!file) {
      setError('Please select an audio file to transcribe.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTranscript('');
    setIsCopied(false);

    try {
      const result = await transcribeAudio(file);
      setTranscript(result);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);
  
  const handleClear = () => {
    setFile(null);
    setTranscript('');
    setError(null);
    setIsCopied(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
    
  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy transcript to clipboard.');
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">AI Speech-to-Text</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Upload your audio file and our AI will transcribe it into text.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300">
        {!file && (
            <div 
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'} ${dropError ? '!border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                onDragEnter={e => handleDragEvents(e, true)}
                onDragLeave={e => handleDragEvents(e, false)}
                onDragOver={e => handleDragEvents(e, true)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                    <UploadIcon />
                </div>
                 {inlineError ? (
                    <p className="mt-4 font-semibold text-lg text-red-600 dark:text-red-400 text-center">{inlineError}</p>
                 ) : isDragging ? (
                    <p className="mt-4 font-semibold text-lg text-indigo-600 dark:text-indigo-300">Release to drop file</p>
                ) : (
                    <>
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop an audio file
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">MP3, WAV, M4A, etc.</p>
                    </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    accept="audio/*"
                    disabled={isLoading}
                />
            </div>
        )}
        {file && (
            <div className={`text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 ease-out transform ${isFileInfoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
            </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={handleTranscribe}
            disabled={isLoading || !file}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[150px]"
          >
            {isLoading ? <Loader /> : 'Transcribe Audio'}
          </button>
           <button
            onClick={handleClear}
            disabled={isLoading || !file}
            className="px-6 py-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-300"
          >
            Clear File
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {(transcript || isLoading) && (
        <div ref={outputRef} className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Transcript:</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full py-8">
                  <Loader />
                  <p className="text-gray-500 dark:text-gray-400 mt-4">AI is transcribing... this may take a moment.</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{transcript}</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 min-w-[120px] text-center"
                      aria-label="Copy transcript to clipboard"
                    >
                      {isCopied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

    </div>
  );
};

export default SpeechToText;