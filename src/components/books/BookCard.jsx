import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import storageService from '../../services/storage';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const BookCard = ({ book, isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  const { db } = useDatabase();
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

  const linkPath = isAdmin ? null : `/books/${book.id}`;

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/admin/books/${book.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        db.run('DELETE FROM livres WHERE id = ?', [book.id]);
        toast.success('Livre supprimé avec succès');
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const CardContent = () => (
    <Card hover className="h-full">
      {/* Book Cover */}
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {book.couverture_url ? (
          <img
            src={book.couverture_url}
            alt={book.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LogoIcon className="h-16 w-16" />
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
          <LogoIcon className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{book.auteur_nom}</span>
        </div>

        {/* Year */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <LogoIcon className="h-4 w-4 mr-1" />
          <span>{book.annee_publication}</span>
        </div>

        {/* Availability */}
        {book.statut === 'disponible' && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {book.stock_disponible || book.exemplaires_disponibles} exemplaire(s) disponible(s)
          </p>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={handleEdit} className="flex-1">
              Modifier
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete} className="flex-1">
              Supprimer
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return isAdmin ? (
    <div><CardContent /></div>
  ) : (
    <Link to={linkPath}><CardContent /></Link>
  );
};

export default BookCard;

