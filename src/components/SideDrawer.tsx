import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LegalPage } from '../features/legal/content';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenPage: (page: LegalPage) => void;
};

const ITEMS: { page: LegalPage; label: string; detail: string }[] = [
  {
    page: 'terms',
    label: 'Terms and conditions',
    detail: 'How bookings work in this app',
  },
  {
    page: 'privacy',
    label: 'Privacy policy',
    detail: 'What stays on this phone',
  },
  {
    page: 'help',
    label: 'Help',
    detail: 'Book a visit, step by step',
  },
  {
    page: 'about',
    label: 'About AutoConX',
    detail: 'Mobile vehicle inspection',
  },
];

export function SideDrawer({ open, onClose, onOpenPage }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(320, Math.round(width * 0.82));
  const translate = useRef(new Animated.Value(-drawerWidth)).current;

  useEffect(() => {
    Animated.timing(translate, {
      toValue: open ? 0 : -drawerWidth,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [drawerWidth, open, translate]);

  return (
    <View
      pointerEvents={open ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        onPress={onClose}
        style={[styles.backdrop, open ? styles.backdropOpen : styles.backdropClosed]}
      />
      <Animated.View
        style={[
          styles.panel,
          {
            width: drawerWidth,
            paddingTop: insets.top + spacing.md,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
            transform: [{ translateX: translate }],
          },
        ]}>
        <Text style={styles.kicker}>MENU</Text>
        <Text style={styles.title}>AutoConX</Text>
        <View style={styles.list}>
          {ITEMS.map(item => (
            <Pressable
              key={item.page}
              accessibilityRole="button"
              onPress={() => onOpenPage(item.page)}
              style={styles.row}>
              <View style={styles.copy}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.detail}>{item.detail}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 32, 51, 0.45)',
  },
  backdropOpen: {
    opacity: 1,
  },
  backdropClosed: {
    opacity: 0,
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    minHeight: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  detail: {
    color: colors.muted,
    fontSize: 13,
  },
  chevron: {
    color: colors.muted,
    fontSize: 22,
    fontWeight: '600',
  },
});
