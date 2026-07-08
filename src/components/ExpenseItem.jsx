import React from 'react';
import * as Icons from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react';
import { CATEGORY_META } from '../constants/categories';
import { formatDate } from '../utils/dateHelpers';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../constants/currencies';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const { id, amount, category, date, note, type = 'expense' } = expense;
  
  const { state } = useExpenses();
  const { currency } = state;
  
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const IconComponent = Icons[meta.icon] || Icons.HelpCircle;
  const isIncome = type === 'income';

  return (
    <div className="group relative flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-900/50 hover:shadow-md">
      {/* Decorative vertical category color strip */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-lg bg-gradient-to-b ${meta.color}`} />

      {/* Info Left */}
      <div className="flex items-center gap-4 pl-2 min-w-0">
        {/* Category Icon */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${meta.bgClass}`}>
          <IconComponent className="h-5.5 w-5.5" />
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100 truncate">
              {note || `${category} ${isIncome ? 'Income' : 'Expense'}`}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-450 uppercase tracking-wider">
            <span className={isIncome ? 'text-emerald-450' : 'text-rose-450'}>{type}</span>
            <span className="h-1 w-1 rounded-full bg-slate-800" />
            <span>{category}</span>
            <span className="h-1 w-1 rounded-full bg-slate-800" />
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Actions & Amount Right */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Amount */}
        <span className={`text-base font-bold tracking-tight ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(amount, currency)}
        </span>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(expense)}
            title="Edit Transaction"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-sky-400 transition-all duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            title="Delete Transaction"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-rose-950/60 hover:bg-rose-950/20 hover:text-rose-500 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
