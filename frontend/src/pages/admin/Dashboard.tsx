// MODULE: Complaint Management (Part 2) - this file belongs to the code for this module.
// Admin Dashboard page integrating Part 1 chat/KB curation, network assets, and Part 2 complaint/staff management cards.

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStats, adminLogout } from '../../api/admin';
import { fetchAgentStatus } from '../../api/complaints';
import { AdminStatsResponse } from '../../types';
import {
  MessageSquare,
  BookOpen,
  LogOut,
  Server,
  Users,
  Trash2,
  Settings,
  Trophy,
  Inbox,
  Bot,
  Home,
  Wrench
} from 'lucide-react';

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
    <div className="min-h-screen bg-noc-bg text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              MNNIT Network Admin Dashboard
            </h1>
            {agentStatus && (
              <span className="text-xs bg-noc-surface text-noc-cyan border border-noc-border px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-noc-cyan" />
                Agent: {agentStatus.enabled ? 'ON' : 'OFF'}, mode {agentStatus.mode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-noc-amber" />
              <span>Student View</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-rose/20 hover:bg-noc-rose border border-noc-rose/40 text-rose-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Control Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage complaint dispatch, staff accounts, knowledge base, and network assets.
          </p>
        </div>

        {/* Part 2 Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Complaint Management */}
          <Link
            to="/manager"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-highlight/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Inbox className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-noc-cyan bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  Complaint Manager
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Complaint Queue &amp; Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assign complaints to technicians, monitor lifecycle transitions, view history timeline, and access reports.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open complaint manager</span> &rarr;
            </div>
          </Link>

          {/* Card: Staff Management */}
          <Link
            to="/admin/staff"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-purple-500/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-purple-400 bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  Staff Management
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Technician &amp; Operator Roster</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create and manage staff accounts, roles (Technician / Manager), activate/deactivate personnel.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Manage staff accounts</span> &rarr;
            </div>
          </Link>

          {/* Card: Junk Complaints */}
          <Link
            to="/admin/junk"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-rose/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-rose flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Trash2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-noc-rose bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  Quarantine
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Quarantined Complaints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review complaints flagged as spam/junk or needing deletion before permanent purge.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-rose flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View quarantined complaints</span> &rarr;
            </div>
          </Link>

          {/* Card: Technician Workbench Direct */}
          <Link
            to="/technician"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-amber/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-amber flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-noc-amber bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  Technician Board
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Technician Work Console</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct link to technician ticket workbench with status updates and diagnostic logging.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-amber flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open technician workbench</span> &rarr;
            </div>
          </Link>

          {/* Card: Leaderboard */}
          <Link
            to="/leaderboard"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-yellow-500/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-yellow-400 bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  Leaderboard
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Technician Performance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Public and internal rankings based on closed tickets, resolution speed, and student ratings.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-yellow-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View leaderboard</span> &rarr;
            </div>
          </Link>

          {/* Card: System Settings */}
          <Link
            to="/admin/settings"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-emerald/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-noc-emerald bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase">
                  System Settings
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Dynamic Portal Settings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hot-reload application settings, email limits, auto-close timers, and LLM router configurations dynamically.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-emerald flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Configure dynamic settings</span> &rarr;
            </div>
          </Link>
        </div>

        {/* Section Divider */}
        <div className="border-t border-noc-border pt-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            AI Assistant, RAG Knowledge &amp; Infrastructure
          </h3>
        </div>

        {/* Part 1 & Assets Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: See All Chats */}
          <Link
            to="/admin/chats"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-highlight/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold font-mono text-noc-cyan bg-noc-surface border border-noc-border px-3 py-1 rounded-xl">
                  {isLoading ? '...' : stats?.unassigned_chats_count ?? 0}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Unassigned AI Chats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review student chat transcripts and promote helpful conversations to curated reference categories.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Manage AI chats</span> &rarr;
            </div>
          </Link>

          {/* Card: Reference Knowledge Base */}
          <Link
            to="/admin/reference"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-noc-emerald/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold font-mono text-noc-emerald bg-noc-surface border border-noc-border px-3 py-1 rounded-xl">
                  {isLoading ? '...' : stats?.reference_documents_count ?? 0}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Knowledge Base Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload manuals, SOPs, and guide documents (.pdf, .docx, .txt) into six reference categories.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-noc-emerald flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View reference categories</span> &rarr;
            </div>
          </Link>

          {/* Card: Network Assets and Stock */}
          <Link
            to="/admin/network-assets"
            className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 hover:border-indigo-400/50 hover:bg-noc-surface/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-noc-surface border border-noc-border text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Server className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-noc-surface border border-noc-border px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  Assets &amp; Stock
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Network Assets and Stock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage hardware lifecycle (switches, routers, APs), campus location hierarchy, port mapping, and bulk stock.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open asset manager</span> &rarr;
            </div>
          </Link>
        </div>

        {/* Secondary Admin Settings Row */}
        <div className="flex items-center justify-between bg-noc-panel p-6 rounded-2xl border border-noc-border shadow-noc">
          <div>
            <h3 className="text-sm font-bold text-white">Admin Preferences &amp; Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure email copy notification settings on new student complaint submissions.
            </p>
          </div>
          <Link
            to="/admin/settings"
            className="px-4 py-2 bg-noc-surface hover:bg-noc-border border border-noc-border text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-noc-cyan" />
            <span>Open Settings</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
