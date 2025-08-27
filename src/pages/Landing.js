import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';
  const avatarLetter = user ? user.email?.charAt(0).toUpperCase() : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header moved to global <Header /> component */}

      {/* Hero */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Headline & CTAs */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live demo ready
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Turn Excel data into insights and beautiful charts.
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl">
              Upload spreadsheets, map columns, and generate 2D/3D visualizations instantly. Secure, fast, and built for teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:from-emerald-700 hover:to-teal-700 text-center">
                Create free account
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 text-center">
                Sign in
              </Link>
              <Link to="/our-team" className="px-6 py-3 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/15 text-center">
                Meet the Team
              </Link>
            </div>
            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-5 text-center pt-2">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-extrabold text-white">3x</div>
                <div className="text-xs text-gray-300">Faster workflows</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-extrabold text-white">10+</div>
                <div className="text-xs text-gray-300">Chart types</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-extrabold text-white">PDF/PNG</div>
                <div className="text-xs text-gray-300">One-click export</div>
              </div>
            </div>
          </div>

          {/* Right: Visual card with logo */}
          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={process.env.PUBLIC_URL + '/microsoft-excel-logo.jpg'}
                    alt="Microsoft Excel"
                    className="max-w-[70%] max-h-[70%] object-contain"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  />
                </div>
                <div>
                  <div className="text-white text-2xl font-extrabold">Works with Excel</div>
                  <div className="text-gray-300 text-sm">.xlsx, .xls, .xlsm, .xlsb, .xltx, .xltm</div>
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-5 text-sm">
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 p-4">Drag & drop upload</div>
                <div className="rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 p-4">Auto sheet detection</div>
                <div className="rounded-xl bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200 p-4">2D/3D charts</div>
                <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 p-4">Export as PNG/PDF</div>
              </div>
              <div className="mt-6 text-gray-300 text-xs">Microsoft Excel logo used for illustrative purposes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pb-6 sm:pb-10 z-10">
        <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="text-white font-bold mb-1">1. Upload</div>
              <div className="text-gray-300 text-sm">Drop your Excel file (.xlsx, .xls, .xlsm...) and we parse it instantly.</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="text-white font-bold mb-1">2. Map</div>
              <div className="text-gray-300 text-sm">Pick X/Y columns and choose chart type (2D/3D).</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="text-white font-bold mb-1">3. Visualize</div>
              <div className="text-gray-300 text-sm">Generate, customize, and export to PNG/PDF.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-14 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-7">
            <div className="text-white text-lg font-bold mb-2">Easy Excel Upload</div>
            <div className="text-gray-300 text-sm">Drag & drop your Excel files and instantly parse your data.</div>
          </div>
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-7">
            <div className="text-white text-lg font-bold mb-2">Dynamic Data Mapping</div>
            <div className="text-gray-300 text-sm">Choose your X and Y axes and generate custom charts in seconds.</div>
          </div>
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-7">
            <div className="text-white text-lg font-bold mb-2">Beautiful Visualizations</div>
            <div className="text-gray-300 text-sm">Bar, line, and pie charts with responsive design and export.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-10 border-t border-white/10 bg-white/5 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={process.env.PUBLIC_URL + '/microsoft-excel-logo.jpg'} alt="Excel" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-white font-extrabold">Excel Analytics</span>
            </div>
            <p className="text-gray-300 text-sm">Turn spreadsheets into insights with beautiful charts and exports.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/our-team" className="text-gray-300 hover:text-white">Our Team</Link></li>
              <li><Link to="/feedback" className="text-gray-300 hover:text-white">Feedback</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Follow</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">Twitter/X</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white" aria-label="LinkedIn">LinkedIn</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white" aria-label="GitHub">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-xs">
            <div>&copy; {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.</div>
            <div className="mt-2 sm:mt-0 flex items-center gap-4">
              <a href="#" className="hover:text-white">Status</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 