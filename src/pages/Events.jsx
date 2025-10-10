import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import EventGrid from '../components/events/EventGrid';
import Select from '../components/common/Select';
import { useEvents } from '../hooks/useEvents';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const { events, loading } = useEvents({ 
    search: searchTerm,
    type: typeFilter,
    statut: 'publie' // Only published events for visitors
  });

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'atelier', label: 'Atelier' },
    { value: 'conference', label: 'Conférence' },
    { value: 'club_lecture', label: 'Club de Lecture' },
    { value: 'exposition', label: 'Exposition' },
    { value: 'formation', label: 'Formation' },
    { value: 'autre', label: 'Autre' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Événements Culturels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez nos ateliers, conférences et activités culturelles
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un événement..."
        />
        
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={typeOptions}
        />
      </div>

      {/* Events Grid */}
      <EventGrid events={events} loading={loading} />
    </div>
  );
};

export default Events;

