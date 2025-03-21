// Utility functions for form validation

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength (at least 8 chars, with number and special char)
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasNumber && hasSpecial;
};

// Get password strength feedback
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  if (!password) {
    return { score: 0, feedback: 'Password is required' };
  }
  
  let score = 0;
  let feedback = '';
  
  // Length check
  if (password.length < 8) {
    feedback = 'Password should be at least 8 characters';
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/\d/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Feedback based on score
  if (score === 5) {
    feedback = 'Strong password';
  } else if (score >= 3) {
    feedback = 'Good password, could be stronger';
  } else if (score >= 2) {
    feedback = 'Weak password, add numbers, symbols, and mixed case';
  } else {
    feedback = 'Very weak password, use numbers, symbols, and mixed case';
  }
  
  return { score, feedback };
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate hostname format
export const isValidHostname = (hostname: string): boolean => {
  // Simple hostname validation
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return hostnameRegex.test(hostname);
};

// Validate port number
export const isValidPort = (port: number): boolean => {
  return port > 0 && port <= 65535;
};
