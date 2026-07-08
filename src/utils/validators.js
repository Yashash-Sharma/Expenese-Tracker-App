import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';

/**
 * Validates expense/income input data.
 * @param {Object} transactionData
 * @param {number|string} transactionData.amount
 * @param {string} transactionData.category
 * @param {string} transactionData.date
 * @param {string} [transactionData.note]
 * @param {string} [transactionData.type] - 'income' or 'expense'
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateExpense(transactionData) {
  const errors = {};
  const { amount, category, date, note, type = 'expense' } = transactionData;

  // Amount validation
  const numericAmount = Number(amount);
  if (amount === undefined || amount === null || amount === '') {
    errors.amount = "Amount is required";
  } else if (isNaN(numericAmount)) {
    errors.amount = "Amount must be a valid number";
  } else if (numericAmount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  // Category validation
  const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  if (!category) {
    errors.category = "Category is required";
  } else if (!validCategories.includes(category)) {
    errors.category = `Invalid ${type} category selected`;
  }

  // Date validation
  if (!date) {
    errors.date = "Date is required";
  } else {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.date = "Invalid date format";
    } else {
      // Check if date is in the future (comparing dates only, ignoring time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const inputDate = new Date(date);
      const compareDate = new Date(inputDate);
      compareDate.setHours(0, 0, 0, 0);
      
      if (compareDate > today) {
        errors.date = "Date cannot be in the future";
      }
    }
  }

  // Note validation
  if (note && note.length > 200) {
    errors.note = "Note cannot exceed 200 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
export const validateTransaction = validateExpense; // alias for clarity
