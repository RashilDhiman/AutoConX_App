import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import {
  formatDisplayDate,
  parseIsoDate,
  startOfToday,
  toIsoDate,
} from '../../../utils/date';

type Props = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function DateField({ value, error, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseIsoDate(value) : null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Preferred date</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.invalid : null]}>
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected ? formatDisplayDate(value) : 'Choose a date'}
        </Text>
        <Text style={styles.hint}>Calendar</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {open ? (
        <View>
          <DateTimePicker
            value={selected ?? startOfToday()}
            mode="date"
            minimumDate={startOfToday()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onDismiss={() => setOpen(false)}
            onValueChange={(_event, date) => {
              if (date) {
                onChange(toIsoDate(date));
              }
              if (Platform.OS === 'android') {
                setOpen(false);
              }
            }}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={styles.done}>
              <Text style={styles.doneLabel}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  field: {
    minHeight: 54,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invalid: {
    borderColor: colors.danger,
  },
  hint: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: colors.ink,
    fontSize: 16,
  },
  placeholder: {
    color: colors.muted,
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  done: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  doneLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
});
