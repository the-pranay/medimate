// Dynamic state management for real-time MediMate application
'use client';

import { realTimeUpdates } from './realTimeUpdates';

export class DynamicStateManager {
  constructor() {
    this.subscribers = new Map();
    this.state = {
      appointments: [],
      messages: [],
      notifications: [],
      user: null,
      isOnline: true,
      lastUpdate: null,
    };

    this.initializeEventListeners();
  }

  // Initialize real-time event listeners
  initializeEventListeners() {
    if (typeof window === 'undefined') return;

    // Listen for real-time updates
    window.addEventListener('appointmentsUpdated', (event) => {
      this.updateState('appointments', event.detail);
    });

    window.addEventListener('messagesUpdated', (event) => {
      this.updateState('messages', event.detail);
    });

    window.addEventListener('notificationsUpdated', (event) => {
      this.updateState('notifications', event.detail);
    });

    // Monitor network status
    window.addEventListener('online', () => {
      this.updateState('isOnline', true);
      realTimeUpdates.showNotification('success', 'Connection restored! 🌐');
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.updateState('isOnline', false);
      realTimeUpdates.showNotification('warning', 'Connection lost. Working offline... 📴');
    });

    // Auto-save state to localStorage
    setInterval(() => {
      this.saveStateToStorage();
    }, 30000); // Save every 30 seconds
  }

  // Subscribe to state changes
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  // Update state and notify subscribers
  updateState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.state.lastUpdate = new Date().toISOString();

    // Notify subscribers
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(value, oldValue);
        } catch (error) {
          console.error('Error in state subscriber:', error);
        }
      });
    }

    // Notify all subscribers
    const allSubscribers = this.subscribers.get('*');
    if (allSubscribers) {
      allSubscribers.forEach(callback => {
        try {
          callback(this.state, key);
        } catch (error) {
          console.error('Error in global state subscriber:', error);
        }
      });
    }
  }

  // Get current state
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  // Save state to localStorage
  saveStateToStorage() {
    try {
      const stateToSave = {
        ...this.state,
        timestamp: Date.now(),
      };
      localStorage.setItem('mediMateState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  // Load state from localStorage
  loadStateFromStorage() {
    try {
      const savedState = localStorage.getItem('mediMateState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const timeDiff = Date.now() - parsedState.timestamp;
        
        // Only use cached state if it's less than 5 minutes old
        if (timeDiff < 5 * 60 * 1000) {
          Object.keys(parsedState).forEach(key => {
            if (key !== 'timestamp') {
              this.state[key] = parsedState[key];
            }
          });
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
    return false;
  }

  // Sync offline changes when connection is restored
  async syncOfflineChanges() {
    const offlineChanges = this.getOfflineChanges();
    if (offlineChanges.length === 0) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/sync/offline-changes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ changes: offlineChanges }),
      });

      if (response.ok) {
        this.clearOfflineChanges();
        realTimeUpdates.showNotification('success', 'Offline changes synced successfully! ✅');
      }
    } catch (error) {
      console.error('Failed to sync offline changes:', error);
    }
  }

  // Store changes made while offline
  addOfflineChange(change) {
    const offlineChanges = this.getOfflineChanges();
    offlineChanges.push({
      ...change,
      timestamp: Date.now(),
    });
    localStorage.setItem('mediMateOfflineChanges', JSON.stringify(offlineChanges));
  }

  // Get offline changes
  getOfflineChanges() {
    try {
      const changes = localStorage.getItem('mediMateOfflineChanges');
      return changes ? JSON.parse(changes) : [];
    } catch (error) {
      return [];
    }
  }

  // Clear offline changes
  clearOfflineChanges() {
    localStorage.removeItem('mediMateOfflineChanges');
  }

  // Smart state updates with conflict resolution
  smartUpdate(key, newValue, source = 'local') {
    const currentValue = this.state[key];
    
    // Simple conflict resolution: server updates take precedence
    if (source === 'server' || !currentValue) {
      this.updateState(key, newValue);
      return;
    }

    // For local updates, check if there are conflicts
    if (Array.isArray(currentValue) && Array.isArray(newValue)) {
      // Merge arrays based on ID or timestamp
      const merged = this.mergeArrays(currentValue, newValue);
      this.updateState(key, merged);
    } else {
      this.updateState(key, newValue);
    }
  }

  // Merge arrays with conflict resolution
  mergeArrays(localArray, serverArray) {
    const merged = [...serverArray];
    
    localArray.forEach(localItem => {
      const serverItem = serverArray.find(item => 
        item.id === localItem.id || item._id === localItem._id
      );
      
      if (!serverItem) {
        // Local item doesn't exist on server, add it
        merged.push({ ...localItem, _isLocalOnly: true });
      } else if (localItem.lastModified > serverItem.lastModified) {
        // Local item is newer, replace server item
        const index = merged.findIndex(item => 
          item.id === localItem.id || item._id === localItem._id
        );
        merged[index] = { ...localItem, _hasConflict: true };
      }
    });

    return merged;
  }

  // Initialize the state manager for the app
  initialize() {
    // Load cached state
    this.loadStateFromStorage();

    // Set up user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.updateState('user', JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Start real-time updates
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      realTimeUpdates.initializeAppUpdates();
    }

    console.log('Dynamic State Manager initialized');
  }

  // Get statistics about the current state
  getStats() {
    return {
      appointmentsCount: this.state.appointments?.length || 0,
      messagesCount: this.state.messages?.length || 0,
      notificationsCount: this.state.notifications?.length || 0,
      isOnline: this.state.isOnline,
      lastUpdate: this.state.lastUpdate,
      subscribersCount: Array.from(this.subscribers.values()).reduce((total, set) => total + set.size, 0),
    };
  }

  // Clean up resources
  cleanup() {
    realTimeUpdates.stopAllUpdates();
    this.subscribers.clear();
    this.saveStateToStorage();
  }
}

// Create a singleton instance
export const stateManager = new DynamicStateManager();

// Auto-initialize when the module is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    stateManager.initialize();
  });

  window.addEventListener('beforeunload', () => {
    stateManager.cleanup();
  });
}

export default stateManager;
