import type { Record } from './types';

export const LINK_GROUPS = [
  { key: 'linkedVariations', label: 'Variation' },
  { key: 'linkedDelays', label: 'Delay' },
  { key: 'linkedInstructions', label: "Engineer's Instruction" },
  { key: 'linkedApprovals', label: 'Approval' },
  { key: 'linkedCostImpacts', label: 'Cost Impact' },
  { key: 'linkedProgrammeImpacts', label: 'Programme Impact' },
  { key: 'linkedClaimRisks', label: 'Claim Risk' },
  { key: 'linkedSiteIssues', label: 'Site Issue' },
  { key: 'linkedRFIs', label: 'RFI/Submittal' },
  { key: 'linkedNCRs', label: 'NCR/Quality' },
  { key: 'linkedProcurements', label: 'Procurement' },
  { key: 'linkedPayments', label: 'Payment' },
] as const;

export function getLinkedRecordGroups(record: Record, records: Record[]) {
  return LINK_GROUPS.map((group) => {
    const ids = [...new Set(record[group.key].filter((id) => id !== record.id))];
    return {
      ...group,
      records: ids
        .map((id) => records.find((item) => item.id === id))
        .filter((item): item is Record => Boolean(item)),
    };
  }).filter((group) => group.records.length > 0);
}

export function getLinkedRecordCount(record: Record) {
  return LINK_GROUPS.reduce((count, group) => {
    return count + new Set(record[group.key].filter((id) => id !== record.id)).size;
  }, 0);
}
