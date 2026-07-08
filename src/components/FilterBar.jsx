import React, { useState, useEffect } from 'react';
import { Search, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { getCurrentWeekRange, getCurrentMonthRange } from '../utils/dateHelpers';

export default function FilterBar() {
  const { state, dispatch } = useExpenses();
  const { filters } = state;
  
  const [localSearch, setLocalSearch] = useState(filters.searchText);
  const [datePreset, setDatePreset] = useState('all'); // 'all', 'week', 'month', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch({ 
        type: 'SET_FILTER', 
        payload: { filterKey: 'searchText', value: localSearch } 
      });
    }, 250);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'type', value: newType }
    });
    
    // Reset category filter if it becomes invalid under new transaction type
    const validCats = newType === 'income' 
      ? INCOME_CATEGORIES 
      : newType === 'expense' 
        ? EXPENSE_CATEGORIES 
        : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
        
    if (filters.category !== 'All' && !validCats.includes(filters.category)) {
      dispatch({
        type: 'SET_FILTER',
        payload: { filterKey: 'category', value: 'All' }
      });
    }
  };

  const handleCategoryChange = (e) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'category', value: e.target.value }
    });
  };

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    if (preset === 'all') {
      dispatch({
        type: 'SET_FILTER',
        payload: { filterKey: 'dateRange', value: { start: null, end: null } }
      });
    } else if (preset === 'week') {
      const range = getCurrentWeekRange();
      dispatch({
        type: 'SET_FILTER',
        payload: { filterKey: 'dateRange', value: range }
      });
    } else if (preset === 'month') {
      const range = getCurrentMonthRange();
      dispatch({
        type: 'SET_FILTER',
        payload: { filterKey: 'dateRange', value: range }
      });
    }
  };

  const handleCustomDateChange = (start, end) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'dateRange', value: { start: start || null, end: end || null } }
    });
  };

  useEffect(() => {
    if (datePreset === 'custom') {
      handleCustomDateChange(customStart, customEnd);
    }
  }, [customStart, customEnd, datePreset]);

  const handleResetFilters = () => {
    setLocalSearch('');
    setDatePreset('all');
    setCustomStart('');
    setCustomEnd('');
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'type', value: 'All' }
    });
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'category', value: 'All' }
    });
    dispatch({
      type: 'SET_FILTER',
      payload: { filterKey: 'dateRange', value: { start: null, end: null } }
    });
  };

  const hasActiveFilters = 
    filters.type !== 'All' ||
    filters.category !== 'All' || 
    localSearch !== '' || 
    datePreset !== 'all';

  // Get active category lists based on selected type filter
  const displayedCategories = filters.type === 'income' 
    ? INCOME_CATEGORIES 
    : filters.type === 'expense' 
      ? EXPENSE_CATEGORIES 
      : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md shadow-lg shadow-slate-950/10">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-sky-400" />
        <h4 className="text-sm font-semibold text-slate-250 uppercase tracking-wider">Filter Ledger</h4>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="ml-auto text-xs text-rose-405 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
          >
            Clear Filters
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search details..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-505 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        {/* Transaction Type Selector */}
        <div>
          <select
            value={filters.type}
            onChange={handleTypeChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none cursor-pointer transition-all focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="All">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 outline-none cursor-pointer transition-all focus:border-slate-700 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="All">All Categories</option>
            {displayedCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date Presets */}
        <div className="flex flex-col justify-center">
          <div className="flex rounded-xl border border-slate-800 bg-slate-950/50 p-1">
            {['all', 'week', 'month', 'custom'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all ${
                  datePreset === preset
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset === 'all' ? 'All' : preset === 'week' ? 'Week' : preset === 'month' ? 'Month' : 'Custom'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Dates */}
      {datePreset === 'custom' && (
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-800/50 bg-slate-950/20 p-4 transition-all duration-300 animate-slide-down">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <CalendarIcon className="h-3.5 w-3.5" />
              </span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/55 py-2 pl-9 pr-3 text-xs text-slate-250 outline-none transition-all focus:border-slate-700 focus:ring-1 focus:ring-sky-500/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <CalendarIcon className="h-3.5 w-3.5" />
              </span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/55 py-2 pl-9 pr-3 text-xs text-slate-250 outline-none transition-all focus:border-slate-700 focus:ring-1 focus:ring-sky-500/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
