import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Mic, 
  Radio, 
  FileText, 
  AlertTriangle, 
  Users, 
  ScrollText, 
  Sliders, 
  Shield, 
  FileCheck,
  Cpu
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Cab & Devices', path: '/cabs', icon: Car },
    { label: 'Recordings', path: '/recordings', icon: Mic },
    { label: 'Live Status', path: '/live', icon: Radio },
    { label: 'Transcription AI', path: '/transcription', icon: FileText },
    { label: 'Alerts Dispatch', path: '/alerts', icon: AlertTriangle, badge: '2' },
    { label: 'Users & Roles', path: '/users', icon: Users },
    { label: 'Audit Logs', path: '/audit', icon: ScrollText },
    { label: 'Settings', path: '/settings', icon: Sliders },
  ];

  const complianceItems = [
    { label: 'Terms & Conditions', path: '/terms', icon: FileCheck },
    { label: 'Privacy Policy', path: '/privacy', icon: Shield },
  ];

  return (
    <aside className="w-64 liquid-glass border-r border-white/[0.08] flex flex-col shrink-0 h-screen sticky top-0 z-30">
      {/* Brand Identity */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.08] gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-glass-glow">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
            <span>SAFERIDE</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">OS</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight">FLEET SAFETY CONTROL</p>
        </div>
      </div>

      {/* Primary Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_-3px_rgba(0,229,255,0.2)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Compliance & Legal
        </div>
        {complianceItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* System Status Footbar */}
      <div className="p-4 border-t border-white/[0.08] bg-spatial-950/40">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Firmware Cluster</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            v0.4.2-BLE
          </span>
        </div>
      </div>
    </aside>
  );
};
