import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  labelClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className, labelClassName, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={selectId}
          className={cn(
            "block text-sm font-medium mb-1",
            "text-slate-300", // Default for dark theme
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-3 border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "bg-slate-800/50 border-slate-700 text-white", // Dark theme default
            "[&>option]:bg-slate-800 [&>option]:text-white", // Options dark theme
            error && "border-error",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          <option value="" className="text-slate-400">Selecciona una opcion</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
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

Select.displayName = 'Select';
