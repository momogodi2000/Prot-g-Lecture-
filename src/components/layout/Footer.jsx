import { Link } from 'react-router-dom';
import { MailIcon, MapPinIcon, PhoneIcon } from '../common/Icons';
import { useState } from 'react';
import { useNewsletter } from '../../hooks/useNewsletter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subscribe } = useNewsletter();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubscribing(true);
      await subscribe(email);
      setEmail('');
    } catch (error) {
      // Error handled by useNewsletter hook
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/assets/logo/logo.jpg" 
                alt="Protégé QV Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
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
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>Rond point Express, Biyem-Assi, Yaoundé, Cameroun</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>+237 699 936 028</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MailIcon className="h-4 w-4 mr-2" />
                <span>mail@protegeqv.org</span>
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
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
                           bg-white dark:bg-dark-surface text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 
                         text-white text-sm font-medium rounded-md transition-colors"
              >
                {isSubscribing ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>
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

