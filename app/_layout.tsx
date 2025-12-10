import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';
import { UserProfileProvider } from './_contexts/UserProfileContext';
import { ApiProvider } from './_providers/ApiProvider';
import { healthApi } from './_api/health';
import { requestContextManager } from './_utils/requestContext';

export default function RootLayout() {
  useEffect(() => {
    // Initialize request context and verify backend connectivity on app start
    const initializeApp = async () => {
      try {
        // Initialize correlation ID for the app session
        const correlationId = requestContextManager.getCorrelationId();
        console.log('App initialized with correlation ID:', correlationId);

        // Request location permissions on app start
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          console.log('✅ Location permission granted');
        } else {
          console.log('❌ Location permission denied');
          // Show alert to guide user to settings
          Alert.alert(
            'Location Permission Required',
            'ResqLink needs location access to provide emergency services. Please enable location permissions in your device settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Later',
                style: 'cancel',
              },
            ]
          );
        }

        // Perform health check to verify backend connectivity
        const healthCheck = await healthApi.check();
        console.log('Backend health check:', healthCheck);
      } catch (error) {
        // Log error but don't block app startup
        console.warn('Health check failed:', error);
        // In production, you might want to show a warning banner
        // but allow the app to continue functioning
      }
    };

    initializeApp();
  }, []);

  return (
    <ApiProvider>
      <UserProfileProvider>
        <Slot />
      </UserProfileProvider>
    </ApiProvider>
  );
}