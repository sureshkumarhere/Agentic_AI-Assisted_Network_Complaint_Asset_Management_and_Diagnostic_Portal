// MODULE: Complaint Management (Part 2) - this file belongs to the code for this module.
// Staff user login page with bcrypt credential validation and role-based redirect.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStaff } from '../../api/auth';
import { Shield, Lock, User, AlertCircle, Home } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await loginStaff({ username, password });
      document.cookie = `staff_token=${res.token}; path=/; max-age=28800`;
      document.cookie = `admin_token=${res.token}; path=/; max-age=28800`;
      localStorage.setItem('staff_token', res.token);
      localStorage.setItem('staff_role', res.role);

      if (res.role === 'ADMIN') {
        navigate('/admin');
      } else if (res.role === 'MANAGER') {
        navigate('/manager');
      } else {
        navigate('/technician');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      {/* College Header */}
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                MNNIT Allahabad
              </h1>
              <p className="text-[11px] text-slate-400">Network Complaint &amp; Diagnostic Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-noc-cyan" />
              <span>Student View</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border overflow-hidden w-full max-w-md">
          <div className="bg-noc-surface border-b border-noc-border p-8 text-center">
            <div className="w-12 h-12 bg-noc-bg border border-noc-border rounded-xl flex items-center justify-center mx-auto mb-3 text-noc-cyan">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">MNNIT Staff Portal</h2>
            <p className="text-xs text-slate-400 mt-1">IT Services &amp; Network Operations Login</p>
          </div>

          {error && (
            <div className="p-4 bg-noc-rose/15 text-noc-rose text-xs flex items-center gap-2 border-b border-noc-rose/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter staff username"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-noc-bg border border-noc-border text-slate-100 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-noc-accent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-noc-bg border border-noc-border text-slate-100 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-noc-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-noc-accent hover:bg-blue-600 text-white font-semibold rounded-xl shadow-noc transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In to Staff Workspace</span>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
      </footer>
    </div>
  );
};
