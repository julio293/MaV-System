import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as RestyleProvider } from '@shopify/restyle';
import { lightTheme, darkTheme } from './theme';

type Mode = 'light' | 'dark';

const ModeContext = createContext<{ mode: Mode; toggle: () => void }>({
  mode: 'light',
  toggle: () => {},
});

export const useThemeMode = () => useContext(ModeContext);

/**
 * Wraps the app in the MaV Restyle theme and exposes a light/dark toggle —
 * the RN equivalent of the web design system's `data-theme` swap. Swapping the
 * theme object re-themes every component (primary → lime) automatically.
 */
export function MavThemeProvider({
  initialMode = 'light',
  children,
}: {
  initialMode?: Mode;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const value = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }),
    [mode]
  );
  return (
    <ModeContext.Provider value={value}>
      <RestyleProvider theme={mode === 'dark' ? darkTheme : lightTheme}>{children}</RestyleProvider>
    </ModeContext.Provider>
  );
}
