import { fireEvent, render, screen } from '@testing-library/react-native';

import { BookingResponse } from '../types';
import { ConfirmationScreen } from './ConfirmationScreen';

const booking: BookingResponse = {
  reference: 'ACX-29384',
  status: 'confirmed',
  inspectionType: 'PRE_PURCHASE',
  address: 'Dubai Marina',
  date: '2026-10-15',
  notes: 'Call on arrival',
  vehicle: {
    id: 'vehicle_1',
    make: 'Nissan',
    model: 'Patrol',
    year: 2022,
    plate: 'Dubai A 12345',
  },
};

describe('ConfirmationScreen', () => {
  it('shows the confirmed booking and opens its record', async () => {
    await render(
      <ConfirmationScreen
        navigation={{ navigate: jest.fn() } as never}
        route={
          {
            key: 'Confirmation',
            name: 'Confirmation',
            params: { booking },
          } as never
        }
      />,
    );

    expect(screen.getByText('Inspection Confirmed')).toBeTruthy();
    expect(screen.getByText('ACX-29384')).toBeTruthy();
    expect(screen.getByText('Dubai Marina')).toBeTruthy();
    expect(screen.getByText('Pre-purchase')).toBeTruthy();

    fireEvent.press(screen.getByText('View Booking'));
    expect(await screen.findByText('Call on arrival')).toBeTruthy();
    expect(screen.getAllByText('ACX-29384')).toHaveLength(2);
  });

  it('replaces the previous booking when a new confirmation is shown', async () => {
    const navigation = { navigate: jest.fn() };
    const second: BookingResponse = {
      ...booking,
      reference: 'ACX-29385',
      address: 'Jumeirah',
      notes: 'Gate code 22',
    };
    const screenProps = {
      navigation: navigation as never,
      route: {
        key: 'Confirmation',
        name: 'Confirmation',
        params: { booking },
      } as never,
    };
    const view = await render(<ConfirmationScreen {...screenProps} />);

    fireEvent.press(screen.getByText('View Booking'));
    expect(await screen.findByText('Call on arrival')).toBeTruthy();

    await view.rerender(
      <ConfirmationScreen
        {...screenProps}
        route={
          {
            key: 'Confirmation',
            name: 'Confirmation',
            params: { booking: second },
          } as never
        }
      />,
    );

    expect(screen.getByText('ACX-29385')).toBeTruthy();
    expect(screen.getByText('Jumeirah')).toBeTruthy();
    expect(screen.queryByText('ACX-29384')).toBeNull();
    expect(screen.queryByText('Call on arrival')).toBeNull();
    expect(screen.queryByText('Gate code 22')).toBeNull();
  });
});
