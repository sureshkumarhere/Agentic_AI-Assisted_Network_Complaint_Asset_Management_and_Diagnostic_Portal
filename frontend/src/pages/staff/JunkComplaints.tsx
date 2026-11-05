import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchJunkComplaints,
  restoreJunk,
  clearAllJunk
} from '../../api/complaints';
import { Trash2, RotateCcw, ArrowLeft, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const JunkComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadJunk = () => {
    setLoading(true);
    fetchJunkComplaints(1, 50)
      .then((res: any) => {
        setComplaints(res.complaints);
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
      await clearAllJunk();
      loadJunk();
    } catch (err: any) {
      alert(err.message || 'Failed to clear junk');
    }
  };

  const handleLogout = () => {
    document.cookie = 'staff_token=; path=/; max-age=0';
    document.cookie = 'admin_token=; path=/; max-age=0';
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_role');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors"
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
              <h1 className="text-base font-bold text-white tracking-tight">Junk Bin Management</h1>
              <p className="text-[11px] text-slate-400">Review and Purge Flagged Incidents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="p-2 bg-noc-surface hover:bg-noc-rose/20 text-slate-300 hover:text-noc-rose rounded-lg border border-noc-border transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        <div className="bg-noc-panel rounded-2xl border border-noc-border shadow-noc p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-noc-border pb-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-noc-rose" />
              <h2 className="text-base font-bold text-white">
                Junk Complaints Management ({total})
              </h2>
            </div>
            {total > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-noc-rose hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-noc"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Junk</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading junk bin...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              Junk bin is empty. No complaints marked as junk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-semibold uppercase">
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Problem Type</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Date Flagged</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-noc-border">
                  {complaints.map((c) => (
                    <tr key={c.ticket_id} className="hover:bg-noc-surface/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-noc-cyan">{c.ticket_id}</td>
                      <td className="p-3 font-semibold text-white">{c.student_name}</td>
                      <td className="p-3 text-slate-300">{c.problem_type?.replace(/_/g, ' ')}</td>
                      <td className="p-3 text-slate-300">{c.location}</td>
                      <td className="p-3 text-noc-amber italic text-[11px]">{c.junk_reason || 'Marked by manager'}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {new Date(c.junk_at || c.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRestore(c.ticket_id)}
                          className="px-3 py-1 bg-noc-emerald/15 hover:bg-noc-emerald/25 text-noc-emerald border border-noc-emerald/30 rounded text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore to Open</span>
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
    </div>
  );
};
