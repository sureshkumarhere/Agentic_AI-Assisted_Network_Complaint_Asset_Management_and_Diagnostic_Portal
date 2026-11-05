import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJunkComplaints, restoreJunk, clearAllJunk } from '../../api/complaints';
import { adminLogout } from '../../api/admin';
import { Trash2, RotateCcw, AlertTriangle, Shield, Calendar, ArrowLeft, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const JunkComplaints: React.FC = () => {
  const [junkList, setJunkList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadJunk = () => {
    setLoading(true);
    fetchJunkComplaints()
      .then((res) => {
        setJunkList(res.complaints);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJunk();
  }, []);

  const handleRestore = async (ticketId: string) => {
    try {
      await restoreJunk(ticketId);
      loadJunk();
    } catch (err: any) {
      alert(err.message || 'Failed to restore complaint');
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        `PERMANENT ACTION: Are you sure you want to permanently delete ALL ${total} junk complaint(s)? This cannot be undone.`
      )
    )
      return;

    try {
      await clearAllJunk(true);
      loadJunk();
    } catch (err: any) {
      alert(err.message || 'Failed to clear junk');
    }
  };

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-white transition-colors"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                  JUNK INCIDENT QUARANTINE
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noc-amber/10 text-noc-amber border border-noc-amber/30 font-bold uppercase">
                  FILTERED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Quarantined Spam & Duplicate Campus Network Submissions
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-rose/15 hover:bg-noc-rose/25 border border-noc-rose/40 text-noc-rose rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="bg-noc-panel rounded-xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noc-border pb-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-noc-amber" />
              <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                QUARANTINED INCIDENTS ({total})
              </h2>
            </div>
            {total > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-noc-rose hover:bg-red-600 text-white text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-noc"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>PERMANENTLY PURGE QUARANTINE</span>
              </button>
            )}
          </div>

          {junkList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              NO QUARANTINED INCIDENTS IN BIN.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">Ticket ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Problem Type</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Original Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-noc-border/60">
                  {junkList.map((c) => (
                    <tr key={c.ticket_id} className="hover:bg-noc-surface/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-noc-amber">#{c.ticket_id}</td>
                      <td className="p-3.5 font-semibold text-white">{c.name}</td>
                      <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                        {c.problem_type.replace(/_/g, ' ')}
                      </td>
                      <td className="p-3.5 text-slate-400">{c.location}</td>
                      <td className="p-3.5 font-mono text-noc-cyan">{c.previous_status || 'CLASSIFIED'}</td>
                      <td className="p-3.5 text-right font-mono">
                        <button
                          onClick={() => handleRestore(c.ticket_id)}
                          className="px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-noc-accent hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} MNNIT ALLAHABAD IT SERVICES & NETWORK OPERATIONS // COMPUTER CENTRE
      </footer>
    </div>
  );
};
