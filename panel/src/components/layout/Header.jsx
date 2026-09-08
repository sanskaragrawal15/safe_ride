import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, User, Bell } from 'lucide-react';
import { socketService } from '../../services/socket';

export const Header = ({ onQuickSos = null }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    socketService.connect();
    const cleanup = socketService.on('connection_change', (status) => {
      setSocketConnected(status);
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      cleanup();
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="h-16 liquid-glass border-b border-white/[0.08] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Telemetry Status Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-spatial-950/80 border border-white/[0.06] text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <span className="text-slate-400">TELEMETRY LINK:</span>
          <span className={socketConnected ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
            {socketConnected ? 'CONNECTED' : 'CONNECTING...'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>PORT: 3000 / WEBSOCKET</span>
        </div>
      </div>

      {/* Action and Profile Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden sm:block text-xs font-mono text-slate-300 px-3 py-1.5 rounded-lg bg-spatial-950/50 border border-white/[0.05]">
          {currentTime}
        </div>

        {/* Quick Emergency Test Trigger */}
        <button 
          onClick={onQuickSos}
          className="px-3.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:border-rose-400 transition-all text-xs font-mono font-medium flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(244,63,94,0.25)]"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>SIMULATE SOS</span>
        </button>

        {/* User Account / Role Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-white">Chief Dispatcher</div>
            <div className="text-[10px] font-mono text-cyan-400">SUPER ADMIN</div>
          </div>
        </div>
      </div>
    </header>
  );
};
