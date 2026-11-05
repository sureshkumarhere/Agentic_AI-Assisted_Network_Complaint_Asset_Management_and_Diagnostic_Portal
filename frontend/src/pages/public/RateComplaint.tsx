import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTokenInfo, submitRating } from '../../api/complaints';
import { StarRating } from '../../components/complaints/StarRating';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Shield,
  Home,
  Award,
  Send
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const RateComplaint: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchTokenInfo(token)
        .then((data) => setTokenInfo(data))
        .catch((err) => setError(err.message || 'Invalid or expired rating link'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitRating(token, rating, feedback);
      setResultMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
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
                Technician Service Quality Audit
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
            <div className="w-12 h-12 bg-noc-gold/15 text-noc-gold border border-noc-gold/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
              RATE ON-SITE REPAIR QUALITY
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Help calibrate technician dispatch rankings and campus service SLA
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-mono">
                <span className="w-6 h-6 border-2 border-noc-accent border-t-transparent rounded-full animate-spin inline-block mb-3" />
                <div>LOADING TICKET AUDIT PARAMETERS...</div>
              </div>
            ) : resultMessage ? (
              <div className="bg-noc-emerald/10 border border-noc-emerald/30 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-noc-emerald mx-auto" />
                <h3 className="text-sm font-mono font-bold text-white uppercase">FEEDBACK REGISTERED</h3>
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
                  {error || (tokenInfo?.is_used ? 'This rating link has already been submitted.' : 'This rating link has expired.')}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ticket Details Panel */}
                <div className="bg-noc-bg p-4 rounded-xl border border-noc-border space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">TICKET IDENTIFIER:</span>
                    <span className="font-bold text-noc-accent">#{tokenInfo.ticket_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">TECHNICIAN:</span>
                    <span className="text-white font-semibold">{tokenInfo.technician_name || 'Zonal Engineer'}</span>
                  </div>
                </div>

                {/* Star Rating Section */}
                <div className="text-center py-2">
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-3 font-semibold">
                    Select Service Rating (1-5 Stars)
                  </label>
                  <div className="flex justify-center p-3 bg-noc-bg rounded-xl border border-noc-border inline-block mx-auto">
                    <StarRating value={rating} onChange={(val) => setRating(val)} size={32} />
                  </div>
                </div>

                {/* Written Feedback */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                    Service Review & Comments
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Rate technician promptness, technical diagnosis, and politeness..."
                    className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 bg-noc-highlight hover:bg-blue-600 disabled:opacity-50 text-white font-mono font-bold rounded-xl shadow-noc-glow transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Audit Feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Quality Rating</span>
                    </>
                  )}
                </button>
              </form>
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
