import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const GroupForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db } = useDatabase();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: 'Littérature Générale',
    nombre_membres_max: '',
    jour_rencontre: '',
    heure_rencontre: '',
    lieu: '',
    statut: 'actif',
    image_url: '',
    moderateur_nom: '',
    moderateur_email: ''
  });

  useEffect(() => {
    if (db && isEditMode) {
      loadGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, id]);

  const loadGroup = () => {
    try {
      const group = db.queryOne('SELECT * FROM groupes_lecture WHERE id = ?', [id]);
      if (group) {
        setFormData({
          nom: group.nom || '',
          description: group.description || '',
          categorie: group.categorie || 'Littérature Générale',
          nombre_membres_max: group.nombre_membres_max || '',
          jour_rencontre: group.jour_rencontre || '',
          heure_rencontre: group.heure_rencontre || '',
          lieu: group.lieu || '',
          statut: group.statut || 'actif',
          image_url: group.image_url || '',
          moderateur_nom: group.moderateur_nom || '',
          moderateur_email: group.moderateur_email || ''
        });
        setImagePreview(group.image_url);
      }
    } catch (error) {
      console.error('Error loading group:', error);
      toast.error('Erreur lors du chargement du groupe');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5 Mo');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image_url: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!db) {
      toast.error('Base de données non disponible');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        db.run(
          `UPDATE groupes_lecture SET 
            nom = ?, description = ?, categorie = ?, nombre_membres_max = ?,
            jour_rencontre = ?, heure_rencontre = ?, lieu = ?, statut = ?,
            image_url = ?, moderateur_nom = ?, moderateur_email = ?
          WHERE id = ?`,
          [
            formData.nom, formData.description, formData.categorie, formData.nombre_membres_max,
            formData.jour_rencontre, formData.heure_rencontre, formData.lieu, formData.statut,
            formData.image_url, formData.moderateur_nom, formData.moderateur_email, id
          ]
        );
        toast.success('Groupe mis à jour avec succès');
      } else {
        db.run(
          `INSERT INTO groupes_lecture (
            nom, description, categorie, nombre_membres_max, nombre_membres_actuel,
            jour_rencontre, heure_rencontre, lieu, statut, image_url,
            moderateur_nom, moderateur_email, date_creation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            formData.nom, formData.description, formData.categorie, formData.nombre_membres_max, 0,
            formData.jour_rencontre, formData.heure_rencontre, formData.lieu, formData.statut,
            formData.image_url, formData.moderateur_nom, formData.moderateur_email,
            new Date().toISOString()
          ]
        );
        toast.success('Groupe créé avec succès');
      }

      navigate('/admin/groups');
    } catch (error) {
      console.error('Error saving group:', error);
      toast.error('Erreur lors de l\'enregistrement du groupe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Modifier le Groupe' : 'Créer un Groupe de Lecture'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode ? 'Modifiez les informations du groupe' : 'Créez une nouvelle communauté de lecteurs'}
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image du Groupe
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg shadow"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900/20 dark:file:text-primary-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG jusqu'à 5 Mo
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nom du Groupe"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                icon={LogoIcon}
              />
            </div>

            <Select
              label="Catégorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            >
              <option value="Littérature Générale">Littérature Générale</option>
              <option value="Romans Policiers">Romans Policiers</option>
              <option value="Science-Fiction">Science-Fiction</option>
              <option value="Développement Personnel">Développement Personnel</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Classiques">Classiques</option>
              <option value="Autre">Autre</option>
            </Select>

            <Input
              label="Nombre Maximum de Membres"
              name="nombre_membres_max"
              type="number"
              value={formData.nombre_membres_max}
              onChange={handleChange}
              required
              icon={LogoIcon}
            />

            <Input
              label="Jour de Rencontre"
              name="jour_rencontre"
              value={formData.jour_rencontre}
              onChange={handleChange}
              placeholder="ex: Samedi"
              icon={LogoIcon}
            />

            <Input
              label="Heure de Rencontre"
              name="heure_rencontre"
              type="time"
              value={formData.heure_rencontre}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <div className="md:col-span-2">
              <Input
                label="Lieu de Rencontre"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
                placeholder="ex: Salle de lecture principale"
                icon={LogoIcon}
              />
            </div>

            <Input
              label="Nom du Modérateur"
              name="moderateur_nom"
              value={formData.moderateur_nom}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Input
              label="Email du Modérateur"
              name="moderateur_email"
              type="email"
              value={formData.moderateur_email}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Select
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
            >
              <option value="actif">Actif</option>
              <option value="complet">Complet</option>
              <option value="pause">En Pause</option>
              <option value="archive">Archivé</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez le groupe, ses objectifs, son ambiance..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/groups')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GroupForm;
