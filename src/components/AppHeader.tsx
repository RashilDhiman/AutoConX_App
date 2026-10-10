import { Image, StyleSheet, Text, View } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const logo = require('../assets/autoconx-logo-light.png');

export function AppHeader({ options, navigation, back }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const title = typeof options.title === 'string' ? options.title : 'AutoConX';

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {back ? (
            <HeaderBackButton
              tintColor={colors.ink}
              displayMode="minimal"
              onPress={navigation.goBack}
              accessibilityLabel="Go back"
            />
          ) : null}
        </View>
      </View>
      <View
        pointerEvents="none"
        style={[styles.logoCenter, { top: insets.top }]}
        accessibilityRole="image"
        accessibilityLabel="AutoConX">
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  side: {
    width: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 168,
    height: 44,
  },
  title: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginTop: -spacing.xs,
  },
});
