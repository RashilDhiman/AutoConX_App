import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

import { colors } from '../theme/colors';

const logo = require('../assets/autoconx-logo-light.png');

type SplashScreenProps = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const lineScale = useRef(new Animated.Value(0)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;
  const captionOffset = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const testing =
      typeof (globalThis as { jest?: unknown }).jest !== 'undefined';
    if (testing) {
      onFinish();
      return;
    }

    let cancelled = false;
    let animation: Animated.CompositeAnimation | null = null;

    async function play() {
      const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      if (cancelled) {
        return;
      }

      const introDuration = reduceMotion ? 160 : 720;
      const intro = Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: introDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: introDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(lineScale, {
          toValue: 1,
          duration: reduceMotion ? 160 : 560,
          delay: reduceMotion ? 0 : 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(captionOpacity, {
          toValue: 1,
          duration: reduceMotion ? 160 : 480,
          delay: reduceMotion ? 0 : 460,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(captionOffset, {
          toValue: 0,
          duration: reduceMotion ? 160 : 480,
          delay: reduceMotion ? 0 : 460,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      animation = Animated.sequence([
        intro,
        Animated.delay(reduceMotion ? 280 : 700),
      ]);
      animation.start(({ finished }) => {
        if (finished && !cancelled) {
          onFinish();
        }
      });
    }

    play().catch(() => {
      if (!cancelled) {
        onFinish();
      }
    });

    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [
    captionOffset,
    captionOpacity,
    lineScale,
    logoOpacity,
    logoScale,
    onFinish,
  ]);

  return (
    <Animated.View
      accessibilityLabel="AutoConX"
      accessibilityRole="image"
      pointerEvents="auto"
      style={styles.screen}>
      <Animated.View
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.rule, { transform: [{ scaleX: lineScale }] }]} />
      <Animated.View
        style={{
          opacity: captionOpacity,
          transform: [{ translateY: captionOffset }],
        }}>
        <Text style={styles.caption}>Automotive inspection</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 140,
  },
  rule: {
    width: 72,
    height: 2,
    marginTop: 4,
    backgroundColor: colors.accent,
  },
  caption: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
