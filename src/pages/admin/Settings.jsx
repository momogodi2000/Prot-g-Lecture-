import { useState } from 'react';
import { Save, Database, Bell, Globe, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useDatabase } from '../../contexts/DatabaseContext';
import toast from 'react-hot-toast';

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
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary-500" />
              <Card.Title>Informations Générales</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <Input
                label="Nom du Centre"
                defaultValue="Centre de Lecture Protégé QV"
              />
              <Input
                label="Adresse"
                defaultValue="Rond-Point Express, Yaoundé"
              />
              <Input
                label="Téléphone"
                defaultValue="+237 6XX XX XX XX"
              />
              <Input
                label="Email"
                type="email"
                defaultValue="contact@protegeqv.org"
              />
            </div>
          </Card.Content>
        </Card>

        {/* Database Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary-500" />
              <Card.Title>Base de Données</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
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
                    icon={Database}
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
                    <label htmlFor="restore-file">
                      <Button
                        as="span"
                        variant="outline"
                        fullWidth
                        icon={Database}
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
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary-500" />
              <Card.Title>Notifications</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <Card.Title>Sécurité</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <Select
                label="Durée de Session"
                defaultValue="30"
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 heure' },
                  { value: '120', label: '2 heures' }
                ]}
              />

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
          </Card.Content>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          icon={Save}
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

