import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TextSummarizer from './components/TextSummarizer';
import SpeechToText from './components/SpeechToText';
import MP3ToMP4Converter from './components/MP3ToMP4Converter';
import PNGToJPGConverter from './components/PNGToJPGConverter';
import WordToPDFConverter from './components/WordToPDFConverter';
import AITranslator from './components/AITranslator';
import TextToSpeech from './components/TextToSpeech';
import TextToPDFConverter from './components/TextToPDFConverter';
import WebPToPNGConverter from './components/WebPToPNGConverter';
import MP4ToMP3Converter from './components/MP4ToMP3Converter';
import PDFMerge from './components/PDFMerge';
import AuthModal from './components/auth/AuthModal';
import ToolNavigation, { Tool, toolsConfig, findToolConfig } from './components/core/ToolNavigation';
import BannerAd from './components/monetization/BannerAd';
import PageLoader from './components/core/PageLoader';
import ComingSoonTool from './components/core/ComingSoonTool';
import { WrenchIcon } from './components/icons/WrenchIcon';
import CompressPDF from './components/CompressPDF';
import CompressPNG from './components/CompressPNG';
import CompressJPG from './components/CompressJPG';
import PDFOCR from './components/PDFOCR';
import WebsiteToPDF from './components/WebsiteToPDF';
import WebsiteToPNG from './components/WebsiteToPNG';
import WebsiteToJPG from './components/WebsiteToJPG';
import CreateArchive from './components/CreateArchive';
import ExtractArchive from './components/ExtractArchive';
import YouTubeToShorts from './components/YouTubeToShorts';
import SpotifyDownloader from './components/SpotifyDownloader';

// Explicitly define components that are already implemented
const implementedTools: Record<string, React.FC> = {
  summarizer: TextSummarizer,
  speechToText: SpeechToText,
  translator: AITranslator,
  textToSpeech: TextToSpeech,
  mp3ToMp4: MP3ToMP4Converter,
  mp4ToMp3: MP4ToMP3Converter,
  pngToJpg: PNGToJPGConverter,
  webpToPng: WebPToPNGConverter,
  wordToPdf: WordToPDFConverter,
  textToPdf: TextToPDFConverter,
  pdfMerge: PDFMerge,
  compressPDF: CompressPDF,
  compressPNG: CompressPNG,
  compressJPG: CompressJPG,
  pdfOCR: PDFOCR,
  websiteToPdf: WebsiteToPDF,
  websiteToPng: WebsiteToPNG,
  websiteToJpg: WebsiteToJPG,
  createArchive: CreateArchive,
  extractArchive: ExtractArchive,
  youtubeToShorts: YouTubeToShorts,
  spotifyDownloader: SpotifyDownloader,
};

// Dynamically generate the full list of tool components
const toolComponents = Object.values(toolsConfig)
  .flatMap(category => Object.keys(category.tools))
  .reduce((acc, toolKey) => {
    if (implementedTools[toolKey]) {
      acc[toolKey] = implementedTools[toolKey];
    } else {
      const toolConfig = findToolConfig(toolKey as Tool);
      acc[toolKey] = () => <ComingSoonTool toolName={toolConfig?.name || 'Tool'} icon={<WrenchIcon />} />;
    }
    return acc;
  }, {} as Record<string, React.FC>);

const VAPID_PUBLIC_KEY = 'BEU9x4-1iBp7uL2laKBckxwO7R-MuNEJJ1_iPezekLQcV3mLcKPPh9Uw5YZQOLgNYYft0v6PlLAzp8vJsI1u-eQ';

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('youtubeToShorts');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Effect for Service Worker and Push Notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(swReg => {
          console.log('Service Worker is registered', swReg);
          swReg.pushManager.getSubscription().then(subscription => {
            if (subscription) {
              setIsSubscribed(true);
            }
          });
        })
        .catch(error => {
          console.error('Service Worker Error', error);
          setSubscriptionError('Failed to register service worker for notifications.');
        });
    }
  }, []);
  
  const subscribeToPushNotifications = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            setSubscriptionError('Push notification permission denied.');
            alert('You have denied notification permissions. To enable them, please go to your browser settings.');
            return;
        }

        const swReg = await navigator.serviceWorker.ready;
        const subscription = await swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        console.log('User is subscribed:', subscription);
        // In a real application, you would send this subscription object to your backend server.
        // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(subscription), ... });
        
        setIsSubscribed(true);
        setSubscriptionError(null);
        alert('Successfully subscribed to notifications!');
    } catch (error) {
        console.error('Failed to subscribe the user: ', error);
        setSubscriptionError('Failed to subscribe to push notifications. See console for details.');
    }
};

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);

  const ActiveToolComponent = toolComponents[activeTool] || TextSummarizer;

  if (isAppLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        user={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        isSubscribed={isSubscribed}
        onSubscribe={subscribeToPushNotifications}
      />
      
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(email) => {
            setCurrentUser({ email });
            setAuthModalOpen(false);
          }}
        />
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        <ToolNavigation activeTool={activeTool} setActiveTool={setActiveTool} />
        {subscriptionError && (
             <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">Notification Status</p>
                <p>{subscriptionError}</p>
             </div>
        )}
        <div className="mt-8">
            <ActiveToolComponent />
        </div>
        <BannerAd className="mt-12" />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;