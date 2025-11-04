// Firebase configuration and utilities for push notifications
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { fcmApi } from '../api/services';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class FirebaseService {
  private app: any = null;
  private messaging: Messaging | null = null;
  private isInitialized = false;

  // Initialize Firebase
  initialize(config: FirebaseConfig): void {
    try {
      if (this.isInitialized) {
        console.log('Firebase already initialized');
        return;
      }

      this.app = initializeApp(config);
      this.messaging = getMessaging(this.app);
      this.isInitialized = true;

      // Register service worker for background messaging
      this.registerServiceWorker();

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  // Register Firebase messaging service worker
  private registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('[Firebase] Service Worker registered successfully:', registration.scope);

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Firebase] New service worker available, will be used when all tabs are closed');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Firebase] Service Worker registration failed:', error);
        });
    }
  }

  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    try {
      if (!this.messaging) {
        throw new Error('Firebase messaging not initialized');
      }

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get FCM token
  async getFcmToken(vapidKey: string): Promise<string | null> {
    try {
      if (!this.messaging) {
        throw new Error('Firebase messaging not initialized');
      }

      const token = await getToken(this.messaging, {
        vapidKey: vapidKey,
      });

      if (token) {
        console.log('FCM token obtained:', token.substring(0, 20) + '...');
        return token;
      } else {
        console.log('No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Store FCM token in backend
  async storeToken(token: string): Promise<void> {
    try {
      await fcmApi.storeToken(token);
      console.log('FCM token stored in backend');
    } catch (error) {
      console.error('Failed to store FCM token:', error);
      throw error;
    }
  }

  // Remove FCM token from backend
  async removeToken(token: string): Promise<void> {
    try {
      await fcmApi.removeToken(token);
      console.log('FCM token removed from backend');
    } catch (error) {
      console.error('Failed to remove FCM token:', error);
      throw error;
    }
  }

  // Remove all FCM tokens from backend (logout from all devices)
  async removeAllTokens(): Promise<void> {
    try {
      await fcmApi.removeAllTokens();
      console.log('All FCM tokens removed from backend');
    } catch (error) {
      console.error('Failed to remove all FCM tokens:', error);
      throw error;
    }
  }

  // Listen for incoming messages (foreground)
  onMessageReceived(callback: (payload: any) => void): void {
    if (!this.messaging) {
      console.error('Firebase messaging not initialized');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  }

  // Handle background messages (service worker)
  handleBackgroundMessage(): void {
    // This would be handled in the service worker
    // For now, we'll handle it in the main app
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  // Get current notification permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

// Singleton instance
export const firebaseService = new FirebaseService();

// Helper functions
export const initializeFirebase = (config: FirebaseConfig) => {
  firebaseService.initialize(config);
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  return firebaseService.requestPermission();
};

export const getFcmToken = async (vapidKey: string): Promise<string | null> => {
  return firebaseService.getFcmToken(vapidKey);
};

export const storeFcmToken = async (token: string): Promise<void> => {
  return firebaseService.storeToken(token);
};

export const removeFcmToken = async (token: string): Promise<void> => {
  return firebaseService.removeToken(token);
};

export const removeAllFcmTokens = async (): Promise<void> => {
  return firebaseService.removeAllTokens();
};

export const onMessageReceived = (callback: (payload: any) => void) => {
  firebaseService.onMessageReceived(callback);
};

export const isFirebaseSupported = (): boolean => {
  return firebaseService.isSupported();
};

export const getNotificationPermission = (): NotificationPermission => {
  return firebaseService.getPermissionStatus();
};

// Default Firebase config (to be overridden with actual values)
export const defaultFirebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// VAPID key for FCM
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
