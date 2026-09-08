import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Cpu, 
  BatteryCharging, 
  Clock, 
  Activity, 
  RotateCw, 
  Lock, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';

export const CabsDevices = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await api.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    }
  };

  const handleDeviceCommand = async (deviceId, commandType) => {
    try {
      await api.sendCommand(deviceId, commandType);
      setActionNotice(`Command ${commandType} transmitted to device ${deviceId}`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      setActionNotice(`Failed to transmit ${commandType}: network error`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // Enriched cab records matching compulsory specification
  const enrichedFleet = [
    {
      id: 1,
      cab_number: 'CAB-101',
      device_id: 'SPARROW-V0.4-01',
      driver_name: 'Rajesh Kumar',
      driver_phone: '+91 98112 34567',
      driver_rating: '4.92',
      status: 'online',
      battery_level: 94,
      power_source: 'Vehicle Alternator (13.8V)',
      last_connected: '2 seconds ago',
      firmware_version: 'v0.4.2-ble',
      make_model: 'Toyota Camry Hybrid'
    },
    {
      id: 2,
      cab_number: 'CAB-102',
      device_id: 'SPARROW-V0.4-02',
      driver_name: 'Vikram Singh',
      driver_phone: '+91 98223 45678',
      driver_rating: '4.88',
      status: 'in_trip',
      battery_level: 82,
      power_source: 'Vehicle Alternator (14.1V)',
      last_connected: '5 seconds ago',
      firmware_version: 'v0.4.2-ble',
      make_model: 'Hyundai Ioniq 5'
    },
    {
      id: 3,
      cab_number: 'CAB-103',
      device_id: 'SPARROW-V0.4-03',
      driver_name: 'Amit Patel',
      driver_phone: '+91 98334 56789',
      driver_rating: '4.95',
      status: 'idle',
      battery_level: 100,
      power_source: 'Internal Backup LiPo (4.1V)',
      last_connected: '12 seconds ago',
      firmware_version: 'v0.4.1-ble',
      make_model: 'Tesla Model 3'
    },
    {
      id: 4,
      cab_number: 'CAB-104',
      device_id: 'SPARROW-V0.4-04',
      driver_name: 'Sunil Rao',
      driver_phone: '+91 98445 67890',
      driver_rating: '4.71',
      status: 'offline',
      battery_level: 14,
      power_source: 'Battery Low (3.4V)',
      last_connected: '48 minutes ago',
      firmware_version: 'v0.4.0-ble',
      make_model: 'Honda City'
    }
  ];

  const filtered = enrichedFleet.filter(item => 
    item.cab_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.driver_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cab & Device Management</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Hardware health diagnostics, driver allocation, and remote device telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search cab, device ID, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-spatial-900 border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64 md:w-72"
            />
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((cab) => (
          <GlassCard key={cab.id} className="space-y-4">
            {/* Header: Cab Number & Status */}
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold font-mono text-white">{cab.cab_number}</span>
                  <StatusBadge status={cab.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{cab.make_model}</p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400">Device:</span>{' '}
                <span className="text-cyan-400 font-semibold">{cab.device_id}</span>
              </div>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Driver Details</span>
                <span className="text-white font-medium block mt-0.5">{cab.driver_name}</span>
                <span className="text-slate-400 text-[11px] block">{cab.driver_phone}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Power & Battery</span>
                <div className="flex items-center gap-2 mt-1">
                  <BatteryCharging className={`w-4 h-4 ${cab.battery_level > 30 ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-white font-semibold">{cab.battery_level}%</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">{cab.power_source}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Last Heartbeat</span>
                <div className="flex items-center gap-1.5 mt-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{cab.last_connected}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Firmware Version</span>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{cab.firmware_version}</span>
                </div>
              </div>
            </div>

            {/* Remote Command Control Bar */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Hardware Command:</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDeviceCommand(cab.device_id, 'REBOOT')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 hover:bg-white/[0.05] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reboot</span>
                </button>
                <button 
                  onClick={() => handleDeviceCommand(cab.device_id, 'LOCK_CAB')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-rose-500/40 hover:bg-rose-950/30 text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency Lock</span>
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
