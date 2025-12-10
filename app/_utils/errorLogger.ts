import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { requestContextManager } from './requestContext';

/**
 * Error Logger Service
 * Logs errors to backend for monitoring and debugging
 */
class ErrorLogger {
  private readonly maxRetries = 3;
  private retryCount = 0;

  /**
   * Log error to backend
   */
  async logError(error: any, context?: Record<string, any>): Promise<void> {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        correlationId: requestContextManager.getCorrelationId(),
        message: error.message || 'Unknown error',
        stack: error.stack,
        type: error.name || 'Error',
        context: context || {},
        url: error.config?.url,
        method: error.config?.method,
        statusCode: error.response?.status,
        responseData: error.response?.data,
        userAgent: 'ResqLink-Mobile-App',
      };

      // Try to send error log to backend (if endpoint exists)
      await this.sendErrorLog(errorLog);
    } catch (logError) {
      // Fail silently to avoid infinite loops
      console.warn('Failed to log error to backend:', logError);
    }
  }

  /**
   * Send error log to backend
   * Note: Implement backend endpoint if needed
   */
  private async sendErrorLog(errorLog: any): Promise<void> {
    try {
      const baseURL = __DEV__ 
        ? 'http://localhost:5000' 
        : 'https://api.resqline.com';

      // Create a separate axios instance to avoid circular dependencies
      const logClient = axios.create({
        baseURL: baseURL,
        timeout: 5000,
      });

      await logClient.post('/logs/errors', errorLog);
    } catch (error) {
      // Fail silently - logging shouldn't break the app
      console.warn('Could not send error log to backend');
    }
  }

  /**
   * Log performance metrics
   */
  async logMetric(name: string, value: number, unit: string = 'ms'): Promise<void> {
    try {
      const metric = {
        timestamp: new Date().toISOString(),
        correlationId: requestContextManager.getCorrelationId(),
        name,
        value,
        unit,
      };

      console.debug(`Metric: ${name} = ${value}${unit}`);
      
      // Could send to backend if monitoring endpoint exists
      // await this.sendMetric(metric);
    } catch (error) {
      console.warn('Failed to log metric:', error);
    }
  }

  /**
   * Log application event
   */
  async logEvent(eventName: string, eventData?: Record<string, any>): Promise<void> {
    try {
      const event = {
        timestamp: new Date().toISOString(),
        correlationId: requestContextManager.getCorrelationId(),
        eventName,
        eventData: eventData || {},
      };

      console.debug(`Event: ${eventName}`, eventData);
      
      // Could send to backend if analytics endpoint exists
      // await this.sendEvent(event);
    } catch (error) {
      console.warn('Failed to log event:', error);
    }
  }
}

export const errorLogger = new ErrorLogger();
