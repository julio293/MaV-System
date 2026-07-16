import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Svg, { Circle } from 'react-native-svg';
import type { Theme } from '../theme/theme';

const SIZES = { lg: 48, md: 32, sm: 24, xs: 16 } as const;

/** Loader — Figma "Loader" (85:2727). Animated arc spinner, --loader/spin (lime in dark). */
export function Loader({
  size = 'md',
  color,
}: {
  size?: keyof typeof SIZES;
  color?: string;
}) {
  const theme = useTheme<Theme>();
  const dim = SIZES[size];
  const stroke = Math.max(2, dim / 9);
  const r = (dim - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const strokeColor = color ?? theme.colors.primary;

  return (
    <Animated.View style={{ width: dim, height: dim, transform: [{ rotate }] }}>
      <Svg width={dim} height={dim}>
        {/* ~72% arc with a round head → comet look; rotates continuously */}
        <Circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.72} ${circ}`}
        />
      </Svg>
    </Animated.View>
  );
}
