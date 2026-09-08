const BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('safaride_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('safaride_token', token);
    } else {
      localStorage.removeItem('safaride_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  // Authentication
  login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Vehicles & Cabs
  getVehicles() {
    return this.request('/api/vehicles');
  }

  updateVehicle(id, data) {
    return this.request(`/api/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Trips
  getTrips() {
    return this.request('/api/trips');
  }

  // Safety & Alerts
  getAlerts() {
    return this.request('/api/safety');
  }

  createAlert(data) {
    return this.request('/api/safety', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateAlertStatus(id, status) {
    return this.request(`/api/safety/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Recordings
  getRecordings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/recordings${query ? `?${query}` : ''}`);
  }

  exportRecording(id, user = 'Operator') {
    return this.request(`/api/recordings/${id}/export?user=${encodeURIComponent(user)}`);
  }

  deleteRecording(id, user = 'Super Admin') {
    return this.request(`/api/recordings/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ user })
    });
  }

  // Transcriptions & AI
  getTranscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/transcriptions${query ? `?${query}` : ''}`);
  }

  // Audit Logs
  getAuditLogs() {
    return this.request('/api/audit');
  }

  // Settings
  getSettings() {
    return this.request('/api/settings');
  }

  updateSettings(data) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Device Commands
  sendCommand(deviceId, commandType, parameters = {}) {
    return this.request('/api/device/commands', {
      method: 'POST',
      body: JSON.stringify({
        device_id: deviceId,
        command_type: commandType,
        parameters
      })
    });
  }
}

export const api = new ApiService();
