# Protégé Lecture+ 📚

> Plateforme de Réservation du Centre de Lecture — Protégé QV ONG
> 
> *"La lecture, un pont vers la connaissance et la communauté."*

## Vue d'ensemble

Protégé Lecture+ est une plateforme web moderne conçue pour le Centre de Lecture et Bibliothèque Communautaire de Protégé QV ONG à Yaoundé, Cameroun. Elle permet la gestion complète d'un catalogue de livres, des réservations de lecture sur place, des groupes de lecture communautaires et des événements culturels.

## 🎯 Fonctionnalités Principales

### Pour les Visiteurs
- ✅ Consultation du catalogue de livres avec filtres avancés
- ✅ Réservation de livres pour lecture sur place
- ✅ Découverte des groupes de lecture
- ✅ Consultation des événements et actualités
- ✅ Inscription à la newsletter
- ✅ Formulaire de contact

### Pour les Administrateurs
- ✅ Gestion complète du catalogue (livres, auteurs, catégories)
- ✅ Validation et gestion des réservations
- ✅ Création et animation de groupes de lecture
- ✅ Publication d'événements et d'actualités
- ✅ Gestion de la newsletter et des messages
- ✅ Statistiques et rapports
- ✅ Système de privilèges multi-niveaux

## 🛠️ Stack Technique

### Frontend
- **React 18.3+** - Bibliothèque UI
- **Vite 5.0+** - Build tool ultra-rapide
- **TailwindCSS 3.4+** - Framework CSS utility-first
- **React Router DOM 7.9+** - Routing
- **Framer Motion 12.0+** - Animations fluides
- **TanStack React Query 5.9+** - Gestion d'état et cache
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **Node.js + Express** - Serveur API REST
- **SQLite** - Base de données avec better-sqlite3
- **JWT (jsonwebtoken)** - Authentification sécurisée
- **bcryptjs** - Hachage des mots de passe
- **Helmet** - Sécurité HTTP
- **CORS** - Gestion des requêtes cross-origin
- **express-rate-limit** - Limitation du taux de requêtes

### Outils & Librairies
- **react-hook-form** + **zod** - Gestion de formulaires avec validation
- **react-hot-toast** - Notifications toast
- **dayjs** - Manipulation de dates
- **recharts** - Graphiques et visualisations
- **dompurify** - Sanitisation HTML
- **papaparse** - Import/Export CSV

## 📦 Installation

### Prérequis
- Node.js 20+ (recommandé: v22.12.0+)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd protege-lecture-plus
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Éditez le fichier `.env` et configurez:
   - `JWT_SECRET` - Clé secrète pour JWT (requis pour la sécurité)
   - `DATABASE_PATH` - Chemin vers la base SQLite (optionnel)
   - `PORT` - Port du serveur backend (défaut: 5000)
   - `FRONTEND_URL` - URL du frontend (défaut: http://localhost:5173)
   - `NODE_ENV` - Environnement (development/production)

4. **Initialiser la base de données**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera accessible à:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health**: `http://localhost:5000/api/health`

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev              # Lance frontend + backend simultanément
npm run dev:frontend    # Lance seulement le frontend (Vite)
npm run dev:backend     # Lance seulement le backend (Node.js)

# Production
npm run build          # Build de production du frontend
npm run preview        # Prévisualisation du build
npm run start          # Lance le serveur backend en production

# Base de données
npm run migrate        # Exécute les migrations de base de données
npm run seed           # Initialise les données par défaut

# Tests
npm run test           # Exécute tous les tests (Vitest)
npm run test:watch     # Tests en mode watch
npm run test:backend   # Tests du backend uniquement
npm run test:frontend  # Tests du frontend uniquement
npm run test:coverage  # Tests avec couverture de code
npm run lint           # Vérifie le code avec ESLint
```

## 📂 Structure du Projet

```
protege-lecture-plus/
├── public/
│   ├── images/          # Images (books, authors, events, etc.)
│   ├── schema.sql       # Schéma SQLite
│   └── manifest.json    # PWA Manifest
├── server/              # Backend Node.js/Express
│   ├── routes/          # Routes API REST
│   │   ├── auth.js      # Authentification
│   │   ├── books.js     # Gestion des livres
│   │   ├── reservations.js # Réservations
│   │   ├── events.js    # Événements
│   │   ├── groups.js    # Groupes de lecture
│   │   └── contacts.js  # Messages de contact
│   ├── middleware/      # Middleware Express
│   ├── config/          # Configuration (DB, etc.)
│   ├── migrations/      # Scripts de migration/seeding
│   ├── test/            # Tests backend
│   └── index.js         # Point d'entrée serveur
├── src/
│   ├── components/      # Composants React
│   │   ├── common/      # Composants réutilisables
│   │   ├── layout/      # Layouts (Header, Footer)
│   │   ├── books/       # Composants liés aux livres
│   │   ├── reservations/# Composants de réservation
│   │   ├── groups/      # Composants des groupes
│   │   ├── events/      # Composants d'événements
│   │   ├── admin/       # Composants admin
│   │   └── auth/        # Composants d'authentification
│   ├── contexts/        # React Contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/           # Custom Hooks
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services frontend (API, etc.)
│   ├── styles/          # Styles globaux
│   ├── utils/           # Utilitaires et helpers
│   ├── test/            # Tests frontend
│   ├── App.jsx          # Composant racine
│   └── main.jsx         # Point d'entrée
├── scripts/             # Scripts d'initialisation
├── vitest.config.js     # Configuration tests
└── package.json
```

## 🔐 Authentification

### Compte Administrateur par Défaut

Pour créer le premier compte super administrateur:

```bash
npm run init:admin
```

Puis suivez les instructions pour entrer:
- Email
- Mot de passe (min. 8 caractères avec majuscule, minuscule, chiffre et caractère spécial)
- Nom complet

### Connexion

Accédez à `/login` et utilisez vos identifiants administrateur.

## 🎨 Thèmes

L'application supporte deux thèmes:
- **Mode Clair** - Par défaut
- **Mode Sombre** - Détecté automatiquement selon les préférences système

Basculer entre les thèmes via l'icône dans le header.

## 💾 Base de Données

### Schéma

La base de données SQLite contient les tables suivantes:
- `administrateurs` - Comptes administrateurs
- `auteurs` - Auteurs de livres
- `categories` - Catégories de livres
- `livres` - Catalogue de livres
- `reservations` - Réservations de lecture
- `groupes_lecture` - Groupes de lecture
- `membres_groupes` - Membres des groupes
- `activites_groupes` - Activités des groupes
- `evenements` - Événements culturels
- `actualites` - Actualités
- `messages_contact` - Messages de contact
- `newsletter_abonnes` - Abonnés newsletter
- `newsletter_envois` - Campagnes newsletter
- `statistiques_journalieres` - Statistiques
- `logs_activite` - Logs d'activité
- `parametres_systeme` - Paramètres

### Sauvegarde & Restauration

La base de données est automatiquement persistée dans IndexedDB. Pour créer une sauvegarde manuelle, utilisez l'interface d'administration.

## 📋 État d'avancement du Projet

### ✅ Phases Complétées

1. ✅ **Phase 1: Initialisation du Projet**
   - Setup React + Vite
   - Configuration Tailwind CSS
   - Installation des dépendances

2. ✅ **Phase 2: Migration Backend**
   - **MIGRÉ**: Node.js + Express backend remplaçant Firebase
   - **MIGRÉ**: SQLite avec better-sqlite3
   - **MIGRÉ**: Authentification JWT + bcryptjs
   - **MIGRÉ**: API RESTful complète
   - **MIGRÉ**: Middleware de sécurité (Helmet, CORS, rate-limiting)

3. ✅ **Phase 3: Base de Données**
   - Schéma SQLite complet avec 15+ tables
   - Migrations et seeding automatiques
   - Indexes pour optimiser les performances

4. ✅ **Phase 4: Composants Communs**
   - Button, Card, Modal, Input, Select, Textarea
   - Badge, Loader, Pagination, SearchBar
   - ConfirmDialog
   - Contexts (Auth, Theme) - DatabaseContext supprimé
   - Layout (Header, Footer)

5. ✅ **Phase 5: Module d'Authentification**
   - Routes privées avec middleware d'authentification
   - Guards de rôles (super_admin, admin)
   - Gestion des privilèges par module
   - Authentification JWT avec cookies sécurisés

6. ✅ **Phase 6: API REST Backend**
   - Routes CRUD complètes pour toutes les entités
   - Validation des données avec express-validator
   - Gestion d'erreurs centralisée
   - Logs d'activité

7. ✅ **Phase 7: Services Frontend**
   - Service API centralisé remplaçant Firebase
   - Gestion des tokens et authentification
   - Intégration complète avec le backend

8. ✅ **Phase 8: Tests**
   - Tests unitaires frontend et backend
   - Configuration Vitest
   - Tests d'intégration API

### 🚧 Phases En Cours

9. ⏳ **Phase 9: Module Livres & Catalogue**
   - Intégration complète frontend-backend pour les livres
   - Filtres et recherche avancée optimisées

10. ⏳ **Phase 10: Module Réservations**
   - Formulaire de réservation visiteur
   - Validation par l'admin
   - Calendrier des réservations
   - Notifications automatiques

8. ⏳ **Phase 8: Module Groupes de Lecture**
   - CRUD des groupes
   - Gestion des membres
   - Activités et rencontres

9. ⏳ **Phase 9: Module Événements & Actualités**
   - CRUD événements et actualités
   - Carrousel page d'accueil
   - Éditeur de texte riche

10. ⏳ **Phase 10: Module Contact & Newsletter**
    - Formulaire de contact
    - Gestion des messages
    - Campagnes newsletter

11. ⏳ **Phase 11: Tableau de Bord Admin**
    - Statistiques et graphiques
    - Flux d'activité
    - Génération de rapports

12. ⏳ **Phase 12: Module Paramètres**
    - Paramètres système
    - Gestion des administrateurs
    - Éditeur de privilèges

13. ⏳ **Phase 13: Pages Publiques**
    - Pages complètes pour les visiteurs
    - Optimisation SEO

14. ⏳ **Phase 14: PWA**
    - Service Worker
    - Support hors ligne
    - Installation sur mobile

15. ⏳ **Phase 15: Internationalisation**
    - Français / Anglais
    - Traductions complètes

16. ⏳ **Phase 16: Tests & Optimisation**
    - Tests unitaires
    - Optimisation des performances
    - Sécurité renforcée

## 🤝 Contribution

Ce projet est développé pour Protégé QV ONG.

## 📄 Licence

© 2025 Protégé QV ONG. Tous droits réservés.

## 📞 Contact

- **Organisation**: Protégé QV ONG
- **Email**: contact@protegeqv.org
- **Localisation**: Rond-Point Express, Yaoundé, Cameroun

---

*Construit avec ❤️ pour promouvoir la lecture et la culture au Cameroun*

