import React, { useState, useRef, useEffect } from 'react';

export type Tool = 
    // AI
    'summarizer' | 'speechToText' | 'translator' | 'textToSpeech' | 
    // Converters
    'archiveConverter' | 'audioConverter' | 'cadConverter' | 'documentConverter' | 
    'ebookConverter' | 'fontConverter' | 'imageConverter' | 'presentationConverter' |
    'spreadsheetConverter' | 'vectorConverter' | 'videoConverter' | 'pngToJpg' | 'webpToPng' |
    'mp3ToMp4' | 'mp4ToMp3' | 'wordToPdf' | 'textToPdf' |
    // Optimization
    'compressPDF' | 'compressPNG' | 'compressJPG' | 'pdfOCR' |
    // Merging
    'pdfMerge' |
    // Web Capture
    'websiteToPdf' | 'websiteToPng' | 'websiteToJpg' |
    // Archives
    'createArchive' | 'extractArchive' |
    // Online Media
    'youtubeToShorts' | 'spotifyDownloader';

interface ToolNavigationProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

type ToolsConfig = {
    [category: string]: {
        icon: string;
        tools: { [key in Tool]?: string };
    };
};

export const toolsConfig: ToolsConfig = {
    "Online Media": {
        icon: "🎬",
        tools: {
            youtubeToShorts: "YouTube to Shorts",
            spotifyDownloader: "Spotify Downloader",
        }
    },
    "AI Tools": {
        icon: "✨",
        tools: {
            summarizer: "Text Summarizer",
            speechToText: "Speech-to-Text",
            translator: "AI Translator",
            textToSpeech: "Text-to-Speech",
        }
    },
    "Converters": {
        icon: "🔄",
        tools: {
            imageConverter: "Image Converter",
            documentConverter: "Document Converter",
            videoConverter: "Video Converter",
            audioConverter: "Audio Converter",
            archiveConverter: "Archive Converter",
            ebookConverter: "Ebook Converter",
            cadConverter: "CAD Converter",
            fontConverter: "Font Converter",
            presentationConverter: "Presentation Converter",
            spreadsheetConverter: "Spreadsheet Converter",
            vectorConverter: "Vector Converter",
            // Specific implemented ones
            pngToJpg: "PNG to JPG",
            webpToPng: "WebP to PNG",
            wordToPdf: "Word to PDF",
            textToPdf: "Text to PDF",
            mp4ToMp3: "MP4 to MP3",
            mp3ToMp4: "MP3 to MP4",
        }
    },
    "File Optimization": {
        icon: "⚙️",
        tools: {
            compressPDF: "Compress PDF",
            compressPNG: "Compress PNG",
            compressJPG: "Compress JPG",
            pdfOCR: "PDF OCR",
        }
    },
     "PDF Tools": {
        icon: "📄",
        tools: {
            pdfMerge: "Merge PDF",
            // Re-list some for discoverability
            wordToPdf: "Word to PDF",
            textToPdf: "Text to PDF",
            compressPDF: "Compress PDF",
            pdfOCR: "PDF OCR",
        }
    },
    "Web Tools": {
        icon: "🌐",
        tools: {
            websiteToPdf: "Save Website as PDF",
            websiteToPng: "Website PNG Screenshot",
            websiteToJpg: "Website JPG Screenshot",
        }
    },
    "Archive Tools": {
        icon: "🗜️",
        tools: {
            createArchive: "Create Archive",
            extractArchive: "Extract Archive",
        }
    }
}

export const findToolConfig = (toolKey: Tool): { name: string; category: string; } | null => {
    for (const [category, { tools }] of Object.entries(toolsConfig)) {
        if (tools[toolKey]) {
            return { name: tools[toolKey]!, category };
        }
    }
    return null;
}


const ToolNavigation: React.FC<ToolNavigationProps> = ({ activeTool, setActiveTool }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (category: string) => {
        setOpenDropdown(openDropdown === category ? null : category);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeToolInfo = findToolConfig(activeTool);

    return (
        <div className="flex justify-center mb-8 relative" ref={dropdownRef}>
          <div className="flex flex-wrap justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl shadow-sm">
            {Object.entries(toolsConfig).map(([category, {icon, tools}]) => (
                <div key={category} className="relative">
                    <button
                        onClick={() => handleToggle(category)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                            activeToolInfo?.category === category 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        <span>{icon}</span> {category}
                        <svg className={`w-4 h-4 transition-transform ${openDropdown === category ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {openDropdown === category && (
                         <div className="absolute top-full mt-2 min-w-[200px] bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700 max-h-64 overflow-y-auto">
                           {Object.entries(tools).map(([toolKey, toolName]) => (
                                <a
                                    key={toolKey}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTool(toolKey as Tool);
                                        setOpenDropdown(null);
                                    }}
                                    className={`block px-4 py-2 text-sm ${activeTool === toolKey ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                                >
                                    {toolName}
                                </a>
                           ))}
                         </div>
                    )}
                </div>
            ))}
          </div>
        </div>
    )
}

export default ToolNavigation;