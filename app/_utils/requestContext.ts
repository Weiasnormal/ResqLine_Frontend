import axios, { AxiosRequestConfig } from 'axios';

/**
 * Generate a UUID v4-like string without using crypto.getRandomValues()
 * Compatible with React Native and Expo
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Request Context Manager
 * Manages correlation IDs and request context for better tracing and debugging
 */
class RequestContextManager {
  private correlationId: string = '';

  /**
   * Generate or get current correlation ID
   */
  getCorrelationId(): string {
    if (!this.correlationId) {
      this.correlationId = generateUUID();
    }
    return this.correlationId;
  }

  /**
   * Set a new correlation ID (useful for linking related requests)
   */
  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Reset correlation ID for new request chain
   */
  resetCorrelationId(): void {
    this.correlationId = generateUUID();
  }

  /**
   * Get request context headers
   */
  getContextHeaders(): Record<string, string> {
    return {
      'X-Correlation-ID': this.getCorrelationId(),
      'X-Request-ID': generateUUID(),
      'X-Request-Timestamp': new Date().toISOString(),
    };
  }

  /**
   * Apply context headers to axios config
   */
  applyToConfig(config: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...config,
      headers: {
        ...config.headers,
        ...this.getContextHeaders(),
      },
    };
  }
}

export const requestContextManager = new RequestContextManager();
