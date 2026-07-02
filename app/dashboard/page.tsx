'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Search,
  TrendingUp,
} from 'lucide-react';

function getDashboardMetrics(role: string, projectRecords: any[], projectActions: any[]) {
  const openActions = projectActions.filter((action) => action.status !== 'Closed');
  const overdueActions = projectActions.filter((action) => action.status === 'Overdue' || action.status === 'Escalated');
  const pendingApprovals = projectRecords.filter((record) => record.mainCategory === 'Approval' || record.status === 'In Review');
  const programmeCount = projectRecords.filter((record) => record.hasProgrammeImpact).length;
  const costClaimCount = projectRecords.filter((record) => record.hasCostImpact || record.hasClaimRisk).length;
  const recentRecords = projectRecords.filter((record) => {
    const diffDays = (new Date().getTime() - record.dateReceived.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;
  const linkableItems = projectRecords.filter((record) => ['Instruction', 'Approval', 'Variation', 'Claim'].includes(record.mainCategory)).length;
  const claimRiskCount = projectRecords.filter((record) => record.hasClaimRisk).length;
  const costImpactCount = projectRecords.filter((record) => record.hasCostImpact).length;
  const highRiskRecords = projectRecords.filter((record) => record.hasClaimRisk || record.priority === 'Critical' || record.priority === 'High');

  const baseMetrics = [
    { label: 'Total Records', value: projectRecords.length, helper: 'Logged correspondence and site records', icon: FileText, href: '/records', tone: 'text-sky-600 bg-sky-500/10 border-sky-500/20' },
    { label: 'Open Actions', value: openActions.length, helper: 'Owner follow-ups still active', icon: CheckCircle2, href: '/actions', tone: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Overdue / Escalated', value: overdueActions.length, helper: 'Responses needing attention', icon: AlertTriangle, href: '/actions', tone: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
    { label: 'Pending Approvals', value: pendingApprovals.length, helper: 'Engineer or client sign-off', icon: Clock3, href: '/search', tone: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
    { label: 'Programme Impact', value: programmeCount, helper: 'Potential time events', icon: TrendingUp, href: '/programme', tone: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Cost / Claim Risk', value: costClaimCount, helper: 'Commercial watch items', icon: DollarSign, href: '/cost-impact', tone: 'text-orange-600 bg-orange-500/10 border-orange-500/20' },
  ];

  switch (role) {
    case 'PM':
      return [
        baseMetrics[0],
        baseMetrics[1],
        baseMetrics[2],
        baseMetrics[3],
        baseMetrics[4],
        { label: 'Project Delay Items', value: programmeCount, helper: 'Schedule risk and programme impact', icon: TrendingUp, href: '/programme', tone: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
      ];
    case 'DC':
      return [
        baseMetrics[0],
        { label: 'Records in Last 7 Days', value: recentRecords, helper: 'Recent record entries', icon: FileText, href: '/records', tone: 'text-slate-600 bg-slate-500/10 border-slate-500/20' },
        baseMetrics[3],
        { label: 'Approval Queue', value: pendingApprovals.length, helper: 'Review and sign-off items', icon: Clock3, href: '/search', tone: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
        { label: 'Programme References', value: programmeCount, helper: 'Linked programme events', icon: TrendingUp, href: '/search', tone: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Claim Watch', value: costClaimCount, helper: 'Records with commercial risk', icon: DollarSign, href: '/search', tone: 'text-orange-600 bg-orange-500/10 border-orange-500/20' },
      ];
    case 'PT':
      return [
        { label: 'Programme Impact', value: programmeCount, helper: 'Potential time events', icon: TrendingUp, href: '/programme', tone: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Delay Watch', value: projectRecords.filter((record) => record.mainCategory === 'Delay').length, helper: 'Design or site delay events', icon: AlertCircle, href: '/timeline', tone: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
        baseMetrics[3],
        { label: 'Search Records', value: projectRecords.length, helper: 'Filter programme and delay items', icon: Search, href: '/search', tone: 'text-slate-600 bg-slate-500/10 border-slate-500/20' },
        { label: 'Timeline Items', value: projectRecords.length, helper: 'Linked schedule events', icon: Clock3, href: '/timeline', tone: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
        { label: 'High Risk Records', value: highRiskRecords.length, helper: 'Critical programme and claim items', icon: AlertTriangle, href: '/search', tone: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
      ];
    case 'CT':
      return [
        baseMetrics[5],
        { label: 'Claim Risk', value: claimRiskCount, helper: 'Contractual and commercial risks', icon: AlertCircle, href: '/cost-impact', tone: 'text-red-600 bg-red-500/10 border-red-500/20' },
        { label: 'Cost Items', value: costImpactCount, helper: 'Budget and variation exposure', icon: DollarSign, href: '/cost-impact', tone: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Search Records', value: projectRecords.length, helper: 'Review claimed and approved items', icon: Search, href: '/search', tone: 'text-slate-600 bg-slate-500/10 border-slate-500/20' },
        { label: 'Decision Trail', value: projectRecords.length, helper: 'Review reports and trends', icon: FolderOpen, href: '/reports', tone: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
        { label: 'Project Snapshot', value: projectRecords.length, helper: 'Summary of active records', icon: FileText, href: '/search', tone: 'text-sky-600 bg-sky-500/10 border-sky-500/20' },
      ];
    case 'CE':
      return [
        { label: 'Linkable Items', value: linkableItems, helper: 'Instructions, approvals, and variations', icon: LinkIcon, href: '/linking', tone: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20' },
        { label: 'Search Records', value: projectRecords.length, helper: 'Find approvals and instructions', icon: Search, href: '/search', tone: 'text-slate-600 bg-slate-500/10 border-slate-500/20' },
        { label: 'Pending Review', value: pendingApprovals.length, helper: 'Approval and instruction items', icon: Clock3, href: '/search', tone: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
        { label: 'Decision Trail', value: projectRecords.length, helper: 'Review linked record history', icon: FolderOpen, href: '/reports', tone: 'text-violet-600 bg-violet-500/10 border-violet-500/20' },
        { label: 'Record Search', value: projectRecords.length, helper: 'Browse instructions and approvals', icon: FileText, href: '/search', tone: 'text-sky-600 bg-sky-500/10 border-sky-500/20' },
        { label: 'Approval Queue', value: pendingApprovals.length, helper: 'Review confirmations and instructions', icon: Clock3, href: '/search', tone: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
      ];
    case 'ADMIN':
      return baseMetrics;
    default:
      return baseMetrics;
  }
}

export default function DashboardPage() {
  const { selectedProject, records, actions, currentUser } = useApp();

  if (!selectedProject || !currentUser) {
    return (
      <PageLayout title="Dashboard">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const projectRecords = records.filter((record) => record.projectId === selectedProject.id);
  const projectActions = actions.filter((action) => action.projectId === selectedProject.id);
  const openActions = projectActions.filter((action) => action.status !== 'Closed');
  const overdueActions = projectActions.filter((action) => action.status === 'Overdue' || action.status === 'Escalated');
  const highRiskRecords = projectRecords.filter((record) => record.hasClaimRisk || record.priority === 'Critical' || record.priority === 'High');
  const pendingApprovals = projectRecords.filter((record) => record.mainCategory === 'Approval' || record.status === 'In Review');
  const recentRecords = [...projectRecords].sort((a, b) => b.dateReceived.getTime() - a.dateReceived.getTime()).slice(0, 6);

  const metrics = getDashboardMetrics(currentUser.role, projectRecords, projectActions);

  const categoryCounts = projectRecords.reduce<Record<string, number>>((acc, record) => {
    acc[record.mainCategory] = (acc[record.mainCategory] || 0) + 1;
    return acc;
  }, {});

  const disciplineCounts = projectRecords.reduce<Record<string, number>>((acc, record) => {
    acc[record.discipline] = (acc[record.discipline] || 0) + 1;
    return acc;
  }, {});

  const maxCategory = Math.max(1, ...Object.values(categoryCounts));
  const maxDiscipline = Math.max(1, ...Object.values(disciplineCounts));

  return (
    <PageLayout title="Dashboard">
      <div className="min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <section className="rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden">
          <div className="p-5 sm:p-7 border-b border-border/60 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(16,185,129,0.08),transparent)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={selectedProject.status} />
                  <span className="text-xs font-semibold text-muted-foreground">{selectedProject.contractType}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedProject.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedProject.client} - {selectedProject.location}
                </p>
              </div>
              <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:min-w-[360px]">
                <Link href="/records/new" className="rounded-lg bg-primary text-primary-foreground px-3 py-3 text-center text-xs font-bold hover:bg-primary/90">
                  Log Record
                </Link>
                <Link href="/linking" className="rounded-lg border border-border bg-background px-3 py-3 text-center text-xs font-bold text-foreground hover:bg-secondary">
                  Link Items
                </Link>
                <Link href="/reports" className="rounded-lg border border-border bg-background px-3 py-3 text-center text-xs font-bold text-foreground hover:bg-secondary">
                  Report
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 border-b border-border/60">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Link key={metric.label} href={metric.href} className="group p-5 border-b sm:border-r border-border/60 last:border-r-0 hover:bg-secondary/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${metric.tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm font-bold text-foreground">{metric.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{metric.helper}</p>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">Response Queue</h3>
                <Link href="/actions" className="text-xs font-bold text-primary inline-flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {openActions.slice(0, 5).map((action) => (
                  <Link key={action.id} href={`/records/${action.recordId}`} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center rounded-lg border border-border/60 bg-background p-4 hover:border-primary/50">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.responsiblePerson} - Due {action.dueDate.toLocaleDateString()}</p>
                    </div>
                    <ImpactChip type={action.impactType as any} />
                    <StatusBadge status={action.status} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">High-Risk Watchlist</h3>
                <Link href="/cost-impact" className="text-xs font-bold text-primary inline-flex items-center gap-1">
                  Review <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {highRiskRecords.slice(0, 5).map((record) => (
                  <Link key={record.id} href={`/records/${record.id}`} className="block rounded-lg border border-border/60 bg-background p-4 hover:border-primary/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-primary">{record.reference}</p>
                        <p className="text-sm font-bold text-foreground truncate">{record.title}</p>
                      </div>
                      <StatusBadge status={record.priority} type="priority" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {record.hasProgrammeImpact && <ImpactChip type="Programme" />}
                      {record.hasCostImpact && <ImpactChip type="Cost" />}
                      {record.hasClaimRisk && <ImpactChip type="Claim" />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <h3 className="font-bold text-foreground">Recent Correspondence</h3>
              <Link href="/search" className="text-xs font-bold text-primary inline-flex items-center gap-1">
                <Search className="w-3 h-3" /> Search
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              {recentRecords.map((record) => (
                <Link key={record.id} href={`/records/${record.id}`} className="grid grid-cols-1 md:grid-cols-[130px_1fr_auto] gap-3 p-4 hover:bg-secondary/50">
                  <div className="text-xs font-mono font-bold text-primary">{record.reference}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{record.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{record.sender} to {record.receiver}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={record.status} />
                    <span className="text-xs text-muted-foreground">{record.dateReceived.toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/search" className="rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden hover:border-primary/50">
            <div className="p-5 border-b border-border/60">
              <h3 className="font-bold text-foreground">Records by Category</h3>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-foreground">{category}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(10, (count / maxCategory) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Link>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/projects" className="rounded-xl border border-border/70 bg-card p-5 shadow-sm hover:border-primary/50">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-primary" /> Project Controls Snapshot</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-background border border-border/60 p-3"><p className="text-muted-foreground text-xs">Stakeholders</p><p className="font-bold text-foreground">{selectedProject.stakeholders.length}</p></div>
              <div className="rounded-lg bg-background border border-border/60 p-3"><p className="text-muted-foreground text-xs">Claim Risks</p><p className="font-bold text-foreground">{projectRecords.filter((record) => record.hasClaimRisk).length}</p></div>
              <div className="rounded-lg bg-background border border-border/60 p-3"><p className="text-muted-foreground text-xs">Cost Items</p><p className="font-bold text-foreground">{projectRecords.filter((record) => record.hasCostImpact).length}</p></div>
              <div className="rounded-lg bg-background border border-border/60 p-3"><p className="text-muted-foreground text-xs">Closed</p><p className="font-bold text-foreground">{projectRecords.filter((record) => record.status === 'Closed').length}</p></div>
            </div>
          </Link>

          <Link href="/search" className="rounded-xl border border-border/70 bg-card p-5 shadow-sm hover:border-primary/50">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-primary" /> Discipline Load</h3>
            <div className="space-y-3">
              {Object.entries(disciplineCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([discipline, count]) => (
                <div key={discipline} className="flex items-center gap-3">
                  <span className="w-32 text-xs font-semibold text-muted-foreground truncate">{discipline}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(10, (count / maxDiscipline) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </Link>

          <Link href="/linking" className="rounded-xl border border-border/70 bg-card p-5 shadow-sm hover:border-primary/50">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-primary" /> Decision Trail Ready</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Cross-link correspondence to variations, delays, approvals, programme impact, cost impact, responsible parties, and claim risk.</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary">Open cross-linking <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
