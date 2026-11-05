import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'SUBMITTED':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'CLASSIFIED':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'ASSIGNED':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'DIAGNOSED':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'ACTION_TAKEN':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'STUDENT_CONFIRMATION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'CLOSED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'JUNK':
        return 'bg-slate-800 text-slate-500 border-slate-700 line-through';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold border tracking-wider uppercase ${getBadgeStyle(
        status
      )}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
