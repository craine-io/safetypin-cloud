// Mock implementation of AWS Amplify Auth
export interface CognitoUser {
  attributes: {
    sub: string;
    email: string;
    given_name?: string;
    family_name?: string;
  };
}

export const Auth = {
  currentAuthenticatedUser: (): Promise<CognitoUser> => {
    const isAuthenticated = localStorage.getItem('mockIsAuthenticated') === 'true';
    if (isAuthenticated) {
      return Promise.resolve({
        attributes: {
          sub: '12345',
          email: localStorage.getItem('mockEmail') || 'user@example.com',
          given_name: 'Demo',
          family_name: 'User',
        }
      });
    } else {
      return Promise.reject('User is not authenticated');
    }
  },
  
  signIn: (email: string, password: string): Promise<CognitoUser> => {
    // For demo purposes, any password will work
    localStorage.setItem('mockIsAuthenticated', 'true');
    localStorage.setItem('mockEmail', email);
    return Promise.resolve({
      attributes: {
        sub: '12345',
        email: email,
        given_name: 'Demo',
        family_name: 'User',
      }
    });
  },
  
  signUp: (params: { username: string; password: string; attributes: any }) => Promise.resolve({}),
  confirmSignUp: (email: string, code: string) => Promise.resolve('SUCCESS'),
  signOut: () => {
    localStorage.removeItem('mockIsAuthenticated');
    localStorage.removeItem('mockEmail');
    return Promise.resolve();
  },
  forgotPassword: (email: string) => Promise.resolve({}),
  forgotPasswordSubmit: (email: string, code: string, newPassword: string) => Promise.resolve({})
};

// Mock configure function
export const Amplify = {
  configure: (config: any) => {
    console.log('Mock Amplify configured');
  }
};
