import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title = "Confirm Action", message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up">
        {/* Decorative background glow */}
        <div className="absolute -left-16 -top-16 -z-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />
        
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{message}</p>
          </div>
          <button 
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-850 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-750 active:scale-95 shadow-lg shadow-rose-950/20 rounded-xl transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
