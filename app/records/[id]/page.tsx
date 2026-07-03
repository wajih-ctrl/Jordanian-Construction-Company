'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ImpactChip } from '@/components/shared/ImpactChip';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Link as LinkIcon, AlertTriangle, Users, MessageSquare, Edit, Trash2, Paperclip, History } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { RECORD_STATUSES, ACTION_STATUSES } from '@/lib/constants';
import { getLinkedRecordCount, getLinkedRecordGroups } from '@/lib/record-links';

export default function RecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;
  const { getRecordById, deleteRecord, updateRecord, currentUser, loading, records } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const record = getRecordById(recordId);

  if (!record) {
    return (
      <PageLayout title={loading ? 'Loading Record' : 'Record Not Found'}>
        <div className="p-6 text-center text-muted-foreground">
          {loading ? 'Loading record...' : 'Record not found'}
        </div>
      </PageLayout>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord(record.id);
      router.push('/records');
    }
  };

  const handleFieldUpdate = (field: 'status' | 'actionStatus' | 'requiredAction', value: string) => {
    updateRecord({ ...record, [field]: value, updatedAt: new Date() });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    updateRecord({
      ...record,
      comments: [
        ...record.comments,
        {
          id: `comment-${Date.now()}`,
          author: currentUser?.name || 'Demo User',
          text: commentText.trim(),
          createdAt: new Date(),
        },
      ],
      actionHistory: [
        ...record.actionHistory,
        {
          id: `history-${Date.now()}`,
          action: 'Comment added',
          performedBy: currentUser?.name || 'Demo User',
          timestamp: new Date(),
        },
      ],
      updatedAt: new Date(),
    });
    setCommentText('');
  };

  const totalLinks = getLinkedRecordCount(record);
  const linkedGroups = getLinkedRecordGroups(record, records);

  return (
    <PageLayout
      title={record.title}
      breadcrumbs={[
        { label: 'Records', href: '/records' },
        { label: record.reference, href: `/records/${record.id}` },
      ]}
    >
      <div className="p-6 space-y-6 overflow-auto">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-primary font-bold mb-2">{record.reference}</p>
              <h1 className="text-3xl font-bold text-foreground">{record.title}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditOpen(!editOpen)} className="p-3 hover:bg-secondary/70 animation-subtle rounded-lg transition-colors border border-border/50" title="Edit record">
                <Edit className="w-5 h-5 text-primary" />
              </button>
              <button onClick={handleDelete} className="p-3 hover:bg-destructive/10 animation-subtle rounded-lg transition-colors border border-border/50">
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <StatusBadge status={record.status} />
            <StatusBadge status={record.priority} type="priority" />
            {record.hasProgrammeImpact && <ImpactChip type="Programme" />}
            {record.hasCostImpact && <ImpactChip type="Cost" />}
            {record.hasClaimRisk && <ImpactChip type="Claim" />}
          </div>

          <p className="text-base text-foreground mb-4 leading-relaxed">{record.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-primary/20">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Sender</p>
              <p className="text-sm font-bold text-foreground">{record.sender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Receiver</p>
              <p className="text-sm font-bold text-foreground">{record.receiver}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Category</p>
              <p className="text-sm font-bold text-foreground">{record.mainCategory}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Discipline</p>
              <p className="text-sm font-bold text-foreground">{record.discipline}</p>
            </div>
          </div>
        </div>

        {editOpen && (
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-border/50">
              <h3 className="font-bold text-foreground text-lg">Edit Record Snapshot</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Record Status</label>
                <select value={record.status} onChange={(e) => handleFieldUpdate('status', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {RECORD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Action Status</label>
                <select value={record.actionStatus || 'Open'} onChange={(e) => handleFieldUpdate('actionStatus', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {ACTION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Required Action</label>
                <input value={record.requiredAction || ''} onChange={(e) => handleFieldUpdate('requiredAction', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Key Dates */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-500/5 to-transparent flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground text-lg">Key Dates</h3>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {record.dateReceived && (
              <div className="bg-background border border-border/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Date Received</p>
                <p className="text-sm font-bold text-foreground">{record.dateReceived.toLocaleDateString()}</p>
              </div>
            )}
            {record.eventDate && (
              <div className="bg-background border border-border/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Event Date</p>
                <p className="text-sm font-bold text-foreground">{record.eventDate.toLocaleDateString()}</p>
              </div>
            )}
            {record.responseDueDate && (
              <div className="bg-background border border-border/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Response Due</p>
                <p className="text-sm font-bold text-foreground">{record.responseDueDate.toLocaleDateString()}</p>
              </div>
            )}
            {record.closureDate && (
              <div className="bg-background border border-border/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Closure Date</p>
                <p className="text-sm font-bold text-foreground">{record.closureDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cross-Linked Records */}
        {totalLinks > 0 && (
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-border/50 bg-gradient-to-r from-green-500/5 to-transparent flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground text-lg">Linked Records ({totalLinks})</h3>
            </div>
            <div className="p-6 space-y-3">
              {linkedGroups.map((group) => (
                <div key={group.key}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{group.label}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.records.map((linkedRecord) => (
                      <Link
                        key={`${group.key}-${linkedRecord.id}`}
                        href={`/records/${linkedRecord.id}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs hover:border-slate-400 hover:bg-white"
                      >
                        <p className="font-mono font-bold text-slate-700">{linkedRecord.reference}</p>
                        <p className="mt-1 font-semibold text-slate-950">{linkedRecord.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Assessment */}
        {(record.hasProgrammeImpact || record.hasCostImpact || record.hasClaimRisk) && (
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-border/50 bg-gradient-to-r from-red-500/5 to-transparent flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground text-lg">Impact Assessment</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {record.hasProgrammeImpact && (
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm font-bold text-indigo-800 mb-1">Programme Impact</p>
                    <p className="text-sm text-foreground">{record.programmeImpactDesc}</p>
                  </div>
                )}
                {record.hasCostImpact && (
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm font-bold text-emerald-800 mb-1">Cost Impact</p>
                    <p className="text-sm text-foreground">{record.costImpactDesc}</p>
                    {record.estimatedAmount && (
                      <p className="text-sm font-semibold text-foreground mt-1">
                        Estimated: JOD {record.estimatedAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
                {record.hasClaimRisk && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-red-800">Claim Risk</p>
                      {record.claimRiskLevel && <StatusBadge status={record.claimRiskLevel} />}
                    </div>
                    <p className="text-sm text-foreground">{record.claimRiskNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Responsibility & Action */}
        {(record.responsibleParty || record.requiredAction) && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Responsibility & Action
            </h3>
            <div className="space-y-3">
              {record.responsibleParty && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Responsible Party</p>
                  <p className="text-sm font-medium text-foreground">{record.responsibleParty}</p>
                </div>
              )}
              {record.requiredAction && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Required Action</p>
                  <p className="text-sm text-foreground">{record.requiredAction}</p>
                </div>
              )}
              {record.actionStatus && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <StatusBadge status={record.actionStatus} />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Paperclip className="w-5 h-5" />
              Mock Attachments
            </h3>
            <div className="space-y-3">
              {record.attachments.map((file) => (
                <div key={file.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-950">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {file.type} - {(file.size / 1000).toFixed(0)} KB - Uploaded by {file.uploadedBy} on {file.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              <p className="text-xs text-slate-500">Mock files only. No real storage or upload is connected in this prototype.</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Action History
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Record created', by: record.createdBy, date: record.createdAt },
                { label: record.actionStatus ? `Action status: ${record.actionStatus}` : 'Awaiting action assignment', by: record.responsibleParty || 'Project team', date: record.updatedAt },
                ...record.actionHistory.map((item) => ({ label: item.action, by: item.performedBy, date: item.timestamp })),
              ].map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.by} - {item.date.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Activity & Comments ({record.comments.length})
          </h3>
          <div className="space-y-3">
            {record.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            ) : (
              record.comments.map((comment) => (
                <div key={comment.id} className="bg-background p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-foreground">{comment.text}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none text-sm"
            />
            <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors text-sm">
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
