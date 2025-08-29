import React, { useState, useEffect, useCallback } from 'react';
import { SpeakerIcon } from './icons/SpeakerIcon';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const populateVoiceList = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      const defaultVoice = availableVoices.find(voice => voice.default) || availableVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    }
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  const handleSpeak = () => {
    if (!text.trim()) {
      setError("Please enter some text to speak.");
      return;
    }
    if (isSpeaking && !isPaused) return;

    setError(null);
    window.speechSynthesis.cancel(); 

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = (event) => {
      setError(`An error occurred during speech synthesis: ${event.error}`);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Text-to-Speech</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Convert written text into natural-sounding speech.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="w-full h-48 p-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        />

        <div className="mt-4">
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select a Voice:</label>
          <select 
            id="voice-select"
            value={selectedVoice || ''} 
            onChange={(e) => setSelectedVoice(e.target.value)}
            disabled={voices.length === 0}
            className="w-full form-select bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {voices.length > 0 ? voices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            )) : <option>Loading voices...</option>}
          </select>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button onClick={handleSpeak} disabled={!text.trim() || (isSpeaking && !isPaused)} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
            <SpeakerIcon /> {isPaused ? 'Resume' : 'Speak'}
          </button>
          <button onClick={handlePause} disabled={!isSpeaking || isPaused} className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 disabled:bg-gray-400 transition-colors">
            Pause
          </button>
           <button onClick={handleStop} disabled={!isSpeaking} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:bg-gray-400 transition-colors">
            Stop
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

export default TextToSpeech;
