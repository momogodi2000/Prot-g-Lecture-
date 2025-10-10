# API Documentation

## Overview

This document describes the API structure and data flow in Protégé Lecture+. Since the application uses a client-side SQL.js database, all "API" calls are local database operations.

## Database Service API

Location: `src/services/database.js`

### Initialization

#### `initDatabase()`
Initialize the SQL.js database with schema.

```javascript
import { initDatabase } from '@/services/database';

const db = await initDatabase();
```

**Returns**: Promise<Database>

---

## Books API

### `getAllBooks(filters)`
Fetch all books with optional filtering.

**Parameters:**
```javascript
{
  search: string,          // Search in title, author, or ISBN
  categorie_id: number,    // Filter by category
  langue: string,          // Filter by language (FR, EN, etc.)
  disponible: boolean,     // Only available books
  sortBy: string,          // Sort field (titre, annee_publication)
  sortOrder: string,       // asc or desc
}
```

**Returns:**
```javascript
[
  {
    id: number,
    titre: string,
    auteur_nom: string,
    auteur_id: number,
    categorie_nom: string,
    categorie_id: number,
    resume: string,
    annee_publication: number,
    langue: string,
    isbn: string,
    image_url: string,
    disponible: boolean,
    nombre_exemplaires: number,
    nombre_pages: number,
    editeur: string,
    tags: string,
    cote: string,
  }
]
```

### `getBookById(id)`
Get a single book by ID.

**Parameters:**
- `id` (number): Book ID

**Returns**: Book object or null

### `createBook(bookData)`
Add a new book to the catalog.

**Parameters:**
```javascript
{
  titre: string,           // Required
  auteur_id: number,       // Required
  categorie_id: number,    // Required
  resume: string,          // Required, min 10 chars
  annee_publication: number,
  langue: string,          // FR, EN, ES, DE, AUTRE
  nombre_exemplaires: number,
  isbn: string,            // Optional
  editeur: string,         // Optional
  nombre_pages: number,    // Optional
  tags: string,            // Optional, comma-separated
  cote: string,            // Optional
  image_url: string,       // Optional
}
```

**Returns**: { id: number } - Created book ID

### `updateBook(id, bookData)`
Update an existing book.

**Parameters:**
- `id` (number): Book ID
- `bookData` (object): Fields to update

**Returns**: { changes: number }

### `deleteBook(id)`
Delete a book from the catalog.

**Parameters:**
- `id` (number): Book ID

**Returns**: { changes: number }

---

## Reservations API

### `getAllReservations(filters)`
Fetch all reservations with optional filtering.

**Parameters:**
```javascript
{
  statut: string,          // en_attente, confirmee, annulee, terminee
  date_souhaitee: string,  // Filter by date (YYYY-MM-DD)
  creneau: string,         // matin, apres_midi
  email: string,           // Filter by visitor email
}
```

**Returns:**
```javascript
[
  {
    id: number,
    nom_visiteur: string,
    email_visiteur: string,
    telephone_visiteur: string,
    date_souhaitee: string,    // YYYY-MM-DD
    creneau: string,            // matin, apres_midi
    statut: string,             // en_attente, confirmee, annulee, terminee
    commentaire: string,
    date_creation: string,      // ISO timestamp
    date_modification: string,  // ISO timestamp
  }
]
```

### `getReservationById(id)`
Get a single reservation by ID.

**Parameters:**
- `id` (number): Reservation ID

**Returns**: Reservation object or null

### `createReservation(reservationData)`
Create a new reservation.

**Parameters:**
```javascript
{
  nom_visiteur: string,        // Required, 2-100 chars
  email_visiteur: string,      // Required, valid email
  telephone_visiteur: string,  // Required, Cameroon format
  date_souhaitee: string,      // Required, YYYY-MM-DD, future date
  creneau: string,             // Required, matin or apres_midi
  commentaire: string,         // Optional, max 500 chars
}
```

**Returns**: { id: number } - Created reservation ID

### `updateReservationStatus(id, statut)`
Update reservation status.

**Parameters:**
- `id` (number): Reservation ID
- `statut` (string): New status (confirmee, annulee, terminee)

**Returns**: { changes: number }

### `deleteReservation(id)`
Delete a reservation.

**Parameters:**
- `id` (number): Reservation ID

**Returns**: { changes: number }

---

## Events API

### `getAllEvents(filters)`
Fetch all events.

**Parameters:**
```javascript
{
  type_evenement: string,  // en_ligne, sur_place
  statut: string,          // a_venir, en_cours, termine, annule
  upcoming: boolean,       // Only future events
}
```

**Returns:**
```javascript
[
  {
    id: number,
    titre: string,
    description: string,
    date_debut: string,      // ISO timestamp
    date_fin: string,        // ISO timestamp
    lieu: string,
    type_evenement: string,  // en_ligne, sur_place
    capacite_max: number,
    nombre_inscrits: number,
    image_url: string,
    lien_externe: string,
    statut: string,          // a_venir, en_cours, termine, annule
  }
]
```

### `getEventById(id)`
Get event details.

**Parameters:**
- `id` (number): Event ID

**Returns**: Event object or null

### `createEvent(eventData)`
Create a new event.

**Parameters:**
```javascript
{
  titre: string,             // Required
  description: string,       // Required
  date_debut: string,        // Required, ISO timestamp
  date_fin: string,          // Optional, ISO timestamp
  lieu: string,              // Required if sur_place
  type_evenement: string,    // en_ligne or sur_place
  capacite_max: number,      // Optional
  image_url: string,         // Optional
  lien_externe: string,      // Optional
}
```

**Returns**: { id: number }

### `registerForEvent(eventId, userData)`
Register a user for an event.

**Parameters:**
```javascript
{
  eventId: number,
  nom_complet: string,
  email: string,
  telephone: string,
}
```

**Returns**: { id: number } - Registration ID

---

## Groups API

### `getAllGroups()`
Fetch all reading groups.

**Returns:**
```javascript
[
  {
    id: number,
    nom: string,
    description: string,
    type_groupe: string,     // lecture, discussion, club
    niveau: string,          // debutant, intermediaire, avance
    jour_reunion: string,    // lundi, mardi, etc.
    heure_reunion: string,   // HH:MM
    capacite_max: number,
    nombre_membres: number,
    animateur: string,
    statut: string,          // actif, inactif, complet
    image_url: string,
  }
]
```

### `getGroupById(id)`
Get group details.

**Parameters:**
- `id` (number): Group ID

**Returns**: Group object or null

### `joinGroup(groupId, userData)`
Join a reading group.

**Parameters:**
```javascript
{
  groupId: number,
  nom_complet: string,
  email: string,
  telephone: string,
  motivation: string,  // Optional
}
```

**Returns**: { id: number } - Membership ID

---

## Contact API

### `submitContactMessage(messageData)`
Submit a contact form message.

**Parameters:**
```javascript
{
  nom_complet: string,     // Required, 2-100 chars
  email: string,           // Required, valid email
  telephone: string,       // Optional
  sujet: string,           // Required, 1-200 chars
  message: string,         // Required, 20-2000 chars
}
```

**Returns**: { id: number } - Message ID

### `getAllMessages()`
Get all contact messages (admin only).

**Returns**: Array of message objects

---

## Newsletter API

### `subscribeToNewsletter(subscriptionData)`
Subscribe to newsletter.

**Parameters:**
```javascript
{
  email: string,         // Required, valid email
  nom_complet: string,   // Optional
}
```

**Returns**: { id: number } - Subscription ID

### `unsubscribeFromNewsletter(email)`
Unsubscribe from newsletter.

**Parameters:**
- `email` (string): Subscriber email

**Returns**: { changes: number }

---

## Analytics API

Location: `src/utils/analytics.js`

### `trackPageView(path, title)`
Track page view.

```javascript
import { trackPageView } from '@/utils/analytics';

trackPageView('/books', 'Books Catalog');
```

### `trackEvent(eventName, params)`
Track custom event.

```javascript
trackEvent('book_search', {
  search_term: 'Harry Potter',
  results_count: 5,
});
```

### `trackBookView(book)`
Track book detail view.

```javascript
trackBookView({
  id: 123,
  titre: 'Les Misérables',
  categorie_nom: 'Classique',
  auteur_nom: 'Victor Hugo',
});
```

### `trackReservation(reservation)`
Track successful reservation.

```javascript
trackReservation({
  id: 456,
  date_souhaitee: '2024-12-25',
  creneau: 'matin',
});
```

---

## Custom Hooks API

### `useBooks()`
Hook for managing books.

**Returns:**
```javascript
{
  books: Array,
  isLoading: boolean,
  error: Error | null,
  refetch: () => void,
  createBook: (data) => Promise,
  updateBook: (id, data) => Promise,
  deleteBook: (id) => Promise,
}
```

**Usage:**
```javascript
const { books, isLoading, createBook } = useBooks();

// Create a book
await createBook({
  titre: 'New Book',
  auteur_id: 1,
  categorie_id: 2,
  resume: 'Book description...',
  // ...
});
```

### `useReservations()`
Hook for managing reservations.

**Returns:**
```javascript
{
  reservations: Array,
  isLoading: boolean,
  error: Error | null,
  createReservation: (data) => Promise,
  updateStatus: (id, status) => Promise,
  deleteReservation: (id) => Promise,
}
```

### `useEvents()`
Hook for managing events.

**Returns:**
```javascript
{
  events: Array,
  isLoading: boolean,
  error: Error | null,
  createEvent: (data) => Promise,
  registerForEvent: (eventId, userData) => Promise,
}
```

### `useGroups()`
Hook for managing reading groups.

**Returns:**
```javascript
{
  groups: Array,
  isLoading: boolean,
  error: Error | null,
  joinGroup: (groupId, userData) => Promise,
}
```

---

## Error Handling

All API functions return Promises and can throw errors:

```javascript
try {
  const book = await createBook(bookData);
  toast.success('Book created successfully!');
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    toast.error(error.message);
  } else if (error.code === 'DATABASE_ERROR') {
    toast.error('Database error. Please try again.');
  } else {
    toast.error('An unexpected error occurred.');
  }
  console.error('Error creating book:', error);
}
```

## Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `DATABASE_ERROR`: Database operation failed
- `NOT_FOUND`: Resource not found
- `DUPLICATE`: Duplicate entry
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions

---

## Rate Limiting

Client-side rate limiting is implemented for:

- **Reservations**: 5 per hour per user
- **Contact form**: 5 per hour
- **Newsletter signup**: 1 per day per email
- **Event registration**: 10 per hour

Exceeded limits return:
```javascript
{
  error: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests. Please try again later.',
  retryAfter: 3600, // seconds
}
```

---

## Pagination

For large datasets, use pagination:

```javascript
const { books, totalCount, hasMore } = await getBooks({
  page: 1,
  limit: 20,
  sortBy: 'titre',
  sortOrder: 'asc',
});
```

---

## Data Export

Export data in various formats:

```javascript
import { exportToCSV, exportToPDF } from '@/utils/export';

// Export books to CSV
exportToCSV(books, 'books.csv');

// Export reservations to PDF
exportToPDF(reservations, 'reservations.pdf');
```

---

## Real-time Updates

Using React Query for automatic cache invalidation:

```javascript
const queryClient = useQueryClient();

// Invalidate after mutation
await createBook(bookData);
queryClient.invalidateQueries(['books']);
```

---

## Testing API

See `src/test/` for comprehensive test examples.

Run tests:
```bash
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

---

## Migration to Backend API

If migrating to a backend API in the future, update:

1. `src/services/database.js` → `src/services/api.js`
2. Replace SQL queries with HTTP requests
3. Update hooks to use new API service
4. Add authentication headers
5. Implement server-side validation

Example:
```javascript
// Before (SQL.js)
const books = db.exec("SELECT * FROM books");

// After (Backend API)
const books = await fetch('/api/books').then(r => r.json());
```
