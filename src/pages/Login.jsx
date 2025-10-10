import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administration
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous à votre compte administrateur
          </p>
        </div>

        <Card padding="lg">
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
            >
              Se connecter
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Espace réservé aux administrateurs
        </p>
      </div>
    </div>
  );
};

export default Login;

