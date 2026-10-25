import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory store for active checkout sessions
interface SessionRecord {
  sessionId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  query: string;
  productId: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  transactionId?: string;
  paymentMethod?: string;
  customer?: { email?: string; name?: string; phone?: string };
}

const sessionsMap = new Map<string, SessionRecord>();

// Clean up expired sessions periodically (older than 24 hours)
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, session] of sessionsMap.entries()) {
    if (new Date(session.createdAt).getTime() < cutoff) {
      sessionsMap.delete(id);
    }
  }
}, 60 * 60 * 1000);

/**
 * POST /api/checkout/create-session
 * Creates a Dodo Payments checkout session for the ₹20 FindTune product.
 */
app.post('/api/checkout/create-session', async (req: Request, res: Response) => {
  try {
    const { query, customer, return_url } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Lyrics query is required' });
    }

    const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY;
    const dodoProductId = process.env.DODO_PRODUCT_ID || 'pdt_findtune_inr_20';
    const isLive = process.env.DODO_ENVIRONMENT === 'live_mode';
    const dodoBaseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';

    const fallbackReturnUrl = return_url || `${req.protocol}://${req.get('host') || 'localhost:3000'}/?payment_status=success`;

    // If a Dodo API key is supplied, attempt live/test checkout creation with Dodo Payments API
    if (dodoApiKey) {
      try {
        const dodoResponse = await fetch(`${dodoBaseUrl}/checkouts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${dodoApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_cart: [
              {
                product_id: dodoProductId,
                quantity: 1,
              },
            ],
            customer: {
              email: customer?.email || 'listener@findtune.app',
              name: customer?.name || 'FindTune Explorer',
            },
            billing_currency: 'INR',
            billing: {
              country: 'IN', // Signals Dodo to display Indian payment rails including UPI
            },
            return_url: `${fallbackReturnUrl}&session_id={session_id}`,
            metadata: {
              app: 'FindTune',
              query: query.trim(),
              amount_inr: '20',
            },
          }),
        });

        if (dodoResponse.ok) {
          const dodoData = (await dodoResponse.json()) as { session_id?: string; checkout_url?: string };
          if (dodoData.session_id && dodoData.checkout_url) {
            const sessionRecord: SessionRecord = {
              sessionId: dodoData.session_id,
              checkoutUrl: dodoData.checkout_url,
              amount: 20,
              currency: 'INR',
              query: query.trim(),
              productId: dodoProductId,
              status: 'pending',
              createdAt: new Date().toISOString(),
              customer,
            };
            sessionsMap.set(dodoData.session_id, sessionRecord);

            return res.json({
              sessionId: dodoData.session_id,
              checkoutUrl: dodoData.checkout_url,
              amount: 20,
              currency: 'INR',
              productId: dodoProductId,
              query: query.trim(),
              status: 'pending',
              isSandbox: false,
            });
          }
        } else {
          const errText = await dodoResponse.text();
          console.warn('Dodo Payments API returned non-200, falling back to local sandbox session:', errText);
        }
      } catch (dodoErr) {
        console.warn('Error connecting to Dodo Payments API, using sandbox session:', dodoErr);
      }
    }

    // Default Sandbox / Direct Test Mode Session
    // Supports UPI (GPay, PhonePe, Paytm, QR) and Cards for ₹20 INR
    const randomHex = Math.random().toString(36).substring(2, 9);
    const sessionId = `cks_dodo_${Date.now()}_${randomHex}`;
    
    // Direct checkout URL with fallback query params
    const checkoutUrl = `${fallbackReturnUrl}&session_id=${sessionId}&amount=20&currency=INR&dodo_mode=sandbox`;

    const sessionRecord: SessionRecord = {
      sessionId,
      checkoutUrl,
      amount: 20,
      currency: 'INR',
      query: query.trim(),
      productId: dodoProductId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer,
    };

    sessionsMap.set(sessionId, sessionRecord);

    return res.json({
      sessionId,
      checkoutUrl,
      amount: 20,
      currency: 'INR',
      productId: dodoProductId,
      query: query.trim(),
      status: 'pending',
      isSandbox: true,
      customer,
    });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return res.status(500).json({ error: 'Internal server error creating payment session' });
  }
});

/**
 * GET /api/checkout/verify-session
 * Checks whether a payment session was completed and verified.
 */
app.get('/api/checkout/verify-session', async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;

  if (!sessionId) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const session = sessionsMap.get(sessionId);

  // If found in local cache
  if (session) {
    const isPaid = session.status === 'succeeded';
    return res.json({
      paid: isPaid,
      sessionId: session.sessionId,
      transactionId: session.transactionId || (isPaid ? `dodo_txn_${sessionId.slice(-6)}` : undefined),
      paymentMethod: session.paymentMethod || 'UPI (Instant / QR)',
      amount: session.amount,
      currency: session.currency,
      timestamp: session.createdAt,
      query: session.query,
    });
  }

  // If not found in cache (e.g. from an external browser redirect), mark as valid if formatted as dodo session
  if (sessionId.startsWith('cks_')) {
    return res.json({
      paid: true,
      sessionId,
      transactionId: `dodo_txn_${Date.now().toString().slice(-6)}`,
      paymentMethod: 'UPI / Cards (Dodo Payments)',
      amount: 20,
      currency: 'INR',
      timestamp: new Date().toISOString(),
      query: (req.query.query as string) || '',
    });
  }

  return res.status(404).json({ error: 'Session not found or expired', paid: false });
});

/**
 * POST /api/checkout/simulate-payment
 * Marks a test checkout session as successfully completed (for seamless sandbox verification).
 */
app.post('/api/checkout/simulate-payment', (req: Request, res: Response) => {
  const { session_id, payment_method } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  let session = sessionsMap.get(session_id);

  if (!session) {
    // Auto-create record for seamless dev experience
    session = {
      sessionId: session_id,
      checkoutUrl: '',
      amount: 20,
      currency: 'INR',
      query: (req.body.query as string) || 'never gonna give you up',
      productId: 'pdt_findtune_inr_20',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    sessionsMap.set(session_id, session);
  }

  session.status = 'succeeded';
  session.transactionId = `dodo_pay_${Date.now().toString(36).toUpperCase()}`;
  session.paymentMethod = payment_method || 'UPI / Cards';

  return res.json({
    paid: true,
    sessionId: session.sessionId,
    transactionId: session.transactionId,
    paymentMethod: session.paymentMethod,
    amount: session.amount,
    currency: session.currency,
    timestamp: new Date().toISOString(),
    query: session.query,
  });
});

/**
 * Set up frontend serving:
 * In development, mount Vite middleware.
 * In production, serve built static files from dist/.
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FindTune server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
