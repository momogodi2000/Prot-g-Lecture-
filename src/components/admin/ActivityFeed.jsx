import { useEffect, useState } from 'react';
import apiService from '../../services/api';
import { formatRelativeTime } from '../../utils/formatters';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Mail,
  Newspaper,
  MessageSquare 
} from 'lucide-react';

const ActivityFeed = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [limit]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await apiService.getActivityLog({ limit });
      setActivities(response.logs || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (module) => {
    const icons = {
      livres: BookOpen,
      reservations: Calendar,
      groupes: Users,
      evenements: Calendar,
      actualites: Newspaper,
      contact: MessageSquare,
      newsletter: Mail,
      administration: Users
    };
    return icons[module] || BookOpen;
  };

  const getActivityColor = (action) => {
    if (action.includes('création') || action.includes('ajout')) return 'success';
    if (action.includes('suppression')) return 'danger';
    if (action.includes('modification')) return 'warning';
    return 'info';
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Activité Récente</Card.Title>
        <Card.Description>Dernières actions sur la plateforme</Card.Description>
      </Card.Header>
      
      <Card.Content>
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Chargement...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.module);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <ActivityIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.utilisateur_nom || 'Système'}</span>
                      {' • '}
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getActivityColor(activity.action)} size="sm">
                        {activity.module}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(activity.date_action)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default ActivityFeed;

