import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../utils/formatters';
import storageService from '../services/storage';

const EventDetails = () => {
  const { id } = useParams();
  const { getEvent } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await getEvent(parseInt(id));
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loader size="lg" text="Chargement de l'événement..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Événement non trouvé
            </p>
            <Link to="/events">
              <Button variant="outline">
                Retour aux événements
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link to="/events" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux événements
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Image & Basic Info */}
        <div className="lg:col-span-1">
          <Card padding="none" className="mb-6">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {event.image_principale ? (
                <img
                  src={storageService.getImageUrl(event.image_principale)}
                  alt={event.titre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </Card>

          {/* Event Type & Status */}
          <div className="flex items-center space-x-3 mb-6">
            <Badge variant={getTypeVariant(event.type)}>
              {getTypeLabel(event.type)}
            </Badge>
            <Badge variant={event.statut === 'publie' ? 'success' : 'default'}>
              {event.statut === 'publie' ? 'Publié' : event.statut}
            </Badge>
          </div>

          {/* External Link */}
          {event.lien_externe && (
            <Button
              as="a"
              href={event.lien_externe}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              fullWidth
              className="mb-4"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Lien externe
            </Button>
          )}
        </div>

        {/* Event Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {event.titre}
            </h1>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de début</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(event.date_debut)}
                    </p>
                  </div>
                </div>
              </Card>

              {event.date_fin && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date de fin</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(event.date_fin)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {event.lieu && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lieu</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.lieu}</p>
                    </div>
                  </div>
                </Card>
              )}

              {event.groupe_nom && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Groupe lié</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.groupe_nom}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Description */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </Card>

            {/* Additional Info */}
            {(event.livre_lie_titre || event.tags) && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Informations supplémentaires
                </h2>
                <div className="space-y-4">
                  {event.livre_lie_titre && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Livre lié
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.livre_lie_titre}
                      </p>
                    </div>
                  )}
                  
                  {event.tags && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="default">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
