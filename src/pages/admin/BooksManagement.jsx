import { useState } from 'react';
import { Plus, Grid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import BookGrid from '../../components/books/BookGrid';
import BookFilters from '../../components/books/BookFilters';
import Button from '../../components/common/Button';
import { useBooks } from '../../hooks/useBooks';

const BooksManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  
  const { books, loading } = useBooks({ ...filters, search: searchTerm });

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Livres
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez le catalogue de livres du centre
          </p>
        </div>
        <Link to="/admin/books/new">
          <Button icon={Plus}>
            Ajouter un Livre
          </Button>
        </Link>
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
              {books.length} livre(s)
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

          <BookGrid books={books} loading={loading} isAdmin />
        </div>
      </div>
    </div>
  );
};

export default BooksManagement;

