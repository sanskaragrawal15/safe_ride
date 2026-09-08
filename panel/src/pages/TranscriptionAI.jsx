import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  User, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Volume2,
  Tag,
  Flame
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';

export const TranscriptionAI = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAggression, setFilterAggression] = useState(false);

  useEffect(() => {
    loadTranscripts();
  }, [filterAggression]);

  const loadTranscripts = async () => {
    try {
      const params = {};
      if (filterAggression) params.aggression = 'true';
      const data = await api.getTranscriptions(params);
      setTranscripts(data);
      if (data.length > 0 && !selectedTranscriptId) {
        setSelectedTranscriptId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load transcripts:', err);
    }
  };

  const selected = transcripts.find(t => t.id === selectedTranscriptId) || transcripts[0];

  const filteredTranscripts = transcripts.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.cab_number.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.dialogue.some(d => d.text.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Audio Transcription & Intelligence</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Speech-to-text diarization, speaker separation, keyword triggers, and aggression detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterAggression(!filterAggression)}
            className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              filterAggression 
                ? 'bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold' 
                : 'bg-spatial-900 border border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>AGGRESSION FILTER</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search inside conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-spatial-900 border border-white/[0.08] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Transcript Session Feed */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Recorded Sessions</h2>
          {filteredTranscripts.map((t) => (
            <GlassCard
              key={t.id}
              interactive
              onClick={() => setSelectedTranscriptId(t.id)}
              className={`p-4 transition-all ${
                selectedTranscriptId === t.id ? 'border-cyan-400/50 bg-cyan-950/20 shadow-glass-glow' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="font-mono text-xs font-bold text-white">{t.id}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.overall_sentiment} label={t.overall_sentiment} />
                  {t.aggression_detected && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      FLAGGED
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Cab: {t.cab_number}</span>
                  <span>Accuracy: {(t.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="mt-1.5 text-slate-300 text-xs line-clamp-2">{t.summary}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Right: Speaker Separation & Keyword Inspection */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            {/* Top Analysis Header */}
            <GlassCard accent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-white">{selected.id}</span>
                    <span className="text-xs text-slate-400 font-mono">({selected.recording_id})</span>
                    <StatusBadge status={selected.overall_sentiment} label={selected.overall_sentiment} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Cab: <span className="text-white">{selected.cab_number}</span> | Driver: <span className="text-white">{selected.driver_name}</span> | Model: Whisper Large-v3
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {selected.aggression_detected ? (
                    <div className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Elevated Aggression Index</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Civil Demeanor Confirmed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation Summary Box */}
              <div className="p-3.5 rounded-xl bg-spatial-950/80 border border-white/[0.05]">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Generated Conversation Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selected.summary}</p>
              </div>

              {/* Flagged Keywords Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" /> Flagged Events:
                </span>
                {selected.flagged_keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-spatial-950 border border-cyan-500/30 text-cyan-300">
                    {kw}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Diarized Speaker Separation Feed */}
            <GlassCard className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 pb-2 border-b border-white/[0.08]">
                Speaker Separation Diarization (Driver vs Passenger)
              </h3>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {selected.dialogue.map((line, idx) => {
                  const isDriver = line.speaker === 'Driver';
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 p-3 rounded-xl border ${
                        isDriver 
                          ? 'bg-spatial-950/70 border-cyan-500/20 mr-6' 
                          : 'bg-spatial-900/60 border-slate-700/60 ml-6'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                        isDriver 
                          ? 'bg-cyan-950/80 border border-cyan-400/40 text-cyan-400' 
                          : 'bg-slate-800 border border-slate-600 text-slate-300'
                      }`}>
                        {isDriver ? <Car className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                          <span className={`font-semibold ${isDriver ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {line.speaker}
                          </span>
                          <span className="text-slate-500">{line.time}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed">{line.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
