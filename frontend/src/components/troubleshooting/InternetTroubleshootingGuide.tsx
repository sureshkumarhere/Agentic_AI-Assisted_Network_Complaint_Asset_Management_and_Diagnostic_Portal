import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  Network,
  ShieldCheck,
  Globe,
  ClipboardList,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface InternetTroubleshootingGuideProps {
  acknowledged?: boolean;
  onAcknowledgeChange?: (checked: boolean) => void;
  error?: string;
}

export const InternetTroubleshootingGuide: React.FC<InternetTroubleshootingGuideProps> = ({
  acknowledged,
  onAcknowledgeChange,
  error
}) => {
  // Store open state for each step (default Step 1 and Step 2 open, or all collapsed)
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleStep = (stepNumber: number) => {
    setOpenSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const expandAll = () => {
    setOpenSteps({ 1: true, 2: true, 3: true, 4: true, 5: true });
  };

  const collapseAll = () => {
    setOpenSteps({ 1: false, 2: false, 3: false, 4: false, 5: false });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const isAnyOpen = Object.values(openSteps).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden mb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <Network className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Hostel Internet Self-Troubleshooting Guide
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded-full">
                  Computer Centre Advisory
                </span>
              </div>
              <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                If internet is not working in your hostel room, please complete these 5 verification steps before lodging a complaint. Most connection problems are resolved within 2 minutes by correcting IP or proxy settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={isAnyOpen ? collapseAll : expandAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 transition-colors border border-white/15"
            >
              {isAnyOpen ? 'Collapse All' : 'Expand All Steps'}
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="divide-y divide-slate-100">
        {/* STEP 1 */}
        <div className="transition-colors">
          <button
            type="button"
            onClick={() => toggleStep(1)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-2 flex-wrap">
                  <span>Step 1: Check Static IP Configuration</span>
                  <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                    ncpa.cpl
                  </code>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Verify room-allotted IP, subnet mask, default gateway, and DNS in Ethernet properties.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <span className="text-xs hidden md:inline-block font-medium">
                {openSteps[1] ? 'Hide' : 'View'}
              </span>
              {openSteps[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSteps[1] && (
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 bg-slate-50/50 space-y-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="font-medium text-slate-700">
                  How to open Ethernet IPv4 settings in Windows:
                </p>
                <div className="flex items-center gap-2 flex-wrap text-slate-800">
                  <span className="font-semibold">Shortcut:</span>
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono font-bold">Win + R</kbd>
                  <span>$\rightarrow$ type</span>
                  <div className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                    <span>ncpa.cpl</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('ncpa.cpl')}
                      title="Copy command"
                      className="text-slate-400 hover:text-white ml-1"
                    >
                      {copiedText === 'ncpa.cpl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span>and hit Enter.</span>
                </div>
                <p className="text-slate-600">
                  Double-click <strong>Ethernet</strong> $\rightarrow$ Click <strong>Properties</strong> $\rightarrow$ Double-click <strong>Internet Protocol Version 4 (TCP/IPv4)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Required Settings</span>
                  <ul className="mt-1.5 space-y-1 text-slate-700">
                    <li>• <strong>IP Address:</strong> Room-allotted static IP</li>
                    <li>• <strong>Subnet Mask:</strong> As per hostel allocation (e.g., 255.255.0.0)</li>
                    <li>• <strong>Default Gateway:</strong> Hostel block gateway</li>
                    <li>• <strong>DNS Server:</strong> Computer Centre DNS</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Strict Rule:</span>
                      <p className="mt-0.5 text-[11px] leading-relaxed">
                        Never invent an arbitrary IP or use another student's IP address. Doing so creates an IP conflict that immediately disables internet access for both rooms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className="transition-colors">
          <button
            type="button"
            onClick={() => toggleStep(2)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors flex items-center gap-2 flex-wrap">
                  <span>Step 2: Check Network Connectivity (Ping Campus Core Switch)</span>
                  <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                    172.31.100.1
                  </code>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Test physical cable, wall port, and hostel access switch reachability to the backbone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <span className="text-xs hidden md:inline-block font-medium">
                {openSteps[2] ? 'Hide' : 'View'}
              </span>
              {openSteps[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSteps[2] && (
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 bg-slate-50/50 space-y-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="text-slate-700">
                  Open Command Prompt (<strong>Win + R</strong> $\rightarrow$ type <code className="bg-slate-100 px-1 py-0.5 rounded">cmd</code> $\rightarrow$ Enter) and run:
                </p>
                <div className="flex items-center justify-between p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[12px]">
                  <span>ping 172.31.100.1 -t</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('ping 172.31.100.1 -t')}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors"
                  >
                    {copiedText === 'ping 172.31.100.1 -t' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  (Note: <code className="font-semibold text-slate-700">172.31.100.1</code> is the IP address of the MNNIT Campus Core Switch. Press <kbd className="font-mono bg-slate-100 px-1 border rounded">Ctrl + C</kbd> to stop the test).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>If continuous "Reply from 172.31.100.1":</span>
                  </div>
                  <p className="text-emerald-900 mt-1 text-[11px] leading-relaxed">
                    Your physical cable, room wall port, and hostel access switch are working properly. Proceed directly to <strong>Step 3</strong> to configure your Proxy.
                  </p>
                </div>

                <div className="p-3 bg-red-50/80 rounded-xl border border-red-200">
                  <div className="flex items-start gap-1.5 font-bold text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>If "Request timed out" or "Host unreachable":</span>
                  </div>
                  <p className="text-red-900 mt-1 text-[11px] leading-relaxed">
                    Physical layer issue (loose LAN cable, faulty wall socket, or floor switch down). Re-plug your cable firmly. If it still fails, please take a screenshot of CMD for your complaint.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div className="transition-colors">
          <button
            type="button"
            onClick={() => toggleStep(3)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors flex items-center gap-2 flex-wrap">
                  <span>Step 3: Configure Internet Proxy</span>
                  <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                    inetcpl.cpl : 3128
                  </code>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Set the active campus proxy server IP and port in Internet Properties LAN Settings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <span className="text-xs hidden md:inline-block font-medium">
                {openSteps[3] ? 'Hide' : 'View'}
              </span>
              {openSteps[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSteps[3] && (
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 bg-slate-50/50 space-y-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="font-medium text-slate-700">
                  How to configure Campus Proxy in Windows:
                </p>
                <div className="flex items-center gap-2 flex-wrap text-slate-800">
                  <span className="font-semibold">Shortcut:</span>
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono font-bold">Win + R</kbd>
                  <span>$\rightarrow$ type</span>
                  <div className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                    <span>inetcpl.cpl</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('inetcpl.cpl')}
                      title="Copy command"
                      className="text-slate-400 hover:text-white ml-1"
                    >
                      {copiedText === 'inetcpl.cpl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span>and hit Enter.</span>
                </div>
                <p className="text-slate-600">
                  Navigate to <strong>Connections</strong> tab $\rightarrow$ Click <strong>LAN Settings</strong> $\rightarrow$ Check <strong>"Use a proxy server for your LAN"</strong>.
                </p>
              </div>

              {/* Proxy List */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Available Campus Proxy Servers (Port: 3128)</span>
                  <span className="text-[10px] text-slate-500">Pick ONE only</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-900 text-[13px]">172.31.100.29</span>
                      <span className="ml-2 text-[10px] font-semibold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                        Recommended First
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('172.31.100.29')}
                      className="text-slate-400 hover:text-blue-700 p-1"
                    >
                      {copiedText === '172.31.100.29' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-800 text-[13px]">172.31.100.27</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('172.31.100.27')}
                      className="text-slate-400 hover:text-blue-700 p-1"
                    >
                      {copiedText === '172.31.100.27' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-800 text-[13px]">172.31.102.29</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('172.31.102.29')}
                      className="text-slate-400 hover:text-blue-700 p-1"
                    >
                      {copiedText === '172.31.102.29' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-800 text-[13px]">172.31.100.25</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('172.31.100.25')}
                      className="text-slate-400 hover:text-blue-700 p-1"
                    >
                      {copiedText === '172.31.100.25' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <strong>Important Rule:</strong> Set only <strong>ONE</strong> proxy IP at a time, never all four simultaneously. Test with <code className="font-mono bg-white px-1 rounded">172.31.100.29</code> first. If that server is busy or inaccessible, switch to <code className="font-mono bg-white px-1 rounded">.27</code>.
                </div>

                <div className="flex items-center gap-2 pt-1 text-slate-600">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional reachability check:</span>
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-slate-800">
                    ping 172.31.100.29
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 4 */}
        <div className="transition-colors">
          <button
            type="button"
            onClick={() => toggleStep(4)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-2 flex-wrap">
                  <span>Step 4: Test Internet in Browser</span>
                  <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                    google.com
                  </code>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Open Chrome / Edge, load a website, and complete student proxy authentication if requested.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <span className="text-xs hidden md:inline-block font-medium">
                {openSteps[4] ? 'Hide' : 'View'}
              </span>
              {openSteps[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSteps[4] && (
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 bg-slate-50/50 space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <p>
                  Open your browser (Google Chrome, Microsoft Edge, or Firefox) and try visiting:
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded border border-slate-200 text-xs">
                    https://www.google.com
                  </span>
                  <span className="text-slate-400">or</span>
                  <span className="font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded border border-slate-200 text-xs">
                    https://mnnit.ac.in
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  If an authentication prompt appears, enter your MNNIT student proxy username and password. If pages load successfully, your connection is fully active!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STEP 5 */}
        <div className="transition-colors">
          <button
            type="button"
            onClick={() => toggleStep(5)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <h3 className="text-[13px] sm:text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors flex items-center gap-2 flex-wrap">
                  <span>Step 5: Pre-requisites If Internet Still Does Not Work</span>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-normal">
                    Ticket Details
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Essential diagnostic findings to include in your complaint form for rapid technician dispatch.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
              <span className="text-xs hidden md:inline-block font-medium">
                {openSteps[5] ? 'Hide' : 'View'}
              </span>
              {openSteps[5] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSteps[5] && (
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 bg-slate-50/50 space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">
                  Please ensure you have these details ready to enter in the complaint form below:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>1. Core Switch Ping:</strong> Did <code className="bg-white px-1 font-mono">172.31.100.1</code> reply or time out?
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>2. Proxy Configured:</strong> Which IP was set (<code className="bg-white px-1 font-mono">.29</code>, <code className="bg-white px-1 font-mono">.27</code>, etc.)?
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>3. Specific Symptoms:</strong> Exact error message shown in browser (e.g. Proxy Error, DNS Probe Finished, No Internet).
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>4. Screenshots:</strong> Keep screenshots of Command Prompt and LAN settings handy for the technician.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Acknowledgment Box inside or right under the guide */}
      {onAcknowledgeChange && (
        <div className={`p-4 border-t transition-colors ${
          acknowledged 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : error 
              ? 'bg-red-50/80 border-red-200' 
              : 'bg-blue-50/50 border-blue-100'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!acknowledged}
              onChange={(e) => onAcknowledgeChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
            />
            <div>
              <span className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                <span>I have completed these troubleshooting steps</span>
                <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                I confirm that I have reviewed the Computer Centre steps above (verified static IP, checked core switch ping <code className="bg-slate-200/80 px-1 py-0.2 rounded font-mono text-[10px]">172.31.100.1</code>, and verified proxy settings), but the issue remains unresolved.
              </p>
            </div>
          </label>
          {error && (
            <p className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1.5 ml-7">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
