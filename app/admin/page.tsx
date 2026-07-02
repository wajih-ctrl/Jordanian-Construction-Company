'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ACTION_STATUSES, DISCIPLINES, PRIORITIES, RECORD_CATEGORIES, SUBCATEGORIES, USER_ROLES } from '@/lib/constants';
import { Activity, Folder, Layers3, Shield, SlidersHorizontal, Users, Edit3, Plus, Trash2 } from 'lucide-react';
import type { User, UserRole } from '@/lib/types';
import type React from 'react';
import { useMemo, useState } from 'react';

const panelItems = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'categories', label: 'Categories', icon: Layers3 },
  { id: 'statuses', label: 'Statuses', icon: SlidersHorizontal },
  { id: 'activity', label: 'Activity', icon: Activity },
] as const;

type PanelId = (typeof panelItems)[number]['id'];

export default function AdminPage() {
  const { users, projects, records, actions, addUser, updateUser, deleteUser } = useApp();
  const [activePanel, setActivePanel] = useState<PanelId>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PM' as UserRole,
    avatar: '👤',
  });

  const adminMetrics = [
    { label: 'Total Projects', value: projects.length },
    { label: 'Total Records', value: records.length },
    { label: 'Open Actions', value: actions.filter((action) => action.status !== 'Closed').length },
    { label: 'Claim-Risk Records', value: records.filter((record) => record.hasClaimRisk).length },
    { label: 'Pending Approvals', value: records.filter((record) => record.status === 'In Review').length },
    { label: 'Closed Actions', value: actions.filter((action) => action.status === 'Closed').length },
  ];

  const roleCounts = useMemo(
    () => USER_ROLES.map((role) => ({ role, count: users.filter((user) => user.role === role.value).length })),
    [users],
  );

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '', role: 'PM', avatar: '👤' });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, avatar: user.avatar || '👤' });
  };

  const handleDeleteUser = (user: User) => {
    deleteUser(user.id);
    if (selectedUser?.id === user.id) {
      resetForm();
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (selectedUser) {
      updateUser({ ...selectedUser, ...formData });
      resetForm();
      return;
    }

    addUser({
      id: `user-${Math.random().toString(36).slice(2, 9)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      avatar: formData.avatar,
    });
    resetForm();
  };

  const actionLabel = selectedUser ? 'Save changes' : 'Create user';

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
            <div className="p-5 space-y-5">
              <div className="grid gap-4 xl:grid-cols-[0.9fr_0.45fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-950 mb-3">Role distribution</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {roleCounts.map(({ role, count }) => (
                      <div key={role.value} className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-bold text-slate-900">{role.label}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-950">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">User form</p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">Create or edit a user</h3>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      <Plus className="w-4 h-4" /> New
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Name
                      <input
                        value={formData.name}
                        onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        placeholder="e.g. Lina Saadeh"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Email
                      <input
                        value={formData.email}
                        onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        placeholder="email@construct.jo"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Role
                      <select
                        value={formData.role}
                        onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      >
                        {USER_ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {actionLabel}
                      </button>
                      {selectedUser && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Name</th>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Role</th>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Email</th>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-950">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.avatar}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">{user.role}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500">{user.email}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
