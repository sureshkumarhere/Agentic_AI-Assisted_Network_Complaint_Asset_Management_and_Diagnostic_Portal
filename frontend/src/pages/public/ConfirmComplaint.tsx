import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTokenInfo, confirmResolution } from '../../api/complaints';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Shield,
  Home,
  Clock,
  User,
  Wrench,
  MessageSquare
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const ConfirmComplaint: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchTokenInfo(token)
        .then((data) => setTokenInfo(data))
        .catch((err) => setError(err.message || 'Invalid or expired confirmation link'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleAction = async (solved: boolean) => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await confirmResolution(token, solved, comment);
      setResultMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* NOC Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                MNNIT ALLAHABAD // NOC PORTAL
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                Student Resolution Verification
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 text-xs font-mono rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-noc-accent" />
            <span>Student View</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full bg-noc-panel border border-noc-border rounded-2xl shadow-noc overflow-hidden">
          {/* Header Panel */}
          <div className="bg-noc-surface px-6 py-6 border-b border-noc-border text-center">
            <div className="w-12 h-12 bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
              WORK ORDER RESOLUTION CONFIRMATION
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Verify if on-site technician repair solved your network fault
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-mono">
                <span className="w-6 h-6 border-2 border-noc-accent border-t-transparent rounded-full animate-spin inline-block mb-3" />
                <div>VERIFYING CONFIRMATION TOKEN...</div>
              </div>
            ) : resultMessage ? (
              <div className="bg-noc-emerald/10 border border-noc-emerald/30 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-noc-emerald mx-auto" />
                <h3 className="text-sm font-mono font-bold text-white uppercase">RESPONSE RECORDED</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{resultMessage}</p>
                <div className="pt-2">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-xs font-mono text-white transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            ) : error || !tokenInfo?.is_valid ? (
              <div className="bg-noc-amber/10 border border-noc-amber/30 rounded-xl p-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-noc-amber mx-auto" />
                <h3 className="text-sm font-mono font-bold text-white uppercase">TOKEN UNAVAILABLE</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {error || (tokenInfo?.is_used ? 'This confirmation link has already been submitted.' : 'This confirmation link has expired.')}
                </p>
                <div className="pt-2">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-xs font-mono text-white transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Ticket Details Panel */}
                <div className="bg-noc-bg p-4 rounded-xl border border-noc-border space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-noc-border/80">
                    <span className="text-slate-400">TICKET IDENTIFIER:</span>
                    <span className="font-bold text-noc-accent">#{tokenInfo.ticket_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ASSIGNED TECHNICIAN:</span>
                    <span className="text-white font-semibold">{tokenInfo.technician_name || 'Zonal Engineer'}</span>
                  </div>
                  {tokenInfo.solution && (
                    <div className="pt-2 border-t border-noc-border/80">
                      <span className="text-slate-400 block mb-1">RECORDED RESOLUTION:</span>
                      <p className="bg-noc-panel p-2.5 rounded-lg border border-noc-border text-slate-200 font-sans italic">
                        "{tokenInfo.solution}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                    Verification Comments / Remarks (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Provide any feedback regarding your internet speed, LAN connectivity, or technician response..."
                    className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
                  />
                </div>

                {/* Dual Resolution Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction(false)}
                    className="py-3 px-3 bg-noc-rose/15 hover:bg-noc-rose/25 text-noc-rose border border-noc-rose/40 text-xs font-mono font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Not Solved (Reopen)</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction(true)}
                    className="py-3 px-3 bg-noc-emerald hover:bg-emerald-600 text-white text-xs font-mono font-bold rounded-xl shadow-noc-emerald transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Issue Resolved</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} MNNIT ALLAHABAD IT SERVICES & NETWORK OPERATIONS // COMPUTER CENTRE
      </footer>
    </div>
  );
};
