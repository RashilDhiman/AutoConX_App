import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigationTypes';
import { LegalPage } from '../../legal/content';
import { useAppStore } from '../../../state/appStore';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const LINKS: { label: string; page: LegalPage }[] = [
  { label: 'Terms and conditions', page: 'terms' },
  { label: 'Privacy policy', page: 'privacy' },
  { label: 'Help', page: 'help' },
];

export function ProfileScreen({ navigation }: Props) {
  const bookingCount = useAppStore(state => state.bookings.length);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
        <Text style={styles.name}>Guest</Text>
        <Text style={styles.detail}>
          No sign-in on this phone. Confirmed bookings stay on the device.
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{bookingCount}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Vehicle</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Notifications')}
        style={styles.row}>
        <Text style={styles.rowLabel}>Notifications</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      {LINKS.map(link => (
        <Pressable
          key={link.page}
          accessibilityRole="button"
          onPress={() => navigation.navigate('Legal', { page: link.page })}
          style={styles.row}>
          <Text style={styles.rowLabel}>{link.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
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
  hero: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '700',
  },
  name: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '700',
  },
  detail: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 2,
  },
  statValue: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  row: {
    minHeight: 56,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    color: colors.muted,
    fontSize: 22,
  },
});
