import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  Shield,
  Copy,
  Check,
  Activity,
  Clock,
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

export const Success: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (complaintId) {
      navigator.clipboard.writeText(complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
                Campus Incident Dispatch Management
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 text-xs font-mono rounded-lg transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-noc-accent" />
            <span>Staff Login</span>
          </Link>
        </div>
      </header>

      {/* Main Dispatch Ticket */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-noc-panel border border-noc-border rounded-2xl shadow-noc overflow-hidden">
          {/* Ticket Header Banner */}
          <div className="bg-noc-surface px-6 py-5 border-b border-noc-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-noc-emerald/15 border border-noc-emerald/30 text-noc-emerald flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-noc-emerald font-semibold tracking-wider block">
                  TRANSMISSION VERIFIED
                </span>
                <h2 className="text-base font-bold text-white tracking-wide">
                  INCIDENT TICKET DISPATCHED
                </h2>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-noc-emerald/10 text-noc-emerald border border-noc-emerald/20 rounded font-bold">
              STATUS: SUBMITTED
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Ticket Reference Block */}
            <div className="bg-noc-bg border border-noc-border rounded-xl p-5 text-center relative group">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                DISPATCH TRACKING NUMBER
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-noc-accent tracking-wider select-all my-1">
                {complaintId || 'NET-2026-000000'}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                A confirmation dispatch email and verification receipt have been sent to your MNNIT inbox.
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-xs font-mono text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-noc-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY TICKET NUMBER'}</span>
              </button>
            </div>

            {/* Lifecycle Pipeline Progress */}
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                AUTONOMOUS TRIAGE & DISPATCH WORKFLOW
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className="p-2.5 bg-noc-surface border border-noc-emerald/40 rounded-lg">
                  <div className="text-noc-emerald font-bold">1. ENQUEUED</div>
                  <div className="text-slate-400 mt-0.5">Verified OTP</div>
                </div>
                <div className="p-2.5 bg-noc-surface border border-noc-highlight/30 rounded-lg">
                  <div className="text-noc-accent font-bold">2. AI TRIAGE</div>
                  <div className="text-slate-400 mt-0.5">Module 2 Routing</div>
                </div>
                <div className="p-2.5 bg-noc-surface border border-noc-border rounded-lg opacity-70">
                  <div className="text-slate-300 font-bold">3. DISPATCH</div>
                  <div className="text-slate-500 mt-0.5">Technician On-Site</div>
                </div>
                <div className="p-2.5 bg-noc-surface border border-noc-border rounded-lg opacity-70">
                  <div className="text-slate-300 font-bold">4. RESOLVE</div>
                  <div className="text-slate-500 mt-0.5">Student Rating</div>
                </div>
              </div>
            </div>

            {/* SLA Advisory Box */}
            <div className="bg-noc-surface/60 border border-noc-border rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-noc-gold shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-white font-mono">SLA Commit:</span> Typical campus network tickets are assigned to the zonal technician within <span className="text-noc-gold font-bold">15 minutes</span>. You will receive an email notification when a technician is dispatched to your room.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <Link
                to="/"
                className="w-full py-3.5 px-4 bg-noc-highlight hover:bg-blue-600 text-white font-mono font-bold rounded-xl shadow-noc-glow transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to NOC Operations Center</span>
              </Link>
            </div>
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
