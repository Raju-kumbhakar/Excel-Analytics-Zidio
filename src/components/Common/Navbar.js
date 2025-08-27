import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Mock user data for demonstration purposes
 * In a real application, this would come from an API or database
 */
const fakeUserData = {
  alice: {
    name: 'Alice Example',
    email: 'alice@email.com',
    created: '2024-05-01',
    files: [
      { name: 'SalesData.xlsx', date: '2024-06-01', charts: 3, downloads: 2 },
      { name: 'Budget2024.xls', date: '2024-06-02', charts: 2, downloads: 1 },
    ],
    charts: [
      { type: 'Bar', date: '2024-06-01' },
      { type: 'Pie', date: '2024-06-02' },
    ],
    downloads: 3,
  },
  bob: {
    name: 'Bob Smith',
    email: 'bob@email.com',
    created: '2024-05-10',
    files: [
      { name: 'Expenses.xls', date: '2024-06-03', charts: 1, downloads: 1 },
    ],
    charts: [
      { type: 'Line', date: '2024-06-03' },
    ],
    downloads: 1,
  },
};

/**
 * Get user profile data based on email
 * Returns mock data for demonstration or fallback data for new users
 * @param {Object} user - User object from localStorage
 * @returns {Object|null} User profile data or null
 */
function getUserProfile(user) {
  if (!user) return null;
  if (user.email === 'alice@email.com') return fakeUserData.alice;
  if (user.email === 'bob@email.com') return fakeUserData.bob;
  // fallback for demo
  return {
    name: user.email.split('@')[0],
    email: user.email,
    created: '2024-06-01',
    files: [],
    charts: [],
    downloads: 0,
  };
}

/**
 * Snackbar Component
 * Displays temporary success/error messages
 * @param {boolean} show - Whether to show the snackbar
 * @param {function} onClose - Function to close the snackbar
 * @param {string} message - Message to display
 */
const Snackbar = ({ show, onClose, message }) => show ? (
  <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
    <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <span>✅</span> {message}
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">&times;</button>
    </div>
  </div>
) : null;

/**
 * Navbar Component
 * Global navigation bar with role-based menu items and user profile
 * Features responsive design with mobile hamburger menu
 */
const Navbar = () => {
  const navigate = useNavigate();
  
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userProfile = user ? getUserProfile(user) : null;
  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';
  const avatarLetter = user ? user.email.charAt(0).toUpperCase() : '?';

  /**
   * Handle user logout
   * Clears localStorage and redirects to login page
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * Handle password update (placeholder function)
   * Shows success toast for demonstration
   * @param {Event} e - Form submit event
   */
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="backdrop-blur-lg bg-white/60 shadow-lg border-b border-gray-100 sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Home Link */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Excel Analytics</span>
              </Link>
              <Link to="/" className="ml-2 text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
                </svg>
                Home
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {!user && (
                <>
                  <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Sign Up
                  </Link>
                </>
              )}
              {isUser && (
                <>
                  <Link to="/dashboard" className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" /></svg>
                    Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-6 8v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
                  Admin Panel
                </Link>
              )}
              {user && (
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                  Logout
                </button>
              )}
            </div>

            {/* User Avatar (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                >
                  {avatarLetter}
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!user && (
                <>
                  <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Sign Up
                  </Link>
                </>
              )}
              {isUser && (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" /></svg>
                    Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-6 8v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
                    Admin Panel
                  </Link>
                </>
              )}
              {user && (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 font-medium flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-lg animate-fade-in relative">
            <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 text-white text-2xl hover:text-red-400">&times;</button>
            
            {/* User Avatar and Basic Info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-4xl text-white font-bold mb-2 shadow-lg">{avatarLetter}</div>
              <div className="text-2xl font-bold text-white mb-1">{userProfile?.name || user.email.split('@')[0]}</div>
              <div className="text-gray-300 mb-1">{user.email}</div>
              <div className="text-gray-400 text-sm">Joined: {userProfile?.created || '2024-06-01'}</div>
            </div>
            
            {/* Uploaded Files Section */}
            <div className="mb-4">
              <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>📁</span> Uploaded Files
              </div>
              <ul className="text-gray-200 ml-4 list-disc">
                {userProfile?.files?.length === 0 ? <li>No files uploaded yet.</li> : userProfile?.files?.map((f, i) => (
                  <li key={i}>{f.name} ({f.date}) - {f.charts} charts, {f.downloads} downloads</li>
                )) || <li>No files uploaded yet.</li>}
              </ul>
            </div>
            
            <hr className="my-4 border-white/20 animate-fade-in" />
            
            {/* Chart History Section */}
            <div className="mb-4">
              <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>📊</span> Chart History
              </div>
              <ul className="text-gray-200 ml-4 list-disc">
                {userProfile?.charts?.length === 0 ? <li>No charts generated yet.</li> : userProfile?.charts?.map((c, i) => (
                  <li key={i}>{c.type} ({c.date})</li>
                )) || <li>No charts generated yet.</li>}
              </ul>
            </div>
            
            <hr className="my-4 border-white/20 animate-fade-in" />
            
            {/* Download Statistics */}
            <div className="mb-4">
              <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>⬇️</span> Downloaded Charts
              </div>
              <div className="text-gray-200 ml-4">{userProfile?.downloads || 0} total downloads</div>
            </div>
            
            <hr className="my-4 border-white/20 animate-fade-in" />
            
            {/* Password Change Section */}
            <div className="mb-4">
              <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🔒</span> Change Password
              </div>
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-2">
                <input type="password" placeholder="New password" className="input-field bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mb-2" />
                <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200">Update Password</button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast */}
      <Snackbar show={showToast} onClose={() => setShowToast(false)} message="Profile updated!" />
    </>
  );
};

export default Navbar; 