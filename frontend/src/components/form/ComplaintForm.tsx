import React, { useState, useEffect } from 'react';
import { LocationOption, ProblemType, ProblemTypeOption } from '../../types';
import {
  Send,
  Sparkles,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  User,
  Phone,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { InternetTroubleshootingGuide } from '../troubleshooting/InternetTroubleshootingGuide';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync AI filled data if triggered from chat
  useEffect(() => {
    if (aiFilledData) {
      setFormData((prev) => ({
        ...prev,
        problem_type: aiFilledData.problem_type,
        additional_comment: aiFilledData.additional_comment
      }));
      setToastMessage('Complaint form auto-filled by Campus AI Diagnoser');
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
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
      newErrors.acknowledged = 'You must confirm that you have followed the self-troubleshooting steps before submitting.';
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
    <div className="bg-noc-panel border border-noc-border rounded-2xl shadow-noc overflow-hidden flex flex-col">
      {/* Form Header */}
      <div className="bg-noc-surface px-6 py-5 border-b border-noc-border">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Submit Network Complaint
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          MNNIT Allahabad Network Services &amp; Diagnostic Portal
        </p>
      </div>

      {/* AI Pre-fill Notification */}
      {toastMessage && (
        <div className="bg-noc-highlight/15 border-b border-noc-highlight/30 px-6 py-3 text-xs text-noc-cyan flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-noc-cyan shrink-0 animate-pulse" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Section 1: Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-noc-border pb-2">
            <User className="w-3.5 h-3.5 text-noc-cyan" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                Full Name <span className="text-noc-rose">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:border-noc-accent ${
                  errors.name ? 'border-noc-rose' : 'border-noc-border'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-noc-rose mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                Institute Email <span className="text-noc-rose">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@mnnit.ac.in"
                className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:border-noc-accent font-mono ${
                  errors.email ? 'border-noc-rose' : 'border-noc-border'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-noc-rose mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-noc-cyan" />
              Mobile Number (10 digits) <span className="text-noc-rose">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              maxLength={13}
              className={`w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:border-noc-accent font-mono ${
                errors.mobile ? 'border-noc-rose' : 'border-noc-border'
              }`}
            />
            {errors.mobile && (
              <p className="text-[11px] text-noc-rose mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.mobile}</span>
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-noc-border pb-2">
            <MapPin className="w-3.5 h-3.5 text-noc-cyan" />
            Location Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                Hostel / Department <span className="text-noc-rose">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border transition-colors focus:outline-none focus:border-noc-accent"
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
                Room / Lab Number <span className="text-noc-rose">*</span>
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
                <p className="text-[11px] text-noc-rose mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.address_room}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Issue Classification & Availability */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-noc-border pb-2">
            <HelpCircle className="w-3.5 h-3.5 text-noc-cyan" />
            Issue Category &amp; Preferred Time
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Problem Category <span className="text-noc-rose">*</span>
              </label>
              <select
                name="problem_type"
                value={formData.problem_type}
                onChange={handleChange}
                className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border transition-colors focus:outline-none focus:border-noc-accent"
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
                <Clock className="w-3.5 h-3.5 text-noc-cyan" />
                Preferred Time for Visit <span className="text-noc-rose">*</span>
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
                <p className="text-[11px] text-noc-rose mt-1">{errors.preferred_to}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Symptoms / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Problem Description / Symptoms (Optional)</span>
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
            placeholder="Describe what happens: e.g. Wi-Fi connects but shows 'No Internet Access', or LAN wall jack is loose..."
            className="w-full bg-noc-bg text-sm text-slate-100 px-3.5 py-2.5 rounded-lg border border-noc-border resize-none transition-colors focus:outline-none focus:border-noc-accent"
          />
        </div>

        {/* Section 5: Official Computer Centre Troubleshooting Guide from Main */}
        <div className="pt-2">
          <InternetTroubleshootingGuide
            acknowledged={troubleshootingAcknowledged}
            onAcknowledgeChange={(checked) => {
              setTroubleshootingAcknowledged(checked);
              if (errors.acknowledged) {
                setErrors((prev) => ({ ...prev, acknowledged: '' }));
              }
            }}
            error={errors.acknowledged}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !troubleshootingAcknowledged}
          className="w-full py-3.5 px-4 bg-noc-accent hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl shadow-noc transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting Complaint...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Verify Email OTP &amp; Submit Complaint</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
