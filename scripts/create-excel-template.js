import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create template workbook
const wb = XLSX.utils.book_new();

// Define headers
const headers = [
  'Titre',
  'Auteur',
  'Éditeur',
  'Année de publication',
  'ISBN',
  'Langue',
  'Catégories',
  'Nombre d\'exemplaires',
  'Emplacement',
  'État',
  'Description',
  'Mots-clés',
  'Notes'
];

// Create example data
const exampleData = [
  headers,
  [
    'Le Petit Prince',
    'Antoine de Saint-Exupéry',
    'Gallimard',
    '1943',
    '978-2-07-040850-4',
    'Français',
    'Fiction, Jeunesse',
    '1',
    'Étagère A1',
    'Bon état',
    'Un conte poétique qui aborde les thèmes de l\'amour, l\'amitié et le sens de la vie',
    'conte, philosophie, jeunesse',
    'Edition originale'
  ]
];

// Create worksheet
const ws = XLSX.utils.aoa_to_sheet(exampleData);

// Set column widths
const colWidths = [
  { wch: 30 }, // Titre
  { wch: 25 }, // Auteur
  { wch: 20 }, // Éditeur
  { wch: 10 }, // Année
  { wch: 15 }, // ISBN
  { wch: 10 }, // Langue
  { wch: 25 }, // Catégories
  { wch: 10 }, // Nombre d'exemplaires
  { wch: 15 }, // Emplacement
  { wch: 15 }, // État
  { wch: 40 }, // Description
  { wch: 30 }, // Mots-clés
  { wch: 30 }, // Notes
];

ws['!cols'] = colWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Modèle Import');

// Write to file
const templatePath = path.join(__dirname, '../../public/templates/books-import-template.xlsx');
XLSX.writeFile(wb, templatePath);

console.log('Template Excel créé avec succès :', templatePath);