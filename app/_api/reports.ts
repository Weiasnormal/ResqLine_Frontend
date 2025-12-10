import { apiClient, handleApiResponse, handleApiError, ApiResponse } from './config';


export enum Category {
  None = 0,
  Fire = 1,
  Electric = 2,
  Flood = 4,
  Violence = 8,
}

export enum Status {
  Submitted = 'Submitted',
  Under_Review = 'Under_Review',
  In_Progress = 'In_Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
}

export interface CreateReportRequest {
  // title: string; 
  image: string; // base64 encoded image
  category: Category;
  description?: string;
  location: Location;
}

export interface ReportResponse {
  id: string;
  image: string; 
  category: Category;
  // title: string; 
  description?: string;
  location: Location;
  createdAt: string;
  status: Status;
}

export interface GetReportsRequest {
  sort?: string;
  pageSize?: number;
  pageOffset?: number;
}

// Reports API functions
export const reportsApi = {
  // Create new report
  create: async (data: CreateReportRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/reports', {
        // Title: data.title, 
        Image: data.image || '', 
        Category: data.category,
        Description: data.description,
        Location: {
          Latitude: data.location.latitude,
          Longitude: data.location.longitude,
          Altitude: data.location.altitude,
          Accuracy: data.location.accuracy,
          AltitudeAccuracy: data.location.altitudeAccuracy,
        },
      });
      return handleApiResponse<string>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all reports with pagination
  getAll: async (params: GetReportsRequest = {}): Promise<ApiResponse<ReportResponse[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.pageOffset) queryParams.append('pageoffset', params.pageOffset.toString());

      const url = `/reports${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('📥 Fetching reports from:', url);
      
      const response = await apiClient.get(url);
      console.log('✅ Reports fetched successfully, count:', response.data?.length || 0);
      
      // Backend should return base64 strings directly
      return handleApiResponse<ReportResponse[]>(response);
    } catch (error: any) {
      console.error('❌ Failed to fetch reports:', error.message);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return handleApiError(error);
    }
  },

  // Get reports by status
  getByStatus: async (status: Status, params: GetReportsRequest = {}): Promise<ApiResponse<ReportResponse[]>> => {
    try {
      const allReportsResponse = await reportsApi.getAll(params);
      
      if (allReportsResponse.success && allReportsResponse.data) {
        const filteredReports = allReportsResponse.data.filter(report => report.status === status);
        return {
          data: filteredReports,
          success: true,
        };
      }
      
      return allReportsResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get report by ID
  getById: async (reportId: string): Promise<ApiResponse<ReportResponse>> => {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      
      // Backend should return base64 string directly
      return handleApiResponse<ReportResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Complete/resolve report (admin function)
  complete: async (reportId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.patch(`/reports/${reportId}/complete`);
      return handleApiResponse<null>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete report
  delete: async (reportId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`);
      return handleApiResponse<null>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Convenience functions for easier usage in screens
export const createReport = reportsApi.create;
export const getAllReports = reportsApi.getAll;
export const getReportsByStatus = reportsApi.getByStatus;
export const getReportById = reportsApi.getById;
export const completeReport = reportsApi.complete;
export const deleteReport = reportsApi.delete;

// Helper function to convert frontend category strings to backend enum
export const mapCategoryToEnum = (categoryString: string): Category => {
  switch (categoryString.toLowerCase()) {
    case 'fire':
      return Category.Fire;
    case 'electric':
      return Category.Electric;
    case 'flood':
      return Category.Flood;
    case 'violence':
      return Category.Violence;
    default:
      return Category.None;
  }
};

// Helper function to convert backend status enum to frontend string
export const mapStatusToString = (status: Status): string => {
  switch (status) {
    case Status.Submitted:
      return 'Submitted';
    case Status.Under_Review:
      return 'Under Review';
    case Status.In_Progress:
      return 'In Progress';
    case Status.Resolved:
      return 'Resolved';
    case Status.Rejected:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};