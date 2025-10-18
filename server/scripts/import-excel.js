import XLSX from 'xlsx';
import { initializeDatabase } from '../config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importExcelToDatabase() {
  try {
    console.log('📊 Starting Excel import...');
    
    // Initialize database
    const db = await initializeDatabase();
    
    // Path to your Excel file
    const excelPath = path.join(process.cwd(), 'Exceel-sheet-book', 'Inventaire de la bibliothèque Protege QV.xlsx');
    
    console.log(`📁 Reading Excel file: ${excelPath}`);
    
    // Read Excel file
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📋 Found ${jsonData.length} rows in Excel file`);
    
    if (jsonData.length < 2) {
      console.log('❌ No data rows found in Excel file');
      return;
    }
    
    // First row is headers, get them
    const headers = jsonData[0];
    console.log('📋 Headers found:', headers);
    
    // Skip header row and process data
    const dataRows = jsonData.slice(1);
    
    // Get admin for adding books
    const admin = db.prepare('SELECT id FROM administrateurs LIMIT 1').get();
    if (!admin) {
      console.log('❌ No admin found. Please run seed script first.');
      return;
    }
    
    // Get default category for books without category
    let defaultCategory = db.prepare('SELECT id FROM categories WHERE nom = ?').get('Général');
    if (!defaultCategory) {
      // Create a default category if it doesn't exist
      const createCategory = db.prepare(`
        INSERT INTO categories (nom, description, couleur_hex, ordre_affichage)
        VALUES (?, ?, ?, ?)
      `);
      const result = createCategory.run('Général', 'Livre sans catégorie spécifique', '#A5D6A7', 999);
      defaultCategory = { id: result.lastInsertRowid };
    }
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Prepare statements for better performance
    const findAuthor = db.prepare('SELECT id FROM auteurs WHERE nom_complet = ?');
    const createAuthor = db.prepare(`
      INSERT INTO auteurs (nom_complet, biographie, nationalite)
      VALUES (?, ?, ?)
    `);
    const findCategory = db.prepare('SELECT id FROM categories WHERE nom = ?');
    const createCategory = db.prepare(`
      INSERT INTO categories (nom, description, couleur_hex, ordre_affichage)
      VALUES (?, ?, ?, ?)
    `);
    const insertBook = db.prepare(`
      INSERT INTO livres (
        titre, auteur_id, resume, categorie_id, annee_publication, 
        langue, nombre_exemplaires, exemplaires_disponibles,
        nombre_pages, editeur, isbn, ajoute_par
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      try {
        // Map Excel columns to our expected data
        // You may need to adjust these mappings based on your Excel structure
        const bookData = mapRowToBookData(row, headers);
        
        if (!bookData.titre || !bookData.auteur) {
          console.log(`⚠️ Skipping row ${i + 2}: Missing title or author`);
          skippedCount++;
          continue;
        }
        
        // Find or create author
        let author = findAuthor.get(bookData.auteur);
        if (!author) {
          console.log(`  ✍️ Creating author: ${bookData.auteur}`);
          const authorResult = createAuthor.run(
            bookData.auteur,
            `Auteur de "${bookData.titre}"`,
            bookData.nationalite || null
          );
          author = { id: authorResult.lastInsertRowid };
        }
        
        // Find or create category
        let category = findCategory.get(bookData.categorie || 'Général');
        if (!category && bookData.categorie) {
          console.log(`  📚 Creating category: ${bookData.categorie}`);
          const categoryResult = createCategory.run(
            bookData.categorie,
            `Catégorie: ${bookData.categorie}`,
            '#A5D6A7',
            500
          );
          category = { id: categoryResult.lastInsertRowid };
        } else if (!category) {
          category = defaultCategory;
        }
        
        // Insert book
        insertBook.run(
          bookData.titre,
          author.id,
          bookData.resume || `Livre: ${bookData.titre}`,
          category.id,
          bookData.annee_publication || new Date().getFullYear(),
          bookData.langue || 'FR',
          bookData.nombre_exemplaires || 1,
          bookData.nombre_exemplaires || 1,
          bookData.nombre_pages || null,
          bookData.editeur || null,
          bookData.isbn || null,
          admin.id
        );
        
        console.log(`  ✅ Imported: ${bookData.titre} by ${bookData.auteur}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error importing row ${i + 2}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} books`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`⚠️ Skipped: ${skippedCount}`);
    console.log('🎉 Excel import completed!');
    
  } catch (error) {
    console.error('❌ Excel import failed:', error);
    process.exit(1);
  }
}

function mapRowToBookData(row, headers) {
  // Create a mapping object from headers to row data
  const data = {};
  headers.forEach((header, index) => {
    if (header && row[index] !== undefined) {
      data[header.toLowerCase().trim()] = row[index];
    }
  });
  
  // Map common Excel column names to our database fields
  // You may need to adjust these based on your actual Excel headers
  return {
    titre: cleanValue(data.titre || data.nom || data.title || data['nom du livre'] || data['titre du livre']),
    auteur: cleanValue(data.auteur || data.author || data['nom auteur'] || data['nom de l\'auteur']),
    resume: cleanValue(data.resume || data.description || data.synopsis || data['résumé']),
    categorie: cleanValue(data.categorie || data.category || data['catégorie'] || data.type),
    annee_publication: parseInt(cleanValue(data['annee publication'] || data['année'] || data.year || data.date)),
    langue: cleanValue(data.langue || data.language || 'FR'),
    nombre_pages: parseInt(cleanValue(data.pages || data['nombre pages'] || data['nb pages'])),
    nombre_exemplaires: parseInt(cleanValue(data.quantite || data['nombre exemplaires'] || data.stock || 1)),
    editeur: cleanValue(data.editeur || data.publisher || data['maison édition']),
    isbn: cleanValue(data.isbn || data['numéro isbn'] || data['no isbn']),
    nationalite: cleanValue(data.nationalite || data.nationality || 'Inconnue')
  };
}

function cleanValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }
  return value;
}

// Run the import
importExcelToDatabase().then(() => {
  console.log('Import process finished');
  process.exit(0);
}).catch((error) => {
  console.error('Import process failed:', error);
  process.exit(1);
});
