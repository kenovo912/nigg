import React, { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpotifyIcon } from './icons/SpotifyIcon';

interface DownloadableTrack {
    id: number;
    title: string;
    artist: string;
    albumArtUrl: string;
}

interface DownloadResult {
    type: 'track' | 'playlist';
    title: string;
    creator?: string;
    tracks: DownloadableTrack[];
}

const SpotifyDownloader: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DownloadResult | null>(null);

    const handleFetch = useCallback(() => {
        if (!url.trim() || !url.includes('spotify.com')) {
            setError('Please enter a valid Spotify track or playlist URL.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const isPlaylist = url.includes('/playlist/');
            if (isPlaylist) {
                setResult({
                    type: 'playlist',
                    title: "My Awesome Mix",
                    creator: "Cool User",
                    tracks: Array.from({ length: 12 }, (_, i) => ({
                        id: i,
                        title: `Awesome Song Title ${i + 1}`,
                        artist: `Artist Name ${i % 4 + 1}`,
                        albumArtUrl: `https://picsum.photos/seed/${i+url}/100/100`
                    }))
                });
            } else {
                setResult({
                    type: 'track',
                    title: "A Really Cool Song",
                    tracks: [{
                        id: 0,
                        title: "A Really Cool Song",
                        artist: "Famous Artist",
                        albumArtUrl: `https://picsum.photos/seed/${url}/200/200`
                    }]
                });
            }
            setIsLoading(false);
        }, 2500);

    }, [url]);


    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Spotify Downloader</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Paste a Spotify track or playlist link to download. (Simulated)
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <SpotifyIcon className="h-7 w-7 text-green-500" />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://open.spotify.com/track/..."
                        className="w-full p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        disabled={isLoading || !!result}
                    />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button onClick={handleFetch} disabled={isLoading || !url.trim() || !!result} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[160px]">
                        {isLoading ? <Loader /> : 'Get Download Links'}
                    </button>
                    <button onClick={() => { setUrl(''); setResult(null); setError(null); }} disabled={isLoading} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
                        New Link
                    </button>
                </div>
            </div>

            {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><strong className="font-bold">Error: </strong><span>{error}</span></div>}

            {isLoading && (
                 <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                    <Loader />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Fetching metadata...</p>
                 </div>
            )}
            
            {result && (
                <div className="mt-8">
                    {result.type === 'track' ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                            <img src={result.tracks[0].albumArtUrl} alt="Album Art" className="w-40 h-40 rounded-lg shadow-md mb-4"/>
                            <h3 className="text-2xl font-bold">{result.tracks[0].title}</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{result.tracks[0].artist}</p>
                            <a href="#" download={`${result.tracks[0].artist} - ${result.tracks[0].title}.mp3`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                                <DownloadIcon /> Download MP3
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b dark:border-gray-700">
                               <div>
                                    <h3 className="text-2xl font-bold">{result.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">by {result.creator}</p>
                               </div>
                                <a href="#" download={`${result.title}.zip`} className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                                    <DownloadIcon /> Download All (ZIP)
                                </a>
                           </div>
                           <ul className="space-y-3 max-h-96 overflow-y-auto">
                               {result.tracks.map(track => (
                                   <li key={track.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                       <div className="flex items-center gap-3">
                                            <img src={track.albumArtUrl} alt="album art" className="h-12 w-12 rounded"/>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{track.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{track.artist}</p>
                                            </div>
                                       </div>
                                       <a href="#" download={`${track.artist} - ${track.title}.mp3`} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                           <DownloadIcon />
                                       </a>
                                   </li>
                               ))}
                           </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpotifyDownloader;
