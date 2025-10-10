import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DatabaseProvider } from './contexts/DatabaseContext';

// Pages
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Groups from './pages/Groups';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import InitAdmin from './pages/InitAdmin';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import BooksManagement from './pages/admin/BooksManagement';
import BookForm from './pages/admin/BookForm';
import GroupsManagement from './pages/admin/GroupsManagement';
import GroupForm from './pages/admin/GroupForm';
import ReservationsManagement from './pages/admin/ReservationsManagement';
import EventsManagement from './pages/admin/EventsManagement';
import EventForm from './pages/admin/EventForm';
import NewsManagement from './pages/admin/NewsManagement';
import NewsForm from './pages/admin/NewsForm';
import ContactManagement from './pages/admin/ContactManagement';
import NewsletterManagement from './pages/admin/NewsletterManagement';
import Statistics from './pages/admin/Statistics';
import UsersManagement from './pages/admin/UsersManagement';
import Settings from './pages/admin/Settings';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Components
import PrivateRoute from './components/auth/PrivateRoute';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DatabaseProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/init-admin" element={<InitAdmin />} />

                {/* Admin Routes - Protected */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="books" element={<BooksManagement />} />
                  <Route path="books/new" element={<BookForm />} />
                  <Route path="books/:id/edit" element={<BookForm />} />
                  <Route path="reservations" element={<ReservationsManagement />} />
                  <Route path="groups" element={<GroupsManagement />} />
                  <Route path="groups/new" element={<GroupForm />} />
                  <Route path="groups/:id/edit" element={<GroupForm />} />
                  <Route path="events" element={<EventsManagement />} />
                  <Route path="events/new" element={<EventForm />} />
                  <Route path="events/:id/edit" element={<EventForm />} />
                  <Route path="news" element={<NewsManagement />} />
                  <Route path="news/new" element={<NewsForm />} />
                  <Route path="news/:id/edit" element={<NewsForm />} />
                  <Route path="messages" element={<ContactManagement />} />
                  <Route path="newsletter" element={<NewsletterManagement />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#4CAF50',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

