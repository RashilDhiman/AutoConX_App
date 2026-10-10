import { z } from 'zod';

import { isInspectionTypeCode } from '../../inspection/types';
import { isTodayOrFuture, parseIsoDate } from '../../../utils/date';
import { BookingRequest } from '../types';

export const bookingFormSchema = z.object({
  inspectionType: z
    .string()
    .refine(isInspectionTypeCode, 'Select an inspection type.'),
  address: z
    .string()
    .transform(value => value.trim())
    .pipe(
      z
        .string()
        .min(5, 'Enter a location or address.')
        .max(200, 'Use a shorter address.'),
    ),
  date: z
    .string()
    .refine(value => value.trim().length > 0, 'Choose a preferred date.')
    .refine(value => parseIsoDate(value) !== null, 'Enter a valid date.')
    .refine(
      value => isTodayOrFuture(value),
      'Choose today or a future date.',
    ),
  notes: z
    .string()
    .transform(value => value.trim())
    .pipe(z.string().max(500, 'Keep notes under 500 characters.')),
});

export type BookingFormInput = z.input<typeof bookingFormSchema>;
export type BookingFormOutput = z.output<typeof bookingFormSchema>;

export const emptyBookingForm: BookingFormInput = {
  inspectionType: '',
  address: '',
  date: '',
  notes: '',
};

export function toBookingRequest(
  vehicleId: string,
  values: BookingFormInput,
): BookingRequest {
  const parsed = bookingFormSchema.parse(values);
  return {
    vehicleId,
    inspectionType: parsed.inspectionType,
    address: parsed.address,
    date: parsed.date,
    notes: parsed.notes,
  };
}
