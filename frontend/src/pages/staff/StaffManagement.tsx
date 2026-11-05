import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchStaffUsers,
  createStaffUser,
  resetStaffPassword,
  deactivateStaffUser,
  reactivateStaffUser
} from '../../api/complaints';
import { adminLogout } from '../../api/admin';
import {
  Users,
  UserPlus,
  KeyRound,
  ShieldAlert,
  CheckCircle,
  X,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Shield
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Form states
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRole, setNewRole] = useState<'MANAGER' | 'TECHNICIAN'>('TECHNICIAN');
  const [resetPwd, setResetPwd] = useState('');

  const [error, setError] = useState<string | null>(null);

  const loadStaff = () => {
    setLoading(true);
    fetchStaffUsers()
      .then((data) => setStaffList(data))
      .catch((err) => setError(err.message || 'Failed to load staff list'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createStaffUser({
        username: newUsername,
        password: newPassword,
        full_name: newFullName,
        email: newEmail,
        mobile: newMobile,
        role: newRole,
        zones: []
      });
      setIsAddOpen(false);
      loadStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to create staff account');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    setError(null);
    try {
      await resetStaffPassword(selectedStaffId, resetPwd);
      setIsResetOpen(false);
      setResetPwd('');
      alert('Password reset successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    }
  };

  const handleToggleActive = async (s: any) => {
    try {
      if (s.is_active) {
        if (window.confirm(`Deactivate operator account '${s.full_name}'?`)) {
          await deactivateStaffUser(s._id);
        }
      } else {
        await reactivateStaffUser(s._id);
      }
      loadStaff();
    } catch (err: any) {
      alert(err.message || 'Action failed');
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
                  STAFF OPERATOR & ACCESS CONTROL
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold uppercase">
                  SECURITY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Operator Account Provisioning, Role Assignments & Credential Audits
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
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                AUTHENTICATED OPERATOR ROSTER ({staffList.length})
              </h2>
            </div>
            <button
              onClick={() => {
                setError(null);
                setIsAddOpen(true);
              }}
              className="px-4 py-2 bg-noc-highlight hover:bg-blue-600 text-white text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-noc-glow"
            >
              <UserPlus className="w-4 h-4" />
              <span>PROVISION NEW OPERATOR</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-noc-rose/10 border border-noc-rose/30 text-noc-rose text-xs flex items-center gap-2 rounded-xl font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Staff Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Operator ID</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Account Status</th>
                  <th className="p-3.5 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border/60">
                {staffList.map((s) => (
                  <tr key={s._id} className="hover:bg-noc-surface/60 transition-colors">
                    <td className="p-3.5 font-semibold text-white">{s.full_name}</td>
                    <td className="p-3.5 font-mono text-slate-400">{s.username}</td>
                    <td className="p-3.5 font-mono font-bold text-noc-accent">{s.role}</td>
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">{s.email}</td>
                    <td className="p-3.5 text-slate-400 font-mono">{s.mobile}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                          s.is_active
                            ? 'bg-noc-emerald/15 text-noc-emerald border-noc-emerald/30'
                            : 'bg-noc-rose/15 text-noc-rose border-noc-rose/30'
                        }`}
                      >
                        {s.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2 font-mono">
                      <button
                        onClick={() => {
                          setSelectedStaffId(s._id);
                          setIsResetOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg cursor-pointer transition-colors"
                        title="Reset Operator Password"
                      >
                        <KeyRound className="w-4 h-4 inline" />
                      </button>

                      {s.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleActive(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                            s.is_active
                              ? 'bg-noc-rose/15 text-noc-rose border-noc-rose/30 hover:bg-noc-rose/25'
                              : 'bg-noc-emerald/15 text-noc-emerald border-noc-emerald/30 hover:bg-noc-emerald/25'
                          }`}
                        >
                          {s.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Staff Modal */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-noc-panel border border-noc-border rounded-xl shadow-noc w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-noc-border pb-3">
                  <h3 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                    PROVISION OPERATOR ACCOUNT
                  </h3>
                  <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Assigned Role</label>
                    <select
                      value={newRole}
                      onChange={(e: any) => setNewRole(e.target.value)}
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border font-mono focus:outline-none focus:border-noc-accent"
                    >
                      <option value="MANAGER">MANAGER</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Operator Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                      placeholder="e.g. manager_svbh or tech_cvr"
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border font-mono focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Initial Password (Min 8 Chars)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border font-mono focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Full Operator Name</label>
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      placeholder="operator@mnnit.ac.in"
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border font-mono focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1">Mobile Contact</label>
                    <input
                      type="tel"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      required
                      placeholder="10-digit number"
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border font-mono focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-noc-border">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 font-mono text-slate-400 hover:text-white bg-noc-surface rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-noc-highlight hover:bg-blue-600 text-white font-mono font-bold rounded-lg cursor-pointer shadow-noc-glow"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reset Password Modal */}
          {isResetOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-noc-panel border border-noc-border rounded-xl shadow-noc w-full max-w-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-noc-border pb-3">
                  <h3 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
                    RESET OPERATOR PASSWORD
                  </h3>
                  <button onClick={() => setIsResetOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-slate-300 mb-1">New Password (Min 8 Chars)</label>
                    <input
                      type="password"
                      value={resetPwd}
                      onChange={(e) => setResetPwd(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-noc-bg text-slate-100 p-2.5 rounded-lg border border-noc-border focus:outline-none focus:border-noc-accent"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-noc-border">
                    <button
                      type="button"
                      onClick={() => setIsResetOpen(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white bg-noc-surface rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-noc-highlight hover:bg-blue-600 text-white font-bold rounded-lg cursor-pointer shadow-noc-glow"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
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
