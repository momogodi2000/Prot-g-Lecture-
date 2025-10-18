import { initializeDatabase } from '../server/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function resetAdmin() {
  try {
    console.log('🔄 Resetting admin user...');
    
    const db = await initializeDatabase();

    const email = 'yvangodimomo@gmail.com';
    const password = '@Douala237';
    const nomComplet = 'Super Administrateur';

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if admin exists
    const existingAdmin = db.prepare('SELECT id FROM administrateurs WHERE email = ?').get(email);
    
    if (existingAdmin) {
      // Update existing admin
      db.prepare(`
        UPDATE administrateurs 
        SET password_hash = ?, nom_complet = ?, role = 'super_admin', statut = 'actif'
        WHERE email = ?
      `).run(passwordHash, nomComplet, email);
      
      console.log(`✅ Admin user updated`);
    } else {
      // Create new admin
      const result = db.prepare(`
        INSERT INTO administrateurs (email, password_hash, nom_complet, role, statut, date_creation)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(email, passwordHash, nomComplet, 'super_admin', 'actif', new Date().toISOString());
      
      console.log(`✅ Admin user created with ID: ${result.lastInsertRowid}`);
    }

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('✅ Admin user reset completed!');
    
  } catch (error) {
    console.error('❌ Admin reset failed:', error);
    process.exit(1);
  }
}

resetAdmin().then(() => {
  console.log('Admin reset process finished');
  process.exit(0);
});
