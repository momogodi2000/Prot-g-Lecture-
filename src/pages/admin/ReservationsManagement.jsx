import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import ReservationCard from '../../components/reservations/ReservationCard';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { useReservations } from '../../hooks/useReservations';

const ReservationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { reservations, loading, getReservationStats } = useReservations({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const stats = getReservationStats();

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'validee', label: 'Validées' },
    { value: 'refusee', label: 'Refusées' },
    { value: 'terminee', label: 'Terminées' },
    { value: 'annulee', label: 'Annulées' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion des Réservations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Validez et gérez les réservations de lecture
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.en_attente || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Validées</p>
          <p className="text-2xl font-bold text-green-600">{stats.validees || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refusées</p>
          <p className="text-2xl font-bold text-red-600">{stats.refusees || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Terminées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.terminees || 0}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher par nom, email, numéro..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Reservations List */}
      {loading ? (
        <Loader size="lg" text="Chargement des réservations..." />
      ) : reservations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              Aucune réservation trouvée
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Les réservations apparaîtront ici
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onClick={() => {/* Handle click - will add modal later */}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsManagement;

