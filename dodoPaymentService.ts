import { DodoCheckoutSession, PaymentVerification } from '../types';

const STORAGE_KEY = 'findtune_dodo_payment_session';
const UNLOCKED_KEY = 'findtune_unlocked_queries';

/**
 * Calls backend API to create a ₹20 Dodo Payments checkout session.
 */
export async function createDodoCheckoutSession(
  query: string,
  customer?: { email?: string; name?: string; phone?: string }
): Promise<DodoCheckoutSession> {
  const response = await fetch('/api/checkout/create-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      customer: customer || {
        email: 'listener@findtune.app',
        name: 'Music Explorer',
      },
      return_url: `${window.location.origin}/?payment_status=success`,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create Dodo checkout session');
  }

  const session: DodoCheckoutSession = await response.json();

  // Persist in session storage so returns from Dodo checkout retain query and session ID
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId: session.sessionId,
        query: session.query,
        checkoutUrl: session.checkoutUrl,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn('Could not store session in sessionStorage', e);
  }

  return session;
}

/**
 * Verifies a Dodo payment session with the backend.
 */
export async function verifyDodoPayment(sessionId: string): Promise<PaymentVerification> {
  const response = await fetch(`/api/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`);
  
  if (!response.ok) {
    throw new Error('Failed to verify payment with Dodo Payments');
  }

  const data: PaymentVerification = await response.json();
  
  if (data.paid && data.query) {
    markQueryUnlocked(data.query, data.sessionId);
  }

  return data;
}

/**
 * Simulates completing the Dodo payment in sandbox/demo mode.
 */
export async function completeTestPayment(sessionId: string): Promise<PaymentVerification> {
  const response = await fetch('/api/checkout/simulate-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error('Could not simulate payment');
  }

  const data: PaymentVerification = await response.json();
  if (data.query) {
    markQueryUnlocked(data.query, sessionId);
  }
  return data;
}

/**
 * Checks if a stored session exists in session storage.
 */
export function getStoredDodoSession(): { sessionId: string; query: string; checkoutUrl: string } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clears stored payment session.
 */
export function clearStoredDodoSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Marks a lyrics query as unlocked after verified payment.
 */
export function markQueryUnlocked(query: string, sessionId: string): void {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[query.trim().toLowerCase()] = {
      unlockedAt: new Date().toISOString(),
      sessionId,
      amount: 20,
      currency: 'INR',
    };
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(map));
  } catch {}
}

/**
 * Checks if a lyrics query was previously unlocked.
 */
export function isQueryUnlocked(query: string): boolean {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw);
    return Boolean(map[query.trim().toLowerCase()]);
  } catch {
    return false;
  }
}
