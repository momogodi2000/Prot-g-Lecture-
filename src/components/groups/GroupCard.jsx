import { Link } from 'react-router-dom';
import { Users, Calendar, BookOpen, MapPin } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import storageService from '../../services/storage';

const GroupCard = ({ group, isAdmin = false }) => {
  const linkPath = isAdmin ? `/admin/groups/${group.id}` : `/groups/${group.id}`;

  const getStatusVariant = (statut) => {
    switch (statut) {
      case 'actif':
        return 'success';
      case 'inactif':
        return 'warning';
      case 'archive':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Link to={linkPath}>
      <Card hover className="h-full">
        {/* Group Image */}
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
          {group.image_couverture ? (
            <img
              src={storageService.getImageUrl(group.image_couverture)}
              alt={group.nom}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="h-16 w-16 text-primary-500 opacity-50" />
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(group.statut)}>
              {group.statut === 'actif' ? 'Actif' : group.statut}
            </Badge>
          </div>
        </div>

        {/* Group Info */}
        <div className="space-y-3">
          {/* Theme Badge */}
          <Badge variant="primary" size="sm">
            {group.theme}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
            {group.nom}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {group.description}
          </p>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              <span>{group.nombre_membres} membre(s)</span>
            </div>

            {group.prochaine_rencontre && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(group.prochaine_rencontre)}</span>
              </div>
            )}

            {group.lieu_rencontre && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{group.lieu_rencontre}</span>
              </div>
            )}

            {group.livre_du_mois_titre && (
              <div className="flex items-center text-primary-600 dark:text-primary-400">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="line-clamp-1 font-medium">{group.livre_du_mois_titre}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;

