import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Protégé Lecture+
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Centre de Lecture et Bibliothèque Communautaire de Protégé QV ONG. 
              La lecture, un pont vers la connaissance et la communauté.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Rond-Point Express, Yaoundé, Cameroun</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>+237 6XX XX XX XX</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@protegeqv.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/books" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
                  Groupes de Lecture
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-4">
              Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Restez informé de nos actualités et événements.
            </p>
            <Link
              to="/newsletter"
              className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Protégé QV ONG. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

