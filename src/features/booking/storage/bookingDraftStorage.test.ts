import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from './bookingDraftStorage';

const draft = {
  inspectionType: 'PRE_PURCHASE',
  address: 'Dubai Marina',
  date: '2026-10-15',
  notes: 'Call on arrival',
};

describe('bookingDraftStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves and restores a draft', async () => {
    await saveBookingDraft(draft);
    await expect(loadBookingDraft()).resolves.toEqual({
      ok: true,
      draft,
    });
  });

  it('drops a malformed draft', async () => {
    await AsyncStorage.setItem('@autoconx/booking-draft', '{not json');
    await expect(loadBookingDraft()).resolves.toEqual({
      ok: true,
      draft: null,
      warning: 'A saved draft was unreadable, so the form was left empty.',
    });
    await expect(AsyncStorage.getItem('@autoconx/booking-draft')).resolves.toBeNull();
  });

  it('drops a draft with the wrong shape', async () => {
    await AsyncStorage.setItem(
      '@autoconx/booking-draft',
      JSON.stringify({ address: 12 }),
    );
    const loaded = await loadBookingDraft();
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.draft).toBeNull();
    }
  });

  it('clears a saved draft', async () => {
    await saveBookingDraft(draft);
    await clearBookingDraft();
    await expect(loadBookingDraft()).resolves.toEqual({
      ok: true,
      draft: null,
    });
  });
});
