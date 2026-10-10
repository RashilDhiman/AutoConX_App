import { InspectionType } from '../types';

export const INSPECTION_FIXTURE: InspectionType[] = [
  {
    code: 'PRE_PURCHASE',
    label: 'Pre-purchase',
    description: 'Independent check before you buy.',
  },
  {
    code: 'PRE_SALE',
    label: 'Pre-sale',
    description: 'Condition report before you sell.',
  },
  {
    code: 'ROUTINE',
    label: 'Routine',
    description: 'Scheduled look at the vehicle.',
  },
];

export function inspectionLabel(code: string) {
  return (
    INSPECTION_FIXTURE.find(type => type.code === code)?.label ?? code
  );
}
