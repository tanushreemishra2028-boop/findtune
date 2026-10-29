import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Search,
  Sparkles,
  Volume2,
  ArrowRight,
  CornerDownLeft,
  Info,
  Lock,
  CreditCard,
  Smartphone,
  Music2,
  FileText
} from 'lucide-react';
import { POPULAR_SNIPPETS } from '../data/mockSongs';

interface ListeningViewProps {
  onSearch: (transcript: string) => void;
  isSearching: boolean;
  isCreatingCheckout?: boolean;
}

// Typing for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const ListeningView: React.FC<ListeningViewProps> = ({
  onSearch,
  isSearching,
  isCreatingCheckout = false,
}) => {
  const [activeTab, setActiveTab] = useState<'sing' | 'text'>('sing');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [silenceTimerActive, setSilenceTimerActive] = useState(false);
  const [audioVolumeBars, setAudioVolumeBars] = useState<number[]>([30, 60, 45, 80, 50, 65, 40]);

  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript((prev) => (prev ? `${prev} ${currentFinal}` : currentFinal).trim());
        }
        setInterimTranscript(currentInterim);

        // Auto-pause detection: If user stops speaking for 3.2s after some speech was captured
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        setSilenceTimerActive(true);
        silenceTimeoutRef.current = setTimeout(() => {
          setSilenceTimerActive(false);
        }, 3200);
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Automatically start listening upon entering this screen
      try {
        recognition.start();
      } catch (e) {
        // Handled
      }
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Animate audio wave bars while listening
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setAudioVolumeBars(
          Array.from({ length: 9 }, () => Math.floor(Math.random() * 70 + 20))
        );
      }, 140);
    } else {
      setAudioVolumeBars([20, 20, 20, 20, 20, 20, 20, 20, 20]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {}
    }
  };

  const handleStopAndSearch = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    const fullText = (transcript + ' ' + interimTranscript).trim();
    if (fullText) {
      onSearch(fullText);
    }
  };

  const handleSelectSnippet = (snippet: string) => {
    setTranscript(snippet);
    setInterimTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    onSearch(snippet);
  };

  const fullDisplayTranscript = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

  return (
    <div className="flex flex-col items-center justify-between min-h-[78vh] px-4 py-3 max-w-lg mx-auto w-full">
      {/* Preview notice */}
      <div className="w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">FindTune preview</span>
          <span className="text-slate-600">·</span>
          <span className="font-bold text-rose-400">Sample catalog only</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="w-full mt-4 mb-2 flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('sing')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sing'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" />
          <span>Sing / Hum Audio Snippet</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Broken Lyrics Text Box</span>
        </button>
      </div>

      {/* Central Pulsing Microphone Section (Sing/Hum Tab) */}
      {activeTab === 'sing' && (
        <div className="flex flex-col items-center my-4 animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center">
            {/* Animated Pulsing Halo Rings when listening */}
            {isListening && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-rose-500/15 animate-ping opacity-75" />
                <div className="absolute w-36 h-36 rounded-full bg-rose-500/25 animate-pulse" />
              </>
            )}

            {/* Core Interactive Mic Button */}
            <button
              onClick={toggleListening}
              aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
              className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-rose-500/40 scale-105'
                  : 'bg-slate-900 border-2 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-white animate-pulse" />
              ) : (
                <MicOff className="w-10 h-10 text-slate-400" />
              )}
            </button>
          </div>

          {/* Caption beneath mic */}
          <div className="mt-4 text-center">
            <h2 className="text-base font-bold text-white tracking-tight">
              Speak the lyrics or song snippet...
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isListening
                ? 'Sing or hum 3 to 10 words into your microphone'
                : 'Tap the mic above to speak or hum'}
            </p>
          </div>

          {/* Real-time Frequency Waveform Bars */}
          <div className="flex items-center justify-center gap-1.5 h-7 mt-3">
            {audioVolumeBars.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isListening ? 'bg-rose-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Broken Lyrics Description banner (Text Tab) */}
      {activeTab === 'text' && (
        <div className="my-3 text-center animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-white tracking-tight">
            Broken Lyrics & Misheard Snippets
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Type whatever words you remember — even phonetic spellings, misheard phrases, or chorus hooks.
          </p>
        </div>
      )}

      {/* Transcription & Input Card */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {activeTab === 'sing' ? 'Live Transcribed Speech' : 'Broken Lyrics Input'}
          </span>
          {silenceTimerActive && (
            <span className="text-[11px] text-amber-400 animate-pulse">Speech captured</span>
          )}
        </div>

        {/* Text Area for Spoken or Broken Lyrics */}
        <div className="relative">
          <textarea
            value={fullDisplayTranscript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setInterimTranscript('');
            }}
            placeholder={
              activeTab === 'sing'
                ? speechSupported
                  ? 'Your spoken lyrics appear here live... You can also edit.'
                  : 'Type lyrics snippet here (e.g., "never gonna give you up")...'
                : 'e.g. "i said ooh i am blinded by the lights" or "cause you are a sky full of stars"'
            }
            rows={3}
            className="w-full bg-slate-950/70 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 resize-none font-normal"
          />

          {fullDisplayTranscript && (
            <button
              onClick={() => {
                setTranscript('');
                setInterimTranscript('');
              }}
              className="absolute right-3 top-3 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search the sample catalog. */}
        <div className="mt-3.5">
          <button
            onClick={handleStopAndSearch}
            disabled={!fullDisplayTranscript.trim() || isSearching || isCreatingCheckout}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isCreatingCheckout ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing preview...</span>
              </>
            ) : isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching sample catalog...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Song</span>
                <span className="px-2 py-0.5 rounded-md bg-black/30 text-white font-mono text-xs">
                  Free preview
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>

          {/* Preview limitation */}
          <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
            <span>No payment is collected. Live music search is not connected yet.</span>
          </div>
        </div>
      </div>

      {/* Preset Lyric Snippet Suggestions (for Instant 1-Tap Testing) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            Popular lyric test snippets:
          </span>
          <span className="text-[11px] text-rose-400 font-semibold">1-Tap Discover</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pb-1">
          {POPULAR_SNIPPETS.slice(0, 5).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSnippet(item.lyrics)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 text-xs text-left transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>{item.label}</span>
              <CornerDownLeft className="w-2.5 h-2.5 text-slate-400" />
            </button>
          ))}
        </div>

        {!speechSupported && activeTab === 'sing' && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Web Speech API is inactive in this browser; switch to "Broken Lyrics Text Box" to type!</span>
          </div>
        )}
      </div>
    </div>
  );
};
