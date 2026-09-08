import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download, X, RotateCcw, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge } from '../ui/StatusBadge';

export const AudioPlayerModal = ({ recording, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording?.duration_seconds || 120);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [exportNotice, setExportNotice] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Notify audit trail on audio load/listening
    if (recording?.id) {
      api.request(`/api/recordings/${recording.id}/stream?user=Operator_Panel`).catch(() => {});
    }
  }, [recording?.id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log('Audio autoplay prevented:', err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  };

  const handleExport = async () => {
    try {
      const res = await api.exportRecording(recording.id, 'Operator_Console');
      setExportNotice('Export authorized. Security audit logged to ledger.');
      setTimeout(() => setExportNotice(null), 4000);
      if (res.download_url) {
        window.open(res.download_url, '_blank');
      }
    } catch (err) {
      setExportNotice('Export restricted by access policy.');
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!recording) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl liquid-glass border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-white tracking-wide">{recording.id}</span>
                <StatusBadge status={recording.status} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Cab: {recording.cab_number} | Driver: {recording.driver_name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden native audio element */}
        <audio 
          ref={audioRef}
          src={recording.audio_sample_url || 'https://actions.google.com/sounds/v1/ambiences/car_interior.ogg'}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || recording.duration_seconds || 120)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Dynamic Waveform Visualizer */}
        <div className="my-6 p-4 rounded-xl bg-spatial-950/80 border border-white/[0.05] flex items-center justify-center gap-1 h-24 overflow-hidden">
          {Array.from({ length: 42 }).map((_, idx) => {
            const heightMultiplier = Math.sin((idx / 42) * Math.PI) * (isPlaying ? 0.3 + (idx % 5) * 0.15 : 0.2);
            const isActive = (currentTime / (duration || 1)) > (idx / 42);
            return (
              <div 
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.6)]' : 'bg-slate-700/60'
                }`}
                style={{ height: `${Math.max(12, Math.floor(heightMultiplier * 75))}px` }}
              />
            );
          })}
        </div>

        {/* Scrubber & Timers */}
        <div className="space-y-1">
          <input 
            type="range"
            min="0"
            max={duration || 120}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}
              title="Restart"
              className="p-2.5 rounded-lg border border-white/10 hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all font-mono text-sm font-semibold flex items-center gap-2 shadow-glass-glow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <button 
              onClick={toggleRate}
              className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/[0.05] font-mono text-xs text-slate-300 transition-all"
            >
              {playbackRate}x
            </button>
          </div>

          <button 
            onClick={handleExport}
            className="px-4 py-2.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 hover:bg-white/[0.05] text-slate-200 text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Export Evidence
          </button>
        </div>

        {/* Export Notification / Compliance Footer */}
        {exportNotice && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
