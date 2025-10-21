-- =====================================================
-- PROTÉGÉ LECTURE+ DATABASE SCHEMA
-- =====================================================

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS administrateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nom_complet TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  privileges TEXT,
  photo_profil TEXT,
  telephone TEXT,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_derniere_connexion DATETIME,
  statut TEXT DEFAULT 'actif',
  cree_par INTEGER REFERENCES administrateurs(id),
  CONSTRAINT check_role CHECK (role IN ('super_admin', 'admin')),
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'inactif'))
);

-- Table des auteurs
CREATE TABLE IF NOT EXISTS auteurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_complet TEXT NOT NULL,
  biographie TEXT,
  nationalite TEXT,
  photo TEXT,
  date_naissance DATE,
  site_web TEXT,
  nombre_livres INTEGER DEFAULT 0,
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT UNIQUE NOT NULL,
  description TEXT,
  couleur_hex TEXT DEFAULT '#A5D6A7',
  icone TEXT,
  parent_id INTEGER REFERENCES categories(id),
  nombre_livres INTEGER DEFAULT 0,
  ordre_affichage INTEGER DEFAULT 0
);

-- Table des livres
CREATE TABLE IF NOT EXISTS livres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn TEXT,
  titre TEXT NOT NULL,
  auteur_id INTEGER NOT NULL REFERENCES auteurs(id) ON DELETE RESTRICT,
  resume TEXT NOT NULL,
  categorie_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  annee_publication INTEGER NOT NULL,
  editeur TEXT,
  langue TEXT NOT NULL DEFAULT 'FR',
  nombre_pages INTEGER,
  nombre_exemplaires INTEGER NOT NULL DEFAULT 1,
  exemplaires_disponibles INTEGER NOT NULL DEFAULT 1,
  statut TEXT DEFAULT 'disponible',
  image_couverture TEXT,
  tags TEXT,
  cote TEXT,
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
  ajoute_par INTEGER NOT NULL REFERENCES administrateurs(id),
  CONSTRAINT check_statut CHECK (statut IN ('disponible', 'reserve_complet', 'maintenance')),
  CONSTRAINT check_langue CHECK (langue IN ('FR', 'EN', 'ES', 'DE', 'AUTRE'))
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_reservation TEXT UNIQUE NOT NULL,
  livre_id INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
  nom_visiteur TEXT NOT NULL,
  email_visiteur TEXT NOT NULL,
  telephone_visiteur TEXT NOT NULL,
  date_souhaitee DATE NOT NULL,
  creneau TEXT NOT NULL,
  commentaire TEXT,
  statut TEXT DEFAULT 'en_attente',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_validation DATETIME,
  date_visite DATETIME,
  valide_par INTEGER REFERENCES administrateurs(id),
  remarque_admin TEXT,
  notification_envoyee BOOLEAN DEFAULT 0,
  CONSTRAINT check_statut CHECK (statut IN ('en_attente', 'validee', 'refusee', 'terminee', 'annulee')),
  CONSTRAINT check_creneau CHECK (creneau IN ('matin', 'apres_midi'))
);

-- Table des groupes de lecture
CREATE TABLE IF NOT EXISTS groupes_lecture (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT NOT NULL,
  theme TEXT NOT NULL,
  image_couverture TEXT,
  statut TEXT DEFAULT 'actif',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  cree_par INTEGER NOT NULL REFERENCES administrateurs(id),
  nombre_membres INTEGER DEFAULT 0,
  prochaine_rencontre DATETIME,
  lieu_rencontre TEXT,
  livre_du_mois INTEGER REFERENCES livres(id),
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'inactif', 'archive'))
);

-- Table des membres des groupes
CREATE TABLE IF NOT EXISTS membres_groupes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupe_id INTEGER NOT NULL REFERENCES groupes_lecture(id) ON DELETE CASCADE,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'actif',
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'inactif')),
  UNIQUE(groupe_id, email)
);

-- Table des activités des groupes
CREATE TABLE IF NOT EXISTS activites_groupes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupe_id INTEGER NOT NULL REFERENCES groupes_lecture(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  date_activite DATETIME NOT NULL,
  lieu TEXT,
  livre_associe INTEGER REFERENCES livres(id),
  cree_par INTEGER NOT NULL REFERENCES administrateurs(id),
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_type CHECK (type IN ('rencontre', 'debat', 'conference', 'atelier', 'autre'))
);

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  date_debut DATETIME NOT NULL,
  date_fin DATETIME,
  lieu TEXT,
  image_principale TEXT,
  lien_externe TEXT,
  groupe_lie INTEGER REFERENCES groupes_lecture(id),
  livre_lie INTEGER REFERENCES livres(id),
  statut TEXT DEFAULT 'brouillon',
  publie_le DATETIME,
  cree_par INTEGER NOT NULL REFERENCES administrateurs(id),
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  nombre_vues INTEGER DEFAULT 0,
  CONSTRAINT check_type CHECK (type IN ('atelier', 'conference', 'club_lecture', 'exposition', 'formation', 'autre')),
  CONSTRAINT check_statut CHECK (statut IN ('brouillon', 'publie', 'archive'))
);

-- Table des actualités
CREATE TABLE IF NOT EXISTS actualites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  resume TEXT,
  image_principale TEXT,
  categorie TEXT,
  tags TEXT,
  statut TEXT DEFAULT 'brouillon',
  publie_le DATETIME,
  cree_par INTEGER NOT NULL REFERENCES administrateurs(id),
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME,
  nombre_vues INTEGER DEFAULT 0,
  CONSTRAINT check_statut CHECK (statut IN ('brouillon', 'publie', 'archive'))
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS messages_contact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'non_lu',
  lu_par INTEGER REFERENCES administrateurs(id),
  date_lecture DATETIME,
  reponse TEXT,
  date_reponse DATETIME,
  repondu_par INTEGER REFERENCES administrateurs(id),
  CONSTRAINT check_statut CHECK (statut IN ('non_lu', 'lu', 'repondu', 'archive'))
);

-- Table des abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_abonnes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nom_complet TEXT,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'actif',
  token_desinscription TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'site_web',
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'desabonne', 'bounce'))
);

-- Table des envois de newsletter
CREATE TABLE IF NOT EXISTS newsletter_envois (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  objet TEXT NOT NULL,
  contenu TEXT NOT NULL,
  date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
  envoye_par INTEGER NOT NULL REFERENCES administrateurs(id),
  nombre_destinataires INTEGER,
  nombre_ouverts INTEGER DEFAULT 0,
  nombre_clics INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'brouillon',
  CONSTRAINT check_statut CHECK (statut IN ('brouillon', 'envoye', 'annule'))
);

-- Table des statistiques journalières
CREATE TABLE IF NOT EXISTS statistiques_journalieres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE UNIQUE NOT NULL,
  visites_totales INTEGER DEFAULT 0,
  visiteurs_uniques INTEGER DEFAULT 0,
  reservations_soumises INTEGER DEFAULT 0,
  reservations_validees INTEGER DEFAULT 0,
  livres_consultes INTEGER DEFAULT 0,
  nouvelles_inscriptions_newsletter INTEGER DEFAULT 0,
  nouveaux_membres_groupes INTEGER DEFAULT 0,
  messages_recus INTEGER DEFAULT 0,
  date_calcul DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS logs_activite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER REFERENCES administrateurs(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_module CHECK (module IN ('livres', 'reservations', 'groupes', 'evenements', 'actualites', 'contact', 'newsletter', 'administration'))
);

-- Table des paramètres système
CREATE TABLE IF NOT EXISTS parametres_systeme (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cle TEXT UNIQUE NOT NULL,
  valeur TEXT NOT NULL,
  type TEXT DEFAULT 'string',
  description TEXT,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
  modifie_par INTEGER REFERENCES administrateurs(id),
  CONSTRAINT check_type CHECK (type IN ('string', 'number', 'boolean', 'json'))
);

-- =====================================================
-- INDEX POUR OPTIMISATION
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_livres_auteur ON livres(auteur_id);
CREATE INDEX IF NOT EXISTS idx_livres_categorie ON livres(categorie_id);
CREATE INDEX IF NOT EXISTS idx_livres_statut ON livres(statut);
CREATE INDEX IF NOT EXISTS idx_livres_date_ajout ON livres(date_ajout);

CREATE INDEX IF NOT EXISTS idx_reservations_livre ON reservations(livre_id);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_date_souhaitee ON reservations(date_souhaitee);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email_visiteur);

CREATE INDEX IF NOT EXISTS idx_membres_groupe ON membres_groupes(groupe_id);
CREATE INDEX IF NOT EXISTS idx_membres_email ON membres_groupes(email);

CREATE INDEX IF NOT EXISTS idx_activites_groupe ON activites_groupes(groupe_id);
CREATE INDEX IF NOT EXISTS idx_activites_date ON activites_groupes(date_activite);

CREATE INDEX IF NOT EXISTS idx_evenements_statut ON evenements(statut);
CREATE INDEX IF NOT EXISTS idx_evenements_date_debut ON evenements(date_debut);

CREATE INDEX IF NOT EXISTS idx_actualites_statut ON actualites(statut);
CREATE INDEX IF NOT EXISTS idx_actualites_date_creation ON actualites(date_creation);

CREATE INDEX IF NOT EXISTS idx_messages_statut ON messages_contact(statut);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages_contact(date_envoi);

CREATE INDEX IF NOT EXISTS idx_newsletter_statut ON newsletter_abonnes(statut);

CREATE INDEX IF NOT EXISTS idx_logs_utilisateur ON logs_activite(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_logs_module ON logs_activite(module);
CREATE INDEX IF NOT EXISTS idx_logs_date ON logs_activite(date_action);

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Paramètres système par défaut
INSERT OR IGNORE INTO parametres_systeme (cle, valeur, type, description) VALUES
('nom_centre', 'Centre de Lecture Protégé QV', 'string', 'Nom du centre de lecture'),
('adresse', 'Rond point Express, Biyem-Assi, Yaoundé, Cameroun', 'string', 'Adresse complète'),
('telephone', '+237 699 936 028', 'string', 'Numéro de téléphone'),
('email_contact', 'mail@protegeqv.org', 'string', 'Email de contact'),
('max_reservations_jour', '20', 'number', 'Nombre maximum de réservations par jour'),
('max_reservations_creneau', '10', 'number', 'Nombre maximum de réservations par créneau'),
('delai_min_reservation', '1', 'number', 'Délai minimum de réservation en jours'),
('delai_max_reservation', '30', 'number', 'Délai maximum de réservation en jours'),
('duree_session_minutes', '30', 'number', 'Durée de session avant déconnexion automatique'),
('mode_maintenance', 'false', 'boolean', 'Activer/désactiver le mode maintenance'),
('notifications_email_actives', 'true', 'boolean', 'Activer/désactiver les notifications email'),
('notifications_push_actives', 'true', 'boolean', 'Activer/désactiver les notifications push'),
('langue_defaut', 'fr', 'string', 'Langue par défaut de l application'),
('theme_defaut', 'light', 'string', 'Thème par défaut (light/dark)');

-- Catégories de livres par défaut
INSERT OR IGNORE INTO categories (nom, description, couleur_hex, ordre_affichage) VALUES
('Romans', 'Romans et œuvres de fiction littéraire', '#A5D6A7', 1),
('Éducation', 'Livres éducatifs et manuels scolaires', '#81C784', 2),
('Sciences', 'Ouvrages scientifiques et techniques', '#66BB6A', 3),
('Histoire', 'Livres d histoire et biographies', '#4CAF50', 4),
('Jeunesse', 'Livres pour enfants et adolescents', '#43A047', 5),
('Développement Personnel', 'Livres de croissance personnelle et bien-être', '#388E3C', 6),
('Culture', 'Arts, culture et société', '#2E7D32', 7),
('Religion & Philosophie', 'Ouvrages religieux et philosophiques', '#1B5E20', 8);

