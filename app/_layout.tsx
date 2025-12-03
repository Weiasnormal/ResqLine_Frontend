import { Stack } from 'expo-router';
import { UserProfileProvider } from '../src/contexts/UserProfileContext';
import React from 'react';
import { Text, TextInput } from 'react-native';
import { useFonts, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold } from '@expo-google-fonts/open-sans';

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <FontsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </FontsProvider>
    </UserProfileProvider>
  );
}

// add a small provider to load fonts and set global defaults
const FontsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  React.useEffect(() => {
    if (!fontsLoaded) return;

    // ensure defaultProps exist
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};

    // prepend Open Sans regular as the default fontFamily for all Text / TextInput
    const defaultTextStyle = { fontFamily: 'OpenSans_400Regular' };
    (Text as any).defaultProps.style = Array.isArray((Text as any).defaultProps.style)
      ? [(defaultTextStyle as any), ...( (Text as any).defaultProps.style )]
      : [defaultTextStyle, (Text as any).defaultProps.style];

    (TextInput as any).defaultProps.style = Array.isArray((TextInput as any).defaultProps.style)
      ? [(defaultTextStyle as any), ...( (TextInput as any).defaultProps.style )]
      : [defaultTextStyle, (TextInput as any).defaultProps.style];
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // wait for fonts

  return <>{children}</>;
};

// wrap your existing layout content with the FontsProvider
const AppLayoutWrapper: React.FC = () => {
  return (
    <FontsProvider>
      {/* ...existing layout JSX/component render... */}
    </FontsProvider>
  );
};

export { AppLayoutWrapper };