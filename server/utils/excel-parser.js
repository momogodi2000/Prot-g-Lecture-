import XLSX from 'xlsx';

export function parseExcelFile(fileBuffer) {
  try {
    // Read the Excel file from buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    
    // Map Excel columns to database fields
    return data.map(row => {
      // Handle both French and English column names
      return {
        titre: row['Titre'] || row['Title'] || '',
        auteur: row['Auteur'] || row['Author'] || '',
        editeur: row['Éditeur'] || row['Editeur'] || row['Publisher'] || '',
        annee_publication: row['Année de publication'] || row['Annee de publication'] || row['Publication Year'] || null,
        isbn: row['ISBN'] || '',
        langue: row['Langue'] || row['Language'] || 'Français',
        categories: row['Catégories'] || row['Categories'] || '',
        nombre_exemplaires: row['Nombre d\'exemplaires'] || row['Copies'] || '1',
        emplacement: row['Emplacement'] || row['Location'] || '',
        etat: row['État'] || row['Etat'] || row['Status'] || 'Disponible',
        description: row['Description'] || '',
        mots_cles: row['Mots-clés'] || row['Mots cles'] || row['Keywords'] || '',
        notes: row['Notes'] || ''
      };
    });
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
}