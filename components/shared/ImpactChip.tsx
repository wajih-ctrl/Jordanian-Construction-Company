import { IMPACT_COLORS } from '@/lib/constants';
import { AlertCircle, TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface ImpactChipProps {
  type?: 'Programme' | 'Cost' | 'Claim' | 'Quality' | 'Safety';
  level?: 'Low' | 'Medium' | 'High' | 'Critical';
  label?: string;
}

export function ImpactChip({ type, level, label }: ImpactChipProps) {
  const chipLabel = label || type || level || 'Impact';
  const levelColors = {
    Low: 'bg-slate-500',
    Medium: 'bg-blue-500',
    High: 'bg-orange-500',
    Critical: 'bg-red-600',
  };
  const modernColors: Record<string, string> = {
    Programme: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Cost: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Claim: 'bg-rose-50 text-rose-700 border-rose-200',
    Quality: 'bg-amber-50 text-amber-800 border-amber-200',
    Safety: 'bg-red-50 text-red-700 border-red-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200',
    High: 'bg-orange-50 text-orange-800 border-orange-200',
    Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const bgColor = modernColors[chipLabel] || (type ? IMPACT_COLORS[type] : level ? levelColors[level] : 'bg-gray-500');
  const icons = {
    Programme: <TrendingUp className="w-3 h-3" />,
    Cost: <Target className="w-3 h-3" />,
    Claim: <AlertTriangle className="w-3 h-3" />,
    Quality: <AlertCircle className="w-3 h-3" />,
    Safety: <AlertTriangle className="w-3 h-3" />,
    Low: <AlertCircle className="w-3 h-3" />,
    Medium: <AlertCircle className="w-3 h-3" />,
    High: <AlertTriangle className="w-3 h-3" />,
    Critical: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <div className={`${bgColor} border text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap`}>
      {icons[(type || level || 'Medium') as keyof typeof icons]}
      <span>{chipLabel}</span>
    </div>
  );
}
