# SafeRide OS Backend API

This is the backend API for the SafeRide OS passenger safety system.

## Project Structure

```
safaride-api/
├── src/
│   ├── config/
│   │   └── database.js       # Database initialization and schema
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Data models
│   ├── routes/               # API route definitions
│   └── services/             # Business logic
├── uploads/                  # File uploads (audio recordings)
├── logs/                     # Log files
├── safaride.db               # SQLite database (generated)
├── .env.example              # Environment variables template
├── package.json              # Project dependencies and scripts
└── server.js                 # Application entry point
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env file to configure your environment
   ```

3. **Database Initialization**:
   The database will be automatically initialized on first run with the following tables:
   - Users
   - Vehicles
   - Trips
   - Safety Alerts
   - Audio Recordings
   - Transcriptions
   - Device Commands
   - Device Responses
   - Audit Logs

4. **Start the Server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create a new vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Safety
- `GET /api/safety/alerts` - Get all safety alerts
- `POST /api/safety/alerts` - Create a new safety alert
- `GET /api/safety/alerts/:id` - Get safety alert by ID
- `PUT /api/safety/alerts/:id` - Update safety alert
- `DELETE /api/safety/alerts/:id` - Delete safety alert

### Device Management
- `GET /api/device/commands` - Get all device commands
- `POST /api/device/commands` - Send a command to device
- `GET /api/device/responses` - Get all device responses
- `POST /api/device/responses` - Record device response

### Audit
- `GET /api/audit/logs` - Get all audit logs
- `POST /api/audit/logs` - Create a new audit log

## Features

- User authentication with JWT
- Role-based access control (user, driver, admin)
- Real-time communication with Socket.IO
- Comprehensive safety alert system
- Audio recording and transcription capabilities
- Remote device command and control
- Full audit trail for compliance
- File upload handling for audio recordings
- SQLite database for lightweight deployment
- RESTful API design
- Comprehensive error handling
- CORS support
- Rate limiting (configure in .env)
- Environment-based configuration

## Database Schema

The system uses SQLite with the following tables:

1. **Users**: Store user information (riders, drivers, admins)
2. **Vehicles**: Vehicle details linked to owners
3. **Trips**: Ride information with tracking
4. **Safety_Alerts**: Emergency and safety notifications
5. **Audio_Recordings**: Recorded audio files from trips
6. **Transcriptions**: Text transcriptions of audio recordings
7. **Device_Commands**: Commands sent to vehicle devices
8. **Device_Responses**: Responses from vehicle devices
9. **Audit_Logs**: System activity tracking

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- SQL injection prevention (via parameterized queries)
- Secure file upload handling
- Environment variable configuration
- Audit logging for all sensitive operations

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all dependencies are installed
5. Test your changes
6. Submit a pull request

## License

MIT License - SafeRide OS Team
