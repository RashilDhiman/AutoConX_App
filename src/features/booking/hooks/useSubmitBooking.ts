import { useCallback, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { toUserMessage } from '../../../services/serviceError';
import { useAppStore } from '../../../state/appStore';
import {
  createBooking,
  createIdempotencyKey,
} from '../services/bookingService';
import { BookingResponse } from '../types';
import { BookingFormInput, toBookingRequest } from '../validation/bookingSchema';

export type SubmitResult =
  | { status: 'confirmed'; booking: BookingResponse }
  | { status: 'failed' }
  | { status: 'blocked' };

export function useSubmitBooking(vehicleId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlight = useRef(false);
  const idempotencyKey = useRef<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const submit = useCallback(
    async (values: BookingFormInput): Promise<SubmitResult> => {
      if (inFlight.current) {
        return { status: 'blocked' };
      }

      inFlight.current = true;
      if (!idempotencyKey.current) {
        idempotencyKey.current = createIdempotencyKey();
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const request = toBookingRequest(vehicleId, values);
        const takenReferences = useAppStore
          .getState()
          .bookings.map(item => item.reference);
        const booking = await createBooking(
          request,
          idempotencyKey.current,
          takenReferences,
        );
        idempotencyKey.current = null;
        if (mounted.current) {
          setIsSubmitting(false);
        }
        return { status: 'confirmed', booking };
      } catch (error) {
        const message =
          error instanceof ZodError
            ? (error.issues[0]?.message ??
              'Check the booking details and try again.')
            : toUserMessage(
                error,
                'We could not confirm this booking. Please try again.',
              );
        if (mounted.current) {
          setErrorMessage(message);
          setIsSubmitting(false);
        }
        return { status: 'failed' };
      } finally {
        inFlight.current = false;
      }
    },
    [vehicleId],
  );

  return { isSubmitting, errorMessage, submit };
}
