import { useDatabase } from '../../contexts/DatabaseContext';
import Card from '../../components/common/Card';
import { useEffect, useState } from 'react';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const Statistics = () => {
  const { db } = useDatabase();
  const [stats, setStats] = useState({
    books: { total: 0, available: 0, borrowed: 0 },
    users: { totalReservations: 0, activeReservations: 0 },
    groups: { total: 0, active: 0, totalMembers: 0 },
    events: { total: 0, upcoming: 0 },
    newsletter: { total: 0, active: 0 },
    news: { total: 0, published: 0 }
  });

  useEffect(() => {
    if (db) {
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const loadStatistics = () => {
    try {
      // Books statistics
      const totalBooks = db.queryOne('SELECT COUNT(*) as count FROM livres')?.count || 0;
      const availableBooks = db.queryOne('SELECT SUM(stock_disponible) as count FROM livres WHERE statut = "disponible"')?.count || 0;
      const borrowedBooks = db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut = "prete"')?.count || 0;

      // Reservations statistics
      const totalReservations = db.queryOne('SELECT COUNT(*) as count FROM reservations')?.count || 0;
      const activeReservations = db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut IN ("active", "prete")')?.count || 0;

      // Groups statistics
      const totalGroups = db.queryOne('SELECT COUNT(*) as count FROM groupes_lecture')?.count || 0;
      const activeGroups = db.queryOne('SELECT COUNT(*) as count FROM groupes_lecture WHERE statut = "actif"')?.count || 0;
      const totalMembers = db.queryOne('SELECT SUM(nombre_membres_actuel) as count FROM groupes_lecture')?.count || 0;

      // Events statistics
      const totalEvents = db.queryOne('SELECT COUNT(*) as count FROM evenements')?.count || 0;
      const upcomingEvents = db.queryOne('SELECT COUNT(*) as count FROM evenements WHERE date_debut >= date("now")')?.count || 0;

      // Newsletter statistics
      const totalSubscribers = db.queryOne('SELECT COUNT(*) as count FROM newsletter_abonnes')?.count || 0;
      const activeSubscribers = db.queryOne('SELECT COUNT(*) as count FROM newsletter_abonnes WHERE statut = "actif"')?.count || 0;

      // News statistics
      const totalNews = db.queryOne('SELECT COUNT(*) as count FROM actualites')?.count || 0;
      const publishedNews = db.queryOne('SELECT COUNT(*) as count FROM actualites WHERE statut = "publie"')?.count || 0;

      setStats({
        books: { total: totalBooks, available: availableBooks, borrowed: borrowedBooks },
        users: { totalReservations, activeReservations },
        groups: { total: totalGroups, active: activeGroups, totalMembers },
        events: { total: totalEvents, upcoming: upcomingEvents },
        newsletter: { total: totalSubscribers, active: activeSubscribers },
        news: { total: totalNews, published: publishedNews }
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistiques
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de l'activité du centre
        </p>
      </div>

      {/* Books Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Livres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Livres</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.books.total}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Disponibles</p>
                <p className="text-3xl font-bold text-green-600">{stats.books.available}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empruntés</p>
                <p className="text-3xl font-bold text-blue-600">{stats.books.borrowed}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
        </div>
      </div>

      {/* Reservations Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Réservations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Réservations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users.totalReservations}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Actives</p>
                <p className="text-3xl font-bold text-green-600">{stats.users.activeReservations}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
        </div>
      </div>

      {/* Groups Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Groupes de Lecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Groupes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.groups.total}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Actifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.groups.active}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Membres</p>
                <p className="text-3xl font-bold text-blue-600">{stats.groups.totalMembers}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
        </div>
      </div>

      {/* Events Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Événements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Événements</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.events.total}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">À venir</p>
                <p className="text-3xl font-bold text-green-600">{stats.events.upcoming}</p>
              </div>
              <LogoIcon className="h-12 w-12" />
            </div>
          </Card>
        </div>
      </div>

      {/* Newsletter & News Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Newsletter
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newsletter.total}</p>
                </div>
                <LogoIcon className="h-10 w-10" />
              </div>
            </Card>
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.newsletter.active}</p>
                </div>
                <LogoIcon className="h-10 w-10" />
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Actualités
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.news.total}</p>
                </div>
                <LogoIcon className="h-10 w-10" />
              </div>
            </Card>
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Publiées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.news.published}</p>
                </div>
                <LogoIcon className="h-10 w-10" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
