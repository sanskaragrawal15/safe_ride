const express = require('express');
const router = express.Router();

// In-memory store seeded with active safety alerts
const alerts = [
  {
    id: 1,
    trip_id: 1,
    user_id: 102,
    type: 'SPEED_ANOMALY',
    severity: 'MEDIUM',
    description: 'Vehicle exceeded 80 km/h speed threshold on arterial corridor',
    location: '28.6289, 77.2065',
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: 2,
    trip_id: 2,
    user_id: 202,
    type: 'SOS_EMERGENCY',
    severity: 'CRITICAL',
    description: 'Passenger triggered in-cabin panic button',
    location: '28.5355, 77.3910',
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 4).toISOString()
  }
];

// List all safety alerts
router.get('/', (req, res) => {
  res.json(alerts);
});

// Get a single alert
router.get('/:id', (req, res) => {
  const alert = alerts.find(a => String(a.id) === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// Create a safety alert
router.post('/', (req, res) => {
  const { trip_id, user_id, type, severity, description, location } = req.body;
  if (!user_id || !type || !severity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const alert = {
    id: alerts.length + 1,
    trip_id: trip_id || null,
    user_id,
    type,
    severity,
    description: description || null,
    location: location || null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  alerts.push(alert);
  const io = req.app.get('io');
  if (io) io.emit('safety:alert', alert);
  res.status(201).json(alert);
});

// Update alert status
router.put('/:id', (req, res) => {
  const alert = alerts.find(a => String(a.id) === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  const { status } = req.body;
  if (status !== undefined) alert.status = status;
  alert.updated_at = new Date().toISOString();
  const io = req.app.get('io');
  if (io) io.emit('safety:alert_updated', alert);
  res.json(alert);
});

// Delete an alert
router.delete('/:id', (req, res) => {
  const index = alerts.findIndex(a => String(a.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Alert not found' });
  alerts.splice(index, 1);
  res.status(204).end();
});

module.exports = router;