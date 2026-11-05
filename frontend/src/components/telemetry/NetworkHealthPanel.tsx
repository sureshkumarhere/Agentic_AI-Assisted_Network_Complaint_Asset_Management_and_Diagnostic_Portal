import React, { useState } from 'react';
import {
  Activity,
  Wifi,
  Server,
  Terminal,
  Download,
  Bot,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface NetworkHealthPanelProps {
  onOpenChat: () => void;
}

export const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ onOpenChat }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const hostelStatuses = [
    { name: 'SVBH Hostel', subnet: '172.31.16.0/20', status: 'OPERATIONAL', latency: '3ms' },
    { name: 'Tandon Hostel', subnet: '172.31.32.0/20', status: 'OPERATIONAL', latency: '4ms' },
    { name: 'Malviya Hostel', subnet: '172.31.48.0/20', status: 'OPERATIONAL', latency: '5ms' },
    { name: 'Tilak Hostel', subnet: '172.31.64.0/20', status: 'OPERATIONAL', latency: '4ms' },
    { name: 'Raman Hostel', subnet: '172.31.80.0/20', status: 'OPERATIONAL', latency: '6ms' },
    { name: 'KNGH Girls Hostel', subnet: '172.31.96.0/20', status: 'OPERATIONAL', latency: '3ms' },
    { name: 'Academic Complex', subnet: '172.31.112.0/20', status: 'OPERATIONAL', latency: '2ms' },
    { name: 'Computer Centre Core', subnet: '172.31.128.0/20', status: 'OPERATIONAL', latency: '1ms' },
  ];

  const handleDownloadScript = async (os: 'windows' | 'linux') => {
    setDownloading(os);
    try {
      const endpoint = os === 'windows' ? '/api/network/config/windows' : '/api/network/config/linux';
      const link = document.createElement('a');
      link.href = endpoint;
      link.setAttribute('download', os === 'windows' ? 'configure_mnnit_network.ps1' : 'configure_mnnit_network.sh');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert(`Download failed for ${os} configuration script.`);
    } finally {
      setTimeout(() => setDownloading(null), 1200);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Live Telemetry Summary Card */}
      <div className="bg-noc-panel border border-noc-border rounded-xl p-5 shadow-noc">
        <div className="flex items-center justify-between pb-3.5 border-b border-noc-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-noc-emerald" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
              CAMPUS NETWORK TELEMETRY
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-noc-emerald bg-noc-emerald/10 border border-noc-emerald/20 px-2.5 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-noc-emerald radar-live" />
            ALL SYSTEMS NORMAL
          </span>
        </div>

        {/* 3 Metrics in Row */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="bg-noc-bg p-3 rounded-lg border border-noc-border text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Gateway Ping</div>
            <div className="text-lg font-bold font-mono text-white mt-1">3.8 ms</div>
            <div className="text-[10px] text-noc-emerald font-mono">0% Loss</div>
          </div>
          <div className="bg-noc-bg p-3 rounded-lg border border-noc-border text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">DNS Health</div>
            <div className="text-lg font-bold font-mono text-white mt-1">100%</div>
            <div className="text-[10px] text-noc-emerald font-mono">172.31.100.14</div>
          </div>
          <div className="bg-noc-bg p-3 rounded-lg border border-noc-border text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Proxy Status</div>
            <div className="text-lg font-bold font-mono text-white mt-1">UP</div>
            <div className="text-[10px] text-noc-cyan font-mono">Port 3128</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive AI Assistant Banner */}
      <div className="bg-gradient-to-r from-noc-surface via-noc-panel to-noc-surface border border-noc-highlight/30 rounded-xl p-5 shadow-noc relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-noc-highlight/10 rounded-full blur-2xl group-hover:bg-noc-highlight/20 transition-all pointer-events-none" />
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="p-3 bg-noc-highlight/20 text-noc-accent border border-noc-highlight/30 rounded-xl shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                CAMPUS AI DIAGNOSIS ASSISTANT
              </h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-noc-cyan/10 text-noc-cyan border border-noc-cyan/30">
                MODULE 2 ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Describe your network fault in natural language or Hinglish. The AI diagnoses symptoms, recommends immediate fixes, or pre-fills the complaint dispatch form automatically.
            </p>
            <button
              type="button"
              onClick={onOpenChat}
              className="mt-3.5 px-4 py-2 bg-noc-highlight hover:bg-blue-600 text-white text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-noc-glow"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>LAUNCH AI DIAGNOSIS TERMINAL</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Hostel Subnet & Switch Matrix */}
      <div className="bg-noc-panel border border-noc-border rounded-xl p-5 shadow-noc">
        <div className="flex items-center justify-between pb-3 border-b border-noc-border">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-noc-accent" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
              HOSTEL CORE SWITCH MATRIX
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">8/8 NODES ACTIVE</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3.5">
          {hostelStatuses.map((node) => (
            <div
              key={node.name}
              className="p-2.5 bg-noc-bg rounded-lg border border-noc-border/80 flex items-center justify-between hover:border-noc-border-light transition-colors"
            >
              <div>
                <div className="text-xs font-semibold text-slate-200">{node.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{node.subnet}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-noc-emerald" />
                <span className="text-[10px] font-mono font-bold text-slate-400">{node.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Automated Network Scripts Download Card */}
      <div className="bg-noc-panel border border-noc-border rounded-xl p-5 shadow-noc">
        <div className="flex items-center gap-2 pb-3 border-b border-noc-border">
          <Terminal className="w-4 h-4 text-noc-gold" />
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            1-CLICK NETWORK CONFIGURATION UTILITIES
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
          Download pre-configured scripts that automatically setup institute DNS, Gateway, and proxy routes on your device without manual IP configuration.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-3.5">
          <button
            type="button"
            onClick={() => handleDownloadScript('windows')}
            disabled={downloading === 'windows'}
            className="p-2.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white">Windows PowerShell</div>
              <div className="text-[10px] text-slate-400 font-mono">.ps1 script</div>
            </div>
            <Download className="w-4 h-4 text-noc-accent group-hover:scale-110 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleDownloadScript('linux')}
            disabled={downloading === 'linux'}
            className="p-2.5 bg-noc-surface hover:bg-noc-card-hover border border-noc-border rounded-lg text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white">Linux / macOS Shell</div>
              <div className="text-[10px] text-slate-400 font-mono">.sh script</div>
            </div>
            <Download className="w-4 h-4 text-noc-accent group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
