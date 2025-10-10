#!/usr/bin/env node

import databaseService from '../src/services/database.js';

async function initializeDatabase() {
  console.log('\n📚 ===================================');
  console.log('   INITIALISATION BASE DE DONNÉES');
  console.log('   Protégé Lecture+ v1.0');
  console.log('===================================\n');

  try {
    console.log('⏳ Initialisation de SQLite avec sql.js...');
    await databaseService.initialize();

    console.log('✅ Base de données initialisée avec succès!\n');
    console.log('📊 Tables créées:');
    console.log('   - administrateurs');
    console.log('   - auteurs');
    console.log('   - categories');
    console.log('   - livres');
    console.log('   - reservations');
    console.log('   - groupes_lecture');
    console.log('   - membres_groupes');
    console.log('   - activites_groupes');
    console.log('   - evenements');
    console.log('   - actualites');
    console.log('   - messages_contact');
    console.log('   - newsletter_abonnes');
    console.log('   - newsletter_envois');
    console.log('   - statistiques_journalieres');
    console.log('   - logs_activite');
    console.log('   - parametres_systeme\n');

    console.log('✅ Données initiales insérées:');
    console.log('   - 8 catégories de livres');
    console.log('   - Paramètres système par défaut\n');

    console.log('🎉 La base de données est prête à l\'emploi!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.log('\n💡 Vérifiez:');
    console.log('   - Le fichier schema.sql existe dans public/');
    console.log('   - Vous avez les droits d\'accès nécessaires\n');
    process.exit(1);
  }
}

initializeDatabase();

