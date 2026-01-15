import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, labelClassName, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={textareaId}
          className={cn(
            "block text-sm font-medium mb-1",
            "text-slate-300", // Default for dark theme
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 border rounded-md transition-colors resize-y min-h-[120px]",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            error && "border-error",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
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

Textarea.displayName = 'Textarea';
