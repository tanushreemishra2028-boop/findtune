import { SongResult } from '../types';

export const POPULAR_SNIPPETS = [
  { label: "Never gonna give you up", lyrics: "never gonna give you up never gonna let you down" },
  { label: "Blinding Lights", lyrics: "i said ooh i'm blinded by the lights no i can't sleep until i feel your touch" },
  { label: "Bohemian Rhapsody", lyrics: "is this the real life is this just fantasy caught in a landslide" },
  { label: "Sky Full of Stars", lyrics: "cause you're a sky cause you're a sky full of stars i'm gonna give you my heart" },
  { label: "As It Was", lyrics: "in this world it's just us you know it's not the same as it was" },
  { label: "Stay with me", lyrics: "stay with me cause you're all i need this ain't love it's clear to see" },
  { label: "Espresso", lyrics: "now he's thinkin bout me every night oh is it that sweet i guess so" },
  { label: "Flowers", lyrics: "i can buy myself flowers write my name in the sand" }
];

export const MOCK_CATALOG: SongResult[] = [
  {
    id: "ytm-1",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    album: "Whenever You Need Somebody",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
    matchedLyricsSnippet: "Never gonna give you up, never gonna let you down, never gonna run around and desert you",
    matchScore: 99,
    releaseYear: 1987,
    duration: "3:33",
    genre: "Pop / Synthwave"
  },
  {
    id: "ytm-2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=4NRXx6U8ABQ",
    matchedLyricsSnippet: "I said, ooh, I'm blinded by the lights. No, I can't sleep until I feel your touch",
    matchScore: 97,
    releaseYear: 2020,
    duration: "3:20",
    genre: "Synthwave / R&B"
  },
  {
    id: "ytm-3",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=fJ9rUzIMcZQ",
    matchedLyricsSnippet: "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality",
    matchScore: 98,
    releaseYear: 1975,
    duration: "5:55",
    genre: "Classic Rock"
  },
  {
    id: "ytm-4",
    title: "A Sky Full of Stars",
    artist: "Coldplay",
    album: "Ghost Stories",
    albumArt: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=VPRjCeoBqrI",
    matchedLyricsSnippet: "'Cause you're a sky, 'cause you're a sky full of stars. I'm gonna give you my heart",
    matchScore: 96,
    releaseYear: 2014,
    duration: "4:28",
    genre: "Alternative / Dance"
  },
  {
    id: "ytm-5",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=H5v3kku4y6Q",
    matchedLyricsSnippet: "In this world, it's just us. You know it's not the same as it was",
    matchScore: 95,
    releaseYear: 2022,
    duration: "2:47",
    genre: "Indie Pop"
  },
  {
    id: "ytm-6",
    title: "Espresso",
    artist: "Sabrina Carpenter",
    album: "Short n' Sweet",
    albumArt: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Espresso+Sabrina+Carpenter",
    matchedLyricsSnippet: "Now he's thinkin' 'bout me every night, oh. Is it that sweet? I guess so, say you can't sleep, baby, I know",
    matchScore: 94,
    releaseYear: 2024,
    duration: "2:55",
    genre: "Pop"
  },
  {
    id: "ytm-7",
    title: "Stay With Me",
    artist: "Sam Smith",
    album: "In the Lonely Hour",
    albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/watch?v=pB-5XG-DbAA",
    matchedLyricsSnippet: "Won't you stay with me? 'Cause you're all I need. This ain't love, it's clear to see",
    matchScore: 95,
    releaseYear: 2014,
    duration: "2:52",
    genre: "Soul / Pop"
  },
  {
    id: "ytm-8",
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    albumArt: "https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Flowers+Miley+Cyrus",
    matchedLyricsSnippet: "I can buy myself flowers, write my name in the sand, talk to myself for hours",
    matchScore: 96,
    releaseYear: 2023,
    duration: "3:20",
    genre: "Pop / Disco"
  },
  {
    id: "ytm-9",
    title: "Midnight Echoes",
    artist: "Aura Lane",
    album: "Neon Drift EP",
    albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Midnight+Echoes+Aura+Lane",
    matchedLyricsSnippet: "Chasing after silhouettes through the rainy city streets, whisper to the night",
    matchScore: 91,
    releaseYear: 2025,
    duration: "3:14",
    genre: "Indie Electronic",
    isIndependent: true
  },
  {
    id: "ytm-10",
    title: "Velvet Horizon",
    artist: "Kian Rivera",
    album: "Solitude Sessions",
    albumArt: "https://images.unsplash.com/photo-1445985543470-41fdd6ce388d?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Velvet+Horizon+Kian+Rivera",
    matchedLyricsSnippet: "Under purple skies we drift away, holding dreams that cannot fade",
    matchScore: 89,
    releaseYear: 2025,
    duration: "3:42",
    genre: "Bedroom Lo-Fi",
    isIndependent: true
  }
];

export const FEATURED_INDIE_TRACKS: SongResult[] = [
  {
    id: "indie-1",
    title: "Lucid Reverie",
    artist: "Maya Chen",
    album: "Wandering Frequencies",
    albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Maya+Chen+Lucid+Reverie",
    matchedLyricsSnippet: "Catch me when the gravity lets go, floating in the kaleidoscope",
    matchScore: 94,
    releaseYear: 2025,
    duration: "3:18",
    genre: "Dream Pop",
    isIndependent: true
  },
  {
    id: "indie-2",
    title: "Static Pulse",
    artist: "The Binary Waves",
    album: "Analog Heartbeats",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=The+Binary+Waves+Static+Pulse",
    matchedLyricsSnippet: "One signal in the dark, light up the electric spark",
    matchScore: 92,
    releaseYear: 2025,
    duration: "4:05",
    genre: "Synthwave",
    isIndependent: true
  },
  {
    id: "indie-3",
    title: "Slow Burn River",
    artist: "Rowan Wilder",
    album: "Acoustic Tides",
    albumArt: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=500&q=80",
    youtubeMusicUrl: "https://music.youtube.com/search?q=Rowan+Wilder+Slow+Burn+River",
    matchedLyricsSnippet: "Carried by the gentle water, finding peace where we belong",
    matchScore: 90,
    releaseYear: 2026,
    duration: "3:30",
    genre: "Indie Folk",
    isIndependent: true
  }
];
