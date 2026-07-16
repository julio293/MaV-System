import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';
import { AlertIcon } from './icons';

/** OTP — Figma "OTP" (137:1116). Boxed slots (48×48), controlled, with error. */
export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;
  const refs = useRef<Array<TextInput | null>>([]);
  const [focus, setFocus] = useState(-1);

  const setChar = (i: number, ch: string) => {
    const digit = ch.replace(/[^0-9]/g, '').slice(-1);
    const next = value.split('');
    next[i] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length }).map((_, i) => {
          const filled = !!value[i];
          const isFocus = focus === i;
          const borderColor = error
            ? c.red
            : isFocus
            ? c.primary
            : filled
            ? c.inputBorderActive
            : c.border;
          return (
            <TextInput
              key={i}
              ref={(r) => {
                refs.current[i] = r;
              }}
              value={value[i] ?? ''}
              editable={!disabled}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(ch) => setChar(i, ch)}
              onFocus={() => setFocus(i)}
              onBlur={() => setFocus(-1)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: theme.borderRadii.sm,
                borderWidth: 1,
                borderColor,
                backgroundColor: disabled ? c.inputBgDisabled : error ? c.errorBg : c.inputBg,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: '500',
                color: disabled ? c.placeholder : c.fg,
              }}
            />
          );
        })}
      </View>
      {!!error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AlertIcon size={20} color={c.red} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: c.red }}>{error}</Text>
        </View>
      )}
    </View>
  );
}
