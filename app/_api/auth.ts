import * as SecureStore from 'expo-secure-store';
import { apiClient, handleApiResponse, handleApiError, ApiResponse, TOKEN_KEY, USER_ID_KEY } from './config';

// Data types matching backend models
export interface RegisterRequest {
  mobileNumber: string;
  firstName: string;
  lastName: string;
}

export interface GenerateOtpRequest {
  mobileNumber: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  userId?: string;
}

// Authentication API functions
export const authApi = {
  // Register new user
  register: async (data: RegisterRequest): Promise<ApiResponse<string>> => {
    try {
      const payload = {
        MobileNumber: data.mobileNumber,
        FirstName: data.firstName,
        LastName: data.lastName,
      };
      console.log('📤 Registering user with payload:', JSON.stringify(payload));
      const response = await apiClient.post('/users/register', payload);
      console.log('✅ Registration successful:', response.data);
      return handleApiResponse<string>(response);
    } catch (error: any) {
      console.error('❌ Registration failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      return handleApiError(error);
    }
  },

  // Generate OTP for phone verification
  generateOtp: async (data: GenerateOtpRequest): Promise<ApiResponse<null>> => {
    try {
      const payload = { mobileNumber: data.mobileNumber };
      console.log('📤 Generating OTP for:', payload.mobileNumber);
      const response = await apiClient.post('/otp/generate', payload);
      console.log('✅ OTP generated successfully');
      return handleApiResponse<null>(response);
    } catch (error: any) {
      console.error('❌ OTP generation failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      return handleApiError(error);
    }
  },

  // Verify OTP and get JWT token
  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/otp/verify', {
        mobileNumber: data.mobileNumber,
        Otp: data.otp,
      });
      
      if (response.data) {
        // Store the JWT token
        console.log('💾 Storing token in SecureStore with key:', TOKEN_KEY);
        await SecureStore.setItemAsync(TOKEN_KEY, response.data);
        console.log('✅ Token stored successfully');
        
        // Verify it was stored
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log('🔍 Verification - Token retrieved:', !!storedToken);
      }
      
      return handleApiResponse<string>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Logout - clear stored auth data
  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_ID_KEY);
    } catch (error) {
      console.warn('Failed to clear auth data during logout:', error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get stored auth token
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },
};

// Convenience functions for easier usage in screens
export const registerUser = authApi.register;
export const generateOtp = authApi.generateOtp;
export const verifyOtp = authApi.verifyOtp;
export const logout = authApi.logout;
export const isAuthenticated = authApi.isAuthenticated;