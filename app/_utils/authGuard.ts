import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { TOKEN_KEY } from '../_api/config';
import { notificationManager, DomainEventType } from './notificationManager';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  exp?: number;
}

const clearStoredAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to clear stored auth token:', error);
  }
};

const isTokenValid = (token: string): boolean => {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    // If no expiration claim exists, treat token as invalid for safety.
    if (!payload.exp) {
      console.warn('Token has no exp claim; treating as invalid');
      return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
  } catch (error) {
    console.warn('Failed to decode token; treating as invalid', error);
    return false;
  }
};

// check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('🔑 Auth Check - Token exists:', !!token);
    console.log('🔑 Token Key:', TOKEN_KEY);

    if (!token) {
      return false;
    }

    console.log('🔑 Token length:', token.length, 'chars [VALUE REDACTED]');

    const valid = isTokenValid(token);
    if (!valid) {
      console.log('⏰ Token expired/invalid, clearing local auth');
      await clearStoredAuth();
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    return false;
  }
};

// if the user is already logged in, redirect to home screen
export const redirectIfAuthenticated = async () => {
  console.log('🔍 Checking if should redirect to home...');
  const authenticated = await isAuthenticated();
  if (authenticated) {
    
    console.log('✅ User authenticated, redirecting to home tab');
    router.replace({ pathname: '/(tabs)', params: { tab: 'home' } });
  } else {
    console.log('❌ User not authenticated, staying on current screen');
  }
};

// if the user is not logged in, redirect to welcome screen
export const requireAuthentication = async () => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    router.replace('/WelcomeScreen');
  }
};

//for logout functionality
export const handleLogout = async () => {
  try {
    await clearStoredAuth();
    
    // Show logout notification
    await notificationManager.handleDomainEvent({
      eventId: Date.now().toString(),
      eventType: DomainEventType.UserLoggedOut,
      aggregateId: '',
      aggregateType: 'User',
      timestamp: new Date().toISOString(),
      data: {},
      correlationId: '',
    });
    
    router.replace('/WelcomeScreen');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
