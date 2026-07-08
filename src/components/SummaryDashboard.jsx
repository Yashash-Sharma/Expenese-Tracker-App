import React from 'react';
import { DollarSign, Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { CATEGORY_META } from '../constants/categories';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatCurrencyCompact } from '../constants/currencies';

export default function SummaryDashboard({ expenses = [], filteredExpenses = [] }) {
  const { state } = useExpenses();
  const { currency } = state;

  // Calculate Totals based on filtered list (or overall - let's do filtered so it reacts to search/dates!)
  const incomeList = filteredExpenses.filter(e => e.type === 'income');
  const expenseList = filteredExpenses.filter(e => e.type === 'expense' || !e.type); // fallback to expense if type undefined

  const totalIncome = incomeList.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalExpense = expenseList.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const netBalance = totalIncome - totalExpense;

  // Top spending category (based on expenseList)
  const categoryTotals = expenseList.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  let topCategory = "N/A";
  let topCategoryAmount = 0;
  
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > topCategoryAmount) {
      topCategoryAmount = amount;
      topCategory = category;
    }
  });

  const topCategoryColor = CATEGORY_META[topCategory]?.textClass || "text-slate-400";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {/* Net Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/50 hover:shadow-lg">
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-500/10 blur-xl" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-400">Net Balance</span>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-300 ${
            netBalance >= 0 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-450'
          }`}>
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className={`text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netBalance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netBalance), currency)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Income minus expenses</p>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/50 hover:shadow-lg">
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-400">Total Income</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
            {formatCurrency(totalIncome, currency)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Filtered earnings</p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/50 hover:shadow-lg">
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-rose-500/10 blur-xl" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-400">Total Expenses</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
            {formatCurrency(totalExpense, currency)}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Filtered spending</p>
        </div>
      </div>

      {/* Top Spending Category Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/50 hover:shadow-lg">
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-500/10 blur-xl" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-400">Top Spend Category</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Receipt className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className={`text-2xl font-bold tracking-tight ${topCategoryColor}`}>
            {topCategory}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {topCategoryAmount > 0 
              ? `Spent: ${formatCurrencyCompact(topCategoryAmount, currency)}`
              : "No expenses logged"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
