import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';

export type RadioState = 'default' | 'active' | 'disabled';

/** Radio — Figma "Radio Button" (774:6410). 16px, 2px border, 3 states. */
export function Radio({ state = 'default', onPress }: { state?: RadioState; onPress?: () => void }) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const active = state === 'active';
  const disabled = state === 'disabled';

  const borderColor = active ? c.primary : disabled ? c.border : c.borderSubtle;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{
        width: 16,
        height: 16,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor,
        backgroundColor: disabled ? c.border : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.primary }} />}
    </Pressable>
  );
}
