import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import GroupGrid from '../../components/groups/GroupGrid';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useGroups } from '../../hooks/useGroups';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const GroupsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('actif');
  
  const { groups, loading } = useGroups({ 
    search: searchTerm,
    statut: statusFilter 
  });

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'actif', label: 'Actifs' },
    { value: 'inactif', label: 'Inactifs' },
    { value: 'archive', label: 'Archivés' }
  ];

  const activeGroups = groups.filter(g => g.statut === 'actif').length;
  const totalMembers = groups.reduce((sum, g) => sum + (g.nombre_membres || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Groupes de Lecture
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez et animez des communautés de lecteurs
          </p>
        </div>
        <Link to="/admin/groups/new">
          <Button icon={LogoIcon}>
            Créer un Groupe
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Groupes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{groups.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Groupes Actifs</p>
          <p className="text-2xl font-bold text-green-600">{activeGroups}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Membres</p>
          <p className="text-2xl font-bold text-primary-600">{totalMembers}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un groupe..."
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Groups Grid */}
      <GroupGrid groups={groups} loading={loading} isAdmin />
    </div>
  );
};

export default GroupsManagement;

