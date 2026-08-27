const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, '../../safaride.db'));

function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user', -- user, driver, admin
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Vehicles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      license_plate TEXT UNIQUE NOT NULL,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Trips table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      driver_id INTEGER NOT NULL,
      passenger_id INTEGER,
      start_location TEXT NOT NULL,
      end_location TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      status TEXT DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
      fare REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Safety_Alerts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS safety_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- emergency, unsafe_driving, vehicle_issue, medical, etc.
      severity TEXT NOT NULL, -- low, medium, high, critical
      description TEXT,
      location TEXT,
      status TEXT DEFAULT 'active', -- active, acknowledged, resolved
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Audio_Recordings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audio_recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      duration INTEGER, -- in seconds
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Transcriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transcriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recording_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      confidence REAL, -- 0.0 to 1.0
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recording_id) REFERENCES audio_recordings(id) ON DELETE CASCADE
    )
  `);

  // Device_Commands table
  db.exec(`
    CREATE TABLE IF NOT EXISTS device_commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      command_type TEXT NOT NULL, -- lockdown, location_request, audio_start, audio_stop, etc.
      parameters TEXT, -- JSON string
      status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Device_Responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS device_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command_id INTEGER NOT NULL,
      response_data TEXT, -- JSON string
      status TEXT DEFAULT 'success', -- success, failure, timeout
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (command_id) REFERENCES device_commands(id) ON DELETE CASCADE
    )
  `);

  // Audit_Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id INTEGER,
      changes TEXT, -- JSON string of changes
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
    CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
    CREATE INDEX IF NOT EXISTS idx_trips_passenger_id ON trips(passenger_id);
    CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
    CREATE INDEX IF NOT EXISTS idx_safety_alerts_trip_id ON safety_alerts(trip_id);
    CREATE INDEX IF NOT EXISTS idx_safety_alerts_user_id ON safety_alerts(user_id);
    CREATE INDEX IF NOT EXISTS idx_safety_alerts_type ON safety_alerts(type);
    CREATE INDEX IF NOT EXISTS idx_safety_alerts_severity ON safety_alerts(severity);
    CREATE INDEX IF NOT EXISTS idx_audio_recordings_trip_id ON audio_recordings(trip_id);
    CREATE INDEX IF NOT EXISTS idx_audio_recordings_user_id ON audio_recordings(user_id);
    CREATE INDEX IF NOT EXISTS idx_transcriptions_recording_id ON transcriptions(recording_id);
    CREATE INDEX IF NOT EXISTS idx_device_commands_device_id ON device_commands(device_id);
    CREATE INDEX IF NOT EXISTS idx_device_commands_status ON device_commands(status);
    CREATE INDEX IF NOT EXISTS idx_device_responses_command_id ON device_responses(command_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };
