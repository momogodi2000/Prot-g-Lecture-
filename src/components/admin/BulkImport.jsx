import { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';

export default function BulkImport({ isOpen, onClose, onSuccess }) {
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Import
  const [existingAuthors, setExistingAuthors] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]);

  // Load existing authors and categories when component mounts
  useEffect(() => {
    if (isOpen) {
      loadExistingData();
    }
  }, [isOpen]);

  const loadExistingData = async () => {
    try {
      const [authorsResponse, categoriesResponse] = await Promise.all([
        apiService.getAuthors(),
        apiService.getCategories()
      ]);
      
      setExistingAuthors(authorsResponse.authors || []);
      setExistingCategories(categoriesResponse.categories || []);
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'txt'].includes(fileExtension)) {
      toast.error('Seuls les fichiers CSV et TXT sont acceptés');
      return;
    }

    parseFile(selectedFile);
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row if present
        const dataLines = lines[0].toLowerCase().includes('titre') ? lines.slice(1) : lines;
        
        const parsedBooks = dataLines.map((line, index) => {
          // Support both comma and semicolon separators
          const separator = line.includes(';') ? ';' : ',';
          const fields = line.split(separator).map(f => f.trim().replace(/^"|"$/g, ''));
          
          return {
            rowNumber: index + 1,
            title_fr: fields[0] || '',
            title_en: fields[1] || fields[0] || '', // Use French title as fallback
            author: fields[2] || 'Inconnu',
            isbn: fields[3] || '',
            category: fields[4] || 'Non classé',
            language: fields[5] || 'fr',
            pages: fields[6] ? parseInt(fields[6]) : null,
            publisher: fields[7] || '',
            publication_year: fields[8] ? parseInt(fields[8]) : null,
            quantity: fields[9] ? parseInt(fields[9]) : 1,
            price: fields[10] ? parseFloat(fields[10]) : null,
            description_fr: fields[11] || '',
            description_en: fields[12] || '',
            valid: !!(fields[0] && fields[2]) // Must have title and author
          };
        }).filter(book => book.title_fr); // Remove empty rows

        setPreview(parsedBooks);
        setStep(2);
        toast.success(`${parsedBooks.length} livres détectés`);
      } catch (error) {
        console.error('Parse error:', error);
        toast.error('Erreur lors de la lecture du fichier');
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const book of preview) {
        if (!book.valid) {
          errorCount++;
          continue;
        }

        try {
          // Find or create author
          let existingAuthor = existingAuthors.find(author => 
            author.nom_complet.toLowerCase() === book.author.toLowerCase()
          );
          let authorId;

          if (existingAuthor) {
            authorId = existingAuthor.id;
          } else {
            // Create new author
            const authorResponse = await apiService.createAuthor({
              nom_complet: book.author
            });
            authorId = authorResponse.authorId;
            
            // Add to local cache
            setExistingAuthors(prev => [...prev, {
              id: authorId,
              nom_complet: book.author
            }]);
          }

          // Find or create category
          let existingCategory = existingCategories.find(category => 
            category.nom.toLowerCase() === book.category.toLowerCase()
          );
          let categoryId;

          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            // Create new category
            const categoryResponse = await apiService.createCategory({
              nom: book.category
            });
            categoryId = categoryResponse.categoryId;
            
            // Add to local cache
            setExistingCategories(prev => [...prev, {
              id: categoryId,
              nom: book.category
            }]);
          }

          // Create book - map fields to match API expected format
          await apiService.createBook({
            titre: book.title_fr,
            resume: book.description_fr || book.description_en || 'Imported book',
            auteur_id: authorId,
            categorie_id: categoryId,
            annee_publication: book.publication_year || new Date().getFullYear(),
            langue: book.language?.toUpperCase() === 'FR' ? 'FR' : 'EN',
            nombre_exemplaires: book.quantity || 1,
            isbn: book.isbn || null,
            editeur: book.publisher || null,
            nombre_pages: book.pages || null,
            image_couverture: null,
            tags: null,
            cote: null,
            statut: 'disponible'
          });

          successCount++;
        } catch (error) {
          console.error(`Error importing book ${book.title_fr}:`, error);
          errorCount++;
        }
      }

      toast.success(`${successCount} livres importés avec succès${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur lors de l\'importation');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setPreview([]);
    setStep(1);
    onClose();
  };

  const downloadTemplate = () => {
    const template = `Titre (FR),Titre (EN),Auteur,ISBN,Catégorie,Langue,Pages,Éditeur,Année,Quantité,Prix,Description (FR),Description (EN)
Le Petit Prince,The Little Prince,Antoine de Saint-Exupéry,978-0156012195,Littérature,fr,96,Gallimard,1943,5,15000,Un conte philosophique,"A philosophical tale"
1984,1984,George Orwell,978-0451524935,Science-Fiction,en,328,Secker & Warburg,1949,3,20000,Roman dystopique,"Dystopian novel"`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modele_import_livres.csv';
    link.click();
    toast.success('Modèle téléchargé');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importation en Masse"
      size="xl"
    >
      <div className="space-y-6">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Format du fichier CSV
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                Colonnes requises (dans l'ordre) :
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside space-y-1">
                <li>Titre (FR) - Obligatoire</li>
                <li>Titre (EN) - Optionnel</li>
                <li>Auteur - Obligatoire</li>
                <li>ISBN - Optionnel</li>
                <li>Catégorie - Optionnel (par défaut: "Non classé")</li>
                <li>Langue - Optionnel (par défaut: "fr")</li>
                <li>Pages - Optionnel</li>
                <li>Éditeur - Optionnel</li>
                <li>Année de Publication - Optionnel</li>
                <li>Quantité - Optionnel (par défaut: 1)</li>
                <li>Prix - Optionnel</li>
                <li>Description (FR) - Optionnel</li>
                <li>Description (EN) - Optionnel</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={downloadTemplate}
                size="sm"
              >
                📥 Télécharger le Modèle CSV
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sélectionner un fichier CSV
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  dark:file:bg-primary-900 dark:file:text-primary-300
                  hover:file:bg-primary-100 dark:hover:file:bg-primary-800
                  cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && preview.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Aperçu - {preview.filter(b => b.valid).length} livres valides
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStep(1)}
              >
                ← Retour
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto border dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Titre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Auteur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Qté
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {preview.map((book, index) => (
                    <tr key={index} className={!book.valid ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {book.rowNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {book.title_fr || <span className="text-red-500">Manquant</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {book.author || <span className="text-red-500">Manquant</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {book.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {book.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {book.valid ? (
                          <span className="text-green-600 dark:text-green-400">✓ Valide</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">✗ Invalide</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                onClick={handleImport}
                disabled={importing || preview.filter(b => b.valid).length === 0}
              >
                {importing ? 'Importation...' : `Importer ${preview.filter(b => b.valid).length} Livres`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
