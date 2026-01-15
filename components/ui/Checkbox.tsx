'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={cn(
              "mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800/50",
              "text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900",
              "cursor-pointer",
              error && "border-red-500",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <span className="text-sm text-slate-300 group-hover:text-slate-200">
            {label}
          </span>
        </label>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-400 ml-7"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
