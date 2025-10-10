import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  const pages = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={ChevronLeft}
      >
        Précédent
      </Button>

      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${currentPage === page
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {page}
          </button>
        )
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default Pagination;

