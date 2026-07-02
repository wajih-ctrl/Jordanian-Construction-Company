import type {
  User,
  Project,
  Record,
  RequiredAction,
  ProgrammeImpact,
  CostImpact,
  Stakeholder,
} from './types';
import {
  USER_ROLES,
  RECORD_CATEGORIES,
  DISCIPLINES,
  PRIORITIES,
  SUBCATEGORIES,
  SAMPLE_SENDERS,
  SAMPLE_RECEIVERS,
} from './constants';

const generateId = () => Math.random().toString(36).substring(2, 11);
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomItems = <T,>(arr: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array.from({ length: count }, () => randomItem(arr));
};

// Users
export function generateMockUsers(): User[] {
  const roleDescriptions = {
    PM: 'Oversees project records and decisions',
    DC: 'Logs, tags, and routes correspondence',
    PT: 'Reviews delay and schedule impact',
    CT: 'Reviews cost impact and claim risk',
    CE: 'Reviews instructions and approvals',
    ADMIN: 'System administration',
  };

  return [
    { id: '1', name: 'Ahmed Al-Rashid', role: 'PM', email: 'ahmed.rashid@construct.jo', avatar: '👨‍💼' },
    { id: '2', name: 'Fatima Al-Manaseer', role: 'DC', email: 'fatima.manaseer@construct.jo', avatar: '👩‍🔬' },
    { id: '3', name: 'Mohammed Al-Dajani', role: 'PT', email: 'mohammed.dajani@construct.jo', avatar: '👨‍🔧' },
    { id: '4', name: 'Aisha Al-Masri', role: 'CT', email: 'aisha.masri@construct.jo', avatar: '👩‍⚖️' },
    { id: '5', name: 'Hassan Al-Omari', role: 'CE', email: 'hassan.omari@construct.jo', avatar: '👨‍🏫' },
    { id: '6', name: 'Layla Al-Zu\'bi', role: 'ADMIN', email: 'layla.zubi@construct.jo', avatar: '👩‍💻' },
  ];
}

// Projects
export function generateMockProjects(): Project[] {
  const projects: Project[] = [
    {
      id: 'p1',
      name: 'Amman Business Tower',
      client: 'Al-Faisaliah Investment',
      contractType: 'FIDIC Pink - Design Build',
      location: 'Amman, Jordan',
      status: 'Active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2026-03-31'),
      totalRecords: 47,
      openActions: 12,
      overdueItems: 3,
      costImpactRecords: 8,
      programmeImpactRecords: 5,
      claimRiskItems: 2,
      lastActivity: new Date(),
      stakeholders: [
        { id: 's1', name: 'Ahmed Al-Rashid', role: 'Project Manager' },
        { id: 's2', name: 'Fatima Al-Manaseer', role: 'Design Lead' },
        { id: 's3', name: 'Mohammed Al-Dajani', role: 'Quality Manager' },
      ],
    },
    {
      id: 'p2',
      name: 'Aqaba Marina Resort',
      client: 'Beach Development Corp',
      contractType: 'FIDIC Yellow - Lump Sum',
      location: 'Aqaba, Jordan',
      status: 'At Risk',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2025-12-15'),
      totalRecords: 62,
      openActions: 18,
      overdueItems: 8,
      costImpactRecords: 15,
      programmeImpactRecords: 12,
      claimRiskItems: 6,
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      stakeholders: [
        { id: 's4', name: 'Hassan Al-Omari', role: 'Civil Engineer' },
        { id: 's5', name: 'Aisha Al-Masri', role: 'Contracts Manager' },
      ],
    },
    {
      id: 'p3',
      name: 'Irbid Hospital Extension',
      client: 'Ministry of Health',
      contractType: 'FIDIC Green - Cost Plus',
      location: 'Irbid, Jordan',
      status: 'Monitoring',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-09-30'),
      totalRecords: 34,
      openActions: 7,
      overdueItems: 1,
      costImpactRecords: 4,
      programmeImpactRecords: 2,
      claimRiskItems: 1,
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      stakeholders: [
        { id: 's6', name: 'Layla Al-Zu\'bi', role: 'Administrator' },
        { id: 's7', name: 'Ahmed Al-Rashid', role: 'Project Manager' },
      ],
    },
    {
      id: 'p4',
      name: 'Dead Sea Spa Complex',
      client: 'Luxury Hospitality Ltd',
      contractType: 'FIDIC Red - Admeasurement',
      location: 'Dead Sea, Jordan',
      status: 'Closed',
      startDate: new Date('2022-09-01'),
      endDate: new Date('2024-06-30'),
      totalRecords: 89,
      openActions: 0,
      overdueItems: 0,
      costImpactRecords: 22,
      programmeImpactRecords: 8,
      claimRiskItems: 3,
      lastActivity: new Date('2024-06-25'),
      stakeholders: [
        { id: 's8', name: 'Mohammed Al-Dajani', role: 'Quality Manager' },
      ],
    },
  ];

  return projects;
}

// Records
export function generateMockRecords(projectCount: number = 4): Record[] {
  const records: Record[] = [];
  const projects = generateMockProjects();
  const users = generateMockUsers();
  const categoryList = RECORD_CATEGORIES;

  for (let i = 0; i < 50; i++) {
    const project = projects[Math.floor(i / 13)];
    const mainCategory = randomItem(categoryList);
    const subcategories = SUBCATEGORIES[mainCategory] || [];
    const discipline = randomItem(DISCIPLINES);
    const priority = randomItem(PRIORITIES);
    const createdDate = randomDate(project.startDate, new Date());
    const dateReceived = randomDate(project.startDate, new Date());

    const record: Record = {
      id: `rec-${String(i + 1).padStart(4, '0')}`,
      reference: `CORR-${new Date(dateReceived).getFullYear()}-${String(i + 1).padStart(3, '0')}`,
      title: [
        'RFI - MEP Coordination Issue',
        'Variation - Additional MEP Installation',
        'Delay - Material Shortage',
        'Instruction - Design Change',
        'Cost Claim - Additional Work',
        'NCR - Concrete Strength Test',
        'Programme Impact - Weather Delay',
        'Approval - Shop Drawings',
        'Payment - Invoice Processing',
        'Quality Issue - Finish Standard',
        'Safety Issue - Site Inspection',
        'Procurement - Steel Delivery',
      ][i % 12],
      projectId: project.id,

      // Basic info
      sender: randomItem(SAMPLE_SENDERS),
      receiver: randomItem(SAMPLE_RECEIVERS),
      dateReceived,
      description:
        'This is a detailed correspondence description explaining the nature of the record, its context, and required actions. Multiple paragraphs may be included.',

      // Classification
      mainCategory,
      subcategory: randomItem(subcategories),
      discipline,
      priority,
      status: randomItem(['Draft', 'Open', 'In Review', 'Pending Response', 'Closed']),

      // Key dates
      eventDate: randomDate(project.startDate, new Date()),
      instructionDate: Math.random() > 0.5 ? randomDate(project.startDate, new Date()) : undefined,
      responseDueDate: randomDate(new Date(), project.endDate),
      closureDate: Math.random() > 0.6 ? randomDate(dateReceived, new Date()) : undefined,

      // Multi-linking (will be populated after all records created)
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

      // Impact assessment
      hasProgrammeImpact: Math.random() > 0.7,
      programmeImpactDesc: Math.random() > 0.7 ? 'Potential 2-week delay impact' : undefined,
      hasCostImpact: Math.random() > 0.65,
      costImpactDesc: Math.random() > 0.65 ? 'Estimated cost increase required' : undefined,
      estimatedAmount: Math.random() > 0.7 ? Math.floor(Math.random() * 500000) + 10000 : undefined,
      hasClaimRisk: Math.random() > 0.8,
      claimRiskLevel: Math.random() > 0.8 ? randomItem(['Low', 'Medium', 'High']) : undefined,
      claimRiskNotes: Math.random() > 0.85 ? 'Requires further documentation' : undefined,

      // Responsibility & action
      responsibleParty: randomItem(users).name,
      requiredAction: Math.random() > 0.5 ? 'Provide response with supporting documents' : undefined,
      actionDueDate: randomDate(new Date(), project.endDate),
      actionStatus: randomItem(['Open', 'Pending Review', 'Waiting for Response', 'Closed']),
      nextStep: 'Await response from consultant',

      // Metadata
      createdBy: randomItem(users).name,
      createdAt: createdDate,
      updatedAt: randomDate(createdDate, new Date()),
      attachments: [],
      comments: [],
      actionHistory: [],
    };

    records.push(record);
  }

  // Cross-link some records
  for (let i = 0; i < records.length; i++) {
    const potentialLinks = records.filter((r) => r.projectId === records[i].projectId && r.id !== records[i].id);
    const linkCount = Math.floor(Math.random() * 3);

    for (let j = 0; j < linkCount; j++) {
      const linkedRecord = randomItem(potentialLinks);
      if (linkedRecord.mainCategory === 'Variation') {
        records[i].linkedVariations.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Delay') {
        records[i].linkedDelays.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Instruction') {
        records[i].linkedInstructions.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Approval') {
        records[i].linkedApprovals.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Cost Impact') {
        records[i].linkedCostImpacts.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Programme Impact') {
        records[i].linkedProgrammeImpacts.push(linkedRecord.id);
      } else if (linkedRecord.mainCategory === 'Claim Risk') {
        records[i].linkedClaimRisks.push(linkedRecord.id);
      }
    }
  }

  return records;
}

// Required Actions
export function generateMockActions(records: Record[]): RequiredAction[] {
  const actions: RequiredAction[] = [];
  const users = generateMockUsers();
  const statuses: RequiredAction['status'][] = ['Open', 'Pending Review', 'Waiting for Response', 'Overdue', 'Closed', 'Escalated'];

  const recordsWithActions = records.filter((r) => r.actionStatus);

  for (let i = 0; i < Math.min(20, recordsWithActions.length); i++) {
    const record = recordsWithActions[i];
    const project = generateMockProjects().find((p) => p.id === record.projectId);

    actions.push({
      id: `act-${String(i + 1).padStart(4, '0')}`,
      title: record.requiredAction || 'Action Required',
      recordId: record.id,
      projectId: record.projectId,
      responsiblePerson: record.responsibleParty || randomItem(users).name,
      dueDate: record.actionDueDate || new Date(),
      priority: record.priority,
      status: i === 0 ? 'Escalated' : ((record.actionStatus || randomItem(statuses)) as any),
      impactType: randomItem(['Programme', 'Cost', 'Claim', 'Quality', 'Safety']),
      nextStep: record.nextStep || 'Awaiting response',
      linkedRecord: record,
    });
  }

  return actions;
}

// Programme Impacts
export function generateMockProgrammeImpacts(records: Record[]): ProgrammeImpact[] {
  const impacts: ProgrammeImpact[] = [];
  const recordsWithImpact = records.filter((r) => r.hasProgrammeImpact);

  for (let i = 0; i < Math.min(10, recordsWithImpact.length); i++) {
    const record = recordsWithImpact[i];

    impacts.push({
      id: `prog-${String(i + 1).padStart(4, '0')}`,
      recordId: record.id,
      projectId: record.projectId,
      delayReason: record.programmeImpactDesc || 'Unforeseen delay',
      eventDate: record.eventDate || new Date(),
      programmeUpdateRef: `PROG-${new Date().getFullYear()}-${String(i + 1).padStart(3, '0')}`,
      responsibleParty: record.responsibleParty || 'To be assigned',
      potentialTimeImpact: `${Math.floor(Math.random() * 15) + 1} days`,
      responseDueDate: record.responseDueDate || new Date(),
      status: randomItem(['Identified', 'Under Review', 'Mitigating', 'Resolved']),
      linkedRecords: [record],
    });
  }

  return impacts;
}

// Cost Impacts
export function generateMockCostImpacts(records: Record[]): CostImpact[] {
  const impacts: CostImpact[] = [];
  const recordsWithCost = records.filter((r) => r.hasCostImpact);

  for (let i = 0; i < Math.min(8, recordsWithCost.length); i++) {
    const record = recordsWithCost[i];

    impacts.push({
      id: `cost-${String(i + 1).padStart(4, '0')}`,
      recordId: record.id,
      projectId: record.projectId,
      costImpactType: record.costImpactDesc || 'Additional cost',
      estimatedAmount: record.estimatedAmount || Math.floor(Math.random() * 300000) + 20000,
      variationRef: randomItem(['VAR-001', 'VAR-002', 'VAR-003', 'CLAIM-001', undefined]),
      claimRiskLevel: record.claimRiskLevel || randomItem(['Low', 'Medium', 'High']),
      supportingRecords: [record],
      responsibleParty: record.responsibleParty || 'Commercial Team',
      requiredAction: 'Submit detailed cost justification',
      status: randomItem(['Identified', 'Claimed', 'Agreed', 'Disputed', 'Closed']),
    });
  }

  return impacts;
}
