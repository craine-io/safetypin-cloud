export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  }
  