import { useState } from 'react';
import { Mail } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { useContact } from '../../hooks/useContact';
import { formatDate } from '../../utils/formatters';

const ContactManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { messages, loading, getMessageStats } = useContact({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const stats = getMessageStats();

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'non_lu', label: 'Non lus' },
    { value: 'lu', label: 'Lus' },
    { value: 'repondu', label: 'Répondus' },
    { value: 'archive', label: 'Archivés' }
  ];

  const getStatusVariant = (statut) => {
    const variants = {
      non_lu: 'warning',
      lu: 'info',
      repondu: 'success',
      archive: 'default'
    };
    return variants[statut] || 'default';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      non_lu: 'Non lu',
      lu: 'Lu',
      repondu: 'Répondu',
      archive: 'Archivé'
    };
    return labels[statut] || statut;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Messages de Contact
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les messages reçus des visiteurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Non lus</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.non_lu || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lus</p>
          <p className="text-2xl font-bold text-blue-600">{stats.lu || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Répondus</p>
          <p className="text-2xl font-bold text-green-600">{stats.repondu || 0}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher par nom, email, sujet..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Messages List */}
      {loading ? (
        <Loader size="lg" text="Chargement des messages..." />
      ) : messages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              Aucun message trouvé
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} hover className="cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {message.nom_complet}
                    </h3>
                    <Badge variant={getStatusVariant(message.statut)}>
                      {getStatusLabel(message.statut)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {message.email} • {message.telephone}
                  </p>
                  
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Sujet: {message.sujet}
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {message.message}
                  </p>
                </div>
                
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(message.date_envoi)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManagement;

