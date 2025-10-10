import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { BOOK_STATUS_OPTIONS, LANGUAGE_OPTIONS } from '../../utils/constants';

const LogoIcon = ({ className }) => (
  <img src="/assets/logo/logo.jpg" alt="Icon" className={`${className} rounded object-cover`} />
);

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db } = useDatabase();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [formData, setFormData] = useState({
    titre: '',
    auteur_id: '',
    categorie_id: '',
    isbn: '',
    editeur: '',
    annee_publication: '',
    langue: 'FR',
    nombre_pages: '',
    description: '',
    couverture_url: '',
    stock_total: '',
    emplacement: '',
    prix_achat: '',
    mots_cles: '',
    statut: 'disponible'
  });

  useEffect(() => {
    if (db) {
      loadAuthorsAndCategories();
      if (isEditMode) {
        loadBook();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, id]);

  const loadAuthorsAndCategories = () => {
    try {
      const authorsData = db.query('SELECT * FROM auteurs ORDER BY nom_complet');
      const categoriesData = db.query('SELECT * FROM categories ORDER BY ordre_affichage, nom');
      setAuthors(authorsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const loadBook = () => {
    try {
      const book = db.queryOne('SELECT * FROM livres WHERE id = ?', [id]);
      if (book) {
        setFormData({
          titre: book.titre || '',
          auteur_id: book.auteur_id || '',
          categorie_id: book.categorie_id || '',
          isbn: book.isbn || '',
          editeur: book.editeur || '',
          annee_publication: book.annee_publication || '',
          langue: book.langue || 'fr',
          nombre_pages: book.nombre_pages || '',
          description: book.description || '',
          couverture_url: book.couverture_url || '',
          stock_total: book.stock_total || '',
          emplacement: book.emplacement || '',
          prix_achat: book.prix_achat || '',
          mots_cles: book.mots_cles || '',
          statut: book.statut || 'disponible'
        });
        setImagePreview(book.couverture_url);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      toast.error('Erreur lors du chargement du livre');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAuthor = () => {
    if (!newAuthorName.trim()) {
      toast.error('Veuillez entrer le nom de l\'auteur');
      return;
    }

    try {
      db.run(
        'INSERT INTO auteurs (nom_complet, date_ajout) VALUES (?, ?)',
        [newAuthorName.trim(), new Date().toISOString()]
      );
      
      const newId = db.queryOne('SELECT last_insert_rowid() as id')?.id;
      
      loadAuthorsAndCategories();
      setFormData(prev => ({ ...prev, auteur_id: newId }));
      setNewAuthorName('');
      setShowNewAuthor(false);
      toast.success('Auteur ajouté avec succès');
    } catch (error) {
      console.error('Error adding author:', error);
      toast.error('Erreur lors de l\'ajout de l\'auteur');
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Veuillez entrer le nom de la catégorie');
      return;
    }

    try {
      db.run(
        'INSERT INTO categories (nom, date_ajout) VALUES (?, ?)',
        [newCategoryName.trim(), new Date().toISOString()]
      );
      
      const newId = db.queryOne('SELECT last_insert_rowid() as id')?.id;
      
      loadAuthorsAndCategories();
      setFormData(prev => ({ ...prev, categorie_id: newId }));
      setNewCategoryName('');
      setShowNewCategory(false);
      toast.success('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    }
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
        setFormData(prev => ({ ...prev, couverture_url: base64String }));
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
        // Update existing book
        db.run(
          `UPDATE livres SET 
            titre = ?, auteur_id = ?, categorie_id = ?, isbn = ?, 
            editeur = ?, annee_publication = ?, langue = ?, nombre_pages = ?,
            description = ?, couverture_url = ?, stock_total = ?, 
            emplacement = ?, prix_achat = ?, mots_cles = ?, statut = ?
          WHERE id = ?`,
          [
            formData.titre, formData.auteur_id, formData.categorie_id, formData.isbn,
            formData.editeur, formData.annee_publication, formData.langue, formData.nombre_pages,
            formData.description, formData.couverture_url, formData.stock_total,
            formData.emplacement, formData.prix_achat, formData.mots_cles, formData.statut,
            id
          ]
        );
        toast.success('Livre mis à jour avec succès');
      } else {
        // Create new book
        db.run(
          `INSERT INTO livres (
            titre, auteur_id, categorie_id, isbn, editeur, annee_publication, 
            langue, nombre_pages, description, couverture_url, stock_total, 
            stock_disponible, emplacement, prix_achat, mots_cles, statut, date_ajout
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            formData.titre, formData.auteur_id, formData.categorie_id, formData.isbn,
            formData.editeur, formData.annee_publication, formData.langue, formData.nombre_pages,
            formData.description, formData.couverture_url, formData.stock_total,
            formData.stock_total, formData.emplacement, formData.prix_achat, 
            formData.mots_cles, formData.statut, new Date().toISOString()
          ]
        );
        toast.success('Livre ajouté avec succès');
      }

      navigate('/admin/books');
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Erreur lors de l\'enregistrement du livre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Modifier le Livre' : 'Ajouter un Livre'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode ? 'Modifiez les informations du livre' : 'Ajoutez un nouveau livre au catalogue'}
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image de Couverture
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-24 object-cover rounded-lg shadow"
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
            <Input
              label="Titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              icon={LogoIcon}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auteur <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Select
                  name="auteur_id"
                  value={formData.auteur_id}
                  onChange={handleChange}
                  required
                  className="flex-1"
                  options={[
                    { value: '', label: 'Sélectionner un auteur' },
                    ...authors.map(author => ({
                      value: author.id,
                      label: author.nom_complet
                    }))
                  ]}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewAuthor(!showNewAuthor)}
                  icon={LogoIcon}
                >
                  +
                </Button>
              </div>
              {showNewAuthor && (
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Nom de l'auteur"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddAuthor} size="sm">
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewAuthor(false);
                      setNewAuthorName('');
                    }}
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Select
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  required
                  className="flex-1"
                  options={[
                    { value: '', label: 'Sélectionner une catégorie' },
                    ...categories.map(category => ({
                      value: category.id,
                      label: category.nom
                    }))
                  ]}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  icon={LogoIcon}
                >
                  +
                </Button>
              </div>
              {showNewCategory && (
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Nom de la catégorie"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddCategory} size="sm">
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName('');
                    }}
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>

            <Input
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Input
              label="Éditeur"
              name="editeur"
              value={formData.editeur}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Input
              label="Année de Publication"
              name="annee_publication"
              type="number"
              value={formData.annee_publication}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Select
              label="Langue"
              name="langue"
              value={formData.langue}
              onChange={handleChange}
              options={LANGUAGE_OPTIONS}
            />

            <Input
              label="Nombre de Pages"
              name="nombre_pages"
              type="number"
              value={formData.nombre_pages}
              onChange={handleChange}
              icon={LogoIcon}
            />

            <Input
              label="Stock Total"
              name="stock_total"
              type="number"
              value={formData.stock_total}
              onChange={handleChange}
              required
              icon={LogoIcon}
            />

            <Input
              label="Emplacement"
              name="emplacement"
              value={formData.emplacement}
              onChange={handleChange}
              placeholder="ex: A-12-5"
              icon={LogoIcon}
            />

            <Input
              label="Prix d'Achat (FCFA) - Optionnel"
              name="prix_achat"
              type="number"
              value={formData.prix_achat}
              onChange={handleChange}
              icon={LogoIcon}
              placeholder="Prix optionnel"
            />

            <Select
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              options={BOOK_STATUS_OPTIONS}
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez le livre..."
          />

          <Input
            label="Mots-clés (séparés par des virgules)"
            name="mots_cles"
            value={formData.mots_cles}
            onChange={handleChange}
            placeholder="roman, aventure, jeunesse"
            icon={LogoIcon}
          />

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/books')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookForm;
