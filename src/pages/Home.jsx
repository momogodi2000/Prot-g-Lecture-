import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { BookOpenIcon, UsersIcon, CalendarIcon, StarIcon } from '../components/common/Icons';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      icon: BookOpenIcon, 
      label: 'Livres Disponibles', 
      value: '500+',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      icon: UsersIcon, 
      label: 'Membres Actifs', 
      value: '200+',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      icon: CalendarIcon, 
      label: 'Événements/Mois', 
      value: '10+',
      color: 'from-green-500 to-teal-600'
    },
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
      icon: BookOpenIcon,
      title: "Catalogue Riche",
      description: "Plus de 500 livres dans tous les domaines : romans, éducation, sciences, et plus encore.",
      link: "/books",
      linkText: "Explorer",
      delay: "0ms"
    },
    {
      icon: UsersIcon,
      title: "Groupes de Lecture",
      description: "Rejoignez des communautés de lecteurs passionnés et participez à des discussions enrichissantes.",
      link: "/groups",
      linkText: "Découvrir",
      delay: "150ms"
    },
    {
      icon: CalendarIcon,
      title: "Événements Culturels",
      description: "Ateliers, conférences, rencontres d'auteurs et bien plus pour enrichir votre expérience.",
      link: "/events",
      linkText: "Voir les événements",
      delay: "300ms"
    }
  ];

  const highlights = [
    {
      icon: LogoIcon,
      title: "Localisation Idéale",
      description: "Situé au Rond-Point Express, Yaoundé, facilement accessible en transport public."
    },
    {
      icon: LogoIcon,
      title: "Horaires Flexibles",
      description: "Ouvert du lundi au samedi, de 9h à 18h pour s'adapter à votre emploi du temps."
    },
    {
      icon: LogoIcon,
      title: "Communauté Bienveillante",
      description: "Un environnement chaleureux où chaque visiteur se sent accueilli et valorisé."
    },
    {
      icon: LogoIcon,
      title: "Excellence Reconnue",
      description: "Centre de lecture primé pour son impact positif sur la communauté locale."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-primary-900/20 dark:via-dark-surface dark:to-primary-800/20 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="block animate-fade-in-up">Bienvenue au Centre de Lecture</span>
                <span className="block text-primary-600 dark:text-primary-400 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  Protégé QV
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                La lecture, un pont vers la connaissance et la communauté. Découvrez un espace dédié à l'apprentissage, à la culture et au partage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <Link to="/books">
                  <Button size="lg" className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    Explorer le Catalogue
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    En Savoir Plus
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              <div className="relative group">
                <img 
                  src="/assets/logo/logo.jpg" 
                  alt="Centre de Lecture Protégé QV" 
                  className="w-full h-auto rounded-lg shadow-2xl transform group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-surface p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
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
      <section className="py-16 bg-white dark:bg-dark-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`transform transition-all duration-700 delay-${index * 150} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <Card className={`text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${stat.color} from-opacity-5 to-opacity-10 border-0`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="p-4 bg-white/80 dark:bg-dark-surface/80 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-10 w-10 text-primary-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </Card>
              </div>
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
              <div 
                key={index}
                className={`transform transition-all duration-700 ${feature.delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <Card 
                  padding="lg" 
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-dark-surface dark:to-gray-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link 
                      to={feature.link} 
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center transform group-hover:translate-x-2 transition-all duration-300"
                    >
                      {feature.linkText}
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </Card>
              </div>
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
                    <LogoIcon key={i} className="h-4 w-4" />
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

