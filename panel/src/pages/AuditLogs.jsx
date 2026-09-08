import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Volume2, 
  Download, 
  Trash2, 
  LogIn, 
  ShieldCheck, 
  Search, 
  Filter,
  UserCheck
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { socketService } from '../services/socket';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 'AUD-8801',
      user: 'Chief Dispatcher (admin@safaride.com)',
      action: 'PLAY_AUDIO',
      resource_id: 'REC-2026-0902',
      details: 'Streamed in-cabin evidentiary audio session for Cab CAB-102',
      ip_address: '192.168.1.42',
      timestamp: '6 minutes ago',
      icon: Volume2
    },
    {
      id: 'AUD-8802',
      user: 'Rohan Sharma (Operator)',
      action: 'DOWNLOAD_AUDIO',
      resource_id: 'REC-2026-0901',
      details: 'Exported uncompressed WAV audio file with cryptographic checksum',
      ip_address: '10.0.4.18',
      timestamp: '15 minutes ago',
      icon: Download
    },
    {
      id: 'AUD-8803',
      user: 'Chief Dispatcher (admin@safaride.com)',
      action: 'DELETE_RECORDING',
      resource_id: 'REC-2026-0889',
      details: 'Permanently purged expired test audio from local cache per retention rule',
      ip_address: '192.168.1.42',
      timestamp: '1 hour ago',
      icon: Trash2
    },
    {
      id: 'AUD-8804',
      user: 'Kavita Iyer (Reviewer)',
      action: 'LOGIN_ACTIVITY',
      resource_id: 'AUTH_SESSION_44',
      details: 'Successful 2FA JWT credential validation from secure terminal',
      ip_address: '10.0.4.55',
      timestamp: '2 hours ago',
      icon: LogIn
    },
    {
      id: 'AUD-8805',
      user: 'External Audit Officer',
      action: 'POLICY_INSPECTION',
      resource_id: 'SYSTEM_SETTINGS',
      details: 'Verified compliance with 90-day automatic deletion schedule',
      ip_address: '172.16.0.9',
      timestamp: '5 hours ago',
      icon: ShieldCheck
    }
  ]);

  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Listen for real-time audit socket events
    const cleanup = socketService.on('audit:event', (audit) => {
      setLogs(prev => [
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          user: audit.user_name || 'Authorized Operator',
          action: audit.action || 'OPERATOR_ACTION',
          resource_id: audit.resource_id || 'GENERAL',
          details: `Action executed on ${audit.resource_type || 'system'} resource`,
          ip_address: 'Local Operator Terminal',
          timestamp: 'Just now',
          icon: audit.action.includes('PLAY') ? Volume2 : audit.action.includes('DOWNLOAD') ? Download : Trash2
        },
        ...prev
      ]);
    });

    return () => cleanup();
  }, []);

  const filtered = logs.filter(item => {
    if (filterAction !== 'ALL' && item.action !== filterAction) return false;
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.user.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      item.resource_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Immutable Audit Trail</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Tamper-evident chain of custody logging who listened, downloaded, or deleted any recording.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-spatial-900 border border-white/[0.08] rounded-lg p-1">
            {['ALL', 'PLAY_AUDIO', 'DOWNLOAD_AUDIO', 'DELETE_RECORDING'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  filterAction === act 
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {act.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search user, action or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-spatial-900 border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-spatial-950/90 border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Event ID</th>
                <th className="py-3.5 px-4 font-semibold">Action Verified</th>
                <th className="py-3.5 px-4 font-semibold">User Identity</th>
                <th className="py-3.5 px-4 font-semibold">Target Resource</th>
                <th className="py-3.5 px-4 font-semibold">Operational Description</th>
                <th className="py-3.5 px-4 font-semibold text-right">Timestamp / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((log) => {
                const Icon = log.icon || ScrollText;
                const isDelete = log.action === 'DELETE_RECORDING';
                const isDownload = log.action === 'DOWNLOAD_AUDIO';

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isDelete ? 'text-rose-400' : isDownload ? 'text-cyan-400' : 'text-emerald-400'}`} />
                        <span>{log.id}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        isDelete 
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40' 
                          : isDownload 
                            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' 
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-white font-medium">
                      {log.user}
                    </td>

                    <td className="py-4 px-4 text-cyan-400 font-semibold">
                      {log.resource_id}
                    </td>

                    <td className="py-4 px-4 text-slate-300 max-w-sm truncate">
                      {log.details}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-400">
                      <div>{log.timestamp}</div>
                      <div className="text-[10px] text-slate-500">{log.ip_address}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
