# SafeRide OS Driver App

This is the Flutter-based mobile application for drivers using the SafeRide OS safety system.

## Features

- Trip acceptance and management
- Navigation integration (Google Maps/Waze)
- Safety monitoring and alerts
- Emergency response tools
- Vehicle diagnostics integration
- Earnings tracking and reporting
- Driver profile and documentation
- Shift management and scheduling
- In-app communication with passengers
- Safety score and feedback system
- Offline capability for areas with poor connectivity

## Technology Stack

- Flutter 3.0+
- Dart SDK
- Provider or Riverpod for state management
- Google Maps Flutter SDK
- Navigation launcher plugin
- Location plugin for GPS tracking
- Sensor plugin for accelerometer/gyroscope (unsafe driving detection)
- Permission handler for required permissions
- Audio recording and playback (for safety monitoring)
- Barcode/QR scanner (for vehicle/driver identification)
- Firebase/Core and Firebase/Crashlytics
- Shared preferences for local caching
- SQFlite for local database when offline
- Audio session handling
- Background location tracking
- Firebase Cloud Messaging for push notifications
- Dio or http for API calls
- Socket.IO client for Flutter (real-time updates)
- Flutter JWT Decoder for token handling
- Flutter Lottie for animations
- Flutter Spinkit for loading indicators
- Intl for localization
- Flutter Secure Storage for tokens
- Url_launcher for external links (maps, phone, etc.)

## Setup Instructions

1. Install Flutter SDK (https://flutter.dev/docs/get-started/install)
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Configure platform-specific settings:
   - Android: Update `android/app/src/main/AndroidManifest.xml` for permissions
   - iOS: Update `ios/Runner/Info.plist` for permissions
4. Run the app:
   ```bash
   flutter run
   ```

## Key Features Details

### Safety Monitoring System
- Continuous GPS tracking for trip monitoring
- Accelerometer and gyroscope for unsafe driving detection
  - Hard braking detection
  - Rapid acceleration monitoring
  - Sharp turn detection
  - Speed limit violation alerts
- Audio monitoring for unusual sounds (crashes, disturbances)
- Driver fatigue detection (via steering patterns and timing)
- Distracted driving detection (phone usage monitoring)

### Emergency Response Features
- One-tap emergency button for driver distress
- Automatic crash detection and alert
- Emergency services notification with precise location
- Passenger notification in case of driver emergency
- Vehicle immobilization control (when integrated with compatible systems)
- Hazard light activation
- Horn and light flashing for attention

### Trip Management
- Trip acceptance/rejection interface
- Turn-by-turn navigation integration
- Estimated time of arrival calculations
- Route optimization suggestions
- Passenger pickup/drop-off confirmation
- Fare calculation and collection
- Trip completion rating system

### Vehicle Integration
- Bluetooth OBD-II adapter connectivity (for vehicle diagnostics)
- Fuel level monitoring
- Engine temperature tracking
- Battery voltage monitoring
- Maintenance reminder system
- Door lock/unlock status monitoring
- Headlight and signal status

## API Integration

The app communicates with the SafeRide OS Backend API:
- Authentication endpoints (/api/auth/*)
- Trip management endpoints (/api/trips/*)
- Safety features (/api/safety/*)
- Vehicle information (/api/vehicles/*)
- Device command endpoints (/api/device/*)
- Earnings and payment endpoints (to be implemented)
- Profile management endpoints

## Permissions Required

- **Location**: For trip tracking, navigation, and emergency services
- **Microphone**: For audio safety monitoring and crash detection
- **Camera**: For document scanning and QR code functionality
- **Phone**: For emergency calls and vehicle diagnostics
- **Sensors**: For accelerometer, gyroscope, and other safety monitoring
- **Storage**: For saving logs, audio recordings, and offline data
- **Bluetooth**: For OBD-II adapter and vehicle device connectivity
- **Notifications**: For trip assignments, safety alerts, and communications
- **Background Location**: For continued tracking when app is not foreground

## Platform Specifics

### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34
- Uses AndroidX libraries
- Background location permissions
- Foreground service for continuous tracking
- ProGuard/R8 rules for release builds

### iOS
- Minimum iOS version: 13.0
- Uses Swift 5.0+ for native modules
- Background location capabilities
- Privacy descriptions in Info.plist
- Usage descriptions for all required permissions

## Testing

- Unit tests with `flutter test`
- Widget tests for UI components
- Integration tests for critical safety features
- Manual testing on physical devices (essential for safety features)
- Simulator testing for UI and basic functionality
- Testing with actual OBD-II adapters for vehicle integration

## Release Process

1. Increment version number in pubspec.yaml
2. Update CHANGELOG.md with safety-relevant changes
3. Run `flutter build apk --release` for Android
4. Run `flutter build ios --release` for iOS
5. Distribute via appropriate channels (Play Store, App Store, fleet management systems)

## Security Features

- Encrypted local storage for sensitive trip and safety data
- Secure authentication token handling
- Certificate pinning for API communications
- Input validation and sanitization
- Secure deletion of sensitive audio logs
- Biometric authentication for app access
- Protected background execution for safety monitoring
- Tamper detection for simulated locations
- Secure WebSocket connections for real-time data

## Customization

- Branding: Colors, logos, and assets in lib/assets/
- Localization: Add ARB files in lib/l10n/
- Feature flags: Configure via lib/config/feature_flags.dart
- Theming: Customize ThemeData in lib/theme/
- Safety thresholds: Adjust via lib/config/safety_thresholds.dart
- Navigation preferences: Configure via lib/config/navigation.dart

## Compliance and Certification

This application is designed to help comply with:
- Transportation safety regulations
- Data protection regulations (GDPR, CCPA, etc.)
- Accessibility standards (WCAG 2.1)
- Vehicle safety device integration standards
- Emergency response system requirements

## License

MIT License - SafeRide OS Team
