import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { CloseIcon } from './icons';

export type ChipColor = 'primary' | 'red' | 'green' | 'orange' | 'grey' | 'white';
export type ChipType = 'filled' | 'outline';

/** Chip — Figma "Badge & Chip" (52:28800). 8px radius, dismissible. */
export function Chip({
  label,
  color = 'primary',
  type = 'filled',
  onClose,
}: {
  label: string;
  color?: ChipColor;
  type?: ChipType;
  onClose?: () => void;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;

  const solid: Record<ChipColor, string> = {
    primary: c.primary,
    red: c.red,
    green: c.green,
    orange: c.orange,
    grey: c.fg,
    white: c.fg,
  };
  const soft: Record<ChipColor, string> = {
    primary: c.primary,
    red: c.redSoft,
    green: c.greenSoft,
    orange: c.orangeSoft,
    grey: c.grey,
    white: c.bg,
  };

  const filledBg = color === 'primary' ? c.primary : soft[color];
  const filledText = color === 'primary' ? c.onPrimary : solid[color];
  const vivid = solid[color];

  const bg = type === 'filled' ? filledBg : 'transparent';
  const textColor = type === 'filled' ? filledText : vivid;
  const borderColor =
    type === 'outline' ? vivid : color === 'white' ? c.borderSubtle : 'transparent';

  return (
    <Pressable
      onPress={onClose}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: bg,
        borderRadius: theme.borderRadii.md,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '500', color: textColor }}>{label}</Text>
      <CloseIcon size={16} color={textColor} strokeWidth={2} />
    </Pressable>
  );
}
