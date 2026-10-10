import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BookingResponse } from '../features/booking/types';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

type AppState = {
  bookings: BookingResponse[];
  notifications: AppNotification[];
  recordBooking: (booking: BookingResponse) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAppState: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookings: [],
      notifications: [],
      recordBooking: booking => {
        const notification: AppNotification = {
          id: booking.reference,
          title: 'Inspection booked',
          body: `${booking.reference} is confirmed for your ${booking.vehicle.make} ${booking.vehicle.model}.`,
          read: false,
        };

        set(state => {
          if (state.bookings.some(item => item.reference === booking.reference)) {
            return state;
          }

          return {
            bookings: [booking, ...state.bookings],
            notifications: [notification, ...state.notifications],
          };
        });
      },
      markNotificationRead: id => {
        set({
          notifications: get().notifications.map(item =>
            item.id === id ? { ...item, read: true } : item,
          ),
        });
      },
      markAllNotificationsRead: () => {
        set({
          notifications: get().notifications.map(item => ({
            ...item,
            read: true,
          })),
        });
      },
      resetAppState: () => {
        set({ bookings: [], notifications: [] });
      },
    }),
    {
      name: '@autoconx/app-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        bookings: state.bookings,
        notifications: state.notifications,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        bookings: mergeBookings(
          currentState.bookings,
          readSavedBookings(persistedState),
        ),
        notifications: mergeNotifications(
          currentState.notifications,
          readSavedNotifications(persistedState),
        ),
      }),
    },
  ),
);

function mergeBookings(
  current: BookingResponse[],
  saved: BookingResponse[],
) {
  const seen = new Set<string>();
  const merged: BookingResponse[] = [];

  for (const booking of [...current, ...saved]) {
    if (seen.has(booking.reference)) {
      continue;
    }
    seen.add(booking.reference);
    merged.push(booking);
  }

  return merged;
}

function mergeNotifications(
  current: AppNotification[],
  saved: AppNotification[],
) {
  const seen = new Set<string>();
  const merged: AppNotification[] = [];

  for (const notification of [...current, ...saved]) {
    if (seen.has(notification.id)) {
      continue;
    }
    seen.add(notification.id);
    merged.push(notification);
  }

  return merged;
}

function readSavedBookings(value: unknown) {
  const bookings = readSavedList(value, 'bookings');
  return bookings.filter(
    (item): item is BookingResponse =>
      !!item &&
      typeof item === 'object' &&
      typeof (item as BookingResponse).reference === 'string',
  );
}

function readSavedNotifications(value: unknown) {
  const notifications = readSavedList(value, 'notifications');
  return notifications.filter(
    (item): item is AppNotification =>
      !!item &&
      typeof item === 'object' &&
      typeof (item as AppNotification).id === 'string',
  );
}

function readSavedList(value: unknown, key: 'bookings' | 'notifications') {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const list = (value as Record<string, unknown>)[key];
  return Array.isArray(list) ? list : [];
}

export function unreadCount(notifications: AppNotification[]) {
  return notifications.filter(item => !item.read).length;
}
