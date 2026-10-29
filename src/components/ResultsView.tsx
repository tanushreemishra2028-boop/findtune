import React, { useState } from 'react';
import {
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Music,
  LockOpen
} from 'lucide-react';
import { SongResult } from '../types';

interface ResultsViewProps {
  query: string;
  results: SongResult[];
  source: 'apify' | 'catalog-match' | 'simulated';
  onNewSearch: () => void;
  onSelectTrackForPlayer: (song: SongResult) => void;
  activeSongId?: string;
  isPlaying?: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  query,
  results,
  source,
  onNewSearch,
  onSelectTrackForPlayer,
  activeSongId,
  isPlaying,
}) => {
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const handleOpenYouTubeMusic = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (id: string) => {
    setImageErrorMap(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 w-full">
      {/* Preview status */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 mb-4 shadow-lg flex items-center justify-between gap-3 animate-in fade-in duration-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <LockOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Sample catalog preview</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                FREE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              These are sample matches. No payment was collected.
            </div>
          </div>
        </div>

      </div>

      {/* Search Header Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              Searched Lyrics Snippet
            </span>
            <p className="text-sm font-semibold text-rose-400 truncate mt-0.5">
              "{query}"
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNewSearch}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Snippet</span>
            </button>
          </div>
        </div>

        {/* Integration Source Indicator */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>
              {source === 'apify' ? 'Live music search' : 'Sample catalog'}
            </span>
          </div>

        </div>
      </div>

      {/* Results Count & Subheading */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">
          Matching Songs ({results.length})
        </h2>
        <span className="text-xs text-slate-400">Matches from available samples</span>
      </div>

      {/* Results List */}
      <div className="space-y-3.5">
        {results.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">
            No sample song matches those words yet. Try one of the suggested lyric snippets, or search YouTube Music directly.
            <a className="block mt-3 text-rose-400 underline" href={`https://music.youtube.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">
              Search YouTube Music
            </a>
          </div>
        )}
        {results.map((song, index) => {
          const isCurrentActive = activeSongId === song.id && isPlaying;
          const hasImageFailed = imageErrorMap[song.id];

          return (
            <div
              key={song.id}
              className={`group bg-slate-900/90 border rounded-2xl p-4 transition-all duration-200 hover:border-slate-700 shadow-md ${
                isCurrentActive ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Album Art with fallback and In-app play button overlay */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60 shadow-inner group/art">
                  {!hasImageFailed ? (
                    <img
                      src={song.albumArt}
                      alt={`${song.title} album art`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(song.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-2 text-center">
                      <Music className="w-6 h-6 text-rose-400 mb-1" />
                      <span className="text-[9px] text-slate-400 truncate w-full">{song.artist}</span>
                    </div>
                  )}

                  {/* Play in-app preview overlay */}
                  <button
                    onClick={() => onSelectTrackForPlayer(song)}
                    title="Play preview snippet in-app"
                    className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover/art:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg transform active:scale-90 transition-transform">
                      {isCurrentActive ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </div>
                  </button>

                  {/* Top Match Rank Badge */}
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-500 text-[9px] font-bold text-white tracking-wider uppercase shadow">
                      Best Match
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-300 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-emerald-400">Sample</span>
                  </div>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                    {song.album && <span className="truncate max-w-[120px]">{song.album}</span>}
                    {song.album && <span aria-hidden="true">·</span>}
                    {song.releaseYear && <span>{song.releaseYear}</span>}
                    {song.duration && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{song.duration}</span>
                      </>
                    )}
                  </div>

                  {/* Matched Lyrics Snippet */}
                  {song.matchedLyricsSnippet && (
                    <p className="text-xs text-slate-400 italic line-clamp-1 mt-2 bg-slate-950/40 rounded-md px-2 py-1 border border-slate-800/60">
                      "{song.matchedLyricsSnippet}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectTrackForPlayer(song)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isCurrentActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview Snippet</span>
                    </>
                  )}
                </button>

                {/* Core Specification Button: "Listen on YouTube Music" */}
                <button
                  onClick={() => handleOpenYouTubeMusic(song.youtubeMusicUrl)}
                  className="flex-1 max-w-xs h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Listen on YouTube Music</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
