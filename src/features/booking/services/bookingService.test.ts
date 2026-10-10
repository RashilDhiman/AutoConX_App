import { ServiceError } from '../../../services/serviceError';
import { createBooking, resetBookingService } from './bookingService';
import { BookingRequest } from '../types';

const request: BookingRequest = {
  vehicleId: 'vehicle_1',
  inspectionType: 'PRE_PURCHASE',
  address: 'Dubai Marina',
  date: '2026-10-15',
  notes: '',
};

describe('createBooking', () => {
  beforeEach(() => {
    resetBookingService();
  });

  it('confirms the first booking and reuses that reference for the same key', async () => {
    const first = await createBooking(request, 'key-1');
    const repeat = await createBooking(
      { ...request, address: 'Changed address' },
      'key-1',
    );

    expect(first.reference).toBe('ACX-29384');
    expect(first.status).toBe('confirmed');
    expect(first.vehicle.plate).toBe('Dubai A 12345');
    expect(repeat).toEqual(first);
  });

  it('fails every third new attempt and lets the same key retry', async () => {
    await createBooking(request, 'key-1');
    await createBooking(request, 'key-2');

    await expect(createBooking(request, 'key-3')).rejects.toMatchObject({
      code: 'booking_failed',
    });

    const retried = await createBooking(request, 'key-3');
    expect(retried.reference).toBe('ACX-29386');
    expect(retried.address).toBe('Dubai Marina');
  });

  it('skips a reference that is already saved on this phone', async () => {
    const booking = await createBooking(request, 'key-1', ['ACX-29384']);
    expect(booking.reference).toBe('ACX-29385');
    expect(booking.address).toBe('Dubai Marina');
  });

  it('rejects a second call while the first submission is still running', async () => {
    const first = createBooking(request, 'key-1');
    await expect(createBooking(request, 'key-2')).rejects.toBeInstanceOf(
      ServiceError,
    );
    await expect(first).resolves.toMatchObject({ reference: 'ACX-29384' });
  });
});
