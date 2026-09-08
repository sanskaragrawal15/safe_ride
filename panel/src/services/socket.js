import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.notify('connection_change', true);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      this.notify('connection_change', false);
    });

    // Wire safety alert broadcasts
    this.socket.on('safety:alert', (alert) => {
      this.notify('safety:alert', alert);
    });

    this.socket.on('safety:alert_updated', (alert) => {
      this.notify('safety:alert_updated', alert);
    });

    // Wire vehicle telematics
    this.socket.on('vehicle:updated', (vehicle) => {
      this.notify('vehicle:updated', vehicle);
    });

    // Wire audit events
    this.socket.on('audit:event', (audit) => {
      this.notify('audit:event', audit);
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  notify(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

export const socketService = new SocketService();
