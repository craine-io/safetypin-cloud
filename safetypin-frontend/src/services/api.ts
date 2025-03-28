// API service for SafetyPin
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import config from '../config';

// Create the API service
class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with base config
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Add authentication interceptor
    this.client.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      async error => {
        // Handle unauthorized errors (401)
        if (error.response && error.response.status === 401) {
          // In a real app, we might refresh the token or redirect to login
          console.log('Unauthorized request');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Check if we should use mock data
   */
  shouldUseMockData(): boolean {
    console.log('Checking if we should use mock data...');
    console.log('REACT_APP_USE_MOCK_DATA:', process.env.REACT_APP_USE_MOCK_DATA);

    // Always use real API data for development troubleshooting
    return false;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    const url = config.api.baseUrl;
    console.log('API Base URL:', url);
    return url;
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      console.log(`GET ${url} success:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} error:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} error:`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} error:`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} error:`, error);
      throw error;
    }
  }
}

// Export as a singleton
const apiService = new ApiService();
export default apiService;
