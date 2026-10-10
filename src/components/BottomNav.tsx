import { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export type MainTab = 'home' | 'bookings' | 'profile';

type Props = {
  tab: MainTab;
  onChange: (tab: MainTab) => void;
};

type IconProps = {
  color: string;
};

function HomeIcon({ color }: IconProps) {
  return (
    <View style={icons.home}>
      <View style={[icons.roof, { borderBottomColor: color }]} />
      <View style={[icons.house, { borderColor: color }]} />
    </View>
  );
}

function BookingsIcon({ color }: IconProps) {
  return (
    <View style={[icons.card, { borderColor: color }]}>
      <View style={[icons.cardLine, { backgroundColor: color }]} />
      <View style={[icons.cardLineShort, { backgroundColor: color }]} />
    </View>
  );
}

function ProfileIcon({ color }: IconProps) {
  return (
    <View style={icons.person}>
      <View style={[icons.head, { borderColor: color }]} />
      <View style={[icons.shoulders, { borderColor: color }]} />
    </View>
  );
}

const TABS: { id: MainTab; label: string; Icon: (props: IconProps) => ReactElement }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'bookings', label: 'Bookings', Icon: BookingsIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export function BottomNav({ tab, onChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}>
      <View style={styles.bar}>
        {TABS.map(item => {
          const selected = tab === item.id;
          const color = selected ? colors.accent : colors.muted;
          const Icon = item.Icon;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(item.id)}
              style={[styles.item, selected && styles.itemSelected]}>
              <Icon color={color} />
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const icons = StyleSheet.create({
  home: {
    width: 22,
    height: 18,
    alignItems: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  house: {
    width: 12,
    height: 8,
    marginTop: -1,
    borderWidth: 1.6,
    borderTopWidth: 0,
  },
  card: {
    width: 16,
    height: 18,
    borderWidth: 1.6,
    borderRadius: 4,
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 2,
  },
  cardLine: {
    height: 1.6,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  cardLineShort: {
    height: 1.6,
    width: 8,
    borderRadius: 1,
    marginLeft: 1,
  },
  person: {
    width: 20,
    height: 18,
    alignItems: 'center',
  },
  head: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.6,
  },
  shoulders: {
    width: 14,
    height: 7,
    marginTop: 2,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1.6,
    borderBottomWidth: 0,
  },
});

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.xs,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
  },
  item: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  itemSelected: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
});
