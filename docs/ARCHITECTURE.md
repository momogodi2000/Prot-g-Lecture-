# Architecture Documentation

## System Overview

Protégé Lecture+ is built as a modern Single Page Application (SPA) with a client-side database architecture using Firebase services for authentication, analytics, and real-time features.

## Technology Stack

### Frontend Layer
```
├── React 18.3+ (UI Library)
├── Vite 7 (Build Tool & Dev Server)
├── React Router 7 (Client-side Routing)
└── Tailwind CSS v4 (Styling)
```

### State Management
```
├── React Query (TanStack Query) - Server state
├── React Context API - Global app state
└── React Hook Form - Form state
```

### Data Layer
```
├── SQL.js (Client-side SQLite database)
├── Firebase Auth (User authentication)
├── Firebase Analytics (User behavior tracking)
├── Firebase Performance (Performance monitoring)
└── Firebase Remote Config (Feature flags)
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Application                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │  Pages   │  │Components│  │ Contexts │           │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘           │  │
│  │       │             │              │                  │  │
│  │  ┌────┴─────────────┴──────────────┴─────┐           │  │
│  │  │          React Query Layer            │           │  │
│  │  └────────────────┬──────────────────────┘           │  │
│  │                   │                                   │  │
│  │  ┌────────────────┴──────────────────────┐           │  │
│  │  │          Service Layer                │           │  │
│  │  │  ┌──────────┐  ┌────────────┐        │           │  │
│  │  │  │ Database │  │  Firebase  │        │           │  │
│  │  │  │ (SQL.js) │  │  Services  │        │           │  │
│  │  │  └──────────┘  └────────────┘        │           │  │
│  │  └───────────────────────────────────────┘           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Application Layers

### 1. Presentation Layer (React Components)

**Location**: `src/components/`, `src/pages/`

- **Dumb Components**: Pure UI components without business logic
- **Smart Components**: Connected to state management and services
- **Layout Components**: Headers, footers, navigation
- **Page Components**: Full page views with routing

**Key Principles**:
- Single Responsibility Principle
- Composition over inheritance
- Props drilling avoided with Context API
- Memoization for performance optimization

### 2. Business Logic Layer

**Location**: `src/hooks/`, `src/utils/`

- **Custom Hooks**: Reusable stateful logic
  - `useBooks.js` - Book catalog management
  - `useReservations.js` - Reservation handling
  - `useAuth.js` - Authentication logic
  - `useEvents.js` - Event management
  - `useGroups.js` - Reading group management

- **Utilities**: Pure functions for data transformation
  - `validators.js` - Input validation with Zod
  - `formatters.js` - Data formatting
  - `security.js` - Security utilities
  - `analytics.js` - Analytics tracking

### 3. State Management Layer

**Location**: `src/contexts/`

#### Global State (Context API)
```javascript
├── AuthContext      // User authentication state
├── ThemeContext     // Dark/light mode
└── DatabaseContext  // SQL.js database instance
```

#### Server State (React Query)
```javascript
├── useQuery()    // Data fetching
├── useMutation() // Data mutations
└── Cache         // Automatic caching & invalidation
```

### 4. Data Access Layer

**Location**: `src/services/`

#### Database Service (`database.js`)
```javascript
- initDatabase()      // Initialize SQL.js
- executeQuery()      // Run SQL queries
- getBooks()         // Fetch books
- createReservation() // Create reservation
- ...
```

#### Firebase Services (`firebase.js`)
```javascript
- auth              // Authentication
- analytics         // Analytics tracking
- performance       // Performance monitoring
- remoteConfig      // Feature flags
- messaging         // Push notifications
```

## Data Flow

### Read Operations
```
User Action → Component → Custom Hook → React Query → Service → Database → Response
```

### Write Operations
```
User Action → Component → Custom Hook → React Query Mutation → Service → Database → Cache Invalidation → UI Update
```

### Authentication Flow
```
Login → Firebase Auth → Set User Context → Persist Session → Redirect
```

## Security Architecture

### Client-Side Security

1. **Input Validation**
   - Zod schemas for all forms
   - DOMPurify for HTML sanitization
   - SQL injection prevention

2. **XSS Protection**
   - Content Security Policy (CSP)
   - HTML escaping
   - Safe URL validation

3. **Authentication**
   - Firebase Auth tokens
   - Session management
   - Role-based access control (RBAC)

4. **CSRF Protection**
   - Token generation and validation
   - SameSite cookie attributes

### Network Security

1. **HTTPS Only**
   - Enforced in production
   - HSTS headers

2. **Security Headers**
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin

## Performance Optimization

### Build-Time Optimizations

1. **Code Splitting**
   ```javascript
   // Automatic route-based splitting
   const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
   
   // Manual vendor chunking
   manualChunks: {
     'react-vendor': ['react', 'react-dom'],
     'firebase': ['firebase/app', 'firebase/auth'],
   }
   ```

2. **Tree Shaking**
   - ES modules for dead code elimination
   - Selective imports

3. **Minification**
   - Terser for JS
   - CSS purging with Tailwind

### Runtime Optimizations

1. **Memoization**
   ```javascript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
   ```

2. **Lazy Loading**
   ```javascript
   <img loading="lazy" src="..." alt="..." />
   ```

3. **Virtual Scrolling**
   - For long lists of books/events

4. **Debouncing/Throttling**
   - Search inputs
   - Scroll events

### Caching Strategies

1. **React Query Cache**
   - 5-minute stale time
   - Background refetching
   - Optimistic updates

2. **Service Worker Cache**
   - Static assets
   - Offline support
   - Cache-first strategy

## Database Schema

### Tables

#### books
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  titre TEXT NOT NULL,
  auteur_id INTEGER,
  categorie_id INTEGER,
  resume TEXT,
  annee_publication INTEGER,
  isbn TEXT,
  image_url TEXT,
  disponible BOOLEAN DEFAULT 1,
  nombre_exemplaires INTEGER DEFAULT 1,
  FOREIGN KEY (auteur_id) REFERENCES auteurs(id),
  FOREIGN KEY (categorie_id) REFERENCES categories(id)
);
```

#### reservations
```sql
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY,
  nom_visiteur TEXT NOT NULL,
  email_visiteur TEXT NOT NULL,
  telephone_visiteur TEXT,
  date_souhaitee DATE NOT NULL,
  creneau TEXT CHECK(creneau IN ('matin', 'apres_midi')),
  statut TEXT DEFAULT 'en_attente',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

See `public/schema.sql` for complete schema.

## Deployment Architecture

### Build Pipeline
```
GitHub Push → GitHub Actions → Build & Test → Deploy to Netlify
```

### Netlify Configuration
- Auto-deploys from `main` branch
- Branch previews for PRs
- Environment variables injected at build time
- CDN distribution globally

### Monitoring
- Firebase Analytics for user behavior
- Firebase Performance for app performance
- Firebase Crashlytics for error tracking
- Lighthouse CI for performance metrics

## Scalability Considerations

### Current Architecture (Client-Side DB)
- ✅ Fast initial load
- ✅ No backend costs
- ✅ Offline capable
- ⚠️ Limited to ~50MB data
- ⚠️ Not suitable for real-time collaboration

### Future Migration Path (if needed)
```
Client-Side SQL.js → Firebase Firestore → Backend API + PostgreSQL
```

## Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   npm run dev
   # Make changes
   npm test
   git commit -m "feat: add new feature"
   ```

2. **Code Review**
   - Create Pull Request
   - Automated CI checks run
   - Code review by team
   - Merge to main

3. **Deployment**
   - Automatic deployment on merge
   - Preview builds for PRs
   - Rollback capability

## Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use composition
   - Avoid prop drilling with Context
   - Memoize expensive computations

2. **State Management**
   - Use React Query for server state
   - Use Context for global UI state
   - Keep state as local as possible

3. **Performance**
   - Lazy load routes and heavy components
   - Optimize images (WebP, lazy loading)
   - Code split vendor bundles
   - Monitor bundle size

4. **Security**
   - Validate all inputs
   - Sanitize user-generated content
   - Use HTTPS everywhere
   - Implement CSP headers

5. **Testing**
   - Write unit tests for utilities
   - Integration tests for critical flows
   - E2E tests for user journeys

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (22.12+)
   - Clear `node_modules` and reinstall
   - Check environment variables

2. **Performance Issues**
   - Use React DevTools Profiler
   - Check bundle size with analyzer
   - Optimize images

3. **Database Issues**
   - Re-initialize database: `npm run init:db`
   - Check browser storage limits
   - Clear browser cache

## Further Reading

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
