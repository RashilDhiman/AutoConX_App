import { z } from 'zod';

import { delay } from '../../../utils/delay';
import { ServiceError } from '../../../services/serviceError';
import { VEHICLE_FIXTURE } from '../data/vehicleFixture';
import { Vehicle } from '../types';

const vehicleSchema = z.object({
  id: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().gte(1980).lte(2100),
  plate: z.string().min(1),
});

const vehicleListSchema = z.array(vehicleSchema).min(1);

export function readVehicle(payload: unknown): Vehicle {
  const parsed = vehicleListSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ServiceError(
      'invalid_response',
      'Vehicle details could not be read. Try again.',
    );
  }

  const vehicle = parsed.data[0];
  if (!vehicle) {
    throw new ServiceError('not_found', 'No vehicle is available to book.');
  }

  return vehicle;
}

export function findVehicle(vehicleId: string) {
  return VEHICLE_FIXTURE.find(vehicle => vehicle.id === vehicleId) ?? null;
}

/**
 * Mock GET /vehicles. This is an in-app function, not a network endpoint.
 */
export async function getVehicle() {
  await delay();
  return readVehicle(VEHICLE_FIXTURE);
}
