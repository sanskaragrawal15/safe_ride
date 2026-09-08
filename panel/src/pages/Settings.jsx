import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  HardDrive, 
  Clock, 
  Bell, 
  Cpu, 
  Save, 
  ShieldCheck, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { api } from '../services/api';

export const Settings = () => {
  const [settings, setSettings] = useState({
    retention_days: 90,
    auto_deletion_enabled: true,
    storage_provider: 'AWS_S3_VAULT',
    bucket_name: 'safaride-secure-telemetry-ap-south',
    encryption_standard: 'AES-256-GCM',
    notifications: {
      webhook_enabled: true,
      webhook_url: 'https://dispatch.safaride.internal/alerts/webhook',
      email_alerts: true,
      alert_recipients: 'emergency-ops@safaride.com',
      sms_emergency_escalation: true
    },
    device_configuration: {
      heartbeat_interval_seconds: 15,
      gps_sample_rate_hz: 1,
      audio_compression: 'OPUS_16KHZ_MONO',
      tamper_sensitivity: 'HIGH',
      speed_threshold_kmh: 80,
      impact_threshold_g: 3.5
    }
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    api.getSettings()
      .then(data => { if (data) setSettings(data); })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSuccessMsg('Operational settings and device thresholds successfully committed.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Configuration</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Retention rules, cloud storage security, notification endpoints, and IoT device parameters.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-glass-glow self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-cyan-400" />
          <span>{saving ? 'COMMITTING...' : 'COMMIT CHANGES'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Retention & Auto-Deletion */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono text-white">Data Retention & Expungement</h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Retention Window (Days)</label>
              <input 
                type="number" 
                value={settings.retention_days}
                onChange={(e) => setSettings({ ...settings, retention_days: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-sans">
                Audio recordings older than this period are automatically scheduled for permanent erasure.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">Automatic Deletion Daemon</span>
                <span className="text-[11px] text-slate-400 font-sans block">Runs nightly at 02:00 UTC to scrub expired audio partitions</span>
              </div>
              <input 
                type="checkbox"
                checked={settings.auto_deletion_enabled}
                onChange={(e) => setSettings({ ...settings, auto_deletion_enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Cloud Storage Configuration */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold font-mono text-white">Cloud Vault & Cryptography</h2>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Storage Provider</label>
              <input 
                type="text" 
                value={settings.storage_provider}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-spatial-950/80 border border-white/[0.05] text-slate-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Primary S3 Bucket Endpoint</label>
              <input 
                type="text" 
                value={settings.bucket_name}
                onChange={(e) => setSettings({ ...settings, bucket_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">At-Rest Cryptographic Standard</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-spatial-950/80 border border-white/[0.05] text-emerald-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings.encryption_standard} (FIPS 140-2 Validated)</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 3: Notification & Webhook Endpoints */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold font-mono text-white">Emergency Notification Channels</h2>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Dispatch Webhook URL</label>
              <input 
                type="text" 
                value={settings.notifications.webhook_url}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, webhook_url: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Critical Escalation Email</label>
              <input 
                type="email" 
                value={settings.notifications.alert_recipients}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, alert_recipients: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-spatial-950/60 border border-white/[0.04]">
              <div>
                <span className="text-white font-medium block">SMS Priority Gateway</span>
                <span className="text-[11px] text-slate-400 font-sans block">Direct carrier SMS dispatch upon SOS button depression</span>
              </div>
              <input 
                type="checkbox"
                checked={settings.notifications.sms_emergency_escalation}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, sms_emergency_escalation: e.target.checked }
                })}
                className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Section 4: Device Configuration */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono text-white">Hardware Telemetry Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Heartbeat Interval (s)</label>
              <input 
                type="number" 
                value={settings.device_configuration.heartbeat_interval_seconds}
                onChange={(e) => setSettings({
                  ...settings,
                  device_configuration: { ...settings.device_configuration, heartbeat_interval_seconds: parseInt(e.target.value) || 15 }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Speed Limit (km/h)</label>
              <input 
                type="number" 
                value={settings.device_configuration.speed_threshold_kmh}
                onChange={(e) => setSettings({
                  ...settings,
                  device_configuration: { ...settings.device_configuration, speed_threshold_kmh: parseInt(e.target.value) || 80 }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tamper Sensitivity</label>
              <select
                value={settings.device_configuration.tamper_sensitivity}
                onChange={(e) => setSettings({
                  ...settings,
                  device_configuration: { ...settings.device_configuration, tamper_sensitivity: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="LOW">LOW (Tolerant)</option>
                <option value="MEDIUM">MEDIUM (Standard)</option>
                <option value="HIGH">HIGH (Immediate Trigger)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Impact Threshold (G)</label>
              <input 
                type="number" 
                step="0.1"
                value={settings.device_configuration.impact_threshold_g}
                onChange={(e) => setSettings({
                  ...settings,
                  device_configuration: { ...settings.device_configuration, impact_threshold_g: parseFloat(e.target.value) || 3.5 }
                })}
                className="w-full px-3 py-2 rounded-lg bg-spatial-950 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </GlassCard>

      </div>
    </form>
  );
};
