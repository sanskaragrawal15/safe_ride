import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Play, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AudioPlayerModal } from '../components/audio/AudioPlayerModal';
import { api } from '../services/api';

export const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activePlayerRecording, setActivePlayerRecording] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadRecordings();
  }, [statusFilter]);

  const loadRecordings = async () => {
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const data = await api.getRecordings(params);
      setRecordings(data);
    } catch (err) {
      console.error('Failed to load recordings:', err);
    }
  };

  const handleExport = async (rec) => {
    try {
      const res = await api.exportRecording(rec.id, 'Operator_Console');
      setToastMessage(`Export authorized for ${rec.id}. Download logged to security ledger.`);
      setTimeout(() => setToastMessage(null), 4000);
      if (res.download_url) {
        window.open(res.download_url, '_blank');
      }
    } catch (err) {
      setToastMessage('Export access denied by security policy.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleDelete = async (recId) => {
    if (!window.confirm(`Confirm deletion of evidence file ${recId}? Audit log will be generated.`)) return;
    try {
      await api.deleteRecording(recId, 'Super Admin');
      setRecordings(prev => prev.filter(r => r.id !== recId));
      setToastMessage(`Evidence ${recId} permanently expunged. Audit ledger updated.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to delete recording:', err);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'In Progress...';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const filtered = recordings.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.cab_number.toLowerCase().includes(q) ||
      r.driver_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Recording Management</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Trip audio sessions, evidentiary vault status, and verified chain-of-custody playback.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-spatial-900 border border-white/[0.08] rounded-lg p-1">
            {['ALL', 'UPLOADED', 'PENDING', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  statusFilter === st 
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by cab, driver, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-spatial-900 border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Table / Cards Container */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-spatial-950/90 border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Recording ID</th>
                <th className="py-3.5 px-4 font-semibold">Cab / Device</th>
                <th className="py-3.5 px-4 font-semibold">Driver Details</th>
                <th className="py-3.5 px-4 font-semibold">Start - End Time</th>
                <th className="py-3.5 px-4 font-semibold">Duration</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{rec.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div className="font-semibold text-white">{rec.cab_number}</div>
                    <div className="text-[11px] text-slate-400">{rec.device_id}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div>{rec.driver_name}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div>{formatTimestamp(rec.start_time)} - {formatTimestamp(rec.end_time)}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {formatDuration(rec.duration_seconds)}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rec.status === 'uploaded' ? (
                        <button
                          onClick={() => setActivePlayerRecording(rec)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1.5 transition-all text-xs font-medium"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Unavailable</span>
                      )}

                      <button
                        onClick={() => handleExport(rec)}
                        title="Download / Export"
                        className="p-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(rec.id)}
                        title="Delete with audit"
                        className="p-1.5 rounded-lg border border-slate-700 hover:border-rose-500/40 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Audio Playback Modal */}
      {activePlayerRecording && (
        <AudioPlayerModal 
          recording={activePlayerRecording} 
          onClose={() => setActivePlayerRecording(null)} 
        />
      )}
    </div>
  );
};
