import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatCard from '../../components/admin/StatCard';
import ActivityFeed from '../../components/admin/ActivityFeed';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
    <span className="text-white font-bold text-sm">📚</span>
  </div>
);

const BookIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center`}>
    <span className="text-blue-600 dark:text-blue-400">📖</span>
  </div>
);

const CheckIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center`}>
    <span className="text-green-600 dark:text-green-400">✓</span>
  </div>
);

const AlertIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center`}>
    <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
  </div>
);

const UsersIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center`}>
    <span className="text-purple-600 dark:text-purple-400">👥</span>
  </div>
);

const MailIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center`}>
    <span className="text-indigo-600 dark:text-indigo-400">✉</span>
  </div>
);

const CalendarIcon = ({ className }) => (
  <div className={`${className} rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center`}>
    <span className="text-orange-600 dark:text-orange-400">📅</span>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    pendingReservations: 0,
    totalGroups: 0,
    newsletterSubscribers: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminStats();
      
      if (response.stats) {
        const statsData = response.stats.overview;
        setStats({
          totalBooks: statsData.total_books || 0,
          availableBooks: statsData.active_reservations || 0, // Using available as active reservations for now
          pendingReservations: statsData.pending_reservations || 0,
          totalGroups: statsData.active_groups || 0,
          newsletterSubscribers: statsData.newsletter_subscribers || 0,
          unreadMessages: statsData.unread_messages || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de votre centre de lecture
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/books">
          <StatCard
            title="Livres au Catalogue"
            value={stats.totalBooks}
            icon={BookIcon}
            color="blue"
          />
        </Link>

        <Link to="/admin/books">
          <StatCard
            title="Livres Disponibles"
            value={stats.availableBooks}
            icon={CheckIcon}
            color="green"
          />
        </Link>

        <Link to="/admin/reservations">
          <StatCard
            title="Réservations en Attente"
            value={stats.pendingReservations}
            icon={AlertIcon}
            color="yellow"
          />
        </Link>

        <Link to="/admin/groups">
          <StatCard
            title="Groupes Actifs"
            value={stats.totalGroups}
            icon={UsersIcon}
            color="purple"
          />
        </Link>

        <Link to="/admin/newsletter">
          <StatCard
            title="Abonnés Newsletter"
            value={stats.newsletterSubscribers}
            icon={MailIcon}
            color="indigo"
          />
        </Link>

        <Link to="/admin/messages">
          <StatCard
            title="Messages Non Lus"
            value={stats.unreadMessages}
            icon={MailIcon}
            color="red"
          />
        </Link>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />

        <Card>
          <Card.Header>
            <Card.Title>Actions Rapides</Card.Title>
            <Card.Description>Accès rapide aux fonctionnalités</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-2">
              <Link
                to="/admin/books"
                className="block w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center">
                  <BookIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Gérer les livres
                  </span>
                </div>
              </Link>
              <Link
                to="/admin/events"
                className="block w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Gérer les événements
                  </span>
                </div>
              </Link>
              <Link
                to="/admin/groups"
                className="block w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Gérer les groupes
                  </span>
                </div>
              </Link>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

