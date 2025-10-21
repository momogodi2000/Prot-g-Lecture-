import { useState, useEffect } from 'react';
import { FileExcelIcon, FileCsvIcon } from '../common/Icons';
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
    
    if (!['csv', 'txt', 'xlsx', 'xls'].includes(fileExtension)) {
      toast.error('Seuls les fichiers CSV, XLSX et XLS sont acceptés');
      return;
    }

    parseFile(selectedFile);
  };

  const parseFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Try to use the validation endpoint first
      const response = await apiService.request('/admin/books/import/validate', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for multipart/form-data
        }
      });

      if (response.success) {
        setPreview(response.preview);
        setStep(2);
        toast.success(`${response.preview.length} livres détectés`);
        return;
      }
    } catch (error) {
      console.warn('Validation endpoint failed, trying local parsing:', error);
    }

    // Fallback: parse locally
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let parsedBooks = [];

      if (fileExtension === 'csv' || fileExtension === 'txt') {
        // Parse CSV file
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        parsedBooks = lines.slice(1).map((line, index) => {
          if (!line.trim()) return null;
          
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const book = {};
          
          headers.forEach((header, idx) => {
            book[header.toLowerCase()] = values[idx] || '';
          });

          // Map to standard format
          return {
            rowNumber: index + 2,
            valid: !!(book.title || book.titre) && !!(book.author || book.auteur),
            title: book.title || book.titre || '',
            author: book.author || book.auteur || '',
            genre: book.genre || book.catégorie || 'Général',
            publication_year: parseInt(book.année || book.year || book['publication_year']) || new Date().getFullYear(),
            language: book.langue || book.language || 'Français',
            description: book.description || '',
            copies_available: parseInt(book.quantity || book['copies_available'] || book.quantité) || 1,
            location: book.location || 'Général'
          };
        }).filter(book => book && book.valid);
      }

      setPreview(parsedBooks);
      setStep(2);
      toast.success(`${parsedBooks.length} livres détectés`);
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Erreur lors de la lecture du fichier');
    }
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
          // Generate unique book_id if not provided
          const book_id = book.book_id || `IMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Create book using the new Book table structure
          const response = await apiService.createAdminBook({
            book_id: book_id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            publication_year: book.publication_year,
            language: book.language,
            description: book.description,
            copies_available: book.copies_available,
            location: book.location
          });

          if (response && response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error importing book ${book.title}:`, error);
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
                        {book.title || <span className="text-red-500">Manquant</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {book.author || <span className="text-red-500">Manquant</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {book.genre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {book.copies_available}
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
