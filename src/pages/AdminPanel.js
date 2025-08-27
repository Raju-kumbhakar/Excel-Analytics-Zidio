import React, { useEffect, useMemo, useState } from 'react';
import SmartScheduling from '../components/SmartScheduling';

const features = [
  { key: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
  { key: 'users', label: 'User Management', icon: '👥' },
  { key: 'uploads', label: 'File Uploads & Usage', icon: '📁' },
  { key: 'analytics', label: 'Chart Analytics', icon: '📊' },
  { key: 'settings', label: 'System Settings', icon: '⚙️' },
  { key: 'support', label: 'Support & Feedback', icon: '💬' },
  { key: 'other', label: 'Other', icon: '📊' },
];

// Utility helpers
const readJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
};
const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B','KB','MB','GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
const extOf = (name = '') => {
  const m = name.match(/\.([a-zA-Z0-9]+)$/); return m ? m[1].toLowerCase() : '';
};

const DashboardSection = () => {
  const uploads = readJSON('upload_history', '[]');
  const feedbacks = readJSON('feedbacks', '[]');
  const adminsActive = readJSON('admins_active', '[]');
  const adminsPending = readJSON('admins_pending', '[]');
  const adminsRejected = readJSON('admins_rejected', '[]');

  const userEmails = new Set([
    ...uploads.map(u => u.user).filter(Boolean),
    ...feedbacks.map(f => f.user).filter(Boolean),
    ...adminsActive.map(a => a.email),
    ...adminsPending.map(a => a.email),
    ...adminsRejected.map(a => a.email),
    JSON.parse(localStorage.getItem('user') || 'null')?.email,
  ].filter(Boolean));

  const totalUsers = userEmails.size;
  const totalFiles = uploads.length;
  const now = Date.now();
  const active24h = new Set(uploads.filter(u => u.timestamp && (now - new Date(u.timestamp).getTime()) <= 24*60*60*1000).map(u => u.user)).size;
  const typeCount = uploads.reduce((acc, u) => { const t = extOf(u.name || u.fileName); if (t) acc[t]=(acc[t]||0)+1; return acc; }, {});
  const mostType = Object.entries(typeCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <span className="text-4xl">👥</span>
        <div className="text-2xl font-bold text-white mt-2">{totalUsers}</div>
        <div className="text-gray-300">Total Users</div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <span className="text-4xl">📁</span>
        <div className="text-2xl font-bold text-white mt-2">{totalFiles}</div>
        <div className="text-gray-300">Total Files Processed</div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <span className="text-4xl">📄</span>
        <div className="text-2xl font-bold text-white mt-2">{mostType}</div>
        <div className="text-gray-300">Most Uploaded File Type</div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <span className="text-4xl">⏳</span>
        <div className="text-2xl font-bold text-white mt-2">{active24h}</div>
        <div className="text-gray-300">Active Users (24h)</div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center md:col-span-2">
        <span className="text-4xl">🛠️</span>
        <div className="text-2xl font-bold text-white mt-2">Uploads: {totalFiles} | Feedback: {feedbacks.length}</div>
        <div className="text-gray-300">Activity Summary</div>
      </div>
    </div>
  );
};

const UserManagementSection = () => {
  const uploads = readJSON('upload_history', '[]');
  const feedbacks = readJSON('feedbacks', '[]');
  const adminsActive = readJSON('admins_active', '[]');
  const adminsPending = readJSON('admins_pending', '[]');
  const flags = readJSON('user_admin_flags', '{}'); // { [email]: { active, spam } }

  const users = useMemo(() => {
    const emails = new Set([
      ...uploads.map(u=>u.user).filter(Boolean),
      ...feedbacks.map(f=>f.user).filter(Boolean),
      ...adminsActive.map(a=>a.email),
      ...adminsPending.map(a=>a.email),
      JSON.parse(localStorage.getItem('user') || 'null')?.email,
    ].filter(Boolean));
    return Array.from(emails).map((email, idx) => {
      const lastUploadTs = uploads.filter(u=>u.user===email).map(u=>u.timestamp).filter(Boolean).sort().slice(-1)[0];
      const isAdmin = adminsActive.some(a=>a.email===email) || adminsPending.some(a=>a.email===email);
      const role = isAdmin ? 'admin' : 'user';
      const f = flags[email] || { active: true, spam: false };
      return { id: idx+1, email, active: f.active, spam: f.spam, role, lastActive: lastUploadTs };
    });
  }, [uploads, feedbacks, adminsActive, adminsPending, flags]);

  const setFlags = (next) => localStorage.setItem('user_admin_flags', JSON.stringify(next));
  const toggleActive = (email) => { const next = { ...flags, [email]: { ...(flags[email]||{}), active: !(flags[email]?.active ?? true) } }; setFlags(next); };
  const toggleSpam = (email) => { const next = { ...flags, [email]: { ...(flags[email]||{}), spam: !(flags[email]?.spam ?? false) } }; setFlags(next); };
  const deleteUser = (email) => { const next = { ...flags }; delete next[email]; setFlags(next); };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-gray-200">
        <thead>
          <tr className="bg-white/10">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Last Active</th>
            <th className="px-4 py-2">Active</th>
            <th className="px-4 py-2">Spam</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-white/10">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 uppercase">{u.role}</td>
              <td className="px-4 py-2">{u.lastActive ? new Date(u.lastActive).toLocaleString() : '-'}</td>
              <td className="px-4 py-2">
                <button onClick={() => toggleActive(u.email)} className={`px-3 py-1 rounded-lg font-bold ${u.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>{u.active ? 'Enabled' : 'Disabled'}</button>
              </td>
              <td className="px-4 py-2"><button onClick={() => toggleSpam(u.email)} className={`px-3 py-1 rounded-lg ${u.spam ? 'bg-yellow-600 text-white' : 'bg-white/10 text-gray-200'}`}>{u.spam ? 'Marked' : 'Mark'}</button></td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => deleteUser(u.email)} className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold">Delete Flag</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FileUploadsSection = () => {
  const uploads = readJSON('upload_history', '[]');
  const grouped = uploads.reduce((acc, u) => {
    const email = u.user || 'Unknown';
    acc[email] = acc[email] || { files: 0, totalSize: 0, types: {} };
    acc[email].files += 1;
    acc[email].totalSize += (u.size || 0);
    const t = extOf(u.name || u.fileName);
    if (t) acc[email].types[t] = (acc[email].types[t] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(grouped).map(([email, v]) => ({
    email,
    files: v.files,
    type: Object.entries(v.types).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-',
    size: formatBytes(v.totalSize),
    charts: 0,
  }));
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-gray-200">
        <thead>
          <tr className="bg-white/10">
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Files Uploaded</th>
            <th className="px-4 py-2">Top File Type</th>
            <th className="px-4 py-2">Total Size</th>
            <th className="px-4 py-2">Charts Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f, i) => (
            <tr key={i} className="border-b border-white/10">
              <td className="px-4 py-2">{f.email}</td>
              <td className="px-4 py-2">{f.files}</td>
              <td className="px-4 py-2">{f.type}</td>
              <td className="px-4 py-2">{f.size}</td>
              <td className="px-4 py-2">{f.charts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ChartAnalyticsSection = () => {
  // No chart events stored yet; reflect file-type usage as proxy
  const uploads = readJSON('upload_history', '[]');
  const typeCount = uploads.reduce((acc, u) => { const t = extOf(u.name || u.fileName); if (t) acc[t]=(acc[t]||0)+1; return acc; }, {});
  const types = Object.entries(typeCount).map(([type, count]) => ({ type, count }));
  const success = uploads.length; const failure = 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {types.map((c, i) => (
        <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
          <span className="text-4xl">📊</span>
          <div className="text-2xl font-bold text-white mt-2">{c.type.toUpperCase()}</div>
          <div className="text-gray-300">Uploaded {c.count} times</div>
        </div>
      ))}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center md:col-span-3">
        <span className="text-4xl">📝</span>
        <div className="text-2xl font-bold text-white mt-2">Success: {success} | Failure: {failure}</div>
        <div className="text-gray-300">Upload Processing Status</div>
      </div>
    </div>
  );
};

const SystemSettingsSection = () => {
  const [maintenance, setMaintenance] = useState(() => !!readJSON('sys_maintenance', 'false'));
  const [maintenanceUntil, setMaintenanceUntil] = useState(() => readJSON('sys_maintenance_until', 'null'));
  const [hours, setHours] = useState(2);
  const [alert, setAlert] = useState(() => readJSON('sys_alert', '""'));
  const [uploadLimit, setUploadLimit] = useState(() => readJSON('sys_upload_limit', '5'));
  const [showSmartScheduling, setShowSmartScheduling] = useState(false);

  useEffect(() => { localStorage.setItem('sys_maintenance', JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { if (maintenanceUntil === null) { localStorage.removeItem('sys_maintenance_until'); } else { localStorage.setItem('sys_maintenance_until', JSON.stringify(maintenanceUntil)); } }, [maintenanceUntil]);
  useEffect(() => { localStorage.setItem('sys_alert', JSON.stringify(alert)); }, [alert]);
  useEffect(() => { localStorage.setItem('sys_upload_limit', JSON.stringify(Number(uploadLimit) || 0)); }, [uploadLimit]);

  const startMaintenanceForHours = () => {
    const h = Number(hours) || 0;
    const until = Date.now() + h * 60 * 60 * 1000;
    setMaintenance(true);
    setMaintenanceUntil(until);
    try { localStorage.setItem('sys_maintenance_started', JSON.stringify(Date.now())); } catch {}
  };

  const stopMaintenanceNow = () => {
    setMaintenance(false);
    setMaintenanceUntil(null);
    try { localStorage.removeItem('sys_maintenance_started'); } catch {}
  };

  const handleSmartSchedule = (scheduledTime, duration) => {
    const until = scheduledTime.getTime() + duration * 60 * 60 * 1000;
    setMaintenance(true);
    setMaintenanceUntil(until);
    try { 
      localStorage.setItem('sys_maintenance_started', JSON.stringify(scheduledTime.getTime())); 
    } catch {}
    setShowSmartScheduling(false);
  };

  const remainingStr = (() => {
    if (!maintenanceUntil) return '-';
    const ms = Math.max(0, maintenanceUntil - Date.now());
    const DAY = 24*60*60*1000, HOUR = 60*60*1000, MIN = 60*1000;
    const days = Math.floor(ms / DAY);
    const hoursLeft = Math.floor((ms % DAY) / HOUR);
    const minutesLeft = Math.floor((ms % HOUR) / MIN);
    const end = new Date(maintenanceUntil).toLocaleString();
    return `${days}d ${hoursLeft}h ${minutesLeft}m (until ${end})`;
  })();

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-2xl">⚙️</span>
          <span className="text-white font-bold">Maintenance Mode</span>
          <button onClick={() => setMaintenance(m => !m)} className={`ml-auto px-4 py-2 rounded-lg font-bold ${maintenance ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>{maintenance ? 'ON' : 'OFF'}</button>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="col-span-1 md:col-span-1">
            <label className="block text-xs text-gray-300 mb-1">Schedule (hours)</label>
            <input type="number" min="1" value={hours} onChange={e=>setHours(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={startMaintenanceForHours} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold">Start for {hours}h</button>
            <button onClick={stopMaintenanceNow} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-200">Stop Now</button>
          </div>
          <div className="text-sm text-gray-300 md:text-right">{maintenanceUntil ? `Scheduled: ${remainingStr}` : 'No schedule set'}</div>
        </div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔔</span>
          <span className="text-white font-bold">Global Alert/Notice</span>
          <input value={alert} onChange={e => setAlert(e.target.value)} placeholder="e.g. Server down for upgrade" className="ml-auto px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400" />
        </div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-2xl">📤</span>
          <span className="text-white font-bold">Upload Limit (MB)</span>
          <input type="number" value={uploadLimit} onChange={e => setUploadLimit(e.target.value)} className="ml-auto px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 w-24" />
        </div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-2">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl">📆</span>
          <span className="text-white font-bold">Version Control & Changelog</span>
        </div>
        <div className="text-gray-300 ml-10">Package version is managed in package.json</div>
      </div>
    </div>
  );
};

const SupportSection = () => {
  const [expanded, setExpanded] = useState(-1);
  const feedbacks = readJSON('feedbacks', '[]');
  const summary = feedbacks.reduce((acc, f) => { acc[f.type] = (acc[f.type]||0)+1; return acc; }, {});
  const top = Object.entries(summary).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-gray-200">
          <thead>
            <tr className="bg-white/10">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, idx) => (
              <React.Fragment key={idx}>
                <tr className="border-b border-white/10">
                  <td className="px-4 py-2">{f.user}</td>
                  <td className="px-4 py-2 capitalize">{f.type}</td>
                  <td className="px-4 py-2">{f.title}</td>
                  <td className="px-4 py-2">{f.date ? new Date(f.date).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setExpanded(expanded === idx ? -1 : idx)} className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20">
                      {expanded === idx ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded === idx && (
                  <tr className="bg-white/5 border-b border-white/10">
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Description</div>
                          <div className="text-gray-100 whitespace-pre-wrap">{f.desc || '-'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-gray-400">Priority</div>
                            <div className="text-gray-100 capitalize">{f.priority || '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Rating</div>
                            <div className="text-gray-100">{typeof f.rating === 'number' && f.rating > 0 ? `${f.rating} / 5` : '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Email</div>
                            <div className="text-gray-100">{f.email || '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Status</div>
                            <div className="text-gray-100">{f.status || '-'}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Screenshot</div>
                          <div className="text-gray-100">{f.screenshot || '—'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
        <span className="text-2xl">📊</span>
        <div className="text-2xl font-bold text-white mt-2">Top Type: {top}</div>
        <div className="text-gray-300">Feedback Analytics</div>
      </div>
    </div>
  );
};

const OtherSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <span className="text-4xl">📊</span>
      <div className="text-2xl font-bold text-white mt-2">Heatmap (Stub)</div>
      <div className="text-gray-300">Peak usage hours visualization</div>
    </div>
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <span className="text-4xl">🔌</span>
      <div className="text-2xl font-bold text-white mt-2">Plugin System (Stub)</div>
      <div className="text-gray-300">Add new chart types in the future</div>
    </div>
  </div>
);

const sectionComponents = {
  dashboard: DashboardSection,
  users: UserManagementSection,
  uploads: FileUploadsSection,
  analytics: ChartAnalyticsSection,
  settings: SystemSettingsSection,
  support: SupportSection,
  other: OtherSection,
};

const AdminPanel = () => {
  const [selected, setSelected] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const Section = sectionComponents[selected];
  const current = features.find(f => f.key === selected) || features[0];

  return (
    <div className="min-h-screen bg-transparent flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-72'} transition-all duration-300 min-h-screen p-4 bg-white/10 border-r border-white/15 backdrop-blur-xl flex flex-col gap-4 shadow-2xl`}
             aria-label="Sidebar">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xl font-extrabold text-white tracking-wide ${collapsed ? 'sr-only' : ''}`}>Admin Panel</span>
          <button
            className="ml-auto px-2 py-1 rounded-md bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20"
            onClick={() => setCollapsed(v => !v)}
            aria-label="Toggle sidebar"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {features.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelected(f.key)}
              title={f.label}
              className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 border border-transparent hover:border-blue-500 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected === f.key ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg border-blue-500' : 'text-gray-200'}`}
            >
              <span className="text-2xl">{f.icon}</span>
              {!collapsed && <span className="font-medium">{f.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="px-6 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider text-emerald-300/80">Admin</div>
              <div className="text-2xl font-bold text-white truncate">{current.label}</div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <input
                type="search"
                placeholder="Search settings, users..."
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 w-64"
              />
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">⚙️</div>
            </div>
          </div>
        </header>

        {/* Section container */}
        <section className="p-6">
          <div className="w-full max-w-6xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/15 rounded-3xl shadow-2xl p-8">
            <Section />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel; 