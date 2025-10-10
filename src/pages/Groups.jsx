import { useState } from 'react';
import { Users } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import GroupGrid from '../components/groups/GroupGrid';
import { useGroups } from '../hooks/useGroups';

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { groups, loading } = useGroups({ 
    search: searchTerm,
    statut: 'actif' // Only show active groups to visitors
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Groupes de Lecture
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Rejoignez des communautés de lecteurs passionnés
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un groupe par nom ou thème..."
        />
      </div>

      {/* Groups Grid */}
      <GroupGrid groups={groups} loading={loading} />
    </div>
  );
};

export default Groups;

