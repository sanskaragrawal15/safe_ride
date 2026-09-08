import React from 'react';
import { Shield, Lock, EyeOff, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-emerald-400" />
            Passenger & Driver Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Data governance, biometric minimization, cryptographic protections, and transparency rights.
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
            <Lock className="w-4 h-4 text-cyan-400" />
            1. Consent and Audio Notification Protocols
          </h2>
          <p>
            SafeRide OS prioritizes full transparency inside passenger vehicles. In-cabin safety recording is paired with visible optical indicators (illuminated green LED ring) and audible notification chimes indicating active session recording. Continuous recording without an active trip or safety trigger is prohibited by firmware design.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            2. Biometric and Personally Identifiable Information (PII)
          </h2>
          <p>
            Audio streams processed through the speech-to-text inference engine undergo automatic PII redaction. Credit card numbers, personal telephone numbers, and home addresses detected within passenger audio are scrubbed prior to long-term cloud transcript indexing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            3. Data Sharing and Third-Party Disclosure
          </h2>
          <p>
            Telemetry datasets, GPS coordinates, and raw audio are never monetized, traded, or shared with commercial marketing networks. Data is transferred strictly to accredited emergency services (911/112 dispatchers) in the event of an active vehicular collision or violent altercation signal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            4. Subject Access and Deletion Requests
          </h2>
          <p>
            Passengers and drivers retain the right to query trip data records associated with their registered identifier. Requests for expedited data expungement can be submitted directly through the verified support channel, subject to statutory insurance dispute holds.
          </p>
        </section>

        <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-slate-500">
          Compliant with ISO 27001, GDPR Article 13/14, and automotive safety telemetry guidelines.
        </div>
      </GlassCard>
    </div>
  );
};
