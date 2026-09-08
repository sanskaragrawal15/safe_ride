import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  Volume2, 
  Download, 
  Trash2, 
  UserPlus, 
  Check, 
  X,
  Key
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin Dispatcher',
      email: 'admin@safaride.com',
      role: 'Super Admin',
      status: 'active',
      last_active: 'Just now',
      can_listen: true,
      can_download: true,
      can_delete: true
    },
    {
      id: 2,
      name: 'Rohan Sharma',
      email: 'rohan.ops@safaride.com',
      role: 'Operator',
      status: 'active',
      last_active: '14 minutes ago',
      can_listen: true,
      can_download: true,
      can_delete: false
    },
    {
      id: 3,
      name: 'Kavita Iyer',
      email: 'kavita.review@safaride.com',
      role: 'Reviewer',
      status: 'active',
      last_active: '2 hours ago',
      can_listen: true,
      can_download: false,
      can_delete: false
    },
    {
      id: 4,
      name: 'External Audit Officer',
      email: 'compliance.auditor@fleetwatch.org',
      role: 'Read-only user',
      status: 'active',
      last_active: 'Yesterday',
      can_listen: false,
      can_download: false,
      can_delete: false
    }
  ]);

  const [toast, setToast] = useState(null);

  const togglePermission = (userId, perm) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (u.role === 'Super Admin' && perm === 'can_delete') {
          setToast('Super Admin requires full deletion authority.');
          setTimeout(() => setToast(null), 3000);
          return u;
        }
        const updated = { ...u, [perm]: !u[perm] };
        setToast(`Permission ${perm} updated for ${u.name}`);
        setTimeout(() => setToast(null), 3000);
        return updated;
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Users & Granular Permissions</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Access control enforcement governing who can listen, download, or expunge recorded evidence.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-all self-start sm:self-auto">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>Provision User</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          {toast}
        </div>
      )}

      {/* Role Access Hierarchy Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { role: 'Super Admin', desc: 'Full authority: Listen, download, expunge recordings, and manage IAM.', access: 'Unrestricted' },
          { role: 'Operator', desc: 'Operational triage: Listen and download evidence for live escalation.', access: 'Listen + Export' },
          { role: 'Reviewer', desc: 'Quality audit: Listen to sessions without export or deletion capabilities.', access: 'Listen Only' },
          { role: 'Read-only user', desc: 'Observer access: View dashboards, transcripts metadata only.', access: 'Metadata View' }
        ].map((tier) => (
          <GlassCard key={tier.role} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">{tier.role}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-cyan-400 border border-white/10">
                {tier.access}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{tier.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Active Accounts & Evidence Permission Matrix
          </span>
          <span className="text-xs font-mono text-slate-400">Click checkboxes to toggle permissions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-spatial-950/90 border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">User Identity</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
                <th className="py-3.5 px-4 font-semibold text-center">Listen Audio</th>
                <th className="py-3.5 px-4 font-semibold text-center">Download / Export</th>
                <th className="py-3.5 px-4 font-semibold text-center">Delete Recording</th>
                <th className="py-3.5 px-4 font-semibold text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={user.role} label={user.role} />
                  </td>

                  {/* Listen toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => togglePermission(user.id, 'can_listen')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.can_listen 
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Download toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => togglePermission(user.id, 'can_download')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.can_download 
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Delete toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => togglePermission(user.id, 'can_delete')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.can_delete 
                          ? 'bg-rose-950/60 border-rose-500/40 text-rose-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right text-slate-400">
                    {user.last_active}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
