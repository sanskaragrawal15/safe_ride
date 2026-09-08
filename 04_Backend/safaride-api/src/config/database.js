const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../safaride.db'));

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Vehicles table
      db.run(`
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
      `, (err) => {
        if (err) reject(err);
      });

      // Trips table
      db.run(`
        CREATE TABLE IF NOT EXISTS trips (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          vehicle_id INTEGER NOT NULL,
          driver_id INTEGER NOT NULL,
          passenger_id INTEGER,
          start_location TEXT NOT NULL,
          end_location TEXT,
          start_time DATETIME NOT NULL,
          end_time DATETIME,
          status TEXT DEFAULT 'scheduled',
          fare REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
          FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Safety_Alerts table
      db.run(`
        CREATE TABLE IF NOT EXISTS safety_alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trip_id INTEGER,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          severity TEXT NOT NULL,
          description TEXT,
          location TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Audio_Recordings table
      db.run(`
        CREATE TABLE IF NOT EXISTS audio_recordings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trip_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          file_path TEXT NOT NULL,
          duration INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Transcriptions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transcriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recording_id INTEGER NOT NULL,
          text TEXT NOT NULL,
          language TEXT DEFAULT 'en',
          confidence REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (recording_id) REFERENCES audio_recordings(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Device_Commands table
      db.run(`
        CREATE TABLE IF NOT EXISTS device_commands (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id TEXT NOT NULL,
          command_type TEXT NOT NULL,
          parameters TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Device_Responses table
      db.run(`
        CREATE TABLE IF NOT EXISTS device_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          command_id INTEGER NOT NULL,
          response_data TEXT,
          status TEXT DEFAULT 'success',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (command_id) REFERENCES device_commands(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Audit_Logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          resource_id INTEGER,
          changes TEXT,
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create indexes for better performance
      db.run("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
      db.run("CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_trips_passenger_id ON trips(passenger_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status)");
      db.run("CREATE INDEX IF NOT EXISTS idx_safety_alerts_trip_id ON safety_alerts(trip_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_safety_alerts_user_id ON safety_alerts(user_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_safety_alerts_type ON safety_alerts(type)");
      db.run("CREATE INDEX IF NOT EXISTS idx_safety_alerts_severity ON safety_alerts(severity)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audio_recordings_trip_id ON audio_recordings(trip_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audio_recordings_user_id ON audio_recordings(user_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_transcriptions_recording_id ON transcriptions(recording_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_device_commands_device_id ON device_commands(device_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_device_commands_status ON device_commands(status)");
      db.run("CREATE INDEX IF NOT EXISTS idx_device_responses_command_id ON device_responses(command_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id)");
      db.run("CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)");

      console.log('Database initialized successfully');
      resolve();
    });
  });
}

module.exports = { db, initializeDatabase };