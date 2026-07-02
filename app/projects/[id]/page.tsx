'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DISCIPLINES, RECORD_CATEGORIES } from '@/lib/constants';
import { Calendar, MapPin, Users, AlertCircle, TrendingDown, DollarSign, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { projects, records, actions, loading } = useApp();
  const normalizedProjectId = (projectId || '').toString().toLowerCase();
  const project = projects.find((p) => {
    const normalizedId = p.id.toLowerCase();
    const numericId = normalizedId.replace(/^p/, '');
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return normalizedProjectId === normalizedId || normalizedProjectId === numericId || normalizedProjectId === slug;
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'actions' | 'programme' | 'cost' | 'reports' | 'settings'>('overview');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (loading || !projectId) {
    return (
      <PageLayout title="Project Detail">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading project...</div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Project Not Found">
        <div className="p-6">
          <p className="text-muted-foreground">Project not found.</p>
        </div>
      </PageLayout>
    );
  }

  const projectRecords = records.filter((r) => r.projectId === project.id);
  const projectActions = actions.filter((a) => a.projectId === project.id);
  const programmeImpacts = projectRecords.filter((r) => r.hasProgrammeImpact);
  const costImpacts = projectRecords.filter((r) => r.hasCostImpact);
  const claimRisks = projectRecords.filter((r) => r.hasClaimRisk);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'records', label: `Records (${projectRecords.length})` },
    { id: 'actions', label: `Actions (${projectActions.length})` },
    { id: 'programme', label: `Programme (${programmeImpacts.length})` },
    { id: 'cost', label: `Cost Impact (${costImpacts.length})` },
    { id: 'reports', label: 'Reports & Trail' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <PageLayout title={project.name}>
      <div className="min-w-0 p-4 sm:p-6 space-y-6 overflow-x-hidden">
        {/* Project Hero Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              <p className="text-muted-foreground font-semibold">{project.client}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4 border-t border-primary/20">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Contract Type</p>
              <p className="text-sm font-bold text-foreground">{project.contractType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </p>
              <p className="text-sm font-bold text-foreground">{project.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Duration
              </p>
              <p className="text-sm font-bold text-foreground">
                {Math.round((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Ends</p>
              <p className="text-sm font-bold text-foreground">{project.endDate.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Records</p>
              <p className="text-2xl font-bold text-slate-950 mt-1">{projectRecords.length}</p>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Open</p>
              <p className="text-2xl font-bold text-amber-800 mt-1">{projectActions.filter((a) => a.status === 'Open').length}</p>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-bold text-red-800 mt-1">{projectActions.filter((a) => a.status === 'Overdue').length}</p>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Claim Risk</p>
              <p className="text-2xl font-bold text-orange-800 mt-1">{claimRisks.length}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Programme</p>
              <p className="text-2xl font-bold text-indigo-800 mt-1">{programmeImpacts.length}</p>
            </div>
          </div>
        </div>

        {/* Stakeholders */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-transparent flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Project Stakeholders</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {project.stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="bg-background border border-border/50 rounded-lg p-4 hover:border-primary/50 animation-subtle">
                <p className="font-semibold text-foreground text-sm">{stakeholder.name}</p>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">{stakeholder.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs - Premium */}
        <div className="border-b border-border/50 bg-card/50 rounded-xl overflow-hidden shadow-md">
          <div className="flex gap-1 overflow-x-auto p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg font-semibold transition-all animation-subtle ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-foreground border border-primary/50 shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Correspondence */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-500/5 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">Recent Correspondence</h3>
                </div>
                <div className="p-4 space-y-3">
                  {projectRecords.slice(0, 5).map((record) => (
                    <Link
                      key={record.id}
                      href={`/records/${record.id}`}
                      className="block p-3 bg-background border border-border/50 rounded-lg hover:border-primary/50 animation-subtle border-l-2 border-l-transparent hover:border-l-blue-500"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{record.reference}</p>
                        <StatusBadge status={record.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{record.title}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Programme Impacts */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-purple-500/5 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">Programme Impacts</h3>
                </div>
                <div className="p-4 space-y-3">
                  {programmeImpacts.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 bg-background border border-border/50 rounded-lg border-l-2 border-l-purple-500">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{record.reference}</p>
                        <ImpactChip level="High" />
                      </div>
                      <p className="text-xs text-muted-foreground">{record.programmeImpactDesc || 'Programme impact identified'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Impacts */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-green-500/5 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">Cost Impacts</h3>
                </div>
                <div className="p-4 space-y-3">
                  {costImpacts.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 bg-background border border-border/50 rounded-lg border-l-2 border-l-green-500">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{record.reference}</p>
                        <span className="text-xs font-semibold text-green-500 bg-green-500/20 px-2 py-1 rounded">
                          {record.estimatedAmount ? `JOD ${record.estimatedAmount.toLocaleString()}` : 'TBD'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{record.costImpactDesc || 'Cost impact identified'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Risks */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-red-500/5 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">Claim Risks</h3>
                </div>
                <div className="p-4 space-y-3">
                  {claimRisks.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 bg-background border border-border/50 rounded-lg border-l-2 border-l-red-500">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{record.reference}</p>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            record.claimRiskLevel === 'Critical'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : record.claimRiskLevel === 'High'
                                ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {record.claimRiskLevel || 'Medium'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{record.claimRiskNotes || 'Claim risk identified'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md lg:col-span-2">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-slate-500/5 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">Linked Records Timeline</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-7 gap-3">
                  {[
                    'Site issue raised',
                    'Engineer instruction',
                    'Programme impact',
                    'Cost impact',
                    'Approval pending',
                    'Response overdue',
                    'Action closed',
                  ].map((step, index) => (
                    <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-500">Step {index + 1}</p>
                      <p className="mt-1 text-sm font-bold text-slate-950">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-transparent">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Ref</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Discipline</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {projectRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-secondary/50 animation-subtle border-l-2 border-l-transparent hover:border-l-primary">
                        <td className="px-4 py-3 font-semibold text-foreground">{record.reference}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{record.title}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{record.mainCategory}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{record.discipline}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/records/${record.id}`}
                            className="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-wider flex items-center gap-1 animation-subtle"
                          >
                            View <ArrowRight className="w-3 h-3 animation-subtle group-hover:translate-x-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Responsible</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {projectActions.map((action) => (
                      <tr key={action.id} className="hover:bg-secondary/50 animation-subtle border-l-2 border-l-transparent hover:border-l-primary">
                        <td className="px-4 py-3 font-semibold text-foreground">{action.title}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={action.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{action.dueDate.toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-semibold">{action.responsiblePerson}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              action.priority === 'Critical'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : action.priority === 'High'
                                  ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {action.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Programme Tab */}
          {activeTab === 'programme' && (
            <div className="space-y-3">
              {programmeImpacts.length > 0 ? (
                programmeImpacts.map((record) => (
                  <div key={record.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{record.reference} - {record.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{record.programmeImpactDesc}</p>
                      </div>
                      <ImpactChip level={record.claimRiskLevel || 'Medium'} />
                    </div>
                    <Link
                      href={`/records/${record.id}`}
                      className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No programme impacts identified.</p>
                </div>
              )}
            </div>
          )}

          {/* Cost Tab */}
          {activeTab === 'cost' && (
            <div className="space-y-3">
              {costImpacts.length > 0 ? (
                costImpacts.map((record) => (
                  <div key={record.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{record.reference} - {record.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {record.costImpactDesc} {record.estimatedAmount && `- Estimated: JOD ${record.estimatedAmount.toLocaleString()}`}
                        </p>
                      </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {record.estimatedAmount ? `JOD ${record.estimatedAmount}` : 'TBD'}
                      </span>
                    </div>
                    <Link
                      href={`/records/${record.id}`}
                      className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No cost impacts identified.</p>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Decision Trail Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Records:</span>
                      <span className="font-semibold text-foreground">{projectRecords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open Records:</span>
                      <span className="font-semibold text-amber-800">{projectRecords.filter((r) => r.status === 'Open').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Closed Records:</span>
                      <span className="font-semibold text-emerald-800">{projectRecords.filter((r) => r.status === 'Closed').length}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">Programme Impacts:</span>
                      <span className="font-semibold text-indigo-800">{programmeImpacts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Impacts:</span>
                      <span className="font-semibold text-emerald-800">{costImpacts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Risks:</span>
                      <span className="font-semibold text-red-800">{claimRisks.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">Actions Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Actions:</span>
                      <span className="font-semibold text-foreground">{projectActions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open:</span>
                      <span className="font-semibold text-amber-800">{projectActions.filter((a) => a.status === 'Open').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overdue:</span>
                      <span className="font-semibold text-red-800">{projectActions.filter((a) => a.status === 'Overdue').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Closed:</span>
                      <span className="font-semibold text-emerald-800">{projectActions.filter((a) => a.status === 'Closed').length}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setReportGenerated((value) => !value)}
                        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/90 transition-colors text-sm"
                      >
                        Generate Full Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {reportGenerated && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-bold">Project decision trail report generated</p>
                  <p className="mt-1">
                    Includes {projectRecords.length} records, {projectActions.length} actions, {programmeImpacts.length} programme impacts,
                    {` ${costImpacts.length}`} cost impacts, and {claimRisks.length} claim-risk notes for review.
                  </p>
                </div>
              )}

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-4">Recent Decision Points</h4>
                <div className="space-y-3">
                  {projectRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{record.reference}: {record.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{record.dateReceived?.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-4">Project Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Project Status</label>
                    <select className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm">
                      <option>{project.status}</option>
                      <option>Active</option>
                      <option>On Hold</option>
                      <option>Completed</option>
                      <option>Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Enabled Categories</label>
                    <div className="space-y-2">
                      {RECORD_CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Enabled Disciplines</label>
                    <div className="space-y-2">
                      {DISCIPLINES.map((disc) => (
                        <label key={disc} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{disc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsSaved(true)}
                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>

                  {settingsSaved && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
                      Mock project settings saved for this prototype session.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
