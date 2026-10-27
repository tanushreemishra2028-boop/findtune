export interface SongResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt: string;
  youtubeMusicUrl: string;
  matchedLyricsSnippet?: string;
  matchScore?: number; // 0 - 100
  releaseYear?: number;
  duration?: string;
  genre?: string;
  isIndependent?: boolean;
}

export interface ArtistPromotionForm {
  songName: string;
  artistName: string;
  trackLink: string;
  genre?: string;
  bioOrNote?: string;
}

export interface DodoCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  amount: number; // e.g. 20 (INR)
  currency: string; // 'INR'
  productId: string;
  query: string;
  status: 'pending' | 'succeeded' | 'failed';
  isSandbox?: boolean;
  customer?: {
    email?: string;
    name?: string;
    phone?: string;
  };
}

export interface PaymentVerification {
  paid: boolean;
  sessionId: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
  query?: string;
}

export type AppScreen = 'permission' | 'listening' | 'results' | 'promote';

