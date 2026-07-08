import { describe, it, expect } from 'vitest';
import { validateExpense } from '../utils/validators';

describe('validateExpense', () => {
  it('should validate correct expense data', () => {
    const validExpense = {
      type: 'expense',
      amount: 15.50,
      category: 'Food',
      date: '2026-07-06',
      note: 'Dinner with friends'
    };
    const { isValid, errors } = validateExpense(validExpense);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('should validate correct income data', () => {
    const validIncome = {
      type: 'income',
      amount: 1500.00,
      category: 'Salary',
      date: '2026-07-06',
      note: 'Monthly salary payout'
    };
    const { isValid, errors } = validateExpense(validIncome);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('should invalidate incorrect category for type', () => {
    // Salary is an income category, invalid for expense type
    const invalidExpenseCat = {
      type: 'expense',
      amount: 10,
      category: 'Salary',
      date: '2026-07-06'
    };
    const { isValid, errors } = validateExpense(invalidExpenseCat);
    expect(isValid).toBe(false);
    expect(errors.category).toBe("Invalid expense category selected");

    // Food is an expense category, invalid for income type
    const invalidIncomeCat = {
      type: 'income',
      amount: 10,
      category: 'Food',
      date: '2026-07-06'
    };
    const { isValid: valInc, errors: errInc } = validateExpense(invalidIncomeCat);
    expect(valInc).toBe(false);
    expect(errInc.category).toBe("Invalid income category selected");
  });

  it('should invalidate empty or non-numeric amount', () => {
    const invalidExpense = {
      amount: '',
      category: 'Food',
      date: '2026-07-06'
    };
    const { isValid, errors } = validateExpense(invalidExpense);
    expect(isValid).toBe(false);
    expect(errors.amount).toBe("Amount is required");
  });

  it('should invalidate negative or zero amounts', () => {
    const zeroAmount = {
      amount: 0,
      category: 'Food',
      date: '2026-07-06'
    };
    const { isValid: valZero, errors: errZero } = validateExpense(zeroAmount);
    expect(valZero).toBe(false);
    expect(errZero.amount).toBe("Amount must be greater than 0");
  });

  it('should invalidate future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const isoFuture = futureDate.toISOString().split('T')[0];

    const invalidDateExpense = {
      amount: 50,
      category: 'Food',
      date: isoFuture
    };
    const { isValid, errors } = validateExpense(invalidDateExpense);
    expect(isValid).toBe(false);
    expect(errors.date).toBe("Date cannot be in the future");
  });

  it('should invalidate long notes', () => {
    const longNoteExpense = {
      amount: 50,
      category: 'Food',
      date: '2026-07-06',
      note: 'a'.repeat(201)
    };
    const { isValid, errors } = validateExpense(longNoteExpense);
    expect(isValid).toBe(false);
    expect(errors.note).toBe("Note cannot exceed 200 characters");
  });
});
