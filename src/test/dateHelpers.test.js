import { describe, it, expect } from 'vitest';
import { formatDateToISO, isDateInRange, formatDate } from '../utils/dateHelpers';

describe('dateHelpers', () => {
  describe('formatDateToISO', () => {
    it('should format Date objects to YYYY-MM-DD', () => {
      const date = new Date(2026, 6, 7); // July 7th 2026 (0-indexed month)
      expect(formatDateToISO(date)).toBe('2026-07-07');
    });

    it('should handle date string parsing', () => {
      expect(formatDateToISO('2026/07/07')).toBe('2026-07-07');
    });

    it('should return empty string for invalid dates', () => {
      expect(formatDateToISO('invalid-date')).toBe('');
    });
  });

  describe('isDateInRange', () => {
    it('should return true if no range is provided', () => {
      expect(isDateInRange('2026-07-07', null)).toBe(true);
    });

    it('should return true if date is within range', () => {
      const range = { start: '2026-07-01', end: '2026-07-31' };
      expect(isDateInRange('2026-07-07', range)).toBe(true);
      expect(isDateInRange('2026-07-01', range)).toBe(true);
      expect(isDateInRange('2026-07-31', range)).toBe(true);
    });

    it('should return false if date is before start date', () => {
      const range = { start: '2026-07-05', end: '2026-07-31' };
      expect(isDateInRange('2026-07-01', range)).toBe(false);
    });

    it('should return false if date is after end date', () => {
      const range = { start: '2026-07-01', end: '2026-07-10' };
      expect(isDateInRange('2026-07-15', range)).toBe(false);
    });

    it('should handle open-ended ranges', () => {
      const startOnly = { start: '2026-07-10', end: null };
      expect(isDateInRange('2026-07-15', startOnly)).toBe(true);
      expect(isDateInRange('2026-07-05', startOnly)).toBe(false);

      const endOnly = { start: null, end: '2026-07-10' };
      expect(isDateInRange('2026-07-05', endOnly)).toBe(true);
      expect(isDateInRange('2026-07-15', endOnly)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date strings to display friendly format', () => {
      expect(formatDate('2026-07-07')).toBe('07 Jul 2026');
      expect(formatDate('2026-12-25')).toBe('25 Dec 2026');
    });

    it('should return empty string for invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });
});
