'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Project, ProjectStatus } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, Building2, CalendarDays, Check, MapPin, Plus, Search, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProjectsPage() {
  const router = useRouter();
  const { currentUser, projects, setSelectedProject, addProject } = useApp();
  const [query, setQuery] = useState('');
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    location: '',
    contractType: 'FIDIC Yellow - Lump Sum',
    status: 'Active' as ProjectStatus,
    startDate: '2026-07-03',
    endDate: '2027-06-30',
    stakeholders: '',
  });

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

  const updateNewProject = (field: keyof typeof newProject, value: string) => {
    setNewProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProject = (event: React.FormEvent) => {
    event.preventDefault();

    const stakeholderNames = newProject.stakeholders
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);

    const createdProject: Project = {
      id: `p-${Date.now()}`,
      name: newProject.name.trim(),
      client: newProject.client.trim(),
      contractType: newProject.contractType,
      location: newProject.location.trim(),
      status: newProject.status,
      startDate: new Date(newProject.startDate),
      endDate: new Date(newProject.endDate),
      totalRecords: 0,
      openActions: 0,
      overdueItems: 0,
      costImpactRecords: 0,
      programmeImpactRecords: 0,
      claimRiskItems: 0,
      lastActivity: new Date(),
      stakeholders: (stakeholderNames.length ? stakeholderNames : [currentUser?.name || 'Project Admin']).map((name, index) => ({
        id: `new-stakeholder-${Date.now()}-${index}`,
        name,
        role: index === 0 ? 'Client / Project Representative' : 'Project Stakeholder',
      })),
    };

    addProject(createdProject);
    setNewProjectOpen(false);
    setNewProject({
      name: '',
      client: '',
      location: '',
      contractType: 'FIDIC Yellow - Lump Sum',
      status: 'Active',
      startDate: '2026-07-03',
      endDate: '2027-06-30',
      stakeholders: '',
    });
    router.push(`/projects/${createdProject.id}`);
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
            {currentUser?.role === 'ADMIN' && (
              <button
                type="button"
                onClick={() => setNewProjectOpen((value) => !value)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" /> New Project
              </button>
            )}
          </div>

          {newProjectOpen && currentUser?.role === 'ADMIN' && (
            <form onSubmit={handleCreateProject} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">Create project</p>
                  <p className="mt-1 text-sm text-slate-600">Add a project to this prototype session, then open it and start logging records.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewProjectOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-950"
                  aria-label="Close new project form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Project name</span>
                  <input
                    required
                    value={newProject.name}
                    onChange={(event) => updateNewProject('name', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Zarqa Civic Centre"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Client</span>
                  <input
                    required
                    value={newProject.client}
                    onChange={(event) => updateNewProject('client', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Client / employer"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Location</span>
                  <input
                    required
                    value={newProject.location}
                    onChange={(event) => updateNewProject('location', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Amman, Jordan"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Contract type</span>
                  <select
                    value={newProject.contractType}
                    onChange={(event) => updateNewProject('contractType', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>FIDIC Red - Admeasurement</option>
                    <option>FIDIC Yellow - Lump Sum</option>
                    <option>FIDIC Pink - Design Build</option>
                    <option>FIDIC Green - Cost Plus</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Start date</span>
                  <input
                    required
                    type="date"
                    value={newProject.startDate}
                    onChange={(event) => updateNewProject('startDate', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Target completion</span>
                  <input
                    required
                    type="date"
                    value={newProject.endDate}
                    onChange={(event) => updateNewProject('endDate', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Status</span>
                  <select
                    value={newProject.status}
                    onChange={(event) => updateNewProject('status', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Active</option>
                    <option>At Risk</option>
                    <option>Monitoring</option>
                    <option>Closed</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Stakeholders</span>
                  <input
                    value={newProject.stakeholders}
                    onChange={(event) => updateNewProject('stakeholders', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Names separated by commas"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <Check className="w-4 h-4" /> Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setNewProjectOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

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

              <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  ['Records', project.totalRecords],
                  ['Open', project.openActions],
                  ['Overdue', project.overdueItems],
                  ['Cost Impact', project.costImpactRecords],
                  ['Programme', project.programmeImpactRecords],
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
