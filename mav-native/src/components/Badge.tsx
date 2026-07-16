import React from 'react';
import { useTheme } from '@shopify/restyle';
import { Box, Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

export type BadgeColor = 'primary' | 'red' | 'green' | 'orange';
export type BadgeType = 'filled' | 'outline' | 'clear';
export type BadgeSize = 'sm' | 'md' | 'lg';

const softKey: Record<BadgeColor, keyof Theme['colors']> = {
  primary: 'primarySoft',
  red: 'redSoft',
  green: 'greenSoft',
  orange: 'orangeSoft',
};
const solidKey: Record<BadgeColor, keyof Theme['colors']> = {
  primary: 'primary',
  red: 'red',
  green: 'green',
  orange: 'orange',
};

const sizePad: Record<BadgeSize, { px: number; py: number; font: number }> = {
  sm: { px: 8, py: 4, font: 12 },
  md: { px: 8, py: 6, font: 14 },
  lg: { px: 14, py: 6, font: 14 },
};

/** Badge — Figma "Badge & Chip" (52:28800). 4px radius, filled/outline/clear. */
export function Badge({
  children,
  color = 'primary',
  type = 'filled',
  size = 'md',
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  type?: BadgeType;
  size?: BadgeSize;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const { px, py, font } = sizePad[size];

  // Primary is a solid fill with inverted text; red/green/orange are tinted.
  const filledBg = color === 'primary' ? c.primary : c[softKey[color]];
  const filledText = color === 'primary' ? c.onPrimary : c[solidKey[color]];
  const vivid = color === 'primary' ? c.primary : c[solidKey[color]];

  const bg = type === 'filled' ? filledBg : 'transparent';
  const textColor = type === 'filled' ? filledText : vivid;
  const borderColor = type === 'outline' ? vivid : 'transparent';

  return (
    <Box
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: px,
        paddingVertical: py,
        backgroundColor: bg,
        borderRadius: theme.borderRadii.sm,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: font, fontWeight: '500', color: textColor }}>{children}</Text>
    </Box>
  );
}
