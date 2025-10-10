import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  fullWidth = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-sm',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 shadow-sm',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

