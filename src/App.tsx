/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Music, Mic, Search, Radio, Lock } from 'lucide-react';
import { AppScreen, SongResult } from './types';
import { IntroPermission } from './components/IntroPermission';
import { ListeningView } from './components/ListeningView';
import { ResultsView } from './components/ResultsView';
import { ArtistPromotion } from './components/ArtistPromotion';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { searchYouTubeMusic } from './services/apifyService';
import { MOCK_CATALOG } from './data/mockSongs';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('permission');
  const [micGranted, setMicGranted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SongResult[]>([]);
  const [searchSource, setSearchSource] = useState<'apify' | 'catalog-match' | 'simulated'>('catalog-match');
  const [isSearching, setIsSearching] = useState(false);

  // Audio preview playback state
  const [previewTrack, setPreviewTrack] = useState<SongResult | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);


  // Handle granting mic permission
  const handlePermissionGranted = () => {
    setMicGranted(true);
    setCurrentScreen('listening');
  };

  const handleSkipToDemo = () => {
    setMicGranted(false);
    setCurrentScreen('listening');
  };

  // Search the local preview catalog until a server-side music search is available.
  const executeSearch = async (queryText: string) => {
    setIsSearching(true);
    try {
      const response = await searchYouTubeMusic(queryText);
      setSearchResults(response.results);
      setSearchSource(response.source);
    } catch {
      setSearchResults(MOCK_CATALOG.slice(0, 4));
      setSearchSource('catalog-match');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInitiateFindSong = async (queryText: string) => {
    if (!queryText.trim()) return;
    setSearchQuery(queryText);
    setCurrentScreen('results');
    await executeSearch(queryText);
  };

  const handleSelectTrackForPlayer = (song: SongResult) => {
    if (previewTrack?.id === song.id) {
      setIsPlayingPreview(!isPlayingPreview);
    } else {
      setPreviewTrack(song);
      setIsPlayingPreview(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Bar - Strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentScreen(micGranted ? 'listening' : 'permission')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              FindTune
            </span>
          </button>

          {/* Zone 2: Navigation destinations */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setCurrentScreen('listening')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentScreen === 'listening' ? 'text-rose-400 font-bold' : ''
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => {
                if (searchResults.length === 0) {
                  handleInitiateFindSong('never gonna give you up');
                } else {
                  setCurrentScreen('results');
                }
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentScreen === 'results' ? 'text-rose-400 font-bold' : ''
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setCurrentScreen('promote')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentScreen === 'promote' ? 'text-rose-400 font-bold' : ''
              }`}
            >
              Promote Your Song
            </button>
          </nav>

          <span className="text-xs text-slate-400">Sample catalog preview</span>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center w-full pb-24 sm:pb-16 pt-2">
        {currentScreen === 'permission' && (
          <IntroPermission
            onPermissionGranted={handlePermissionGranted}
            onSkipToDemo={handleSkipToDemo}
          />
        )}

        {currentScreen === 'listening' && (
          <ListeningView
            onSearch={handleInitiateFindSong}
            isSearching={isSearching}
            isCreatingCheckout={false}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsView
            query={searchQuery}
            results={searchResults}
            source={searchSource}
            onNewSearch={() => setCurrentScreen('listening')}
            onSelectTrackForPlayer={handleSelectTrackForPlayer}
            activeSongId={previewTrack?.id}
            isPlaying={isPlayingPreview}
          />
        )}

        {currentScreen === 'promote' && <ArtistPromotion />}
      </main>


      {/* Audio Player Bar (when user previews tracks) */}
      <AudioPlayerBar
        song={previewTrack}
        isPlaying={isPlayingPreview}
        onTogglePlay={() => setIsPlayingPreview(!isPlayingPreview)}
        onClose={() => {
          setIsPlayingPreview(false);
          setPreviewTrack(null);
        }}
      />


      {/* Mobile Ergonomic Thumb Navigation Bar (Fixed Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-900 px-4 py-2">
        <div className="grid grid-cols-3 items-center gap-1 text-center">
          <button
            onClick={() => setCurrentScreen('listening')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentScreen === 'listening' ? 'text-rose-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Mic className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Discover</span>
          </button>

          <button
            onClick={() => {
              if (searchResults.length === 0) {
                handleInitiateFindSong('never gonna give you up');
              } else {
                setCurrentScreen('results');
              }
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentScreen === 'results' ? 'text-rose-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Results</span>
          </button>

          <button
            onClick={() => setCurrentScreen('promote')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              currentScreen === 'promote' ? 'text-rose-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Radio className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Promote</span>
          </button>

        </div>
      </div>
    </div>
  );
}
