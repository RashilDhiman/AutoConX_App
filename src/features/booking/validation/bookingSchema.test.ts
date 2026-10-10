import { bookingFormSchema, toBookingRequest } from './bookingSchema';

const valid = {
  inspectionType: 'PRE_PURCHASE',
  address: '  Dubai Marina  ',
  date: '2026-10-15',
  notes: '  Gate code 12  ',
};

describe('bookingFormSchema', () => {
  it('requires an inspection type, address, and date', () => {
    const result = bookingFormSchema.safeParse({
      inspectionType: '',
      address: '   ',
      date: '',
      notes: '',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    const messages = result.error.issues.map(issue => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'Select an inspection type.',
        'Enter a location or address.',
        'Choose a preferred date.',
      ]),
    );
  });

  it('rejects a past date and keeps notes optional', () => {
    const past = bookingFormSchema.safeParse({
      ...valid,
      date: '2020-01-01',
      notes: '',
    });
    expect(past.success).toBe(false);

    const parsed = bookingFormSchema.parse(valid);
    expect(parsed.notes).toBe('Gate code 12');
    expect(parsed.address).toBe('Dubai Marina');
  });

  it('builds the mock booking request from the parsed form', () => {
    expect(toBookingRequest('vehicle_1', valid)).toEqual({
      vehicleId: 'vehicle_1',
      inspectionType: 'PRE_PURCHASE',
      address: 'Dubai Marina',
      date: '2026-10-15',
      notes: 'Gate code 12',
    });
  });
});
