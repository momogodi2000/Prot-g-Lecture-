import { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useDatabase } from '../../contexts/DatabaseContext';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const Settings = () => {
  const { db } = useDatabase();
  const [saving, setSaving] = useState(false);

  const handleBackup = () => {
    try {
      db.backup();
      toast.success('Sauvegarde créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await db.restore(file);
      toast.success('Base de données restaurée avec succès');
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de la restauration');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configurez les paramètres système
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card padding="lg">
          <div className="flex items-center space-x-2 mb-6">
            <LogoIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Informations Générales</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Nom du Centre"
              defaultValue="Centre de Lecture Protégé QV"
              icon={LogoIcon}
            />
            <Input
              label="Adresse"
              defaultValue="Rond point Express, Biyem-Assi, Yaoundé"
              icon={LogoIcon}
            />
            <Input
              label="Téléphone"
              defaultValue="+237 699 936 028"
              icon={LogoIcon}
            />
            <Input
              label="Email"
              type="email"
              defaultValue="mail@protegeqv.org"
              icon={LogoIcon}
            />
          </div>
        </Card>

        {/* Database Settings */}
        <Card padding="lg">
          <div className="flex items-center space-x-2 mb-6">
            <LogoIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Base de Données</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Sauvegardez ou restaurez votre base de données
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleBackup}
                  icon={LogoIcon}
                >
                  Télécharger Sauvegarde
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".db,.sqlite,.sqlite3"
                    onChange={handleRestore}
                    className="hidden"
                    id="restore-file"
                  />
                  <label htmlFor="restore-file" className="block">
                    <Button
                      variant="outline"
                      fullWidth
                      icon={LogoIcon}
                      onClick={() => document.getElementById('restore-file').click()}
                    >
                      Restaurer depuis un Fichier
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Statut</span>
                <span className="text-green-600 font-medium">✓ Connectée</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card padding="lg">
          <div className="flex items-center space-x-2 mb-6">
            <LogoIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Notifications Email
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des emails pour les événements importants
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Notifications Push
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications dans le navigateur
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card padding="lg">
          <div className="flex items-center space-x-2 mb-6">
            <LogoIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <Select
              label="Durée de Session"
              defaultValue="30"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
            </Select>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Authentification à 2 facteurs
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sécurité renforcée
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          icon={LogoIcon}
          loading={saving}
          onClick={() => {
            setSaving(true);
            setTimeout(() => {
              toast.success('Paramètres enregistrés');
              setSaving(false);
            }, 1000);
          }}
        >
          Enregistrer les Modifications
        </Button>
      </div>
    </div>
  );
};

export default Settings;

