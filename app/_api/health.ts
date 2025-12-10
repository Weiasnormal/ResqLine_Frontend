import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './config';

export interface HealthCheckResponse {
  status: string;
  checks: {
    [key: string]: {
      status: string;
      description?: string;
      exception?: string;
    };
  };
  totalDuration: string;
}

/**
 * Health Check API for monitoring backend connectivity and service health
 */
export const healthApi = {
  // Check backend health status
  check: async (): Promise<ApiResponse<HealthCheckResponse>> => {
    try {
      const response = await apiClient.get('/health');
      return handleApiResponse<HealthCheckResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export const checkHealth = healthApi.check;
