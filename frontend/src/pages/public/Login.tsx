import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStaff } from '../../api/auth';
import { Shield, Lock, User, AlertCircle, Home, Key, Radio } from 'lucide-react';
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
      // Store token in cookies / localStorage
      document.cookie = `staff_token=${res.token}; path=/; max-age=28800`;
      document.cookie = `admin_token=${res.token}; path=/; max-age=28800`;
      localStorage.setItem('staff_token', res.token);
      localStorage.setItem('staff_role', res.role);

      // Redirect by role
      if (res.role === 'ADMIN') {
        navigate('/admin');
      } else if (res.role === 'MANAGER') {
        navigate('/manager');
      } else {
        navigate('/technician');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* NOC Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                MNNIT ALLAHABAD // NOC PORTAL
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                Staff Authentication Gateway
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 text-xs font-mono rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-noc-accent" />
            <span>Student View</span>
          </Link>
        </div>
      </header>

      {/* Main Login View */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-noc-panel border border-noc-border rounded-2xl shadow-noc overflow-hidden">
          {/* Header Panel */}
          <div className="bg-noc-surface px-6 py-6 border-b border-noc-border text-center">
            <div className="w-12 h-12 bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
              NOC SECURE ACCESS CONSOLE
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Sign in with your Network Operations, Manager, or Admin credentials
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-noc-rose/10 border-b border-noc-rose/30 text-noc-rose text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Operator Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or tech_svbh"
                  required
                  autoFocus
                  className="w-full bg-noc-bg text-sm text-slate-100 pl-10 pr-3.5 py-2.5 rounded-lg border border-noc-border font-mono transition-colors focus:outline-none focus:border-noc-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-noc-bg text-sm text-slate-100 pl-10 pr-3.5 py-2.5 rounded-lg border border-noc-border font-mono transition-colors focus:outline-none focus:border-noc-accent"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-noc-highlight hover:bg-blue-600 disabled:opacity-50 text-white font-mono font-bold rounded-xl shadow-noc-glow transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating Access...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono text-center pt-2 leading-relaxed">
              Rate-limited endpoint: 5 failed consecutive attempts triggers an automatic 15-minute IP security quarantine.
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} MNNIT ALLAHABAD IT SERVICES & NETWORK OPERATIONS // COMPUTER CENTRE
      </footer>
    </div>
  );
};
