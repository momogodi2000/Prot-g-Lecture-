import { createContext, useContext, useState, useEffect } from 'react';
import databaseService from '../services/database';
import Loader from '../components/common/Loader';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await databaseService.initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err.message);
      }
    };

    initializeDatabase();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Erreur d'initialisation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <Loader 
        fullScreen 
        size="xl" 
        text="Initialisation de la base de données..."
      />
    );
  }

  const value = {
    db: databaseService,
    isInitialized
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;

