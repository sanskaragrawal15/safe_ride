const express = require('express');
const router = express.Router();

// In-memory store seeded with active trips
const trips = [
  {
    id: 1,
    vehicle_id: 2,
    driver_id: 102,
    passenger_id: 201,
    passenger_name: 'Priya Sharma',
    driver_name: 'Rajesh Kumar',
    start_location: 'Connaught Place, Inner Circle',
    end_location: 'Indira Gandhi International Airport, T3',
    start_time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    end_time: null,
    status: 'in_progress',
    fare: 450,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    vehicle_id: 1,
    driver_id: 101,
    passenger_id: 202,
    passenger_name: 'Aman Verma',
    driver_name: 'Vikram Singh',
    start_location: 'Cyber City, Phase 2',
    end_location: 'Saket District Centre',
    start_time: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    end_time: null,
    status: 'in_progress',
    fare: 320,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// List all trips
router.get('/', (req, res) => {
  res.json(trips);
});

// Get a single trip
router.get('/:id', (req, res) => {
  const trip = trips.find(t => String(t.id) === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

// Create a trip
router.post('/', (req, res) => {
  const { vehicle_id, driver_id, passenger_id, start_location, end_location, status } = req.body;
  if (!vehicle_id || !driver_id || !start_location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const trip = {
    id: trips.length + 1,
    vehicle_id,
    driver_id,
    passenger_id: passenger_id || null,
    start_location,
    end_location: end_location || null,
    start_time: new Date().toISOString(),
    end_time: null,
    status: status || 'scheduled',
    fare: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  trips.push(trip);
  const io = req.app.get('io');
  if (io) io.emit('trip:created', trip);
  res.status(201).json(trip);
});

// Update a trip
router.put('/:id', (req, res) => {
  const trip = trips.find(t => String(t.id) === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const { end_location, status, fare } = req.body;
  if (end_location !== undefined) trip.end_location = end_location;
  if (status !== undefined) trip.status = status;
  if (fare !== undefined) trip.fare = fare;
  if (status === 'completed' && !trip.end_time) trip.end_time = new Date().toISOString();
  trip.updated_at = new Date().toISOString();
  const io = req.app.get('io');
  if (io) io.emit('trip:updated', trip);
  res.json(trip);
});

// Delete a trip
router.delete('/:id', (req, res) => {
  const index = trips.findIndex(t => String(t.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Trip not found' });
  trips.splice(index, 1);
  res.status(204).end();
});

module.exports = router;