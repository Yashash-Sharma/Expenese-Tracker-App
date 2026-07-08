import React, { createContext, useContext, useReducer, useEffect } from 'react';
import storageService from '../services/storageService';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  filters: {
    category: "All",
    dateRange: { start: null, end: null },
    searchText: "",
    type: "All" // "All", "income", "expense"
  },
  loading: false,
  error: null
};

export function expenseReducer(state, action) {
  switch (action.type) {
    case 'LOAD_EXPENSES':
      return { 
        ...state, 
        expenses: action.payload.expenses || [] 
      };
      
    case 'ADD_EXPENSE': {
      const updated = [action.payload.expense, ...state.expenses];
      const saveSuccess = storageService.save(updated);
      return { 
        ...state, 
        expenses: updated,
        error: saveSuccess ? null : "Unable to save transaction — storage quota exceeded."
      };
    }
    
    case 'UPDATE_EXPENSE': {
      const updated = state.expenses.map(exp =>
        exp.id === action.payload.id
          ? { 
              ...exp, 
              ...action.payload.updates, 
              updatedAt: new Date().toISOString() 
            }
          : exp
      );
      const saveSuccess = storageService.save(updated);
      return { 
        ...state, 
        expenses: updated,
        error: saveSuccess ? null : "Unable to save updates — storage quota exceeded."
      };
    }
    
    case 'DELETE_EXPENSE': {
      const updated = state.expenses.filter(exp => exp.id !== action.payload.id);
      const saveSuccess = storageService.save(updated);
      return { 
        ...state, 
        expenses: updated,
        error: saveSuccess ? null : "Unable to save changes after deletion."
      };
    }
    
    case 'SET_FILTER':
      return { 
        ...state, 
        filters: { 
          ...state.filters, 
          [action.payload.filterKey]: action.payload.value 
        } 
      };
      
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload.error 
      };
      
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };
      
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load expenses on mount
  useEffect(() => {
    const expenses = storageService.load();
    dispatch({ type: 'LOAD_EXPENSES', payload: { expenses } });
  }, []);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
