import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchTechnicianComplaints,
  fetchTechnicianComplaintDetail,
  resolveComplaint,
  fetchMyRatings,
  fetchStockItems
} from '../../api/complaints';
import { ComplaintList } from '../../components/complaints/ComplaintList';
import { ComplaintDetail } from '../../components/complaints/ComplaintDetail';
import { StarRating } from '../../components/complaints/StarRating';
import {
  Wrench,
  Inbox,
  CheckCircle2,
  Star,
  Plus,
  Trash2,
  LogOut,
  AlertCircle
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const TechnicianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'closed' | 'ratings'>('open');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  // Resolution Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [solution, setSolution] = useState('');
  const [itemsUsed, setItemsUsed] = useState<{ stock_item_id: string; quantity: number }[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // My Ratings
  const [myRatings, setMyRatings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    if (activeTab === 'ratings') {
      fetchMyRatings()
        .then((res) => setMyRatings(res))
        .finally(() => setLoading(false));
    } else {
      fetchTechnicianComplaints(activeTab)
        .then((res) => setComplaints(res.complaints))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
    fetchStockItems()
      .then((items: any[]) => setStockItems(items))
      .catch(() => {});
  }, [activeTab]);

  const handleSelectComplaint = async (ticketId: string) => {
    try {
      setLoading(true);
      const data = await fetchTechnicianComplaintDetail(ticketId);
      setSelectedComplaint(data);
      setSelectedTicketId(ticketId);
      // Reset form
      setDiagnosis(data.diagnosis || '');
      setSolution(data.solution || '');
      setItemsUsed([]);
      setResolveError(null);
    } catch (err: any) {
      alert(err.message || 'Failed to load complaint detail');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (stockItems.length === 0) return;
    setItemsUsed((prev) => [...prev, { stock_item_id: stockItems[0]._id, quantity: 1 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItemsUsed((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId) return;

    if (!diagnosis.trim() || !solution.trim()) {
      setResolveError('Diagnosis and Solution fields are required.');
      return;
    }

    setSubmitting(true);
    setResolveError(null);

    try {
      await resolveComplaint(selectedTicketId, {
        diagnosis,
        solution,
        items_used: itemsUsed
      });
      alert('Complaint resolution submitted and confirmation email sent to student!');
      setSelectedComplaint(null);
      setSelectedTicketId(null);
      loadData();
    } catch (err: any) {
      setResolveError(err.message || 'Failed to submit resolution');
    } finally {
      setSubmitting(false);
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
      {/* Top Header */}
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Technician Workbench</h1>
              <p className="text-[11px] text-slate-400">On-Site Network Repair &amp; Stock Dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/network-assets"
              className="hidden sm:inline-flex px-3 py-1.5 bg-noc-surface hover:bg-noc-border rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-noc-border transition-colors"
            >
              Network Assets (Read-Only)
            </Link>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {selectedComplaint ? (
          <div className="space-y-6">
            <ComplaintDetail
              complaint={selectedComplaint}
              userRole="TECHNICIAN"
              onBack={() => {
                setSelectedComplaint(null);
                setSelectedTicketId(null);
              }}
              onRefresh={() => handleSelectComplaint(selectedComplaint.ticket_id)}
            />

            {/* Resolution Form (if assigned and open) */}
            {(selectedComplaint.status === 'ASSIGNED' || selectedComplaint.status === 'DIAGNOSED') && (
              <div className="bg-noc-panel rounded-2xl p-6 border border-noc-border shadow-noc space-y-5">
                <div className="flex items-center gap-2 border-b border-noc-border pb-3">
                  <Wrench className="w-4 h-4 text-noc-emerald" />
                  <h2 className="text-sm font-bold text-white">
                    Submit Diagnosis &amp; Solution (Ticket #{selectedComplaint.ticket_id})
                  </h2>
                </div>

                {resolveError && (
                  <div className="p-3 bg-noc-rose/10 text-noc-rose text-xs flex items-center gap-2 rounded-xl border border-noc-rose/30">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resolveError}</span>
                  </div>
                )}

                <form onSubmit={handleResolveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Technical Diagnosis <span className="text-noc-rose">*</span>
                    </label>
                    <textarea
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={3}
                      placeholder="e.g. Blown RJ45 keystone jack in wall socket due to physical cable pull"
                      required
                      className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Action Taken / Solution Provided <span className="text-noc-rose">*</span>
                    </label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      rows={3}
                      placeholder="e.g. Replaced RJ45 keystone jack in Room 214 and tested LAN connection at 1Gbps speed."
                      required
                      className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  {/* Stock Usage Selector */}
                  <div className="space-y-3 pt-2 border-t border-noc-border">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        Warehouse Stock / Spares Utilized (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-3 py-1 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stock Item</span>
                      </button>
                    </div>

                    {itemsUsed.length > 0 && (
                      <div className="space-y-2">
                        {itemsUsed.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <select
                              value={item.stock_item_id}
                              onChange={(e) => {
                                const newId = e.target.value;
                                setItemsUsed((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, stock_item_id: newId } : it))
                                );
                              }}
                              className="flex-1 p-2 bg-noc-bg text-xs border border-noc-border rounded-lg text-slate-200 focus:outline-none focus:border-noc-accent"
                            >
                              {stockItems.map((st: any) => (
                                <option key={st._id} value={st._id} className="bg-noc-panel text-slate-200">
                                  {st.item_name} ({st.quantity_in_hand} in stock)
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value) || 1;
                                setItemsUsed((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, quantity: qty } : it))
                                );
                              }}
                              className="w-20 p-2 bg-noc-bg text-xs border border-noc-border rounded-lg text-slate-200 text-center focus:outline-none focus:border-noc-accent font-mono"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-2 text-slate-500 hover:text-noc-rose transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-noc-emerald hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-noc transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {submitting ? 'Submitting Resolution...' : 'Submit Resolution & Notify Student'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Sub Navigation Tabs */}
            <div className="bg-noc-panel p-1.5 rounded-xl border border-noc-border shadow-noc flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('open')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'open'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>My Work Orders (Open)</span>
              </button>

              <button
                onClick={() => setActiveTab('closed')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'closed'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolved History</span>
              </button>

              <button
                onClick={() => setActiveTab('ratings')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'ratings'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <Star className="w-4 h-4 text-noc-amber" />
                <span>Quality Ratings &amp; Position</span>
              </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'ratings' ? (
              myRatings && (
                <div className="bg-noc-panel rounded-2xl border border-noc-border shadow-noc p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                      <span className="text-slate-400 uppercase tracking-wider block">Average Rating Score</span>
                      <div className="flex items-center gap-2 mt-2">
                        <StarRating value={Math.round(myRatings.average_rating || 0)} readOnly size={20} />
                        <span className="text-2xl font-bold font-mono text-noc-amber">{myRatings.average_rating || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                      <span className="text-slate-400 uppercase tracking-wider block">Total Ratings Received</span>
                      <span className="text-2xl font-bold font-mono text-noc-cyan mt-2 block">{myRatings.rating_count}</span>
                    </div>

                    <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                      <span className="text-slate-400 uppercase tracking-wider block">Leaderboard Rank</span>
                      <span className="text-2xl font-bold font-mono text-purple-400 mt-2 block">#{myRatings.rank_position}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white border-b border-noc-border pb-2 mb-3 text-xs">
                      Anonymous Student Feedback History
                    </h3>
                    {myRatings.ratings.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No rating feedback received yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {myRatings.ratings.map((r: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-noc-bg rounded-xl border border-noc-border text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <StarRating value={r.rating} readOnly size={16} />
                              <span className="text-[11px] text-slate-500 font-mono">
                                {new Date(r.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                              </span>
                            </div>
                            {r.feedback && <p className="text-slate-300 italic pt-1">"{r.feedback}"</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <ComplaintList complaints={complaints} onSelect={handleSelectComplaint} showTechnician={false} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
      </footer>
    </div>
  );
};
