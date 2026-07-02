'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { RECORD_CATEGORIES, DISCIPLINES, PRIORITIES, SUBCATEGORIES, SAMPLE_SENDERS, SAMPLE_RECEIVERS } from '@/lib/constants';
import type { Record } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Paperclip } from 'lucide-react';

export default function NewRecordPage() {
  const router = useRouter();
  const { selectedProject, setSelectedProject, projects, addRecord, users } = useApp();
  const [step, setStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3]);
  const [formData, setFormData] = useState({
    title: '',
    sender: '',
    receiver: '',
    dateReceived: new Date().toISOString().split('T')[0],
    description: '',
    eventDate: '',
    instructionDate: '',
    responseDueDate: '',
    closureDate: '',
    mainCategory: RECORD_CATEGORIES[0],
    subcategory: '',
    discipline: DISCIPLINES[0],
    priority: 'Medium' as const,
    status: 'Draft' as const,
    hasProgrammeImpact: false,
    programmeImpactDesc: '',
    hasCostImpact: false,
    costImpactDesc: '',
    estimatedAmount: 0,
    hasClaimRisk: false,
    claimRiskLevel: '' as any,
    claimRiskNotes: '',
    responsibleParty: '',
    requiredAction: '',
    actionDueDate: '',
  });

  if (!selectedProject) {
    return (
      <PageLayout title="Add New Record">
        <div className="p-8 text-sm font-semibold text-slate-500">Loading selected project...</div>
      </PageLayout>
    );
  }

  const toggleSection = (section: number) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: Record = {
      id: `rec-${Date.now()}`,
      reference: `CORR-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      title: formData.title,
      projectId: selectedProject.id,
      sender: formData.sender,
      receiver: formData.receiver,
      dateReceived: new Date(formData.dateReceived),
      description: formData.description,
      mainCategory: formData.mainCategory,
      subcategory: formData.subcategory,
      discipline: formData.discipline,
      priority: formData.priority,
      status: formData.status,
      eventDate: formData.eventDate ? new Date(formData.eventDate) : undefined,
      instructionDate: formData.instructionDate ? new Date(formData.instructionDate) : undefined,
      responseDueDate: formData.responseDueDate ? new Date(formData.responseDueDate) : undefined,
      closureDate: formData.closureDate ? new Date(formData.closureDate) : undefined,
      linkedVariations: [],
      linkedDelays: [],
      linkedInstructions: [],
      linkedApprovals: [],
      linkedCostImpacts: [],
      linkedProgrammeImpacts: [],
      linkedClaimRisks: [],
      linkedSiteIssues: [],
      linkedRFIs: [],
      linkedNCRs: [],
      linkedProcurements: [],
      linkedPayments: [],
      hasProgrammeImpact: formData.hasProgrammeImpact,
      programmeImpactDesc: formData.programmeImpactDesc,
      hasCostImpact: formData.hasCostImpact,
      costImpactDesc: formData.costImpactDesc,
      estimatedAmount: formData.estimatedAmount || undefined,
      hasClaimRisk: formData.hasClaimRisk,
      claimRiskLevel: formData.claimRiskLevel || undefined,
      claimRiskNotes: formData.claimRiskNotes,
      responsibleParty: formData.responsibleParty,
      requiredAction: formData.requiredAction,
      actionDueDate: formData.actionDueDate ? new Date(formData.actionDueDate) : undefined,
      actionStatus: formData.requiredAction ? 'Open' : undefined,
      nextStep: '',
      createdBy: users[0]?.name || 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: [],
      comments: [],
      actionHistory: [],
    };

    addRecord(newRecord);
    router.push(`/records/${newRecord.id}`);
  };

  const sections = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Key Dates' },
    { id: 3, title: 'Classification & Priority' },
    { id: 4, title: 'Impact Assessment' },
    { id: 5, title: 'Responsibility & Action' },
  ];

  return (
    <PageLayout title="Add New Record" breadcrumbs={[{ label: 'Records', href: '/records' }, { label: 'New Record' }]}>
      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {sections.map((section) => {
            const colors = ['from-blue-500', 'from-amber-500', 'from-purple-500', 'from-red-500', 'from-green-500'];
            const colorIndex = section.id - 1;
            
            return (
            <div key={section.id} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full p-5 flex items-center justify-between hover:bg-secondary/70 animation-subtle transition-colors border-b border-border/50 bg-gradient-to-r ${colors[colorIndex]}/5 to-transparent`}
              >
                <h3 className="font-bold text-foreground text-lg">{section.title}</h3>
                <ChevronDown
                  className={`w-4 h-4 animation-subtle transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedSections.includes(section.id) && (
                <div className="p-6 space-y-5">
                  {section.id === 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle font-medium"
                          placeholder="Enter record title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Sender</label>
                          <select
                            value={formData.sender}
                            onChange={(e) => handleChange('sender', e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle font-medium"
                          >
                            <option value="">Select sender</option>
                            {SAMPLE_SENDERS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Receiver</label>
                          <select
                            value={formData.receiver}
                            onChange={(e) => handleChange('receiver', e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle font-medium"
                          >
                            <option value="">Select receiver</option>
                            {SAMPLE_RECEIVERS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Project</label>
                        <select
                          value={selectedProject.id}
                          onChange={(e) => setSelectedProject(projects.find((project) => project.id === e.target.value) || selectedProject)}
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle font-medium"
                        >
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Date Received</label>
                        <input
                          type="date"
                          value={formData.dateReceived}
                          onChange={(e) => handleChange('dateReceived', e.target.value)}
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 animation-subtle resize-none font-medium"
                          placeholder="Detailed description of the record"
                        />
                      </div>
                      <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 flex items-center gap-3">
                        <Paperclip className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-bold text-foreground">Attachment Placeholder</p>
                          <p className="text-xs text-muted-foreground">Mock document slot only - no real file upload or storage in this prototype.</p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 2 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Event Date</label>
                          <input
                            type="date"
                            value={formData.eventDate}
                            onChange={(e) => handleChange('eventDate', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Instruction Date</label>
                          <input
                            type="date"
                            value={formData.instructionDate}
                            onChange={(e) => handleChange('instructionDate', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Response Due Date</label>
                          <input
                            type="date"
                            value={formData.responseDueDate}
                            onChange={(e) => handleChange('responseDueDate', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Closure Date</label>
                          <input
                            type="date"
                            value={formData.closureDate}
                            onChange={(e) => handleChange('closureDate', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 3 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                          <select
                            value={formData.mainCategory}
                            onChange={(e) => handleChange('mainCategory', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          >
                            {RECORD_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Subcategory</label>
                          <select
                            value={formData.subcategory}
                            onChange={(e) => handleChange('subcategory', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          >
                            <option value="">Select subcategory</option>
                            {SUBCATEGORIES[formData.mainCategory]?.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Discipline</label>
                          <select
                            value={formData.discipline}
                            onChange={(e) => handleChange('discipline', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          >
                            {DISCIPLINES.map((disc) => (
                              <option key={disc} value={disc}>
                                {disc}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                          <select
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          >
                            {PRIORITIES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Open">Open</option>
                          <option value="In Review">In Review</option>
                          <option value="Pending Response">Pending Response</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </>
                  )}

                  {section.id === 4 && (
                    <>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasProgrammeImpact}
                            onChange={(e) => handleChange('hasProgrammeImpact', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-foreground">Has Programme Impact</span>
                        </label>
                        {formData.hasProgrammeImpact && (
                          <textarea
                            value={formData.programmeImpactDesc}
                            onChange={(e) => handleChange('programmeImpactDesc', e.target.value)}
                            placeholder="Describe programme impact..."
                            rows={2}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none text-sm"
                          />
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasCostImpact}
                            onChange={(e) => handleChange('hasCostImpact', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-foreground">Has Cost Impact</span>
                        </label>
                        {formData.hasCostImpact && (
                          <>
                            <textarea
                              value={formData.costImpactDesc}
                              onChange={(e) => handleChange('costImpactDesc', e.target.value)}
                              placeholder="Describe cost impact..."
                              rows={2}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none text-sm"
                            />
                            <input
                              type="number"
                              value={formData.estimatedAmount}
                              onChange={(e) => handleChange('estimatedAmount', parseFloat(e.target.value))}
                              placeholder="Estimated amount (JOD)"
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
                            />
                          </>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasClaimRisk}
                            onChange={(e) => handleChange('hasClaimRisk', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-foreground">Has Claim Risk</span>
                        </label>
                        {formData.hasClaimRisk && (
                          <>
                            <select
                              value={formData.claimRiskLevel}
                              onChange={(e) => handleChange('claimRiskLevel', e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
                            >
                              <option value="">Select risk level</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                            </select>
                            <textarea
                              value={formData.claimRiskNotes}
                              onChange={(e) => handleChange('claimRiskNotes', e.target.value)}
                              placeholder="Claim risk notes..."
                              rows={2}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none text-sm"
                            />
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {section.id === 5 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Responsible Party</label>
                        <select
                          value={formData.responsibleParty}
                          onChange={(e) => handleChange('responsibleParty', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="">Select responsible party</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.name}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Required Action</label>
                        <textarea
                          value={formData.requiredAction}
                          onChange={(e) => handleChange('requiredAction', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
                          placeholder="Describe the required action"
                        />
                      </div>
                      {formData.requiredAction && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Action Due Date</label>
                          <input
                            type="date"
                            value={formData.actionDueDate}
                            onChange={(e) => handleChange('actionDueDate', e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
          })}

          {/* Actions */}
          <div className="flex gap-4 sticky bottom-0 bg-gradient-to-r from-background to-background/95 backdrop-blur p-6 border-t border-border/50 shadow-lg rounded-t-xl">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-border/50 rounded-lg text-foreground hover:bg-secondary/70 animation-subtle font-semibold uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg font-bold animation-subtle uppercase tracking-wide shadow-lg"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
