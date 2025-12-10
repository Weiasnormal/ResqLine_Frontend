import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
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