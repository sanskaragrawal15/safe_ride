const express = require('express');
const router = express.Router();

// In-memory store seeded with fleet data
const vehicles = [
  {
    id: 1,
    user_id: 101,
    make: 'Toyota',
    model: 'Camry Hybrid',
    year: 2024,
    license_plate: 'SAF-4019',
    color: 'Silver',
    status: 'active',
    location: { lat: 28.6139, lng: 77.2090, speed: 42, heading: 90 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 102,
    make: 'Hyundai',
    model: 'Ioniq 5',
    year: 2023,
    license_plate: 'SAF-8821',
    color: 'Midnight Blue',
    status: 'in_trip',
    location: { lat: 28.6289, lng: 77.2065, speed: 55, heading: 180 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    user_id: 103,
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    license_plate: 'SAF-1190',
    color: 'Pearl White',
    status: 'idle',
    location: { lat: 28.5355, lng: 77.3910, speed: 0, heading: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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
  const { user_id, make, model, year, license_plate, color, location } = req.body;
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
    status: 'active',
    location: location || { lat: 28.6139, lng: 77.2090, speed: 0, heading: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  vehicles.push(vehicle);
  const io = req.app.get('io');
  if (io) io.emit('vehicle:created', vehicle);
  res.status(201).json(vehicle);
});

// Update a vehicle
router.put('/:id', (req, res) => {
  const vehicle = vehicles.find(v => String(v.id) === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  const { make, model, year, license_plate, color, status, location } = req.body;
  if (make !== undefined) vehicle.make = make;
  if (model !== undefined) vehicle.model = model;
  if (year !== undefined) vehicle.year = year;
  if (license_plate !== undefined) vehicle.license_plate = license_plate;
  if (color !== undefined) vehicle.color = color;
  if (status !== undefined) vehicle.status = status;
  if (location !== undefined) vehicle.location = location;
  vehicle.updated_at = new Date().toISOString();
  const io = req.app.get('io');
  if (io) io.emit('vehicle:updated', vehicle);
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