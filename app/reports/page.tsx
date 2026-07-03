'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import Link from 'next/link';
import { getLinkedRecordCount, getLinkedRecordGroups } from '@/lib/record-links';

export default function ReportsPage() {
  const { selectedProject, records } = useApp();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [exportOpen, setExportOpen] = useState(false);

  if (!selectedProject) {
    return (
      <PageLayout title="Reports & Decision Trail">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const projectRecords = records.filter((r) => r.projectId === selectedProject.id);

  // Statistics
  const stats = {
    total: projectRecords.length,
    open: projectRecords.filter((r) => r.status === 'Open').length,
    closed: projectRecords.filter((r) => r.status === 'Closed').length,
    pending: projectRecords.filter((r) => r.status === 'Pending Response').length,
    critical: projectRecords.filter((r) => r.priority === 'Critical').length,
    programmeImpacts: projectRecords.filter((r) => r.hasProgrammeImpact).length,
    costImpacts: projectRecords.filter((r) => r.hasCostImpact).length,
    claimRisks: projectRecords.filter((r) => r.hasClaimRisk).length,
  };

  // Decision trail
  const decisionTrail = projectRecords
    .filter((r) => r.status === 'Closed' || (getLinkedRecordCount(r) > 0 && r.status !== 'Draft'))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <PageLayout title="Reports & Decision Trail">
      <div className="p-6 space-y-6 overflow-auto">
        {/* Report Actions */}
        <div className="flex gap-3">
          <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {exportOpen && (
          <div className="bg-card border border-primary/30 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-3">Export Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-background border border-border p-3"><p className="text-muted-foreground text-xs">Project</p><p className="font-semibold text-foreground">{selectedProject.name}</p></div>
              <div className="rounded-lg bg-background border border-border p-3"><p className="text-muted-foreground text-xs">Period</p><p className="font-semibold text-foreground">Last {dateRange}</p></div>
              <div className="rounded-lg bg-background border border-border p-3"><p className="text-muted-foreground text-xs">Records Included</p><p className="font-semibold text-foreground">{projectRecords.length}</p></div>
              <div className="rounded-lg bg-background border border-border p-3"><p className="text-muted-foreground text-xs">Output</p><p className="font-semibold text-foreground">Mock PDF package</p></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Prototype export generated. In production this would create the decision trail report with linked records, action history, impact summaries, and responsibility trail.</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Total Records</p>
            <p className="text-3xl font-bold text-slate-950">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Open</p>
            <p className="text-3xl font-bold text-sky-800">{stats.open}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Closed</p>
            <p className="text-3xl font-bold text-emerald-800">{stats.closed}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-bold text-orange-800">{stats.pending}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Critical Priority</p>
            <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Programme Impact</p>
            <p className="text-3xl font-bold text-indigo-800">{stats.programmeImpacts}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Cost Impact</p>
            <p className="text-3xl font-bold text-emerald-800">{stats.costImpacts}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Claim Risk</p>
            <p className="text-3xl font-bold text-red-600">{stats.claimRisks}</p>
          </div>
        </div>

        {/* Decision Trail */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Decision Trail - Key Records
            </h3>
          </div>

          {decisionTrail.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No decision trail records yet</div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {decisionTrail.map((record, index) => {
                const groups = getLinkedRecordGroups(record, records);
                return (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="p-4 hover:bg-secondary/50 transition-colors flex gap-4 items-start"
                >
                  <div className="text-xs font-mono text-muted-foreground pt-1">{String(index + 1).padStart(3, '0')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-xs text-muted-foreground">{record.reference}</p>
                      <p className="text-sm font-medium text-foreground truncate">{record.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{record.description}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={record.status} />
                      <span className="text-xs bg-slate-50 text-slate-800 border border-slate-200 px-2 py-1 rounded">
                        Links: {getLinkedRecordCount(record)}
                      </span>
                      {groups.slice(0, 3).map((group) => (
                        <span key={group.key} className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-1 rounded">
                          {group.label}: {group.records.length}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Updated: {record.updatedAt.toLocaleDateString()} - Created: {record.createdBy}
                    </p>
                  </div>
                </Link>
              )})}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
