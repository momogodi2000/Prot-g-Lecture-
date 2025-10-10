import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

class NotificationService {
  constructor() {
    this.token = null;
    this.messageHandlers = [];
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

  // Get FCM token
  async getToken() {
    if (!messaging) {
      console.log('Messaging not supported in this browser');
      return null;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });

      if (token) {
        this.token = token;
        console.log('FCM Token obtained:', token);
        await this.saveTokenForAdmin(token);
        return token;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Listen for foreground messages
  listenForMessages(callback) {
    if (!messaging) {
      console.log('Messaging not supported');
      return () => {};
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      if (callback) {
        callback(payload);
      } else {
        this.showNotification(payload.notification);
      }
      
      // Call all registered handlers
      this.messageHandlers.forEach(handler => handler(payload));
    });

    return unsubscribe;
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
      localStorage.setItem('fcm_token', token);
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  // Get saved token
  getSavedToken() {
    return localStorage.getItem('fcm_token');
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('fcm_token');
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window && !!messaging;
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

