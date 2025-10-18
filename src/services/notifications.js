class NotificationService {
  constructor() {
    this.token = null;
    this.messageHandlers = [];
    this.isListening = false;
  }

  // Request notification permission
  async requestPermission() {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        await this.getToken();
        return true;
      } else {
        console.log('⚠️ Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get notification token - simplified for web notifications
  async getToken() {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.log('Notifications not supported or not granted');
        return null;
      }

      // For web notifications, we don't need FCM token
      // We can use a simple identifier for the browser
      const token = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.token = token;
      
      console.log('Notification token obtained:', token);
      await this.saveTokenForAdmin(token);
      return token;
    } catch (error) {
      console.error('Error getting notification token:', error);
      return null;
    }
  }

  // Listen for messages - simplified for web notifications
  listenForMessages(callback) {
    if (!this.isListening) {
      // Set up polling or WebSocket connection for real-time notifications
      // For now, we'll use a simple polling mechanism
      this.startPolling(callback);
      this.isListening = true;
    }

    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== callback);
    };
  }

  // Start polling for messages (placeholder for real WebSocket implementation)
  startPolling(callback) {
    // This would typically use WebSockets or Server-Sent Events
    // For now, just register the callback
    if (callback) {
      this.messageHandlers.push(callback);
    }
  }

  // Register message handler
  onMessage(handler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Show local notification
  showNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title || 'Protégé Lecture+', {
        body: notification.body,
        icon: '/logo-192.png',
        badge: '/logo-96.png',
        tag: 'protege-notification',
        requireInteraction: false,
        silent: false
      });
    }
  }

  // Show custom notification with options
  async showCustomNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/logo-192.png',
        badge: '/logo-96.png',
        ...options
      });
    }
  }

  // Save token for admin
  async saveTokenForAdmin(token) {
    try {
      localStorage.setItem('notification_token', token);
    } catch (error) {
      console.error('Error saving notification token:', error);
    }
  }

  // Get saved token
  getSavedToken() {
    return localStorage.getItem('notification_token');
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('notification_token');
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window;
  }

  // Get permission status
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }
}

export default new NotificationService();

