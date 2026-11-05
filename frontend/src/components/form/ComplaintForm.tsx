import React, { useState, useEffect } from 'react';
import { LocationOption, ProblemType, ProblemTypeOption } from '../../types';
import {
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  User,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface ComplaintFormProps {
  locations: LocationOption[];
  problemTypes: ProblemTypeOption[];
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  autoFilled: boolean;
  aiFilledData?: { problem_type: ProblemType; additional_comment: string };
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  locations,
  problemTypes,
  onSubmit,
  isSubmitting,
  autoFilled,
  aiFilledData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: locations[0]?.id || 'hostel_svbh',
    address_room: '',
    preferred_from: '09:00',
    preferred_to: '17:00',
    problem_type: problemTypes[0]?.value || ('WIFI_PROBLEM' as ProblemType),
    additional_comment: '',
    honeypot: ''
  });

  const [troubleshootingAcknowledged, setTroubleshootingAcknowledged] = useState(false);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync AI pre-fill data if passed
  useEffect(() => {
    if (aiFilledData) {
      setFormData((prev) => ({
        ...prev,
        problem_type: aiFilledData.problem_type,
        additional_comment: aiFilledData.additional_comment
      }));
      setToastMessage('Auto-diagnosed by Campus AI. Please review the details below.');
      setTimeout(() => setToastMessage(null), 6000);
    }
  }, [aiFilledData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 80) {
      newErrors.name = 'Full name required (2-80 characters)';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid MNNIT email required';
    } else if (!formData.email.toLowerCase().endsWith('@mnnit.ac.in')) {
      newErrors.email = 'Must use official institute email (@mnnit.ac.in)';
    }

    if (!formData.mobile.trim() || !/^(\+91)?\d{10}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = '10-digit mobile number required';
    }

    if (!formData.address_room.trim() || formData.address_room.length > 100) {
      newErrors.address_room = 'Room / Lab / Block designation required';
    }

    if (!formData.preferred_from) {
      newErrors.preferred_from = 'Start time required';
    }
    if (!formData.preferred_to) {
      newErrors.preferred_to = 'End time required';
    } else if (formData.preferred_from && formData.preferred_to <= formData.preferred_from) {
      newErrors.preferred_to = 'End time must be after start time';
    }

    if (!troubleshootingAcknowledged) {
      newErrors.acknowledged = 'Confirmation of self-troubleshooting is required before dispatch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <div className="bg-noc-panel border border-noc-border rounded-xl shadow-noc overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="bg-noc-surface px-6 py-4 border-b border-noc-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-noc-emerald radar-live" />
            <h2 className="text-base font-bold text-white tracking-wide">
              DISPATCH NEW NETWORK INCIDENT
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Direct queue dispatch to MNNIT Network Engineering Staff
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-noc-highlight/10 text-noc-accent border border-noc-highlight/20 font-semibold uppercase">
          PRIORITY QUEUE
        </span>
      </div>

      {/* AI Pre-fill Notification */}
      {toastMessage && (
        <div className="bg-noc-emerald/10 border-b border-noc-emerald/20 px-6 py-3 text-xs text-emerald-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-noc-emerald shrink-0 animate-spin" />
          <span className="font-medium font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Honeypot hidden field */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Section 1: Student Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-noc-accent" />
              Full Name <span className="text-noc-rose">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Suresh Kumar"
              className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:border-noc-accent ${
                errors.name ? 'border-noc-rose' : 'border-noc-border'
              }`}
            />
            {errors.name && <p className="text-[11px] text-noc-rose mt-1 font-mono">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-noc-accent" />
              Institute Email <span className="text-noc-rose">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username@mnnit.ac.in"
              className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border font-mono transition-colors focus:outline-none focus:border-noc-accent ${
                errors.email ? 'border-noc-rose' : 'border-noc-border'
              }`}
            />
            {errors.email && <p className="text-[11px] text-noc-rose mt-1 font-mono">{errors.email}</p>}
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-noc-accent" />
              Mobile Number <span className="text-noc-rose">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border font-mono transition-colors focus:outline-none focus:border-noc-accent ${
                errors.mobile ? 'border-noc-rose' : 'border-noc-border'
              }`}
            />
            {errors.mobile && <p className="text-[11px] text-noc-rose mt-1 font-mono">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-noc-accent" />
              Hostel / Dept <span className="text-noc-rose">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border transition-colors focus:outline-none focus:border-noc-accent font-mono"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-noc-panel text-slate-200">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="text-noc-accent font-mono font-bold">#</span>
              Room / Lab No. <span className="text-noc-rose">*</span>
            </label>
            <input
              type="text"
              name="address_room"
              value={formData.address_room}
              onChange={handleChange}
              placeholder="e.g. Room 204, B-Wing"
              className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:border-noc-accent ${
                errors.address_room ? 'border-noc-rose' : 'border-noc-border'
              }`}
            />
            {errors.address_room && (
              <p className="text-[11px] text-noc-rose mt-1 font-mono">{errors.address_room}</p>
            )}
          </div>
        </div>

        {/* Section 3: Problem Classification & Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-noc-accent" />
              Problem Category <span className="text-noc-rose">*</span>
            </label>
            <select
              name="problem_type"
              value={formData.problem_type}
              onChange={handleChange}
              className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border transition-colors focus:outline-none focus:border-noc-accent font-mono"
            >
              {problemTypes.map((pt) => (
                <option key={pt.value} value={pt.value} className="bg-noc-panel text-slate-200">
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-noc-accent" />
              Preferred Technician Visit Window <span className="text-noc-rose">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                name="preferred_from"
                value={formData.preferred_from}
                onChange={handleChange}
                className="w-full bg-noc-bg text-sm text-slate-100 px-3 py-2 rounded-lg border border-noc-border font-mono text-center focus:outline-none focus:border-noc-accent"
              />
              <input
                type="time"
                name="preferred_to"
                value={formData.preferred_to}
                onChange={handleChange}
                className="w-full bg-noc-bg text-sm text-slate-100 px-3 py-2 rounded-lg border border-noc-border font-mono text-center focus:outline-none focus:border-noc-accent"
              />
            </div>
            {errors.preferred_to && (
              <p className="text-[11px] text-noc-rose mt-1 font-mono">{errors.preferred_to}</p>
            )}
          </div>
        </div>

        {/* Section 4: Detailed Symptoms */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Symptoms & Error Description (Optional)</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {formData.additional_comment.length}/500 chars
            </span>
          </label>
          <textarea
            name="additional_comment"
            rows={3}
            maxLength={500}
            value={formData.additional_comment}
            onChange={handleChange}
            placeholder="Describe what happens: e.g. Wi-Fi connects but shows 'No Internet Access', or LAN wall jack green light is unlit..."
            className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
          />
        </div>

        {/* Section 5: Mandatory Self-Troubleshooting Verification */}
        <div className="bg-noc-surface border border-noc-border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="ack_checkbox"
                checked={troubleshootingAcknowledged}
                onChange={(e) => {
                  setTroubleshootingAcknowledged(e.target.checked);
                  if (errors.acknowledged) {
                    setErrors((prev) => ({ ...prev, acknowledged: '' }));
                  }
                }}
                className="mt-1 w-4 h-4 rounded border-noc-border bg-noc-bg text-noc-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="ack_checkbox" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
                <span className="font-semibold text-white">Pre-Dispatch Verification:</span> I confirm that I
                have rebooted my device/adapter and verified basic gateway reachability.
              </label>
            </div>
            <button
              type="button"
              onClick={() => setShowTroubleshooter(!showTroubleshooter)}
              className="text-xs font-mono text-noc-accent hover:text-blue-400 flex items-center gap-1 shrink-0 px-2 py-1 bg-noc-highlight/10 rounded border border-noc-highlight/20 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showTroubleshooter ? 'Hide Diagnostics' : 'Quick Diagnostics'}</span>
              {showTroubleshooter ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {errors.acknowledged && (
            <p className="text-[11px] text-noc-rose font-mono flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.acknowledged}</span>
            </p>
          )}

          {/* Quick Diagnostics Accordion Drawer */}
          {showTroubleshooter && (
            <div className="pt-3 border-t border-noc-border text-xs space-y-2.5 font-mono text-slate-300">
              <div className="bg-noc-bg p-3 rounded-lg border border-noc-border space-y-2">
                <div className="text-[11px] text-slate-400 font-sans font-semibold">
                  1. Check IP Configuration & Gateway Reachability:
                </div>
                <div className="flex items-center justify-between bg-noc-panel px-2.5 py-1.5 rounded border border-noc-border/80">
                  <code className="text-noc-cyan">ping 172.31.1.1</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('ping 172.31.1.1')}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === 'ping 172.31.1.1' ? <Check className="w-3.5 h-3.5 text-noc-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-sans font-semibold pt-1">
                  2. Renew DHCP Lease on Hostel Subnet:
                </div>
                <div className="flex items-center justify-between bg-noc-panel px-2.5 py-1.5 rounded border border-noc-border/80">
                  <code className="text-noc-cyan">ipconfig /renew</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('ipconfig /renew')}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === 'ipconfig /renew' ? <Check className="w-3.5 h-3.5 text-noc-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Dispatch Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-noc-highlight hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-noc-glow transition-all flex items-center justify-center gap-2 text-sm tracking-wide uppercase font-mono cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Transmitting Incident Ticket...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Proceed to OTP Verification & Dispatch</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
