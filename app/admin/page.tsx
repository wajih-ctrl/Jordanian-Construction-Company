'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ACTION_STATUSES, DISCIPLINES, PRIORITIES, RECORD_CATEGORIES, SUBCATEGORIES, USER_ROLES } from '@/lib/constants';
import { Activity, Folder, Layers3, Shield, SlidersHorizontal, Users } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const panelItems = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'categories', label: 'Categories', icon: Layers3 },
  { id: 'statuses', label: 'Statuses', icon: SlidersHorizontal },
  { id: 'activity', label: 'Activity', icon: Activity },
] as const;

type PanelId = (typeof panelItems)[number]['id'];

export default function AdminPage() {
  const { users, projects, records, actions } = useApp();
  const [activePanel, setActivePanel] = useState<PanelId>('users');

  const adminMetrics = [
    { label: 'Total Projects', value: projects.length },
    { label: 'Total Records', value: records.length },
    { label: 'Open Actions', value: actions.filter((action) => action.status !== 'Closed').length },
    { label: 'Claim-Risk Records', value: records.filter((record) => record.hasClaimRisk).length },
    { label: 'Pending Approvals', value: records.filter((record) => record.status === 'In Review').length },
    { label: 'Closed Actions', value: actions.filter((action) => action.status === 'Closed').length },
  ];

  return (
    <PageLayout title="Administration">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <p className="text-sm font-bold text-sky-700 uppercase tracking-wide">Admin console</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Prototype configuration</h2>
          <p className="mt-2 text-sm text-slate-500">Manage mocked users, projects, categories, disciplines, statuses, and system activity.</p>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-3">
            {adminMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {panelItems.map((panel) => {
              const Icon = panel.icon;
              const active = activePanel === panel.id;
              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => setActivePanel(panel.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                    active
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {panel.label}
                </button>
              );
            })}
          </div>
        </section>

        {activePanel === 'users' && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PanelHeader icon={<Users className="w-5 h-5 text-sky-700" />} title="User Management" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold">Name</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Role</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Role Journey</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => {
                    const role = USER_ROLES.find((item) => item.value === user.role);
                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-bold text-slate-950">{user.name}</td>
                        <td className="px-5 py-4"><span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">{user.role}</span></td>
                        <td className="px-5 py-4 text-sm text-slate-600">{role?.label}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{user.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePanel === 'projects' && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PanelHeader icon={<Folder className="w-5 h-5 text-emerald-700" />} title="Projects" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold">Project</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Records</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Open Actions</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Claim Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{project.name}</p>
                        <p className="text-sm text-slate-500">{project.location}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={project.status} /></td>
                      <td className="px-5 py-4 font-bold text-slate-950">{project.totalRecords}</td>
                      <td className="px-5 py-4 font-bold text-slate-950">{project.openActions}</td>
                      <td className="px-5 py-4 font-bold text-slate-950">{project.claimRiskItems}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePanel === 'categories' && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PanelHeader icon={<Layers3 className="w-5 h-5 text-indigo-700" />} title="Category Management" />
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {RECORD_CATEGORIES.map((category) => (
                <div key={category} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{category}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{SUBCATEGORIES[category].join(', ')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-950"><Shield className="w-4 h-4 text-slate-700" /> Disciplines</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {DISCIPLINES.map((discipline) => (
                  <span key={discipline} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">{discipline}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePanel === 'statuses' && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PanelHeader icon={<SlidersHorizontal className="w-5 h-5 text-orange-700" />} title="Statuses and Priorities" />
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h3 className="text-base font-bold text-slate-950 mb-3">Action Statuses</h3>
                <div className="flex flex-wrap gap-2">
                  {ACTION_STATUSES.map((status) => <StatusBadge key={status} status={status} />)}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950 mb-3">Priorities</h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((priority) => <StatusBadge key={priority} status={priority} type="priority" />)}
                </div>
              </div>
            </div>
          </section>
        )}

        {activePanel === 'activity' && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PanelHeader icon={<Activity className="w-5 h-5 text-rose-700" />} title="Mocked System Activity" />
            <div className="p-5 space-y-3">
              {[
                'Document Controller logged RFI/Submittal response for MEP coordination.',
                'Commercial / QS marked variation cost impact as under review.',
                'Planning team escalated late approval against Programme Update Rev. 07.',
                'Consultant / Engineer closed NCR follow-up after corrective action evidence.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">{item}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}

function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="border-b border-slate-200 p-5 flex items-center gap-2">
      {icon}
      <h3 className="font-bold text-slate-950">{title}</h3>
    </div>
  );
}
