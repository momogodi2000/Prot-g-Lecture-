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

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import BooksManagement from './pages/admin/BooksManagement';
import ReservationsManagement from './pages/admin/ReservationsManagement';
import GroupsManagement from './pages/admin/GroupsManagement';
import EventsManagement from './pages/admin/EventsManagement';
import NewsManagement from './pages/admin/NewsManagement';
import ContactManagement from './pages/admin/ContactManagement';
import NewsletterManagement from './pages/admin/NewsletterManagement';
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
                  <Route path="reservations" element={<ReservationsManagement />} />
                  <Route path="groups" element={<GroupsManagement />} />
                  <Route path="events" element={<EventsManagement />} />
                  <Route path="news" element={<NewsManagement />} />
                  <Route path="messages" element={<ContactManagement />} />
                  <Route path="newsletter" element={<NewsletterManagement />} />
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

