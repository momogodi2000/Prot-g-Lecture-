import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'Actualité',
    image_url: '',
    statut: 'publie'
  });

  useEffect(() => {
    if (db && isEditMode) {
      loadNews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, id]);

  const loadNews = () => {
    try {
      const news = db.queryOne('SELECT * FROM actualites WHERE id = ?', [id]);
      if (news) {
        setFormData({
          titre: news.titre || '',
          contenu: news.contenu || '',
          categorie: news.categorie || 'Actualité',
          image_url: news.image_url || '',
          statut: news.statut || 'publie'
        });
        setImagePreview(news.image_url);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Erreur lors du chargement de l\'actualité');
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
    
    if (!db || !currentAdmin) {
      toast.error('Vous devez être connecté');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        db.run(
          `UPDATE actualites SET 
            titre = ?, contenu = ?, categorie = ?, image_url = ?, statut = ?
          WHERE id = ?`,
          [
            formData.titre, formData.contenu, formData.categorie, 
            formData.image_url, formData.statut, id
          ]
        );
        toast.success('Actualité mise à jour avec succès');
      } else {
        db.run(
          `INSERT INTO actualites (
            titre, contenu, categorie, image_url, statut, auteur_id, date_publication
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            formData.titre, formData.contenu, formData.categorie, 
            formData.image_url, formData.statut, currentAdmin.id,
            new Date().toISOString()
          ]
        );
        toast.success('Actualité créée avec succès');
      }

      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Modifier l\'Actualité' : 'Nouvelle Actualité'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode ? 'Modifiez les informations de l\'actualité' : 'Publiez une nouvelle actualité'}
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image de l'Actualité
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-48 object-cover rounded-lg shadow"
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
                label="Titre"
                name="titre"
                value={formData.titre}
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
              <option value="Actualité">Actualité</option>
              <option value="Événement">Événement</option>
              <option value="Communiqué">Communiqué</option>
              <option value="Nouveauté">Nouveauté</option>
              <option value="Annonce">Annonce</option>
            </Select>

            <Select
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
            >
              <option value="publie">Publié</option>
              <option value="brouillon">Brouillon</option>
              <option value="archive">Archivé</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Contenu"
              name="contenu"
              value={formData.contenu}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Rédigez le contenu de l'actualité..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/news')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Publier'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewsForm;
