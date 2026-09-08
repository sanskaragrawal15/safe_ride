const express = require('express');
const router = express.Router();

// Mock in-memory store
const commands = [];
const responses = [];

// Send a command to a device
router.post('/commands', (req, res) => {
  const { device_id, command_type, parameters } = req.body;
  if (!device_id || !command_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const command = {
    id: commands.length + 1,
    device_id,
    command_type,
    parameters: parameters || null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  commands.push(command);
  res.status(201).json(command);
});

// Get all commands for a device
router.get('/commands', (req, res) => {
  const { device_id } = req.query;
  let result = commands;
  if (device_id) result = commands.filter(c => c.device_id === device_id);
  res.json(result);
});

// Get a single command
router.get('/commands/:id', (req, res) => {
  const command = commands.find(c => String(c.id) === req.params.id);
  if (!command) return res.status(404).json({ error: 'Command not found' });
  res.json(command);
});

// Update command status
router.put('/commands/:id', (req, res) => {
  const command = commands.find(c => String(c.id) === req.params.id);
  if (!command) return res.status(404).json({ error: 'Command not found' });
  const { status } = req.body;
  if (status !== undefined) command.status = status;
  command.updated_at = new Date().toISOString();
  res.json(command);
});

// Add a response to a command
router.post('/commands/:id/responses', (req, res) => {
  const command = commands.find(c => String(c.id) === req.params.id);
  if (!command) return res.status(404).json({ error: 'Command not found' });
  const { response_data, status } = req.body;
  const response = {
    id: responses.length + 1,
    command_id: command.id,
    response_data: response_data || null,
    status: status || 'success',
    created_at: new Date().toISOString()
  };
  responses.push(response);
  command.status = 'completed';
  command.updated_at = new Date().toISOString();
  res.status(201).json(response);
});

// Get all responses for a command
router.get('/commands/:id/responses', (req, res) => {
  const cmdResponses = responses.filter(r => String(r.command_id) === req.params.id);
  res.json(cmdResponses);
});

module.exports = router;