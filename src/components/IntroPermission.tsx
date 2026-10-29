import React, { useState } from 'react';
import { Mic, Music, Sparkles, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface IntroPermissionProps {
  onPermissionGranted: () => void;
  onSkipToDemo: () => void;
}

export const IntroPermission: React.FC<IntroPermissionProps> = ({
  onPermissionGranted,
  onSkipToDemo,
}) => {
  const [requesting, setRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestMic = async () => {
    setRequesting(true);
    setErrorMessage(null);

    // Check if SpeechRecognition or getUserMedia is available
    const hasSpeechRec = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream right away after handshake
        stream.getTracks().forEach(track => track.stop());
      }
      onPermissionGranted();
    } catch (err: any) {
      console.warn('Microphone permission request note:', err);
      if (hasSpeechRec) {
        // Many browsers trigger speech permission on first SpeechRecognition.start()
        onPermissionGranted();
      } else {
        setErrorMessage(
          'Microphone access was denied or not supported in this iframe environment. You can still test with sample snippets or text input!'
        );
        // Still allow them to proceed after a moment
        setTimeout(() => {
          onPermissionGranted();
        }, 1500);
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 text-center max-w-md mx-auto">
      {/* Brand Icon Badge */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 p-[2px] shadow-2xl shadow-rose-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Music className="w-11 h-11 text-rose-500 animate-pulse" />
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
          <Mic className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
        Try FindTune with Sample Songs
      </h1>
      <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
        Speak or type a lyric snippet to search a small sample catalog. Live music search is not connected in this preview.
      </p>

      {/* Feature Bullet Points */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-8 text-left space-y-3.5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Mic className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Real-Time Speech-to-Text</div>
            <div className="text-[11px] text-slate-400">Use your browser’s speech recognition when available, or type the words instead.</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Sample Song Matching</div>
            <div className="text-[11px] text-slate-400">Try the sample song catalog. Live music search is coming later.</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Your Choice</div>
            <div className="text-[11px] text-slate-400">You can try the preview without giving microphone access.</div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="w-full mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-left text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="w-full space-y-3">
        <button
          onClick={handleRequestMic}
          disabled={requesting}
          className="w-full h-13 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Mic className={`w-4 h-4 ${requesting ? 'animate-bounce' : ''}`} />
          <span>{requesting ? 'Requesting Microphone...' : 'Grant Microphone Access'}</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>

        <button
          onClick={onSkipToDemo}
          className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          Or try with sample lyrics without microphone &rarr;
        </button>
      </div>

      <div className="mt-8 text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <span>Web Speech API Ready</span>
        <span>·</span>
        <span>Mobile Optimized</span>
        <span>·</span>
        <span>Sample Catalog Preview</span>
      </div>
    </div>
  );
};
