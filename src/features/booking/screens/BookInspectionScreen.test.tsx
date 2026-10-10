import { fireEvent, render, screen } from '@testing-library/react-native';

import { BookInspectionScreen } from './BookInspectionScreen';

const vehicle = {
  id: 'vehicle_1',
  make: 'Nissan',
  model: 'Patrol',
  year: 2022,
  plate: 'Dubai A 12345',
};

describe('BookInspectionScreen', () => {
  it('shows validation messages and does not leave the form', async () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    await render(
      <BookInspectionScreen
        navigation={navigation as never}
        route={
          {
            key: 'BookInspection',
            name: 'BookInspection',
            params: { vehicle },
          } as never
        }
      />,
    );

    expect(await screen.findByText('Pre-purchase')).toBeTruthy();
    fireEvent.press(screen.getByText('Confirm booking'));

    expect(await screen.findByText('Select an inspection type.')).toBeTruthy();
    expect(screen.getByText('Enter a location or address.')).toBeTruthy();
    expect(screen.getByText('Choose a preferred date.')).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
