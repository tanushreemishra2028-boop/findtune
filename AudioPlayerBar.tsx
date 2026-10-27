import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ExternalLink, Volume2, X } from 'lucide-react';
import { SongResult } from '../types';

interface AudioPlayerBarProps {
  song: SongResult | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  song,
  isPlaying,
  onTogglePlay,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  // Synthesize musical ambient chords using Web Audio API when playing
  useEffect(() => {
    if (!song) return;

    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Play gentle preview chord arpeggio
        const rootFreq = 261.63; // C4
        const freqs = [rootFreq, rootFreq * 1.25, rootFreq * 1.5, rootFreq * 1.875];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + 2.8);
        });
      } catch (e) {
        // Audio synthesis fallback
      }

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onTogglePlay();
            return 0;
          }
          return prev + 2;
        });
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, song]);

  if (!song) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 px-4 max-w-xl mx-auto pointer-events-none">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-xl pointer-events-auto flex flex-col gap-2">
        {/* Progress scrub bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-rose-500 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Song Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={song.albumArt}
              alt={song.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{song.title}</div>
              <div className="text-[11px] text-slate-400 truncate">{song.artist}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-rose-500/30"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            <a
              href={song.youtubeMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Full Track</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
