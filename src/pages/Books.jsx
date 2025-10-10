import { useState } from 'react';
import { Grid, List as ListIcon } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import BookGrid from '../components/books/BookGrid';
import BookFilters from '../components/books/BookFilters';
import Button from '../components/common/Button';
import { useBooks } from '../hooks/useBooks';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const { books, loading } = useBooks({ ...filters, search: searchTerm });

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Catalogue de Livres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explorez notre collection et réservez vos livres préférés
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un livre par titre, auteur, ISBN..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <BookFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Books Grid */}
        <div className="lg:col-span-3">
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {books.length} livre(s) trouvé(s)
            </p>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                icon={Grid}
                onClick={() => setViewMode('grid')}
              >
                Grille
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon={ListIcon}
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
            </div>
          </div>

          <BookGrid books={books} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Books;

