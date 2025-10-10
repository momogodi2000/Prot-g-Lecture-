import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import storageService from '../../services/storage';

const EventCard = ({ event, isAdmin = false }) => {
  const linkPath = isAdmin ? `/admin/events/${event.id}` : `/events/${event.id}`;

  const getTypeLabel = (type) => {
    const types = {
      atelier: 'Atelier',
      conference: 'Conférence',
      club_lecture: 'Club de Lecture',
      exposition: 'Exposition',
      formation: 'Formation',
      autre: 'Autre'
    };
    return types[type] || type;
  };

  const getTypeVariant = (type) => {
    const variants = {
      atelier: 'info',
      conference: 'primary',
      club_lecture: 'success',
      exposition: 'warning',
      formation: 'danger',
      autre: 'default'
    };
    return variants[type] || 'default';
  };

  return (
    <Link to={linkPath}>
      <Card hover className="h-full">
        {/* Event Image */}
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          {event.image_principale ? (
            <img
              src={storageService.getImageUrl(event.image_principale)}
              alt={event.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-16 w-16 text-primary-500 opacity-50" />
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge variant={getTypeVariant(event.type)}>
              {getTypeLabel(event.type)}
            </Badge>
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
            {event.titre}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {event.description}
          </p>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(event.date_debut)}</span>
            </div>

            {event.lieu && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{event.lieu}</span>
              </div>
            )}

            {event.groupe_nom && (
              <div className="flex items-center text-primary-600 dark:text-primary-400">
                <Users className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{event.groupe_nom}</span>
              </div>
            )}

            {event.lien_externe && (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="text-xs">Lien externe disponible</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;

