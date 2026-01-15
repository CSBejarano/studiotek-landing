import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, labelClassName, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium mb-1",
            "text-slate-300", // Default for dark theme
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            error && "border-error",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
