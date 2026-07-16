import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../theme/theme';
import { CheckIcon, MinusIcon } from './icons';

export type CheckboxState = 'default' | 'focus' | 'selected' | 'indeterminate' | 'disabled';

/** Checkbox — Figma "Checkbox" (52:29969). 16px, radius 4px, 5 states. */
export function Checkbox({
  state = 'default',
  onPress,
}: {
  state?: CheckboxState;
  onPress?: () => void;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const active = state === 'selected' || state === 'indeterminate';
  const disabled = state === 'disabled';

  const bg = active ? c.primary : disabled ? c.inputBgDisabled : c.inputBg;
  const borderColor = active ? c.primary : disabled ? c.border : c.border;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{
        width: 16,
        height: 16,
        borderRadius: theme.borderRadii.sm,
        borderWidth: 1,
        borderColor,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        ...(state === 'focus'
          ? { shadowColor: c.primary, shadowOpacity: 0.4, shadowRadius: 3, elevation: 3 }
          : {}),
      }}
    >
      {state === 'selected' && <CheckIcon size={12} color={c.onPrimary} strokeWidth={2.4} />}
      {state === 'indeterminate' && <MinusIcon size={12} color={c.onPrimary} strokeWidth={2.4} />}
    </Pressable>
  );
}
