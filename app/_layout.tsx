import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold } from '@expo-google-fonts/open-sans';

export default function RootLayout() {
  return (
    <FontsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </FontsProvider>
  );
}

const FontsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    // ensure defaultProps objects exist
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};

    const defaultStyle = { fontFamily: 'OpenSans_400Regular' };

    // merge with any existing default styles
    const prevTextStyle = (Text as any).defaultProps.style;
    (Text as any).defaultProps.style = Array.isArray(prevTextStyle)
      ? [defaultStyle, ...prevTextStyle]
      : [defaultStyle, prevTextStyle];

    const prevInputStyle = (TextInput as any).defaultProps.style;
    (TextInput as any).defaultProps.style = Array.isArray(prevInputStyle)
      ? [defaultStyle, ...prevInputStyle]
      : [defaultStyle, prevInputStyle];

    // debug log to confirm it's set
    console.log('Fonts loaded, Text.defaultProps.style:', (Text as any).defaultProps.style);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return <>{children}</>;
};

export { RootLayout as AppLayoutWrapper };