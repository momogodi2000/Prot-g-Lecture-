import { Search, X } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Rechercher...', 
  className = '' 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className={`
        flex items-center bg-white dark:bg-dark-surface
        border rounded-lg transition-all duration-200
        ${isFocused 
          ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
          : 'border-gray-300 dark:border-gray-600'
        }
      `}>
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            flex-1 px-3 py-2 bg-transparent 
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
          "
        />
        
        {value && (
          <button
            onClick={onClear || (() => onChange(''))}
            className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

