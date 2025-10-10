import { Link } from 'react-router-dom';
import { BookOpen, User, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import storageService from '../../services/storage';

const BookCard = ({ book, isAdmin = false }) => {
  const getStatusVariant = (statut) => {
    switch (statut) {
      case 'disponible':
        return 'success';
      case 'reserve_complet':
        return 'danger';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'disponible':
        return 'Disponible';
      case 'reserve_complet':
        return 'Complet';
      case 'maintenance':
        return 'Maintenance';
      default:
        return statut;
    }
  };

  const linkPath = isAdmin ? `/admin/books/${book.id}` : `/books/${book.id}`;

  return (
    <Link to={linkPath}>
      <Card hover className="h-full">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          {book.image_couverture ? (
            <img
              src={storageService.getImageUrl(book.image_couverture)}
              alt={book.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(book.statut)} size="sm">
              {getStatusLabel(book.statut)}
            </Badge>
          </div>
        </div>

        {/* Book Info */}
        <div className="space-y-2">
          {/* Category */}
          {book.categorie_nom && (
            <Badge 
              variant="primary" 
              size="sm"
              className="mb-2"
            >
              {book.categorie_nom}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
            {book.titre}
          </h3>

          {/* Author */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{book.auteur_nom}</span>
          </div>

          {/* Year */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{book.annee_publication}</span>
          </div>

          {/* Availability */}
          {book.statut === 'disponible' && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {book.exemplaires_disponibles} exemplaire(s) disponible(s)
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default BookCard;

