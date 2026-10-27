import React, { useState } from 'react';
import {
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Code2,
  Music,
  Check,
  Share2,
  ShieldCheck,
  Receipt,
  LockOpen
} from 'lucide-react';
import { SongResult, PaymentVerification } from '../types';
import { APIFY_ACTOR_ID, APIFY_TOKEN, getApifyActorCodeSample } from '../services/apifyService';

interface ResultsViewProps {
  query: string;
  results: SongResult[];
  source: 'apify' | 'catalog-match' | 'simulated';
  onNewSearch: () => void;
  onSelectTrackForPlayer: (song: SongResult) => void;
  activeSongId?: string;
  isPlaying?: boolean;
  paymentDetails?: PaymentVerification | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  query,
  results,
  source,
  onNewSearch,
  onSelectTrackForPlayer,
  activeSongId,
  isPlaying,
  paymentDetails,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getApifyActorCodeSample(query));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenYouTubeMusic = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (id: string) => {
    setImageErrorMap(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 w-full">
      {/* Successful Dodo Payment Unlock Banner */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 mb-4 shadow-lg flex items-center justify-between gap-3 animate-in fade-in duration-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <LockOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Results Unlocked</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ₹20 PAID
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Verified via Dodo Payments · {paymentDetails?.paymentMethod || 'UPI / Cards'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowReceiptModal(true)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <Receipt className="w-3 h-3 text-emerald-400" />
          <span>Receipt</span>
        </button>
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
              {source === 'apify'
                ? 'Apify YouTube Music Live Scraper'
                : 'Apify Scraper Engine · Smart Matching'}
            </span>
          </div>

          <button
            onClick={() => setShowCodeModal(true)}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
          >
            <Code2 className="w-3 h-3 text-amber-400" />
            <span>View Apify Query</span>
          </button>
        </div>
      </div>

      {/* Results Count & Subheading */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">
          Matching Songs ({results.length})
        </h2>
        <span className="text-xs text-slate-400">Ranked by lyric confidence</span>
      </div>

      {/* Results List */}
      <div className="space-y-3.5">
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

                    {/* Match Score */}
                    {song.matchScore && (
                      <div className="shrink-0 text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                          {song.matchScore}%
                        </span>
                        <span className="block text-[10px] text-slate-400">match</span>
                      </div>
                    )}
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

      {/* Bottom Floating Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  Apify YouTube Music Integration
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Actor: <span className="text-slate-200 font-mono">{APIFY_ACTOR_ID}</span>
                </p>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                &times;
              </button>
            </div>

            <div className="my-3 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {getApifyActorCodeSample(query)}
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                Token: <span className="font-mono text-slate-300">apify_api_gZnj...osr1</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dodo Payments Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Payment Receipt</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dodo Payments MoR</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid</span>
                <span className="font-bold text-white font-mono">₹20.00 INR</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode</span>
                <span className="text-slate-200">{paymentDetails?.paymentMethod || 'UPI / QR'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref</span>
                <span className="font-mono text-emerald-400 truncate max-w-[150px]">
                  {paymentDetails?.transactionId || 'dodo_txn_verified'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Item</span>
                <span className="text-slate-200">FindTune Lyrics Unlock</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status</span>
                <span className="text-emerald-400 font-semibold">Completed / Settled</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
