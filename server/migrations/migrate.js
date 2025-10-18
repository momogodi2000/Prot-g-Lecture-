import { initializeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

function runMigrations() {
  try {
    console.log('🚀 Starting database migration...');
    
    const db = initializeDatabase();
    
    console.log('✅ Database migration completed successfully');
    console.log('📊 Database tables and indexes created');
    console.log('🌱 Default data inserted (categories, system parameters)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
