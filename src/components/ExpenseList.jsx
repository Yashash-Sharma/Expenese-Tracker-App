import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseItem from './ExpenseItem';
import { isDateInRange } from '../utils/dateHelpers';
import { Inbox } from 'lucide-react';

export default function ExpenseList({ onEdit, onDelete }) {
  const { state } = useExpenses();
  const { expenses, filters } = state;

  // Apply filters and sort
  const filteredExpenses = expenses
    .filter(exp => {
      // 1. Transaction Type Filter (All, income, expense)
      if (filters.type && filters.type !== 'All') {
        const itemType = exp.type || 'expense';
        if (itemType !== filters.type) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category !== 'All' && exp.category !== filters.category) {
        return false;
      }

      // 3. Date Range Filter
      if (!isDateInRange(exp.date, filters.dateRange)) {
        return false;
      }

      // 4. Search Filter (match note or category)
      if (filters.searchText) {
        const text = (exp.note || '').toLowerCase();
        const search = filters.searchText.toLowerCase();
        const cat = exp.category.toLowerCase();
        if (!text.includes(search) && !cat.includes(search)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date descending
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      
      // Tie breaker: createdAt descending
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return createdB - createdA;
    });

  if (filteredExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/20 py-12 px-6 text-center backdrop-blur-md">
        <div className="rounded-full bg-slate-900/40 p-4 border border-slate-800/40">
          <Inbox className="h-7 w-7 text-slate-500" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-slate-350">No Transactions Found</h4>
        <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
          {expenses.length === 0 
            ? "Get started by adding your first transaction using the form." 
            : "No records match your active filters. Try adjusting search, type, or category selections."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {filteredExpenses.map((expense) => (
        <ExpenseItem 
          key={expense.id} 
          expense={expense} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
export { isDateInRange };
