import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStats, adminLogout } from '../../api/admin';
import { fetchAgentStatus } from '../../api/complaints';
import { AdminStatsResponse } from '../../types';
import {
  MessageSquare,
  BookOpen,
  LogOut,
  FileText,
  Activity,
  Server,
  Users,
  Trash2,
  Settings,
  Trophy,
  Shield,
  Inbox,
  Bot,
  Home,
  Radio,
  ArrowRight
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => {
        if (err.message && err.message.includes('401')) {
          navigate('/login');
        }
      })
      .finally(() => setIsLoading(false));

    fetchAgentStatus()
      .then((res) => setAgentStatus(res))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* NOC Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                  ADMIN CONTROL CENTER // NOC
                </h1>
                {agentStatus && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded bg-noc-highlight/10 text-noc-accent border border-noc-highlight/30">
                    <Bot className="w-3.5 h-3.5 text-noc-cyan" />
                    MODULE 2: {agentStatus.enabled ? 'ACTIVE' : 'STANDBY'} ({agentStatus.mode.toUpperCase()})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Campus Core Incident Routing, Knowledge Base, and Network Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 text-xs font-mono rounded-lg transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-noc-accent" />
              <span>Student View</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-rose/15 hover:bg-noc-rose/25 border border-noc-rose/40 text-noc-rose rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Console */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-noc-border">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wide text-white uppercase flex items-center gap-2">
              <Activity className="w-5 h-5 text-noc-accent" />
              MISSION CONTROL // DISPATCH OVERVIEW
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Autonomous incident triage, technician dispatch management, and hardware infrastructure telemetry
            </p>
          </div>

          <Link
            to="/admin/settings"
            className="self-start sm:self-auto px-3.5 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-xs font-mono font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-noc-gold" />
            <span>NOC SYSTEM SETTINGS</span>
          </Link>
        </div>

        {/* Section 1: Core Operations Cards */}
        <div>
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
            01 // INCIDENT DISPATCH & STAFF ACCOUNTS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Complaint Manager */}
            <Link
              to="/manager"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-noc-accent hover:shadow-noc-glow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-noc-accent bg-noc-highlight/10 px-2.5 py-1 rounded border border-noc-highlight/20 uppercase tracking-wider">
                    OPERATIONS
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  Incident Queue & Dispatch
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Assign complaints to zonal technicians, monitor SLA lifecycle transitions, inspect audit logs, and view quality scores.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-noc-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>OPEN DISPATCH MANAGER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 2: Staff Accounts */}
            <Link
              to="/admin/staff"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-purple-400 hover:shadow-noc transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20 uppercase tracking-wider">
                    STAFF ACCESS
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  Staff User & Zone Management
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Create Manager / Technician operator accounts, assign hostel zones, trigger password resets, and deactivate access.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>MANAGE STAFF USERS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 3: Junk Bin */}
            <Link
              to="/admin/junk"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-noc-amber hover:shadow-noc transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-noc-amber/15 text-noc-amber border border-noc-amber/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-noc-amber bg-noc-amber/10 px-2.5 py-1 rounded border border-noc-amber/20 uppercase tracking-wider">
                    QUARANTINE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  Junk Quarantine & Purge
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Review spam and duplicate complaints quarantined from the active queue. Restore legitimate tickets or permanently purge.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-noc-amber flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>INSPECT QUARANTINE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Section 2: AI Knowledge & Network Assets */}
        <div>
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
            02 // AI KNOWLEDGE REPOSITORY & HARDWARE ASSETS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 4: Unassigned Chats */}
            <Link
              to="/admin/chats"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-noc-accent hover:shadow-noc transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold font-mono text-noc-accent bg-noc-highlight/10 px-2.5 py-1 rounded border border-noc-highlight/20">
                    {isLoading ? '...' : stats?.unassigned_chats_count ?? 0}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  Unassigned AI Chat Transcripts
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Review student AI troubleshooting transcripts and promote high-value solutions to the curated campus RAG index.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-noc-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>CURATE CHAT LOGS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 5: Knowledge Base Documents */}
            <Link
              to="/admin/reference"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-noc-emerald hover:shadow-noc transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-noc-emerald/15 text-noc-emerald border border-noc-emerald/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold font-mono text-noc-emerald bg-noc-emerald/10 px-2.5 py-1 rounded border border-noc-emerald/20">
                    {isLoading ? '...' : stats?.reference_documents_count ?? 0}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  RAG Knowledge Documents
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Manage indexed network troubleshooting manuals, SOPs, and router guides (.pdf, .docx, .txt) across 6 categories.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-noc-emerald flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>VIEW KNOWLEDGE BASE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 6: Network Assets & Stock */}
            <Link
              to="/admin/network-assets"
              className="bg-noc-panel border border-noc-border rounded-xl p-5 hover:border-noc-cyan hover:shadow-noc transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-noc-cyan/15 text-noc-cyan border border-noc-cyan/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-noc-cyan bg-noc-cyan/10 px-2.5 py-1 rounded border border-noc-cyan/20 uppercase tracking-wider">
                    HARDWARE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">
                  Network Assets & Stock Spares
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Manage core/distribution switches, access points, port allocations, and warehouse stock spares for technician work.
                </p>
              </div>
              <div className="mt-5 text-xs font-mono font-semibold text-noc-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>MANAGE ASSET INVENTORY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
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
