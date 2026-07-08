import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import SummaryDashboard from './components/SummaryDashboard';
import CategoryChart from './components/CategoryChart';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import ConfirmDialog from './components/ConfirmDialog';
import Chatbot from './components/Chatbot';
import { isDateInRange } from './utils/dateHelpers';
import { Wallet, Sparkles, XCircle } from 'lucide-react';

function AppContent() {
  const { state, dispatch } = useExpenses();
  const { expenses, filters, error } = state;

  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Compute active filtered list for dashboard, chart, and list sync
  const filteredExpenses = expenses.filter(exp => {
    // Transaction Type Filter (All, income, expense)
    if (filters.type && filters.type !== 'All') {
      const itemType = exp.type || 'expense';
      if (itemType !== filters.type) {
        return false;
      }
    }

    // Category Filter
    if (filters.category !== 'All' && exp.category !== filters.category) {
      return false;
    }

    // Date Range Filter
    if (!isDateInRange(exp.date, filters.dateRange)) {
      return false;
    }

    // Search Filter
    if (filters.searchText) {
      const text = (exp.note || '').toLowerCase();
      const search = filters.searchText.toLowerCase();
      const cat = exp.category.toLowerCase();
      if (!text.includes(search) && !cat.includes(search)) {
        return false;
      }
    }

    return true;
  });

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    // Smooth scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTrigger = (id) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      dispatch({ type: 'DELETE_EXPENSE', payload: { id: deleteConfirmId } });
      setDeleteConfirmId(null);
      
      if (editingExpense && editingExpense.id === deleteConfirmId) {
        setEditingExpense(null);
      }
    }
  };

  const handleDismissError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[150px]" />

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-35 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-slate-950 shadow-md">
              <Wallet className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent m-0 leading-none">
                ExpenSense
              </h1>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest leading-none block mt-1">
                Personal Ledger
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>MVP Active</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Error Notification Banner */}
        {error && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-350 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={handleDismissError}
              className="rounded-lg p-1 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 transition-colors"
            >
              <XCircle className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Top-Level Summary Dashboard */}
        <SummaryDashboard 
          expenses={expenses} 
          filteredExpenses={filteredExpenses} 
        />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Analytics & Transaction List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category Chart Section */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider pl-1 m-0">
                Breakdown Share
              </h2>
              <CategoryChart expenses={filteredExpenses} />
            </div>

            {/* List & Filters Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider pl-1 m-0">
                Transactions Ledger
              </h2>
              
              <FilterBar />
              
              <ExpenseList 
                onEdit={handleEdit} 
                onDelete={handleDeleteTrigger} 
              />
            </div>

          </div>

          {/* RIGHT: Add/Edit Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3">
            <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider pl-1 m-0">
              {editingExpense ? "Modify Transaction" : "New Transaction"}
            </h2>
            <ExpenseForm 
              initialData={editingExpense} 
              onCancel={editingExpense ? () => setEditingExpense(null) : null} 
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center">
        <p className="text-xs text-slate-550 font-medium">
          ExpenSense © 2026. Made with Tailwind CSS, Recharts, and React.
        </p>
      </footer>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Transaction Entry"
        message="Are you sure you want to permanently delete this transaction? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
