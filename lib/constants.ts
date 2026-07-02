import type { RecordCategory, Discipline, RecordStatus, RecordPriority, UserRole, ActionStatus } from './types';

export const USER_ROLES: { label: string; value: UserRole; description: string }[] = [
  { value: 'PM', label: 'Project Manager', description: 'Oversees project records and decisions' },
  { value: 'DC', label: 'Document Controller', description: 'Logs correspondence, tags records, and maintains the register' },
  { value: 'PT', label: 'Planning / Programme', description: 'Reviews delay events and schedule impact' },
  { value: 'CT', label: 'Commercial / QS', description: 'Reviews cost impact, variations, and claim risk' },
  { value: 'CE', label: 'Consultant / Engineer', description: 'Reviews instructions, approvals, and compliance' },
  { value: 'ADMIN', label: 'Administrator', description: 'System administration' },
];

export const RECORD_CATEGORIES: RecordCategory[] = [
  'Progress',
  'Variation',
  'Claim',
  'Delay',
  'Instruction',
  'Approval',
  'Correspondence',
  'Risk',
  'Cost Impact',
  'Programme Impact',
  'Claim Risk',
  'Site Issue',
  'Quality/NCR',
  'RFI/Submittal',
  'Procurement',
  'Payment',
];

export const DISCIPLINES: Discipline[] = [
  'Civil',
  'MEP',
  'Architectural',
  'Planning',
  'Commercial',
  'Procurement',
  'QA/QC',
  'Site Management',
  'Contract Administration',
];

export const RECORD_STATUSES: RecordStatus[] = [
  'Draft',
  'Open',
  'In Review',
  'Pending Response',
  'Closed',
  'Archived',
];

export const ACTION_STATUSES: ActionStatus[] = [
  'Open',
  'Pending Review',
  'Waiting for Response',
  'Overdue',
  'Closed',
  'Escalated',
];

export const PRIORITIES: RecordPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const STATUS_COLORS: Record<string, string> = {
  // Record/Action statuses
  Draft: 'bg-gray-500',
  Open: 'bg-blue-500',
  'In Review': 'bg-purple-500',
  'Pending Response': 'bg-yellow-500',
  'Pending Review': 'bg-yellow-500',
  'Waiting for Response': 'bg-orange-500',
  Closed: 'bg-green-500',
  Archived: 'bg-gray-600',
  Overdue: 'bg-red-500',
  Escalated: 'bg-red-600',

  // Project statuses
  Active: 'bg-green-500',
  'At Risk': 'bg-red-500',
  Monitoring: 'bg-yellow-500',

  // Impact levels
  Identified: 'bg-blue-500',
  'Under Review': 'bg-yellow-500',
  Mitigating: 'bg-orange-500',
  Resolved: 'bg-green-500',
  Claimed: 'bg-purple-500',
  Agreed: 'bg-green-500',
  Disputed: 'bg-red-500',
};

export const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-gray-500',
  Medium: 'bg-blue-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
};

export const IMPACT_COLORS: Record<string, string> = {
  Programme: 'bg-purple-500',
  Cost: 'bg-green-500',
  Claim: 'bg-red-500',
  Quality: 'bg-yellow-500',
  Safety: 'bg-red-600',
};

export const ROLE_ROUTE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    '/dashboard',
    '/projects',
    '/records',
    '/linking',
    '/timeline',
    '/actions',
    '/programme',
    '/cost-impact',
    '/search',
    '/reports',
    '/admin',
  ],
  PM: ['/dashboard', '/projects', '/records', '/linking', '/timeline', '/actions', '/search', '/reports'],
  DC: ['/dashboard', '/records', '/search'],
  PT: ['/dashboard', '/timeline', '/programme', '/search'],
  CT: ['/dashboard', '/cost-impact', '/search', '/reports'],
  CE: ['/dashboard', '/linking', '/search', '/reports'],
};

export const SUBCATEGORIES: Record<RecordCategory, string[]> = {
  Progress: ['Progress Report', 'Programme Update', 'Site Progress Record'],
  Variation: [
    'Drawing/Spec Variation',
    'Quantity Change',
    'Scope Addition',
    'Cost Adjustment',
  ],
  Claim: ['Claim Notice', 'Time Claim', 'Cost Claim', 'Claim Correspondence'],
  Delay: ['Delay Issue', 'Approval/Procurement Delay', 'Design Delay', 'Site Access Delay'],
  Instruction: ["Engineer's Instruction", 'Design Instruction', 'Quality Instruction', 'Schedule Instruction'],
  Approval: ['Drawing Approval', 'Material Approval', 'Method Statement Approval', 'Procurement Approval'],
  Correspondence: ['Formal Letter', 'Meeting Minutes', 'Email Record', 'Transmittal'],
  Risk: ['Commercial Risk', 'Programme Risk', 'Compliance Risk', 'Contractual Risk'],
  'Cost Impact': ['Additional Cost', 'Budget Variance', 'Variation Cost', 'Cost Claim'],
  'Programme Impact': ['Critical Path Impact', 'Programme Update', 'Acceleration Needed', 'Time Impact'],
  'Claim Risk': ['Contractual Dispute', 'Notice Risk', 'Financial Claim', 'Time Claim'],
  'Site Issue': ['MEP/Civil/Architectural Issue', 'Site Record', 'Corrective Action', 'Defect'],
  'Quality/NCR': ['NCR Follow-up', 'Non-Conformance', 'Defect Report', 'Quality Issue'],
  'RFI/Submittal': ['Design Clarification', 'Technical Query', 'Specification Issue', 'Submittal Response'],
  Procurement: ['Procurement Delay', 'Material Approval Delay', 'Vendor Issue', 'Supply Chain'],
  Payment: ['Payment Issue', 'Invoice', 'Interim Payment', 'Payment Dispute'],
};

export const SAMPLE_SENDERS = [
  'Main Contractor',
  'Design Consultant',
  'Client Representative',
  'Sub-Contractor',
  'Material Supplier',
  'Quality Team',
  'Project Manager',
];

export const SAMPLE_RECEIVERS = [
  'Project Manager',
  'Design Team',
  'Site Manager',
  'Contractor',
  'Client',
  'Quality Team',
  'Commercial Team',
];
