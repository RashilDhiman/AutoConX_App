import { TextStyle } from 'react-native';

import { colors } from './colors';

export const typography = {
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.copper,
  } satisfies TextStyle,
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
  } satisfies TextStyle,
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  } satisfies TextStyle,
};
