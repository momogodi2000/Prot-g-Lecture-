const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  hover = false,
  onClick,
  ...props 
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-surface 
        rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);
CardHeader.displayName = 'Card.Header';
Card.Header = CardHeader;

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);
CardTitle.displayName = 'Card.Title';
Card.Title = CardTitle;

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);
CardDescription.displayName = 'Card.Description';
Card.Description = CardDescription;

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);
CardContent.displayName = 'Card.Content';
Card.Content = CardContent;

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);
CardFooter.displayName = 'Card.Footer';
Card.Footer = CardFooter;

export default Card;

