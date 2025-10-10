import { Users } from 'lucide-react';
import GroupCard from './GroupCard';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import { useState } from 'react';
import { paginate } from '../../utils/helpers';

const GroupGrid = ({ groups, loading, isAdmin = false, itemsPerPage = 12 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Chargement des groupes..." />
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
          Aucun groupe trouvé
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Les groupes de lecture apparaîtront ici
        </p>
      </div>
    );
  }

  const paginatedData = paginate(groups, currentPage, itemsPerPage);

  return (
    <div>
      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedData.data.map((group) => (
          <GroupCard key={group.id} group={group} isAdmin={isAdmin} />
        ))}
      </div>

      {/* Pagination */}
      {paginatedData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginatedData.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Results Info */}
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
        {Math.min(currentPage * itemsPerPage, groups.length)} sur {groups.length} groupe(s)
      </div>
    </div>
  );
};

export default GroupGrid;

