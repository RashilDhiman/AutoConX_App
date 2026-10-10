export const INSPECTION_TYPE_CODES = [
  'PRE_PURCHASE',
  'PRE_SALE',
  'ROUTINE',
] as const;

export type InspectionTypeCode = (typeof INSPECTION_TYPE_CODES)[number];

export type InspectionType = {
  code: InspectionTypeCode;
  label: string;
  description: string;
};

export function isInspectionTypeCode(
  value: string,
): value is InspectionTypeCode {
  return INSPECTION_TYPE_CODES.some(code => code === value);
}
