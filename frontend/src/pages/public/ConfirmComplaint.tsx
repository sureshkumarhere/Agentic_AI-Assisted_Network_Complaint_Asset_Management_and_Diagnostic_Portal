// MODULE: Complaint Management (Part 2) - this file belongs to the code for this module.
// Public ConfirmComplaint page allowing students to confirm or reopen complaints via token link.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTokenInfo, confirmResolution } from '../../api/complaints';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Home
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
        .then((data: any) => setTokenInfo(data))
        .catch((err: any) => setError(err.message || 'Invalid or expired confirmation link'))
        .finally(() => setLoading(false));
    } else {
      setError('Missing confirmation token.');
      setLoading(false);
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
            <div className="w-12 h-12 bg-noc-surface border border-noc-border text-noc-cyan rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Complaint Resolution Confirmation</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please confirm if your reported network issue has been resolved.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading complaint details...</div>
          ) : resultMessage ? (
            <div className="p-6 bg-noc-emerald/10 border border-noc-emerald/30 text-noc-emerald rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <h3 className="text-sm font-bold">Response Submitted</h3>
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
                {error || (tokenInfo?.is_used ? 'This confirmation link has already been submitted.' : 'This confirmation link has expired.')}
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
            <div className="space-y-6">
              <div className="bg-noc-bg p-4 rounded-xl border border-noc-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket Reference:</span>
                  <span className="font-mono font-bold text-noc-cyan">#{tokenInfo.ticket_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Technician:</span>
                  <span className="text-slate-200">{tokenInfo.technician_name || 'Staff Technician'}</span>
                </div>
                {tokenInfo.solution && (
                  <div className="pt-2 border-t border-noc-border">
                    <span className="text-slate-400 block mb-1">Technician Resolution Note:</span>
                    <p className="text-slate-300 italic">{tokenInfo.solution}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional Feedback / Reopen Reason:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  maxLength={300}
                  placeholder="If issue is not solved, please let the technician know what is still wrong..."
                  className="w-full bg-noc-bg text-xs text-slate-200 p-3 rounded-lg border border-noc-border resize-none focus:outline-none focus:border-noc-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAction(false)}
                  className="py-3 px-3 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 text-noc-rose" />
                  <span>Issue NOT Solved (Reopen)</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAction(true)}
                  className="py-3 px-3 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-noc"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes, Issue is Resolved</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
      </footer>
    </div>
  );
};
