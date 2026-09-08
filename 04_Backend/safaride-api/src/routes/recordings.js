const express = require('express');
const router = express.Router();

// Seeded recording management store
const recordings = [
  {
    id: 'REC-2026-0901',
    trip_id: 1,
    cab_number: 'CAB-101',
    device_id: 'SPARROW-V4-01',
    driver_name: 'Rajesh Kumar',
    start_time: '2026-09-08T09:15:00.000Z',
    end_time: '2026-09-08T09:48:30.000Z',
    duration_seconds: 2010,
    status: 'uploaded',
    file_size_mb: 24.5,
    storage_path: '/vault/recordings/2026/09/REC-2026-0901.wav',
    audio_sample_url: 'https://actions.google.com/sounds/v1/ambiences/car_interior.ogg',
    created_at: '2026-09-08T09:49:00.000Z'
  },
  {
    id: 'REC-2026-0902',
    trip_id: 2,
    cab_number: 'CAB-102',
    device_id: 'SPARROW-V4-02',
    driver_name: 'Vikram Singh',
    start_time: '2026-09-08T10:02:00.000Z',
    end_time: '2026-09-08T10:34:10.000Z',
    duration_seconds: 1930,
    status: 'uploaded',
    file_size_mb: 21.8,
    storage_path: '/vault/recordings/2026/09/REC-2026-0902.wav',
    audio_sample_url: 'https://actions.google.com/sounds/v1/ambiences/city_street.ogg',
    created_at: '2026-09-08T10:35:00.000Z'
  },
  {
    id: 'REC-2026-0903',
    trip_id: 3,
    cab_number: 'CAB-103',
    device_id: 'SPARROW-V4-03',
    driver_name: 'Amit Patel',
    start_time: '2026-09-08T10:15:00.000Z',
    end_time: null,
    duration_seconds: 1850,
    status: 'pending',
    file_size_mb: 18.2,
    storage_path: null,
    audio_sample_url: null,
    created_at: '2026-09-08T10:15:00.000Z'
  },
  {
    id: 'REC-2026-0904',
    trip_id: 4,
    cab_number: 'CAB-104',
    device_id: 'SPARROW-V4-04',
    driver_name: 'Sunil Rao',
    start_time: '2026-09-08T08:20:00.000Z',
    end_time: '2026-09-08T08:35:00.000Z',
    duration_seconds: 900,
    status: 'failed',
    file_size_mb: 0,
    storage_path: null,
    error_reason: 'Cellular uplink timeout during high packet loss',
    created_at: '2026-09-08T08:35:30.000Z'
  }
];

// List recordings with search and filters
router.get('/', (req, res) => {
  const { query, cab, driver, status, date } = req.query;
  let filtered = [...recordings];

  if (status) {
    filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (cab) {
    filtered = filtered.filter(r => r.cab_number.toLowerCase().includes(cab.toLowerCase()));
  }
  if (driver) {
    filtered = filtered.filter(r => r.driver_name.toLowerCase().includes(driver.toLowerCase()));
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(r => 
      r.id.toLowerCase().includes(q) ||
      r.cab_number.toLowerCase().includes(q) ||
      r.driver_name.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// Single recording
router.get('/:id', (req, res) => {
  const rec = recordings.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recording not found' });
  res.json(rec);
});

// Stream audio endpoint
router.get('/:id/stream', (req, res) => {
  const rec = recordings.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recording not found' });
  if (rec.status !== 'uploaded') {
    return res.status(400).json({ error: 'Audio file is not uploaded yet' });
  }

  // Audit log who listened
  const io = req.app.get('io');
  if (io) {
    io.emit('audit:event', {
      action: 'PLAY_AUDIO',
      resource_type: 'recording',
      resource_id: rec.id,
      user_name: req.query.user || 'Authorized Operator',
      timestamp: new Date().toISOString()
    });
  }

  res.redirect(rec.audio_sample_url || 'https://actions.google.com/sounds/v1/ambiences/car_interior.ogg');
});

// Export/download recording endpoint
router.get('/:id/export', (req, res) => {
  const rec = recordings.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recording not found' });

  // Emit audit log
  const io = req.app.get('io');
  if (io) {
    io.emit('audit:event', {
      action: 'DOWNLOAD_AUDIO',
      resource_type: 'recording',
      resource_id: rec.id,
      user_name: req.query.user || 'Authorized Operator',
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    message: 'Export authorized and generated',
    recording_id: rec.id,
    download_url: rec.audio_sample_url,
    exported_at: new Date().toISOString()
  });
});

// Delete recording endpoint
router.delete('/:id', (req, res) => {
  const index = recordings.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Recording not found' });

  const deleted = recordings.splice(index, 1)[0];
  const io = req.app.get('io');
  if (io) {
    io.emit('audit:event', {
      action: 'DELETE_RECORDING',
      resource_type: 'recording',
      resource_id: deleted.id,
      user_name: req.body.user || 'Super Admin',
      timestamp: new Date().toISOString()
    });
    io.emit('recording:deleted', deleted.id);
  }

  res.status(200).json({ message: 'Recording safely removed', id: deleted.id });
});

module.exports = router;
