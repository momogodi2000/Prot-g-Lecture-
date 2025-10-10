import { Calendar, Clock, User, Mail, Phone, BookOpen } from 'lucide-react';
import { formatDate, formatReservationStatus } from '../../utils/formatters';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ReservationCard = ({ reservation, onClick }) => {
  const statusInfo = formatReservationStatus(reservation.statut);
  
  const statusVariantMap = {
    yellow: 'warning',
    green: 'success',
    red: 'danger',
    blue: 'info',
    gray: 'default'
  };

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {reservation.numero_reservation}
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {reservation.nom_visiteur}
          </h3>
        </div>
        <Badge variant={statusVariantMap[statusInfo.color]}>
          {statusInfo.text}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{reservation.livre_titre}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{formatDate(reservation.date_souhaitee)}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            {reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)'}
          </span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{reservation.email_visiteur}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{reservation.telephone_visiteur}</span>
        </div>
      </div>

      {reservation.commentaire && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
            "{reservation.commentaire}"
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Créée le {formatDate(reservation.date_creation)}
      </div>
    </Card>
  );
};

export default ReservationCard;

