import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { api } from '../../services/api';

export const MainLayout = () => {
  const [globalBanner, setGlobalBanner] = useState(null);

  const handleQuickSos = async () => {
    try {
      const alert = await api.createAlert({
        user_id: 1,
        type: 'SOS_EMERGENCY',
        severity: 'CRITICAL',
        description: 'Manual SOS alert triggered from Operator Command Header',
        location: '28.6139, 77.2090'
      });
      setGlobalBanner(`CRITICAL SOS BROADCAST: Alert #${alert.id} propagated to all response units.`);
      setTimeout(() => setGlobalBanner(null), 6000);
    } catch (err) {
      console.error('Failed to trigger quick SOS:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-spatial-950 text-slate-100 spatial-bg-grid">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onQuickSos={handleQuickSos} />
        
        {globalBanner && (
          <div className="bg-rose-950/90 border-b border-rose-500/50 px-6 py-2.5 text-xs font-mono text-rose-200 flex items-center justify-between animate-pulse">
            <span className="font-semibold">{globalBanner}</span>
            <button 
              onClick={() => setGlobalBanner(null)}
              className="text-rose-400 hover:text-white font-bold ml-4"
            >
              DISMISS
            </button>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
