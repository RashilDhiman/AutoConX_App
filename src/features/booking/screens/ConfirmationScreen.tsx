import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigationTypes';
import { AppButton } from '../../../components/AppButton';
import { ErrorView } from '../../../components/ErrorView';
import { Screen } from '../../../components/Screen';
import { StepList } from '../../../components/StepList';
import { inspectionLabel } from '../../inspection/data/inspectionFixture';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { formatDisplayDate } from '../../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

const NEXT_STEPS = [
  {
    title: 'Booking is held',
    body: 'Your reference stays on this confirmation.',
  },
  {
    title: 'Specialist visits the address',
    body: 'They come to the vehicle on the date you chose.',
  },
  {
    title: 'You keep the record',
    body: 'Open View Booking for the notes and status.',
  },
];

export function ConfirmationScreen({ route, navigation }: Props) {
  const booking = route.params?.booking;
  const [openReference, setOpenReference] = useState<string | null>(null);
  const detailsOpen = booking != null && openReference === booking.reference;

  if (!booking) {
    return (
      <Screen>
        <ErrorView
          title="Booking not found"
          message="This screen only shows a booking that was just confirmed."
          onRetry={() => navigation.navigate('Main')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.success}>
          <View style={styles.mark}>
            <Text style={styles.markText}>✓</Text>
          </View>
          <Text style={styles.title}>Inspection Confirmed</Text>
          <Text style={styles.lead}>
            The visit is booked. Keep this reference if you need it later.
          </Text>
          <Text style={styles.reference}>{booking.reference}</Text>
        </View>

        <View style={styles.card}>
          <Detail
            label="Vehicle"
            value={`${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`}
          />
          <Detail label="Plate" value={booking.vehicle.plate} />
          <Detail
            label="Inspection"
            value={inspectionLabel(booking.inspectionType)}
          />
          <Detail label="Date" value={formatDisplayDate(booking.date)} />
          <Detail label="Address" value={booking.address} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next</Text>
          <StepList steps={NEXT_STEPS} />
        </View>

        <AppButton
          label={detailsOpen ? 'Hide booking record' : 'View Booking'}
          variant="secondary"
          onPress={() =>
            setOpenReference(current =>
              current === booking.reference ? null : booking.reference,
            )
          }
        />
        {detailsOpen ? (
          <View style={styles.card}>
            <Text style={styles.sheetTitle}>{booking.reference}</Text>
            <Text style={styles.status}>Confirmed</Text>
            <Detail
              label="Vehicle"
              value={`${booking.vehicle.make} ${booking.vehicle.model}`}
            />
            <Detail label="Plate" value={booking.vehicle.plate} />
            <Detail
              label="Inspection"
              value={inspectionLabel(booking.inspectionType)}
            />
            <Detail label="Date" value={formatDisplayDate(booking.date)} />
            <Detail label="Address" value={booking.address} />
            <Detail
              label="Notes"
              value={booking.notes.length > 0 ? booking.notes : 'None'}
            />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
  success: {
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  mark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.successSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: colors.success,
    fontSize: 26,
    fontWeight: '700',
  },
  title: {
    ...typography.title,
  },
  lead: {
    ...typography.body,
    color: colors.muted,
  },
  reference: {
    marginTop: spacing.xs,
    overflow: 'hidden',
    backgroundColor: colors.navy,
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.heading,
    fontSize: 18,
  },
  detail: {
    gap: 2,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  status: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successSurface,
    color: colors.success,
    overflow: 'hidden',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontWeight: '700',
  },
});
