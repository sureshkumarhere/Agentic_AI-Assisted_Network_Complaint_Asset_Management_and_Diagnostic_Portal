import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getConfig, requestOTP, verifyOTP, resendOTP } from '../api/complaints';
import { ConfigResponse, ProblemType } from '../types';
import { ComplaintForm } from '../components/form/ComplaintForm';
import { NetworkHealthPanel } from '../components/telemetry/NetworkHealthPanel';
import { ChatLauncher } from '../components/chat/ChatLauncher';
import { ChatPanel } from '../components/chat/ChatPanel';
import {
  Shield,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Activity,
  Bot,
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

export const Home: React.FC = () => {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFilledData, setAiFilledData] = useState<{
    problem_type: ProblemType;
    additional_comment: string;
  } | undefined>(undefined);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // OTP Verification State
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [pendingId, setPendingId] = useState<string>('');
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(60);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getConfig().then((data: ConfigResponse) => setConfig(data));
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: any = null;
    if (otpStep && cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpStep, cooldown]);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setOtpError(null);
    try {
      const chatId = sessionStorage.getItem('student_chat_id') || undefined;
      const payload = {
        ...formData,
        chat_id: chatId,
        filled_by_ai: hasAutoFilled
      };

      const res = await requestOTP(payload);
      setPendingId(res.pending_id);
      setSubmittedEmail(formData.email);
      setCooldown(res.resend_cooldown_seconds || 60);
      setOtpStep(true);
    } catch (err: any) {
      alert(err.message || 'OTP request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit OTP code');
      return;
    }

    setVerifying(true);
    setOtpError(null);
    try {
      const res = await verifyOTP(pendingId, otpCode);
      navigate(`/success/${res.ticket_id}`);
    } catch (err: any) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setVerifying(true);
    setOtpError(null);
    try {
      const res = await resendOTP(pendingId);
      setCooldown(res.resend_cooldown_seconds || 60);
      setOtpError(null);
      alert('A fresh OTP has been dispatched to your institute email.');
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleAutoFillForm = (data: { problem_type: ProblemType; additional_comment: string }) => {
    setAiFilledData(data);
    setHasAutoFilled(true);
    setIsChatOpen(false); // Close chat to display filled form
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col noc-grid">
      {/* 1. Tactical NOC Header */}
      <header className="bg-noc-panel/95 backdrop-blur-md border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono uppercase">
                  MNNIT ALLAHABAD // NOC PORTAL
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-noc-emerald/10 text-noc-emerald border border-noc-emerald/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-noc-emerald radar-live" />
                  GATEWAY UP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Campus Network Operations & Autonomous Incident Triage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border text-slate-200 text-xs font-mono rounded-lg transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-noc-cyan" />
              <span>AI Diagnoser</span>
            </button>

            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-noc-highlight/20 hover:bg-noc-highlight text-noc-accent hover:text-white border border-noc-highlight/40 rounded-lg text-xs font-mono font-bold transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Content View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {otpStep ? (
          /* High-Precision OTP Verification Card */
          <div className="max-w-md mx-auto my-12 bg-noc-panel border border-noc-border rounded-2xl shadow-noc p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-noc-highlight/15 text-noc-accent border border-noc-highlight/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide font-mono">
                AUTHORIZE INCIDENT DISPATCH
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                A 6-digit cryptographic verification token was transmitted to:{' '}
                <span className="font-mono text-white block mt-0.5">{submittedEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-noc-rose/10 border border-noc-rose/30 text-noc-rose text-xs flex items-center gap-2 rounded-xl mb-5 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase text-center">
                  Enter 6-Digit Token
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  autoFocus
                  required
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold font-mono py-3.5 bg-noc-bg border border-noc-border rounded-xl text-white focus:outline-none focus:border-noc-accent shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={verifying || otpCode.length !== 6}
                className="w-full py-3.5 bg-noc-highlight hover:bg-blue-600 disabled:opacity-50 text-white font-mono font-bold rounded-xl shadow-noc-glow transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                {verifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Enqueue Incident</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Ticket</span>
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || verifying}
                  onClick={handleResendOTP}
                  className="text-noc-accent hover:text-blue-400 font-semibold disabled:text-slate-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{cooldown > 0 ? `Resend Token (${cooldown}s)` : 'Resend Token'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : config ? (
          /* ACTION-FIRST SPLIT SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Action-First Complaint Filing */}
            <div className="lg:col-span-7">
              <ComplaintForm
                locations={config.locations}
                problemTypes={config.problem_types}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                autoFilled={hasAutoFilled}
                aiFilledData={aiFilledData}
              />
            </div>

            {/* Right 5 Columns: Real-Time Network Health & Telemetry */}
            <div className="lg:col-span-5">
              <NetworkHealthPanel onOpenChat={() => setIsChatOpen(true)} />
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 font-mono">
            <span className="w-6 h-6 border-2 border-noc-accent border-t-transparent rounded-full animate-spin inline-block mb-3" />
            <div>ESTABLISHING CONNECTION TO MNNIT NOC GATEWAY...</div>
          </div>
        )}
      </main>

      {/* 3. NOC Technical Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} MOTILAL NEHRU NATIONAL INSTITUTE OF TECHNOLOGY ALLAHABAD</div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>COMPUTER CENTRE</span>
            <span>•</span>
            <span>CAMPUS NETWORK TELEMETRY v2.5</span>
            <span>•</span>
            <span className="text-noc-emerald">SYSTEMS NORMAL</span>
          </div>
        </div>
      </footer>

      {/* Floating Chat Launcher & Side Panel */}
      <ChatLauncher onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAutoFillForm={handleAutoFillForm}
        hasAutoFilled={hasAutoFilled}
      />
    </div>
  );
};
