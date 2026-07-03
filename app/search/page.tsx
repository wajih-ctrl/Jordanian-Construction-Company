'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import Link from 'next/link';
import { ACTION_STATUSES, RECORD_CATEGORIES, DISCIPLINES, PRIORITIES, SUBCATEGORIES } from '@/lib/constants';

export default function SearchPage() {
  const { records, projects, selectedProject } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced filters
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>(selectedProject?.id || '');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterResponsibility, setFilterResponsibility] = useState<string>('');
  const [filterProgrammeImpact, setFilterProgrammeImpact] = useState<string>('');
  const [filterCostImpact, setFilterCostImpact] = useState<string>('');
  const [filterClaimRisk, setFilterClaimRisk] = useState<string>('');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [filterSender, setFilterSender] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [filterResponseDueFrom, setFilterResponseDueFrom] = useState<string>('');
  const [filterResponseDueTo, setFilterResponseDueTo] = useState<string>('');
  const [filterActionStatus, setFilterActionStatus] = useState<string>('');

  const projectRecords = filterProject ? records.filter((r) => r.projectId === filterProject) : records;

  let results = projectRecords;

  // Apply keyword search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    results = results.filter((r) =>
      r.title.toLowerCase().includes(term) ||
      r.reference.toLowerCase().includes(term) ||
      r.sender.toLowerCase().includes(term) ||
      r.receiver.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  }

  // Apply advanced filters
  if (filterCategory) results = results.filter((r) => r.mainCategory === filterCategory);
  if (filterSubcategory) results = results.filter((r) => r.subcategory === filterSubcategory);
  if (filterDiscipline) results = results.filter((r) => r.discipline === filterDiscipline);
  if (filterStatus) results = results.filter((r) => r.status === filterStatus);
  if (filterPriority) results = results.filter((r) => r.priority === filterPriority);
  if (filterResponsibility) results = results.filter((r) => r.responsibleParty === filterResponsibility);
  if (filterProgrammeImpact === 'yes') results = results.filter((r) => r.hasProgrammeImpact);
  if (filterProgrammeImpact === 'no') results = results.filter((r) => !r.hasProgrammeImpact);
  if (filterCostImpact === 'yes') results = results.filter((r) => r.hasCostImpact);
  if (filterCostImpact === 'no') results = results.filter((r) => !r.hasCostImpact);
  if (filterClaimRisk === 'yes') results = results.filter((r) => r.hasClaimRisk);
  if (filterClaimRisk === 'no') results = results.filter((r) => !r.hasClaimRisk);
  if (filterOverdueOnly) results = results.filter((r) => r.actionStatus === 'Overdue');
  if (filterSender) results = results.filter((r) => r.sender === filterSender);
  if (filterDateFrom) results = results.filter((r) => r.dateReceived >= new Date(filterDateFrom));
  if (filterDateTo) results = results.filter((r) => r.dateReceived <= new Date(filterDateTo));
  if (filterResponseDueFrom) results = results.filter((r) => r.responseDueDate && r.responseDueDate >= new Date(filterResponseDueFrom));
  if (filterResponseDueTo) results = results.filter((r) => r.responseDueDate && r.responseDueDate <= new Date(filterResponseDueTo));
  if (filterActionStatus) results = results.filter((r) => r.actionStatus === filterActionStatus);

  const hasActiveFilters = 
    filterProject || filterCategory || filterSubcategory || filterDiscipline || filterStatus || filterPriority || filterResponsibility || 
    filterProgrammeImpact || filterCostImpact || filterClaimRisk || filterOverdueOnly || filterSender || 
    filterDateFrom || filterDateTo || filterResponseDueFrom || filterResponseDueTo || filterActionStatus;

  const subcategoryOptions = filterCategory
    ? SUBCATEGORIES[filterCategory as keyof typeof SUBCATEGORIES]
    : Array.from(new Set(Object.values(SUBCATEGORIES).flat()));
  const responsibleOptions = Array.from(new Set(records.map((record) => record.responsibleParty).filter(Boolean))).sort();
  const senderOptions = Array.from(new Set(records.map((record) => record.sender).filter(Boolean))).sort();
  const activeFilterCount = [
    filterProject,
    filterCategory,
    filterSubcategory,
    filterDiscipline,
    filterStatus,
    filterPriority,
    filterResponsibility,
    filterProgrammeImpact,
    filterCostImpact,
    filterClaimRisk,
    filterOverdueOnly,
    filterSender,
    filterDateFrom,
    filterDateTo,
    filterResponseDueFrom,
    filterResponseDueTo,
    filterActionStatus,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterProject(selectedProject?.id || '');
    setFilterCategory('');
    setFilterSubcategory('');
    setFilterDiscipline('');
    setFilterStatus('');
    setFilterPriority('');
    setFilterResponsibility('');
    setFilterProgrammeImpact('');
    setFilterCostImpact('');
    setFilterClaimRisk('');
    setFilterOverdueOnly(false);
    setFilterSender('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterResponseDueFrom('');
    setFilterResponseDueTo('');
    setFilterActionStatus('');
    setSearchTerm('');
  };

  return (
    <PageLayout title="Search & Filter Records">
      <div className="p-6 space-y-6 overflow-auto">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Search & Filter Records</h2>
          
          {/* Main Search Bar - Premium */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="Search by keyword, reference, sender, receiver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base font-medium animation-subtle shadow-md"
            />
          </div>
        </div>

        {/* Filter Button - Premium */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/50 text-foreground px-5 py-3 rounded-lg hover:border-primary animation-subtle text-sm font-bold uppercase tracking-wide shadow-md"
        >
          <Filter className="w-4 h-4" /> Advanced Filters {hasActiveFilters && `(${activeFilterCount})`}
        </button>

        {/* Advanced Filters - Premium */}
        {showAdvanced && (
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
            <div className="p-6 bg-gradient-to-r from-purple-500/5 to-transparent border-b border-border/50">
              <h3 className="font-bold text-foreground text-lg">Advanced Filters</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Project</label>
                  <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setFilterSubcategory('');
                    }}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Categories</option>
                    {RECORD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Subcategory</label>
                  <select
                    value={filterSubcategory}
                    onChange={(e) => setFilterSubcategory(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Subcategories</option>
                    {subcategoryOptions.map((sub, index) => (
                      <option key={`${sub}-${index}`} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Discipline</label>
                  <select
                    value={filterDiscipline}
                    onChange={(e) => setFilterDiscipline(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Disciplines</option>
                    {DISCIPLINES.map((disc) => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Pending Response">Pending Response</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">All Priorities</option>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Programme Impact</label>
                  <select
                    value={filterProgrammeImpact}
                    onChange={(e) => setFilterProgrammeImpact(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Impact</option>
                    <option value="yes">Has Impact</option>
                    <option value="no">No Impact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Cost Impact</label>
                  <select
                    value={filterCostImpact}
                    onChange={(e) => setFilterCostImpact(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Cost Impact</option>
                    <option value="yes">Has Cost Impact</option>
                    <option value="no">No Cost Impact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Claim Risk</label>
                  <select
                    value={filterClaimRisk}
                    onChange={(e) => setFilterClaimRisk(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Risk Level</option>
                    <option value="yes">Has Claim Risk</option>
                    <option value="no">No Claim Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Responsible Party</label>
                  <select
                    value={filterResponsibility}
                    onChange={(e) => setFilterResponsibility(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Responsible Party</option>
                    {responsibleOptions.map((person) => (
                      <option key={person} value={person}>{person}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Sender</label>
                  <select
                    value={filterSender}
                    onChange={(e) => setFilterSender(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Sender</option>
                    {senderOptions.map((sender) => (
                      <option key={sender} value={sender}>{sender}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Action Status</label>
                  <select
                    value={filterActionStatus}
                    onChange={(e) => setFilterActionStatus(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  >
                    <option value="">Any Action Status</option>
                    {ACTION_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filterOverdueOnly}
                    onChange={(e) => setFilterOverdueOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-bold text-foreground">Overdue only</span>
                </label>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Date From</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Date To</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Response Due From</label>
                  <input
                    type="date"
                    value={filterResponseDueFrom}
                    onChange={(e) => setFilterResponseDueFrom(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Response Due To</label>
                  <input
                    type="date"
                    value={filterResponseDueTo}
                    onChange={(e) => setFilterResponseDueTo(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                  />
                </div>
            </div>

              <div className="flex gap-3 pt-2 border-t border-border/50">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/70 animation-subtle text-sm font-semibold"
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Header - Premium */}
        <div className="flex items-center justify-between bg-gradient-to-r from-background to-background/50 p-4 rounded-lg border border-border/50">
          <p className="text-sm font-bold text-foreground uppercase tracking-wide">
            {searchTerm || hasActiveFilters ? `Found ${results.length} record(s)` : `${projectRecords.length} total record(s)`}
          </p>
        </div>

        {/* Results - Premium */}
        {results.length === 0 && (searchTerm || hasActiveFilters) ? (
          <div className="bg-card border border-border/50 rounded-xl p-12 text-center shadow-md">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-foreground font-bold text-lg mb-2">No results found</p>
            <p className="text-muted-foreground text-sm mb-6">Try adjusting your search terms or filters</p>
            <button
              onClick={clearFilters}
              className="inline-block bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 py-3 rounded-lg font-bold animation-subtle shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((record) => (
              <Link
                key={record.id}
                href={`/records/${record.id}`}
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg animation-subtle block group overflow-hidden shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-mono text-primary font-bold mb-1">{record.reference}</p>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary animation-subtle">{record.title}</h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <StatusBadge status={record.status} />
                  </div>
                </div>

                <p className="text-sm text-foreground mb-4 leading-relaxed">{record.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-muted-foreground mb-4 pb-4 border-b border-border/30">
                  <div><span className="text-muted-foreground">Sender:</span> {record.sender}</div>
                  <div><span className="text-muted-foreground">Category:</span> {record.mainCategory}</div>
                  <div><span className="text-muted-foreground">Discipline:</span> {record.discipline}</div>
                  <div><span className="text-muted-foreground">Due:</span> {record.responseDueDate?.toLocaleDateString() || 'N/A'}</div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {record.hasProgrammeImpact && <ImpactChip level="High" />}
                  {record.hasCostImpact && <ImpactChip level="Medium" />}
                  {record.hasClaimRisk && <ImpactChip level={record.claimRiskLevel || 'Medium'} />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
