import React, { useEffect, useState } from 'react';

const AwaitingApproval = () => {
  const [status, setStatus] = useState('pending'); // pending | active | rejected
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      try {
        const act = JSON.parse(localStorage.getItem('admins_active') || '[]');
        const rej = JSON.parse(localStorage.getItem('admins_rejected') || '[]');
        if (act.find(a => a.email === user.email)) {
          setStatus('active');
          // upgrade local user status
          localStorage.setItem('user', JSON.stringify({ ...user, status: 'active' }));
        } else if (rej.find(r => r.email === user.email)) {
          setStatus('rejected');
        } else {
          setStatus('pending');
        }
      } catch {
        // ignore
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [user]);

  const goHome = () => { window.location.href = '/'; };
  const goAdmin = () => { window.location.href = '/admin'; };

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
      <div className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 backdrop-blur-xl p-8 shadow-2xl text-center">
        {status === 'pending' && (
          <>
            <div className="text-3xl mb-3">⏳</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Awaiting Super Admin Approval</h1>
            <p className="text-gray-200 mb-4">Your admin access request has been submitted. You will be granted access once a Super Admin approves your account.</p>
            <div className="text-gray-300 text-sm">This page auto-refreshes every few seconds.</div>
          </>
        )}
        {status === 'active' && (
          <>
            <div className="text-3xl mb-3">✅</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">You're Approved!</h1>
            <p className="text-gray-200 mb-6">Your admin access is now active.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={goAdmin} className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold">Go to Admin Panel</button>
              <button onClick={goHome} className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-white">Home</button>
            </div>
          </>
        )}
        {status === 'rejected' && (
          <>
            <div className="text-3xl mb-3">🚫</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Request Rejected</h1>
            <p className="text-gray-200 mb-6">Your admin request was rejected by Super Admin. Contact support if you think this is a mistake.</p>
            <button onClick={goHome} className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-white">Back to Home</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AwaitingApproval;
