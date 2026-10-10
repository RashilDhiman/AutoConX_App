import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookingResponse } from '../../booking/types';
import { inspectionLabel } from '../../inspection/data/inspectionFixture';
import { useAppStore } from '../../../state/appStore';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import { formatDisplayDate } from '../../../utils/date';

type Props = {
  onOpenBooking: (booking: BookingResponse) => void;
};

export function BookingsScreen({ onOpenBooking }: Props) {
  const bookings = useAppStore(state => state.bookings);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Bookings</Text>
      <Text style={styles.lead}>Visits you have confirmed on this phone.</Text>
      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyBody}>
            Choose a vehicle on Home and book an inspection. It will be listed
            here after it is confirmed.
          </Text>
        </View>
      ) : (
        bookings.map(booking => (
          <Pressable
            key={booking.reference}
            accessibilityRole="button"
            onPress={() => onOpenBooking(booking)}
            style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.reference}>{booking.reference}</Text>
              <Text style={styles.status}>Confirmed</Text>
            </View>
            <Text style={styles.vehicle}>
              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
            </Text>
            <Text style={styles.meta}>{inspectionLabel(booking.inspectionType)}</Text>
            <Text style={styles.meta}>{formatDisplayDate(booking.date)}</Text>
            <Text style={styles.meta}>{booking.address}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '700',
  },
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: -spacing.xs,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  reference: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    overflow: 'hidden',
    backgroundColor: colors.successSurface,
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  vehicle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
