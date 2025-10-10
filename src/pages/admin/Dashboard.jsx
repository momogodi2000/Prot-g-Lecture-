import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Mail, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/admin/StatCard';
import ActivityFeed from '../../components/admin/ActivityFeed';
import { useDatabase } from '../../contexts/DatabaseContext';

const Dashboard = () => {
  const { db } = useDatabase();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    pendingReservations: 0,
    totalGroups: 0,
    newsletterSubscribers: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const totalBooksResult = db.queryOne('SELECT COUNT(*) as count FROM livres');
      const availableBooksResult = db.queryOne(
        'SELECT COUNT(*) as count FROM livres WHERE statut = ?',
        ['disponible']
      );
      const pendingReservationsResult = db.queryOne(
        'SELECT COUNT(*) as count FROM reservations WHERE statut = ?',
        ['en_attente']
      );
      const totalGroupsResult = db.queryOne(
        'SELECT COUNT(*) as count FROM groupes_lecture WHERE statut = ?',
        ['actif']
      );
      const newsletterResult = db.queryOne(
        'SELECT COUNT(*) as count FROM newsletter_abonnes WHERE statut = ?',
        ['actif']
      );
      const unreadMessagesResult = db.queryOne(
        'SELECT COUNT(*) as count FROM messages_contact WHERE statut = ?',
        ['non_lu']
      );

      setStats({
        totalBooks: totalBooksResult?.count || 0,
        availableBooks: availableBooksResult?.count || 0,
        pendingReservations: pendingReservationsResult?.count || 0,
        totalGroups: totalGroupsResult?.count || 0,
        newsletterSubscribers: newsletterResult?.count || 0,
        unreadMessages: unreadMessagesResult?.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
            icon={BookOpen}
            color="blue"
          />
        </Link>

        <Link to="/admin/books">
          <StatCard
            title="Livres Disponibles"
            value={stats.availableBooks}
            icon={CheckCircle}
            color="green"
          />
        </Link>

        <Link to="/admin/reservations">
          <StatCard
            title="Réservations en Attente"
            value={stats.pendingReservations}
            icon={AlertCircle}
            color="yellow"
          />
        </Link>

        <Link to="/admin/groups">
          <StatCard
            title="Groupes Actifs"
            value={stats.totalGroups}
            icon={Users}
            color="purple"
          />
        </Link>

        <Link to="/admin/newsletter">
          <StatCard
            title="Abonnés Newsletter"
            value={stats.newsletterSubscribers}
            icon={Mail}
            color="indigo"
          />
        </Link>

        <Link to="/admin/messages">
          <StatCard
            title="Messages Non Lus"
            value={stats.unreadMessages}
            icon={Mail}
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
                  <BookOpen className="h-5 w-5 text-primary-500 mr-3" />
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
                  <Calendar className="h-5 w-5 text-primary-500 mr-3" />
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
                  <Users className="h-5 w-5 text-primary-500 mr-3" />
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

