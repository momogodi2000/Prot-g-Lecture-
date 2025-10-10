import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import EventGrid from '../../components/events/EventGrid';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useEvents } from '../../hooks/useEvents';

const EventsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { events, loading } = useEvents({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillons' },
    { value: 'publie', label: 'Publiés' },
    { value: 'archive', label: 'Archivés' }
  ];

  const published = events.filter(e => e.statut === 'publie').length;
  const drafts = events.filter(e => e.statut === 'brouillon').length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Événements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez et gérez les événements culturels
          </p>
        </div>
        <Link to="/admin/events/new">
          <Button icon={Plus}>
            Créer un Événement
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Publiés</p>
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
          placeholder="Rechercher un événement..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Events Grid */}
      <EventGrid events={events} loading={loading} isAdmin />
    </div>
  );
};

export default EventsManagement;

