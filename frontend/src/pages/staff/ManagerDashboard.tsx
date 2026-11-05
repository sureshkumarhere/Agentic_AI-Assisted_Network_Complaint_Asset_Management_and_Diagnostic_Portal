// MODULE: Complaint Management (Part 2) - this file belongs to the code for this module.
// Manager Dashboard page providing complaint queues, assignment, technician status, reports, and leaderboard.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentStaff } from '../../api/auth';
import {
  fetchManagerSummary,
  fetchManagerComplaints,
  fetchManagerReports,
  fetchLeaderboard,
  fetchTechnicians,
  toggleTechnicianAvailability,
  fetchComplaintDetail
} from '../../api/complaints';
import { ComplaintList } from '../../components/complaints/ComplaintList';
import { ComplaintDetail } from '../../components/complaints/ComplaintDetail';
import { StarRating } from '../../components/complaints/StarRating';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  Trophy,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Shield,
  MapPin,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'techs' | 'reports' | 'leaderboard'>('queue');
  const [queueView, setQueueView] = useState<'open_unassigned' | 'open' | 'closed' | 'all'>('open');
  const [summary, setSummary] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [problemTypeFilter, setProblemTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Technicians & Leaderboard
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [reportRange, setReportRange] = useState('today');

  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('staff_role') || 'MANAGER');

  useEffect(() => {
    fetchCurrentStaff()
      .then((user) => {
        if (user?.role) {
          setUserRole(user.role);
          localStorage.setItem('staff_role', user.role);
        }
      })
      .catch(() => {});
  }, []);

  const loadData = () => {
    setLoading(true);
    fetchManagerSummary().then((data) => setSummary(data)).catch(() => {});

    if (activeTab === 'queue') {
      fetchManagerComplaints({
        view: queueView,
        priority: priorityFilter || undefined,
        problem_type: problemTypeFilter || undefined,
        location: locationFilter || undefined,
        q: searchQuery || undefined,
        page,
        limit: 15
      })
        .then((res) => {
          setComplaints(res.complaints);
          setTotalPages(res.pages);
        })
        .finally(() => setLoading(false));
    } else if (activeTab === 'techs') {
      fetchTechnicians()
        .then((res) => setTechnicians(res))
        .finally(() => setLoading(false));
    } else if (activeTab === 'reports') {
      fetchManagerReports(reportRange)
        .then((res) => setReports(res))
        .finally(() => setLoading(false));
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard()
        .then((res) => setLeaderboard(res))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, queueView, priorityFilter, problemTypeFilter, locationFilter, page, reportRange]);

  const handleSelectComplaint = async (ticketId: string) => {
    try {
      setLoading(true);
      const data = await fetchComplaintDetail(ticketId);
      setSelectedComplaint(data);
      setSelectedTicketId(ticketId);
    } catch (err: any) {
      alert(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (techId: string, currentAvail: string) => {
    const targetAvail = currentAvail === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await toggleTechnicianAvailability(techId, targetAvail, false);
      loadData();
    } catch (err: any) {
      if (err.status === 409 || err.message?.includes('open assigned complaint')) {
        if (window.confirm(`${err.message}\nDo you still want to force mark this technician UNAVAILABLE?`)) {
          await toggleTechnicianAvailability(techId, targetAvail, true);
          loadData();
        }
      } else {
        alert(err.message || 'Failed to toggle availability');
      }
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
            {userRole === 'ADMIN' && (
              <Link
                to="/admin"
                className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Manager Operations Dashboard</h1>
              <p className="text-[11px] text-slate-400">Network Complaint Lifecycle &amp; Dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
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
              userRole={userRole}
              onBack={() => {
                setSelectedComplaint(null);
                setSelectedTicketId(null);
                loadData();
              }}
              onRefresh={() => {
                handleSelectComplaint(selectedComplaint.ticket_id);
              }}
            />
          </div>
        ) : (
          <>
            {/* Summary Metrics Row */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Open Complaints</span>
                    <span className="text-2xl font-bold font-mono text-white block mt-1">{summary.open_complaints}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center">
                    <Inbox className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unassigned</span>
                    <span className="text-2xl font-bold font-mono text-noc-amber block mt-1">{summary.unassigned_complaints}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-amber flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</span>
                    <span className="text-2xl font-bold font-mono text-blue-400 block mt-1">{summary.assigned_complaints}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-blue-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Resolved / Closed</span>
                    <span className="text-2xl font-bold font-mono text-noc-emerald block mt-1">{summary.closed_complaints}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-noc-border pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('queue')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'queue'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Complaint Queues</span>
              </button>

              <button
                onClick={() => setActiveTab('techs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'techs'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Technician Fleet</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Resolution Reports</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Quality Leaderboard</span>
              </button>
            </div>

            {/* Tab 1: Queue */}
            {activeTab === 'queue' && (
              <div className="space-y-4">
                {/* Secondary Filters Bar */}
                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* View Toggles */}
                  <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                      onClick={() => { setQueueView('open_unassigned'); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        queueView === 'open_unassigned'
                          ? 'bg-noc-amber text-slate-950 font-bold'
                          : 'bg-noc-surface border border-noc-border text-slate-400 hover:text-white'
                      }`}
                    >
                      Pending Assign
                    </button>
                    <button
                      onClick={() => { setQueueView('open'); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        queueView === 'open'
                          ? 'bg-noc-accent text-white font-bold'
                          : 'bg-noc-surface border border-noc-border text-slate-400 hover:text-white'
                      }`}
                    >
                      All Open
                    </button>
                    <button
                      onClick={() => { setQueueView('closed'); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        queueView === 'closed'
                          ? 'bg-noc-emerald text-slate-950 font-bold'
                          : 'bg-noc-surface border border-noc-border text-slate-400 hover:text-white'
                      }`}
                    >
                      Resolved / Closed
                    </button>
                    <button
                      onClick={() => { setQueueView('all'); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        queueView === 'all'
                          ? 'bg-slate-200 text-slate-900 font-bold'
                          : 'bg-noc-surface border border-noc-border text-slate-400 hover:text-white'
                      }`}
                    >
                      Complete Archive
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-60">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        placeholder="Search ticket / student..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-noc-bg border border-noc-border text-slate-200 placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-noc-accent"
                      />
                    </div>

                    <select
                      value={priorityFilter}
                      onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                      className="px-2.5 py-1.5 text-xs bg-noc-bg border border-noc-border rounded-lg text-slate-300 focus:outline-none focus:border-noc-accent"
                    >
                      <option value="" className="bg-noc-panel text-slate-300">All Priorities</option>
                      <option value="CRITICAL" className="bg-noc-panel text-slate-300">CRITICAL</option>
                      <option value="HIGH" className="bg-noc-panel text-slate-300">HIGH</option>
                      <option value="MEDIUM" className="bg-noc-panel text-slate-300">MEDIUM</option>
                      <option value="LOW" className="bg-noc-panel text-slate-300">LOW</option>
                    </select>
                  </div>
                </div>

                {/* Complaint List Table */}
                <ComplaintList
                  complaints={complaints}
                  onSelect={handleSelectComplaint}
                  showTechnician={true}
                />
              </div>
            )}

            {/* Tab 2: Technicians */}
            {activeTab === 'techs' && (
              <div className="bg-noc-panel rounded-2xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-4">
                <h2 className="text-sm font-bold text-white border-b border-noc-border pb-3">
                  Registered Service Technicians &amp; Live Availability
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-semibold uppercase">
                        <th className="p-3">Technician</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Mobile</th>
                        <th className="p-3">Assigned Zone</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-noc-border">
                      {technicians.map((t) => (
                        <tr key={t.id} className="hover:bg-noc-surface/40 transition-colors">
                          <td className="p-3 font-semibold text-white">{t.name}</td>
                          <td className="p-3 text-slate-300 font-mono text-[11px]">{t.email}</td>
                          <td className="p-3 text-slate-300 font-mono text-[11px]">{t.mobile}</td>
                          <td className="p-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-noc-cyan" />
                              {t.assigned_zone || 'All Campus'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.availability_status === 'AVAILABLE'
                                  ? 'bg-noc-emerald/15 text-noc-emerald border border-noc-emerald/30'
                                  : 'bg-noc-rose/15 text-noc-rose border border-noc-rose/30'
                              }`}
                            >
                              {t.availability_status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleToggleAvailability(t.id, t.availability_status)}
                              className="px-3 py-1 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-200 rounded text-xs font-semibold transition-colors"
                            >
                              Toggle Availability
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Reports */}
            {activeTab === 'reports' && reports && (
              <div className="bg-noc-panel rounded-2xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-noc-border pb-3">
                  <h2 className="text-sm font-bold text-white">Operations &amp; Resolution Performance Metrics</h2>
                  <select
                    value={reportRange}
                    onChange={(e) => setReportRange(e.target.value)}
                    className="p-1.5 text-xs bg-noc-bg border border-noc-border rounded-lg text-slate-200 focus:outline-none focus:border-noc-accent"
                  >
                    <option value="today" className="bg-noc-panel text-slate-200">Today</option>
                    <option value="weekly" className="bg-noc-panel text-slate-200">Past 7 Days</option>
                    <option value="all" className="bg-noc-panel text-slate-200">All Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-slate-400 block text-xs">Total Complaints</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">{reports.total_complaints}</span>
                  </div>
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-noc-emerald block text-xs">Total Resolved</span>
                    <span className="text-2xl font-bold font-mono text-noc-emerald mt-1 block">{reports.total_resolved}</span>
                  </div>
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-noc-cyan block text-xs">Avg Resolution Time</span>
                    <span className="text-2xl font-bold font-mono text-noc-cyan mt-1 block">{reports.avg_resolution_hours} Hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-300 mb-2">Complaints by Problem Type</h3>
                    <ul className="divide-y divide-noc-border border border-noc-border rounded-xl bg-noc-bg overflow-hidden">
                      {Object.entries(reports.by_problem_type || {}).map(([pt, cnt]: any) => (
                        <li key={pt} className="p-2.5 flex justify-between">
                          <span className="text-slate-300">{pt.replace(/_/g, ' ')}</span>
                          <span className="font-bold font-mono text-noc-cyan">{cnt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-300 mb-2">Complaints by Location</h3>
                    <ul className="divide-y divide-noc-border border border-noc-border rounded-xl bg-noc-bg overflow-hidden">
                      {Object.entries(reports.by_location || {}).map(([loc, cnt]: any) => (
                        <li key={loc} className="p-2.5 flex justify-between">
                          <span className="text-slate-300">{loc}</span>
                          <span className="font-bold font-mono text-noc-cyan">{cnt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="bg-noc-panel rounded-2xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-noc-border pb-3">
                  <Trophy className="w-4 h-4 text-noc-amber" />
                  Technician Quality &amp; Performance Leaderboard
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-semibold uppercase">
                        <th className="p-3">Rank</th>
                        <th className="p-3">Technician Name</th>
                        <th className="p-3">Average Rating</th>
                        <th className="p-3">Rating Count</th>
                        <th className="p-3">Resolved Count</th>
                        <th className="p-3 text-right">Computed Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-noc-border">
                      {leaderboard.map((lb) => (
                        <tr key={lb.technician_id} className="hover:bg-noc-surface/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-300">#{lb.rank}</td>
                          <td className="p-3 font-semibold text-white">{lb.name}</td>
                          <td className="p-3">
                            {lb.average_rating ? (
                              <div className="flex items-center gap-2">
                                <StarRating value={Math.round(lb.average_rating)} readOnly size={16} />
                                <span className="font-bold text-noc-amber">{lb.average_rating}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Unrated</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-300">{lb.rating_count} ratings</td>
                          <td className="p-3 font-bold text-noc-emerald">{lb.resolved_count} closed</td>
                          <td className="p-3 text-right font-mono font-bold text-noc-cyan text-sm">{lb.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
