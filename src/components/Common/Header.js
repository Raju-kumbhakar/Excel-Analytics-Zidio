import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';
  const isSuperAdmin = user && user.role === 'superadmin';
  const isPendingAdmin = isAdmin && user.status !== 'active';
  const avatarLetter = user ? (user.email?.charAt(0).toUpperCase() || 'U') : null;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src={process.env.PUBLIC_URL + '/microsoft-excel-logo.jpg'}
                alt="Microsoft Excel Logo"
                className="w-7 h-7 object-contain"
                loading="eager"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className="text-white/90 font-extrabold text-lg tracking-wide">Excel Analytics</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-gray-200 hover:text-white">Features</Link>
            <Link to="/about" className="text-gray-200 hover:text-white">About</Link>
            <div className="h-5 w-px bg-white/15" />
            {isUser || isAdmin || isSuperAdmin ? (
              <>
                {isSuperAdmin && (<Link to="/superadmin" className="text-gray-200 hover:text-white">Super Admin</Link>)}
                {isAdmin && !isPendingAdmin && (<Link to="/admin" className="text-gray-200 hover:text-white">Admin</Link>)}
                {isAdmin && isPendingAdmin && (
                  <Link to="/awaiting-approval" className="text-yellow-300 hover:text-white flex items-center gap-2">
                    <span>Pending</span>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-400/40 text-yellow-200">Awaiting approval</span>
                  </Link>
                )}
                {isUser && (<Link to="/dashboard" className="text-gray-200 hover:text-white">Dashboard</Link>)}
                <Link to="/profile" className="text-gray-200 hover:text-white">Profile</Link>
                <button onClick={handleLogout} className="text-gray-200 hover:text-red-300">Logout</button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold flex items-center justify-center">
                  {avatarLetter}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-200 hover:text-white">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile quick actions (shown under header on mobile) */}
      <div className="md:hidden px-4 flex items-center gap-3 z-10 mt-3">
        {isUser || isAdmin || isSuperAdmin ? (
          <>
            {isSuperAdmin && (<Link to="/superadmin" className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center">Super Admin</Link>)}
            {isAdmin && !isPendingAdmin && (<Link to="/admin" className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center">Admin</Link>)}
            {isAdmin && isPendingAdmin && (<Link to="/awaiting-approval" className="flex-1 px-4 py-3 rounded-lg bg-yellow-600/80 text-white text-center">Pending</Link>)}
            {isUser && (<Link to="/dashboard" className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center">Dashboard</Link>)}
            <button onClick={handleLogout} className="flex-1 px-4 py-3 rounded-lg bg-rose-600 text-white text-center">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 text-white text-center font-semibold">Get Started</Link>
            <Link to="/login" className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center">Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
