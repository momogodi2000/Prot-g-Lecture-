import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>

          <div className="text-center mb-8">
            <img 
              src="/assets/logo/logo.jpg" 
              alt="Protégé QV Logo" 
              className="h-16 w-16 rounded-full object-cover mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Administration
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte administrateur
            </p>
          </div>

          <Card padding="lg" className="backdrop-blur-sm bg-white/90 dark:bg-dark-surface/90">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@protegeqv.org"
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Se souvenir de moi
                  </label>
                </div>

                <button
                  type="button"
                  className="text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
              >
                Se connecter
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Espace réservé aux administrateurs de Protégé QV ONG
          </p>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <h3 className="text-3xl font-bold mb-6">
            Gestion du Centre de Lecture
          </h3>
          <p className="text-primary-100 text-lg mb-8">
            Administrez efficacement votre bibliothèque, gérez les réservations, 
            animez la communauté et suivez les statistiques d'utilisation.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Gestion des Contacts</h4>
                <p className="text-primary-200 text-sm">Répondez aux messages et gérez la newsletter</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Sécurité Renforcée</h4>
                <p className="text-primary-200 text-sm">Accès protégé avec authentification sécurisée</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10">
          <img 
            src="/assets/logo/logo.jpg" 
            alt="Logo" 
            className="w-64 h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

