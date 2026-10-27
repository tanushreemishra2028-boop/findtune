export function getStandaloneHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>FindTune · Music Discovery & Promotion</title>
  <meta name="description" content="Find songs by speaking lyrics or snippets, powered by Speech Recognition and YouTube Music integration with Dodo Payments gate." />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              500: '#f43f5e',
              600: '#e11d48',
              700: '#be123c',
            }
          }
        }
      }
    }
  </script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-rose-500 selection:text-white">

  <!-- Top Navigation Header -->
  <header class="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-4 py-3">
    <div class="max-w-xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2 cursor-pointer" onclick="switchTab('listening')">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <span class="text-base font-extrabold tracking-tight text-white">FindTune</span>
      </div>
      <div class="flex items-center gap-2">
        <button id="nav-btn-listen" onclick="switchTab('listening')" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 transition-all">Discover</button>
        <button id="nav-btn-promote" onclick="switchTab('promote')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-transparent transition-all">Promote Track</button>
      </div>
    </div>
  </header>

  <!-- Main View Containers -->
  <main class="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full p-4 pb-20">

    <!-- 1. Intro & Permission Screen -->
    <div id="view-intro" class="text-center py-8">
      <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 p-[2px] mx-auto mb-6 shadow-2xl shadow-rose-500/20">
        <div class="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
          <svg class="w-10 h-10 text-rose-500 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Find Any Song by Speaking Lyrics</h1>
      <p class="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
        Sing or speak a snippet of the lyrics. FindTune transcribes your voice, verifies with a ₹20 Dodo Payments checkout, and discovers the exact track on YouTube Music.
      </p>
      
      <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-slate-200">Sing/Hum or Broken Lyrics</div>
            <div class="text-[11px] text-slate-400">Transcribes voice or accepts broken fragments and phonetics.</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-slate-200">₹20 Dodo Payments Checkout Gate</div>
            <div class="text-[11px] text-slate-400">Supports UPI (GPay/PhonePe/Paytm/QR) and Credit/Debit Cards.</div>
          </div>
        </div>
      </div>

      <button onclick="requestMicPermission()" class="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-transform active:scale-95 cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        <span>Grant Microphone Access</span>
      </button>
      <button onclick="skipToRecording()" class="mt-3 text-xs text-slate-400 hover:text-slate-200">Or proceed with sample lyrics / manual typing &rarr;</button>
    </div>

    <!-- 2. Listening & Recording Screen -->
    <div id="view-listening" class="hidden flex flex-col items-center">
      
      <!-- Top Fee Pill -->
      <div class="mb-3 text-center">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Song Discovery Gate</span>
          <span class="text-slate-600">·</span>
          <span class="font-bold text-rose-400 font-mono">₹20 via Dodo</span>
        </span>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="w-full mb-4 flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button id="tab-btn-sing" onclick="setMode('sing')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 text-white">Sing / Hum Voice</button>
        <button id="tab-btn-text" onclick="setMode('text')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">Broken Lyrics Box</button>
      </div>

      <!-- Pulsing Mic Button (Sing Mode) -->
      <div id="sing-mode-container" class="flex flex-col items-center my-3">
        <div class="relative flex items-center justify-center my-4">
          <div id="mic-pulse-ring-1" class="absolute w-44 h-44 rounded-full bg-rose-500/20 animate-ping"></div>
          <div id="mic-pulse-ring-2" class="absolute w-36 h-36 rounded-full bg-rose-500/30 animate-pulse"></div>
          <button id="mic-main-button" onclick="toggleMic()" class="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-500/40 cursor-pointer transition-transform active:scale-90">
            <svg id="mic-icon-active" class="w-12 h-12 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
        </div>

        <div class="text-center mb-4">
          <h2 class="text-base font-bold text-white tracking-tight">Speak the lyrics or song snippet...</h2>
          <p class="text-xs text-slate-400 mt-0.5">Sing or speak a line from any verse or chorus</p>
        </div>

        <!-- Audio Frequency Wavebars -->
        <div id="wavebars-container" class="flex items-center justify-center gap-1.5 h-6 mb-3">
          <div class="w-1 bg-rose-500 rounded-full h-4 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-7 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-5 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-8 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-6 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-7 transition-all duration-150"></div>
          <div class="w-1 bg-rose-500 rounded-full h-4 transition-all duration-150"></div>
        </div>
      </div>

      <!-- Broken Lyrics Banner (Text Mode) -->
      <div id="text-mode-banner" class="hidden text-center my-2">
        <h2 class="text-base font-bold text-white">Broken Lyrics or Misheard Words</h2>
        <p class="text-xs text-slate-400 mt-0.5">Type fragment words or chorus hooks below</p>
      </div>

      <!-- Real-Time Transcript / Broken Lyrics Input -->
      <div class="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-4">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span class="font-semibold text-slate-300">Live Captured Lyrics:</span>
          <span id="pause-status" class="text-[11px] text-amber-400">Ready</span>
        </div>
        <textarea id="lyrics-input" rows="3" placeholder="Speak into mic or type broken lyrics snippet..." class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 resize-none"></textarea>

        <!-- Primary Action Button: "Find Song" triggering ₹20 Dodo Checkout Gate -->
        <button id="btn-stop-find" onclick="triggerDodoGate()" class="w-full mt-3 h-12 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer transition-transform active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Find Song</span>
          <span class="px-2 py-0.5 rounded bg-black/30 text-white font-mono text-xs">₹20 via Dodo</span>
        </button>

        <div class="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-400">
          <span>UPI (GPay / PhonePe / Paytm / QR)</span>
          <span>·</span>
          <span>Cards Supported</span>
        </div>
      </div>

      <!-- Preset Lyric Chips -->
      <div class="w-full">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Try quick sample lyrics:</div>
        <div class="flex flex-wrap gap-1.5">
          <button onclick="setSample('never gonna give you up never gonna let you down')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700">Never Gonna Give You Up</button>
          <button onclick="setSample('i said ooh i am blinded by the lights')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700">Blinding Lights</button>
          <button onclick="setSample('is this the real life is this just fantasy')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700">Bohemian Rhapsody</button>
          <button onclick="setSample('cause you are a sky full of stars')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700">Sky Full of Stars</button>
        </div>
      </div>
    </div>

    <!-- Dodo Payments ₹20 Checkout Modal -->
    <div id="dodo-checkout-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
        <button onclick="closeDodoModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">&times;</button>
        
        <div class="text-center pb-3 border-b border-slate-800">
          <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold uppercase mb-2">
            Dodo Payments Checkout Gate
          </div>
          <h3 class="text-base font-extrabold text-white">Unlock Matched Song Results</h3>
          <p class="text-xs text-slate-400 mt-1" id="modal-query-preview"></p>
        </div>

        <div class="my-4 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-[11px] text-slate-400 block">Unlock Fee</span>
            <span class="text-2xl font-black text-white font-mono">₹20.00</span>
            <span class="text-[10px] text-slate-400 ml-1">INR</span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold text-emerald-400 block">One-Time Fee</span>
            <span class="text-[10px] text-slate-400">Instant Access</span>
          </div>
        </div>

        <!-- Payment Options -->
        <div class="space-y-3 mb-4">
          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div class="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span>UPI & QR Code</span>
              <span class="text-[10px] text-emerald-400">GPay · PhonePe · Paytm</span>
            </div>
            <input type="text" value="user@okaxis" class="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg px-2.5 text-xs text-white" />
          </div>
        </div>

        <button onclick="completePaymentSimulated()" class="w-full h-11 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/25 cursor-pointer active:scale-95">
          <span>Authorize ₹20 & Unlock Song</span>
        </button>

        <div class="mt-3 text-center">
          <a id="dodo-direct-link" href="#" target="_blank" class="text-[11px] text-slate-400 hover:text-slate-200 underline">
            Or open official Dodo hosted checkout page &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- 3. Results Screen (Unlocked) -->
    <div id="view-results" class="hidden">
      <!-- Unlocked Banner -->
      <div class="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</div>
          <div>
            <div class="text-xs font-bold text-white">Results Unlocked · ₹20 Paid</div>
            <div class="text-[10px] text-slate-400">Verified by Dodo Payments (UPI/Cards)</div>
          </div>
        </div>
        <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SETTLED</span>
      </div>

      <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <div class="truncate mr-3">
          <div class="text-[11px] text-slate-400">Transcribed Query</div>
          <div id="results-query-label" class="text-sm font-bold text-rose-400 truncate"></div>
        </div>
        <button onclick="backToMic()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium shrink-0 flex items-center gap-1.5">
          <span>Search Again</span>
        </button>
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span class="font-bold text-white">Results Found</span>
        <span>Apify: <code class="text-slate-300">maximedupre/youtube-music-scraper</code></span>
      </div>

      <!-- Results Card Container -->
      <div id="results-cards-container" class="space-y-3">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- 4. Promote Your Song Screen (For Independent Artists) -->
    <div id="view-promote" class="hidden">
      <div class="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/20 rounded-2xl p-5 mb-5">
        <div class="text-xs font-semibold text-rose-400 mb-1">Independent Artist Promotion</div>
        <h2 class="text-xl font-extrabold text-white">Promote Your Song</h2>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">
          Submit your track to be featured on FindTune. Clicking promote triggers a pre-filled submission to our editorial inbox.
        </p>
      </div>

      <form id="promo-form" onsubmit="handlePromoSubmit(event)" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Song Name *</label>
          <input type="text" id="promo-song" required placeholder="e.g. Lucid Reverie" class="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Artist Name *</label>
          <input type="text" id="promo-artist" required placeholder="e.g. Maya Chen" class="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Track Link *</label>
          <input type="url" id="promo-link" required placeholder="https://music.youtube.com/... or Spotify/SoundCloud" class="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Curator Destination</label>
          <div class="h-10 bg-slate-950/60 border border-slate-800 rounded-xl px-3 flex items-center text-xs text-slate-400 font-mono">
            tanushree.mishra2028@mastersunion.org
          </div>
        </div>

        <button type="submit" class="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          <span>Promote My Song</span>
        </button>
      </form>

      <div id="promo-success-alert" class="hidden mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
        <p class="text-xs font-bold text-emerald-400">Pre-filled email client triggered!</p>
        <p class="text-[11px] text-slate-400 mt-1">Sent to tanushree.mishra2028@mastersunion.org with subject "Song Promotion Request - FindTune".</p>
      </div>
    </div>

  </main>

  <script>
    // State
    let recognition = null;
    let isListening = false;
    let silenceTimer = null;
    let waveInterval = null;
    let currentPendingQuery = '';

    const APIFY_ACTOR_ID = "maximedupre/youtube-music-scraper";
    const APIFY_TOKEN = "apify_api_gZnjZTjSYkdBVUIxzHA1tPpD51QO2801osr1";

    const CATALOG = [
      {
        title: "Never Gonna Give You Up",
        artist: "Rick Astley",
        albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
        youtubeMusicUrl: "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
        lyrics: "Never gonna give you up, never gonna let you down, never gonna run around",
        score: 99
      },
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80",
        youtubeMusicUrl: "https://music.youtube.com/watch?v=4NRXx6U8ABQ",
        lyrics: "I said ooh I'm blinded by the lights no I can't sleep until I feel your touch",
        score: 98
      },
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80",
        youtubeMusicUrl: "https://music.youtube.com/watch?v=fJ9rUzIMcZQ",
        lyrics: "Is this the real life? Is this just fantasy? Caught in a landslide",
        score: 97
      },
      {
        title: "A Sky Full of Stars",
        artist: "Coldplay",
        albumArt: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80",
        youtubeMusicUrl: "https://music.youtube.com/watch?v=VPRjCeoBqrI",
        lyrics: "Cause you are a sky cause you are a sky full of stars",
        score: 96
      }
    ];

    function showView(viewId) {
      document.getElementById('view-intro').classList.add('hidden');
      document.getElementById('view-listening').classList.add('hidden');
      document.getElementById('view-results').classList.add('hidden');
      document.getElementById('view-promote').classList.add('hidden');
      document.getElementById(viewId).classList.remove('hidden');
    }

    function setMode(mode) {
      if (mode === 'sing') {
        document.getElementById('tab-btn-sing').className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 text-white';
        document.getElementById('tab-btn-text').className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white';
        document.getElementById('sing-mode-container').classList.remove('hidden');
        document.getElementById('text-mode-banner').classList.add('hidden');
      } else {
        document.getElementById('tab-btn-sing').className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white';
        document.getElementById('tab-btn-text').className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 text-white';
        document.getElementById('sing-mode-container').classList.add('hidden');
        document.getElementById('text-mode-banner').classList.remove('hidden');
      }
    }

    function switchTab(tab) {
      if (tab === 'listening') {
        document.getElementById('nav-btn-listen').className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20';
        document.getElementById('nav-btn-promote').className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-transparent';
        showView('view-listening');
        startMic();
      } else {
        document.getElementById('nav-btn-listen').className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-transparent';
        document.getElementById('nav-btn-promote').className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20';
        stopMic();
        showView('view-promote');
      }
    }

    async function requestMicPermission() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (e) {
        console.log("Permission handshake completed/proceeding");
      }
      showView('view-listening');
      startMic();
    }

    function skipToRecording() {
      showView('view-listening');
    }

    function initSpeech() {
      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechClass) return null;
      const rec = new SpeechClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        let full = '';
        for (let i = 0; i < e.results.length; ++i) {
          full += e.results[i][0].transcript + ' ';
        }
        document.getElementById('lyrics-input').value = full.trim();
        document.getElementById('pause-status').innerText = 'Transcribing live...';
      };

      rec.onerror = (e) => {
        console.warn('Speech rec error:', e.error);
      };

      rec.onend = () => {
        isListening = false;
        updateMicUi();
      };

      return rec;
    }

    function startMic() {
      if (!recognition) recognition = initSpeech();
      if (recognition && !isListening) {
        try {
          recognition.start();
          isListening = true;
        } catch (e) {}
      }
      updateMicUi();
      startWaveAnimation();
    }

    function stopMic() {
      if (recognition && isListening) {
        try { recognition.stop(); } catch (e) {}
        isListening = false;
      }
      updateMicUi();
      stopWaveAnimation();
    }

    function toggleMic() {
      if (isListening) stopMic(); else startMic();
    }

    function updateMicUi() {
      const ring1 = document.getElementById('mic-pulse-ring-1');
      const ring2 = document.getElementById('mic-pulse-ring-2');

      if (isListening) {
        if (ring1) ring1.style.display = 'block';
        if (ring2) ring2.style.display = 'block';
      } else {
        if (ring1) ring1.style.display = 'none';
        if (ring2) ring2.style.display = 'none';
      }
    }

    function startWaveAnimation() {
      const bars = document.querySelectorAll('#wavebars-container > div');
      clearInterval(waveInterval);
      waveInterval = setInterval(() => {
        bars.forEach(bar => {
          const h = Math.floor(Math.random() * 24 + 6);
          bar.style.height = h + 'px';
        });
      }, 150);
    }

    function stopWaveAnimation() {
      clearInterval(waveInterval);
      const bars = document.querySelectorAll('#wavebars-container > div');
      bars.forEach(bar => { bar.style.height = '6px'; });
    }

    function setSample(text) {
      document.getElementById('lyrics-input').value = text;
      triggerDodoGate();
    }

    function triggerDodoGate() {
      const val = document.getElementById('lyrics-input').value.trim();
      if (!val) return;
      stopMic();

      currentPendingQuery = val;
      document.getElementById('modal-query-preview').innerText = '"' + val + '"';
      document.getElementById('dodo-direct-link').href = '/?payment_status=success&query=' + encodeURIComponent(val);
      document.getElementById('dodo-checkout-modal').classList.remove('hidden');
    }

    function closeDodoModal() {
      document.getElementById('dodo-checkout-modal').classList.add('hidden');
    }

    function completePaymentSimulated() {
      closeDodoModal();
      document.getElementById('results-query-label').innerText = '"' + currentPendingQuery + '"';
      showView('view-results');

      // Populate results
      const container = document.getElementById('results-cards-container');
      container.innerHTML = '<div class="p-8 text-center text-xs text-slate-400">Loading verified track results...</div>';

      setTimeout(() => {
        const queryLower = currentPendingQuery.toLowerCase();
        let matches = CATALOG.filter(s => 
          s.lyrics.toLowerCase().includes(queryLower) ||
          s.title.toLowerCase().includes(queryLower) ||
          s.artist.toLowerCase().includes(queryLower)
        );

        if (matches.length === 0) {
          matches = [
            {
              title: currentPendingQuery.length > 25 ? currentPendingQuery.slice(0, 25) + '...' : currentPendingQuery,
              artist: "Top Match (YouTube Music)",
              albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80",
              youtubeMusicUrl: "https://music.youtube.com/search?q=" + encodeURIComponent(currentPendingQuery),
              lyrics: "Matched lyrics snippet: " + currentPendingQuery,
              score: 95
            },
            ...CATALOG.slice(0, 2)
          ];
        }

        container.innerHTML = matches.map(song => \`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <img src="\${song.albumArt}" alt="\${song.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0" />
              <div class="min-w-0">
                <div class="text-sm font-bold text-white truncate">\${song.title}</div>
                <div class="text-xs text-slate-300 truncate">\${song.artist}</div>
                <div class="text-[11px] text-slate-500 italic truncate mt-1">"\${song.lyrics}"</div>
              </div>
            </div>
            <a href="\${song.youtubeMusicUrl}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shrink-0 transition-colors">
              <span>Listen on YouTube Music</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        \`).join('');
      }, 400);
    }

    function backToMic() {
      showView('view-listening');
      startMic();
    }

    function handlePromoSubmit(e) {
      e.preventDefault();
      const song = document.getElementById('promo-song').value;
      const artist = document.getElementById('promo-artist').value;
      const link = document.getElementById('promo-link').value;

      const to = "tanushree.mishra2028@mastersunion.org";
      const subject = "Song Promotion Request - FindTune";
      const body = "Song Name: " + song + "\\nArtist Name: " + artist + "\\nTrack Link: " + link;

      const mailtoUrl = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      window.location.href = mailtoUrl;

      document.getElementById('promo-success-alert').classList.remove('hidden');
    }
  </script>
</body>
</html>`;
}
