import { Loader2 } from 'lucide-react';

const Loader = ({ 
  size = 'md', 
  text = '',
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} text-primary-500 animate-spin`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

