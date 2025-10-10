📘 CAHIER DE CHARGES TECHNIQUE ET FONCTIONNEL
Plateforme de Réservation du Centre de Lecture — Protégé QV ONG
Slogan : "La lecture, un pont vers la connaissance et la communauté."
Nom de l'application : Protégé Lecture+
Version du document : 2.0
Date : Octobre 2025

🏛️ 1. CONTEXTE ET PRÉSENTATION DU PROJET
1.1 Présentation de l'Organisation
Protégé QV ONG est une organisation non gouvernementale engagée pour la promotion de l'éducation, la culture et le développement durable au Cameroun. Dans le cadre de sa mission éducative et culturelle, l'ONG lance une plateforme web moderne pour accompagner l'ouverture de son Centre de Lecture et Bibliothèque Communautaire situé à Yaoundé, au Rond-Point Express.
1.2 Vision du Projet
Le Centre de Lecture vise à devenir un espace de référence pour la promotion de la lecture, l'échange culturel et l'apprentissage communautaire. La plateforme digitale Protégé Lecture+ constitue le prolongement numérique de ce centre physique, facilitant l'accès aux ressources documentaires et la gestion des activités culturelles.
1.3 Fonctionnalités Principales
La plateforme permettra aux visiteurs de :

Consulter le catalogue complet des livres disponibles au centre avec filtres avancés
Effectuer des réservations de lecture pour venir consulter les ouvrages sur place
Découvrir les groupes de lecture et communautés éducatives créés et animés par l'administrateur
Recevoir des notifications sur les événements, ateliers, conférences et activités culturelles
S'informer sur les initiatives et actions culturelles de Protégé QV ONG
S'inscrire à la newsletter pour recevoir les actualités du centre
Contacter l'équipe via un formulaire dédié

1.4 Périmètre du Projet
⚠️ Important — Précisions sur le Périmètre :

Pas de bibliothèque virtuelle : La plateforme ne propose pas de lecture en ligne ou de téléchargement de livres numériques.
Consultation sur place uniquement : Les livres sont consultables exclusivement au Centre de Lecture physique, après validation de la réservation.
Réservation préalable obligatoire : Les visiteurs doivent réserver leur créneau de lecture avant de se rendre au centre.
Accès public limité : Seul l'administrateur dispose d'un compte authentifié sur la plateforme ; les visiteurs naviguent sans connexion.


🎯 2. OBJECTIFS DU PROJET
2.1 Objectifs Généraux

Digitaliser le processus de réservation de livres et d'accès à la salle de lecture du centre.
Promouvoir la lecture, la culture et le savoir au sein de la communauté de Yaoundé et au-delà.
Simplifier la gestion administrative des réservations, du catalogue et des événements pour l'équipe de l'ONG.
Renforcer la visibilité et la notoriété de Protégé QV ONG via une plateforme interactive, moderne et accessible.
Favoriser l'engagement communautaire à travers les groupes de lecture et les événements culturels.

2.2 Objectifs Spécifiques

Créer une interface utilisateur fluide, ergonomique et responsive adaptée aux ordinateurs, tablettes et smartphones.
Gérer efficacement le catalogue documentaire : livres, auteurs, catégories, disponibilités et états via un tableau de bord administrateur.
Permettre aux visiteurs de réserver un livre pour une séance de lecture physique avec confirmation automatisée.
Administrer des communautés et groupes de lecture créés et gérés uniquement par l'administrateur.
Centraliser les statistiques d'utilisation, les notifications et les journaux d'activité dans un tableau de bord dédié.
Assurer une architecture légère et performante avec stockage local (SQLite) et services cloud minimalistes (Firebase).
Optimiser la réutilisabilité du code via des composants React modulaires et bien structurés.
Offrir une expérience multilingue (Français/Anglais) pour toucher un public diversifié.


👥 3. RÔLES ET PRIVILÈGES UTILISATEURS
3.1 Architecture des Rôles
L'application adopte une architecture simplifiée avec deux rôles principaux :
RôleDescriptionAccès et ActionsVisiteur / InvitéUtilisateur non authentifié qui accède librement à la plateforme- Consulter le catalogue de livres avec filtres<br>- Lire les détails complets d'un livre<br>- Effectuer une réservation (formulaire public)<br>- Consulter les actualités et événements<br>- Découvrir les groupes de lecture<br>- S'inscrire à la newsletter<br>- Envoyer un message via le formulaire de contact<br>- Consulter les informations sur l'ONG et le centreAdministrateurCompte authentifié avec accès au tableau de bord complet- Toutes les actions du Visiteur<br>- Gérer le catalogue (livres, auteurs, catégories)<br>- Valider, modifier ou annuler les réservations<br>- Créer et gérer les groupes de lecture<br>- Publier des événements et actualités<br>- Gérer les contacts et abonnés newsletter<br>- Créer d'autres comptes administrateurs<br>- Définir les privilèges des sous-admins<br>- Consulter les statistiques et rapports<br>- Exporter les données (CSV, PDF)<br>- Configurer les paramètres du système
3.2 Système de Privilèges Administrateurs
3.2.1 Administrateur Principal (Super Admin)
Un compte administrateur principal est créé par défaut lors de l'installation via une commande d'initialisation :
bashnpm run init:admin
Ce compte dispose de tous les privilèges et ne peut être supprimé. Il est le seul à pouvoir :

Créer d'autres comptes administrateurs
Modifier ou supprimer des comptes administrateurs
Définir les privilèges des sous-admins
Accéder aux paramètres système critiques

Informations par défaut :

Email : admin@protegeqv.org
Mot de passe : AdminProtege2025! (à modifier immédiatement après première connexion)
Rôle : super_admin

3.2.2 Sous-Administrateurs (Admins Délégués)
Les sous-administrateurs sont créés par le Super Admin avec des privilèges personnalisés. Le système propose des profils de privilèges prédéfinis :
A) Administrateur Complet

Tous les privilèges sauf création/suppression d'admins

B) Gestionnaire de Contenu

Gestion des livres, auteurs, catégories
Publication d'événements et actualités
Gestion de la newsletter

C) Gestionnaire de Réservations

Validation et gestion des réservations
Consultation du calendrier
Contact avec les visiteurs

D) Animateur de Communauté

Gestion des groupes de lecture
Publication d'événements
Modération des messages

E) Privilèges Personnalisés
Le Super Admin peut créer un profil sur-mesure en sélectionnant individuellement :
ModulePrivilèges DisponiblesCatalogue- Consulter les livres<br>- Ajouter des livres<br>- Modifier des livres<br>- Supprimer des livres<br>- Gérer les catégories<br>- Gérer les auteursRéservations- Consulter les réservations<br>- Valider les réservations<br>- Modifier les réservations<br>- Annuler les réservations<br>- Exporter les donnéesGroupes de Lecture- Consulter les groupes<br>- Créer des groupes<br>- Modifier des groupes<br>- Supprimer des groupes<br>- Gérer les membresÉvénements- Consulter les événements<br>- Créer des événements<br>- Modifier des événements<br>- Supprimer des événements<br>- Publier/DépublierCommunication- Consulter les messages<br>- Répondre aux messages<br>- Supprimer des messages<br>- Gérer la newsletter<br>- Envoyer des notificationsAdministration- Consulter les statistiques<br>- Exporter les données<br>- Gérer les paramètres<br>- Consulter les logs<br>- Gérer les administrateurs
3.3 Modèle de Données Utilisateurs
La table administrateurs dans SQLite stocke les informations suivantes :
sqlCREATE TABLE administrateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nom_complet TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  privileges TEXT, -- JSON des privilèges détaillés
  photo_profil TEXT,
  telephone TEXT,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_derniere_connexion DATETIME,
  statut TEXT DEFAULT 'actif',
  cree_par INTEGER REFERENCES administrateurs(id),
  CONSTRAINT check_role CHECK (role IN ('super_admin', 'admin'))
);

📚 4. MODULES FONCTIONNELS DÉTAILLÉS
4.1 Module d'Authentification
4.1.1 Fonctionnalités
Pour les Administrateurs :

Connexion via Firebase Authentication

Email + Mot de passe
Google OAuth (optionnel)


Réinitialisation du mot de passe par email
Vérification de l'adresse email lors de la création de compte
Gestion de session sécurisée avec tokens JWT
Déconnexion automatique après inactivité (configurable)
Protection contre les attaques par force brute (rate limiting)

4.1.2 Workflow d'Authentification

Page de Connexion

Formulaire email/mot de passe
Lien "Mot de passe oublié"
Option Google OAuth (facultatif)
Redirection vers le tableau de bord après connexion réussie


Création de Sous-Admin (par Super Admin)

Formulaire avec : nom, email, rôle, privilèges
Email d'invitation envoyé automatiquement
Le sous-admin définit son mot de passe via un lien temporaire


Sécurité

Validation côté client et serveur
Tokens Firebase stockés de manière sécurisée
Middleware de vérification du rôle sur toutes les routes protégées
Logs de toutes les connexions et actions administratives



4.1.3 Composants Réutilisables

<AuthProvider> : Context pour la gestion de l'état d'authentification
<PrivateRoute> : Protection des routes administrateur
<LoginForm> : Formulaire de connexion réutilisable
<PasswordReset> : Composant de réinitialisation
<RoleGuard> : Vérification des privilèges par module


4.2 Module "Livres et Catalogue"
4.2.1 Structure des Données — Livres
Chaque livre contient les informations suivantes :
ChampTypeDescriptionObligatoireidINTEGERIdentifiant unique auto-incrémentéOuiisbnTEXTNuméro ISBN internationalNontitreTEXTTitre complet du livreOuiauteur_idINTEGERRéférence vers la table auteursOuiresumeTEXTRésumé ou description du livre (1000 caractères max)Ouicategorie_idINTEGERRéférence vers la table categoriesOuiannee_publicationINTEGERAnnée de publication (format : YYYY)OuiediteurTEXTNom de la maison d'éditionNonlangueTEXTLangue principale (FR, EN, etc.)Ouinombre_pagesINTEGERNombre total de pagesNonnombre_exemplairesINTEGERNombre total d'exemplaires possédésOuiexemplaires_disponiblesINTEGERNombre d'exemplaires actuellement disponiblesOuistatutTEXTStatut global : disponible, reservé_complet, maintenanceOuiimage_couvertureTEXTNom du fichier image stocké localementNontagsTEXTTags thématiques séparés par virgulesNoncoteTEXTCote bibliothécaire (ex: "ROM.FIC.001")Nondate_ajoutDATETIMEDate d'ajout dans le systèmeOuidate_modificationDATETIMEDate de dernière modificationOuiajoute_parINTEGERID de l'admin qui a ajouté le livreOui
4.2.2 Tables Associées
Table auteurs :
sqlCREATE TABLE auteurs (
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
Table categories :
sqlCREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT UNIQUE NOT NULL,
  description TEXT,
  couleur_hex TEXT DEFAULT '#A5D6A7',
  icone TEXT,
  parent_id INTEGER REFERENCES categories(id),
  nombre_livres INTEGER DEFAULT 0,
  ordre_affichage INTEGER DEFAULT 0
);
4.2.3 Fonctionnalités du Module
A) Pour les Visiteurs :

Consultation du Catalogue

Liste des livres avec affichage en grille ou liste
Pagination (20 livres par page)
Aperçu : couverture, titre, auteur, catégorie, disponibilité


Filtres Avancés

Par catégorie (avec affichage hiérarchique)
Par auteur (recherche autocomplete)
Par disponibilité (disponible uniquement / tous)
Par langue
Par année de publication (plage de dates)
Par tags


Recherche Intelligente

Barre de recherche globale
Recherche dans : titre, auteur, ISBN, tags, résumé
Suggestions automatiques (debounced)
Historique des recherches récentes


Fiche Détaillée du Livre

Toutes les informations du livre
Image de couverture en haute résolution
Biographie de l'auteur (lien cliquable)
Livres similaires (même catégorie/auteur)
Bouton "Réserver ce livre" (si disponible)
État de disponibilité en temps réel


Système de Réservation (Visiteur)

Formulaire de réservation avec :

Nom complet
Email
Téléphone
Date souhaitée de lecture (calendrier)
Créneau horaire (matin 9h-13h / après-midi 14h-18h)
Commentaire optionnel


Validation des champs côté client
Notification automatique par email après soumission
Numéro de réservation fourni pour suivi



B) Pour les Administrateurs :

Gestion du Catalogue

Ajouter un nouveau livre (formulaire détaillé)
Modifier les informations d'un livre
Supprimer un livre (avec confirmation)
Gestion des images de couverture (upload local)
Import en masse via CSV (avec mapping des colonnes)
Dupliquer une fiche livre (création rapide)


Gestion des Auteurs

Créer un auteur
Modifier les informations biographiques
Lier plusieurs livres à un auteur
Supprimer un auteur (si aucun livre lié)


Gestion des Catégories

Créer une catégorie ou sous-catégorie
Définir une couleur et une icône pour chaque catégorie
Organiser l'ordre d'affichage
Fusionner ou supprimer des catégories


Gestion de la Disponibilité

Marquer des exemplaires en maintenance
Ajuster le nombre d'exemplaires disponibles
Historique des mouvements (entrées/sorties)



4.2.4 Composants Réutilisables

<BookCard> : Carte d'aperçu d'un livre
<BookGrid> : Grille de livres avec pagination
<BookFilters> : Panneau de filtres avancés
<SearchBar> : Barre de recherche intelligente
<BookForm> : Formulaire d'ajout/modification de livre
<AuthorSelect> : Sélecteur d'auteur avec autocomplete
<CategoryTree> : Arborescence de catégories
<AvailabilityBadge> : Badge de disponibilité
<ReservationForm> : Formulaire de réservation visiteur


4.3 Module "Réservations"
4.3.1 Structure des Données
Table reservations :
sqlCREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_reservation TEXT UNIQUE NOT NULL,
  livre_id INTEGER NOT NULL REFERENCES livres(id),
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
4.3.2 Workflow de Réservation
Étape 1 : Soumission par le Visiteur

Le visiteur remplit le formulaire sur la fiche d'un livre disponible
Validation des champs (email valide, téléphone, date future)
Vérification de la disponibilité du livre à la date choisie
Génération d'un numéro de réservation unique (format : RES-YYYYMMDD-XXXX)
Enregistrement dans SQLite avec statut en_attente
Email de confirmation automatique envoyé au visiteur
Notification Firebase envoyée aux administrateurs

Étape 2 : Validation par l'Administrateur

L'admin reçoit une notification dans le tableau de bord
Consultation des détails de la réservation
Actions possibles :

Valider : Email de confirmation envoyé au visiteur + SMS optionnel
Refuser : Demande de motif + email explicatif au visiteur
Modifier : Changement de date/créneau (avec accord du visiteur)



Étape 3 : Visite au Centre

Le visiteur se présente au centre avec son numéro de réservation
L'admin marque la réservation comme terminee et enregistre la date de visite
Le livre est marqué comme consulté dans l'historique

Étape 4 : Suivi Post-Visite

Email de remerciement automatique (optionnel)
Invitation à rejoindre un groupe de lecture
Invitation à s'abonner à la newsletter

4.3.3 Fonctionnalités Administrateur

Tableau de Bord des Réservations

Liste de toutes les réservations avec filtres :

Par statut (en attente, validées, refusées, terminées)
Par date de réservation
Par date de visite souhaitée
Par livre


Statistiques en temps réel :

Réservations en attente
Réservations du jour
Taux de validation
Taux de présence




Calendrier des Réservations

Vue calendrier avec les réservations validées
Code couleur par créneau (matin/après-midi)
Détection des conflits de disponibilité
Export au format iCalendar (.ics)


Gestion Individuelle

Détails complets d'une réservation
Historique des actions (validation, modification, annulation)
Contact direct avec le visiteur (email/téléphone)
Ajout de remarques internes


Actions en Masse

Validation multiple de réservations
Export CSV des réservations (par période, par statut)
Rappels automatiques par email (J-1 avant la visite)



4.3.4 Notifications
Firebase Cloud Messaging (FCM) :

Notification push aux admins lors d'une nouvelle réservation
Notification au visiteur lors de la validation (si PWA installée)
Rappel automatique J-1

Emails Automatiques :

Confirmation de réservation (visiteur)
Validation de réservation (visiteur)
Refus de réservation avec motif (visiteur)
Notification de nouvelle réservation (admins)
Rappel J-1 (visiteur)
Remerciement post-visite (visiteur)

4.3.5 Composants Réutilisables

<ReservationList> : Liste des réservations avec filtres
<ReservationCard> : Carte résumée d'une réservation
<ReservationCalendar> : Calendrier des réservations
<ReservationDetails> : Détails complets d'une réservation
<ReservationActions> : Boutons d'action (valider/refuser/modifier)
<ReservationStats> : Statistiques en temps réel
<StatusBadge> : Badge de statut coloré


4.4 Module "Groupes de Lecture & Communautés"
4.4.1 Concept
Les groupes de lecture sont des communautés thématiques créées et animées exclusivement par les administrateurs. Ils permettent de fédérer les visiteurs autour de thèmes littéraires, d'organiser des rencontres et de promouvoir des lectures communes.
4.4.2 Structure des Données
Table groupes_lecture :
sqlCREATE TABLE groupes_lecture (
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
Table membres_groupes :
sqlCREATE TABLE membres_groupes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupe_id INTEGER NOT NULL REFERENCES groupes_lecture(id),
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'actif',
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'inactif'))
);
Table activites_groupes :
sqlCREATE TABLE activites_groupes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupe_id INTEGER NOT NULL REFERENCES groupes_lecture(id),
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
4.4.3 Fonctionnalités
A) Pour les Visiteurs :

Découverte des Groupes

Liste de tous les groupes actifs
Filtres par thème
Fiche détaillée de chaque groupe :

Description et objectifs
Thème principal
Nombre de membres
Prochaine rencontre
Livre du mois
Historique des activités




Inscription à un Groupe

Formulaire d'inscription :

Nom complet
Email
Téléphone
Motivation (optionnel)


Confirmation par email
L'admin valide l'inscription dans le tableau de bord



B) Pour les Administrateurs :

Création de Groupes

Formulaire avec : nom, description, thème, image
Définition du livre du mois
Planification de la prochaine rencontre


Gestion des Membres

Liste de tous les membres par groupe
Validation des inscriptions
Suppression de membres
Export de la liste (CSV)
Envoi d'emails groupés


Planification d'Activités

Création d'événements liés au groupe :

Rencontres de lecture
Débats thématiques
Conférences avec auteurs
Ateliers d'écriture


Envoi de notifications aux membres
Gestion du calendrier d'activités


Communication

Envoi d'emails aux membres du groupe
Notifications push (si PWA installée)
Partage de ressources (liens, documents)



4.4.4 Composants Réutilisables

<GroupCard> : Carte d'aperçu d'un groupe
<GroupGrid> : Grille de groupes
<GroupDetails> : Détails complets d'un groupe
<GroupForm> : Formulaire de création/modification
<MemberList> : Liste des membres d'un groupe
<ActivityCalendar> : Calendrier des activités du groupe
<JoinGroupForm> : Formulaire d'inscription visiteur


4.5 Module "Événements & Actualités"
4.5.1 Structure des Données
Table evenements :
sqlCREATE TABLE evenements (
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
Table actualites :
sqlCREATE TABLE actualites (
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
4.5.2 Fonctionnalités
A) Pour les Visiteurs :

Page Événements

Liste des événements à venir (tri par date)
Filtres par type d'événement
Fiche détaillée de chaque événement
Bouton "S'inscrire" (redirection vers formulaire)
Export au format iCalendar (.ics)
Partage sur réseaux sociaux


Page Actualités

Liste des actualités récentes
Filtres par catégorie
Recherche par mots-clés
Affichage en grille ou liste
Lecture complète d'une actualité
Articles suggérés (même catégorie)


Carrousel Page d'Accueil

Slider des 5 derniers événements/actualités
Animation automatique (8 secondes)
Navigation manuelle
Liens directs vers les fiches détaillées



B) Pour les Administrateurs :

Création d'Événements

Formulaire détaillé avec é


RetryMYContinuediteur WYSIWYG

Upload d'image principale (stockage local)
Liaison optionnelle à un groupe ou un livre
Gestion du statut (brouillon/publié/archivé)
Prévisualisation avant publication
Planification de publication (date/heure)


Création d'Actualités

Éditeur de texte riche (formatting, listes, liens)
Upload d'images dans le contenu
Définition d'un résumé pour l'aperçu
Catégorisation et tags
SEO : titre, meta-description
Brouillon automatique toutes les 30 secondes


Gestion du Contenu

Liste de tous les événements/actualités
Filtres par statut, date, auteur
Actions en masse (publier, archiver, supprimer)
Statistiques de vues
Duplication de contenu existant


Carrousel d'Accueil

Sélection des contenus mis en avant
Ordre d'affichage personnalisable
Activation/désactivation du défilement automatique



4.5.3 Composants Réutilisables

<EventCard> : Carte d'événement
<EventGrid> : Grille d'événements
<EventForm> : Formulaire de création/modification d'événement
<NewsCard> : Carte d'actualité
<NewsGrid> : Grille d'actualités
<NewsForm> : Formulaire de création/modification d'actualité
<RichTextEditor> : Éditeur WYSIWYG réutilisable
<HomeCarousel> : Carrousel page d'accueil
<ImageUploader> : Composant d'upload d'images


4.6 Module "Contact & Newsletter"
4.6.1 Structure des Données
Table messages_contact :
sqlCREATE TABLE messages_contact (
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
Table newsletter_abonnes :
sqlCREATE TABLE newsletter_abonnes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nom_complet TEXT,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'actif',
  token_desinscription TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'site_web',
  CONSTRAINT check_statut CHECK (statut IN ('actif', 'desabonne', 'bounce'))
);
Table newsletter_envois :
sqlCREATE TABLE newsletter_envois (
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
4.6.2 Fonctionnalités
A) Formulaire de Contact (Visiteurs)

Page Contact

Formulaire avec champs :

Nom complet (obligatoire)
Email (obligatoire)
Téléphone (optionnel)
Sujet (liste déroulante + champ libre)
Message (minimum 20 caractères)


Validation en temps réel
Captcha anti-spam (simple calcul mathématique)
Confirmation visuelle après envoi
Email de confirmation automatique au visiteur


Sujets Prédéfinis

Informations générales
Réservation de livre
Inscription à un groupe
Partenariat
Don de livres
Autre



B) Gestion des Messages (Administrateurs)

Boîte de Réception

Liste de tous les messages
Badge de messages non lus
Filtres par statut, sujet, date
Recherche par nom/email/mots-clés
Tri par date, statut, priorité


Détails du Message

Affichage complet du message
Informations sur l'expéditeur (avec historique)
Bouton "Marquer comme lu"
Réponse directe par email (template prérempli)
Ajout de notes internes
Archivage


Statistiques

Nombre total de messages reçus
Taux de réponse
Temps moyen de réponse
Sujets les plus fréquents



C) Newsletter (Visiteurs)

Inscription

Formulaire simplifié (email + nom optionnel)
Cases à cocher pour consentement RGPD
Confirmation par email (double opt-in)
Page de confirmation avec message de bienvenue


Désinscription

Lien unique dans chaque email
Page de désinscription avec formulaire optionnel (motif)
Confirmation immédiate



D) Gestion Newsletter (Administrateurs)

Liste des Abonnés

Tableau complet avec pagination
Filtres par statut, date d'inscription, source
Export CSV/Excel
Import en masse (CSV avec validation)
Statistiques : total actifs, désabonnés, taux de croissance


Création de Campagne

Éditeur d'email avec templates prédéfinis :

Nouveautés du mois
Événements à venir
Actualités de l'ONG
Spotlight sur un livre


Personnalisation (nom du destinataire, etc.)
Prévisualisation multi-appareils (desktop/mobile)
Test d'envoi avant diffusion
Planification d'envoi


Historique des Envois

Liste de toutes les campagnes
Statistiques par campagne :

Taux d'ouverture
Taux de clics
Désinscriptions


Ré-envoi aux non-ouvreurs



4.6.3 Composants Réutilisables

<ContactForm> : Formulaire de contact visiteur
<MessageList> : Liste des messages reçus
<MessageCard> : Carte de message
<MessageDetails> : Détails complets d'un message
<NewsletterSignup> : Widget d'inscription newsletter
<SubscriberList> : Liste des abonnés
<EmailEditor> : Éditeur d'email avec templates
<CampaignStats> : Statistiques d'une campagne
<SimpleCaptcha> : Captcha mathématique simple


4.7 Module "Statistiques & Tableau de Bord Admin"
4.7.1 Structure des Données
Table statistiques_journalieres :
sqlCREATE TABLE statistiques_journalieres (
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
Table logs_activite :
sqlCREATE TABLE logs_activite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER REFERENCES administrateurs(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_module CHECK (module IN ('livres', 'reservations', 'groupes', 'evenements', 'actualites', 'contact', 'newsletter', 'administration'))
);
4.7.2 Tableau de Bord Principal
Vue d'Ensemble (Dashboard)
Widgets Statistiques Principaux :

Métriques Clés (Cards)

📚 Nombre total de livres (avec évolution)
📖 Livres disponibles actuellement
📅 Réservations en attente
✅ Réservations validées ce mois
👥 Nombre de membres dans les groupes
📧 Messages non lus
📰 Abonnés newsletter actifs


Graphiques d'Activité

Évolution des réservations (7/30/90 derniers jours)

Graphique en ligne avec filtres temporels
Comparaison avec la période précédente


Répartition des livres par catégorie

Graphique en donut interactif
Pourcentages et nombres absolus


Taux de disponibilité

Jauge de disponibilité globale
Alertes si < 30% disponible


Activité des groupes de lecture

Nombre de membres par groupe (bar chart)
Évolution des inscriptions




Réservations du Jour

Liste des réservations validées pour aujourd'hui
Créneau, nom du visiteur, livre réservé
Actions rapides (marquer comme terminé, contacter)


Alertes et Notifications

Nouvelles réservations à traiter (badge rouge)
Livres en stock faible (< 2 exemplaires)
Messages non lus (> 5 jours)
Événements à venir (J-7)


Activité Récente

Flux en temps réel des dernières actions :

Nouvelle réservation
Livre ajouté
Message reçu
Nouvel abonné newsletter


Horodatage et détails
Lien direct vers l'élément concerné



4.7.3 Rapports et Exports
Rapports Prédéfinis :

Rapport Mensuel de Réservations

Nombre total de réservations
Taux de validation/refus
Livres les plus réservés
Créneaux les plus demandés
Taux de présence (terminées vs validées)
Export PDF/CSV


Rapport d'Activité de la Bibliothèque

Statistiques du catalogue (nouveaux livres, catégories populaires)
Taux de rotation des livres
Livres jamais réservés
Auteurs les plus consultés
Export PDF/Excel


Rapport des Groupes de Lecture

Nombre de membres par groupe
Taux de participation aux activités
Groupes les plus actifs
Évolution des inscriptions
Export PDF/CSV


Rapport Newsletter

Croissance des abonnés (mensuelle/annuelle)
Taux d'ouverture moyen
Taux de clics moyen
Campagnes les plus performantes
Export CSV



Exports Personnalisés :

Sélection de la période (date de début/fin)
Choix des modules à inclure
Format d'export (CSV, Excel, PDF)
Planification d'exports automatiques (hebdomadaire/mensuel)

4.7.4 Journaux d'Activité (Logs)
Consultation des Logs :

Liste complète de toutes les actions administratives
Filtres par :

Administrateur
Module
Type d'action (création, modification, suppression)
Période


Recherche par mots-clés dans les détails
Export CSV pour audit

Actions Enregistrées :

Connexion/déconnexion
Ajout/modification/suppression de livre
Validation/refus de réservation
Création/modification de groupe
Publication d'événement/actualité
Envoi de newsletter
Modification des paramètres système
Création de sous-admin

4.7.5 Composants Réutilisables

<StatCard> : Carte de statistique avec icône et évolution
<LineChart> : Graphique en ligne réutilisable
<DonutChart> : Graphique en donut
<BarChart> : Graphique en barres
<ActivityFeed> : Flux d'activité en temps réel
<AlertPanel> : Panneau d'alertes
<ReportGenerator> : Générateur de rapports
<LogViewer> : Visualiseur de logs
<DateRangePicker> : Sélecteur de plage de dates


4.8 Module "Paramètres & Administration"
4.8.1 Paramètres Généraux
A) Informations du Centre

Nom du centre (modifiable)
Adresse complète
Numéro de téléphone
Email de contact
Horaires d'ouverture (par jour de la semaine)
Jours de fermeture
Description du centre (pour la page À Propos)
Logo du centre (upload local)

B) Paramètres de Réservation

Nombre maximum de réservations par jour
Nombre maximum de réservations par créneau
Délai minimum de réservation (en jours)
Délai maximum de réservation (en jours)
Durée par défaut d'une réservation (en heures)
Activation/désactivation des réservations
Message personnalisé si réservations fermées

C) Paramètres de Notification

Activation/désactivation des notifications email
Templates d'emails personnalisables :

Confirmation de réservation
Validation de réservation
Refus de réservation
Rappel J-1
Inscription à un groupe
Newsletter


Activation/désactivation des notifications push (FCM)
Configuration des rappels automatiques

D) Paramètres d'Affichage

Nombre d'éléments par page (livres, réservations, etc.)
Tri par défaut du catalogue
Affichage par défaut (grille/liste)
Activation/désactivation du carrousel d'accueil
Vitesse de défilement du carrousel

4.8.2 Gestion des Administrateurs
A) Liste des Administrateurs

Tableau de tous les comptes admins
Informations affichées :

Nom complet
Email
Rôle (super_admin / admin)
Date de création
Dernière connexion
Statut (actif/inactif)


Actions :

Modifier les informations
Modifier les privilèges
Désactiver/Réactiver
Supprimer (sauf super_admin)



B) Création de Sous-Admin

Formulaire avec :

Nom complet
Email
Numéro de téléphone (optionnel)
Sélection du profil de privilèges (voir section 3.2.2)
Photo de profil (optionnel)


Envoi automatique d'invitation par email
Lien temporaire pour définir le mot de passe (valide 48h)

C) Modification des Privilèges

Interface visuelle avec checkboxes par module
Prévisualisation des actions autorisées
Enregistrement avec confirmation
Log de toutes les modifications

D) Historique des Actions Admin

Consultation de l'activité de chaque admin
Statistiques :

Nombre de connexions
Actions effectuées (par module)
Dernières actions


Graphiques d'activité

4.8.3 Paramètres Système
A) Base de Données

Affichage de la taille de la base SQLite
Optimisation/Vacuum de la base
Sauvegarde manuelle (download du fichier .db)
Restauration depuis un backup
Configuration des sauvegardes automatiques :

Fréquence (quotidienne/hebdomadaire)
Nombre de backups à conserver
Stockage local des backups



B) Cache et Performance

Vider le cache applicatif
Réinitialiser le Service Worker
Affichage de l'espace de stockage utilisé
Configuration du cache (durée de vie)

C) Sécurité

Configuration de la durée de session
Activation/désactivation du rate limiting
Configuration du nombre de tentatives de connexion autorisées
Liste des IPs bloquées (anti-spam)
Configuration de la complexité des mots de passe

D) Maintenance

Mode maintenance ON/OFF
Message personnalisé en mode maintenance
Planification de maintenance (date/heure)
Liste blanche d'IPs autorisées en mode maintenance

4.8.4 Internationalisation (i18n)
Langues Disponibles :

🇫🇷 Français (par défaut)
🇬🇧 Anglais

Fonctionnalités :

Sélecteur de langue dans le header (visiteurs)
Sélecteur de langue dans le menu admin
Persistance du choix de langue (localStorage)
Détection automatique de la langue du navigateur
Traduction de tous les éléments de l'interface :

Labels, boutons, messages
Emails automatiques
Notifications
Messages d'erreur


Gestion des formats :

Dates (DD/MM/YYYY pour FR, MM/DD/YYYY pour EN)
Heures (24h pour FR, 12h AM/PM pour EN)
Nombres (virgule vs point)



4.8.5 Accessibilité
A) Mode Sombre/Clair

Toggle dans le header (icône soleil/lune)
Détection du thème système par défaut
Transition douce entre les modes
Persistance du choix utilisateur
Contraste respectant les normes WCAG 2.1 AA

B) Options d'Accessibilité

Taille de police ajustable (petit/normal/grand)
Espacement des lignes augmenté (optionnel)
Mode haut contraste (pour malvoyants)
Désactivation des animations (pour sensibilité au mouvement)
Navigation au clavier optimisée (focus visible)
Labels ARIA sur tous les éléments interactifs

C) Responsive Design

Adaptation fluide sur tous les écrans :

Desktop (> 1024px)
Tablette (768px - 1023px)
Mobile (< 767px)


Menu hamburger sur mobile
Grilles adaptatives (CSS Grid + Flexbox)
Images responsives avec srcset
Touch-friendly (boutons min 44x44px)

4.8.6 Composants Réutilisables

<SettingsPanel> : Panneau de paramètres modulaire
<SettingsCard> : Carte de paramètre individuel
<AdminList> : Liste des administrateurs
<AdminForm> : Formulaire de création/modification admin
<PrivilegeEditor> : Éditeur visuel de privilèges
<LanguageSelector> : Sélecteur de langue
<ThemeToggle> : Bouton de changement de thème
<BackupManager> : Gestionnaire de sauvegardes
<MaintenanceMode> : Interface de mode maintenance


🗄️ 5. ARCHITECTURE TECHNIQUE DÉTAILLÉE
5.1 Frontend — Technologies et Structure
5.1.1 Stack Technique
Framework et Outils Principaux :
TechnologieVersionUtilisationReact.js18.3+Bibliothèque UI principaleVite5.0+Build tool ultra-rapideTailwindCSS3.4+Framework CSS utility-firstReact Router DOM6.20+Routing et navigationFramer Motion11.0+Animations fluidesReact Query5.0+Gestion d'état et cachei18next23.0+InternationalisationDay.js1.11+Manipulation de datesRecharts2.10+Graphiques et visualisationsLucide React0.263+Bibliothèque d'icônes
Bibliothèques Complémentaires :

react-hook-form : Gestion des formulaires avec validation
zod : Validation de schémas TypeScript-first
react-hot-toast : Notifications toast élégantes
sql.js : SQLite compilé en WebAssembly pour le navigateur
dompurify : Sanitisation HTML (sécurité XSS)
html2pdf.js : Génération de PDF côté client
papaparse : Parsing de fichiers CSV
chart.js : Graphiques complémentaires si besoin

5.1.2 Structure des Dossiers
protege-lecture-plus/
│
├── public/
│   ├── images/
│   │   ├── books/              # Couvertures de livres
│   │   ├── authors/            # Photos d'auteurs
│   │   ├── groups/             # Images de groupes
│   │   ├── events/             # Images d'événements
│   │   └── logo/               # Logos de l'ONG
│   ├── fonts/                  # Polices personnalisées
│   ├── manifest.json           # Manifest PWA
│   ├── robots.txt
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── icons/              # Icônes SVG personnalisées
│   │   └── illustrations/      # Illustrations éducatives
│   │
│   ├── components/
│   │   ├── common/             # Composants réutilisables génériques
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── layout/             # Composants de mise en page
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   │
│   │   ├── books/              # Composants liés aux livres
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookGrid.jsx
│   │   │   ├── BookFilters.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── BookForm.jsx
│   │   │   ├── AuthorSelect.jsx
│   │   │   ├── CategoryTree.jsx
│   │   │   └── AvailabilityBadge.jsx
│   │   │
│   │   ├── reservations/       # Composants de réservation
│   │   │   ├── ReservationForm.jsx
│   │   │   ├── ReservationList.jsx
│   │   │   ├── ReservationCard.jsx
│   │   │   ├── ReservationDetails.jsx
│   │   │   ├── ReservationCalendar.jsx
│   │   │   ├── ReservationActions.jsx
│   │   │   ├── ReservationStats.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── groups/             # Composants de groupes
│   │   │   ├── GroupCard.jsx
│   │   │   ├── GroupGrid.jsx
│   │   │   ├── GroupDetails.jsx
│   │   │   ├── GroupForm.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── ActivityCalendar.jsx
│   │   │   └── JoinGroupForm.jsx
│   │   │
│   │   ├── events/             # Composants d'événements
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventGrid.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── HomeCarousel.jsx
│   │   │
│   │   ├── news/               # Composants d'actualités
│   │   │   ├── NewsCard.jsx
│   │   │   ├── NewsGrid.jsx
│   │   │   ├── NewsForm.jsx
│   │   │   └── NewsDetails.jsx
│   │   │
│   │   ├── contact/            # Composants de contact
│   │   │   ├── ContactForm.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageCard.jsx
│   │   │   ├── MessageDetails.jsx
│   │   │   ├── NewsletterSignup.jsx
│   │   │   ├── SubscriberList.jsx
│   │   │   ├── EmailEditor.jsx
│   │   │   ├── CampaignStats.jsx
│   │   │   └── SimpleCaptcha.jsx
│   │   │
│   │   ├── admin/              # Composants admin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── DonutChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   ├── AlertPanel.jsx
│   │   │   ├── ReportGenerator.jsx
│   │   │   ├── LogViewer.jsx
│   │   │   ├── AdminList.jsx
│   │   │   ├── AdminForm.jsx
│   │   │   ├── PrivilegeEditor.jsx
│   │   │   └── BackupManager.jsx
│   │   │
│   │   └── auth/               # Composants d'authentification
│   │       ├── LoginForm.jsx
│   │       ├── PasswordReset.jsx
│   │       ├── PrivateRoute.jsx
│   │       └── RoleGuard.jsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Context d'authentification
│   │   ├── ThemeContext.jsx    # Context de thème (clair/sombre)
│   │   ├── LanguageContext.jsx # Context de langue
│   │   └── DatabaseContext.jsx # Context SQLite
│   │
│   ├── hooks/
│   │   ├── useAuth.js          # Hook d'authentification
│   │   ├── useDatabase.js      # Hook SQLite
│   │   ├── useBooks.js         # Hook gestion des livres
│   │   ├── useReservations.js  # Hook gestion des réservations
│   │   ├── useGroups.js        # Hook gestion des groupes
│   │   ├── useEvents.js        # Hook gestion des événements
│   │   ├── useNews.js          # Hook gestion des actualités
│   │   ├── useContact.js       # Hook gestion des messages
│   │   ├── useNewsletter.js    # Hook gestion newsletter
│   │   ├── useStats.js         # Hook statistiques
│   │   ├── useTheme.js         # Hook de thème
│   │   └── useTranslation.js   # Hook de traduction
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Books.jsx           # Catalogue de livres
│   │   ├── BookDetails.jsx     # Détails d'un livre
│   │   ├── Groups.jsx          # Groupes de lecture
│   │   ├── GroupDetails.jsx    # Détails d'un groupe
│   │   ├── Events.jsx          # Liste des événements
│   │   ├── EventDetails.jsx    # Détails d'un événement
│   │   ├── News.jsx            # Actualités
│   │   ├── NewsDetails.jsx     # Détails d'une actualité
│   │   ├── About.jsx           # À propos de l'ONG
│   │   ├── Contact.jsx         # Page de contact
│   │   ├── Login.jsx           # Connexion admin
│   │   │
│   │   └── admin/              # Pages administrateur
│   │       ├── Dashboard.jsx
│   │       ├── BooksManagement.jsx
│   │       ├── ReservationsManagement.jsx
│   │       ├── GroupsManagement.jsx
│   │       ├── EventsManagement.jsx
│   │       ├RetryMYContinue│       ├── NewsManagement.jsx
│   │       ├── ContactManagement.jsx
│   │       ├── NewsletterManagement.jsx
│   │       ├── StatisticsReports.jsx
│   │       ├── AdminManagement.jsx
│   │       └── Settings.jsx
│   │
│   ├── services/
│   │   ├── database.js         # Service SQLite
│   │   ├── firebase.js         # Configuration Firebase
│   │   ├── auth.js             # Service d'authentification
│   │   ├── notifications.js    # Service FCM
│   │   ├── email.js            # Service d'envoi d'emails
│   │   ├── export.js           # Service d'export (CSV/PDF)
│   │   └── storage.js          # Service de stockage local d'images
│   │
│   ├── utils/
│   │   ├── validators.js       # Fonctions de validation
│   │   ├── formatters.js       # Formatage de données
│   │   ├── constants.js        # Constantes globales
│   │   ├── helpers.js          # Fonctions utilitaires
│   │   └── dateUtils.js        # Utilitaires de dates
│   │
│   ├── locales/
│   │   ├── fr/
│   │   │   └── translation.json
│   │   └── en/
│   │       └── translation.json
│   │
│   ├── styles/
│   │   ├── global.css          # Styles globaux
│   │   ├── tailwind.css        # Configuration Tailwind
│   │   └── animations.css      # Animations personnalisées
│   │
│   ├── App.jsx                 # Composant racine
│   ├── main.jsx                # Point d'entrée
│   └── sw.js                   # Service Worker PWA
│
├── scripts/
│   ├── init-admin.js           # Script de création admin principal
│   ├── init-db.js              # Script d'initialisation SQLite
│   └── seed-data.js            # Script de données exemple
│
├── .env.example                # Variables d'environnement exemple
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md

#### 5.1.3 Stratégie de Composants Réutilisables

**Principes de Conception :**

1. **Atomic Design Pattern**
   - **Atoms** : Composants de base (Button, Input, Badge, Icon)
   - **Molecules** : Combinaisons simples (SearchBar, FormField, Card)
   - **Organisms** : Sections complexes (Header, BookGrid, ReservationList)
   - **Templates** : Layouts de pages (AdminLayout, PublicLayout)
   - **Pages** : Instances complètes avec données

2. **Props Standardisées**
   - Toujours inclure `className` pour extension Tailwind
   - Props `variant` pour variantes visuelles (primary, secondary, danger, etc.)
   - Props `size` pour dimensionnement (sm, md, lg, xl)
   - Props `disabled` et `loading` pour états
   - Props `children` pour contenu personnalisable

3. **Composition over Inheritance**
   - Privilégier la composition de composants
   - Éviter l'héritage profond
   - Utiliser les render props et children functions

4. **Performance**
   - Mémorisation avec `React.memo()` pour composants lourds
   - `useMemo()` et `useCallback()` pour optimisations
   - Lazy loading des pages avec `React.lazy()`
   - Code splitting par route

**Exemple de Composant Réutilisable :**
```jsx
// components/common/Button.jsx
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${(disabled || loading) && 'opacity-50 cursor-not-allowed'}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

5.2 Base de Données — SQLite
5.2.1 Choix de SQLite
Avantages :

✅ Base de données locale, pas de serveur requis
✅ Légère et performante (< 1 MB)
✅ Support complet de SQL standard
✅ Transactions ACID complètes
✅ Pas de coût cloud pour le stockage
✅ Backup simple (copie du fichier .db)
✅ Compatible avec sql.js (WebAssembly dans le navigateur)

Implémentation :

Utilisation de sql.js pour l'exécution SQLite dans le navigateur
Persistance via IndexedDB pour stockage permanent
Synchronisation périodique avec le fichier système (Node.js pour admin)

5.2.2 Schéma Complet de la Base de Données
Script de Création (init-db.sql) :
sql-- =====================================================
-- TABLES PRINCIPALES
-- =====================================================

-- Table des administrateurs
CREATE TABLE administrateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nom_complet TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  privileges TEXT, -- JSON des privilèges détaillés
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
CREATE TABLE auteurs (
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
CREATE TABLE categories (
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
CREATE TABLE livres (
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
  tags TEXT, -- Séparés par virgules
  cote TEXT,
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
  ajoute_par INTEGER NOT NULL REFERENCES administrateurs(id),
  CONSTRAINT check_statut CHECK (statut IN ('disponible', 'reserve_complet', 'maintenance')),
  CONSTRAINT check_langue CHECK (langue IN ('FR', 'EN', 'ES', 'DE', 'AUTRE'))
);

-- Table des réservations
CREATE TABLE reservations (
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
CREATE TABLE groupes_lecture (
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
CREATE TABLE membres_groupes (
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
CREATE TABLE activites_groupes (
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
CREATE TABLE evenements (
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
CREATE TABLE actualites (
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
CREATE TABLE messages_contact (
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
CREATE TABLE newsletter_abonnes (
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
CREATE TABLE newsletter_envois (
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
CREATE TABLE statistiques_journalieres (
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
CREATE TABLE logs_activite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER REFERENCES administrateurs(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT, -- JSON des détails
  ip_address TEXT,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_module CHECK (module IN ('livres', 'reservations', 'groupes', 'evenements', 'actualites', 'contact', 'newsletter', 'administration'))
);

-- Table des paramètres système
CREATE TABLE parametres_systeme (
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

CREATE INDEX idx_livres_auteur ON livres(auteur_id);
CREATE INDEX idx_livres_categorie ON livres(categorie_id);
CREATE INDEX idx_livres_statut ON livres(statut);
CREATE INDEX idx_livres_date_ajout ON livres(date_ajout);

CREATE INDEX idx_reservations_livre ON reservations(livre_id);
CREATE INDEX idx_reservations_statut ON reservations(statut);
CREATE INDEX idx_reservations_date_souhaitee ON reservations(date_souhaitee);
CREATE INDEX idx_reservations_email ON reservations(email_visiteur);

CREATE INDEX idx_membres_groupe ON membres_groupes(groupe_id);
CREATE INDEX idx_membres_email ON membres_groupes(email);

CREATE INDEX idx_activites_groupe ON activites_groupes(groupe_id);
CREATE INDEX idx_activites_date ON activites_groupes(date_activite);

CREATE INDEX idx_evenements_statut ON evenements(statut);
CREATE INDEX idx_evenements_date_debut ON evenements(date_debut);

CREATE INDEX idx_actualites_statut ON actualites(statut);
CREATE INDEX idx_actualites_date_creation ON actualites(date_creation);

CREATE INDEX idx_messages_statut ON messages_contact(statut);
CREATE INDEX idx_messages_date ON messages_contact(date_envoi);

CREATE INDEX idx_newsletter_statut ON newsletter_abonnes(statut);

CREATE INDEX idx_logs_utilisateur ON logs_activite(utilisateur_id);
CREATE INDEX idx_logs_module ON logs_activite(module);
CREATE INDEX idx_logs_date ON logs_activite(date_action);

-- =====================================================
-- TRIGGERS POUR COHÉRENCE DES DONNÉES
-- =====================================================

-- Mise à jour automatique du nombre de livres par auteur
CREATE TRIGGER update_auteur_count_insert
AFTER INSERT ON livres
BEGIN
  UPDATE auteurs SET nombre_livres = nombre_livres + 1 WHERE id = NEW.auteur_id;
END;

CREATE TRIGGER update_auteur_count_delete
AFTER DELETE ON livres
BEGIN
  UPDATE auteurs SET nombre_livres = nombre_livres - 1 WHERE id = OLD.auteur_id;
END;

-- Mise à jour automatique du nombre de livres par catégorie
CREATE TRIGGER update_categorie_count_insert
AFTER INSERT ON livres
BEGIN
  UPDATE categories SET nombre_livres = nombre_livres + 1 WHERE id = NEW.categorie_id;
END;

CREATE TRIGGER update_categorie_count_delete
AFTER DELETE ON livres
BEGIN
  UPDATE categories SET nombre_livres = nombre_livres - 1 WHERE id = OLD.categorie_id;
END;

-- Mise à jour automatique de la date de modification des livres
CREATE TRIGGER update_livre_modification
AFTER UPDATE ON livres
BEGIN
  UPDATE livres SET date_modification = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Mise à jour automatique du nombre de membres par groupe
CREATE TRIGGER update_groupe_membres_insert
AFTER INSERT ON membres_groupes
BEGIN
  UPDATE groupes_lecture SET nombre_membres = nombre_membres + 1 WHERE id = NEW.groupe_id;
END;

CREATE TRIGGER update_groupe_membres_delete
AFTER DELETE ON membres_groupes
BEGIN
  UPDATE groupes_lecture SET nombre_membres = nombre_membres - 1 WHERE id = OLD.groupe_id;
END;

-- =====================================================
-- INSERTION DES DONNÉES INITIALES
-- =====================================================

-- Paramètres système par défaut
INSERT INTO parametres_systeme (cle, valeur, type, description) VALUES
('nom_centre', 'Centre de Lecture Protégé QV', 'string', 'Nom du centre de lecture'),
('adresse', 'Rond-Point Express, Yaoundé, Cameroun', 'string', 'Adresse complète'),
('telephone', '+237 6XX XX XX XX', 'string', 'Numéro de téléphone'),
('email_contact', 'contact@protegeqv.org', 'string', 'Email de contact'),
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
INSERT INTO categories (nom, description, couleur_hex, ordre_affichage) VALUES
('Romans', 'Romans et œuvres de fiction littéraire', '#A5D6A7', 1),
('Éducation', 'Livres éducatifs et manuels scolaires', '#81C784', 2),
('Sciences', 'Ouvrages scientifiques et techniques', '#66BB6A', 3),
('Histoire', 'Livres d histoire et biographies', '#4CAF50', 4),
('Jeunesse', 'Livres pour enfants et adolescents', '#43A047', 5),
('Développement Personnel', 'Livres de croissance personnelle et bien-être', '#388E3C', 6),
('Culture', 'Arts, culture et société', '#2E7D32', 7),
('Religion & Philosophie', 'Ouvrages religieux et philosophiques', '#1B5E20', 8);
5.2.3 Service de Gestion SQLite
Fichier : src/services/database.js
javascriptimport initSqlJs from 'sql.js';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Charger la base depuis IndexedDB si elle existe
      const savedDb = await this.loadFromIndexedDB();
      
      if (savedDb) {
        this.db = new SQL.Database(new Uint8Array(savedDb));
      } else {
        this.db = new SQL.Database();
        await this.createSchema();
      }

      this.isInitialized = true;
      console.log('✅ Base de données SQLite initialisée');
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la base:', error);
      throw error;
    }
  }

  async createSchema() {
    // Exécuter le script SQL complet de création
    const schemaSQL = await fetch('/schema.sql').then(r => r.text());
    this.db.exec(schemaSQL);
  }

  query(sql, params = []) {
    if (!this.isInitialized) {
      throw new Error('Base de données non initialisée');
    }

    try {
      const results = this.db.exec(sql, params);
      return this.formatResults(results);
    } catch (error) {
      console.error('Erreur SQL:', sql, params, error);
      throw error;
    }
  }

  queryOne(sql, params = []) {
    const results = this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  run(sql, params = []) {
    if (!this.isInitialized) {
      throw new Error('Base de données non initialisée');
    }

    try {
      this.db.run(sql, params);
      // Sauvegarder après chaque modification
      this.saveToIndexedDB();
      return { success: true };
    } catch (error) {
      console.error('Erreur SQL:', sql, params, error);
      throw error;
    }
  }

  formatResults(results) {
    if (results.length === 0) return [];

    const { columns, values } = results[0];
    return values.map(row => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  async saveToIndexedDB() {
    const data = this.db.export();
    const buffer = data.buffer;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProtegeDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['database'], 'readwrite');
        const store = transaction.objectStore('database');
        store.put(buffer, 'protege-lecture');
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('database')) {
          db.createObjectStore('database');
        }
      };
    });
  }

  async loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProtegeDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['database'], 'readonly');
        const store = transaction.objectStore('database');
        const getRequest = store.get('protege-lecture');

        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('database')) {
          db.createObjectStore('database');
        }
      };
    });
  }

  async backup() {
    const data = this.db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protege-backup-${new Date().toISOString()}.db`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async restore(file) {
    const arrayBuffer = await file.arrayBuffer();
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    this.db = new SQL.Database(new Uint8Array(arrayBuffer));
    await this.saveToIndexedDB();
  }
}

export default new DatabaseService();

5.3 Services Cloud — Firebase
5.3.1 Configuration Firebase
Services Utilisés (UNIQUEMENT) :
ServiceUtilisationJustificationAuthenticationConnexion administrateurs (Email/Password + Google OAuth)Gestion sécurisée des identitésCloud Messaging (FCM)Notifications push pour admins et visiteurs (PWA)Alertes temps réelAnalyticsSuivi d'utilisation anonymiséAmélioration continueCrashlyticsDétection et logging des erreursStabilitéRemote ConfigParamètres dynamiques sans redéploiementFlexibilitéPerformance MonitoringMesure des performances applicativesOptimisation
Services NON Utilisés :

❌ Cloud Storage : Remplacé par stockage local des images
❌ Firestore : Remplacé par SQLite
❌ Realtime Database : Remplacé par SQLite
❌ Hosting : Déploiement sur infrastructure propre

Fichier : src/services/firebase.js
javascriptimport { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getRemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
export const performance = getPerformance(app);
export const remoteConfig = getRemoteConfig(app);

// Configuration Remote Config
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000, // 1 heure
  fetchTimeoutMillis: 60000
};

remoteConfig.defaultConfig = {
  maintenance_mode: false,
  max_reservations_per_day: 20,RetryMYContinuefeature_notifications_enabled: true,
feature_groups_enabled: true,
feature_newsletter_enabled: true
};
export default app;

#### 5.3.2 Service d'Authentification

**Fichier : `src/services/auth.js`**
```javascript
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import databaseService from './database';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentAdmin = null;
  }

  // Initialiser l'écouteur d'état d'authentification
  initAuthListener(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        // Récupérer les infos admin depuis SQLite
        this.currentAdmin = await this.getAdminData(user.uid);
        callback(this.currentAdmin);
      } else {
        this.currentUser = null;
        this.currentAdmin = null;
        callback(null);
      }
    });
  }

  // Connexion par email/mot de passe
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Vérifier que l'utilisateur est bien admin
      const adminData = await this.getAdminData(user.uid);
      
      if (!adminData) {
        await this.logout();
        throw new Error('Compte administrateur introuvable');
      }

      if (adminData.statut !== 'actif') {
        await this.logout();
        throw new Error('Compte désactivé. Contactez le super administrateur.');
      }

      // Enregistrer la connexion
      await this.logConnection(adminData.id);

      return adminData;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw this.handleAuthError(error);
    }
  }

  // Connexion avec Google OAuth
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Vérifier que l'utilisateur est bien admin
      const adminData = await this.getAdminData(user.uid);
      
      if (!adminData) {
        await this.logout();
        throw new Error('Compte administrateur introuvable');
      }

      if (adminData.statut !== 'actif') {
        await this.logout();
        throw new Error('Compte désactivé');
      }

      await this.logConnection(adminData.id);

      return adminData;
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      throw this.handleAuthError(error);
    }
  }

  // Déconnexion
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.currentAdmin = null;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }

  // Réinitialisation du mot de passe
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      throw this.handleAuthError(error);
    }
  }

  // Récupérer les données admin depuis SQLite
  async getAdminData(firebaseUid) {
    const result = databaseService.queryOne(
      'SELECT * FROM administrateurs WHERE firebase_uid = ? AND statut = ?',
      [firebaseUid, 'actif']
    );

    if (result && result.privileges) {
      result.privileges = JSON.parse(result.privileges);
    }

    return result;
  }

  // Enregistrer la connexion dans les logs
  async logConnection(adminId) {
    databaseService.run(
      'UPDATE administrateurs SET date_derniere_connexion = ? WHERE id = ?',
      [new Date().toISOString(), adminId]
    );

    databaseService.run(
      `INSERT INTO logs_activite (utilisateur_id, action, module, details) 
       VALUES (?, ?, ?, ?)`,
      [adminId, 'connexion', 'administration', JSON.stringify({ timestamp: new Date().toISOString() })]
    );
  }

  // Vérifier les privilèges
  hasPrivilege(module, action) {
    if (!this.currentAdmin) return false;
    if (this.currentAdmin.role === 'super_admin') return true;

    const privileges = this.currentAdmin.privileges || {};
    return privileges[module]?.[action] === true;
  }

  // Gestion des erreurs Firebase
  handleAuthError(error) {
    const errorMessages = {
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte associé à cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/network-request-failed': 'Erreur de connexion réseau',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    };

    return new Error(errorMessages[error.code] || error.message);
  }
}

export default new AuthService();
5.3.3 Service de Notifications (FCM)
Fichier : src/services/notifications.js
javascriptimport { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

class NotificationService {
  constructor() {
    this.token = null;
  }

  // Demander l'autorisation et obtenir le token
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permission de notification accordée');
        await this.getToken();
      } else {
        console.log('⚠️ Permission de notification refusée');
      }
    } catch (error) {
      console.error('Erreur de demande de permission:', error);
    }
  }

  // Obtenir le token FCM
  async getToken() {
    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });

      if (token) {
        this.token = token;
        console.log('Token FCM obtenu:', token);
        // Sauvegarder le token pour l'admin connecté
        await this.saveTokenForAdmin(token);
      }
    } catch (error) {
      console.error('Erreur d\'obtention du token FCM:', error);
    }
  }

  // Écouter les messages en premier plan
  listenForMessages(callback) {
    onMessage(messaging, (payload) => {
      console.log('Message reçu en premier plan:', payload);
      
      // Afficher une notification personnalisée
      if (callback) {
        callback(payload);
      } else {
        this.showNotification(payload.notification);
      }
    });
  }

  // Afficher une notification locale
  showNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/logo-192.png',
        badge: '/logo-96.png',
        tag: 'protege-notification',
        requireInteraction: true
      });
    }
  }

  // Sauvegarder le token pour l'admin
  async saveTokenForAdmin(token) {
    // Logique pour associer le token à l'admin connecté
    // Pourrait être stocké dans SQLite ou envoyé à un backend
    localStorage.setItem('fcm_token', token);
  }
}

export default new NotificationService();
5.3.4 Service Worker pour PWA
Fichier : public/sw.js
javascriptconst CACHE_NAME = 'protege-lecture-v1';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache des fichiers statiques');
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interception des requêtes (stratégie Cache First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Mettre en cache les nouvelles ressources
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Page hors ligne de secours
      return caches.match('/offline.html');
    })
  );
});

// Écouter les messages push (FCM)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/logo-192.png',
    badge: '/logo-96.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'view', title: 'Voir' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Protégé Lecture+', options)
  );
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

5.4 Stockage Local des Images
5.4.1 Architecture de Stockage
Remplacement de Firebase Cloud Storage :
Les images sont stockées localement dans le dossier public/images/ avec une organisation structurée :
public/images/
├── books/              # Couvertures de livres
│   ├── {livre_id}.jpg
│   └── {livre_id}.webp
├── authors/            # Photos d'auteurs
│   └── {auteur_id}.jpg
├── groups/             # Images de groupes de lecture
│   └── {groupe_id}.jpg
├── events/             # Images d'événements
│   └── {event_id}.jpg
├── news/               # Images d'actualités
│   └── {news_id}.jpg
└── admins/             # Photos de profil admins
    └── {admin_id}.jpg
5.4.2 Service de Gestion des Images
Fichier : src/services/storage.js
javascriptclass StorageService {
  constructor() {
    this.baseImagePath = '/images';
  }

  // Upload d'une image (convertie en base64 puis sauvegardée)
  async uploadImage(file, folder, id) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const base64 = e.target.result;
          
          // Compression de l'image
          const compressed = await this.compressImage(base64, 800, 0.8);
          
          // Génération du nom de fichier
          const extension = file.type.split('/')[1];
          const filename = `${id}.${extension}`;
          const path = `${folder}/${filename}`;

          // Sauvegarde locale via API
          await this.saveImageLocally(path, compressed);

          resolve(path);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Compression d'image
  async compressImage(base64, maxWidth, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionnement proportionnel
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Conversion en base64 compressé
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
    });
  }

  // Sauvegarde locale (simulation - en production, utiliser une API backend)
  async saveImageLocally(path, base64) {
    // En environnement de développement, stocker dans localStorage
    // En production, envoyer à un endpoint backend pour sauvegarde sur disque
    
    if (import.meta.env.MODE === 'development') {
      localStorage.setItem(`image_${path}`, base64);
    } else {
      // Appel API backend pour sauvegarde réelle
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, data: base64 })
      });

      if (!response.ok) {
        throw new Error('Erreur de sauvegarde de l\'image');
      }
    }
  }

  // Récupération d'une image
  getImageUrl(path) {
    if (!path) return '/images/placeholder.jpg';

    if (import.meta.env.MODE === 'development') {
      return localStorage.getItem(`image_${path}`) || `/images/${path}`;
    }

    return `${this.baseImagePath}/${path}`;
  }

  // Suppression d'une image
  async deleteImage(path) {
    if (import.meta.env.MODE === 'development') {
      localStorage.removeItem(`image_${path}`);
    } else {
      await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
    }
  }

  // Validation de fichier
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
    }

    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux (max 5 MB).');
    }

    return true;
  }
}

export default new StorageService();

🎨 6. DESIGN ET EXPÉRIENCE UTILISATEUR
6.1 Charte Graphique
6.1.1 Palette de Couleurs Principale
Thème Vert Clair (Light Green) :
CouleurHexUsageVert Principal#A5D6A7Boutons principaux, en-têtes, éléments clésVert Foncé#66BB6AHover states, accentsVert Très Foncé#388E3CTextes importants, icônesBlanc#FFFFFFArrière-plans, cartesGris Très Clair#F5F5F5Arrière-plan secondaireGris Clair#E0E0E0Bordures, séparateursGris Moyen#9E9E9ETextes secondairesGris Foncé#424242Textes principaux
Mode Sombre (Dark Mode) :
CouleurHexUsageFond Principal#121212Arrière-plan généralFond Secondaire#1E1E1ECartes, panneauxVert Clair#81C784Éléments interactifsBlanc Cassé#E0E0E0Textes principauxGris Clair#B0B0B0Textes secondaires
6.1.2 Typographie
Polices Principales :

Titres & En-têtes : Inter, system-ui, sans-serif

Font weights : 600 (SemiBold), 700 (Bold)
Tailles : 2xl (32px), xl (24px), lg (20px)


Corps de texte : Inter, system-ui, sans-serif

Font weight : 400 (Regular), 500 (Medium)
Taille : base (16px), sm (14px)


Mono (Code) : 'Fira Code', monospace

6.1.3 Configuration Tailwind
Fichier : tailwind.config.js
javascript/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          elevated: '#2C2C2C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
6.2 Pages et Écrans Principaux
6.2.1 Page d'Accueil (Home)
Structure :

Hero Section

Titre accrocheur : "Bienvenue au Centre de Lecture Protégé QV"
Sous-titre : "La lecture, un pont vers la connaissance et la communauté"
Bouton CTA : "Explorer les livres"
Image/Illustration du centre


Carrousel d'Événements

Slider automatique des 5 derniers événements
Navigation manuelle (flèches + dots)
Liens directs vers les détails


Statistiques Clés (Cards)

Nombre de livres disponibles
Membres des groupes de lecture
Événements à venir


Section "Livres Populaires"

Grille de 6-8 livres les plus consultés
Lien "Voir tout le catalogue"


Section "Groupes de Lecture"

Aperçu de 3 groupes actifs
Lien "Découvrir tous les groupes"


Section "À Propos"

Description courte de l'ONG
Mission et vision
Lien "En savoir plus"


Newsletter Signup

Widget d'inscription



6.2.2 Page Catalogue de Livres
Layout :

Sidebar gauche : Filtres (catégories, auteurs, disponibilité, langue)
Zone principale : Grille de livres avec pagination
Header : Barre de recherche + sélecteur de tri + toggle vue (grille/liste)

Éléments d'une Carte Livre :

Image de couverture
Titre (tronqué à 2 lignes)
Auteur
Badge de catégorie
Badge de disponibilité (vert = disponible, rouge = réservé)
Bouton "Voir détails"

6.2.3 Page Détails d'un Livre
Layout :

Colonne gauche (40%) : Image de couverture en grand
Colonne droite (60%) :

Titre
Auteur (lien cliquable)
Catégorie, Année, Éditeur
Résumé complet
Tags
Disponibilité (X exemplaires disponibles)
Bouton "Réserver ce livre" (si disponible)



Section "Livres Similaires" (en bas)
6.2.4 Tableau de Bord Administrateur
Layout :

Sidebar gauche : Menu de navigation (modules)
Header : Profil admin, notifications, logout
Zone principale : Contenu dynamique selon le module sélectionné

Dashboard Principal :

Widgets statistiques (4 cards en haut)
2 graphiques (ligne + donut)
Liste des réservations du jour
Flux d'activité récente


🔐 7. SÉCURITÉ ET BONNES PRATIQUES
7.1 Sécurité Frontend

Validation des Entrées

Utiliser zod pour validation de schémas
Sanitisation HTML avec DOMPurify
Validation côté client ET serveur (SQLite)


Protection XSS

Échappement automatique dans React
Sanitisation du contenu riche (éditeur WYSIWYG)
Content Security Policy (CSP) dans les headers


Protection CSRF

Tokens CSRF pour les actions sensibles
Vérification de l'origine des requêtes


Gestion des Secrets

Variables d'environnement (.env)
Ne jamais commit les clés API
Rotation régulière des tokens



7.2 Sécurité Base de Données

Requêtes Préparées

Toujours utiliser des paramètres bindés
Jamais de concaténation de strings SQL


Contrôle d'Accès

Vérification des privilèges avant chaque action
Logs de toutes les modifications


Backups Automatiques

Sauvegarde quotidienne de la base SQLite
Rotation des backups (garder 30 derniers)
Test de restauration mensuel



7.3 Performance et Optimisation

Code Splitting

Lazy loading des pages admin
Dynamic imports pour composants lourds


Optimisation Images

Compression automatique
Formats modernes (WebP)
Lazy loading avec Intersection Observer


Caching Intelligent

Service Worker pour cache des assets
React Query pour cache des données
Stratégie Cache-First pour images


Monitoring

Firebase Performance Monitoring
Crashlytics pour les erreurs
Analytics pour l'usage




📦 8. LIVRABLES ET DÉPLOIEMENT
8.1 Livrables

Code Source Complet

Repository Git avec historique propre
README détaillé
Documentation technique


Base de Données

Fichier SQLite initialisé
Script de création de schéma
Script de données exemple


Documentation

Manuel administrateur (PDF)
Guide d'installation
Guide de maintenance


Assets

Logo et visuels
Images placeholder
Icônes personnalisées


Configuration

Fichiers .env.example
Configuration Firebase
Configuration Tailwind



8.2 Script d'Initialisation Admin
Fichier : scripts/init-admin.js
javascriptimport databaseService from '../src/services/database.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebase.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function initSuperAdmin() {
  console.log('\n🔐 Initialisation du Super Administrateur\n');

  rl.question('Email: ', async (email) => {
    rl.question('Mot de passe: ', async (password) => {
      rl.question('Nom complet: ', async (nomComplet) => {
        
        try {
          // Créer le compte Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUid = userCredential.user.uid;

          // Insérer dans SQLite
          await databaseService.initialize();
          
          databaseService.run(
            `INSERT INTO administrateurs (firebase_uid, email, nom_complet, role, statut)
             VALUES (?, ?, ?, ?, ?)`,
            [firebaseUid, email, nomComplet, 'super_admin', 'actif']
          );

          console.log('\n✅ Super Admin créé avec succès!');
          console.log(`📧 Email: ${email}`);
          console.log(`👤 Nom: ${nomComplet}`);
          console.log(`🔑 UID Firebase: ${firebaseUid}\n`);

          process.exit(0);
        } catch (error) {
          console.error('\n❌ Erreur:', error.message);
          process.exit(1);
        }
      });
    });
  });
}

initSuperAdmin();
Commande d'exécution :
bashnpm run init:admin
8.3 Instructions de Déploiement
1. Installation des Dépendances
bashnpm install
2. Configuration Firebase

Créer un projet Firebase
Activer Authentication, FCM, Analytics
Copier les credentials dans .env

3. Initialisation de la Base
bashnpm run init:db
npm run init:admin
4. Build de Production
bashnpm run build
5. Déploiement

Hébergement: Netlify, Vercel, ou serveur propre
Configuration du Service Worker
Test PWA avec Lighthouse


📅 9. PLANNING DE DÉVELOPPEMENT
PhaseTâches PrincipalesDuréeLivrablesPhase 1: Analyse & Design- Validation du cahier des charges<br>- Design UI/UX (Figma)<br>- Wireframes des pages<br>- Charte graphique finale1 semaineMaquettes validées,<br>Charte graphiquePhase 2: Architecture- Setup React + Vite<br>- Configuration Tailwind<br>- Création schéma SQLite<br>- Configuration Firebase<br>- Structure composants réutilisables1 semaineProjet initialisé,<br>Base SQLite,<br>Composants de basePhase 3: Modules Core- Module Authentification<br>- Module Livres<br>- Module Réservations<br>- Stockage local images2 semainesModules fonctionnels,<br>Tests unitairesPhase 4: Modules Complémentaires- Module Groupes<br>- Module Événements<br>- Module Contact/Newsletter<br>- Module Statistiques1,5 semainesModules terminés,<br>Intégration complètePhase 5: Administration- Tableau de bord<br>- Gestion privilèges<br>- Rapports & exports<br>- Paramètres système1 semaineInterface admin complète**PhaseRetryThis response paused because Claude reached its max length for a message. Hit continue to nudge Claude along.ContinueClaude can make mistakes. Please double-check responses. Sonnet 4.5



firebase config (// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);)


(
Your project
Project name
protegeqv
Project ID 
protegeqv-2532f
Project number 
553100729963
Web API Key 
AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q
Environment
This setting customizes your project for different stages of the app lifecycle
Environment type
Production
Public settings
These settings control instances of your project shown to the public
Public-facing name 
project-553100729963
Support email 
yvangodimomo@gmail.com



Firebase Cloud Messaging API (V1)Enabled
Recommended for most use cases. Learn more

Check the real time performance of the V1 API on the Status Dashboard

Sender ID
Service Account
553100729963	Manage Service Accounts
Cloud Messaging API (Legacy)Disabled
If you are an existing user of the legacy HTTP or XMPP APIs (deprecated on 6/20/2023), you must migrate to the latest Firebase Cloud Messaging API (HTTP v1) by 6/20/2024. Learn more

Web configuration
Web Push certificates
Web Push certificates
Firebase Cloud Messaging can use Application Identity key pairs to connect with external push services. Learn more
Key pair	Date added	Status	Actions
BKcs9NVbQrWwTPnhTCLYX4h8udtR23404Ci58TCcaMsrbpNoQnDosl5DM7_4SPnd-r5zJZVGndRSJeqmnVWocfg	Oct 10, 2025		
)