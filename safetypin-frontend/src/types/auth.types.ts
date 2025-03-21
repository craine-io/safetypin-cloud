export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;  // Added this property
  phoneNumber?: string;  // Added this property
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}
