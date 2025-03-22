import {
  isValidEmail,
  isStrongPassword,
  getPasswordStrength,
  isValidUrl,
  isValidHostname,
  isValidPort
} from '../../utils/validators';

describe('Validator Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('user-name@domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test@domain.')).toBe(false);
      expect(isValidEmail('test@dom ain.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isStrongPassword('Passw0rd!')).toBe(true);
      expect(isStrongPassword('P@ssw0rd123')).toBe(true);
      expect(isStrongPassword('Very$tr0ngP@ss')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(isStrongPassword('')).toBe(false);
      expect(isStrongPassword('password')).toBe(false); // no numbers or special chars
      expect(isStrongPassword('Pass123')).toBe(false); // too short
      expect(isStrongPassword('Password')).toBe(false); // no numbers or special chars
      expect(isStrongPassword('12345678')).toBe(false); // no letters or special chars
      expect(isStrongPassword('!@#$%^&*')).toBe(false); // no letters or numbers
    });
  });

  describe('getPasswordStrength', () => {
    it('should return correct score and feedback for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.score).toBe(0);
      expect(result.feedback).toBe('Password is required');
    });

    it('should return correct score and feedback for weak password', () => {
      const result = getPasswordStrength('pass');
      expect(result.score).toBe(0);
      expect(result.feedback).toBe('Password should be at least 8 characters');
    });

    it('should return correct score and feedback for medium password', () => {
      const result = getPasswordStrength('password123');
      expect(result.score).toBeGreaterThan(1);
      expect(result.score).toBeLessThan(5);
    });

    it('should return correct score and feedback for strong password', () => {
      const result = getPasswordStrength('P@ssw0rd123!');
      expect(result.score).toBe(5);
      expect(result.feedback).toBe('Strong password');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false); // missing protocol
      expect(isValidUrl('http:/example.com')).toBe(false); // malformed
    });
  });

  describe('isValidHostname', () => {
    it('should return true for valid hostnames', () => {
      expect(isValidHostname('example.com')).toBe(true);
      expect(isValidHostname('sub.example.com')).toBe(true);
      expect(isValidHostname('example-site.com')).toBe(true);
      expect(isValidHostname('localhost')).toBe(true);
    });

    it('should return false for invalid hostnames', () => {
      expect(isValidHostname('')).toBe(false);
      expect(isValidHostname('example com')).toBe(false); // contains space
      expect(isValidHostname('-example.com')).toBe(false); // starts with hyphen
      expect(isValidHostname('example-.com')).toBe(false); // ends with hyphen
      expect(isValidHostname('example..com')).toBe(false); // consecutive dots
    });
  });

  describe('isValidPort', () => {
    it('should return true for valid port numbers', () => {
      expect(isValidPort(1)).toBe(true);
      expect(isValidPort(80)).toBe(true);
      expect(isValidPort(443)).toBe(true);
      expect(isValidPort(8080)).toBe(true);
      expect(isValidPort(65535)).toBe(true);
    });

    it('should return false for invalid port numbers', () => {
      expect(isValidPort(0)).toBe(false);
      expect(isValidPort(-1)).toBe(false);
      expect(isValidPort(65536)).toBe(false);
      expect(isValidPort(999999)).toBe(false);
    });
  });
});
