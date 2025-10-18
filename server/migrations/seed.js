import { initializeDatabase, getDatabase } from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const db = await initializeDatabase();

    // 1. Create super admin if doesn't exist
    await createSuperAdmin(db);

    // 2. Seed default categories if empty
    await seedCategories(db);

    // 3. Seed sample authors if empty
    await seedAuthors(db);

    // 4. Seed sample books if empty
    await seedSampleBooks(db);

    // 5. Seed sample events if empty
    await seedSampleEvents(db);

    // 6. Seed sample groups if empty
    await seedSampleGroups(db);

    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

async function createSuperAdmin(db) {
  const existingAdmin = db.prepare('SELECT COUNT(*) as count FROM administrateurs').get();
  
  if (existingAdmin.count === 0) {
    console.log('👤 Creating initial super admin...');
    
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!';
    const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@protegeqv.org';
    const nomComplet = process.env.INITIAL_ADMIN_NAME || 'Super Administrateur';
    
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const result = db.prepare(`
      INSERT INTO administrateurs (email, password_hash, nom_complet, role, statut, date_creation)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(email, passwordHash, nomComplet, 'super_admin', 'actif', new Date().toISOString());

    console.log(`✅ Super admin created with ID: ${result.lastInsertRowid}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  } else {
    console.log('✅ Admin users already exist, skipping admin creation');
  }
}

async function seedCategories(db) {
  const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  if (categoriesCount.count === 0) {
    console.log('📚 Seeding categories...');
    
    const categories = [
      ['Romans', 'Romans et œuvres de fiction littéraire', '#A5D6A7', '📖', 1],
      ['Éducation', 'Livres éducatifs et manuels scolaires', '#81C784', '🎓', 2],
      ['Sciences', 'Ouvrages scientifiques et techniques', '#66BB6A', '🔬', 3],
      ['Histoire', 'Livres d\'histoire et biographies', '#4CAF50', '📜', 4],
      ['Jeunesse', 'Livres pour enfants et adolescents', '#43A047', '👶', 5],
      ['Développement Personnel', 'Livres de croissance personnelle et bien-être', '#388E3C', '🧘', 6],
      ['Culture', 'Arts, culture et société', '#2E7D32', '🎭', 7],
      ['Religion & Philosophie', 'Ouvrages religieux et philosophiques', '#1B5E20', '🕊️', 8],
      ['Médecine & Santé', 'Livres de médecine et santé', '#7CB342', '⚕️', 9],
      ['Informatique', 'Livres d\'informatique et technologie', '#689F38', '💻', 10]
    ];

    const insertCategory = db.prepare(`
      INSERT INTO categories (nom, description, couleur_hex, icone, ordre_affichage)
      VALUES (?, ?, ?, ?, ?)
    `);

    categories.forEach((category, index) => {
      insertCategory.run(category);
      console.log(`  ✅ Added category: ${category[0]}`);
    });

    console.log(`📚 Created ${categories.length} categories`);
  } else {
    console.log('📚 Categories already exist, skipping');
  }
}

async function seedAuthors(db) {
  const authorsCount = db.prepare('SELECT COUNT(*) as count FROM auteurs').get();
  
  if (authorsCount.count === 0) {
    console.log('✍️ Seeding sample authors...');
    
    const authors = [
      ['Victor Hugo', 'Écrivain, poète et dramaturge français', 'Française', '1802-02-26'],
      ['George Orwell', 'Écrivain et journaliste britannique', 'Britannique', '1903-06-25'],
      ['Mariama Bâ', 'Romancière et militante sénégalaise', 'Sénégalaise', '1929-04-17'],
      ['Chinua Achebe', 'Romancier, poète et critique littéraire nigérian', 'Nigériane', '1930-11-16'],
      ['Ahmadou Kourouma', 'Écrivain ivoirien', 'Ivoirienne', '1927-11-24'],
      ['Camara Laye', 'Écrivain guinéen', 'Guinéenne', '1928-01-01'],
      ['Léopold Sédar Senghor', 'Poète, écrivain et homme politique sénégalais', 'Sénégalaise', '1906-10-09'],
      ['Fatou Keïta', 'Écrivaine ivoirienne spécialisée en littérature jeunesse', 'Ivoirienne', '1971-01-01']
    ];

    const insertAuthor = db.prepare(`
      INSERT INTO auteurs (nom_complet, biographie, nationalite, date_naissance)
      VALUES (?, ?, ?, ?)
    `);

    authors.forEach((author, index) => {
      insertAuthor.run(author);
      console.log(`  ✅ Added author: ${author[0]}`);
    });

    console.log(`✍️ Created ${authors.length} authors`);
  } else {
    console.log('✍️ Authors already exist, skipping');
  }
}

async function seedSampleBooks(db) {
  const booksCount = db.prepare('SELECT COUNT(*) as count FROM livres').get();
  
  if (booksCount.count === 0) {
    console.log('📖 Seeding sample books...');
    
    // Get first admin and some categories/authors
    const admin = db.prepare('SELECT id FROM administrateurs LIMIT 1').get();
    const categories = db.prepare('SELECT id FROM categories ORDER BY order_affichage LIMIT 3').all();
    const authors = db.prepare('SELECT id FROM auteurs ORDER BY id LIMIT 5').all();

    if (!admin || categories.length === 0 || authors.length === 0) {
      console.log('⚠️ Missing references, skipping sample books');
      return;
    }

    const books = [
      {
        titre: 'Les Misérables',
        auteur_id: authors[0]?.id,
        resume: 'Un chef-d\'œuvre de Victor Hugo qui raconte l\'histoire de Jean Valjean, ancien forçat, et sa quête de rédemption à travers la France du XIXe siècle.',
        categorie_id: categories[0]?.id,
        annee_publication: 1862,
        langue: 'FR',
        nombre_exemplaires: 3,
        nombre_pages: 1500,
        editeur: 'Gallimard'
      },
      {
        titre: '1984',
        auteur_id: authors[1]?.id,
        resume: 'Roman dystopique de George Orwell décrivant une société totalitaire où Big Brother surveille tout le monde.',
        categorie_id: categories[0]?.id,
        annee_publication: 1949,
        langue: 'FR',
        nombre_exemplaires: 2,
        nombre_pages: 328,
        editeur: 'Gallimard'
      },
      {
        titre: 'Une si longue lettre',
        auteur_id: authors[2]?.id,
        resume: 'Un roman émouvant de Mariama Bâ qui explore la condition de la femme africaine à travers une correspondance.',
        categorie_id: categories[0]?.id,
        annee_publication: 1979,
        langue: 'FR',
        nombre_exemplaires: 2,
        nombre_pages: 120,
        editeur: 'Les Nouvelles Éditions Africaines'
      }
    ];

    const insertBook = db.prepare(`
      INSERT INTO livres (titre, auteur_id, resume, categorie_id, annee_publication, langue, nombre_exemplaires, exemplaires_disponibles, nombre_pages, editeur, ajoute_par)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    books.forEach((book) => {
      if (book.auteur_id && book.categorie_id) {
        insertBook.run(
          book.titre,
          book.auteur_id,
          book.resume,
          book.categorie_id,
          book.annee_publication,
          book.langue,
          book.nombre_exemplaires,
          book.nombre_exemplaires,
          book.nombre_pages,
          book.editeur,
          admin.id
        );
        console.log(`  ✅ Added book: ${book.titre}`);
      }
    });

    console.log(`📖 Created ${books.length} sample books`);
  } else {
    console.log('📖 Books already exist, skipping');
  }
}

async function seedSampleEvents(db) {
  const eventsCount = db.prepare('SELECT COUNT(*) as count FROM evenements').get();
  
  if (eventsCount.count === 0) {
    console.log('📅 Seeding sample events...');
    
    const admin = db.prepare('SELECT id FROM administrateurs LIMIT 1').get();
    
    if (!admin) {
      console.log('⚠️ Missing admin, skipping sample events');
      return;
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const events = [
      {
        titre: 'Club de Lecture - Débat sur les Misérables',
        description: 'Rencontre mensuelle pour discuter des thèmes et de l\'impact de ce chef-d\'œuvre de la littérature française.',
        type: 'club_lecture',
        date_debut: futureDate.toISOString(),
        lieu: 'Salle de conférence - Centre Protégé QV',
        statut: 'publie'
      },
      {
        titre: 'Atelier d\'Écriture Créative',
        description: 'Initiation à l\'écriture créative pour débutants. Matériel fourni sur place.',
        type: 'atelier',
        date_debut: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lieu: 'Bibliothèque - Centre Protégé QV',
        statut: 'publie'
      }
    ];

    const insertEvent = db.prepare(`
      INSERT INTO evenements (titre, description, type, date_debut, lieu, statut, publie_le, cree_par)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const publishedTime = new Date().toISOString();
    
    events.forEach((event) => {
      insertEvent.run(
        event.titre,
        event.description,
        event.type,
        event.date_debut,
        event.lieu,
        event.statut,
        publishedTime,
        admin.id
      );
      console.log(`  ✅ Added event: ${event.titre}`);
    });

    console.log(`📅 Created ${events.length} sample events`);
  } else {
    console.log('📅 Events already exist, skipping');
  }
}

async function seedSampleGroups(db) {
  const groupsCount = db.prepare('SELECT COUNT(*) as count FROM groupes_lecture').get();
  
  if (groupsCount.count === 0) {
    console.log('👥 Seeding sample reading groups...');
    
    const admin = db.prepare('SELECT id FROM administrateurs LIMIT 1').get();
    
    if (!admin) {
      console.log('⚠️ Missing admin, skipping sample groups');
      return;
    }

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const groups = [
      {
        nom: 'Cercle des Amoureux de la Poésie',
        description: 'Un groupe pour les passionnés de poésie qui se réunissent pour lire, partager et discuter de poèmes d\'auteurs africains et internationaux.',
        theme: 'Poésie et Littérature',
        prochaine_rencontre: nextWeek.toISOString(),
        lieu_rencontre: 'Salle de lecture - Centre Protégé QV'
      },
      {
        nom: 'Club des Jeunes Lecteurs',
        description: 'Groupe destiné aux jeunes de 15-25 ans pour encourager la lecture et les discussions autour de la littérature contemporaine.',
        theme: 'Littérature Jeunesse et Contemporaine',
        prochaine_rencontre: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        lieu_rencontre: 'Espace Jeunesse - Centre Protégé QV'
      }
    ];

    const insertGroup = db.prepare(`
      INSERT INTO groupes_lecture (nom, description, theme, prochaine_rencontre, lieu_rencontre, cree_par)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    groups.forEach((group) => {
      insertGroup.run(
        group.nom,
        group.description,
        group.theme,
        group.prochaine_rencontre,
        group.lieu_rencontre,
        admin.id
      );
      console.log(`  ✅ Added group: ${group.nom}`);
    });

    console.log(`👥 Created ${groups.length} sample groups`);
  } else {
    console.log('👥 Groups already exist, skipping');
  }
}

seedDatabase();
