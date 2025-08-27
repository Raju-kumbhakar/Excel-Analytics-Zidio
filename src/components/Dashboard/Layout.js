import React, { useEffect, useState } from 'react';

const DashboardLayout = ({ /* title, actions, */ children }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [globalAlert, setGlobalAlert] = useState('');

  useEffect(() => {
    // Initial read
    try {
      setMaintenance(!!JSON.parse(localStorage.getItem('sys_maintenance') || 'false'));
      setGlobalAlert(JSON.parse(localStorage.getItem('sys_alert') || '""'));
    } catch {}

    // React to other tabs or settings page changes
    const onStorage = (e) => {
      if (e.key === 'sys_maintenance') {
        try { setMaintenance(!!JSON.parse(e.newValue || 'false')); } catch {}
      }
      if (e.key === 'sys_alert') {
        try { setGlobalAlert(JSON.parse(e.newValue || '""')); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6">
      {/* Global Alert Banner */}
      {globalAlert && (
        <div className="mb-4 rounded-xl border border-yellow-400/40 bg-yellow-500/20 text-yellow-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span>🔔</span>
            <span className="font-medium">{globalAlert}</span>
          </div>
        </div>
      )}

      {/* Maintenance Banner */}
      {maintenance && (
        <div className="mb-4 rounded-xl border border-red-400/40 bg-red-600/20 text-red-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span>🛠️</span>
            <span className="font-semibold">Maintenance mode is ON. Some actions (like uploads) are temporarily disabled.</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default DashboardLayout;
