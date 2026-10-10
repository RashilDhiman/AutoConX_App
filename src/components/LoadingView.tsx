import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  message: string;
};

export function LoadingView({ message }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.navy} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: {
    color: colors.muted,
    fontSize: 16,
  },
});
