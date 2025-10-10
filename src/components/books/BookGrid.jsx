import { BookOpen } from 'lucide-react';
import BookCard from './BookCard';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import { useState } from 'react';
import { paginate } from '../../utils/helpers';

const BookGrid = ({ books, loading, isAdmin = false, itemsPerPage = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Chargement des livres..." />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
          Aucun livre trouvé
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  const paginatedData = paginate(books, currentPage, itemsPerPage);

  return (
    <div>
      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedData.data.map((book) => (
          <BookCard key={book.id} book={book} isAdmin={isAdmin} />
        ))}
      </div>

      {/* Pagination */}
      {paginatedData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginatedData.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Results Info */}
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
        {Math.min(currentPage * itemsPerPage, books.length)} sur {books.length} livre(s)
      </div>
    </div>
  );
};

export default BookGrid;

