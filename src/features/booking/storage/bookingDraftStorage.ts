import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { BookingFormInput } from '../validation/bookingSchema';

const STORAGE_KEY = '@autoconx/booking-draft';

const draftSchema = z.object({
  inspectionType: z.string(),
  address: z.string(),
  date: z.string(),
  notes: z.string(),
});

export type DraftLoadResult =
  | { ok: true; draft: BookingFormInput | null; warning?: string }
  | { ok: false; message: string };

function storageMessage(action: string) {
  return `The booking draft could not be ${action}. You can continue, and we will try again as you edit.`;
}

export async function saveBookingDraft(
  draft: BookingFormInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const parsed = draftSchema.parse(draft);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return { ok: true };
  } catch (error) {
    if (__DEV__) {
      console.warn('Draft save failed', error);
    }
    return { ok: false, message: storageMessage('saved') };
  }
}

export async function loadBookingDraft(): Promise<DraftLoadResult> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return { ok: true, draft: null };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return {
        ok: true,
        draft: null,
        warning: 'A saved draft was unreadable, so the form was left empty.',
      };
    }

    const parsed = draftSchema.safeParse(parsedJson);
    if (!parsed.success) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return {
        ok: true,
        draft: null,
        warning: 'A saved draft was incomplete, so the form was left empty.',
      };
    }

    return { ok: true, draft: parsed.data };
  } catch (error) {
    if (__DEV__) {
      console.warn('Draft load failed', error);
    }
    return { ok: false, message: storageMessage('restored') };
  }
}

export async function clearBookingDraft(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch (error) {
    if (__DEV__) {
      console.warn('Draft clear failed', error);
    }
    return { ok: false, message: storageMessage('cleared') };
  }
}
