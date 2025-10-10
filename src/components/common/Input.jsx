import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  type = 'text',
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
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            block w-full rounded-lg border
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
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
            ${className}
          `}
          {...props}
        />
      </div>
      
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

Input.displayName = 'Input';

export default Input;

