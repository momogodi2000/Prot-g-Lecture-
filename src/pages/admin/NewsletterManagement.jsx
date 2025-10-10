import { useState } from 'react';
import { Plus, Mail, Download } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { useNewsletter } from '../../hooks/useNewsletter';
import { formatDate } from '../../utils/formatters';

const NewsletterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('actif');
  
  const { subscribers, loading, getSubscriberStats } = useNewsletter({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const stats = getSubscriberStats();

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'actif', label: 'Actifs' },
    { value: 'desabonne', label: 'Désabonnés' },
    { value: 'bounce', label: 'Bounce' }
  ];

  const exportSubscribers = () => {
    // Simple CSV export
    const csv = ['Email,Nom,Date Inscription,Statut'];
    subscribers.forEach(sub => {
      csv.push(`${sub.email},"${sub.nom_complet || ''}",${sub.date_inscription},${sub.statut}`);
    });
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion de la Newsletter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les abonnés et envoyez des campagnes
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Download} onClick={exportSubscribers}>
            Exporter
          </Button>
          <Button icon={Plus}>
            Nouvelle Campagne
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Abonnés</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.actifs || 0}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Désabonnés</p>
          <p className="text-2xl font-bold text-red-600">{stats.desabonnes || 0}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher par email ou nom..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Subscribers List */}
      {loading ? (
        <Loader size="lg" text="Chargement des abonnés..." />
      ) : subscribers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              Aucun abonné trouvé
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {subscriber.nom_complet || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(subscriber.date_inscription)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={subscriber.statut === 'actif' ? 'success' : 'default'}>
                        {subscriber.statut}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NewsletterManagement;

