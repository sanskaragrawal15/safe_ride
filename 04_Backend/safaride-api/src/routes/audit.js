const express = require('express');
const router = express.Router();

// Mock in-memory store
const logs = [];

// List all audit logs
router.get('/', (req, res) => {
  const { user_id, resource_type, action } = req.query;
  let result = logs;
  if (user_id) result = result.filter(l => String(l.user_id) === user_id);
  if (resource_type) result = result.filter(l => l.resource_type === resource_type);
  if (action) result = result.filter(l => l.action === action);
  res.json(result);
});

// Get a single audit log
router.get('/:id', (req, res) => {
  const log = logs.find(l => String(l.id) === req.params.id);
  if (!log) return res.status(404).json({ error: 'Log not found' });
  res.json(log);
});

// Create an audit log
router.post('/', (req, res) => {
  const { user_id, action, resource_type, resource_id, changes, ip_address } = req.body;
  if (!action || !resource_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const log = {
    id: logs.length + 1,
    user_id: user_id || null,
    action,
    resource_type,
    resource_id: resource_id || null,
    changes: changes || null,
    ip_address: ip_address || null,
    created_at: new Date().toISOString()
  };
  logs.push(log);
  res.status(201).json(log);
});

module.exports = router;