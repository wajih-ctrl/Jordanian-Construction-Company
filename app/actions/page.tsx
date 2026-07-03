'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import { CheckCircle, Clock, AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ActionsPage() {
  const { selectedProject, actions } = useApp();
  const [view, setView] = useState<'table' | 'kanban'>('table');

  if (!selectedProject) {
    return (
      <PageLayout title="Required Actions">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const projectActions = actions.filter((a) => a.projectId === selectedProject.id);
  const getDueIndicator = (action: typeof projectActions[number]) => {
    if (action.status === 'Closed') return { label: 'Closed', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (action.status === 'Overdue' || action.status === 'Escalated') return { label: 'Overdue', className: 'bg-rose-50 text-rose-800 border-rose-200' };
    const days = Math.ceil((action.dueDate.getTime() - new Date('2026-07-03').getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: 'Past due', className: 'bg-rose-50 text-rose-800 border-rose-200' };
    if (days <= 2) return { label: 'Due soon', className: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: `Due in ${days}d`, className: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  // Kanban columns
  const kanbanColumns = [
    { status: 'Open', label: 'Open', color: 'bg-blue-500/20', icon: Zap },
    { status: 'Pending Review', label: 'Pending Review', color: 'bg-yellow-500/20', icon: Clock },
    { status: 'Waiting for Response', label: 'Waiting', color: 'bg-orange-500/20', icon: AlertCircle },
    { status: 'Overdue', label: 'Overdue', color: 'bg-red-500/20', icon: AlertTriangle },
    { status: 'Escalated', label: 'Escalated', color: 'bg-red-700/20', icon: AlertTriangle },
    { status: 'Closed', label: 'Closed', color: 'bg-green-500/20', icon: CheckCircle },
  ];

  const getActionsByStatus = (status: string) => {
    return projectActions.filter((a) => a.status === status);
  };

  return (
    <PageLayout title="Required Actions">
      <div className="p-6 space-y-6 overflow-auto">
        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'table' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'kanban' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Kanban View
          </button>
        </div>

        {/* Table View */}
        {view === 'table' && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {projectActions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No actions found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Responsible</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Impact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projectActions.map((action) => {
                      const due = getDueIndicator(action);
                      return (
                      <tr key={action.id} className={action.status === 'Closed' ? 'bg-slate-50/70 text-slate-500' : 'hover:bg-secondary/50 transition-colors'}>
                        <td className="px-4 py-3 text-sm text-foreground font-medium truncate max-w-xs">
                          {action.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{action.responsiblePerson}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={action.priority} type="priority" />
                        </td>
                        <td className="px-4 py-3">
                          <ImpactChip type={action.impactType as any} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {action.dueDate.toLocaleDateString()}
                          <span className={`ml-2 inline-flex rounded-full border px-2 py-0.5 font-bold ${due.className}`}>{due.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={action.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/records/${action.recordId}`}
                            className="text-xs text-primary hover:underline font-semibold"
                          >
                            View Record
                          </Link>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            {kanbanColumns.map((column) => {
              const columnActions = getActionsByStatus(column.status);
              const Icon = column.icon;

              return (
                <div key={column.status} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground text-sm">{column.label}</h3>
                    <span className="ml-auto text-xs bg-secondary px-2 py-1 rounded text-foreground font-medium">
                      {columnActions.length}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {columnActions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No items</p>
                    ) : (
                      columnActions.map((action) => {
                        const due = getDueIndicator(action);
                        return (
                        <Link
                          key={action.id}
                          href={`/records/${action.recordId}`}
                          className={`${column.color} border border-border rounded-lg p-3 hover:border-primary transition-colors block ${action.status === 'Closed' ? 'opacity-70' : ''}`}
                        >
                          <p className="text-xs font-semibold text-foreground mb-1 line-clamp-2">{action.title}</p>
                          <p className="text-xs text-muted-foreground mb-2">{action.responsiblePerson}</p>
                          <div className="flex items-center justify-between gap-1">
                            <ImpactChip type={action.impactType as any} />
                            <StatusBadge status={action.priority} type="priority" />
                          </div>
                          <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${due.className}`}>{due.label}</span>
                        </Link>
                      )})
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
