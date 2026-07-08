import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { validateExpense } from '../utils/validators';
import { formatDateToISO } from '../utils/dateHelpers';
import { Save, X, PlusCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function ExpenseForm({ initialData = null, onCancel = null }) {
  const { dispatch } = useExpenses();
  
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(formatDateToISO(new Date()));
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset/populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || '');
      setErrors({});
      setTouched({});
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDate(formatDateToISO(new Date()));
      setNote('');
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  // Handle switching type (expense/income)
  const handleTypeChange = (newType) => {
    if (newType === type) return;
    setType(newType);
    setCategory(''); // reset category to prevent invalid category types
    setErrors(prev => ({ ...prev, category: undefined }));
    setTouched(prev => ({ ...prev, category: false }));
  };

  // Run validation on value change for touched fields
  const validateField = (name, value, currentType = type) => {
    const dataToValidate = {
      amount: name === 'amount' ? value : amount,
      category: name === 'category' ? value : category,
      date: name === 'date' ? value : date,
      note: name === 'note' ? value : note,
      type: currentType
    };
    const { errors: validationErrors } = validateExpense(dataToValidate);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name]
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const val = field === 'amount' ? amount : field === 'category' ? category : field === 'date' ? date : note;
    validateField(field, val);
  };

  const handleChange = (field, val) => {
    if (field === 'amount') setAmount(val);
    else if (field === 'category') setCategory(val);
    else if (field === 'date') setDate(val);
    else if (field === 'note') setNote(val);

    if (touched[field]) {
      validateField(field, val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const expenseData = {
      type,
      amount: amount === '' ? '' : Number(amount),
      category,
      date,
      note: note.trim()
    };

    const { isValid, errors: validationErrors } = validateExpense(expenseData);

    if (!isValid) {
      setErrors(validationErrors);
      setTouched({
        amount: true,
        category: true,
        date: true,
        note: true
      });
      return;
    }

    if (initialData) {
      // Editing
      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: {
          id: initialData.id,
          updates: expenseData
        }
      });
    } else {
      // Adding
      const newExpense = {
        ...expenseData,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dispatch({
        type: 'ADD_EXPENSE',
        payload: { expense: newExpense }
      });
    }

    // Reset Form
    setAmount('');
    setCategory('');
    setDate(formatDateToISO(new Date()));
    setNote('');
    setErrors({});
    setTouched({});

    if (onCancel) {
      onCancel();
    }
  };

  const isEditMode = !!initialData;
  const categoriesList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg shadow-slate-950/20">
      <div className="absolute -right-16 -top-16 -z-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl" />
      
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-5">
        {isEditMode ? (
          <>
            <Save className="h-5 w-5 text-sky-400" />
            Edit Transaction Entry
          </>
        ) : (
          <>
            <PlusCircle className="h-5 w-5 text-emerald-400" />
            Add Transaction
          </>
        )}
      </h3>

      {/* Transaction Type Tabs */}
      <div className="flex rounded-xl border border-slate-800 bg-slate-950/60 p-1 mb-5">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          disabled={isEditMode} // Lock type in edit mode to prevent schema confusion
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            type === 'expense'
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-450 font-extrabold shadow-sm'
              : 'text-slate-450 hover:text-slate-200 disabled:opacity-50'
          }`}
        >
          <ArrowDownLeft className="h-4 w-4" />
          Expense
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          disabled={isEditMode}
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            type === 'income'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold shadow-sm'
              : 'text-slate-450 hover:text-slate-200 disabled:opacity-50'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
          Income
        </button>
      </div>

      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹) <span className="text-rose-500">*</span></label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            className={`w-full rounded-xl border bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all ${
              touched.amount && errors.amount
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                : 'border-slate-800 focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20'
            }`}
          />
          {touched.amount && errors.amount && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category <span className="text-rose-500">*</span></label>
          <select
            value={category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            className={`w-full rounded-xl border bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all cursor-pointer ${
              touched.category && errors.category
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                : 'border-slate-800 focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20'
            }`}
          >
            <option value="" disabled>Select a {type === 'income' ? 'Income' : 'Expense'} Category</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {touched.category && errors.category && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date <span className="text-rose-500">*</span></label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`w-full rounded-xl border bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none transition-all ${
              touched.date && errors.date
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                : 'border-slate-800 focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20'
            }`}
          />
          {touched.date && errors.date && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Note / Description</label>
          <textarea
            placeholder={`Add specific details (e.g., ${type === 'income' ? 'Client payout for web build' : 'Grocery shopping at Costco'})...`}
            value={note}
            onChange={(e) => handleChange('note', e.target.value)}
            onBlur={() => handleBlur('note')}
            rows="3"
            maxLength="200"
            className={`w-full rounded-xl border bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none resize-none transition-all ${
              touched.note && errors.note
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                : 'border-slate-800 focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20'
            }`}
          />
          <div className="flex justify-between mt-1">
            {touched.note && errors.note ? (
              <p className="text-xs text-rose-500 font-medium">{errors.note}</p>
            ) : <div />}
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{note.length} / 200</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-850 rounded-xl transition-all duration-200 flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-700 active:scale-95 shadow-lg shadow-emerald-950/20 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isEditMode ? 'Save Changes' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
}
