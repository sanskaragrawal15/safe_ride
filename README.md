# SafeRide OS - Passenger Safety Operating System

A comprehensive passenger safety operating system for ride-hailing vehicles that provides real-time monitoring, emergency response, and safety analytics through an integrated hardware and software solution.

## Project Overview

SafeRide OS is a multi-component safety system designed to protect passengers in ride-hailing vehicles through continuous monitoring, emergency response capabilities, and comprehensive safety analytics. The system consists of five main components working together to provide end-to-end safety coverage.

## System Components

### 1. Firmware (`03_Firmware/sparrow_v0.4_ble_guardian/`)
- ESP32-based firmware for vehicle safety devices
- Bluetooth Low Energy (BLE) communication
- Sensor data collection and processing
- Local decision making for immediate safety responses

### 2. Backend API (`04_Backend/safaride-api/`)
- Node.js/Express RESTful API with Socket.IO for real-time communication
- SQLite database with comprehensive schema for all safety data
- User authentication and authorization
- Real-time alerts and notifications
- Device management and command/control
- Audit logging and compliance features

### 3. Command Center Dashboard (`05_Dashboard/safaride-command-center/`)
- React-based web dashboard for fleet managers and safety operators
- Real-time vehicle tracking and monitoring
- Safety alert management and response coordination
- Audio recording and transcription review
- Device management and remote commands
- Comprehensive analytics and reporting

### 4. Passenger App (`06_Passenger_App/safaride_passenger/`)
- Flutter mobile application for passengers
- Trip booking and tracking
- One-touch emergency safety button
- Optional audio recording during trips
- Trip sharing with trusted contacts
- Safety feedback and rating system

### 5. Driver App (`07_Driver_App/safaride_driver/`)
- Flutter mobile application for drivers
- Trip acceptance and navigation
- Safety monitoring (unsafe driving detection)
- Emergency response tools
- Vehicle diagnostics integration
- Earnings tracking and performance metrics

### 6. PCB Designs (`12_PCB/`)
- Hardware designs for vehicle safety devices
- Sensor integration (GPS, accelerometer, microphone, etc.)
- Power management and vehicle interface
- Communication modules (cellular, Bluetooth, OBD-II)

## Key Features

### Safety Monitoring
- Real-time GPS tracking and geofencing
- Unsafe driving detection (speed, acceleration, braking)
- Audio monitoring for accident detection
- Driver fatigue and distraction detection
- Vehicle health monitoring via OBD-II

### Emergency Response
- One-touch emergency buttons (passenger and driver)
- Automatic crash detection and alert
- Precise location sharing with emergency services
- Emergency contact notification
- Optional audio and video recording during emergencies

### Communication & Alerts
- Real-time Socket.IO connections
- Push notifications for critical events
- Two-way communication between passengers, drivers, and monitoring center
- Vehicle-to-infrastructure communication capabilities
- Multi-language support

### Data & Analytics
- Comprehensive trip and safety event logging
- Audio recording and transcription services
- Safety scoring and behavior analytics
- Predictive maintenance alerts
- Compliance reporting and audit trails
- Export capabilities for legal and insurance purposes

### Privacy & Security
- End-to-end encryption for sensitive data
- GDPR/CCPA compliant data handling
- Role-based access control
- Secure authentication with JWT
- Audit logging for all system access
- Data retention and deletion policies

## Architecture

```
SafeRide OS
├── 03_Firmware/
│   └── sparrow_v0.4_ble_guardian/     # ESP32 device firmware
├── 04_Backend/
│   └── safaride-api/                  # Node.js/Express API
├── 05_Dashboard/
│   └── safaride-command-center/       # React dashboard
├── 06_Passenger_App/
│   └── safaride_passenger/            # Flutter passenger app
├── 07_Driver_App/
│   └── safaride_driver/               # Flutter driver app
└── 12_PCB/                            # Hardware PCB designs
```

## Technology Stack

### Firmware
- ESP32 microcontroller
- Arduino IDE / ESP-IDF
- Bluetooth Low Energy (BLE)
- Sensor drivers (GPS, accelerometer, etc.)
- FreeRTOS for task management

### Backend
- Node.js 18+
- Express.js framework
- Socket.IO for real-time communication
- SQLite3 database with better-sqlite3
- JWT for authentication
- bcryptjs for password hashing
- Zod for data validation
- Multer for file uploads
- Dotenv for environment configuration

### Dashboard
- React 18+
- Redux Toolkit for state management
- Material-UI (MUI) component library
- React Router for navigation
- Leaflet/Mapbox GL JS for mapping
- Chart.js for data visualization
- Axios for HTTP requests
- Socket.IO client for real-time updates

### Mobile Apps (Passenger & Driver)
- Flutter 3.0+
- Dart programming language
- Provider/Riverpod for state management
- Google Maps Flutter SDK
- Firebase/Core and Firebase/Crashlytics
- Location and sensor plugins
- Audio recording and playback
- Shared preferences and SQFlite for local storage
- Dio/http for API communication
- Socket.IO client for Flutter
- Flutter Secure Storage for tokens

### Hardware
- ESP32 or similar microcontroller
- GPS module (u-blox or similar)
- 3-axis accelerometer/gyroscope (MPU-6050 or similar)
- MEMS microphone array
- Bluetooth 5.0 module
- Cellular/LTE module (SIM800L or similar)
- OBD-II adapter interface
- Power management ICs
- Various input/output interfaces

## Setup & Installation

### Prerequisites
- Node.js 18+ (for backend)
- Flutter SDK 3.0+ (for mobile apps)
- React development environment (for dashboard)
- Arduino IDE or ESP-IDF (for firmware)
- KiCad or similar PCB design software
- Git for version control

### Backend Setup
```bash
# Navigate to backend directory
cd 04_Backend/safaride-api

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev    # Development mode
npm start      # Production mode
```

### Dashboard Setup
```bash
# Navigate to dashboard directory
cd 05_Dashboard/safaride-command-center

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start

# Build for production
npm run build
```

### Mobile Apps Setup
```bash
# Navigate to app directory
cd 06_Passenger_App/safaride_passenger   # or 07_Driver_App/safaride_driver

# Get dependencies
flutter pub get

# Run the app
flutter run

# Build for release
flutter build apk --release   # Android
flutter build ios --release   # iOS
```

### Firmware Setup
```bash
# Navigate to firmware directory
cd 03_Firmware/sparrow_v0.4_ble_guardian

# Open in Arduino IDE or compile with ESP-IDF
# Upload to ESP32 device
```

## API Documentation

The backend API follows RESTful conventions with WebSocket endpoints for real-time communication.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/refresh` - Refresh access token

### Vehicle Management
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Trip Management
- `GET /api/trips` - List trips (with filtering)
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - End/delete trip

### Safety Features
- `GET /api/safety/alerts` - List safety alerts
- `POST /api/safety/alerts` - Create safety alert
- `GET /api/safety/alerts/:id` - Get alert details
- `PUT /api/safety/alerts/:id` - Update alert status
- `GET /api/safety/recordings` - List audio recordings
- `GET /api/safety/recordings/:id` - Get recording details
- `GET /api/safety/transcriptions` - List transcriptions
- `GET /api/safety/transcriptions/:id` - Get transcription details

### Device Management
- `GET /api/device/commands` - List device commands
- `POST /api/device/commands` - Send command to device
- `GET /api/device/responses` - List device responses
- `POST /api/device/responses` - Record device response

### Audit & Compliance
- `GET /api/audit/logs` - List audit logs
- `POST /api/audit/logs` - Create audit log
- `GET /api/audit/summary` - Get compliance summary

### Real-Time Events (Socket.IO)
- `tripUpdate` - Real-time trip location and status
- `safetyAlert` - New safety alert notification
- `audioAvailable` - New audio recording available
- `transcriptionReady` - Transcription completed
- `deviceStatus` - Device connection/status update
- `systemAlert` - System-wide announcements

## Data Models

### User
```javascript
{
  id: Integer,
  name: String,
  email: String (unique),
  password_hash: String,
  phone: String,
  role: Enum['user', 'driver', 'admin'],
  created_at: DateTime,
  updated_at: DateTime
}
```

### Vehicle
```javascript
{
  id: Integer,
  user_id: Integer (foreign key),
  make: String,
  model: String,
  year: Integer,
  license_plate: String (unique),
  color: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Trip
```javascript
{
  id: Integer,
  vehicle_id: Integer (foreign key),
  driver_id: Integer (foreign key),
  passenger_id: Integer (foreign key, nullable),
  start_location: String,
  end_location: String (nullable),
  start_time: DateTime,
  end_time: DateTime (nullable),
  status: Enum['scheduled', 'ongoing', 'completed', 'cancelled'],
  fare: Float (nullable),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Safety Alert
```javascript
{
  id: Integer,
  trip_id: Integer (foreign key, nullable),
  user_id: Integer (foreign key),
  type: String,
  severity: Enum['low', 'medium', 'high', 'critical'],
  description: String (nullable),
  location: String (nullable),
  status: Enum['active', 'acknowledged', 'resolved'],
  created_at: DateTime,
  updated_at: DateTime
}
```

## Configuration

Environment variables are configured through `.env` file. See `.env.example` for all available options.

### Key Configuration Areas
- Server port and host
- Database connection settings
- JWT authentication secrets
- File upload limits and directories
- API rate limiting
- CORS origins
- Safety thresholds and parameters
- External service API keys
- Logging configuration

## Testing

### Backend Tests
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov
```

### Frontend Tests
```bash
# Dashboard tests
npm test

# Mobile app tests
flutter test
```

## Deployment

### Production Deployment
1. Set environment variables for production
2. Use process manager like PM2 for Node.js:
   ```bash
   npm install -g pm2
   pm2 start server.js --name safaride-api
   ```
3. Configure reverse proxy (NGINX/Apache) for SSL and load balancing
4. Set up monitoring and logging services
5. Configure automated backups for the SQLite database
6. Deploy dashboard to static file hosting (Netlify, Vercel, etc.)
7. Publish mobile apps to app stores (Google Play, Apple App Store)

### Docker Deployment (Alternative)
```bash
# Build Docker image
docker build -t safaride-api .

# Run container
docker run -p 3000:3000 --env-file .env safaride-api
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## Security Considerations

- All sensitive data is encrypted at rest and in transit
- Regular security audits and penetration testing recommended
- Keep all dependencies updated to address known vulnerabilities
- Implement rate limiting and DDoS protection
- Use Web Application Firewall (WAF) for additional protection
- Regular backup and disaster recovery procedures
- Secure key management for encryption and JWT secrets
- Regular security training for administrators and operators

## Compliance

SafeRide OS is designed to help comply with:
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- ISO 27001 (Information Security Management)
- SOC 2 Type II (Security, Availability, Processing Integrity, Confidentiality, Privacy)
- Local transportation safety regulations
- Vehicle safety device standards
- Emergency response system requirements

## Roadmap

### Phase 1: MVP (Current)
- Basic trip tracking and monitoring
- Emergency button functionality
- Audio recording capabilities
- Dashboard for oversight
- Mobile apps for passengers and drivers

### Phase 2: Enhanced Safety
- Advanced unsafe driving detection
- Driver fatigue monitoring
- Automatic crash detection
- Enhanced audio analysis
- Integration with emergency services
- Multi-language support

### Phase 3: Analytics & Intelligence
- Predictive safety analytics
- Machine learning for risk assessment
- Fleet optimization recommendations
- Insurance integration
- Advanced reporting and dashboards
- API for third-party integrations

### Phase 4: Expansion
- Public transportation integration
- School bus safety applications
- Commercial trucking safety
- Motorcycle and bicycle safety adaptations
- Smart city integration
- Autonomous vehicle safety protocols

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Open source community for the numerous libraries and frameworks used
- Transportation safety organizations for guidance and standards
- Emergency response professionals for input on emergency features
- Privacy advocates for helping shape data protection measures
- Early adopters and beta testers for valuable feedback

## Contact

For questions, support, or collaboration opportunities, please open an issue in this repository or contact the maintainers directly.

---

SafeRide OS - Making every ride safer through technology.