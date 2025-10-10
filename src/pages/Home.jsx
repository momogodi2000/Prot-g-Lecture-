import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const stats = [
    { icon: BookOpen, label: 'Livres Disponibles', value: '500+' },
    { icon: Users, label: 'Membres Actifs', value: '200+' },
    { icon: Calendar, label: 'Événements/Mois', value: '10+' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenue au Centre de Lecture
              <span className="block text-primary-600 dark:text-primary-400">Protégé QV</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              La lecture, un pont vers la connaissance et la communauté
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/books">
                <Button size="lg" icon={BookOpen}>
                  Explorer le Catalogue
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  En Savoir Plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center" hover>
                <stat.icon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez tout ce que notre centre de lecture a à vous offrir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card padding="lg">
              <BookOpen className="h-12 w-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Catalogue Riche
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Plus de 500 livres dans tous les domaines : romans, éducation, sciences, et plus encore.
              </p>
              <Link to="/books" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center">
                Explorer
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Card>

            <Card padding="lg">
              <Users className="h-12 w-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Groupes de Lecture
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Rejoignez des communautés de lecteurs passionnés et participez à des discussions enrichissantes.
              </p>
              <Link to="/groups" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center">
                Découvrir
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Card>

            <Card padding="lg">
              <Calendar className="h-12 w-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Événements Culturels
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ateliers, conférences, rencontres d'auteurs et bien plus pour enrichir votre expérience.
              </p>
              <Link to="/events" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center">
                Voir les événements
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre aventure de lecture ?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Réservez votre créneau dès maintenant et venez découvrir notre collection
          </p>
          <Link to="/books">
            <Button size="lg" variant="secondary">
              Réserver un Livre
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

