import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function restoreDatabase() {
  const backupPath = path.join(process.cwd(), 'backup.db');
  const dbPath = path.join(process.cwd(), 'database.sqlite');

  if (fs.existsSync(backupPath)) {
    console.log('📦 Restoring database from backup...');
    fs.copyFileSync(backupPath, dbPath);
    return true;
  }
  return false;
}