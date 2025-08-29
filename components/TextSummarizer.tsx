import React, { useState, useCallback, useRef } from 'react';
import { summarizeText } from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon } from './icons/UploadIcon';

const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropError, setDropError] = useState<boolean>(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSummary('');
    setIsCopied(false);

    try {
      const result = await summarizeText(inputText);
      setSummary(result);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.type !== 'text/plain') {
            setInlineError('Unsupported file type. Please upload a .txt file.');
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
        const reader = new FileReader();
        reader.onload = (event) => {
            const textContent = event.target?.result as string;
            setInputText(textContent);
        };
        reader.onerror = () => {
            setError('An error occurred while reading the file.');
        };
        reader.readAsText(selectedFile);
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('Failed to paste text from clipboard.');
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setError(null);
    setIsCopied(false);
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
    
  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy summary to clipboard.');
    });
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">AI Text Summarizer</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Upload a file or paste your text below and let our AI provide a concise summary.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300">
        <div 
            className={`flex flex-col items-center justify-center p-6 mb-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'} ${dropError ? '!border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
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
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop a text file
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Supported: .txt</p>
                </>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                accept=".txt"
                disabled={isLoading}
            />
        </div>
        <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600"/>
            <span className="mx-4 text-gray-500 dark:text-gray-400 font-semibold">OR</span>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600"/>
        </div>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your article, report, or any long text here..."
            className="w-full h-64 p-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
            disabled={isLoading}
            aria-label="Text input for summarization"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400">{wordCount} words</div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[150px]"
          >
            {isLoading ? <Loader /> : 'Summarize Text'}
          </button>
          <button
            onClick={handlePaste}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-300"
          >
            Paste Text
          </button>
           <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-300"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {(summary || isLoading) && (
        <div ref={outputRef} className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary:</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[100px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">AI is thinking...</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 min-w-[120px] text-center"
                      aria-label="Copy summary to clipboard"
                    >
                      {isCopied ? 'Copied!' : 'Copy Summary'}
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

export default TextSummarizer;