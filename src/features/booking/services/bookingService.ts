import { ZodError } from 'zod';

import { findVehicle } from '../../vehicle/services/vehicleService';
import { ServiceError } from '../../../services/serviceError';
import { delay } from '../../../utils/delay';
import { BookingRequest, BookingResponse } from '../types';
import { toBookingRequest } from '../validation/bookingSchema';

const FAILURE_INTERVAL = 3;
const FIRST_REFERENCE = 29384;

let attemptCount = 0;
let nextReference = FIRST_REFERENCE;
let submissionInProgress = false;
const confirmedByKey = new Map<string, BookingResponse>();

export function resetBookingService() {
  attemptCount = 0;
  nextReference = FIRST_REFERENCE;
  submissionInProgress = false;
  confirmedByKey.clear();
}

export function createIdempotencyKey() {
  return `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Mock POST /bookings.
 * Every third new attempt fails. A repeated key returns the same confirmed
 * booking and does not create another one. References already saved on this
 * phone are skipped. The counter itself is process memory only.
 */
export async function createBooking(
  request: BookingRequest,
  idempotencyKey: string,
  takenReferences: readonly string[] = [],
) {
  const existing = confirmedByKey.get(idempotencyKey);
  if (existing) {
    return existing;
  }

  if (submissionInProgress) {
    throw new ServiceError(
      'in_progress',
      'A booking submission is already in progress.',
    );
  }

  submissionInProgress = true;

  try {
    await delay();

    let parsed: BookingRequest;
    try {
      parsed = toBookingRequest(request.vehicleId, {
        inspectionType: request.inspectionType,
        address: request.address,
        date: request.date,
        notes: request.notes,
      });
    } catch (error) {
      const message =
        error instanceof ZodError
          ? (error.issues[0]?.message ?? 'Check the booking details and try again.')
          : 'Check the booking details and try again.';
      if (!(error instanceof ZodError) && __DEV__) {
        console.warn('Booking validation failed', error);
      }
      throw new ServiceError('validation', message);
    }

    const vehicle = findVehicle(parsed.vehicleId);
    if (!vehicle) {
      throw new ServiceError(
        'validation',
        'That vehicle could not be booked.',
      );
    }

    attemptCount += 1;
    if (attemptCount % FAILURE_INTERVAL === 0) {
      throw new ServiceError(
        'booking_failed',
        'We could not confirm this booking. Your details are still here, so you can try again.',
      );
    }

    const taken = new Set(takenReferences);
    let reference = `ACX-${nextReference}`;
    while (taken.has(reference)) {
      nextReference += 1;
      reference = `ACX-${nextReference}`;
    }

    const response: BookingResponse = {
      reference,
      vehicle,
      inspectionType: parsed.inspectionType,
      address: parsed.address,
      date: parsed.date,
      notes: parsed.notes,
      status: 'confirmed',
    };
    nextReference += 1;
    confirmedByKey.set(idempotencyKey, response);
    return response;
  } finally {
    submissionInProgress = false;
  }
}
