import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '../config';

// Create the API service
class ApiService {
  private client: AxiosInstance;
  private mockMode: boolean;
  
  constructor() {
    this.mockMode = config.features.mockMode;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add authentication interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  
  // Generic API methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
  
  // Helper method to determine if we should use mock data
  shouldUseMockData(): boolean {
    return this.mockMode;
  }
}

// Export singleton instance
export const api = new ApiService();