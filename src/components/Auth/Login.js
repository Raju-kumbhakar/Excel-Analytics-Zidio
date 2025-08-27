import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const generateOtp = () => (Math.floor(100000 + Math.random() * 900000)).toString();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);
    console.log('🔐 Generated OTP for testing:', generatedOtp);
    setStep(2);
    setError('');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (inputOtp === otp) {
      setStep(3);
      setError('');
    } else {
      setError('Incorrect OTP');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 2000);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-sm animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl hover:text-red-400">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔒</span> Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full" placeholder="Enter your email" />
            </div>
            {error && <div className="text-red-400">{error}</div>}
            <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-green-400 mb-2">Verification code sent to <span className="font-mono">{email}</span>!</div>
        <div className="text-xs text-yellow-400 mb-2">💡 Check browser console (F12) for OTP: <span className="font-mono">{otp}</span></div>
            <input value={inputOtp} onChange={e => setInputOtp(e.target.value)} className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full" placeholder="Enter OTP" />
            {error && <div className="text-red-400">{error}</div>}
            <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 mb-2">Verify OTP</button>
            <button type="button" onClick={() => setOtp(generateOtp())} className="w-full py-2 rounded-lg bg-white/10 border border-white/20 text-blue-300 font-bold shadow-lg hover:bg-white/20 hover:text-purple-300 transition-all duration-200">Resend OTP</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full" placeholder="Enter new password" />
            </div>
            <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200">Reset Password</button>
          </form>
        )}
        {showToast && (
          <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <span>✅</span> Password reset!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      const data = await resp.json();
      if (!resp.ok || !data?.success) {
        throw new Error(data?.message || 'Login failed');
      }
      if (data.token) localStorage.setItem('token', data.token);
      let savedUser = data.user || {};
      // Mark superadmin on frontend if matches configured email
      const superEmail = (process.env.REACT_APP_SUPERADMIN_EMAIL || 'superadmin@excelanalytics.app').toLowerCase();
      if ((savedUser.email || '').toLowerCase() === superEmail) {
        savedUser = { ...savedUser, superadmin: true };
      }
      localStorage.setItem('user', JSON.stringify(savedUser));
      if (remember) localStorage.setItem('remember_email', normalizedEmail); else localStorage.removeItem('remember_email');
      onLogin && onLogin();
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const requestLoginOtp = async () => {
    setOtpError('');
    if (!email) { setOtpError('Enter your email first'); return; }
    try {
      const resp = await fetch(`${API_BASE}/api/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'login' })
      });
      const data = await resp.json();
      if (!resp.ok || !data?.success) throw new Error(data?.message || 'Failed to send OTP');
      setOtpRequested(true);
      setShowOtpLogin(true);
    } catch (err) {
      setOtpError(err.message || 'Could not send OTP');
    }
  };

  const verifyLoginOtp = async () => {
    setOtpError('');
    if (!otpCode) { setOtpError('Enter the OTP'); return; }
    try {
      const resp = await fetch(`${API_BASE}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode, purpose: 'login' })
      });
      const data = await resp.json();
      if (!resp.ok || !data?.success) throw new Error(data?.message || 'Verification failed');
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      setShowOtpLogin(false);
      onLogin && onLogin();
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: brand/benefits */}
      <div className="hidden lg:block">
        <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 h-full shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <img src={process.env.PUBLIC_URL + '/microsoft-excel-logo.jpg'} alt="Excel" className="w-6 h-6" onError={(e)=>e.currentTarget.style.display='none'} />
            </div>
            <h2 className="text-white text-2xl font-extrabold">Excel Analytics</h2>
          </div>
          <ul className="space-y-4 text-gray-200">
            <li className="flex items-start gap-3"><span>✅</span><span>Upload Excel and get instant insights.</span></li>
            <li className="flex items-start gap-3"><span>📊</span><span>Auto charts and export to PNG/PDF.</span></li>
            <li className="flex items-start gap-3"><span>🔒</span><span>Secure by default. Your files stay local.</span></li>
          </ul>
        </div>
      </div>

      {/* Right: form card */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-1">Welcome back</h1>
          <p className="text-gray-300">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword? 'text':'password'} className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500" placeholder="Your password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute inset-y-0 right-3 my-auto h-9 px-2 rounded-md text-gray-200 hover:text-white bg-white/5 border border-white/10">{showPassword? 'Hide':'Show'}</button>
            </div>
          </div>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} className="accent-blue-600" /> Remember me
            </label>
            <button type="button" onClick={()=>setShowForgot(true)} className="text-blue-400 hover:text-purple-400 text-sm">Forgot password?</button>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-800">Sign in</button>
          <div className="text-center text-gray-300">or</div>
          <button type="button" onClick={requestLoginOtp} className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-blue-300 font-bold hover:bg-white/20">Sign in with OTP</button>
          {otpError && <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mt-3">{otpError}</div>}
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-purple-400 font-medium">Create one</Link>
        </div>
      </div>

      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />

      {showOtpLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-sm animate-fade-in relative">
            <button onClick={()=>setShowOtpLogin(false)} className="absolute top-4 right-4 text-white text-2xl hover:text-red-400">&times;</button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><span>🔐</span> OTP Sign-in</h2>
            <div className="text-green-400 mb-2">{otpRequested? `OTP sent to ${email}` : 'Requesting OTP...'}</div>
            <input value={otpCode} onChange={e=>setOtpCode(e.target.value)} className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full mb-2" placeholder="Enter OTP" />
            {otpError && <div className="text-red-400 mb-2">{otpError}</div>}
            <button onClick={verifyLoginOtp} className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 mb-2">Verify</button>
            <button onClick={requestLoginOtp} className="w-full py-2 rounded-lg bg-white/10 border border-white/20 text-blue-300 font-bold shadow-lg hover:bg-white/20 hover:text-purple-300 transition-all duration-200">Resend OTP</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 