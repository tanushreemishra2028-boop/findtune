import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Lock,
  Smartphone,
  Sparkles,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { DodoCheckoutSession, PaymentVerification } from '../types';
import { completeTestPayment } from '../services/dodoPaymentService';

interface DodoCheckoutModalProps {
  session: DodoCheckoutSession | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (verification: PaymentVerification) => void;
}

export const DodoCheckoutModal: React.FC<DodoCheckoutModalProps> = ({
  session,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !session) return null;

  const handleExternalRedirect = () => {
    if (!session.checkoutUrl) return;
    // Open Dodo checkout in a new tab or navigate
    window.open(session.checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSimulatePayment = async (methodName: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Simulate network processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 900));

      const verification = await completeTestPayment(session.sessionId);
      verification.paymentMethod = methodName;
      verification.query = session.query;
      
      onPaymentSuccess(verification);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header / Brand Strip */}
        <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/40 p-5 border-b border-slate-800/80 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              Dodo Payments Secure Checkout
            </span>
            {session.isSandbox && (
              <span className="text-[10px] text-amber-400 font-mono">Test Sandbox</span>
            )}
          </div>

          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Unlock Matched Song Results
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
            Query: <span className="text-rose-400 font-semibold italic">"{session.query}"</span>
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-3.5 flex items-baseline justify-between bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Due</span>
              <span className="text-2xl font-black text-white font-mono tracking-tight">₹20.00</span>
              <span className="text-[10px] text-slate-400 ml-1">INR · Incl. GST</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-semibold block">One-time Unlock</span>
              <span className="text-[10px] text-slate-400">Instant Access</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedMethod === 'upi'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI & QR</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedMethod === 'card'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cards (Debit/Credit)</span>
            </button>
          </div>

          {/* Selected Method Details */}
          {selectedMethod === 'upi' ? (
            <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  UPI Payment Rails
                </span>
                <span className="text-[10px] text-slate-400">Instant · 0% Fee</span>
              </div>

              {/* Supported UPI Apps Row */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {['Google Pay', 'PhonePe', 'Paytm', 'Cred / BHIM'].map((app) => (
                  <div
                    key={app}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300 truncate"
                  >
                    {app}
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@oksbi"
                  className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  Card Payment
                </span>
                <span className="text-[10px] text-slate-400">Visa · Mastercard · RuPay</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="•••"
                    className="h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action 1: Instant Pay / Complete Checkout (Seamless inside App) */}
          <button
            onClick={() => handleSimulatePayment(selectedMethod === 'upi' ? 'UPI (GPay / PhonePe)' : 'Debit/Credit Card')}
            disabled={isProcessing}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing ₹20 via Dodo Payments...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹20 & Unlock Song</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Action 2: Redirect to external Dodo hosted checkout page */}
          <div className="text-center pt-1">
            <button
              onClick={handleExternalRedirect}
              className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Or open in dedicated Dodo Payments hosted window</span>
              <ExternalLink className="w-3 h-3 text-rose-400" />
            </button>
          </div>

          {/* Trust badges footer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span className="font-mono">NPCI / UPI 2.0 Ready</span>
            <span>Dodo Payments MoR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
