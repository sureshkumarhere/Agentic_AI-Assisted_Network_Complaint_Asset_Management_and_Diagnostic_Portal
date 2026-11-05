import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Home, Shield, Copy, Check } from 'lucide-react';
import logo from '../assets/logo.jpeg';

export const Success: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (complaintId) {
      navigator.clipboard.writeText(complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      {/* College Header */}
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

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-noc-cyan" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Complaint Registered Successfully</h2>
          <p className="text-xs text-slate-400 mb-6">
            Your network problem report has been logged with MNNIT IT Support.
          </p>

          <div className="bg-noc-bg border border-noc-border rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Reference Number
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-noc-cyan hover:underline flex items-center gap-1"
                title="Copy reference number"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-noc-emerald" />
                    <span className="text-noc-emerald">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-2xl font-mono font-bold text-noc-cyan block select-all">
              {complaintId || 'NET-2026-000000'}
            </span>
            <p className="text-[11px] text-slate-400 mt-2">
              Save this reference number to track your ticket status with technical staff.
            </p>
          </div>

          <Link
            to="/"
            className="w-full py-3 px-4 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-noc"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
      </footer>
    </div>
  );
};
