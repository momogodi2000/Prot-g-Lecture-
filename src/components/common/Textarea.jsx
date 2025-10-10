import { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`
          block w-full rounded-lg border px-3 py-2
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
          }
          bg-white dark:bg-dark-surface
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          transition-colors duration-200
          resize-y
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

