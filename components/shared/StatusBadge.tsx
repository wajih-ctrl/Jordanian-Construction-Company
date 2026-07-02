import { STATUS_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import type { RecordStatus, ActionStatus, RecordPriority } from '@/lib/types';

interface StatusBadgeProps {
  status: RecordStatus | ActionStatus | string;
  type?: 'status' | 'priority';
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const modernColors: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-700 border-slate-200',
    Open: 'bg-sky-50 text-sky-700 border-sky-200',
    'In Review': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Pending Response': 'bg-amber-50 text-amber-800 border-amber-200',
    'Pending Review': 'bg-amber-50 text-amber-800 border-amber-200',
    'Waiting for Response': 'bg-orange-50 text-orange-800 border-orange-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    Escalated: 'bg-red-50 text-red-700 border-red-200',
    Closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Archived: 'bg-slate-100 text-slate-600 border-slate-200',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'At Risk': 'bg-rose-50 text-rose-700 border-rose-200',
    Monitoring: 'bg-amber-50 text-amber-800 border-amber-200',
    Identified: 'bg-sky-50 text-sky-700 border-sky-200',
    'Under Review': 'bg-amber-50 text-amber-800 border-amber-200',
    Mitigating: 'bg-orange-50 text-orange-800 border-orange-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Claimed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Agreed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Disputed: 'bg-rose-50 text-rose-700 border-rose-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200',
    High: 'bg-orange-50 text-orange-800 border-orange-200',
    Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const colors = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
  const bgColor = modernColors[status] || colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`${bgColor} border text-xs font-bold px-2.5 py-1 rounded-full inline-block whitespace-nowrap`}>
      {status}
    </span>
  );
}
