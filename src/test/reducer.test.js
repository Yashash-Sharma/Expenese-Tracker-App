import { describe, it, expect, vi } from 'vitest';
import { expenseReducer } from '../context/ExpenseContext';

// Mock storageService since it is called inside reducer
vi.mock('../services/storageService', () => {
  return {
    default: {
      save: vi.fn(() => true),
      load: vi.fn(() => []),
      getCurrency: vi.fn(() => 'INR'),
      setCurrency: vi.fn()
    }
  };
});

describe('expenseReducer', () => {
  const initialState = {
    expenses: [],
    filters: {
      category: "All",
      dateRange: { start: null, end: null },
      searchText: ""
    },
    currency: "INR",
    loading: false,
    error: null
  };

  it('should handle LOAD_EXPENSES', () => {
    const expenses = [
      { id: '1', amount: 10, category: 'Food', date: '2026-07-07' }
    ];
    const action = { type: 'LOAD_EXPENSES', payload: { expenses } };
    const nextState = expenseReducer(initialState, action);
    
    expect(nextState.expenses).toEqual(expenses);
  });

  it('should handle ADD_EXPENSE', () => {
    const expense = { id: '1', amount: 15, category: 'Transport', date: '2026-07-07' };
    const action = { type: 'ADD_EXPENSE', payload: { expense } };
    const nextState = expenseReducer(initialState, action);

    expect(nextState.expenses).toHaveLength(1);
    expect(nextState.expenses[0]).toEqual(expense);
  });

  it('should handle UPDATE_EXPENSE', () => {
    const startState = {
      ...initialState,
      expenses: [
        { id: '1', amount: 15, category: 'Transport', date: '2026-07-07', createdAt: 'some-time' }
      ]
    };
    
    const action = { 
      type: 'UPDATE_EXPENSE', 
      payload: { id: '1', updates: { amount: 20, note: 'Updated note' } } 
    };
    const nextState = expenseReducer(startState, action);

    expect(nextState.expenses[0].amount).toBe(20);
    expect(nextState.expenses[0].note).toBe('Updated note');
    expect(nextState.expenses[0].updatedAt).toBeDefined();
  });

  it('should handle DELETE_EXPENSE', () => {
    const startState = {
      ...initialState,
      expenses: [
        { id: '1', amount: 15, category: 'Transport', date: '2026-07-07' },
        { id: '2', amount: 100, category: 'Bills', date: '2026-07-07' }
      ]
    };

    const action = { type: 'DELETE_EXPENSE', payload: { id: '1' } };
    const nextState = expenseReducer(startState, action);

    expect(nextState.expenses).toHaveLength(1);
    expect(nextState.expenses[0].id).toBe('2');
  });

  it('should handle SET_FILTER', () => {
    const action = { type: 'SET_FILTER', payload: { filterKey: 'category', value: 'Food' } };
    const nextState = expenseReducer(initialState, action);

    expect(nextState.filters.category).toBe('Food');
  });

  it('should handle SET_CURRENCY', () => {
    const action = { type: 'SET_CURRENCY', payload: { currency: 'USD' } };
    const nextState = expenseReducer(initialState, action);

    expect(nextState.currency).toBe('USD');
  });
});
