import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const OTPModal = ({ open, onVerify, onClose, email, onResend }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-sm animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl hover:text-red-400">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📧</span> Email Verification
        </h2>
        <div className="text-green-400 mb-2">Verification code sent to <span className="font-mono">{email}</span>!</div>
        <p className="text-gray-300 mb-2">Enter the OTP sent to your email.</p>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full mb-2"
          placeholder="Enter OTP"
        />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button
          onClick={() => {
            if (!input) { setError('Please enter the OTP'); return; }
            onVerify(input).catch(err => setError(err?.message || 'Verification failed'));
          }}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 mb-2"
        >
          Verify
        </button>
        <button
          onClick={onResend}
          className="w-full py-2 rounded-lg bg-white/10 border border-white/20 text-blue-300 font-bold shadow-lg hover:bg-white/20 hover:text-purple-300 transition-all duration-200"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      // Request OTP from backend
      const resp = await fetch(`${API_BASE}/api/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' })
      });
      const data = await resp.json();
      if (!resp.ok || !data?.success) throw new Error(data?.message || 'Failed to send OTP');
      setPendingUser({ email, password, role });
      setShowOTP(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    }
  };

  const handleVerifyOTP = async (code) => {
    if (!pendingUser) throw new Error('No pending user');
    // Verify OTP with backend and finalize registration
    const resp = await fetch(`${API_BASE}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: pendingUser.email, code, purpose: 'register' })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Verification failed');

    // Optional: preserve admin pending queue logic client-side
    if (pendingUser.role === 'admin') {
      try {
        const pend = JSON.parse(localStorage.getItem('admins_pending') || '[]');
        if (!pend.find(p => p.email === pendingUser.email)) {
          pend.push({ email: pendingUser.email, requestedAt: new Date().toISOString() });
          localStorage.setItem('admins_pending', JSON.stringify(pend));
        }
      } catch {}
    }

    // Save auth
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify({ ...data.user, role: pendingUser.role }));

    setShowOTP(false);
    onRegister && onRegister();
  };

  const handleResendOTP = async () => {
    if (!email) return;
    try {
      await fetch(`${API_BASE}/api/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' })
      });
    } catch {}
  };

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: value prop */}
      <div className="hidden lg:block">
        <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 h-full shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <img src={process.env.PUBLIC_URL + '/microsoft-excel-logo.jpg'} alt="Excel" className="w-6 h-6" onError={(e)=>e.currentTarget.style.display='none'} />
            </div>
            <h2 className="text-white text-2xl font-extrabold">Join Excel Analytics</h2>
          </div>
          <ul className="space-y-4 text-gray-200">
            <li className="flex items-start gap-3"><span>🚀</span><span>Start with free features instantly.</span></li>
            <li className="flex items-start gap-3"><span>🤝</span><span>Team-friendly sharing (coming soon).</span></li>
            <li className="flex items-start gap-3"><span>🔔</span><span>Stay notified about sheet changes.</span></li>
          </ul>
        </div>
      </div>

      {/* Right: form card */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-1">Create your account</h1>
          <p className="text-gray-300">It only takes a minute</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input type="password" className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500" placeholder="Create a password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              {/* could add toggle later similar to login */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Register as</label>
            <div className="flex gap-3">
              <button type="button" className={`px-4 py-2 rounded-lg border-2 ${role==='user'?'bg-blue-600/80 text-white border-blue-600 shadow-lg':'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'}`} onClick={()=>setRole('user')}>
                👤 User
              </button>
              <button type="button" className={`px-4 py-2 rounded-lg border-2 ${role==='admin'?'bg-purple-700/80 text-white border-purple-700 shadow-lg':'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'}`} onClick={()=>setRole('admin')}>
                🛡️ Admin
              </button>
            </div>
          </div>
          {/* Admin passkey removed; admins go to approval queue */}
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-800">Create account</button>
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-purple-400 font-medium">Sign in</Link>
        </div>
      </div>

      <OTPModal open={showOTP} onVerify={handleVerifyOTP} onClose={() => setShowOTP(false)} email={pendingUser?.email || email} onResend={handleResendOTP} />
    </div>
  );
};

export default Register; 