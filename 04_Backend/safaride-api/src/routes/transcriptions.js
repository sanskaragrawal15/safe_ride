const express = require('express');
const router = express.Router();

const transcriptions = [
  {
    id: 'TRN-2026-0901',
    recording_id: 'REC-2026-0901',
    cab_number: 'CAB-101',
    driver_name: 'Rajesh Kumar',
    confidence: 0.96,
    language: 'en-IN',
    summary: 'Standard passenger greeting followed by route confirmation via Outer Ring Road. Normal trip completion with no disputes.',
    overall_sentiment: 'neutral',
    aggression_detected: false,
    flagged_keywords: ['route deviation checked', 'fare confirmed'],
    dialogue: [
      { speaker: 'Driver', time: '00:05', text: 'Good morning sir, heading towards Terminal 3 correct?' },
      { speaker: 'Passenger', time: '00:12', text: 'Yes, please take the flyover to avoid the toll plaza delay.' },
      { speaker: 'Driver', time: '00:18', text: 'Understood, GPS navigation updated.' },
      { speaker: 'Passenger', time: '18:40', text: 'Thank you, we reached on time.' },
      { speaker: 'Driver', time: '18:45', text: 'Have a safe flight.' }
    ]
  },
  {
    id: 'TRN-2026-0902',
    recording_id: 'REC-2026-0902',
    cab_number: 'CAB-102',
    driver_name: 'Vikram Singh',
    confidence: 0.92,
    language: 'en-IN',
    summary: 'Elevated voices detected regarding lane blockage. Driver initiated verbal dispute with an external vehicle before safely de-escalating.',
    overall_sentiment: 'tense',
    aggression_detected: true,
    flagged_keywords: ['stop the car', 'emergency signal', 'dispute'],
    dialogue: [
      { speaker: 'Passenger', time: '04:15', text: 'Watch out, that truck is cutting into our lane.' },
      { speaker: 'Driver', time: '04:20', text: 'Hey! Keep your distance! What are you doing?' },
      { speaker: 'Passenger', time: '04:26', text: 'Please slow down, do not get into an argument.' },
      { speaker: 'Driver', time: '04:32', text: 'Sorry maam, brakes applied. Everyone is safe.' },
      { speaker: 'Passenger', time: '04:45', text: 'Okay, lets continue calmly.' }
    ]
  }
];

// List all transcriptions with search
router.get('/', (req, res) => {
  const { query, aggression, cab } = req.query;
  let filtered = [...transcriptions];

  if (aggression !== undefined) {
    const isAggressive = aggression === 'true';
    filtered = filtered.filter(t => t.aggression_detected === isAggressive);
  }
  if (cab) {
    filtered = filtered.filter(t => t.cab_number.toLowerCase().includes(cab.toLowerCase()));
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t => 
      t.summary.toLowerCase().includes(q) ||
      t.flagged_keywords.some(k => k.toLowerCase().includes(q)) ||
      t.dialogue.some(d => d.text.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// Single transcript
router.get('/:id', (req, res) => {
  const t = transcriptions.find(item => item.id === req.params.id || item.recording_id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Transcription not found' });
  res.json(t);
});

module.exports = router;
