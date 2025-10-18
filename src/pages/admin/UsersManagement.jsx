import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const UsersManagement = () => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nomComplet: '',
    telephone: '',
    role: 'admin'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminUsers();
      setAdmins(response.users || []);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSuperAdmin()) {
      toast.error('Seul le super admin peut créer des utilisateurs');
      return;
    }

    setLoading(true);

    try {
      await apiService.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        nomComplet: formData.nomComplet,
        role: formData.role
      });

      toast.success('Administrateur créé avec succès');
      loadAdmins();
      setShowModal(false);
      setFormData({
        email: '',
        password: '',
        nomComplet: '',
        telephone: '',
        role: 'admin'
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    if (!isSuperAdmin()) {
      toast.error('Action réservée au super admin');
      return;
    }

    try {
      const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
      await apiService.updateUserStatus(id, newStatus);
      toast.success('Statut mis à jour');
      loadAdmins();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteAdmin = (id) => {
    if (!isSuperAdmin()) {
      toast.error('Action réservée au super admin');
      return;
    }

    if (id === currentAdmin.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      try {
        db.run('DELETE FROM administrateurs WHERE id = ?', [id]);
        toast.success('Administrateur supprimé');
        loadAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Card>
        <div className="text-center py-12">
          <LogoIcon className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Accès Restreint
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Seul le super administrateur peut gérer les utilisateurs
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les administrateurs du système
          </p>
        </div>
        <Button icon={LogoIcon} onClick={() => setShowModal(true)}>
          Ajouter un Admin
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {admin.nomComplet}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {admin.telephone || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={admin.role === 'super_admin' ? 'danger' : 'primary'}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={admin.statut === 'actif' ? 'success' : 'default'}>
                      {admin.statut}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(admin.id, admin.statut)}
                        disabled={admin.role === 'super_admin'}
                      >
                        {admin.statut === 'actif' ? 'Désactiver' : 'Activer'}
                      </Button>
                      {admin.role !== 'super_admin' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteAdmin(admin.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Admin Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Ajouter un Administrateur"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom Complet"
            name="nomComplet"
            value={formData.nomComplet}
            onChange={handleChange}
            required
            icon={LogoIcon}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={LogoIcon}
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            icon={LogoIcon}
          />

          <Input
            label="Téléphone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            icon={LogoIcon}
          />

          <Select
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="admin">Administrateur</option>
            <option value="super_admin">Super Administrateur</option>
          </Select>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersManagement;
