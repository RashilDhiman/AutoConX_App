import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppButton } from './AppButton';

type Props = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorView({ title, message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Text style={styles.markText}>!</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <AppButton label="Try again" onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
});
