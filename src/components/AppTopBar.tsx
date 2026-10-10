import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const logo = require('../assets/autoconx-logo-light.png');

type Props = {
  unreadCount: number;
  onMenu: () => void;
  onNotifications: () => void;
  onProfile: () => void;
};

export function AppTopBar({
  unreadCount,
  onMenu,
  onNotifications,
  onProfile,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={onMenu}
          style={styles.iconButton}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </Pressable>
        <View style={styles.flex} />
        <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        onPress={onNotifications}
        style={styles.iconButton}>
        <View style={styles.bell}>
          <View style={styles.bellBody} />
          <View style={styles.bellClapper} />
        </View>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={onProfile}
        style={styles.iconButton}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
        </Pressable>
      </View>
      <View
        pointerEvents="none"
        style={[styles.logoCenter, { top: insets.top }]}
        accessibilityRole="image"
        accessibilityLabel="AutoConX">
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    minHeight: 56,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  row: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  logoCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLine: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.ink,
    marginVertical: 2,
  },
  logo: {
    width: 168,
    height: 44,
  },
  bell: {
    width: 18,
    height: 18,
    alignItems: 'center',
  },
  bellBody: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  bellClapper: {
    width: 4,
    height: 2,
    marginTop: 1,
    borderRadius: 1,
    backgroundColor: colors.ink,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
