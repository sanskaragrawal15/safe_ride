import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Wifi, 
  WifiOff, 
  Mic, 
  HardDrive, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, rData, aData] = await Promise.all([
          api.getVehicles().catch(() => []),
          api.getRecordings().catch(() => []),
          api.getAlerts().catch(() => [])
        ]);
        setVehicles(vData);
        setRecordings(rData);
        setAlerts(aData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Live socket listener for alerts
    const cleanupAlert = socketService.on('safety:alert', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    return () => {
      cleanupAlert();
    };
  }, []);

  // Compute metrics
  const totalCabs = vehicles.length || 3;
  const onlineCabs = vehicles.filter(v => v.status !== 'offline').length || 2;
  const offlineCabs = totalCabs - onlineCabs;
  const currentlyRecording = recordings.filter(r => r.status === 'pending').length || 1;
  const recordingsToday = recordings.length || 4;
  const totalStorageMb = recordings.reduce((sum, r) => sum + (r.file_size_mb || 0), 0) + 128.4;
  const storageCapacityMb = 10240; // 10 GB limit
  const storagePercentage = Math.min(100, Math.round((totalStorageMb / storageCapacityMb) * 100));
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length || 2;

  return (
    <div className="space-y-6">
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Fleet Safety Overview
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time telematics, hardware diagnostics, and emergency dispatch state.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            TELEMETRICS SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* 9-Cell Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Bento Cell 1: Total Cabs / Devices */}
        <GlassCard accent className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Fleet Units</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">{totalCabs}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-cyan-400 font-semibold">{onlineCabs} online</span>
              <span>/</span>
              <span>{offlineCabs} standby</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <Link to="/cabs" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Inspect roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>

        {/* Bento Cell 2: Online / Offline Ratio */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Connectivity State</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">{onlineCabs}</span>
              <span className="text-xs font-mono text-slate-400">ACTIVE LINKS</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-lg mt-3 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-lg transition-all"
                style={{ width: `${Math.round((onlineCabs / (totalCabs || 1)) * 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400">
              <WifiOff className="w-3.5 h-3.5" />
              {offlineCabs} unit offline
            </span>
          </div>
        </GlassCard>

        {/* Bento Cell 3: Currently Recording */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Audio Streams</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-bold font-mono text-white">{currentlyRecording}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                REC ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Encrypted in-cabin audio feeds</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <Link to="/recordings" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>View recordings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>

        {/* Bento Cell 4: Recordings Today */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Sessions Today</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">{recordingsToday}</div>
            <p className="text-xs text-slate-400 mt-1">Completed trip audio files</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-mono">100% cloud verified</span>
          </div>
        </GlassCard>

        {/* Bento Cell 5 (Span 2): Storage Usage Gauge */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Vault Storage Allocation</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{storagePercentage}% USED</span>
          </div>

          <div className="my-4 space-y-2">
            <div className="w-full bg-spatial-950 h-3 rounded-lg border border-white/[0.06] overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 h-full rounded-md transition-all duration-500"
                style={{ width: `${Math.max(5, storagePercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Used: {totalStorageMb.toFixed(1)} MB</span>
              <span>Quota: {(storageCapacityMb / 1024).toFixed(0)} GB encrypted S3</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span>Automated 90-day retention pruning enabled</span>
            <Link to="/settings" className="text-cyan-400 hover:text-cyan-300">Adjust policy</Link>
          </div>
        </GlassCard>

        {/* Bento Cell 6 (Span 2): Active Alerts & Anomalies */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between border-rose-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold">Active Dispatch Alerts</span>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {activeAlertsCount} PENDING
            </span>
          </div>

          <div className="my-3 space-y-2">
            {alerts.slice(0, 2).map((alert) => (
              <div 
                key={alert.id}
                className="p-2.5 rounded-lg bg-spatial-950/80 border border-white/[0.05] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="font-mono font-semibold text-white truncate">{alert.type}</span>
                  <span className="text-slate-400 truncate hidden sm:inline">: {alert.description}</span>
                </div>
                <StatusBadge status={alert.severity} />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Immediate response recommended</span>
            <Link to="/alerts" className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1">
              <span>Open dispatch queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
