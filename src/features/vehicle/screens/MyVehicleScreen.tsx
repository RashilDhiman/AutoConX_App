import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigationTypes';
import { AppButton } from '../../../components/AppButton';
import { ErrorView } from '../../../components/ErrorView';
import { LoadingView } from '../../../components/LoadingView';
import { Screen } from '../../../components/Screen';
import { StepList } from '../../../components/StepList';
import { inspectionLabel } from '../../inspection/data/inspectionFixture';
import { toUserMessage } from '../../../services/serviceError';
import { useAppStore } from '../../../state/appStore';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import { formatDisplayDate } from '../../../utils/date';
import { getVehicle } from '../services/vehicleService';
import { Vehicle } from '../types';

const vehiclePhoto = require('../../../assets/patrol-suv.jpg');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; vehicle: Vehicle };

const STEPS = [
  {
    title: 'Choose the inspection',
    body: 'Pre-purchase, pre-sale, or a routine check.',
  },
  {
    title: 'Say where to visit',
    body: 'Use your location, or type the address.',
  },
  {
    title: 'Pick a date',
    body: 'A specialist comes to the vehicle.',
  },
];

function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function MyVehicleScreen({ navigation }: Props) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const requestId = useRef(0);
  const nextBooking = useAppStore(stateStore => stateStore.bookings[0]);

  const loadVehicle = useCallback(() => {
    const id = requestId.current + 1;
    requestId.current = id;
    setState({ status: 'loading' });

    getVehicle()
      .then(vehicle => {
        if (requestId.current === id) {
          setState({ status: 'ready', vehicle });
        }
      })
      .catch(error => {
        if (requestId.current === id) {
          setState({
            status: 'error',
            message: toUserMessage(
              error,
              'The vehicle could not be loaded.',
            ),
          });
        }
      });
  }, []);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  if (state.status === 'loading') {
    return (
      <Screen>
        <LoadingView message="Loading your vehicle" />
      </Screen>
    );
  }

  if (state.status === 'error') {
    return (
      <Screen>
        <ErrorView
          title="Vehicle unavailable"
          message={state.message}
          onRetry={loadVehicle}
        />
      </Screen>
    );
  }

  const { vehicle } = state;

  return (
    <Screen>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.hello}>{greeting()}</Text>
        <Text style={styles.lead}>
          Your vehicle is ready for a mobile inspection.
        </Text>

        <Text style={styles.section}>My vehicles</Text>
        <View style={styles.card}>
          <Image
            source={vehiclePhoto}
            style={styles.photo}
            resizeMode="cover"
            accessibilityLabel={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
          <View style={styles.cardBody}>
            <Text style={styles.kicker}>Ready to book</Text>
            <Text style={styles.title}>
              {vehicle.year} {vehicle.make}
            </Text>
            <Text style={styles.model}>{vehicle.model}</Text>
            <View style={styles.plate}>
              <Text style={styles.plateLabel}>Plate</Text>
              <Text style={styles.plateValue}>{vehicle.plate}</Text>
            </View>
            <Text style={styles.copy}>
              A specialist can inspect this {vehicle.model} at the address you
              choose.
            </Text>
            <AppButton
              label="Book Inspection"
              onPress={() => navigation.navigate('BookInspection', { vehicle })}
            />
          </View>
        </View>

        {nextBooking ? (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Latest booking</Text>
              <Text style={styles.status}>Confirmed</Text>
            </View>
            <Text style={styles.reference}>{nextBooking.reference}</Text>
            <Text style={styles.panelLine}>
              {nextBooking.vehicle.year} {nextBooking.vehicle.make}{' '}
              {nextBooking.vehicle.model}
            </Text>
            <Text style={styles.panelMeta}>
              {inspectionLabel(nextBooking.inspectionType)}
            </Text>
            <Text style={styles.panelMeta}>
              {formatDisplayDate(nextBooking.date)}
            </Text>
            <Text style={styles.panelMeta}>{nextBooking.address}</Text>
          </View>
        ) : null}

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>How it works</Text>
          <StepList steps={STEPS} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  hello: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: -spacing.xs,
  },
  section: {
    marginTop: spacing.sm,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 112,
    backgroundColor: '#E7EDF3',
  },
  cardBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  model: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '600',
  },
  plate: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    gap: 2,
  },
  plateLabel: {
    color: '#9BB6D6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  plateValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 18,
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
  reference: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  panelLine: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  panelMeta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
