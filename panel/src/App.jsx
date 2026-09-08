import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CabsDevices } from './pages/CabsDevices';
import { Recordings } from './pages/Recordings';
import { LiveStatus } from './pages/LiveStatus';
import { TranscriptionAI } from './pages/TranscriptionAI';
import { Alerts } from './pages/Alerts';
import { Users } from './pages/Users';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cabs" element={<CabsDevices />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/live" element={<LiveStatus />} />
          <Route path="/transcription" element={<TranscriptionAI />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
