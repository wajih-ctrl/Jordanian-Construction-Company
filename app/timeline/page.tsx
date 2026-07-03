'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { ImpactChip } from '@/components/shared/ImpactChip';
import { FileText, AlertCircle, CheckCircle, Clock, TrendingDown, DollarSign, Shield, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'issue' | 'instruction' | 'impact' | 'cost' | 'approval' | 'overdue' | 'closed';
  recordRef: string;
  recordId: string;
  impactLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  linkedItems: string[];
}

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    date: new Date('2026-05-10'),
    title: 'Site Issue Raised',
    description: 'Level 3 ceiling works blocked due to unresolved ductwork routing conflict. MEP contractor unable to proceed without revised drawings.',
    type: 'issue',
    recordRef: 'CORR-2026-001',
    recordId: 'rec-0001',
    impactLevel: 'Critical',
    linkedItems: ['EI-2026-015', 'DLY-2026-003'],
  },
  {
    id: 't2',
    date: new Date('2026-05-11'),
    title: 'Engineer Instruction Issued',
    description: 'Revised MEP routing instruction issued to the contractor with 48-hour turnaround required for updated shop drawings.',
    type: 'instruction',
    recordRef: 'EI-2026-015',
    recordId: 'rec-0002',
    impactLevel: 'High',
    linkedItems: ['CORR-2026-001', 'DLY-2026-003'],
  },
  {
    id: 't3',
    date: new Date('2026-05-12'),
    title: 'Programme Impact Identified',
    description: 'Planner flagged 7-day potential delay. Revised drawing review and MEP rework time identified as critical path activity. Escalated to project controls.',
    type: 'impact',
    recordRef: 'DLY-2026-003',
    recordId: 'rec-0003',
    impactLevel: 'High',
    linkedItems: ['EI-2026-015', 'VAR-2026-014'],
  },
  {
    id: 't4',
    date: new Date('2026-05-14'),
    title: 'Cost Impact Submitted',
    description: 'QS prepared cost impact for additional ductwork offsets, supports, supervision, and disruption allowance. Consultant approval remains pending.',
    type: 'cost',
    recordRef: 'CI-2026-011',
    recordId: 'rec-0005',
    impactLevel: 'High',
    linkedItems: ['VAR-2026-014', 'AP-2026-004'],
  },
  {
    id: 't5',
    date: new Date('2026-05-15'),
    title: 'Approval Pending',
    description: 'Consultant review of variation pending. Approval due within 5 working days per FIDIC conditions. Response status: Awaiting consultant sign-off.',
    type: 'approval',
    recordRef: 'AP-2026-004',
    recordId: 'rec-0006',
    impactLevel: 'Medium',
    linkedItems: ['VAR-2026-014', 'CR-2026-008'],
  },
  {
    id: 't6',
    date: new Date('2026-05-21'),
    title: 'Response Overdue',
    description: 'Consultant response exceeded 5 working day SLA by 2 days. Escalation initiated. Additional commercial risk identified due to delayed approval.',
    type: 'overdue',
    recordRef: 'AP-2026-004',
    recordId: 'rec-0006',
    impactLevel: 'Critical',
    linkedItems: ['CR-2026-008'],
  },
  {
    id: 't7',
    date: new Date('2026-05-24'),
    title: 'Action Closed',
    description: 'Revised MEP routing approval issued with linked variation and programme notes retained for the decision trail package.',
    type: 'closed',
    recordRef: 'AP-2026-004',
    recordId: 'rec-0006',
    impactLevel: 'Low',
    linkedItems: ['CORR-2026-001', 'EI-2026-015'],
  },
];

export default function TimelinePage() {
  const { records } = useApp();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set([MOCK_TIMELINE[0].id]));
  const [filterType, setFilterType] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [reportOpen, setReportOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEvents(newExpanded);
  };

  let filteredEvents = MOCK_TIMELINE;
  if (filterType !== 'all') {
    filteredEvents = filteredEvents.filter((e) => e.type === filterType);
  }
  if (filterImpact !== 'all') {
    filteredEvents = filteredEvents.filter((e) => e.impactLevel === filterImpact);
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return <AlertCircle className="w-5 h-5" />;
      case 'instruction':
        return <FileText className="w-5 h-5" />;
      case 'impact':
        return <TrendingDown className="w-5 h-5" />;
      case 'cost':
        return <DollarSign className="w-5 h-5" />;
      case 'approval':
        return <Clock className="w-5 h-5" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'issue':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'instruction':
        return 'text-violet-800 bg-violet-50 border-violet-200';
      case 'impact':
        return 'text-orange-800 bg-orange-50 border-orange-200';
      case 'cost':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'approval':
        return 'text-cyan-800 bg-cyan-50 border-cyan-200';
      case 'overdue':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'closed':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-800 bg-slate-50 border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <PageLayout title="Linked Records Timeline">
      <div className="p-6 space-y-6 overflow-auto">
        {/* Header - Premium */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-2">Project Event Timeline</h2>
          <p className="text-muted-foreground">Track all project decisions, issues, and impacts in chronological order</p>
        </div>

        {/* Instructions - Premium */}
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6 shadow-md">
          <p className="text-sm text-foreground leading-relaxed">
            Track the complete progression of a construction issue from initial raise through resolution. Each event is linked to the related records and shows cumulative impact.
          </p>
        </div>

        {/* Filters - Premium */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border/50 bg-gradient-to-r from-amber-500/5 to-transparent flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <p className="font-bold text-foreground text-lg">Filter Timeline</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Event Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                >
                  <option value="all">All Event Types</option>
                  <option value="issue">Site Issue</option>
                  <option value="instruction">Engineer Instruction</option>
                  <option value="impact">Programme Impact</option>
                  <option value="cost">Cost Impact</option>
                  <option value="approval">Approval</option>
                  <option value="overdue">Overdue</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Impact Level</label>
                <select
                  value={filterImpact}
                  onChange={(e) => setFilterImpact(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animation-subtle font-medium"
                >
                  <option value="all">All Impact Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <button onClick={() => setReportOpen(!reportOpen)} className="flex items-center gap-2 bg-gradient-to-r from-green-500/30 to-green-500/10 hover:from-green-500/40 hover:to-green-500/20 text-green-500 px-5 py-3 rounded-lg animation-subtle text-sm font-bold uppercase tracking-wide">
              <Download className="w-4 h-4" /> Generate Timeline Report
            </button>
            {reportOpen && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-foreground">
                Timeline report preview generated with {filteredEvents.length} events, linked records, impact levels, and closure notes.
              </div>
            )}
          </div>
        </div>

        {/* Timeline - Premium */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline Line */}
              {index < filteredEvents.length - 1 && (
                <div className="absolute left-8 top-14 bottom-4 w-px bg-slate-300/50 pointer-events-none"></div>
              )}

              {/* Timeline Event Card - Premium */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg animation-subtle shadow-md group">
                <div
                  onClick={() => toggleExpanded(event.id)}
                  className="p-5 cursor-pointer flex items-start gap-4 hover:bg-secondary/30 animation-subtle"
                >
                  {/* Timeline Dot - Premium */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 ${getTypeColor(
                      event.type
                    )} shadow-md group-hover:scale-110 animation-subtle`}
                  >
                    {getTypeIcon(event.type)}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-bold text-foreground text-lg">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-semibold">
                          {event.date.toLocaleDateString()} - <span className="font-mono text-primary">{event.recordRef}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <ImpactChip level={event.impactLevel} />
                        {expandedEvents.has(event.id) ? (
                          <ChevronUp className="w-5 h-5 text-primary animation-subtle group-hover:text-primary/80" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground animation-subtle group-hover:text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedEvents.has(event.id) && (
                  <div className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/20 p-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Description</p>
                      <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
                    </div>

                    {event.linkedItems.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Linked Records</p>
                        <div className="flex flex-wrap gap-2">
                          {event.linkedItems.map((item) => (
                            <Link
                              key={item}
                              href={`/records/${records.find((record) => record.reference === item)?.id || event.recordId}`}
                              className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold hover:bg-primary/30 transition-colors cursor-pointer"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/records/${event.recordId}`}
                        className="flex-1 px-3 py-2 bg-primary/20 text-primary rounded text-xs font-semibold hover:bg-primary/30 transition-colors text-center"
                      >
                        View Record
                      </Link>
                      <button
                        onClick={() => setNotes((prev) => ({ ...prev, [event.id]: prev[event.id] ? '' : 'Planner note added: retain this event in the decision trail package.' }))}
                        className="flex-1 px-3 py-2 bg-secondary text-foreground rounded text-xs font-semibold hover:bg-secondary/80 transition-colors"
                      >
                        {notes[event.id] ? 'Clear Note' : 'Add Note'}
                      </button>
                    </div>
                    {notes[event.id] && (
                      <div className="rounded-lg border border-border bg-background p-3 text-xs text-foreground">
                        {notes[event.id]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Timeline Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Events</p>
              <p className="text-2xl font-bold text-slate-950">{filteredEvents.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Critical Events</p>
              <p className="text-2xl font-bold text-red-800">
                {filteredEvents.filter((e) => e.impactLevel === 'Critical').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-2xl font-bold text-slate-950">
                {Math.ceil((filteredEvents[filteredEvents.length - 1].date.getTime() - filteredEvents[0].date.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-2xl font-bold text-emerald-800">Resolved</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
