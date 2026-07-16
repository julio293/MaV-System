import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Text } from '../theme/restyle';
import type { Theme } from '../theme/theme';

/** Chat bubble — Figma "Chat" (139:2096). Incoming (grey) / outgoing (tinted). */
export function ChatBubble({
  text,
  outgoing = false,
  sender,
  time,
  avatar,
}: {
  text: string;
  outgoing?: boolean;
  sender?: string;
  time?: string;
  avatar?: string;
}) {
  const theme = useTheme<Theme>();
  const c = theme.colors;

  return (
    <View
      style={{
        flexDirection: outgoing ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 6,
        alignSelf: outgoing ? 'flex-end' : 'flex-start',
        maxWidth: '88%',
      }}
    >
      {!outgoing && avatar && (
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.border, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: c.fg }}>{avatar}</Text>
        </View>
      )}
      <View
        style={{
          backgroundColor: outgoing ? c.bubbleOut : c.bubbleIn,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 24,
          borderBottomRightRadius: outgoing ? 6 : 24,
          borderBottomLeftRadius: outgoing ? 24 : 6,
        }}
      >
        {!!sender && !outgoing && (
          <Text style={{ fontWeight: '700', fontSize: 14, color: c.primary, marginBottom: 4 }}>{sender}</Text>
        )}
        <Text style={{ fontSize: 16, lineHeight: 22, color: c.fg }}>{text}</Text>
        {!!time && (
          <Text style={{ fontSize: 10, color: c.muted, marginTop: 6, textAlign: 'right' }}>{time}</Text>
        )}
      </View>
    </View>
  );
}
