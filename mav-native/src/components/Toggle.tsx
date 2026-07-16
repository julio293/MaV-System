import React, { useEffect, useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';

/** Toggle — Figma "Toggle" (85:5795). 44×24 pill, On track re-themes to lime in dark. */
export function Toggle({
  value,
  onValueChange,
  disabled = false,
}: {
  value: boolean;
  onValueChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 180, useNativeDriver: false }).start();
  }, [value, anim]);

  const track = disabled
    ? value
      ? c.toggleDisabledOn
      : c.toggleTrack
    : value
    ? c.toggleTrackActive
    : c.toggleTrack;

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 23] });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={disabled}
      style={{
        width: 44,
        height: 24,
        borderRadius: 9999,
        backgroundColor: track,
        justifyContent: 'center',
        opacity: disabled ? 0.9 : 1,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: c.handle,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
