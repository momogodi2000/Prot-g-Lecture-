import { BookOpen, Target, Heart, Users, Award, Globe } from 'lucide-react';
import Card from '../components/common/Card';

const About = () => {
  const values = [
    {
      icon: BookOpen,
      title: 'Promotion de la Lecture',
      description: 'Nous encourageons la lecture comme moyen d\'enrichissement personnel et de développement communautaire.'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Nous créons des espaces d\'échange et de partage autour de la passion commune pour les livres.'
    },
    {
      icon: Target,
      title: 'Accessibilité',
      description: 'Nous rendons la culture et le savoir accessibles à tous, gratuitement ou à prix réduit.'
    },
    {
      icon: Heart,
      title: 'Engagement',
      description: 'Nous nous engageons pour l\'éducation et le développement durable au Cameroun.'
    }
  ];

  const achievements = [
    { icon: BookOpen, value: '500+', label: 'Livres au Catalogue' },
    { icon: Users, value: '200+', label: 'Membres Actifs' },
    { icon: Award, value: '50+', label: 'Événements Organisés' },
    { icon: Globe, value: '3', label: 'Années d\'Expérience' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            À Propos de Protégé QV ONG
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une organisation engagée pour la promotion de l'éducation, 
            la culture et le développement durable au Cameroun
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Notre Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Protégé QV ONG a pour mission de promouvoir l'accès à la lecture et à la culture 
                pour tous les citoyens du Cameroun, en particulier les jeunes et les communautés défavorisées.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                À travers notre Centre de Lecture et nos programmes éducatifs, nous créons des espaces 
                d'apprentissage, d'échange et de développement personnel.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Notre Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Devenir le centre de référence pour la promotion de la lecture et de l'éducation 
                culturelle au Cameroun et en Afrique Centrale.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Nous aspirons à construire une société où chaque individu a accès aux ressources 
                éducatives nécessaires pour réaliser son plein potentiel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Valeurs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Les principes qui guident nos actions au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} padding="lg" className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <value.icon className="h-8 w-8 text-primary-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Réalisations
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <achievement.icon className="h-12 w-12 text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Visitez Notre Centre
          </h2>
          <p className="text-primary-100 mb-2 text-lg">
            Rond-Point Express, Yaoundé, Cameroun
          </p>
          <p className="text-primary-100 mb-8">
            Ouvert du lundi au samedi, de 9h à 18h
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;

