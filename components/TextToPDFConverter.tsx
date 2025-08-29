import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

declare global {
  interface Window {
    jspdf: any;
  }
}

const TextToPDFConverter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleConvertToPDF = () => {
    if (!text.trim()) {
      setError("Please enter some text to convert.");
      return;
    }
    setError(null);
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 15, 20);
      
      doc.save("converted-text.pdf");
    } catch (e) {
      console.error("Failed to generate PDF:", e);
      setError("An error occurred while generating the PDF. The jsPDF library might not have loaded correctly.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Text to PDF Converter</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Type or paste your text below and convert it to a PDF document instantly.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here to create a PDF..."
          className="w-full h-72 p-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        />
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleConvertToPDF}
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
          >
            <DownloadIcon />
            Convert & Download PDF
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

export default TextToPDFConverter;
