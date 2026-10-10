import { useAppStore } from './appStore';

const booking = {
  reference: 'ACX-29384',
  status: 'confirmed' as const,
  inspectionType: 'PRE_PURCHASE' as const,
  address: 'Dubai Marina',
  date: '2026-10-15',
  notes: '',
  vehicle: {
    id: 'vehicle_1',
    make: 'Nissan',
    model: 'Patrol',
    year: 2022,
    plate: 'Dubai A 12345',
  },
};

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppState();
  });

  it('stores a confirmed booking and an unread notification once', () => {
    useAppStore.getState().recordBooking(booking);
    useAppStore.getState().recordBooking(booking);

    const state = useAppStore.getState();
    expect(state.bookings).toHaveLength(1);
    expect(state.notifications).toEqual([
      expect.objectContaining({
        id: 'ACX-29384',
        title: 'Inspection booked',
        read: false,
      }),
    ]);
  });

  it('keeps a second booking with a different reference', () => {
    useAppStore.getState().recordBooking(booking);
    useAppStore.getState().recordBooking({
      ...booking,
      reference: 'ACX-29385',
      address: 'Jumeirah',
    });

    expect(useAppStore.getState().bookings.map(item => item.reference)).toEqual([
      'ACX-29385',
      'ACX-29384',
    ]);
  });

  it('marks a notification read', () => {
    useAppStore.getState().recordBooking(booking);
    useAppStore.getState().markNotificationRead('ACX-29384');
    expect(useAppStore.getState().notifications[0]?.read).toBe(true);
  });
});
