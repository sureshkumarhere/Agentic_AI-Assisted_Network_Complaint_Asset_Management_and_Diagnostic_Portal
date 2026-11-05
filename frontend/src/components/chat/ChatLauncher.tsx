import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface ChatLauncherProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Open AI Network Diagnoser"
      className="fixed bottom-6 right-6 bg-noc-panel/95 backdrop-blur-md hover:bg-noc-card-hover text-white px-4 py-3 rounded-full border border-noc-highlight shadow-noc-glow flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 z-40 focus:outline-none cursor-pointer group"
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-noc-cyan group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-noc-emerald radar-live" />
      </div>
      <div className="text-left font-mono">
        <span className="text-xs font-bold text-white tracking-wide block">CAMPUS AI DIAGNOSER</span>
        <span className="text-[10px] text-slate-400 block -mt-0.5">Instant Network Triage</span>
      </div>
    </button>
  );
};
