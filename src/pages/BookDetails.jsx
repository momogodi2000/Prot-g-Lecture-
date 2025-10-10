import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import ReservationForm from '../components/reservations/ReservationForm';
import { useBooks } from '../hooks/useBooks';
import { formatDate } from '../utils/formatters';
import storageService from '../services/storage';

const BookDetails = () => {
  const { id } = useParams();
  const { getBook } = useBooks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    try {
      const bookData = getBook(parseInt(id));
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loader size="lg" text="Chargement du livre..." />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Livre non trouvé
            </p>
            <Link to="/books">
              <Button variant="outline">
                Retour au catalogue
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isAvailable = book.statut === 'disponible' && book.exemplaires_disponibles > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link to="/books" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {book.image_couverture ? (
                <img
                  src={storageService.getImageUrl(book.image_couverture)}
                  alt={book.titre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </Card>

          {/* Reservation Button */}
          {isAvailable && (
            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={() => setShowReservationForm(true)}
            >
              Réserver ce Livre
            </Button>
          )}
        </div>

        {/* Book Info */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Category & Status */}
            <div className="flex items-center space-x-3">
              <Badge variant="primary">{book.categorie_nom}</Badge>
              <Badge variant={isAvailable ? 'success' : 'danger'}>
                {isAvailable ? 'Disponible' : 'Non disponible'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {book.titre}
            </h1>

            {/* Author */}
            <div className="flex items-center text-xl text-gray-600 dark:text-gray-400">
              <User className="h-5 w-5 mr-2" />
              <span>Par {book.auteur_nom}</span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Année de publication</p>
                <p className="font-medium text-gray-900 dark:text-white">{book.annee_publication}</p>
              </div>
              {book.editeur && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Éditeur</p>
                  <p className="font-medium text-gray-900 dark:text-white">{book.editeur}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Langue</p>
                <p className="font-medium text-gray-900 dark:text-white">{book.langue}</p>
              </div>
              {book.nombre_pages && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre de pages</p>
                  <p className="font-medium text-gray-900 dark:text-white">{book.nombre_pages}</p>
                </div>
              )}
              {book.isbn && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ISBN</p>
                  <p className="font-medium text-gray-900 dark:text-white">{book.isbn}</p>
                </div>
              )}
            </div>

            {/* Availability */}
            <Card padding="sm" className="bg-green-50 dark:bg-green-900/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {book.exemplaires_disponibles} exemplaire(s) disponible(s) sur {book.nombre_exemplaires}
              </p>
            </Card>

            {/* Summary */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Résumé
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {book.resume}
              </p>
            </div>

            {/* Tags */}
            {book.tags && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="default">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {book.auteur_biographie && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  À propos de l'auteur
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.auteur_biographie}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm
          book={book}
          isOpen={showReservationForm}
          onClose={() => setShowReservationForm(false)}
          onSuccess={() => {
            setShowReservationForm(false);
            loadBookDetails();
          }}
        />
      )}
    </div>
  );
};

export default BookDetails;

