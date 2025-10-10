import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const InitAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { db } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfAdminExists = () => {
      if (!db) return;
      
      try {
        const existingAdmin = db.queryOne(
          'SELECT * FROM administrateurs WHERE email = ?',
          ['yvangodimomo@gmail.com']
        );
        
        if (existingAdmin) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    };

    checkIfAdminExists();
  }, [db]);

  const initializeAdmin = async () => {
    if (!db) {
      toast.error('Database not ready');
      return;
    }

    setLoading(true);

    try {
      // Check if admin already exists
      const existingAdmin = db.queryOne(
        'SELECT * FROM administrateurs WHERE firebase_uid = ?',
        ['kYw89vT9VlfXkRL1HeruzSUGrl53']
      );

      if (existingAdmin) {
        toast.success('Admin already exists in database');
        setIsInitialized(true);
        return;
      }

      // Insert the admin that was created by the script
      db.run(
        `INSERT INTO administrateurs (firebase_uid, email, nom_complet, role, statut, date_creation)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'kYw89vT9VlfXkRL1HeruzSUGrl53',
          'yvangodimomo@gmail.com',
          'momo godi yvan',
          'super_admin',
          'actif',
          new Date().toISOString()
        ]
      );

      toast.success('Super admin initialized successfully!');
      setIsInitialized(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Error initializing admin:', error);
      toast.error('Error initializing admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/assets/logo/logo.jpg" 
            alt="Protégé QV Logo" 
            className="h-16 w-16 rounded-full object-cover mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Initialize Admin
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Setup super administrator account
          </p>
        </div>

        <Card padding="lg">
          {isInitialized ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Admin Already Initialized
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Super administrator account is ready
              </p>
              <div className="space-y-2 text-sm text-left bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p><strong>Email:</strong> yvangodimomo@gmail.com</p>
                <p><strong>Role:</strong> Super Administrator</p>
              </div>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-4"
                fullWidth
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Admin Account Needs Initialization
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>The Firebase account was created but needs to be linked to the local database.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Admin Details:</h4>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong>Email:</strong> yvangodimomo@gmail.com</p>
                  <p><strong>Name:</strong> momo godi yvan</p>
                  <p><strong>Firebase UID:</strong> kYw89vT9VlfXkRL1HeruzSUGrl53</p>
                  <p><strong>Role:</strong> super_admin</p>
                </div>
              </div>

              <Button
                onClick={initializeAdmin}
                loading={loading}
                fullWidth
                size="lg"
              >
                Initialize Super Admin
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This will link the Firebase account to the local database
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InitAdmin;