const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./src/config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database and then start server
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');

    // Routes
    const authRoutes = require('./src/routes/auth').router;
    const vehicleRoutes = require('./src/routes/vehicles');
    const tripRoutes = require('./src/routes/trips');
    const safetyRoutes = require('./src/routes/safety');
    const deviceRoutes = require('./src/routes/device');
    const auditRoutes = require('./src/routes/audit');
    const recordingsRoutes = require('./src/routes/recordings');
    const transcriptionRoutes = require('./src/routes/transcriptions');
    const settingsRoutes = require('./src/routes/settings');

    app.use('/api/auth', authRoutes);
    app.use('/api/vehicles', vehicleRoutes);
    app.use('/api/trips', tripRoutes);
    app.use('/api/safety', safetyRoutes);
    app.use('/api/device', deviceRoutes);
    app.use('/api/audit', auditRoutes);
    app.use('/api/recordings', recordingsRoutes);
    app.use('/api/transcriptions', transcriptionRoutes);
    app.use('/api/settings', settingsRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'SafeRide OS Backend'
      });
    });

    // API root endpoint
    app.get('/', (req, res) => {
      res.status(200).json({
        service: 'SafeRide OS Backend API',
        version: '1.0.0',
        status: 'online',
        endpoints: {
          auth: '/api/auth',
          vehicles: '/api/vehicles',
          trips: '/api/trips',
          safety: '/api/safety',
          device: '/api/device',
          audit: '/api/audit',
          recordings: '/api/recordings',
          transcriptions: '/api/transcriptions',
          settings: '/api/settings',
          health: '/health'
        }
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
      });
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join user room for targeted notifications
      socket.on('join-user-room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
      });

      // Join vehicle room
      socket.on('join-vehicle-room', (vehicleId) => {
        socket.join(`vehicle_${vehicleId}`);
        console.log(`Vehicle ${vehicleId} joined room vehicle_${vehicleId}`);
      });

      // Join trip room
      socket.on('join-trip-room', (tripId) => {
        socket.join(`trip_${tripId}`);
        console.log(`Trip ${tripId} joined room trip_${tripId}`);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log('Client disconnected:', socket.id, 'Reason:', reason);
      });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`SafeRide OS Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = { app, server, io };