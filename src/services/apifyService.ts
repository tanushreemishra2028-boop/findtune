import { SongResult } from '../types';
import { MOCK_CATALOG } from '../data/mockSongs';

export const APIFY_ACTOR_ID = 'maximedupre/youtube-music-scraper';
export const APIFY_TOKEN = '';

export interface SearchOptions {
  forceMock?: boolean;
}

// GitHub/Vercel static hosting has no server-side token or checkout. This
// preview deliberately searches only the supplied sample catalog.
export async function searchYouTubeMusic(
  lyricsQuery: string,
  _options: SearchOptions = {}
): Promise<{ results: SongResult[]; source: 'catalog-match' }> {
  const query = lyricsQuery.trim().toLowerCase();
  if (!query) return { results: [], source: 'catalog-match' };

  const tokens = query.split(/\s+/).filter(token => token.length > 2);
  const results = MOCK_CATALOG.filter(song => {
    const text = `${song.title} ${song.artist} ${song.matchedLyricsSnippet || ''}`.toLowerCase();
    return text.includes(query) || (tokens.length > 0 && tokens.every(token => text.includes(token)));
  });
  return { results, source: 'catalog-match' };
}

export function getApifyActorCodeSample(_query?: string) {
  return 'Live music search is unavailable in this static preview.';
}
