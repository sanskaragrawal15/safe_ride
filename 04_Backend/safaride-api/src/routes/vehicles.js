const express = require('express');
const router = express.Router();

// Mock in-memory store (real app would use the database)
const vehicles = [];

// List all vehicles
router.get('/', (req, res) => {
  res.json(vehicles);
});

// Get a single vehicle
router.get('/:id', (req, res) => {
  const vehicle = vehicles.find(v => String(v.id) === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

// Create a vehicle
router.post('/', (req, res) => {
  const { user_id, make, model, year, license_plate, color } = req.body;
  if (!user_id || !make || !model || !year || !license_plate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const vehicle = {
    id: vehicles.length + 1,
    user_id,
    make,
    model,
    year,
    license_plate,
    color: color || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  vehicles.push(vehicle);
  res.status(201).json(vehicle);
});

// Update a vehicle
router.put('/:id', (req, res) => {
  const vehicle = vehicles.find(v => String(v.id) === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  const { make, model, year, license_plate, color } = req.body;
  if (make !== undefined) vehicle.make = make;
  if (model !== undefined) vehicle.model = model;
  if (year !== undefined) vehicle.year = year;
  if (license_plate !== undefined) vehicle.license_plate = license_plate;
  if (color !== undefined) vehicle.color = color;
  vehicle.updated_at = new Date().toISOString();
  res.json(vehicle);
});

// Delete a vehicle
router.delete('/:id', (req, res) => {
  const index = vehicles.findIndex(v => String(v.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Vehicle not found' });
  vehicles.splice(index, 1);
  res.status(204).end();
});

module.exports = router;