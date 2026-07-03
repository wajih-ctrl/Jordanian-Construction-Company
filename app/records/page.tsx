'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import Link from 'next/link';
import { FilePlus2, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { DISCIPLINES, RECORD_CATEGORIES, RECORD_STATUSES } from '@/lib/constants';
import { getLinkedRecordCount } from '@/lib/record-links';

export default function RecordsPage() {
  const { currentUser, selectedProject, records } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (!selectedProject) {
    return (
      <PageLayout title="Records">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  let filteredRecords = records.filter((record) => record.projectId === selectedProject.id);

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredRecords = filteredRecords.filter((record) =>
      record.title.toLowerCase().includes(term) ||
      record.reference.toLowerCase().includes(term) ||
      record.description.toLowerCase().includes(term) ||
      record.sender.toLowerCase().includes(term) ||
      record.receiver.toLowerCase().includes(term)
    );
  }

  if (selectedCategory) filteredRecords = filteredRecords.filter((record) => record.mainCategory === selectedCategory);
  if (selectedDiscipline) filteredRecords = filteredRecords.filter((record) => record.discipline === selectedDiscipline);
  if (selectedStatus) filteredRecords = filteredRecords.filter((record) => record.status === selectedStatus);

  const projectRecords = records.filter((record) => record.projectId === selectedProject.id);
  const canAddRecord = currentUser?.role === 'DC' || currentUser?.role === 'ADMIN';

  return (
    <PageLayout title="Records">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-sky-700 uppercase tracking-wide">Correspondence register</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{selectedProject.name}</h2>
              <p className="mt-2 text-sm text-slate-500">Search, filter, and open project records with linked programme, cost, and claim impacts.</p>
            </div>
            {canAddRecord && (
              <Link href="/records/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
                <FilePlus2 className="w-4 h-4" /> New Record
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['Total Records', projectRecords.length],
              ['Open Actions', projectRecords.filter((record) => record.actionStatus && record.actionStatus !== 'Closed').length],
              ['Programme Impact', projectRecords.filter((record) => record.hasProgrammeImpact).length],
              ['Claim Risk', projectRecords.filter((record) => record.hasClaimRisk).length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, reference, sender, receiver..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Categories</option>
              {RECORD_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={selectedDiscipline} onChange={(event) => setSelectedDiscipline(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Disciplines</option>
              {DISCIPLINES.map((discipline) => <option key={discipline} value={discipline}>{discipline}</option>)}
            </select>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Statuses</option>
              {RECORD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Showing {filteredRecords.length} of {projectRecords.length} records
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px]">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold">Reference</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Record</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Category</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Discipline</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Priority</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Impacts</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Links</th>
                    <th className="px-5 py-4 text-left text-xs font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-xs font-mono font-bold text-slate-500">{record.reference}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-950 max-w-xs truncate">{record.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{record.sender} to {record.receiver}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">{record.mainCategory}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">{record.discipline}</td>
                      <td className="px-5 py-4"><StatusBadge status={record.priority} type="priority" /></td>
                      <td className="px-5 py-4"><StatusBadge status={record.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {record.hasProgrammeImpact && <ImpactChip type="Programme" />}
                          {record.hasCostImpact && <ImpactChip type="Cost" />}
                          {record.hasClaimRisk && <ImpactChip type="Claim" />}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-700">{getLinkedRecordCount(record)}</td>
                      <td className="px-5 py-4">
                        <Link href={`/records/${record.id}`} className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-400">
                          View
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
