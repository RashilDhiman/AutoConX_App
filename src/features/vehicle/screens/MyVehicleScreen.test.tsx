import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ServiceError } from '../../../services/serviceError';
import { getVehicle } from '../services/vehicleService';
import { MyVehicleScreen } from './MyVehicleScreen';

jest.mock('../services/vehicleService', () => ({
  getVehicle: jest.fn(),
}));

const mockedGetVehicle = jest.mocked(getVehicle);

async function renderScreen() {
  const navigation = { navigate: jest.fn() };
  await render(
    <MyVehicleScreen navigation={navigation as never} />,
  );
  return navigation;
}

describe('MyVehicleScreen', () => {
  beforeEach(() => {
    mockedGetVehicle.mockReset();
  });

  it('shows the vehicle returned by the service', async () => {
    mockedGetVehicle.mockResolvedValue({
      id: 'vehicle_1',
      make: 'Nissan',
      model: 'Patrol',
      year: 2022,
      plate: 'Dubai A 12345',
    });

    const navigation = await renderScreen();
    expect(await screen.findByText('2022 Nissan')).toBeTruthy();
    expect(screen.getByText('Dubai A 12345')).toBeTruthy();

    fireEvent.press(screen.getByText('Book Inspection'));
    expect(navigation.navigate).toHaveBeenCalledWith('BookInspection', {
      vehicle: expect.objectContaining({ id: 'vehicle_1' }),
    });
  });

  it('shows an error and retries the vehicle request', async () => {
    mockedGetVehicle
      .mockRejectedValueOnce(
        new ServiceError('invalid_response', 'Vehicle details could not be read. Try again.'),
      )
      .mockResolvedValueOnce({
        id: 'vehicle_1',
        make: 'Nissan',
        model: 'Patrol',
        year: 2022,
        plate: 'Dubai A 12345',
      });

    await renderScreen();
    expect(await screen.findByText('Vehicle unavailable')).toBeTruthy();
    fireEvent.press(screen.getByText('Try again'));
    await waitFor(() => {
      expect(screen.getByText('Patrol')).toBeTruthy();
    });
    expect(mockedGetVehicle).toHaveBeenCalledTimes(2);
  });
});
