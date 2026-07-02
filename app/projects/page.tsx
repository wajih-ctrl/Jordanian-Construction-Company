'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import Link from 'next/link';
import { ArrowRight, Building2, CalendarDays, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const { projects, setSelectedProject } = useApp();
  const [query, setQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    const term = query.toLowerCase();
    return (
      project.name.toLowerCase().includes(term) ||
      project.client.toLowerCase().includes(term) ||
      project.location.toLowerCase().includes(term) ||
      project.contractType.toLowerCase().includes(term)
    );
  });

  const totals = {
    records: projects.reduce((sum, project) => sum + project.totalRecords, 0),
    open: projects.reduce((sum, project) => sum + project.openActions, 0),
    overdue: projects.reduce((sum, project) => sum + project.overdueItems, 0),
    risk: projects.reduce((sum, project) => sum + project.claimRiskItems, 0),
  };

  return (
    <PageLayout title="Projects">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-sky-700 uppercase tracking-wide">Portfolio register</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Jordan construction projects</h2>
              <p className="mt-2 text-sm text-slate-500">Monitor active, at-risk, monitoring, and closed projects with records and decision trails.</p>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search project, client, location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['Total Records', totals.records],
              ['Open Actions', totals.open],
              ['Overdue Items', totals.overdue],
              ['Claim Risks', totals.risk],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              onClick={() => setSelectedProject(project)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-400 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <StatusBadge status={project.status} />
                      <span className="text-xs font-semibold text-slate-500">{project.contractType}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 truncate">{project.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.client}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['Records', project.totalRecords],
                  ['Open', project.openActions],
                  ['Overdue', project.overdueItems],
                  ['Risk', project.claimRiskItems],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location}</span>
                <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.stakeholders.length} stakeholders</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Ends {project.endDate.toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </PageLayout>
  );
}
