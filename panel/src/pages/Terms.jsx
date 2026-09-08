import React from 'react';
import { FileCheck, Shield, Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-cyan-400" />
            Terms and Conditions of Operation
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Standard operating agreement for fleet telematics, emergency capture, and evidentiary custody.
          </p>
        </div>
        <Link 
          to="/"
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>

      <GlassCard className="space-y-6 text-xs text-slate-300 font-sans leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            1. Regulatory Scope and Hardware Authorization
          </h2>
          <p>
            The SafeRide OS command panel, firmware modules, and associated telemetry sensors are deployed strictly for vehicle occupant protection, incident triage, and automated crash detection. Fleet operators, dispatchers, and vehicle owners accessing this system agree to maintain strict adherence to local vehicular transportation guidelines and wiretap/recording disclosure laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            2. Audio Evidentiary Custody
          </h2>
          <p>
            In-cabin audio recording is initiated solely based on configured safety triggers (such as severe deceleration exceeding 3.5G, manual passenger/driver panic switches, or route anomaly detection). All audio files are encrypted at rest using AES-256-GCM algorithms. Unlawful reproduction, extraction, or disclosure of raw audio recordings outside verified law enforcement or insurance subrogation proceedings is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            3. Automated Retention and Data Erasure
          </h2>
          <p>
            Pursuant to the default 90-day retention schedule, all telemetry logs and audio recordings not flagged for active dispute investigation will undergo cryptographic zeroization. Operators cannot recover permanently expunged audio segments once the deletion daemon executes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            4. Operator Auditability
          </h2>
          <p>
            Every instance of recording playback, export generation, or record modification is permanently registered to the immutable system audit ledger with user ID, IP address, and cryptographic timestamp. Misuse of access credentials constitutes immediate grounds for credential revocation.
          </p>
        </section>

        <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-slate-500">
          Last revised: September 2026 | SafeRide OS Operational Compliance Framework
        </div>
      </GlassCard>
    </div>
  );
};
