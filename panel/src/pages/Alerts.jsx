import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  WifiOff, 
  MicOff, 
  HardDrive, 
  UploadCloud, 
  Radio, 
  CheckCircle2, 
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'SOS_EMERGENCY',
      severity: 'CRITICAL',
      source: 'CAB-102 (SPARROW-V0.4-02)',
      description: 'Physical SOS emergency panic switch engaged in passenger cabin',
      location: '28.6289, 77.2065 (Outer Ring Expressway)',
      status: 'active',
      timestamp: '4 minutes ago',
      icon: ShieldAlert
    },
    {
      id: 2,
      type: 'DEVICE_TAMPERING',
      severity: 'CRITICAL',
      source: 'CAB-104 (SPARROW-V0.4-04)',
      description: 'Chassis enclosure vibration sensor triggered: potential hardware disconnect',
      location: '28.5355, 77.3910 (Sector 62 Hub)',
      status: 'active',
      timestamp: '18 minutes ago',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'RECORDING_STOPPED_UNEXPECTEDLY',
      severity: 'HIGH',
      source: 'CAB-103 (SPARROW-V0.4-03)',
      description: 'Audio encoder buffer underflow: capture interrupted prior to trip completion',
      location: '28.6139, 77.2090',
      status: 'active',
      timestamp: '32 minutes ago',
      icon: MicOff
    },
    {
      id: 4,
      type: 'DEVICE_DISCONNECTED',
      severity: 'MEDIUM',
      source: 'CAB-104 (SPARROW-V0.4-04)',
      description: 'No ping received for 45 minutes: cellular carrier drop',
      location: 'Stationary depot',
      status: 'acknowledged',
      timestamp: '48 minutes ago',
      icon: WifiOff
    },
    {
      id: 5,
      type: 'UPLOAD_FAILED',
      severity: 'MEDIUM',
      source: 'CAB-101 (SPARROW-V0.4-01)',
      description: 'HTTP 504 gateway timeout while transferring batch recording archive',
      location: 'NCR Central Corridor',
      status: 'resolved',
      timestamp: '2 hours ago',
      icon: UploadCloud
    },
    {
      id: 6,
      type: 'STORAGE_FULL_WARNING',
      severity: 'LOW',
      source: 'VAULT-S3-PRIMARY',
      description: 'Local flash cache partition reached 92% write ceiling',
      location: 'Internal memory bank',
      status: 'resolved',
      timestamp: '5 hours ago',
      icon: HardDrive
    }
  ]);

  const [filter, setFilter] = useState('ALL');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // Listen for live socket broadcasts
    const cleanup = socketService.on('safety:alert', (newAlert) => {
      setAlerts(prev => [
        {
          id: prev.length + 1,
          type: newAlert.type || 'SOS_EMERGENCY',
          severity: newAlert.severity || 'CRITICAL',
          source: `User #${newAlert.user_id} Unit`,
          description: newAlert.description || 'Live emergency signal broadcast',
          location: newAlert.location || 'Coordinated GPS',
          status: 'active',
          timestamp: 'Just now',
          icon: ShieldAlert
        },
        ...prev
      ]);
    });

    return () => cleanup();
  }, []);

  const handleUpdateStatus = async (alertId, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    try {
      await api.updateAlertStatus(alertId, newStatus);
    } catch (e) {
      // Keep UI responsive
    }
    setNotice(`Alert #${alertId} updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setNotice(null), 3000);
  };

  const filtered = alerts.filter(a => {
    if (filter === 'ACTIVE') return a.status === 'active';
    if (filter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (filter === 'RESOLVED') return a.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Alerts Dispatch Center</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Tampering alarms, disconnects, unexpectedly stopped recordings, and critical SOS triage.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-spatial-900 border border-white/[0.08] rounded-lg p-1">
          {['ALL', 'ACTIVE', 'CRITICAL', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                filter === f 
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Alert Feed */}
      <div className="space-y-4">
        {filtered.map((alert) => {
          const Icon = alert.icon || AlertTriangle;
          const isCritical = alert.severity === 'CRITICAL';

          return (
            <GlassCard 
              key={alert.id}
              className={`border-l-4 ${
                isCritical 
                  ? 'border-l-rose-500 bg-rose-950/15' 
                  : alert.status === 'resolved' 
                    ? 'border-l-slate-600' 
                    : 'border-l-amber-400'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                    isCritical 
                      ? 'bg-rose-950/80 border border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                      : 'bg-spatial-950 border border-white/10 text-cyan-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-white tracking-wide">{alert.type}</span>
                      <StatusBadge status={alert.severity} />
                      <StatusBadge status={alert.status} label={alert.status} />
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      <span>Source: <strong className="text-slate-200">{alert.source}</strong></span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <MapPin className="w-3 h-3" /> {alert.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Triage Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'acknowledged')}
                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 text-xs font-mono font-medium transition-all"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'resolved' ? (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                      Closed
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
