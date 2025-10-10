import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, ArrowRight, MapPin, Clock, Heart, Award, Star } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const stats = [
    { icon: () => <img src="/assets/logo/logo.jpg" alt="Logo" className="h-12 w-12 rounded-full object-cover mx-auto" />, label: 'Livres Disponibles', value: '500+' },
    { icon: Users, label: 'Membres Actifs', value: '200+' },
    { icon: Calendar, label: 'Événements/Mois', value: '10+' },
  ];

  const testimonials = [
    {
      name: "Marie Nguembang",
      role: "Étudiante",
      content: "Ce centre a transformé ma façon de voir la lecture. L'ambiance est parfaite pour étudier et les livres disponibles sont d'une richesse incroyable.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Dr. Paul Essono",
      role: "Enseignant",
      content: "Un lieu exceptionnel pour la promotion de la culture et de l'éducation. Je recommande vivement ce centre à tous les passionnés de lecture.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Fatima Bello",
      role: "Mère de famille",
      content: "Mes enfants adorent venir ici. C'est un environnement sûr et stimulant qui encourage vraiment l'amour de la lecture.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Catalogue Riche",
      description: "Plus de 500 livres dans tous les domaines : romans, éducation, sciences, et plus encore.",
      link: "/books",
      linkText: "Explorer"
    },
    {
      icon: Users,
      title: "Groupes de Lecture",
      description: "Rejoignez des communautés de lecteurs passionnés et participez à des discussions enrichissantes.",
      link: "/groups",
      linkText: "Découvrir"
    },
    {
      icon: Calendar,
      title: "Événements Culturels",
      description: "Ateliers, conférences, rencontres d'auteurs et bien plus pour enrichir votre expérience.",
      link: "/events",
      linkText: "Voir les événements"
    }
  ];

  const highlights = [
    {
      icon: MapPin,
      title: "Localisation Idéale",
      description: "Situé au Rond-Point Express, Yaoundé, facilement accessible en transport public."
    },
    {
      icon: Clock,
      title: "Horaires Flexibles",
      description: "Ouvert du lundi au samedi, de 9h à 18h pour s'adapter à votre emploi du temps."
    },
    {
      icon: Heart,
      title: "Communauté Bienveillante",
      description: "Un environnement chaleureux où chaque visiteur se sent accueilli et valorisé."
    },
    {
      icon: Award,
      title: "Excellence Reconnue",
      description: "Centre de lecture primé pour son impact positif sur la communauté locale."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Bienvenue au Centre de Lecture
                <span className="block text-primary-600 dark:text-primary-400">Protégé QV</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                La lecture, un pont vers la connaissance et la communauté. Découvrez un espace dédié à l'apprentissage, à la culture et au partage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="relative">
              <img 
                src="/assets/logo/logo.jpg" 
                alt="Centre de Lecture Protégé QV" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-surface p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    4.9/5 - 200+ avis
                  </span>
                </div>
              </div>
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

      {/* Highlights Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pourquoi Choisir Notre Centre ?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto">
              Découvrez ce qui rend notre centre de lecture unique et spécial
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <highlight.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {highlight.title}
                </h3>
                <p className="text-primary-100 text-sm">
                  {highlight.description}
                </p>
              </div>
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
            {features.map((feature, index) => (
              <Card key={index} padding="lg" hover>
                <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <Link to={feature.link} className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center">
                  {feature.linkText}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ce Que Disent Nos Visiteurs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez les témoignages de notre communauté de lecteurs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} padding="lg" className="relative">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
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

