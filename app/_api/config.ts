import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { requestContextManager } from '../_utils/requestContext';
import { errorLogger } from '../_utils/errorLogger';

// Extend axios config to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Environment configuration
export const API_BASE_URL = __DEV__ 
  ? 'https://resqline-backend.onrender.com' // Development - use production backend for now
  : 'https://resqline-backend.onrender.com'; // Production URL

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token storage keys
export const TOKEN_KEY = 'resqline_auth_token';
export const USER_ID_KEY = 'resqline_user_id';


// Request interceptor to add auth token and request context
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request context headers (correlation ID, request ID, timestamp)
      requestContextManager.applyToConfig(config);
      
      // Log request for performance tracking
      const startTime = Date.now();
      config.metadata = { startTime };
    } catch (error) {
      console.warn('Failed to setup request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and performance logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful request performance
    if (response.config?.metadata?.startTime) {
      const duration = Date.now() - response.config.metadata.startTime;
      errorLogger.logMetric(`api_request_${response.config.method?.toUpperCase()}`, duration, 'ms');
    }
    return response;
  },
  async (error) => {
    // Log error with context
    await errorLogger.logError(error, {
      url: error.config?.url,
      method: error.config?.method,
      correlationId: requestContextManager.getCorrelationId(),
    });

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_ID_KEY);
        // Reset correlation ID for next login attempt
        requestContextManager.resetCorrelationId();
        console.log('Auth token expired, please login again');
      } catch (clearError) {
        console.warn('Failed to clear auth data:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Helper function to handle API responses
export const handleApiResponse = <T>(response: any): ApiResponse<T> => {
  return {
    data: response.data,
    success: true,
  };
};

// Helper function to handle API errors
export const handleApiError = (error: any): ApiResponse<null> => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response?.data?.title) {
    errorMessage = error.response.data.title;
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    error: errorMessage,
    success: false,
  };
};