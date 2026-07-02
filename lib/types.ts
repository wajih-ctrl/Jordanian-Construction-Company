// User & Auth
export type UserRole = 'PM' | 'DC' | 'PT' | 'CT' | 'CE' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

// Project
export type ProjectStatus = 'Active' | 'At Risk' | 'Monitoring' | 'Closed';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  contact?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  contractType: string;
  location: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  totalRecords: number;
  openActions: number;
  overdueItems: number;
  costImpactRecords: number;
  programmeImpactRecords: number;
  claimRiskItems: number;
  lastActivity: Date;
  stakeholders: Stakeholder[];
}

// Record Categories & Classifications
export type RecordCategory =
  | 'Progress'
  | 'Variation'
  | 'Claim'
  | 'Delay'
  | 'Instruction'
  | 'Approval'
  | 'Correspondence'
  | 'Risk'
  | 'Cost Impact'
  | 'Programme Impact'
  | 'Claim Risk'
  | 'Site Issue'
  | 'Quality/NCR'
  | 'RFI/Submittal'
  | 'Procurement'
  | 'Payment';

export type Discipline =
  | 'Civil'
  | 'MEP'
  | 'Architectural'
  | 'Planning'
  | 'Commercial'
  | 'Procurement'
  | 'QA/QC'
  | 'Site Management'
  | 'Contract Administration';

export type RecordStatus =
  | 'Draft'
  | 'Open'
  | 'In Review'
  | 'Pending Response'
  | 'Closed'
  | 'Archived';

export type RecordPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ActionStatus =
  | 'Open'
  | 'Pending Review'
  | 'Waiting for Response'
  | 'Overdue'
  | 'Closed'
  | 'Escalated';

export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

// Attachment
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Comment
export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

// Action History
export interface ActionHistoryItem {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  previousValue?: string;
  newValue?: string;
}

// Core Record Entity
export interface Record {
  id: string;
  reference: string;
  title: string;
  projectId: string;

  // Basic info
  sender: string;
  receiver: string;
  dateReceived: Date;
  description: string;

  // Classification
  mainCategory: RecordCategory;
  subcategory: string;
  discipline: Discipline;
  priority: RecordPriority;
  status: RecordStatus;

  // Key dates
  eventDate?: Date;
  instructionDate?: Date;
  responseDueDate?: Date;
  closureDate?: Date;

  // Multi-linking (CORE FEATURE)
  linkedVariations: string[];
  linkedDelays: string[];
  linkedInstructions: string[];
  linkedApprovals: string[];
  linkedCostImpacts: string[];
  linkedProgrammeImpacts: string[];
  linkedClaimRisks: string[];
  linkedSiteIssues: string[];
  linkedRFIs: string[];
  linkedNCRs: string[];
  linkedProcurements: string[];
  linkedPayments: string[];

  // Impact assessment
  hasProgrammeImpact: boolean;
  programmeImpactDesc?: string;
  hasCostImpact: boolean;
  costImpactDesc?: string;
  estimatedAmount?: number;
  hasClaimRisk: boolean;
  claimRiskLevel?: ImpactLevel;
  claimRiskNotes?: string;

  // Responsibility & action
  responsibleParty?: string;
  requiredAction?: string;
  actionDueDate?: Date;
  actionStatus?: ActionStatus;
  nextStep?: string;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  comments: Comment[];
  actionHistory: ActionHistoryItem[];
}

// Required Action
export interface RequiredAction {
  id: string;
  title: string;
  recordId: string;
  projectId: string;
  responsiblePerson: string;
  dueDate: Date;
  priority: RecordPriority;
  status: ActionStatus;
  impactType: 'Programme' | 'Cost' | 'Claim' | 'Quality' | 'Safety';
  nextStep: string;
  linkedRecord: Record;
}

// Programme Impact
export interface ProgrammeImpact {
  id: string;
  recordId: string;
  projectId: string;
  delayReason: string;
  eventDate: Date;
  programmeUpdateRef: string;
  responsibleParty: string;
  potentialTimeImpact: string;
  responseDueDate: Date;
  status: 'Identified' | 'Under Review' | 'Mitigating' | 'Resolved';
  linkedRecords: Record[];
}

// Cost Impact / Claim Risk
export interface CostImpact {
  id: string;
  recordId: string;
  projectId: string;
  costImpactType: string;
  estimatedAmount: number;
  variationRef?: string;
  claimRiskLevel: ImpactLevel;
  supportingRecords: Record[];
  responsibleParty: string;
  requiredAction: string;
  status: 'Identified' | 'Claimed' | 'Agreed' | 'Disputed' | 'Closed';
}
