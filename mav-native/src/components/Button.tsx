import React from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'textonly';
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizePad: Record<ButtonSize, { px: number; py: number; font: number }> = {
  sm: { px: 12, py: 8, font: 14 },
  md: { px: 16, py: 12, font: 14 },
  lg: { px: 16, py: 15, font: 15 },
};

/** Button — primary (solid), secondary (outline), textonly. Pressable states. */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const { px, py, font } = sizePad[size];

  const bg =
    variant === 'primary' ? c.primary : 'transparent';
  const borderColor = variant === 'secondary' ? c.border : 'transparent';
  const textColor =
    variant === 'primary' ? c.onPrimary : variant === 'secondary' ? c.fg : c.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: variant === 'textonly' ? 0 : px,
        paddingVertical: variant === 'textonly' ? 0 : py,
        backgroundColor: bg,
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor,
        borderRadius: theme.borderRadii.sm,
        opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
      })}
    >
      {loading && <ActivityIndicator size="small" color={textColor} />}
      <Text style={{ fontSize: font, fontWeight: '700', color: textColor }}>{label}</Text>
    </Pressable>
  );
}
