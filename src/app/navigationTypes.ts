import { BookingResponse } from '../features/booking/types';
import { LegalPage } from '../features/legal/content';
import { Vehicle } from '../features/vehicle/types';

export type RootStackParamList = {
  Main: undefined;
  BookInspection: { vehicle: Vehicle };
  Confirmation: { booking: BookingResponse };
  Notifications: undefined;
  Legal: { page: LegalPage };
};
