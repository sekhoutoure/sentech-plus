import React, { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="space-y-1">
        <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`mt-0.5 h-4.5 w-4.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer ${className}`}
            {...props}
          />
          <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">{label}</span>
        </label>
        {error && <p className="text-xs font-medium text-red-500 pl-7.5">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
