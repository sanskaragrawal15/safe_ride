const express = require('express');
const router = express.Router();

// Mock in-memory store
const alerts = [];

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
  res.status(201).json(alert);
});

// Update alert status
router.put('/:id', (req, res) => {
  const alert = alerts.find(a => String(a.id) === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  const { status } = req.body;
  if (status !== undefined) alert.status = status;
  alert.updated_at = new Date().toISOString();
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