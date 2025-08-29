import React, { useState, useCallback } from 'react';
import { translateText } from '../services/geminiService';
import Loader from './Loader';
import { TranslateIcon } from './icons/TranslateIcon';

const LANGUAGES = {
  'English': 'English', 'Spanish': 'Spanish', 'French': 'French', 'German': 'German',
  'Japanese': 'Japanese', 'Chinese (Simplified)': 'Chinese (Simplified)', 'Russian': 'Russian', 'Hindi': 'Hindi',
};

const AITranslator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('English');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTranslatedText('');
    setIsCopied(false);

    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy translated text to clipboard.');
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">AI Translator</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Translate text into different languages with the power of AI.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full md:w-auto form-select bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            {Object.keys(LANGUAGES).map(lang => <option key={lang} value={LANGUAGES[lang as keyof typeof LANGUAGES]}>{lang}</option>)}
          </select>
          <button onClick={handleSwapLanguages} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Swap languages">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </button>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full md:w-auto form-select bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            {Object.keys(LANGUAGES).map(lang => <option key={lang} value={LANGUAGES[lang as keyof typeof LANGUAGES]}>{lang}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter text in ${sourceLang}...`}
            className="w-full h-48 p-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
            disabled={isLoading}
          />
          <div className="relative w-full h-48 p-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">Translating...</p>
                </div>
            ) : (
                <p className="whitespace-pre-wrap">{translatedText || 'Translation will appear here...'}</p>
            )}
            {translatedText && !isLoading && (
                <button onClick={handleCopy} className="absolute bottom-3 right-3 px-3 py-1 bg-gray-200 dark:bg-gray-600 text-sm font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 min-w-[150px]"
          >
            {isLoading ? <Loader /> : <><TranslateIcon /> Translate</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AITranslator;
