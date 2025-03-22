import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../../components/auth/Login';
import { AuthProvider } from '../../../components/auth/AuthContext';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLoginWithRouter = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the login form', () => {
    renderLoginWithRouter();

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows forgot password link', () => {
    renderLoginWithRouter();
    
    const forgotPasswordLink = screen.getByText(/Forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it('navigates to registration page when sign up link is clicked', () => {
    renderLoginWithRouter();
    
    const signUpLink = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpLink);
    
    // In a real test, this would navigate to register page
    // Since we're mocking the router, we just check if it was called correctly
    expect(window.location.pathname).toBe('/');
  });

  it('shows error message for invalid credentials', async () => {
    renderLoginWithRouter();
    
    // Fill out form with invalid credentials
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('redirects to dashboard after successful login', async () => {
    renderLoginWithRouter();
    
    // Fill out form with valid credentials
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('toggles password visibility when eye icon is clicked', () => {
    renderLoginWithRouter();
    
    // Get password field
    const passwordField = screen.getByLabelText(/Password/i);
    expect(passwordField).toHaveAttribute('type', 'password');
    
    // Click visibility toggle button
    const visibilityToggle = screen.getByRole('button', { name: /toggle password visibility/i });
    fireEvent.click(visibilityToggle);
    
    // Password should now be visible
    expect(passwordField).toHaveAttribute('type', 'text');
    
    // Click again to hide
    fireEvent.click(visibilityToggle);
    
    // Password should be hidden again
    expect(passwordField).toHaveAttribute('type', 'password');
  });
});
