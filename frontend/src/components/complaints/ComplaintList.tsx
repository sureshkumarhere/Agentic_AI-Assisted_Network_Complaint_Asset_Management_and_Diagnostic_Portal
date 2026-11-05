import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Calendar, User, MapPin, ChevronRight, Activity, AlertCircle } from 'lucide-react';

interface ComplaintListProps {
  complaints: any[];
  onSelect: (ticketId: string) => void;
  showTechnician?: boolean;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  onSelect,
  showTechnician = true
}) => {
  if (complaints.length === 0) {
    return (
      <div className="bg-noc-panel rounded-xl p-12 text-center border border-noc-border shadow-noc my-4">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-mono text-slate-400">NO ACTIVE INCIDENTS MATCHING SEARCH CRITERIA</p>
      </div>
    );
  }

  return (
    <div className="bg-noc-panel rounded-xl border border-noc-border shadow-noc overflow-hidden my-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="bg-noc-surface border-b border-noc-border text-slate-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
              <th className="p-3.5">Ticket ID</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Student Name</th>
              <th className="p-3.5">Problem Type</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Impact</th>
              <th className="p-3.5">Lifecycle Status</th>
              {showTechnician && <th className="p-3.5">Assigned Tech</th>}
              <th className="p-3.5">Logged At</th>
              <th className="p-3.5 text-right">Dispatch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-noc-border/60">
            {complaints.map((c) => {
              const priority = c.priority || 'MEDIUM';
              const pClass =
                priority === 'CRITICAL'
                  ? 'bg-noc-rose/15 text-noc-rose border-noc-rose/30'
                  : priority === 'HIGH'
                  ? 'bg-noc-amber/15 text-noc-amber border-noc-amber/30'
                  : priority === 'MEDIUM'
                  ? 'bg-noc-highlight/15 text-noc-accent border-noc-highlight/30'
                  : 'bg-noc-emerald/15 text-noc-emerald border-noc-emerald/30';

              return (
                <tr
                  key={c.ticket_id}
                  onClick={() => onSelect(c.ticket_id)}
                  className="hover:bg-noc-surface/80 cursor-pointer transition-colors group"
                >
                  <td className="p-3.5 font-mono font-bold text-noc-accent">#{c.ticket_id}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${pClass}`}
                    >
                      {priority}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300 font-mono text-[11px]">
                    {c.problem_type.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>
                        {c.location} ({c.address_room})
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="bg-noc-bg text-slate-300 px-2 py-0.5 rounded border border-noc-border">
                      {c.affected_users_count || 1} user(s)
                    </span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={c.status} />
                  </td>
                  {showTechnician && (
                    <td className="p-3.5 font-medium text-slate-300">
                      {c.assigned_technician_name ? (
                        <span className="text-white font-semibold">{c.assigned_technician_name}</span>
                      ) : (
                        <span className="text-slate-500 italic font-mono text-[11px]">UNASSIGNED</span>
                      )}
                    </td>
                  )}
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>
                        {new Date(c.created_at).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-noc-accent group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
