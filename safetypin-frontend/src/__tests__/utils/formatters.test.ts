import {
  formatDate,
  formatDateTime,
  formatBytes,
  formatCurrency,
  truncateText
} from '../../utils/formatters';

describe('Formatter Utilities', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const dateString = '2023-04-15T00:00:00.000Z';
      const formatted = formatDate(dateString);
      
      // This might vary based on locale, but for 'en-US' we expect:
      expect(formatted).toMatch(/Apr 15, 2023/);
    });

    it('should format Date object correctly', () => {
      const date = new Date(2023, 3, 15); // April 15, 2023
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/Apr 15, 2023/);
    });

    it('should return empty string for falsy values', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('should format date string with time correctly', () => {
      const dateString = '2023-04-15T14:30:00.000Z';
      const formatted = formatDateTime(dateString);
      
      // This will depend on the locale and timezone, but should contain the date and time
      expect(formatted).toMatch(/Apr 15, 2023/);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/); // Has hours and minutes
    });

    it('should return empty string for falsy values', () => {
      expect(formatDateTime('')).toBe('');
      expect(formatDateTime(null as any)).toBe('');
      expect(formatDateTime(undefined as any)).toBe('');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes to human readable values', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('should respect decimals parameter', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
      expect(formatBytes(1536, 3)).toBe('1.500 KB');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1)).toBe('$1.00');
      expect(formatCurrency(1.5)).toBe('$1.50');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    // Could add tests for negative values, etc.
  });

  describe('truncateText', () => {
    it('should truncate text that exceeds maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('should not truncate text within maxLength', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should return empty string for falsy values', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText(null as any, 5)).toBe('');
      expect(truncateText(undefined as any, 5)).toBe('');
    });
  });
});
