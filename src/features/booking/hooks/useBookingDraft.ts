import { useCallback, useEffect, useRef, useState } from 'react';

import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from '../storage/bookingDraftStorage';
import { BookingFormInput } from '../validation/bookingSchema';

const SAVE_DELAY_MS = 400;

type Options = {
  reset: (values: BookingFormInput) => void;
  getValues: () => BookingFormInput;
};

export function useBookingDraft({ reset, getValues }: Options) {
  const [warning, setWarning] = useState<string | null>(null);
  const userEdited = useRef(false);
  const ready = useRef(false);
  const suspended = useRef(false);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const writeDraft = useCallback(
    async (values: BookingFormInput, savedGeneration: number) => {
      const result = await saveBookingDraft(values);
      if (savedGeneration !== generation.current || suspended.current) {
        return;
      }
      if (!result.ok) {
        setWarning(result.message);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    loadBookingDraft().then(result => {
      if (!active) {
        return;
      }

      if (!result.ok) {
        setWarning(result.message);
      } else if (result.draft && !userEdited.current) {
        if (result.warning) {
          setWarning(result.warning);
        }
        reset(result.draft);
      } else if (result.warning) {
        setWarning(result.warning);
      }

      ready.current = true;
      if (userEdited.current && !suspended.current) {
        writeDraft(getValues(), generation.current).catch(error => {
          if (__DEV__) {
            console.warn('Draft save failed', error);
          }
        });
      }
    });

    return () => {
      active = false;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [getValues, reset, writeDraft]);

  const resumeDraftSaves = useCallback(() => {
    suspended.current = false;
  }, []);

  const persistDraft = useCallback(() => {
    userEdited.current = true;
    if (suspended.current || !ready.current) {
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }

    const savedGeneration = generation.current;
    timer.current = setTimeout(() => {
      writeDraft(getValues(), savedGeneration).catch(error => {
        if (__DEV__) {
          console.warn('Draft save failed', error);
        }
      });
    }, SAVE_DELAY_MS);
  }, [getValues, writeDraft]);

  const discardDraft = useCallback(async () => {
    suspended.current = true;
    generation.current += 1;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    const result = await clearBookingDraft();
    if (!result.ok) {
      setWarning(result.message);
    }
  }, []);

  return { warning, persistDraft, resumeDraftSaves, discardDraft };
}
