import { BookOpenIcon, TargetIcon, HeartIcon, UsersIcon, AwardIcon, GlobeIcon, MapPinIcon, ClockIcon, PhoneIcon, MailIcon } from '../components/common/Icons';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: BookOpenIcon,
      title: 'Promotion de la Lecture',
      description: 'Nous encourageons la lecture comme moyen d\'enrichissement personnel et de développement communautaire.'
    },
    {
      icon: UsersIcon,
      title: 'Communauté',
      description: 'Nous créons des espaces d\'échange et de partage autour de la passion commune pour les livres.'
    },
    {
      icon: TargetIcon,
      title: 'Accessibilité',
      description: 'Nous rendons la culture et le savoir accessibles à tous, gratuitement ou à prix réduit.'
    },
    {
      icon: HeartIcon,
      title: 'Engagement',
      description: 'Nous nous engageons pour l\'éducation et le développement durable au Cameroun.'
    }
  ];

  const achievements = [
    { icon: BookOpenIcon, value: '500+', label: 'Livres au Catalogue' },
    { icon: UsersIcon, value: '200+', label: 'Membres Actifs' },
    { icon: AwardIcon, value: '50+', label: 'Événements Organisés' },
    { icon: GlobeIcon, value: '29', label: 'Années d\'Expérience' }
  ];

  const team = [
    {
      name: "Marie Nguembang",
      role: "Directrice Générale",
      description: "Passionnée d'éducation et de littérature, Marie dirige l'ONG avec vision et dévouement.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. Paul Essono",
      role: "Coordinateur Académique",
      description: "Expert en pédagogie, Paul supervise nos programmes éducatifs et culturels.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Fatima Bello",
      role: "Responsable Communautaire",
      description: "Fatima anime nos groupes de lecture et organise les événements communautaires.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const services = [
    {
      title: "Consultation sur Place",
      description: "Accès gratuit à notre collection de plus de 500 livres dans un cadre calme et studieux.",
      icon: BookOpenIcon
    },
    {
      title: "Groupes de Lecture",
      description: "Rejoignez nos communautés thématiques pour discuter et partager vos découvertes littéraires.",
      icon: UsersIcon
    },
    {
      title: "Événements Culturels",
      description: "Ateliers, conférences, rencontres d'auteurs pour enrichir votre expérience culturelle.",
      icon: AwardIcon
    },
    {
      title: "Programmes Éducatifs",
      description: "Soutien scolaire, alphabétisation et formations pour tous les âges.",
      icon: TargetIcon
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                À Propos de Protégé QV ONG
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                PROTEGE QV entendez PROmotion des TEchnologies Garantes de l'Environnement et de la Qualité de Vie, est une association de droit camerounais, créée en 1995, et déclarée sous le N° 00036/RDA/JO6/BAPP en 1996.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg">
                    Nous Contacter
                  </Button>
                </Link>
                <Link to="/books">
                  <Button size="lg" variant="outline">
                    Découvrir le Catalogue
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/logo/logo.jpg" 
                alt="Centre de Lecture Protégé QV" 
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-primary-500/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Des services diversifiés pour répondre aux besoins de notre communauté
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} padding="lg" className="text-center" hover>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <service.icon className="h-8 w-8 text-primary-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
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

      {/* Notre Histoire */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Histoire
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A la faveur les lois sur les libertés de 1990, PROTEGE QV a été créée en février 1995 par le régime de déclaration, conforme à la Loi N° 90/053 du 19 décembre 1990 portant Liberté d'Association au Cameroun.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Les domaines d'intérêt de l'organisation ont évolué en fonction de la conjoncture. Partie d'un axe unique sur la protection de l'environnement, PROTEGE QV s'est intéressé ensuite à la promotion du leadership féminin, à l'appui à la micro-entreprise et enfin aux technologies de l'information pour le développement qui s'est imposé avec l'avènement des TIC comme ingrédient transversal d'amélioration de l'efficacité des programmes.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quelques dates clés :
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>1995</strong> : Lancement des activités
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>1996</strong> : Formalisation du caractère légal de la jeune association, 1er atelier de sensibilisation aux foyers améliorés
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>1998</strong> : Signature du contrat de Partenariat N°1 avec le MINCOF, 1er atelier sur le leadership local
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2000</strong> : Emménagement au siège actuel sis Rond-Point Express du quartier Biyem-Assi
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2002</strong> : Accueil du premier volontaire, M. Thomas SABUM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2003</strong> : Accueil du premier volontaire TIC, M. Guy-Cédric MBOUOPDA, Lauréat du « Seed Grant and Innovation Project Award » et obtention du 1er financement international de Global Knowledge Partnership
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2004</strong> : Prix de l'intégration remis par l'Ambassadeur des Etats Unis au Cameroun
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2005</strong> : Accueil du premier stagiaire, M. Baptiste DUBOIS venant de la France, Lauréat du COL-PROTEIN Award
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2006</strong> : Formalisation du partenariat avec Association for Progressive Communications (APC)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2008</strong> : Partenariat avec Alternatives Canada
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2010</strong> : Lauréat du Prix de la meilleure organisation du Software Freedom Day
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2012</strong> : Création de PROVARESSC à Yaoundé
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>2018</strong> : PROTEGE QV devient membre du Conseil d'Administration de Association for Progressive Communication
                  </p>
                </div>
              </div>
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

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Équipe
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Des professionnels passionnés au service de l'éducation et de la culture
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} padding="lg" className="text-center" hover>
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-500 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">
                Visitez Notre Centre
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-3 text-primary-200" />
                  <span className="text-primary-100">
                    Rond point Express, Biyem-Assi, Yaoundé, Cameroun
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 mr-3 text-primary-200" />
                  <span className="text-primary-100">
                    Lundi - Samedi: 9h00 - 18h00
                  </span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-6 w-6 mr-3 text-primary-200" />
                  <span className="text-primary-100">
                    +237 699 936 028
                  </span>
                </div>
                <div className="flex items-center">
                  <MailIcon className="h-6 w-6 mr-3 text-primary-200" />
                  <span className="text-primary-100">
                    mail@protegeqv.org
                  </span>
                </div>
              </div>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Nous Contacter
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Horaires d'Ouverture
                </h3>
                <div className="space-y-2 text-primary-100">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-primary-300">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

