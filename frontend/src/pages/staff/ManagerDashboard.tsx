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
  ArrowLeft,
  Activity
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
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* Top NOC Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userRole === 'ADMIN' && (
              <Link
                to="/admin"
                className="p-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-white transition-colors"
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
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                  INCIDENT DISPATCH & OPERATIONS // MANAGER
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noc-highlight/10 text-noc-accent border border-noc-highlight/30 font-bold uppercase">
                  NOC QUEUE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Real-Time Triage, Field Technician Routing & SLA Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/network-assets"
              className="hidden sm:inline-flex px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover rounded-lg text-xs font-mono text-slate-200 border border-noc-border transition-colors"
            >
              Network Assets {userRole === 'ADMIN' ? '' : '(Read-Only)'}
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Detail View Mode */}
        {selectedComplaint ? (
          <ComplaintDetail
            complaint={selectedComplaint}
            userRole={userRole}
            onBack={() => {
              setSelectedComplaint(null);
              setSelectedTicketId(null);
            }}
            onRefresh={() => handleSelectComplaint(selectedComplaint.ticket_id)}
          />
        ) : (
          <>
            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  setActiveTab('queue');
                  setQueueView('open_unassigned');
                }}
                className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc cursor-pointer hover:border-noc-amber transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Unassigned Queue</span>
                  <div className="p-2 bg-noc-amber/15 text-noc-amber border border-noc-amber/30 rounded-xl">
                    <Inbox className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2">{summary?.open_unassigned ?? 0}</div>
                {summary?.by_priority && (
                  <div className="flex gap-1.5 mt-2 text-[10px] font-mono font-bold">
                    <span className="text-noc-rose bg-noc-rose/15 px-2 py-0.5 rounded border border-noc-rose/30">{summary.by_priority.CRITICAL || 0} CRITICAL</span>
                    <span className="text-noc-amber bg-noc-amber/15 px-2 py-0.5 rounded border border-noc-amber/30">{summary.by_priority.HIGH || 0} HIGH</span>
                  </div>
                )}
              </div>

              <div
                onClick={() => {
                  setActiveTab('queue');
                  setQueueView('open');
                }}
                className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc cursor-pointer hover:border-noc-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Total Open Incidents</span>
                  <div className="p-2 bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2">{summary?.all_open ?? 0}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-2">Active Field Tickets</div>
              </div>

              <div
                onClick={() => {
                  setActiveTab('queue');
                  setQueueView('closed');
                }}
                className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc cursor-pointer hover:border-noc-emerald transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Resolved Today</span>
                  <div className="p-2 bg-noc-emerald/15 text-noc-emerald border border-noc-emerald/30 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2">{summary?.closed_today ?? 0}</div>
                <div className="text-[11px] text-noc-emerald font-mono mt-2">Confirmed by Students</div>
              </div>

              <div
                onClick={() => setActiveTab('techs')}
                className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc cursor-pointer hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Field Fleet Radar</span>
                  <div className="p-2 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-xs font-mono text-purple-400 mt-3 font-semibold uppercase">Manage Fleet Availability</div>
              </div>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="bg-noc-panel p-1.5 rounded-xl border border-noc-border shadow-noc flex items-center gap-2 overflow-x-auto text-xs font-mono font-semibold">
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'queue' ? 'bg-noc-highlight text-white shadow-noc-glow' : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Incident Queue</span>
              </button>

              <button
                onClick={() => setActiveTab('techs')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'techs' ? 'bg-noc-highlight text-white shadow-noc-glow' : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Technician Fleet Status</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'reports' ? 'bg-noc-highlight text-white shadow-noc-glow' : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Reports</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'leaderboard' ? 'bg-noc-highlight text-white shadow-noc-glow' : 'text-slate-400 hover:text-white hover:bg-noc-surface'
                }`}
              >
                <Trophy className="w-4 h-4 text-noc-gold" />
                <span>Quality Leaderboard</span>
              </button>
            </div>

            {/* Tab 1: Queue */}
            {activeTab === 'queue' && (
              <div className="space-y-4">
                {/* Search and Filters Bar */}
                <div className="bg-noc-panel p-4 rounded-xl border border-noc-border shadow-noc flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {(['open', 'open_unassigned', 'closed', 'all'] as const).map((vw) => (
                      <button
                        key={vw}
                        onClick={() => {
                          setQueueView(vw);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors shrink-0 cursor-pointer ${
                          queueView === vw
                            ? 'bg-noc-highlight text-white shadow-noc-glow'
                            : 'bg-noc-surface text-slate-400 hover:text-white border border-noc-border'
                        }`}
                      >
                        {vw.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto flex-wrap font-sans">
                    <select
                      value={priorityFilter}
                      onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                      className="px-3 py-1.5 border border-noc-border rounded-lg bg-noc-bg text-slate-200 text-xs font-mono focus:outline-none focus:border-noc-accent"
                    >
                      <option value="">All Priorities</option>
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>

                    <select
                      value={problemTypeFilter}
                      onChange={(e) => { setProblemTypeFilter(e.target.value); setPage(1); }}
                      className="px-3 py-1.5 border border-noc-border rounded-lg bg-noc-bg text-slate-200 text-xs font-mono focus:outline-none focus:border-noc-accent"
                    >
                      <option value="">All Categories</option>
                      <option value="WIFI_PROBLEM">WIFI PROBLEM</option>
                      <option value="LAN_PROBLEM">LAN PROBLEM</option>
                      <option value="IP_ADDRESS_ISSUE">I.P ADDRESS ISSUE</option>
                      <option value="PROXY_ISSUE">PROXY ISSUE</option>
                      <option value="LAN_PORT_BROKEN">LAN PORT BROKEN</option>
                    </select>

                    <div className="relative flex-1 md:w-56 font-mono">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search ticket # or student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadData()}
                        className="w-full pl-8 pr-3 py-1.5 bg-noc-bg text-slate-100 border border-noc-border rounded-lg text-xs focus:outline-none focus:border-noc-accent"
                      />
                    </div>
                    <button
                      onClick={loadData}
                      className="p-2 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      title="Refresh Queue"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Complaint Table */}
                <ComplaintList complaints={complaints} onSelect={handleSelectComplaint} />
              </div>
            )}

            {/* Tab 2: Technicians Availability */}
            {activeTab === 'techs' && (
              <div className="bg-noc-panel rounded-xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-noc-border pb-3">
                  <Users className="w-5 h-5 text-noc-accent" />
                  <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                    FIELD TECHNICIAN FLEET STATUS & AVAILABILITY
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
                        <th className="p-3.5">Technician Name</th>
                        <th className="p-3.5">Operator ID</th>
                        <th className="p-3.5">Assigned Zones</th>
                        <th className="p-3.5">Active Work Orders</th>
                        <th className="p-3.5">Availability</th>
                        <th className="p-3.5 text-right">Dispatch Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-noc-border/60">
                      {technicians.map((t) => (
                        <tr key={t._id} className="hover:bg-noc-surface/60 transition-colors">
                          <td className="p-3.5 font-semibold text-white">{t.full_name}</td>
                          <td className="p-3.5 font-mono text-slate-400">{t.username}</td>
                          <td className="p-3.5 text-slate-300">{t.zones?.join(', ') || 'All Campus Zones'}</td>
                          <td className="p-3.5 font-mono font-bold text-noc-accent">{t.open_complaints_count} open</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border uppercase ${
                                t.availability === 'AVAILABLE'
                                  ? 'bg-noc-emerald/15 text-noc-emerald border-noc-emerald/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {t.availability}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono">
                            <button
                              onClick={() => handleToggleAvailability(t._id, t.availability)}
                              className="px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Set {t.availability === 'AVAILABLE' ? 'Unavailable' : 'Available'}
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
              <div className="bg-noc-panel rounded-xl border border-noc-border shadow-noc p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-noc-border pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-noc-accent" />
                    <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                      INCIDENT METRICS & RESOLUTION ANALYTICS
                    </h2>
                  </div>
                  <select
                    value={reportRange}
                    onChange={(e) => setReportRange(e.target.value)}
                    className="p-2 border border-noc-border rounded-lg text-xs font-mono font-semibold bg-noc-bg text-slate-200 focus:outline-none focus:border-noc-accent"
                  >
                    <option value="today">Today (IST)</option>
                    <option value="weekly">Last 7 Days</option>
                    <option value="all">All-Time Cumulative</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-slate-400 uppercase tracking-wider block">Total Received</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{reports.total_complaints}</span>
                  </div>
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-slate-400 uppercase tracking-wider block">Total Resolved</span>
                    <span className="text-2xl font-bold text-noc-emerald mt-1 block">{reports.total_resolved}</span>
                  </div>
                  <div className="bg-noc-surface p-4 rounded-xl border border-noc-border">
                    <span className="text-slate-400 uppercase tracking-wider block">Avg Resolution Time</span>
                    <span className="text-2xl font-bold text-noc-accent mt-1 block">{reports.avg_resolution_hours} Hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <h3 className="font-bold font-mono uppercase text-slate-300 mb-2 tracking-wider">Incidents by Category</h3>
                    <ul className="divide-y divide-noc-border border border-noc-border rounded-xl bg-noc-bg overflow-hidden font-mono">
                      {Object.entries(reports.by_problem_type || {}).map(([pt, cnt]: any) => (
                        <li key={pt} className="p-3 flex justify-between">
                          <span className="text-slate-300">{pt.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-noc-accent">{cnt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold font-mono uppercase text-slate-300 mb-2 tracking-wider">Incidents by Location</h3>
                    <ul className="divide-y divide-noc-border border border-noc-border rounded-xl bg-noc-bg overflow-hidden font-mono">
                      {Object.entries(reports.by_location || {}).map(([loc, cnt]: any) => (
                        <li key={loc} className="p-3 flex justify-between">
                          <span className="text-slate-300">{loc}</span>
                          <span className="font-bold text-noc-accent">{cnt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="bg-noc-panel rounded-xl border border-noc-border shadow-noc overflow-hidden p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-noc-border pb-3">
                  <Trophy className="w-5 h-5 text-noc-gold" />
                  <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                    TECHNICIAN QUALITY & PERFORMANCE LEADERBOARD
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
                        <th className="p-3.5">Rank</th>
                        <th className="p-3.5">Technician Name</th>
                        <th className="p-3.5">Average Rating</th>
                        <th className="p-3.5">Audited Ratings</th>
                        <th className="p-3.5">Resolved Count</th>
                        <th className="p-3.5 text-right">Computed Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-noc-border/60">
                      {leaderboard.map((lb) => (
                        <tr key={lb.technician_id} className="hover:bg-noc-surface/60 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-noc-accent">#{lb.rank}</td>
                          <td className="p-3.5 font-semibold text-white">{lb.name}</td>
                          <td className="p-3.5">
                            {lb.average_rating ? (
                              <div className="flex items-center gap-2">
                                <StarRating value={Math.round(lb.average_rating)} readOnly size={16} />
                                <span className="font-bold font-mono text-noc-gold">{lb.average_rating}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-mono italic">Unrated</span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{lb.rating_count} reviews</td>
                          <td className="p-3.5 font-mono font-bold text-noc-emerald">{lb.resolved_count} closed</td>
                          <td className="p-3.5 text-right font-mono font-bold text-noc-accent text-sm">{lb.score}</td>
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

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} MNNIT ALLAHABAD IT SERVICES & NETWORK OPERATIONS // COMPUTER CENTRE
      </footer>
    </div>
  );
};
