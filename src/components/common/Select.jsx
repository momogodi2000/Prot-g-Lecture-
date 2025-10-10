import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Sélectionnez une option',
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
      
      <select
        ref={ref}
        className={`
          block w-full rounded-lg border px-3 py-2
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
          }
          bg-white dark:bg-dark-surface
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
        {...props}
      >
        {options.length > 0 ? (
          // When options are provided, render them directly
          options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))
        ) : (
          // When no options provided, render children (legacy support)
          <>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {props.children}
          </>
        )}
      </select>
      
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

Select.displayName = 'Select';

export default Select;

