import React from 'react';

export const StatusBadge = ({ status, pulse = false, label = null }) => {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotColor = 'bg-slate-400';

  if (norm === 'online' || norm === 'active' || norm === 'uploaded' || norm === 'success') {
    styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (norm === 'recording' || norm === 'critical' || norm === 'failed' || norm === 'emergency' || norm === 'dispute') {
    styles = 'bg-rose-950/60 text-rose-300 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (norm === 'pending' || norm === 'medium' || norm === 'idle' || norm === 'tense' || norm === 'warning') {
    styles = 'bg-amber-950/60 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (norm === 'offline') {
    styles = 'bg-slate-900/80 text-slate-400 border-slate-700/50';
    dotColor = 'bg-slate-500';
  } else if (norm === 'in_trip') {
    styles = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
    dotColor = 'bg-cyan-400';
  }

  const displayText = label || status?.toUpperCase() || 'UNKNOWN';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md border tracking-wide ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`} />
      {displayText}
    </span>
  );
};
