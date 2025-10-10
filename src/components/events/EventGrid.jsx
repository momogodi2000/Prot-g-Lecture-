import { Calendar } from 'lucide-react';
import EventCard from './EventCard';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import { useState } from 'react';
import { paginate } from '../../utils/helpers';

const EventGrid = ({ events, loading, isAdmin = false, itemsPerPage = 12 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Chargement des événements..." />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
          Aucun événement trouvé
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Les événements apparaîtront ici
        </p>
      </div>
    );
  }

  const paginatedData = paginate(events, currentPage, itemsPerPage);

  return (
    <div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedData.data.map((event) => (
          <EventCard key={event.id} event={event} isAdmin={isAdmin} />
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
    </div>
  );
};

export default EventGrid;

