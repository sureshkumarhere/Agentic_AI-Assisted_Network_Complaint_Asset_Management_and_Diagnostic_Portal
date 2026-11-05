// MODULE: Complaint Management (Part 2) - this file belongs to the code for this module.
// Public RateComplaint page allowing students to submit 1-5 star ratings and reviews for technicians.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTokenInfo, submitRating } from '../../api/complaints';
import { StarRating } from '../../components/complaints/StarRating';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Home
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
        .then((data: any) => setTokenInfo(data))
        .catch((err: any) => setError(err.message || 'Invalid or expired rating link'))
        .finally(() => setLoading(false));
    } else {
      setError('Missing rating token.');
      setLoading(false);
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
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                MNNIT Allahabad
              </h1>
              <p className="text-[11px] text-slate-400">Network Complaint &amp; Diagnostic Portal</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-noc-cyan" />
            <span>Portal Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-10 w-full">
        <div className="bg-noc-panel border border-noc-border rounded-2xl shadow-noc p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-noc-surface border border-noc-border text-noc-amber rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Rate Technician Service Quality</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your anonymous feedback helps us recognize outstanding technicians and improve support response.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading complaint details...</div>
          ) : resultMessage ? (
            <div className="p-6 bg-noc-emerald/10 border border-noc-emerald/30 text-noc-emerald rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <h3 className="text-sm font-bold">Rating Submitted</h3>
              <p className="text-xs text-slate-300">{resultMessage}</p>
              <div className="pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-noc"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          ) : error || !tokenInfo?.is_valid ? (
            <div className="p-6 bg-noc-amber/10 border border-noc-amber/30 text-noc-amber rounded-xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <h3 className="text-sm font-bold">Link Unavailable</h3>
              <p className="text-xs text-slate-300">
                {error || (tokenInfo?.is_used ? 'This rating link has already been submitted.' : 'This rating link has expired.')}
              </p>
              <div className="pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-noc-bg p-4 rounded-xl border border-noc-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket Reference:</span>
                  <span className="font-mono font-bold text-noc-cyan">#{tokenInfo.ticket_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attending Technician:</span>
                  <span className="text-slate-200 font-semibold">{tokenInfo.technician_name || 'Staff Technician'}</span>
                </div>
              </div>

              <div className="text-center py-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Rating (1 to 5 Stars):
                </label>
                <div className="flex justify-center">
                  <StarRating value={rating} onChange={(val) => setRating(val)} size={32} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional Comments / Review:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  maxLength={400}
                  placeholder="Share details about technician speed, politeness, and resolution quality..."
                  className="w-full bg-noc-bg text-xs text-slate-200 p-3 rounded-lg border border-noc-border resize-none focus:outline-none focus:border-noc-accent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-noc cursor-pointer"
              >
                {submitting ? 'Submitting Rating...' : 'Submit Rating & Review'}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
      </footer>
    </div>
  );
};
