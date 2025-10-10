# 🚀 Guide de Démarrage Rapide - Protégé Lecture+

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé:
- **Node.js** version 20 ou supérieure (recommandé: v22.12.0+)
- **npm** ou **yarn**
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

## ⚡ Installation en 3 Étapes

### 1. Installation des dépendances
```bash
cd protege-lecture-plus
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```

L'application sera accessible à: **http://localhost:5173**

### 3. Création du compte administrateur
Ouvrez un nouveau terminal et exécutez:
```bash
npm run init:admin
```

Entrez les informations demandées:
- **Email**: Votre email admin (ex: admin@protegeqv.org)
- **Mot de passe**: Au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
- **Nom complet**: Votre nom

✅ Votre compte admin est créé!

---

## 🎯 Première Connexion

### Accès Public
1. Ouvrez **http://localhost:5173**
2. Explorez la page d'accueil
3. Naviguez vers le **Catalogue** pour voir les livres
4. Testez le **mode sombre** avec l'icône lune/soleil

### Accès Admin
1. Cliquez sur **"Administration"** dans le header OU
2. Accédez directement à **http://localhost:5173/login**
3. Connectez-vous avec vos identifiants
4. Explorez le **Dashboard** admin

---

## 📚 Fonctionnalités Disponibles

### Pour les Visiteurs
✅ **Page d'accueil** - Hero section, statistiques, services  
✅ **Catalogue de livres** - Recherche, filtres par catégorie/langue/statut  
✅ **Mode sombre/clair** - Toggle automatique ou manuel  
✅ **Design responsive** - Mobile, tablette, desktop  

### Pour les Administrateurs
✅ **Dashboard** - Vue d'ensemble avec statistiques  
✅ **Gestion des livres** - Consultation du catalogue  
✅ **Navigation complète** - Sidebar avec tous les modules  
✅ **Authentification sécurisée** - Firebase Auth  
✅ **Routes protégées** - Accès restreint aux admins  

---

## 🗂️ Structure du Projet

```
protege-lecture-plus/
├── public/
│   ├── images/         # Images (books, authors, events, etc.)
│   └── schema.sql      # Schéma de base de données
├── src/
│   ├── components/     # Composants React
│   │   ├── common/     # Composants réutilisables
│   │   ├── layout/     # Layouts (Header, Footer, Admin)
│   │   ├── books/      # Composants livres
│   │   └── auth/       # Composants authentification
│   ├── contexts/       # Contexts React
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services (DB, Auth, Firebase)
│   ├── styles/         # Styles globaux
│   └── utils/          # Utilitaires
├── README.md           # Documentation principale
├── PROGRESS.md         # État d'avancement
└── package.json        # Dépendances
```

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Lance le serveur de développement

# Production
npm run build            # Build de production
npm run preview          # Prévisualisation du build

# Base de données
npm run init:admin       # Crée le compte super admin

# Qualité du code
npm run lint             # Vérifie le code avec ESLint
```

---

## 💾 Base de Données

### Stockage
La base de données SQLite est stockée dans **IndexedDB** du navigateur.

### Tables Principales
- `administrateurs` - Comptes admins
- `livres` - Catalogue de livres
- `auteurs` - Auteurs
- `categories` - Catégories
- `reservations` - Réservations (à venir)
- `groupes_lecture` - Groupes (à venir)
- Et 8 autres tables...

### Sauvegarde
Les données sont automatiquement persistées. Pour une sauvegarde manuelle:
1. Connexion admin
2. Menu **Paramètres**
3. Section **Base de Données**
4. Bouton **"Sauvegarder"**

---

## 🎨 Personnalisation

### Thème
Le thème est configuré dans `tailwind.config.js`:
- Couleur principale: **Vert** (#A5D6A7 à #1B5E20)
- Mode sombre: Gris foncé (#121212)

### Logo
Remplacez les images dans `public/`:
- `logo-192.png` - Logo 192x192
- `logo-512.png` - Logo 512x512
- `favicon.ico` - Favicon

---

## 🔐 Sécurité

### Firebase
Les credentials Firebase sont configurés dans `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q
VITE_FIREBASE_PROJECT_ID=protegeqv-2532f
# ... autres variables
```

### Authentification
- Email/Password via Firebase Auth
- Tokens sécurisés
- Routes protégées
- Système de privilèges

---

## 📱 Navigation

### Pages Publiques
- `/` - Page d'accueil
- `/books` - Catalogue de livres
- `/groups` - Groupes de lecture (à venir)
- `/events` - Événements (à venir)
- `/contact` - Contact (à venir)
- `/about` - À propos (à venir)

### Pages Admin (protégées)
- `/admin/dashboard` - Tableau de bord
- `/admin/books` - Gestion des livres
- `/admin/reservations` - Réservations (à venir)
- `/admin/groups` - Groupes (à venir)
- `/admin/events` - Événements (à venir)
- `/admin/news` - Actualités (à venir)
- `/admin/messages` - Messages (à venir)
- `/admin/newsletter` - Newsletter (à venir)
- `/admin/statistics` - Statistiques (à venir)
- `/admin/settings` - Paramètres (à venir)

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur de base de données
1. Ouvrez les **DevTools** du navigateur (F12)
2. Onglet **Application** > **IndexedDB**
3. Supprimez la base **ProtegeDB**
4. Rechargez la page

### Impossible de se connecter
1. Vérifiez que vous avez créé un compte admin (`npm run init:admin`)
2. Vérifiez les credentials Firebase dans `.env`
3. Consultez la console du navigateur pour les erreurs

### Build de production échoue
```bash
# Vérifiez les erreurs de linting
npm run lint

# Build avec logs détaillés
npm run build -- --debug
```

---

## 📖 Ressources

- **Documentation complète**: `README.md`
- **État d'avancement**: `PROGRESS.md`
- **Support**: contact@protegeqv.org

---

## 🎉 Félicitations!

Vous êtes prêt à utiliser **Protégé Lecture+** !

Pour continuer le développement, consultez le fichier `PROGRESS.md` pour voir les prochaines phases à implémenter.

**Bonne lecture! 📚**

