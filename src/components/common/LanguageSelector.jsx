import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Change language"
      >
        <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
          {i18n.language}
        </span>
      </button>
    </div>
  );
};

export default LanguageSelector;

