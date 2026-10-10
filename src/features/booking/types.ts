import { InspectionTypeCode } from '../inspection/types';
import { Vehicle } from '../vehicle/types';

export type BookingRequest = {
  vehicleId: string;
  inspectionType: InspectionTypeCode;
  address: string;
  date: string;
  notes: string;
};

export type BookingStatus = 'draft' | 'submitting' | 'failed' | 'confirmed';

export type BookingResponse = {
  reference: string;
  vehicle: Vehicle;
  inspectionType: InspectionTypeCode;
  address: string;
  date: string;
  notes: string;
  status: 'confirmed';
};
