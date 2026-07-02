'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CalendarClock, Clock, Route, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ProgrammeImpactPage() {
  const { selectedProject, programmeImpacts } = useApp();

  if (!selectedProject) {
    return (
      <PageLayout title="Programme Impact">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const projectImpacts = programmeImpacts.filter((impact) => impact.projectId === selectedProject.id);
  const stats = [
    ['Identified', projectImpacts.filter((impact) => impact.status === 'Identified').length],
    ['Under Review', projectImpacts.filter((impact) => impact.status === 'Under Review').length],
    ['Mitigating', projectImpacts.filter((impact) => impact.status === 'Mitigating').length],
    ['Resolved', projectImpacts.filter((impact) => impact.status === 'Resolved').length],
  ];

  return (
    <PageLayout title="Programme Impact">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Planning review</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Programme impact register</h2>
              <p className="mt-2 text-sm text-slate-500">Linked correspondence, delay reasons, programme update references, response due dates, and action status.</p>
            </div>
            <Link href="/timeline" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <Route className="w-4 h-4" /> View Timeline
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
            <TrendingUp className="w-5 h-5 text-indigo-700" />
            <h3 className="font-bold text-slate-950">Delay and Schedule Items</h3>
          </div>
          {projectImpacts.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No programme impacts identified</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {projectImpacts.map((impact) => (
                <article key={impact.id} className="p-5 hover:bg-slate-50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <StatusBadge status={impact.status} />
                        <span className="text-xs font-mono font-bold text-slate-500">{impact.programmeUpdateRef}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-950">{impact.delayReason}</h3>
                      <p className="mt-2 text-sm text-slate-500">Responsible: {impact.responsibleParty}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[540px]">
                      <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Event Date</p><p className="font-bold text-slate-950">{impact.eventDate.toLocaleDateString()}</p></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Time Impact</p><p className="font-bold text-slate-950">{impact.potentialTimeImpact}</p></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Response Due</p><p className="font-bold text-slate-950">{impact.responseDueDate.toLocaleDateString()}</p></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">Related Action</p><p className="font-bold text-slate-950">{impact.linkedRecords[0]?.requiredAction || 'Review delay response'}</p></div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-500"><Clock className="w-3.5 h-3.5" /> Linked records</span>
                    {impact.linkedRecords.map((record) => (
                      <Link key={record.id} href={`/records/${record.id}`} className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 hover:bg-indigo-100">
                        {record.reference}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
