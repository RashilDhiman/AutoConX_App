import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigationTypes';
import { Screen } from '../../../components/Screen';
import { unreadCount, useAppStore } from '../../../state/appStore';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function NotificationsScreen(_props: Props) {
  const notifications = useAppStore(state => state.notifications);
  const markNotificationRead = useAppStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore(
    state => state.markAllNotificationsRead,
  );
  const unread = unreadCount(notifications);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {unread > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={markAllNotificationsRead}
            style={styles.markAll}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        ) : null}
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyBody}>
              When an inspection is confirmed, it shows up here.
            </Text>
          </View>
        ) : (
          notifications.map(item => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => markNotificationRead(item.id)}
              style={[styles.card, !item.read && styles.unread]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.state}>{item.read ? 'Read' : 'New'}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  markAll: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
  },
  markAllText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  unread: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  state: {
    marginTop: spacing.xs,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
