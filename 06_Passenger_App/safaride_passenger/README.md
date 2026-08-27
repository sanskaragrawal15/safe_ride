# SafeRide OS Passenger App

This is the Flutter-based mobile application for passengers using the SafeRide OS safety system.

## Features

- Trip booking and management
- Real-time vehicle tracking
- Safety emergency button (one-tap emergency)
- Audio recording during trips (with consent)
- Trip sharing with trusted contacts
- Safety rating and feedback system
- Payment integration (placeholder)
- Trip history and receipts
- In-app support and help
- Profile management
- Notification center

## Technology Stack

- Flutter 3.0+
- Dart SDK
- Provider or Riverpod for state management
- Firebase/Core (optional, for analytics and crash reporting)
- Firebase/Firestore (optional, for additional data storage)
- Google Maps Flutter SDK
- Location plugin for GPS tracking
- Permission handler for microphone/camera/location
- Audio recording and playback packages
- Image picker for profile/media
- Intl for localization
- Flutter Secure Storage for tokens
- Dio or http for API calls
- Socket.IO client for Flutter (for real-time updates)
- Flutter JWT Decoder for token handling
- Flutter Lottie for animations
- Flutter Spinkit for loading indicators

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

### Emergency Safety Button
- Prominent, always-accessible button
- Configurable hold time to prevent accidental activation
- Immediate emergency alert to monitoring center
- Location sharing with emergency services
- Optional audio recording activation
- Notification to emergency contacts

### Trip Safety Monitoring
- Continuous location tracking during trips
- Speed and acceleration monitoring for unsafe driving detection
- Route deviation alerts
- Audio recording with passenger consent
- Real-time trip status sharing with selected contacts

### Audio Recording & Transcription
- Optional audio recording for trip safety
- Secure storage and transmission
- Speech-to-text transcription service
- Playback and review capabilities
- Export options for legal/insurance purposes

### Device Integration
- Bluetooth pairing with vehicle safety devices
- Remote command reception (door unlock, etc.)
- Status indicators for vehicle safety systems
- Battery level monitoring for devices

## API Integration

The app communicates with the SafeRide OS Backend API:
- Authentication endpoints (/api/auth/*)
- Trip management endpoints (/api/trips/*)
- Safety features (/api/safety/*)
- Vehicle information (/api/vehicles/*)
- Profile management (to be implemented)

## Permissions Required

- **Location**: For trip tracking and emergency services
- **Microphone**: For audio recording during trips
- **Phone**: For emergency calls and device pairing
- **Storage**: For saving audio recordings and media
- **Bluetooth**: For connecting to vehicle safety devices
- **Notifications**: For safety alerts and trip updates

## Platform Specifics

### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34
- Uses AndroidX libraries
- ProGuard/R8 rules for release builds

### iOS
- Minimum iOS version: 13.0
- Uses Swift 5.0+ for native modules
- Privacy descriptions in Info.plist

## Testing

- Unit tests with `flutter test`
- Widget tests for UI components
- Integration tests for critical flows
- Manual testing on physical devices recommended

## Release Process

1. Increment version number in pubspec.yaml
2. Update CHANGELOG.md
3. Run `flutter build apk --release` for Android
4. Run `flutter build ios --release` for iOS
5. Distribute via appropriate channels (Play Store, App Store, enterprise)

## Security Features

- Encrypted local storage for sensitive data
- Secure token handling and refresh
- Certificate pinning for API calls (optional)
- Input validation and sanitization
- Secure deletion of sensitive recordings
- Biometric authentication option (fingerprint/face ID)

## Customization

- Branding: Colors, logos, and assets in lib/assets/
- Localization: Add ARB files in lib/l10n/
- Feature flags: Configure via lib/config/feature_flags.dart
- Theming: Customize ThemeData in lib/theme/

## License

MIT License - SafeRide OS Team
