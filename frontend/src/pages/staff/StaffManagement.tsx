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
  LogOut
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRole, setNewRole] = useState<'TECHNICIAN' | 'MANAGER'>('TECHNICIAN');
  const [addLoading, setAddLoading] = useState(false);

  // Reset Password Modal State
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState('');
  const [resetPwd, setResetPwd] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const loadStaff = () => {
    setLoading(true);
    fetchStaffUsers()
      .then((data: any) => setStaffList(data))
      .catch((err: any) => setError(err.message || 'Failed to load staff list'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAddLoading(true);
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
      setNewUsername('');
      setNewPassword('');
      setNewFullName('');
      setNewEmail('');
      setNewMobile('');
      loadStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to create staff account');
    } finally {
      setAddLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    setError(null);
    setResetLoading(true);
    try {
      await resetStaffPassword(selectedStaffId, resetPwd);
      setIsResetOpen(false);
      setResetPwd('');
      alert('Password reset successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const handleToggleStatus = async (s: any) => {
    try {
      if (s.is_active) {
        if (!window.confirm(`Deactivate staff user '${s.full_name}'?`)) return;
        await deactivateStaffUser(s._id);
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
              <h1 className="text-base font-bold text-white tracking-tight">Staff Account Management</h1>
              <p className="text-[11px] text-slate-400">Admin Control of Operators &amp; Technicians</p>
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
              <Users className="w-5 h-5 text-noc-cyan" />
              <h2 className="text-base font-bold text-white">Staff Accounts &amp; Roles</h2>
            </div>
            <button
              onClick={() => {
                setError(null);
                setIsAddOpen(true);
              }}
              className="px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-noc"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Account</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-noc-rose/10 border border-noc-rose/30 text-noc-rose text-xs flex items-center gap-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Staff Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-semibold uppercase">
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border">
                {staffList.map((s) => (
                  <tr key={s._id} className="hover:bg-noc-surface/40 transition-colors">
                    <td className="p-3 font-semibold text-white">{s.full_name}</td>
                    <td className="p-3 font-mono text-slate-400">{s.username}</td>
                    <td className="p-3 font-mono font-bold text-noc-cyan">{s.role}</td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">{s.email}</td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">{s.mobile}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.is_active
                            ? 'bg-noc-emerald/15 text-noc-emerald border border-noc-emerald/30'
                            : 'bg-noc-rose/15 text-noc-rose border border-noc-rose/30'
                        }`}
                      >
                        {s.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedStaffId(s._id);
                          setTargetName(s.full_name);
                          setIsResetOpen(true);
                        }}
                        className="px-2.5 py-1 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                        title="Reset user password"
                      >
                        Reset PW
                      </button>
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                          s.is_active
                            ? 'bg-noc-amber/15 text-noc-amber border-noc-amber/30 hover:bg-noc-amber/25'
                            : 'bg-noc-emerald/15 text-noc-emerald border-noc-emerald/30 hover:bg-noc-emerald/25'
                        }`}
                      >
                        {s.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Staff Account Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-noc-panel rounded-2xl shadow-2xl max-w-md w-full p-6 border border-noc-border text-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-noc-border pb-3">
              <h3 className="text-base font-bold text-white">Add Staff Account</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Singh"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. ramesh_tech"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Initial secure password"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent"
                >
                  <option value="TECHNICIAN" className="bg-noc-panel text-slate-200">Technician</option>
                  <option value="MANAGER" className="bg-noc-panel text-slate-200">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ramesh@mnnit.ac.in"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
                <input
                  type="tel"
                  required
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-noc-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-noc-border rounded-xl text-xs font-semibold text-slate-300 hover:bg-noc-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {addLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-noc-panel rounded-2xl shadow-2xl max-w-md w-full p-6 border border-noc-border text-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-noc-border pb-3">
              <h3 className="text-base font-bold text-white">Reset Staff Password</h3>
              <button onClick={() => setIsResetOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Enter a new password for <span className="font-semibold text-white">{targetName}</span>.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={resetPwd}
                  onChange={(e) => setResetPwd(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-2.5 bg-noc-bg text-xs border border-noc-border rounded-xl text-slate-100 focus:outline-none focus:border-noc-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-noc-border">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 border border-noc-border rounded-xl text-xs font-semibold text-slate-300 hover:bg-noc-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
