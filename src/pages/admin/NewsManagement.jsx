import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import NewsCard from '../../components/news/NewsCard';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { useNews } from '../../hooks/useEvents';
import { paginate } from '../../utils/helpers';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { news, loading } = useNews({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillons' },
    { value: 'publie', label: 'Publiés' },
    { value: 'archive', label: 'Archivés' }
  ];

  const published = news.filter(n => n.statut === 'publie').length;
  const drafts = news.filter(n => n.statut === 'brouillon').length;

  const paginatedData = paginate(news, currentPage, 12);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Publiez des actualités et informations
          </p>
        </div>
        <Link to="/admin/news/new">
          <Button icon={LogoIcon}>
            Créer une Actualité
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{news.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Publiées</p>
          <p className="text-2xl font-bold text-green-600">{published}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Brouillons</p>
          <p className="text-2xl font-bold text-yellow-600">{drafts}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher une actualité..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* News Grid */}
      {loading ? (
        <Loader size="lg" text="Chargement des actualités..." />
      ) : paginatedData.data.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <LogoIcon className="h-16 w-16 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              Aucune actualité trouvée
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.data.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} isAdmin />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsManagement;

