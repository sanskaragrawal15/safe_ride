const express = require('express');
const router = express.Router();

let systemSettings = {
  retention_days: 90,
  auto_deletion_enabled: true,
  storage_provider: 'AWS_S3_VAULT',
  bucket_name: 'safaride-secure-telemetry-ap-south',
  encryption_standard: 'AES-256-GCM',
  notifications: {
    webhook_enabled: true,
    webhook_url: 'https://dispatch.safaride.internal/alerts/webhook',
    email_alerts: true,
    alert_recipients: 'emergency-ops@safaride.com',
    sms_emergency_escalation: true
  },
  device_configuration: {
    heartbeat_interval_seconds: 15,
    gps_sample_rate_hz: 1,
    audio_compression: 'OPUS_16KHZ_MONO',
    tamper_sensitivity: 'HIGH',
    speed_threshold_kmh: 80,
    impact_threshold_g: 3.5
  },
  roles_and_permissions: {
    super_admin: { can_listen: true, can_download: true, can_delete: true, can_manage_users: true },
    operator: { can_listen: true, can_download: true, can_delete: false, can_manage_users: false },
    reviewer: { can_listen: true, can_download: false, can_delete: false, can_manage_users: false },
    read_only: { can_listen: false, can_download: false, can_delete: false, can_manage_users: false }
  }
};

// Get current settings
router.get('/', (req, res) => {
  res.json(systemSettings);
});

// Update settings
router.put('/', (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  const io = req.app.get('io');
  if (io) {
    io.emit('settings:updated', systemSettings);
  }
  res.json({ message: 'Settings saved successfully', settings: systemSettings });
});

module.exports = router;
