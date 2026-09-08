import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  Navigation, 
  Mic, 
  MicOff, 
  Wifi, 
  Clock, 
  Gauge, 
  Compass,
  AlertTriangle
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export const LiveStatus = () => {
  const [selectedCabId, setSelectedCabId] = useState('CAB-102');
  const [liveTelemetry, setLiveTelemetry] = useState([
    {
      id: 'CAB-101',
      driver: 'Rajesh Kumar',
      make: 'Toyota Camry',
      active: true,
      recording: false,
      connectivity: '4G LTE (Strong)',
      gps: { lat: 28.6139, lng: 77.2090, speed: 42, heading: 'East 90 deg' },
      heartbeat: '1s ago',
      geofence: 'NCR Central Corridor - Normal'
    },
    {
      id: 'CAB-102',
      driver: 'Vikram Singh',
      make: 'Hyundai Ioniq 5',
      active: true,
      recording: true,
      connectivity: '5G NR (Ultra Low Latency)',
      gps: { lat: 28.6289, lng: 77.2065, speed: 58, heading: 'South 180 deg' },
      heartbeat: 'Just now',
      geofence: 'Outer Ring Expressway - Elevated Speed'
    },
    {
      id: 'CAB-103',
      driver: 'Amit Patel',
      make: 'Tesla Model 3',
      active: false,
      recording: false,
      connectivity: 'WiFi Fleet Depot',
      gps: { lat: 28.5355, lng: 77.3910, speed: 0, heading: 'North 0 deg' },
      heartbeat: '8s ago',
      geofence: 'Stationary at Sector 62 Hub'
    }
  ]);

  useEffect(() => {
    // Listen for vehicle updates via socket
    const cleanup = socketService.on('vehicle:updated', (updatedVehicle) => {
      setLiveTelemetry(prev => prev.map(c => {
        if (c.id === `CAB-${updatedVehicle.id}`) {
          return {
            ...c,
            gps: { ...c.gps, ...updatedVehicle.location },
            heartbeat: 'Just now'
          };
        }
        return c;
      }));
    });

    return () => cleanup();
  }, []);

  const selectedCab = liveTelemetry.find(c => c.id === selectedCabId) || liveTelemetry[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Live Fleet Telemetry</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time GPS mapping, in-cabin audio recording status, and continuous hardware heartbeats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>REAL-TIME STREAMING</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fleet List Selector */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Units</h2>
          {liveTelemetry.map((cab) => (
            <GlassCard
              key={cab.id}
              interactive
              onClick={() => setSelectedCabId(cab.id)}
              className={`p-4 transition-all ${
                selectedCabId === cab.id ? 'border-cyan-400/50 shadow-glass-glow bg-cyan-950/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-white">{cab.id}</span>
                  <StatusBadge status={cab.active ? 'active' : 'idle'} />
                </div>
                <div className="flex items-center gap-1.5">
                  {cab.recording ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                      <Mic className="w-3 h-3" /> REC ON
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <MicOff className="w-3 h-3" /> REC OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-300 flex items-center justify-between font-mono">
                <span>{cab.driver}</span>
                <span className="text-cyan-400">{cab.gps.speed} km/h</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Heartbeat: {cab.heartbeat}</span>
                <span className="text-slate-500">{cab.make}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Right Column: Spatial Radar & GPS Telemetry View */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard accent className="p-6">
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-white">{selectedCab.id}</span>
                  <span className="text-xs text-slate-400 font-mono">({selectedCab.make})</span>
                  <StatusBadge status={selectedCab.recording ? 'recording' : 'online'} />
                </div>
                <p className="text-xs font-mono text-cyan-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>GPS: {selectedCab.gps.lat.toFixed(4)}, {selectedCab.gps.lng.toFixed(4)}</span>
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <div>Driver: <span className="text-white font-semibold">{selectedCab.driver}</span></div>
                <div className="mt-0.5 text-emerald-400 flex items-center gap-1 justify-end">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>{selectedCab.connectivity}</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Vector Map Canvas */}
            <div className="my-5 h-64 rounded-xl bg-spatial-950 border border-white/[0.08] relative overflow-hidden flex items-center justify-center">
              {/* Grid overlay */}
              <div className="absolute inset-0 spatial-bg-grid opacity-50" />
              
              {/* Radar sweep line */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
                <div className="w-40 h-40 rounded-full border border-cyan-500/30" />
                <div className="w-20 h-20 rounded-full border border-cyan-500/40" />
              </div>

              {/* Vehicle Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-glass-glow">
                  <Navigation className="w-5 h-5 -rotate-45" />
                </div>
                <div className="mt-2 px-2.5 py-1 rounded bg-spatial-950/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-bold tracking-wider">
                  {selectedCab.id} : {selectedCab.gps.speed} KM/H
                </div>
              </div>

              {/* Map Telemetry Floating Badges */}
              <div className="absolute bottom-3 left-3 bg-spatial-950/90 border border-white/10 rounded-lg p-2 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>Heading: <span className="text-white font-semibold">{selectedCab.gps.heading}</span></div>
                <div>Corridor: <span className="text-cyan-400">{selectedCab.geofence}</span></div>
              </div>

              <div className="absolute top-3 right-3 bg-spatial-950/90 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Heartbeat: {selectedCab.heartbeat}</span>
              </div>
            </div>

            {/* Bottom Instrument Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-spatial-950/70 border border-white/[0.05]">
                <span className="text-slate-400 text-[10px] uppercase block">Ground Velocity</span>
                <span className="text-lg font-bold text-white mt-1 block">{selectedCab.gps.speed} <span className="text-xs font-normal text-slate-400">km/h</span></span>
              </div>

              <div className="p-3 rounded-lg bg-spatial-950/70 border border-white/[0.05]">
                <span className="text-slate-400 text-[10px] uppercase block">Audio Capture State</span>
                <span className={`text-sm font-bold mt-1.5 block ${selectedCab.recording ? 'text-rose-400' : 'text-slate-400'}`}>
                  {selectedCab.recording ? 'STREAMING ACTIVE' : 'MUTED / STANDBY'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-spatial-950/70 border border-white/[0.05]">
                <span className="text-slate-400 text-[10px] uppercase block">Hardware Health</span>
                <span className="text-sm font-bold text-emerald-400 mt-1.5 block">100% NOMINAL</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
