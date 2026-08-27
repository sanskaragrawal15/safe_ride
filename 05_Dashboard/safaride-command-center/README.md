# SafeRide OS Command Center Dashboard

This is the React-based dashboard for monitoring and managing the SafeRide OS system.

## Features

- Real-time vehicle tracking map
- Live safety alert monitoring
- Audio recording management and playback
- Transcription viewing and search
- Device management and remote commands
- Audit log viewing and filtering
- User and vehicle management
- Analytics and reporting
- Emergency response coordination

## Technology Stack

- React 18+
- Redux Toolkit for state management
- React Router for navigation
- Material-UI (MUI) for components
- Socket.IO client for real-time communication
- Leaflet or Mapbox GL JS for maps
- Chart.js or Recharts for data visualization
- Formik/Yup for form handling
- Axios for HTTP requests
- JWT for authentication
- Moment.js or date-fns for date handling

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Components

- **Dashboard**: Main overview with map and statistics
- **Dispatch**: Vehicle and trip management interface
- **Alerts**: Safety alert monitoring and response
- **Devices**: Vehicle device management and remote controls
- **Recordings**: Audio recording library and playback
- **Transcription**: Speech-to-text transcription viewing
- **Settings**: System configuration and preferences
- **AuditLog**: Comprehensive activity logging
- **Users**: User profile and role management
- **Profile**: Individual user profile

## API Integration

The dashboard communicates with the SafeRide OS Backend API at `/api/*` endpoints.

## Real-time Features

- Live vehicle location updates via Socket.IO
- Instant safety alert notifications
- Real-time trip status changes
- Immediate audio recording availability
- Dynamic transcription updates
- Device command acknowledgments
- Concurrent user presence indicators

## Deployment

Build for production:
```bash
npm run build
```

The build output can be served by any static file host or integrated with a backend service.
