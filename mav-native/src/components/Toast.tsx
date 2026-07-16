import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { InfoIcon, AlertIcon, CheckCircleIcon, CloseIcon } from './icons';

export type ToastColor = 'primary' | 'red' | 'green' | 'orange';

/** Toast — Figma "Toast" (85:5234). Icon chip + title/desc + action + close. */
export function Toast({
  title,
  description,
  color = 'primary',
  action,
  onAction,
  onClose,
}: {
  title: string;
  description?: string;
  color?: ToastColor;
  action?: string;
  onAction?: () => void;
  onClose?: () => void;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;

  const soft: Record<ToastColor, string> = {
    primary: c.primarySoft,
    red: c.redSoft,
    green: c.greenSoft,
    orange: c.orangeSoft,
  };
  const tint: Record<ToastColor, string> = {
    primary: c.primary,
    red: c.red,
    green: c.green,
    orange: c.orange,
  };
  const Icon = color === 'red' ? AlertIcon : color === 'green' ? CheckCircleIcon : InfoIcon;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        maxWidth: 560,
        padding: 16,
        borderRadius: theme.borderRadii.md,
        backgroundColor: c.bg,
        borderWidth: 1,
        borderColor: c.borderSubtle,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }}
    >
      <View style={{ padding: 6, borderRadius: 8, backgroundColor: soft[color] }}>
        <Icon size={20} color={tint[color]} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: c.fg }}>{title}</Text>
        {!!description && (
          <Text style={{ fontSize: 14, fontWeight: '500', color: c.muted }}>{description}</Text>
        )}
      </View>
      {!!action && (
        <Pressable onPress={onAction}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: c.primary }}>{action}</Text>
        </Pressable>
      )}
      <Pressable onPress={onClose}>
        <CloseIcon size={22} color={c.fg} strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}
