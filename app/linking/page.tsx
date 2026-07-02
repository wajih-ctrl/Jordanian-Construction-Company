'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import { Link as LinkIcon, Plus, X, ArrowRight, Check } from 'lucide-react';

type LinkType = 'variation' | 'delay' | 'instruction' | 'approval' | 'costImpact' | 'programmeImpact' | 'claimRisk' | 'siteIssue' | 'rfi' | 'ncr' | 'procurement' | 'payment';

const LINK_TYPES: { id: LinkType; label: string; color: string }[] = [
  { id: 'variation', label: 'Variation', color: 'bg-sky-50 text-sky-900 border-sky-200' },
  { id: 'delay', label: 'Delay', color: 'bg-rose-50 text-rose-900 border-rose-200' },
  { id: 'instruction', label: "Engineer's Instruction", color: 'bg-violet-50 text-violet-900 border-violet-200' },
  { id: 'approval', label: 'Approval', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  { id: 'costImpact', label: 'Cost Impact', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { id: 'programmeImpact', label: 'Programme Impact', color: 'bg-orange-50 text-orange-900 border-orange-200' },
  { id: 'claimRisk', label: 'Claim Risk', color: 'bg-pink-50 text-pink-900 border-pink-200' },
  { id: 'siteIssue', label: 'Site Issue', color: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
  { id: 'rfi', label: 'RFI/Submittal', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
  { id: 'ncr', label: 'NCR/Quality', color: 'bg-teal-50 text-teal-900 border-teal-200' },
  { id: 'procurement', label: 'Procurement', color: 'bg-purple-50 text-purple-900 border-purple-200' },
  { id: 'payment', label: 'Payment', color: 'bg-lime-50 text-lime-900 border-lime-200' },
];

const MOCK_LINKED_SUBJECTS = [
  { id: 'VAR-014', type: 'variation' as LinkType, title: 'MEP Layout Revision - Additional Ductwork', impact: 'High' },
  { id: 'DLY-006', type: 'delay' as LinkType, title: 'Late MEP Drawing Approval', impact: 'Critical' },
  { id: 'EI-032', type: 'instruction' as LinkType, title: "Engineer's Instruction - Revised Routing", impact: 'High' },
  { id: 'CI-011', type: 'costImpact' as LinkType, title: 'Additional Ductwork Labour Cost', impact: 'Medium' },
  { id: 'PRG-007', type: 'programmeImpact' as LinkType, title: 'Programme Update Rev. 07 - 7 Day Delay', impact: 'High' },
  { id: 'CR-008', type: 'claimRisk' as LinkType, title: 'Medium Claim Risk - Variation Scope', impact: 'Medium' },
  { id: 'AP-004', type: 'approval' as LinkType, title: 'Approval Pending - Consultant Review', impact: 'Medium' },
];

interface SelectedLink {
  id: string;
  type: LinkType;
  title: string;
  impact: string;
}

export default function LinkingPage() {
  const { records, selectedProject } = useApp();
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records.find(r => r.projectId === selectedProject?.id)?.id || '');
  const [selectedLinks, setSelectedLinks] = useState<SelectedLink[]>([...MOCK_LINKED_SUBJECTS]);
  const [newLinkType, setNewLinkType] = useState<LinkType>('variation');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const projectRecords = records.filter((r) => r.projectId === selectedProject?.id);
  const selectedRecord = projectRecords.find((r) => r.id === selectedRecordId);

  const handleAddLink = () => {
    if (newLinkType) {
      const mockReference = `${newLinkType.toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      const newLink: SelectedLink = {
        id: mockReference,
        type: newLinkType,
        title: `New ${LINK_TYPES.find(l => l.id === newLinkType)?.label} Link`,
        impact: 'Medium',
      };
      setSelectedLinks([...selectedLinks, newLink]);
      setNewLinkType('variation');
      setShowAddForm(false);
    }
  };

  const handleRemoveLink = (id: string) => {
    setSelectedLinks(selectedLinks.filter((link) => link.id !== id));
  };

  const handleSaveLinks = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PageLayout title="Tagging & Cross-Linking">
      <div className="p-6 space-y-6 overflow-auto">
        {/* Instructions - Premium */}
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6 shadow-md">
          <p className="text-sm text-foreground flex items-start gap-3">
            <LinkIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="font-semibold">One record can connect to multiple subjects simultaneously. Select a record and manage its links below.</span>
          </p>
        </div>

        {/* Record Selector - Premium */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
            <label className="block text-sm font-bold text-foreground uppercase tracking-wide">Select Record</label>
          </div>
          <div className="p-6">
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium animation-subtle"
            >
              {projectRecords.map((record) => (
                <option key={record.id} value={record.id}>
                  {record.reference} - {record.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRecord && (
          <>
            {/* Selected Record Summary - Premium */}
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
              <div className="p-5 border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-transparent">
                <h2 className="font-bold text-foreground text-lg">Record Summary</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Reference</p>
                  <p className="font-bold text-foreground">{selectedRecord.reference}</p>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Title</p>
                  <p className="font-bold text-foreground">{selectedRecord.title}</p>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Sender</p>
                  <p className="font-bold text-foreground">{selectedRecord.sender}</p>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Category</p>
                  <p className="font-bold text-foreground">{selectedRecord.mainCategory}</p>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedRecord.status} />
                  </div>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Discipline</p>
                  <p className="font-bold text-foreground">{selectedRecord.discipline}</p>
                </div>
              </div>
            </div>

            {/* Linked Subjects - Premium */}
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
              <div className="p-5 border-b border-border/50 bg-gradient-to-r from-purple-500/5 to-transparent flex items-center justify-between">
                <h2 className="font-bold text-foreground text-lg">Linked Subjects ({selectedLinks.length})</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-4 py-2 rounded-lg animation-subtle text-sm font-bold uppercase tracking-wide shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Link
                </button>
              </div>

              {/* Add Link Form */}
              {showAddForm && (
                <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Select link type:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {LINK_TYPES.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => setNewLinkType(link.id)}
                        className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                          newLinkType === link.id ? `${link.color} ring-2 ring-slate-950` : `${link.color} hover:bg-white`
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddLink}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold"
                    >
                      <Plus className="w-4 h-4" /> Confirm Link
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Links Grid */}
              {selectedLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedLinks.map((link) => {
                    const linkTypeInfo = LINK_TYPES.find((lt) => lt.id === link.type);
                    return (
                      <div
                        key={link.id}
                        className={`p-4 rounded-xl border shadow-sm hover:border-slate-400 transition-colors ${linkTypeInfo?.color}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{link.id}</p>
                            <p className="text-xs opacity-80 mt-1 truncate">{link.title}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveLink(link.id)}
                            className="flex-shrink-0 p-1 hover:bg-white/80 rounded transition-colors"
                            title="Remove link"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/20">
                          <span className="text-xs font-semibold">{linkTypeInfo?.label}</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            link.impact === 'Critical' ? 'bg-red-100 text-red-900' : link.impact === 'High' ? 'bg-orange-100 text-orange-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {link.impact}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-6 text-center border border-dashed border-border">
                  <LinkIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No linked subjects yet. Add one to get started.</p>
                </div>
              )}
            </div>

            {/* Save Button & Success Message */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveLinks}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-bold"
              >
                <Check className="w-5 h-5" /> Save Links
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-semibold">Links saved successfully!</span>
                </div>
              )}
            </div>

            {/* Relationship Map */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Relationship Map</h2>
              <div className="bg-secondary/50 rounded p-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="bg-primary/20 border border-primary rounded px-4 py-2 inline-block">
                      <p className="font-semibold text-foreground text-sm">{selectedRecord.reference}</p>
                      <p className="text-xs text-muted-foreground">{selectedRecord.mainCategory}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex-1 h-0.5 bg-border"></div>
                  <LinkIcon className="w-5 h-5 text-primary mx-2" />
                  <div className="flex-1 h-0.5 bg-border"></div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedLinks.map((link) => {
                    const linkTypeInfo = LINK_TYPES.find((lt) => lt.id === link.type);
                    return (
                      <div key={link.id} className="text-center">
                        <div className={`${linkTypeInfo?.color} rounded px-2 py-1 inline-block`}>
                          <p className="font-semibold text-xs">{link.id}</p>
                          <p className="text-xs opacity-80">{linkTypeInfo?.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
