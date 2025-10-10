#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration for Node.js (using fallback values)
const firebaseConfig = {
  apiKey: "AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q",
  authDomain: "protegeqv-2532f.firebaseapp.com",
  projectId: "protegeqv-2532f",
  storageBucket: "protegeqv-2532f.firebasestorage.app",
  messagingSenderId: "553100729963",
  appId: "1:553100729963:web:1f4fba71360fe864be1b2e",
  measurementId: "G-N3NB5PWT1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Database path
const DB_PATH = join(__dirname, '..', 'database.sqlite');
const SCHEMA_PATH = join(__dirname, '..', 'public', 'schema.sql');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function initSuperAdmin() {
  console.log('\n🔐 ===================================');
  console.log('   INITIALISATION SUPER ADMINISTRATEUR');
  console.log('   Protégé Lecture+ v1.0');
  console.log('===================================\n');

  try {
    const email = await question('📧 Email: ');
    const password = await question('🔑 Mot de passe (min. 8 caractères): ');
    const nomComplet = await question('👤 Nom complet: ');

    console.log('\n⏳ Création du compte administrateur...\n');

    // Initialize database
    await databaseService.initialize();

    // Create Firebase account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;

    // Insert into SQLite
    databaseService.run(
      `INSERT INTO administrateurs (firebase_uid, email, nom_complet, role, statut)
       VALUES (?, ?, ?, ?, ?)`,
      [firebaseUid, email, nomComplet, 'super_admin', 'actif']
    );

    console.log('✅ =====================================');
    console.log('   SUPER ADMIN CRÉÉ AVEC SUCCÈS !');
    console.log('=====================================');
    console.log(`\n📧 Email: ${email}`);
    console.log(`👤 Nom: ${nomComplet}`);
    console.log(`🔑 UID Firebase: ${firebaseUid}`);
    console.log(`🎯 Rôle: Super Administrateur\n`);
    console.log('🌐 Vous pouvez maintenant vous connecter à:');
    console.log('   http://localhost:5173/login\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.log('\n💡 Conseils:');
    console.log('   - Le mot de passe doit contenir au moins 8 caractères');
    console.log('   - Vérifiez votre connexion internet (Firebase)');
    console.log('   - Assurez-vous que l\'email n\'est pas déjà utilisé\n');
    rl.close();
    process.exit(1);
  }
}

initSuperAdmin();

