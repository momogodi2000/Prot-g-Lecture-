import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import apiService from '../../services/api';
import storageService from '../../services/storage';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const BookCard = ({ book, isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  
  // Support both old and new book table structures
  const normalizedBook = {
    id: book.id,
    title: book.title || book.titre,
    author: book.author || book.auteur_nom,
    category: book.category || book.categorie_nom,
    genre: book.genre,
    publication_year: book.publication_year || book.annee_publication,
    language: book.language || book.langue,
    description: book.description || book.resume,
    copies_available: book.copies_available,
    location: book.location,
    status: book.status || book.statut || 'disponible',
    cover_url: book.cover_url || book.couverture_url || book.image_url,
    // Legacy fields for compatibility
    titre: book.titre || book.title,
    auteur_nom: book.auteur_nom || book.author,
    categorie_nom: book.categorie_nom || book.category,
    annee_publication: book.annee_publication || book.publication_year,
    statut: book.statut || book.status || 'disponible'
  };

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
        return statut || 'Disponible';
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
        if (isAdmin) {
          await apiService.deleteAdminBook(book.id);
        } else {
          await apiService.deleteBook(book.id);
        }
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
        {normalizedBook.cover_url ? (
          <img
            src={normalizedBook.cover_url}
            alt={normalizedBook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LogoIcon className="h-16 w-16" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusVariant(normalizedBook.statut)} size="sm">
            {getStatusLabel(normalizedBook.statut)}
          </Badge>
        </div>
      </div>

      {/* Book Info */}
      <div className="space-y-2">
        {/* Category */}
        {(normalizedBook.category || normalizedBook.genre) && (
          <Badge 
            variant="primary" 
            size="sm"
            className="mb-2"
          >
            {normalizedBook.category || normalizedBook.genre}
          </Badge>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
          {normalizedBook.title}
        </h3>

        {/* Author */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <LogoIcon className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{normalizedBook.author}</span>
        </div>

        {/* Year */}
        {normalizedBook.publication_year && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <LogoIcon className="h-4 w-4 mr-1" />
            <span>{normalizedBook.publication_year}</span>
          </div>
        )}

        {/* Availability */}
        {normalizedBook.statut === 'disponible' && normalizedBook.copies_available && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {normalizedBook.copies_available} exemplaire(s) disponible(s)
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

