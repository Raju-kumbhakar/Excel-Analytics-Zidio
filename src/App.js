import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Common/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './pages/AdminPanel';
import AwaitingApproval from './pages/AwaitingApproval';
import SuperAdminPanel from './pages/SuperAdminPanel';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Landing from './pages/Landing';
import AnimatedGridBackground from './components/Common/AnimatedGridBackground';
import About from './pages/About';
import OurTeam from './pages/OurTeam';
import Feedback from './pages/Feedback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

/**
 * UserProfile Component
 * Displays user information and real upload history (from localStorage)
 */
const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;

  const allHistory = JSON.parse(localStorage.getItem('upload_history') || '[]');
  const myHistory = allHistory.filter(h => h.user === user.email);

  const totalFiles = myHistory.length;
  const totalSize = myHistory.reduce((a, b) => a + (b.size || 0), 0);

  const clearMyHistory = () => {
    const remain = allHistory.filter(h => h.user !== user.email);
    localStorage.setItem('upload_history', JSON.stringify(remain));
    window.location.reload();
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B','KB','MB','GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-2xl animate-fade-in relative">
        {/* User Avatar and Basic Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold text-white truncate">{user.email}</div>
            <div className="text-gray-300 text-sm">Role: {user.role || 'user'}</div>
          </div>
          <div className="ml-auto grid grid-cols-3 gap-3 text-center">
            <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
              <div className="text-white text-lg font-extrabold">{totalFiles}</div>
              <div className="text-gray-300 text-xs">Uploads</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
              <div className="text-white text-lg font-extrabold">{formatBytes(totalSize)}</div>
              <div className="text-gray-300 text-xs">Total Size</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
              <div className="text-white text-lg font-extrabold">{myHistory[0]?.timestamp ? new Date(myHistory[0].timestamp).toLocaleDateString() : '-'}</div>
              <div className="text-gray-300 text-xs">Last Upload</div>
            </div>
          </div>
        </div>

        {/* Upload history */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-white flex items-center gap-2"><span>📁</span> Upload History</div>
            {myHistory.length > 0 && (
              <button onClick={clearMyHistory} className="text-xs px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-red-300 hover:text-red-200">Clear My History</button>
            )}
          </div>
          {myHistory.length === 0 ? (
            <div className="text-gray-300 text-sm">No uploads yet. Go to Dashboard to upload an Excel file.</div>
          ) : (
            <div className="max-h-80 overflow-auto rounded-xl border border-white/15 bg-white/5">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white/10 text-gray-200">
                  <tr>
                    <th className="text-left p-3">File</th>
                    <th className="text-left p-3">Size</th>
                    <th className="text-left p-3">Uploaded At</th>
                  </tr>
                </thead>
                <tbody className="text-gray-100">
                  {myHistory.map((h, idx) => (
                    <tr key={idx} className={idx % 2 ? 'bg-white/0' : 'bg-white/5'}>
                      <td className="p-3 font-medium truncate max-w-[240px]" title={h.name}>{h.name}</td>
                      <td className="p-3">{formatBytes(h.size)}</td>
                      <td className="p-3">{new Date(h.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * FeedbackModal Component (Redesigned)
 * - Priority, rating, optional email
 * - Drag & drop screenshot with preview
 * - Validation and Esc-to-close
 */
const FeedbackModal = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('bug');
  const [priority, setPriority] = useState('medium');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!title || title.trim().length < 5) e.title = 'Title should be at least 5 characters';
    if (!desc || desc.trim().length < 10) e.desc = 'Description should be at least 10 characters';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = (file) => {
    if (!file) return;
    setScreenshot(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onInputFile = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({
      title,
      desc,
      type,
      priority,
      rating,
      email,
      screenshot: screenshot ? screenshot.name : null,
      date: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem('user'))?.email || 'Anonymous',
      status: 'Open',
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    setSubmitted(true);
    setTitle(''); setDesc(''); setType('bug'); setPriority('medium'); setRating(0); setEmail(''); setScreenshot(null); setPreview('');
    setTimeout(() => { setSubmitted(false); onClose(); }, 1600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-6 w-full max-w-xl animate-fade-in relative">
        {/* Scoped style to ensure options are visible on dark themes (Windows/Chrome quirks) */}
        <style>{`
          select option { color: #111 !important; background: #fff !important; }
          select optgroup { color: #111 !important; background: #fff !important; }
        `}</style>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl hover:text-red-400" aria-label="Close">&times;</button>
        <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
          <span>💬</span> Feedback & Support
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-300 mb-2">Type</label>
            <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg">
              <option style={{ color: '#111', background: '#fff' }} value="bug">🐛 Bug Report</option>
              <option style={{ color: '#111', background: '#fff' }} value="suggestion">💡 Suggestion</option>
              <option style={{ color: '#111', background: '#fff' }} value="feedback">📝 General Feedback</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-300 mb-2">Priority</label>
            <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg">
              <option style={{ color: '#111', background: '#fff' }} value="low">Low</option>
              <option style={{ color: '#111', background: '#fff' }} value="medium">Medium</option>
              <option style={{ color: '#111', background: '#fff' }} value="high">High</option>
              <option style={{ color: '#111', background: '#fff' }} value="urgent">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-2">Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg" placeholder="Brief summary of your feedback" />
            {errors.title && <div className="text-red-300 text-xs mt-1">{errors.title}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-2">Description</label>
            <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg h-28" placeholder="Detailed description..." />
            {errors.desc && <div className="text-red-300 text-xs mt-1">{errors.desc}</div>}
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-300 mb-2">Email (optional)</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg" placeholder="name@example.com" />
            {errors.email && <div className="text-red-300 text-xs mt-1">{errors.email}</div>}
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-300 mb-2">Rate experience</label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={()=>setRating(n)} className={(n<=rating? 'text-yellow-300':'text-gray-400')+ ' text-xl hover:scale-110 transition-transform'} aria-label={`rate-${n}`}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-2">Screenshot (drag & drop or click)</label>
            <div className="border-2 border-dashed border-white/25 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={()=>document.getElementById('fb-file-input')?.click()}>
              <input id="fb-file-input" type="file" accept="image/*" onChange={onInputFile} className="hidden" />
              {preview ? (
                <div className="flex items-center gap-3">
                  <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                  <div className="text-gray-300 text-sm truncate">{screenshot?.name}</div>
                  <button type="button" onClick={()=>{ setScreenshot(null); setPreview(''); }} className="ml-auto text-red-300 hover:text-red-400 text-sm">Remove</button>
                </div>
              ) : (
                <div className="text-gray-300 text-sm">Drop an image here or click to upload.</div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold hover:from-blue-700 hover:to-purple-800">Submit</button>
          </div>
        </form>

        {submitted && (
          <div className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white shadow-xl">✅ Feedback submitted!</div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main App Component
 * Sets up routing and global state management
 * Handles authentication and role-based access control
 */
function App() {
  // Global state for feedback modal
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Check user authentication status
  const user = JSON.parse(localStorage.getItem('user'));
  const superEmail = (process.env.REACT_APP_SUPERADMIN_EMAIL || 'superadmin@excelanalytics.app').toLowerCase();
  const isSuperAdmin = !!(user && (user.superadmin || ((user.email || '').toLowerCase() === superEmail)));
  const isAdmin = user && user.role === 'admin' && !isSuperAdmin; // superadmin treated separately
  const isActiveAdmin = isAdmin && (user.status === 'active');
  const isPendingAdmin = isAdmin && (user.status !== 'active');
  const isUser = user && user.role === 'user' && !isSuperAdmin;

  const AppShell = () => {
    return (
      <div className="App">
        {/* Global animated background */}
        <AnimatedGridBackground />
        {/* Global Header */}
        <Header />
        
        {/* Main Application Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={
            <Login onLogin={() => {
              const u = JSON.parse(localStorage.getItem('user'));
              const sEmail = (process.env.REACT_APP_SUPERADMIN_EMAIL || 'superadmin@excelanalytics.app').toLowerCase();
              const uIsSuper = !!(u && (u.superadmin || ((u.email || '').toLowerCase() === sEmail)));
              if (uIsSuper) { window.location.href = '/superadmin'; return; }
              if (u?.role === 'admin') {
                if (u?.status === 'active') window.location.href = '/admin';
                else window.location.href = '/awaiting-approval';
                return;
              }
              window.location.href = '/dashboard';
            }} />
          } />
          
          <Route path="/register" element={
            <Register onRegister={() => {
              const u = JSON.parse(localStorage.getItem('user'));
              const sEmail = (process.env.REACT_APP_SUPERADMIN_EMAIL || 'superadmin@excelanalytics.app').toLowerCase();
              const uIsSuper = !!(u && (u.superadmin || ((u.email || '').toLowerCase() === sEmail)));
              if (uIsSuper) { window.location.href = '/superadmin'; return; }
              if (u?.role === 'admin') {
                if (u?.status === 'active') window.location.href = '/admin';
                else window.location.href = '/awaiting-approval';
                return;
              }
              window.location.href = '/dashboard';
            }} />
          } />
          
          <Route path="/awaiting-approval" element={
            <ProtectedRoute>
              {isPendingAdmin ? <AwaitingApproval /> : <Navigate to="/" />}
            </ProtectedRoute>
          } />

          {/* Protected User Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              {isUser ? <UserProfile /> : <Navigate to="/login" />}
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {isUser ? <UserDashboard /> : <Navigate to="/login" />}
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              {isActiveAdmin ? <AdminPanel /> : isPendingAdmin ? <Navigate to="/awaiting-approval" /> : <Navigate to="/login" />}
            </ProtectedRoute>
          } />

          {/* Protected Super Admin Routes */}
          <Route path="/superadmin" element={
            <ProtectedRoute>
              {isSuperAdmin ? <SuperAdminPanel /> : <Navigate to="/login" />}
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Floating Feedback Button - Only show for logged-in users */}
        {isUser && (
          <button
            onClick={() => setShowFeedback(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 z-40 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}
        
        {/* Feedback Modal */}
        <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
      </div>
    );
  };

  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
