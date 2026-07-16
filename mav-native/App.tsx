import React, { useState } from 'react';
import { ScrollView, View, Pressable, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@shopify/restyle';
import { MavThemeProvider, useThemeMode } from './src/theme/ThemeProvider';
import { Text } from './src/theme/restyle';
import type { Theme } from './src/theme/theme';
import { Badge } from './src/components/Badge';
import { Button } from './src/components/Button';
import { Input } from './src/components/Input';
import { Toggle } from './src/components/Toggle';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme<Theme>();
  return (
    <View style={{ gap: 12, marginBottom: 28 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, color: theme.colors.muted }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>{children}</View>;
}

function Showcase() {
  const theme = useTheme<Theme>();
  const { mode, toggle } = useThemeMode();
  const [text, setText] = useState('');
  const [on, setOn] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.fg }}>MaV · Native</Text>
          <Pressable
            onPress={toggle}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{ fontSize: 13, color: theme.colors.fg }}>{mode === 'dark' ? '☀︎ Light' : '☾ Dark'}</Text>
          </Pressable>
        </View>

        <Section title="Badge — colors">
          <Row>
            <Badge color="primary">Primary</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="orange">Orange</Badge>
          </Row>
          <Row>
            <Badge color="primary" type="outline">Primary</Badge>
            <Badge color="red" type="outline">Red</Badge>
            <Badge color="green" type="clear">Clear</Badge>
            <Badge color="primary" size="sm">Small</Badge>
          </Row>
        </Section>

        <Section title="Button">
          <Row>
            <Button label="Primary" variant="primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Text only" variant="textonly" />
          </Row>
          <Row>
            <Button label="Loading" loading />
            <Button label="Disabled" disabled />
          </Row>
        </Section>

        <Section title="Input">
          <Input value={text} onChangeText={setText} placeholder="Enter email…" />
          <Input value="bad-email" error="Please enter a valid email" />
          <Input placeholder="Not available" disabled />
        </Section>

        <Section title="Toggle">
          <Row>
            <Toggle value={on} onValueChange={setOn} />
            <Text style={{ color: theme.colors.fg }}>Enable notifications</Text>
          </Row>
          <Row>
            <Toggle value={false} onValueChange={() => {}} />
            <Toggle value disabled />
            <Toggle value={false} disabled />
          </Row>
        </Section>
      </ScrollView>
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <MavThemeProvider initialMode={scheme === 'dark' ? 'dark' : 'light'}>
      <Showcase />
    </MavThemeProvider>
  );
}
