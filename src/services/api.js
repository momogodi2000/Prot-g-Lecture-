import toast from 'react-hot-toast';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getToken();
  }

  // Token management
  getToken() {
    return localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add authentication token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 403 && response.headers.get('content-type')?.includes('application/json')) {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_INVALID') {
          this.setToken(null);
          // Redirect to login or trigger auth refresh
          window.location.href = '/login';
          return;
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Don't show toast for network errors during login
      if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        toast.error(error.message || 'Une erreur est survenue');
      }
      
      throw error;
    }
  }

  // HTTP methods
  get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const token = this.getToken();
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async changePassword(currentPassword, newPassword) {
    return this.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Books endpoints
  async getBooks(params = {}) {
    return this.get('/books', params);
  }

  async getBook(id) {
    return this.get(`/books/${id}`);
  }

  async createBook(bookData) {
    return this.post('/books', bookData);
  }

  // Admin Book endpoints (new Book table structure)
  async getAdminBooks(params = {}) {
    return this.get('/admin/books', params);
  }

  async createAdminBook(bookData) {
    return this.post('/admin/books', bookData);
  }

  async updateAdminBook(id, bookData) {
    return this.put(`/admin/books/${id}`, bookData);
  }

  async deleteAdminBook(id) {
    return this.delete(`/admin/books/${id}`);
  }

  async updateBook(id, bookData) {
    return this.put(`/books/${id}`, bookData);
  }

  async deleteBook(id) {
    return this.delete(`/books/${id}`);
  }

  async getAuthors() {
    return this.get('/books/authors/list');
  }

  async getCategories() {
    return this.get('/books/categories/list');
  }

  async createAuthor(authorData) {
    return this.post('/books/authors', authorData);
  }

  async createCategory(categoryData) {
    return this.post('/books/categories', categoryData);
  }

  async importExcel(excelFile) {
    const formData = new FormData();
    formData.append('file', excelFile);
    
    return this.request('/books/import-excel', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type, let browser set it with boundary for multipart/form-data
    });
  }

  // Reservations endpoints
  async getReservations(params = {}) {
    return this.get('/reservations', params);
  }

  async getReservation(id) {
    return this.get(`/reservations/${id}`);
  }

  async createReservation(reservationData) {
    return this.post('/reservations', reservationData);
  }

  async updateReservationStatus(id, status, remarque_admin = null) {
    return this.put(`/reservations/${id}/status`, {
      statut: status,
      remarque_admin,
    });
  }

  // Events endpoints
  async getEvents(params = {}) {
    return this.get('/events', params);
  }

  async getEvent(id) {
    return this.get(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.post('/events', eventData);
  }

  async updateEvent(id, eventData) {
    return this.put(`/events/${id}`, eventData);
  }

  async deleteEvent(id) {
    return this.delete(`/events/${id}`);
  }

  // Groups endpoints
  async getGroups(params = {}) {
    return this.get('/groups', params);
  }

  async getGroup(id) {
    return this.get(`/groups/${id}`);
  }

  async createGroup(groupData) {
    return this.post('/groups', groupData);
  }

  async updateGroup(id, groupData) {
    return this.put(`/groups/${id}`, groupData);
  }

  async deleteGroup(id) {
    return this.delete(`/groups/${id}`);
  }

  async joinGroup(id, memberData) {
    return this.post(`/groups/${id}/members`, memberData);
  }

  async getGroupMembers(groupId) {
    return this.get(`/groups/${groupId}/members`);
  }

  async addGroupMember(groupId, memberData) {
    return this.post(`/groups/${groupId}/members`, memberData);
  }

  async removeGroupMember(groupId, memberId) {
    return this.delete(`/groups/${groupId}/members/${memberId}`);
  }

  // Contact endpoints
  async getContactMessages(params = {}) {
    return this.get('/contacts', params);
  }

  async getContactMessage(id) {
    return this.get(`/contacts/${id}`);
  }

  async sendContactMessage(messageData) {
    return this.post('/contacts', messageData);
  }

  async submitContactMessage(messageData) {
    return this.post('/contacts', messageData);
  }

  async replyContactMessage(id, reponse) {
    return this.post(`/contacts/${id}/reply`, { reponse });
  }

  async archiveContactMessage(id) {
    return this.put(`/contacts/${id}/archive`);
  }

  async updateContactMessageStatus(id, status, reponse = null) {
    return this.put(`/contacts/${id}/status`, {
      statut: status,
      reponse,
    });
  }

  async subscribeNewsletter(email, nomComplet = null) {
    return this.post('/contacts/newsletter', {
      email,
      nom_complet: nomComplet,
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.get('/admin/stats');
  }

  async getActivityLog(params = {}) {
    return this.get('/admin/activity-log', params);
  }

  async getAdminUsers(params = {}) {
    return this.get('/admin/users', params);
  }

  async updateUserStatus(id, status) {
    return this.put(`/admin/users/${id}/status`, { statut: status });
  }

  async getSystemSettings() {
    return this.get('/admin/settings');
  }

  async updateSystemSettings(settings) {
    return this.put('/admin/settings', { settings });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export default new ApiService();
