import React, { useState } from 'react';
import { Send, Music2, CheckCircle2, Copy, Sparkles, Radio, ExternalLink, HelpCircle } from 'lucide-react';
import { ArtistPromotionForm } from '../types';
import { FEATURED_INDIE_TRACKS } from '../data/mockSongs';

export const ArtistPromotion: React.FC = () => {
  const [formData, setFormData] = useState<ArtistPromotionForm>({
    songName: '',
    artistName: '',
    trackLink: '',
    genre: 'Indie Pop',
    bioOrNote: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const PROMO_EMAIL = 'tanushree.mishra2028@mastersunion.org';
  const PROMO_SUBJECT = 'Song Promotion Request - FindTune';

  const constructMailBody = () => {
    return [
      `Hello FindTune Curators,`,
      ``,
      `I would like to submit my track for promotion on the FindTune discovery platform.`,
      ``,
      `--- Track Information ---`,
      `Song Title: ${formData.songName}`,
      `Artist Name: ${formData.artistName}`,
      `Track / Streaming Link: ${formData.trackLink}`,
      `Genre: ${formData.genre || 'Not specified'}`,
      `Artist Note / Story: ${formData.bioOrNote ? formData.bioOrNote : 'None'}`,
      ``,
      `Thank you for supporting independent creators!`,
      `Best regards,`,
      `${formData.artistName}`
    ].join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.songName || !formData.artistName || !formData.trackLink) return;

    const bodyContent = constructMailBody();
    const mailtoUrl = `mailto:${encodeURIComponent(PROMO_EMAIL)}?subject=${encodeURIComponent(
      PROMO_SUBJECT
    )}&body=${encodeURIComponent(bodyContent)}`;

    // Trigger the required mailto link
    window.location.href = mailtoUrl;

    setSubmitted(true);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(constructMailBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReset = () => {
    setFormData({
      songName: '',
      artistName: '',
      trackLink: '',
      genre: 'Indie Pop',
      bioOrNote: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/20 rounded-3xl p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] font-semibold text-rose-300 mb-2.5">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Independent Artist Spotlight</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Promote Your Song
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
            Get your music discovered by listeners searching for fresh sounds. Submit your track details directly to our editorial curators.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">
            Promotion Email Prompted!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
            Your default email client was opened with the pre-filled submission to{' '}
            <span className="text-rose-400 font-medium">{PROMO_EMAIL}</span>.
          </p>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-left mb-5">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>Prepared Submission Body</span>
              <button
                onClick={handleCopyBody}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono line-clamp-6 leading-relaxed">
              {constructMailBody()}
            </pre>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Submit Another Track
            </button>
            <button
              onClick={handleCopyBody}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Submission'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Song Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.songName}
              onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
              placeholder="e.g. Lucid Reverie"
              className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Artist Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              placeholder="e.g. Maya Chen"
              className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Track Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.trackLink}
              onChange={(e) => setFormData({ ...formData, trackLink: e.target.value })}
              placeholder="https://music.youtube.com/... or Spotify/SoundCloud"
              className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Indie Pop">Indie Pop</option>
                <option value="Lo-Fi / Bedroom Pop">Lo-Fi / Bedroom Pop</option>
                <option value="Synthwave / Electronic">Synthwave / Electronic</option>
                <option value="Alternative Rock">Alternative Rock</option>
                <option value="R&B / Soul">R&B / Soul</option>
                <option value="Hip-Hop / Rap">Hip-Hop / Rap</option>
                <option value="Folk / Acoustic">Folk / Acoustic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Editorial Destination
              </label>
              <div className="h-11 bg-slate-950/60 border border-slate-800 rounded-xl px-3 flex items-center text-xs text-slate-400 truncate">
                {PROMO_EMAIL}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Story / Hook Snippet (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.bioOrNote}
              onChange={(e) => setFormData({ ...formData, bioOrNote: e.target.value })}
              placeholder="Key lyrics, release story, or mood notes for the curators..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Open Email Client</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Opens your mail app pre-filled to <span className="text-slate-300 font-mono">{PROMO_EMAIL}</span>
            </p>
          </div>
        </form>
      )}

      {/* Featured Community Submissions / Inspiration */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Recently Featured Artists
          </h3>
          <span className="text-[11px] text-slate-400">FindTune Indie Roster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEATURED_INDIE_TRACKS.map((track) => (
            <div
              key={track.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-800 mb-2">
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                <span className="text-[10px] text-rose-400 block mt-1">{track.genre}</span>
              </div>

              <a
                href={track.youtubeMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Listen Track</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
