import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../app/navigationTypes';
import { AppButton } from '../../../components/AppButton';
import { AppTextInput } from '../../../components/AppTextInput';
import { ErrorView } from '../../../components/ErrorView';
import { LoadingView } from '../../../components/LoadingView';
import { Screen } from '../../../components/Screen';
import { getInspectionTypes } from '../../inspection/services/inspectionService';
import {
  InspectionType,
  isInspectionTypeCode,
} from '../../inspection/types';
import { requestCurrentLocation } from '../../../platform/location';
import { toUserMessage } from '../../../services/serviceError';
import { useAppStore } from '../../../state/appStore';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { DateField } from '../components/DateField';
import { useBookingDraft } from '../hooks/useBookingDraft';
import { useSubmitBooking } from '../hooks/useSubmitBooking';
import {
  BookingFormInput,
  BookingFormOutput,
  bookingFormSchema,
  emptyBookingForm,
} from '../validation/bookingSchema';

type Props = NativeStackScreenProps<RootStackParamList, 'BookInspection'>;

type TypeState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; types: InspectionType[] };

const COORDINATES = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;

export function BookInspectionScreen({ route, navigation }: Props) {
  const insets = useContext(SafeAreaInsetsContext);
  const { vehicle } = route.params;
  const [typeState, setTypeState] = useState<TypeState>({ status: 'loading' });
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const requestId = useRef(0);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<BookingFormInput, unknown, BookingFormOutput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: emptyBookingForm,
  });

  const applyDraft = useCallback(
    (values: BookingFormInput) => {
      reset({
        ...values,
        inspectionType: isInspectionTypeCode(values.inspectionType)
          ? values.inspectionType
          : '',
      });
    },
    [reset],
  );

  const { warning, persistDraft, resumeDraftSaves, discardDraft } =
    useBookingDraft({
      reset: applyDraft,
      getValues,
    });
  const { isSubmitting, errorMessage, submit } = useSubmitBooking(vehicle.id);

  const loadTypes = useCallback(() => {
    const id = requestId.current + 1;
    requestId.current = id;
    setTypeState({ status: 'loading' });

    getInspectionTypes()
      .then(types => {
        if (requestId.current === id) {
          setTypeState({ status: 'ready', types });
        }
      })
      .catch(error => {
        if (requestId.current === id) {
          setTypeState({
            status: 'error',
            message: toUserMessage(
              error,
              'Inspection types could not be loaded.',
            ),
          });
        }
      });
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const onUseLocation = async () => {
    resumeDraftSaves();
    setLocating(true);
    const result = await requestCurrentLocation();
    setLocating(false);

    if (result.status === 'ready') {
      const current = getValues('address').trim();
      if (!current || COORDINATES.test(current)) {
        setValue('address', result.label, {
          shouldDirty: true,
          shouldValidate: isSubmitted,
        });
      }
      setLocationMessage(
        `Current location: ${result.label}. These are coordinates, not a street address. You can edit the address.`,
      );
      persistDraft();
      return;
    }

    setLocationMessage(result.message);
  };

  const onSubmit = handleSubmit(async values => {
    const outcome = await submit(values);
    if (outcome.status !== 'confirmed') {
      persistDraft();
      return;
    }

    await discardDraft();
    reset(emptyBookingForm);
    useAppStore.getState().recordBooking(outcome.booking);
    navigation.replace('Confirmation', { booking: outcome.booking });
  });

  if (typeState.status === 'loading') {
    return (
      <Screen>
        <LoadingView message="Loading inspection types" />
      </Screen>
    );
  }

  if (typeState.status === 'error') {
    return (
      <Screen>
        <ErrorView
          title="Inspections unavailable"
          message={typeState.message}
          onRetry={loadTypes}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View style={styles.vehicle}>
            <View style={styles.vehicleCopy}>
              <Text style={styles.vehicleKicker}>This visit</Text>
              <Text style={styles.vehicleName}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
            </View>
          </View>

          <Controller
            control={control}
            name="inspectionType"
            render={({ field }) => (
              <View style={styles.section}>
                <SectionHeading step="1" title="Inspection type" />
                {typeState.types.map(type => {
                  const selected = field.value === type.code;
                  return (
                    <Pressable
                      key={type.code}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        resumeDraftSaves();
                        field.onChange(type.code);
                        persistDraft();
                      }}
                      style={[styles.choice, selected && styles.choiceSelected]}>
                      <View style={styles.choiceCopy}>
                        <Text style={styles.choiceTitle}>{type.label}</Text>
                        <Text style={typography.caption}>{type.description}</Text>
                      </View>
                      <View style={[styles.radio, selected && styles.radioOn]}>
                        {selected ? <View style={styles.radioDot} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
                {errors.inspectionType?.message ? (
                  <Text style={styles.error}>
                    {errors.inspectionType.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <View style={styles.section}>
            <SectionHeading step="2" title="Where should we visit?" />
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <AppTextInput
                  label="Address"
                  value={field.value}
                  onChangeText={text => {
                    resumeDraftSaves();
                    field.onChange(text);
                    persistDraft();
                  }}
                  onBlur={field.onBlur}
                  error={errors.address?.message}
                  placeholder="Dubai Marina"
                  autoCorrect
                  returnKeyType="next"
                />
              )}
            />
            <AppButton
              label={locating ? 'Finding location' : 'Use current location'}
              variant="secondary"
              loading={locating}
              onPress={onUseLocation}
            />
            {locationMessage ? (
              <Text style={typography.caption}>{locationMessage}</Text>
            ) : (
              <Text style={typography.caption}>
                Allow location, or type the address yourself. A typed address
                always works if location is denied.
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <SectionHeading step="3" title="When should we come?" />
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DateField
                  value={field.value}
                  error={errors.date?.message}
                  onChange={value => {
                    resumeDraftSaves();
                    field.onChange(value);
                    persistDraft();
                  }}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <SectionHeading step="4" title="Anything else?" />
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <AppTextInput
                  label="Additional notes (optional)"
                  value={field.value}
                  onChangeText={text => {
                    resumeDraftSaves();
                    field.onChange(text);
                    persistDraft();
                  }}
                  onBlur={field.onBlur}
                  error={errors.notes?.message}
                  placeholder="Anything the inspector should know"
                  multiline
                />
              )}
            />
          </View>

          {warning ? <Text style={styles.warning}>{warning}</Text> : null}

        </ScrollView>
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets?.bottom ?? 0, spacing.md) },
          ]}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{errorMessage}</Text>
            </View>
          ) : null}
          <AppButton
            label="Confirm booking"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={() => {
              onSubmit().catch(error => {
                if (__DEV__) {
                  console.warn('Booking submit failed', error);
                }
              });
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function SectionHeading({ step, title }: { step: string; title: string }) {
  return (
    <View style={styles.heading}>
      <View style={styles.step}>
        <Text style={styles.stepText}>{step}</Text>
      </View>
      <Text style={styles.headingTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  vehicle: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  vehicleCopy: {
    gap: 2,
  },
  vehicleKicker: {
    color: '#9BB6D6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  vehicleName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  vehiclePlate: {
    color: '#D5E4F5',
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    gap: spacing.sm,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  step: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  headingTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  choice: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    padding: spacing.md,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  choiceSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  choiceCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  radioOn: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  choiceTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: colors.dangerSurface,
    borderRadius: 12,
    padding: spacing.md,
  },
  warning: {
    color: colors.navy,
    backgroundColor: colors.infoSurface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 14,
    lineHeight: 20,
  },
});
