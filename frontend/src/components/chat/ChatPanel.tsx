import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useResizablePanel } from '../../hooks/useResizablePanel';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ResizeHandle } from './ResizeHandle';
import {
  X,
  Minus,
  Sparkles,
  RotateCcw,
  Bot,
  AlertCircle,
  Settings2,
  Download,
  Terminal,
  Activity
} from 'lucide-react';
import { ProblemType } from '../../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoFillForm: (data: {
    problem_type: ProblemType;
    additional_comment: string;
  }) => void;
  hasAutoFilled: boolean;
}

type OperatingSystem = 'linux' | 'windows';

const SUGGESTION_CHIPS = [
  'Wi-Fi keeps dropping in hostel room',
  'Cannot obtain DHCP IPv4 address',
  'MNNIT proxy 172.31.100.27 not reachable',
  'Physical LAN RJ45 port loose / broken',
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  onAutoFillForm,
  hasAutoFilled,
}) => {
  const {
    messages,
    messageCount,
    detectedCategory,
    isLoading,
    limitReached,
    sendMessage,
    getSummary,
    startNewChat,
  } = useChat();

  const {
    width,
    isResizing,
    startResizing,
    resetWidth,
  } = useResizablePanel();

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showNetworkConfig, setShowNetworkConfig] = useState(false);
  const [isDownloadingConfig, setIsDownloadingConfig] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OperatingSystem>('linux');

  if (!isOpen) return null;

  const userMessagesCount = messages.filter(
    (message) => message.role === 'user'
  ).length;

  const handleDownloadNetworkConfig = async () => {
    try {
      setIsDownloadingConfig(true);

      const response = await fetch(
        `/api/network-config/download?os_name=${selectedOS}`
      );

      if (!response.ok) {
        let detail = `Download failed (${response.status})`;
        try {
          const body = await response.json();
          if (body.detail) detail = body.detail;
        } catch {
          // Keep default
        }
        throw new Error(detail);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download =
        selectedOS === 'windows'
          ? 'configure_hostel_network.ps1'
          : 'configure_hostel_network.py';

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown download error';
      alert(`Could not download configuration script: ${message}`);
    } finally {
      setIsDownloadingConfig(false);
    }
  };

  const handleStartNewChat = () => {
    if (userMessagesCount > 0) {
      const confirmed = window.confirm('Reset diagnostic session? Active telemetry trace will be cleared.');
      if (!confirmed) return;
    }
    startNewChat();
  };

  const handleLogRequestWithAI = async () => {
    try {
      setIsSummarizing(true);
      const summary = await getSummary();
      onAutoFillForm(summary);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to generate AI diagnostic summary'
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div
      style={{ width: `${width}px` }}
      className="fixed top-0 right-0 h-full bg-noc-bg/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-noc-border transition-none w-full md:max-w-[80vw] min-w-[320px]"
    >
      {/* Resizable handle for desktop */}
      <ResizeHandle
        onMouseDown={startResizing}
        onDoubleClick={resetWidth}
        isResizing={isResizing}
      />

      {/* NOC Header */}
      <div className="bg-noc-panel border-b border-noc-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-noc-surface border border-noc-border flex items-center justify-center">
            <Terminal className="w-4 h-4 text-noc-cyan" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-xs font-semibold text-slate-100 tracking-wider">
                NOC // AI DIAGNOSER
              </h2>
              <span className="w-2 h-2 rounded-full bg-noc-emerald radar-live" />
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              TRACE_LOAD: {messageCount}/10 MSG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleStartNewChat}
            className="px-2 py-1 bg-noc-surface hover:bg-noc-border rounded text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 border border-noc-border transition-colors"
            title="Reset telemetry trace"
          >
            <RotateCcw className="w-3 h-3 text-noc-cyan" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-noc-surface rounded text-slate-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-noc-surface rounded text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advisory strip */}
      <div className="bg-noc-surface/80 border-b border-noc-border px-3.5 py-1.5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-noc-cyan shrink-0" />
        <span>Traces routed through MNNIT automated triage system.</span>
      </div>

      {/* Suggested queries & Quick script download */}
      {messages.length <= 1 && (
        <div className="p-3 bg-noc-panel/60 border-b border-noc-border">
          <p className="text-[11px] font-mono text-slate-400 mb-2">
            PRE-FILTER TEMPLATES:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {SUGGESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                className="text-[11px] font-mono bg-noc-surface hover:border-noc-accent text-slate-300 hover:text-slate-100 px-2.5 py-1 rounded border border-noc-border transition-colors text-left"
              >
                {chip}
              </button>
            ))}

            <button
              onClick={() => setShowNetworkConfig(!showNetworkConfig)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-noc-accent/20 hover:bg-noc-accent/30 text-noc-cyan px-2.5 py-1 rounded border border-noc-accent/40 transition-colors"
              aria-expanded={showNetworkConfig}
            >
              <Settings2 className="w-3.5 h-3.5" />
              Configure Proxy / IP Script
            </button>
          </div>

          {showNetworkConfig && (
            <div className="mt-3 p-3 border border-noc-border rounded-lg bg-noc-bg space-y-2.5">
              <p className="text-xs font-mono font-semibold text-slate-200">
                HOSTEL NETWORK RECONFIGURATION UTILITY
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOS('windows')}
                  className={`rounded border px-2.5 py-1.5 text-xs font-mono transition-colors ${
                    selectedOS === 'windows'
                      ? 'border-noc-accent bg-noc-accent/20 text-noc-cyan'
                      : 'border-noc-border bg-noc-panel text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Windows (.ps1)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOS('linux')}
                  className={`rounded border px-2.5 py-1.5 text-xs font-mono transition-colors ${
                    selectedOS === 'linux'
                      ? 'border-noc-accent bg-noc-accent/20 text-noc-cyan'
                      : 'border-noc-border bg-noc-panel text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Linux / Ubuntu (.py)
                </button>
              </div>

              <button
                onClick={handleDownloadNetworkConfig}
                disabled={isDownloadingConfig}
                className="w-full py-1.5 px-3 bg-noc-accent hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-mono font-semibold rounded flex items-center justify-center gap-2 shadow-noc-glow"
              >
                <Download className="w-3.5 h-3.5" />
                {isDownloadingConfig
                  ? 'FETCHING BUNDLE...'
                  : selectedOS === 'windows'
                    ? 'DOWNLOAD WINDOWS SCRIPT'
                    : 'DOWNLOAD LINUX SCRIPT'}
              </button>

              <code className="block text-[11px] font-mono bg-noc-panel border border-noc-border text-noc-emerald rounded p-2 break-all whitespace-pre-wrap">
                {selectedOS === 'windows'
                  ? 'powershell -ExecutionPolicy Bypass -File .\\configure_hostel_network.ps1'
                  : 'python3 ~/Downloads/configure_hostel_network.py'}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Message List */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        detectedCategory={detectedCategory}
      />

      {/* Limit Reached Banner */}
      {limitReached && (
        <div className="bg-noc-amber/10 border-y border-noc-amber/30 p-3 text-xs font-mono text-noc-amber flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Diagnostic session reached 10 traces. Auto-populate complaint ticket or reset session.
            </span>
          </div>

          <button
            onClick={handleStartNewChat}
            className="self-start text-[11px] font-mono bg-noc-amber hover:bg-amber-600 text-slate-900 font-bold px-3 py-1 rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>START NEW SESSION</span>
          </button>
        </div>
      )}

      {/* Action area & "Log request using AI" button */}
      <div className="shrink-0 bg-noc-panel border-t border-noc-border p-2.5 space-y-2">
        {userMessagesCount >= 1 && (
          <button
            onClick={handleLogRequestWithAI}
            disabled={isSummarizing}
            className="w-full py-2 px-3 bg-gradient-to-r from-noc-accent to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-mono font-medium text-xs rounded-lg shadow-noc-glow flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-noc-cyan" />
            <span>
              {isSummarizing
                ? 'COMPILING DIAGNOSTIC SUMMARY...'
                : hasAutoFilled
                  ? 'RE-POPULATE TICKET FROM TRACE'
                  : 'AUTO-POPULATE TICKET WITH AI'}
            </span>
          </button>
        )}

        <MessageInput
          onSend={sendMessage}
          disabled={limitReached || isLoading}
        />
      </div>
    </div>
  );
};
