import React, { useEffect, useState } from 'react';

const SuperAdminPanel = () => {
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);
  const [rejected, setRejected] = useState([]);

  const load = () => {
    setPending(JSON.parse(localStorage.getItem('admins_pending') || '[]'));
    setActive(JSON.parse(localStorage.getItem('admins_active') || '[]'));
    setRejected(JSON.parse(localStorage.getItem('admins_rejected') || '[]'));
  };

  useEffect(() => { load(); }, []);

  const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const approve = (email) => {
    const now = new Date().toISOString();
    const p = pending.filter(x => x.email !== email);
    const approved = pending.find(x => x.email === email);
    const a = [...active, { email, approvedAt: now, status: 'active', requestedAt: approved?.requestedAt }];
    save('admins_pending', p); setPending(p);
    save('admins_active', a); setActive(a);
  };

  const reject = (email) => {
    const now = new Date().toISOString();
    const p = pending.filter(x => x.email !== email);
    const r = [...rejected, { email, rejectedAt: now }];
    save('admins_pending', p); setPending(p);
    save('admins_rejected', r); setRejected(r);
  };

  const revoke = (email) => {
    const a = active.filter(x => x.email !== email);
    save('admins_active', a); setActive(a);
  };

  const toggleSuspend = (email) => {
    const a = active.map(x => x.email === email ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x);
    save('admins_active', a); setActive(a);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Super Admin</h1>
        <p className="text-gray-300">Approve or manage Admin accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <section className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">⏳ Pending Admin Requests</h2>
            <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-gray-200">Refresh</button>
          </div>
          {pending.length === 0 ? (
            <div className="text-gray-300 text-sm">No pending requests.</div>
          ) : (
            <div className="overflow-auto max-h-80">
              <table className="min-w-full text-sm text-gray-100">
                <thead className="bg-white/10">
                  <tr>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Requested At</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.email} className="border-b border-white/10">
                      <td className="p-2">{p.email}</td>
                      <td className="p-2">{p.requestedAt ? new Date(p.requestedAt).toLocaleString() : '-'}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => approve(p.email)} className="px-3 py-1 rounded-lg bg-emerald-600 text-white">Approve</button>
                        <button onClick={() => reject(p.email)} className="px-3 py-1 rounded-lg bg-rose-600 text-white">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Active Admins */}
        <section className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">🛡️ Active Admins</h2>
            <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-gray-200">Refresh</button>
          </div>
          {active.length === 0 ? (
            <div className="text-gray-300 text-sm">No active admins.</div>
          ) : (
            <div className="overflow-auto max-h-80">
              <table className="min-w-full text-sm text-gray-100">
                <thead className="bg-white/10">
                  <tr>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Approved At</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map((a) => (
                    <tr key={a.email} className="border-b border-white/10">
                      <td className="p-2">{a.email}</td>
                      <td className="p-2">{a.approvedAt ? new Date(a.approvedAt).toLocaleString() : '-'}</td>
                      <td className="p-2">{a.status}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => toggleSuspend(a.email)} className="px-3 py-1 rounded-lg bg-yellow-600 text-white">{a.status === 'active' ? 'Suspend' : 'Activate'}</button>
                        <button onClick={() => revoke(a.email)} className="px-3 py-1 rounded-lg bg-rose-600 text-white">Revoke</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Rejected (history) */}
      <section className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">🚫 Rejected Requests</h2>
          <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-gray-200">Refresh</button>
        </div>
        {rejected.length === 0 ? (
          <div className="text-gray-300 text-sm">No rejected requests.</div>
        ) : (
          <ul className="text-gray-300 list-disc ml-5">
            {rejected.map((r) => (
              <li key={r.email}>{r.email} — {r.rejectedAt ? new Date(r.rejectedAt).toLocaleString() : '-'}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SuperAdminPanel;
