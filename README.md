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
- **React Router DOM 6.20+** - Routing
- **Framer Motion 11.0+** - Animations fluides
- **React Query 5.0+** - Gestion d'état et cache
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **SQLite** - Base de données locale (via sql.js en WebAssembly)
- **IndexedDB** - Persistance côté navigateur
- **Firebase Authentication** - Authentification des administrateurs
- **Firebase Cloud Messaging** - Notifications push

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

3. **Configuration Firebase**
   
   Les credentials Firebase sont déjà configurés dans le projet:
   - Project ID: `protegeqv-2532f`
   - Voir `.env.example` pour la configuration complète

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible à l'adresse: `http://localhost:5173`

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build de production
npm run preview      # Prévisualisation du build

# Base de données
npm run init:db      # Initialise la base de données SQLite
npm run init:admin   # Crée le compte super administrateur

# Tests
npm run lint         # Vérifie le code avec ESLint
```

## 📂 Structure du Projet

```
protege-lecture-plus/
├── public/
│   ├── images/          # Images (books, authors, events, etc.)
│   ├── schema.sql       # Schéma SQLite
│   └── manifest.json    # PWA Manifest
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
│   │   ├── ThemeContext.jsx
│   │   └── DatabaseContext.jsx
│   ├── hooks/           # Custom Hooks
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services (DB, Auth, Firebase, etc.)
│   ├── styles/          # Styles globaux
│   ├── utils/           # Utilitaires et helpers
│   ├── App.jsx          # Composant racine
│   └── main.jsx         # Point d'entrée
├── scripts/             # Scripts d'initialisation
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
   - Configuration Firebase

2. ✅ **Phase 2: Base de Données**
   - Schéma SQLite complet
   - Service de gestion de base de données
   - Persistance IndexedDB

3. ✅ **Phase 3: Services Core**
   - Service Firebase
   - Service d'authentification
   - Service de stockage d'images
   - Service de notifications (FCM)
   - Service d'emails

4. ✅ **Phase 4: Composants Communs**
   - Button, Card, Modal, Input, Select, Textarea
   - Badge, Loader, Pagination, SearchBar
   - ConfirmDialog
   - Contexts (Auth, Theme, Database)
   - Layout (Header, Footer)

### 🚧 Phases en Cours/À Venir

5. ⏳ **Phase 5: Module d'Authentification**
   - Routes privées
   - Guards de rôles
   - Gestion des privilèges

6. ⏳ **Phase 6: Module Livres & Catalogue**
   - CRUD complet des livres
   - Filtres et recherche avancée
   - Gestion des auteurs et catégories

7. ⏳ **Phase 7: Module Réservations**
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

