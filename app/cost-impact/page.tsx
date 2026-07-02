'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AlertTriangle, Banknote, FileWarning } from 'lucide-react';
import Link from 'next/link';

export default function CostImpactPage() {
  const { selectedProject, costImpacts } = useApp();

  if (!selectedProject) {
    return (
      <PageLayout title="Cost Impact & Claim Risk">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const projectCosts = costImpacts.filter((cost) => cost.projectId === selectedProject.id);
  const totalAmount = projectCosts.reduce((sum, cost) => sum + cost.estimatedAmount, 0);
  const stats = [
    ['Total Impact', `JOD ${(totalAmount / 1000).toFixed(0)}K`],
    ['Critical Risk', projectCosts.filter((cost) => cost.claimRiskLevel === 'Critical').length],
    ['High Risk', projectCosts.filter((cost) => cost.claimRiskLevel === 'High').length],
    ['Claimed', projectCosts.filter((cost) => cost.status === 'Claimed').length],
  ];

  return (
    <PageLayout title="Cost Impact & Claim Risk">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Commercial register</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Cost impact and claim risk</h2>
              <p className="mt-2 text-sm text-slate-500">Variation references, estimate placeholders, supporting records, responsible party, and required commercial action.</p>
            </div>
            <Link href="/reports" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <FileWarning className="w-4 h-4" /> Decision Report
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-950">Commercial and Claim Items</h3>
          </div>
          {projectCosts.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No cost impacts or claim risks identified</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold">Description</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Amount</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Variation Ref</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Claim Risk</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Supporting Records</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Responsible</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {projectCosts.map((cost) => (
                    <tr key={cost.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-950 max-w-xs">
                        {cost.costImpactType}
                        <p className="mt-1 text-xs font-normal text-slate-500">{cost.requiredAction}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-950">JOD {cost.estimatedAmount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs font-mono text-slate-600">{cost.variationRef || 'TBD'}</td>
                      <td className="px-5 py-4"><StatusBadge status={cost.claimRiskLevel} /></td>
                      <td className="px-5 py-4"><StatusBadge status={cost.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {cost.supportingRecords.map((record) => (
                            <Link key={record.id} href={`/records/${record.id}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                              {record.reference}
                            </Link>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">{cost.responsibleParty}</td>
                      <td className="px-5 py-4">
                        <Link href={`/records/${cost.recordId}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-400">
                          View Record
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
