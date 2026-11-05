// MODULE: Complaint Management (Part 2)
// Home page rendering complaint registration form and modal email-OTP verification step.

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getConfig, requestOTP, verifyOTP, resendOTP } from '../api/complaints';
import { ConfigResponse, ProblemType } from '../types';
import { ComplaintForm } from '../components/form/ComplaintForm';
import { ChatLauncher } from '../components/chat/ChatLauncher';
import { ChatPanel } from '../components/chat/ChatPanel';
import { Shield, KeyRound, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
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
      setOtpError('Please enter 6-digit OTP');
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
      alert('A fresh OTP code has been sent to your email.');
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleAutoFillForm = (data: { problem_type: ProblemType; additional_comment: string }) => {
    setAiFilledData(data);
    setHasAutoFilled(true);
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      {/* College Header */}
      <header className="bg-noc-panel border-b border-noc-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MNNIT Allahabad Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-noc-border shadow-sm"
            />
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">
                {config?.college_name || 'MNNIT Allahabad'}
              </h1>
              <p className="text-[11px] text-slate-400">
                Network Complaint &amp; Diagnostic Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-noc-surface hover:bg-noc-border text-slate-200 hover:text-white border border-noc-border rounded-lg text-xs font-semibold transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-noc-cyan" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {otpStep ? (
          <div className="max-w-md mx-auto my-10 bg-noc-panel border border-noc-border rounded-2xl shadow-noc p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-noc-surface border border-noc-border text-noc-cyan rounded-xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Verify Email OTP</h2>
              <p className="text-xs text-slate-400 mt-1">
                A 6-digit verification code was sent to <span className="font-semibold text-slate-200">{submittedEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-noc-rose/10 text-noc-rose text-xs flex items-center gap-2 rounded-lg mb-4 border border-noc-rose/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  required
                  autoFocus
                  className="w-full text-center tracking-widest text-lg font-bold font-mono py-3 bg-noc-bg border border-noc-border rounded-xl text-white focus:outline-none focus:border-noc-accent"
                />
              </div>

              <button
                type="submit"
                disabled={verifying || otpCode.length !== 6}
                className="w-full py-3 bg-noc-accent hover:bg-blue-600 text-white font-semibold rounded-xl shadow-noc transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {verifying ? 'Verifying OTP...' : 'Verify & Register Complaint'}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || verifying}
                  onClick={handleResendOTP}
                  className="text-noc-cyan hover:underline font-semibold disabled:text-slate-500 disabled:no-underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : config ? (
          <ComplaintForm
            locations={config.locations}
            problemTypes={config.problem_types}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            autoFilled={hasAutoFilled}
            aiFilledData={aiFilledData}
          />
        ) : (
          <div className="p-12 text-center text-slate-500">Loading portal configuration...</div>
        )}
      </main>

      {/* Clean Official Footer */}
      <footer className="bg-noc-panel border-t border-noc-border py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MNNIT Allahabad IT Services. All Rights Reserved.
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
