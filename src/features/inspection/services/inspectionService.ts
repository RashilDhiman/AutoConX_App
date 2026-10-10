import { z } from 'zod';

import { ServiceError } from '../../../services/serviceError';
import { delay } from '../../../utils/delay';
import { INSPECTION_FIXTURE } from '../data/inspectionFixture';
import { InspectionType, isInspectionTypeCode } from '../types';

const inspectionListSchema = z
  .array(
    z.object({
      code: z.string().refine(isInspectionTypeCode, 'Unknown inspection type.'),
      label: z.string().min(1),
      description: z.string().min(1),
    }),
  )
  .min(1);

export function readInspectionTypes(payload: unknown): InspectionType[] {
  const parsed = inspectionListSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ServiceError(
      'invalid_response',
      'Inspection types could not be read. Try again.',
    );
  }

  return parsed.data;
}

/**
 * Mock GET /inspection-types. This is an in-app function, not a network endpoint.
 */
export async function getInspectionTypes() {
  await delay();
  return readInspectionTypes(INSPECTION_FIXTURE);
}
