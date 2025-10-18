import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Calendar, BookOpen, MapPin, Mail, Phone, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { useGroups } from '../hooks/useGroups';
import { formatDate } from '../utils/formatters';
import storageService from '../services/storage';

const GroupDetails = () => {
  const { id } = useParams();
  const { getGroup } = useGroups();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroupDetails();
  }, [id]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const groupData = await getGroup(parseInt(id));
      setGroup(groupData);
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loader size="lg" text="Chargement du groupe..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Groupe non trouvé
            </p>
            <Link to="/groups">
              <Button variant="outline">
                Retour aux groupes
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
      <Link to="/groups" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux groupes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Group Image & Basic Info */}
        <div className="lg:col-span-1">
          <Card padding="none" className="mb-6">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {group.image_couverture ? (
                <img
                  src={storageService.getImageUrl(group.image_couverture)}
                  alt={group.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </Card>

          {/* Theme & Status */}
          <div className="flex items-center space-x-3 mb-6">
            <Badge variant="primary">{group.theme}</Badge>
            <Badge variant={getStatusVariant(group.statut)}>
              {group.statut === 'actif' ? 'Actif' : group.statut}
            </Badge>
          </div>

          {/* Member Count */}
          <Card padding="sm" className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.nombre_membres || 0} membre(s)
              </span>
            </div>
          </Card>

          {/* Join Button for active groups */}
          {group.statut === 'actif' && (
            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={() => {
                // TODO: Implement join group functionality
                alert('Fonctionnalité de rejoindre le groupe à implémenter');
              }}
            >
              Rejoindre ce groupe
            </Button>
          )}
        </div>

        {/* Group Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {group.nom}
            </h1>

            {/* Description */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                À propos du groupe
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {group.description}
                </p>
              </div>
            </Card>

            {/* Group Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.prochaine_rencontre && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Prochaine rencontre</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(group.prochaine_rencontre)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {group.lieu_rencontre && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lieu des rencontres</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {group.lieu_rencontre}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {group.frequence_rencontres && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fréquence</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {group.frequence_rencontres}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {group.contact_email && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                      <a 
                        href={`mailto:${group.contact_email}`}
                        className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {group.contact_email}
                      </a>
                    </div>
                  </div>
                </Card>
              )}

              {group.contact_telephone && (
                <Card padding="sm">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                      <a 
                        href={`tel:${group.contact_telephone}`}
                        className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {group.contact_telephone}
                      </a>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Book of the Month */}
            {group.livre_du_mois_titre && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Livre du mois
                </h2>
                <div className="flex items-start space-x-4">
                  <BookOpen className="h-8 w-8 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {group.livre_du_mois_titre}
                    </h3>
                    {group.livre_du_mois_auteur && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Par {group.livre_du_mois_auteur}
                      </p>
                    )}
                    {group.livre_du_mois_description && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {group.livre_du_mois_description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Additional Info */}
            {(group.objectifs || group.regles || group.tags) && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Informations supplémentaires
                </h2>
                <div className="space-y-4">
                  {group.objectifs && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Objectifs du groupe
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {group.objectifs}
                      </p>
                    </div>
                  )}
                  
                  {group.regles && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Règles du groupe
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {group.regles}
                      </p>
                    </div>
                  )}
                  
                  {group.tags && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.split(',').map((tag, index) => (
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

            {/* Members Section */}
            {group.membres && group.membres.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Membres du groupe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.membres.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.nom_complet || 'Membre anonyme'}
                        </p>
                        {member.date_inscription && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Depuis {formatDate(member.date_inscription)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
