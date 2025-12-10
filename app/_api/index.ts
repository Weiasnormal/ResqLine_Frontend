// Re-export all API functions and types for easy access
export * from './config';
export * from './auth';
export * from './user';
export * from './reports';

// Central API object for organized access
import { authApi } from './auth';
import { userApi } from './user';
import { reportsApi } from './reports';

export const api = {
  auth: authApi,
  user: userApi,
  reports: reportsApi,
};