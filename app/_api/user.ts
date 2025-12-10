import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './config';

// Data types matching backend models
export interface UserResponse {
  firstName: string;
  lastName: string;
  userName: string;
}

export interface UpdateInformationRequest {
  firstName: string;
  lastName: string;
  username: string;
}

export interface UpdatePhoneNumberRequest {
  newMobileNumber: string;
}

// User API functions
export const userApi = {
  // Get user by ID
  getById: async (userId: string): Promise<ApiResponse<UserResponse>> => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return handleApiResponse<UserResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user information (firstName, lastName, username)
  updateInformation: async (data: UpdateInformationRequest): Promise<ApiResponse<UserResponse>> => {
    try {
      const response = await apiClient.patch('/users/updateinformation', {
        FirstName: data.firstName,
        LastName: data.lastName,
        Username: data.username,
      });
      return handleApiResponse<UserResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user phone number
  updatePhoneNumber: async (data: UpdatePhoneNumberRequest): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.patch('/users/updatephonenumber', {
        NewMobileNumber: data.newMobileNumber,
      });
      return handleApiResponse<null>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete user account
  deleteAccount: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete('/users');
      return handleApiResponse<null>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Convenience functions for easier usage in screens
export const getUserById = userApi.getById;
export const updateUserInformation = userApi.updateInformation;
export const updatePhoneNumber = userApi.updatePhoneNumber;
export const deleteUserAccount = userApi.deleteAccount;