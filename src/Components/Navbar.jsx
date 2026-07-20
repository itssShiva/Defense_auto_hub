import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { Search, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
    setIsOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === 'dealer') return '/dealer-dashboard';
    if (user?.role === 'Admin') return '/admin-dashboard';
    return '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    {
      name: 'Vehicles',
      isDropdown: true,
      items: [
        { name: 'All Vehicles', path: '/cars' },
        { name: 'Brands', path: '/brands' },
        { name: 'Used Vehicles', path: '/used-cars' },
        { name: 'Compare Vehicles', path: '/compare' },
        { name: 'Find Dealers', path: '/find-dealers' },

      ],
    },
    {
      name: 'Loan',
      isDropdown: true,
      items: [
        { name: 'Car Loan', path: '/loans' },
        { name: 'Check Eligibility', path: '/loan/eligibility-documents' },
        { name: 'EMI Calculator', path: '/loan/emi-calculator' },
      ],
    },
    {
      name: 'Insurance',
      isDropdown: true,
      items: [
        { name: 'Car Insurance', path: '/insurance' },
        { name: 'New Insurance', path: '/newCar-Insurance' },
        { name: 'Renew Insurance', path: '/insurance/renew' },
        { name: 'Get Instant quote', path: '/quotation-form' }
      ],
    },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact Us', path: '/contact' },

  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bg-[#fafbf8] shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="shrink-0 flex items-center cursor-pointer group">
            <Link to="/">
              <span className="text-2xl font-extrabold text-[#19456d] tracking-wider group-hover:scale-105 transition-transform duration-300">
                Fouji<span className="text-[#b48001]">Mart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group">
                  <button className="flex items-center gap-1 relative text-base font-bold overflow-hidden px-1 py-2 text-[#19456d] hover:text-[#b48001] transition-colors focus:outline-none">
                    {link.name}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full mt-0 w-56 bg-white border border-[#708ca4]/15 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0 flex flex-col p-2 overflow-hidden z-50">
                    {link.items.map(subItem => (
                      <Link key={subItem.name} to={subItem.path}
                        className={`px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive(subItem.path) ? 'text-[#b48001] bg-[#b48001]/5' : 'text-[#19456d] hover:text-[#b48001] hover:bg-[#fafbf8]'
                          }`}>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative group text-base font-bold overflow-hidden px-1 py-2 transition-colors ${isActive(link.path) ? 'text-[#b48001]' : 'text-[#19456d] hover:text-[#b48001]'
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className={`absolute left-0 bottom-0 h-[2.5px] bg-[#b48001] transition-all duration-300 rounded-full ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </Link>
              )
            ))}
          </div>

          {/* Right: Search + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles…"
                className="pl-9 pr-4 py-2 rounded-xl border border-[#708ca4]/25 bg-white text-[#19456d] text-base font-medium focus:outline-none focus:ring-1 focus:ring-[#b48001] w-48 focus:w-60 transition-all duration-300"
              />
            </form>

            {!user ? (
              <>
                <Link to="/login"
                  className="px-5 py-2 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] hover:bg-[#b48001] hover:text-white transition-all duration-300 text-base">
                  Login
                </Link>

              </>
            ) : (
              <>
                {user?.role === 'dealer' || user?.role === 'Admin' ? (
                  <Link to={getDashboardPath()}
                    className="px-5 py-2 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] hover:bg-[#b48001] hover:text-white transition-all duration-300 text-base">
                    Dashboard
                  </Link>
                ) : null}
                <button onClick={handleLogout}
                  className="px-5 py-2 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md text-base">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => navigate('/search')} className="p-2 text-[#19456d] hover:text-[#b48001] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#19456d] hover:text-[#b48001] focus:outline-none transition-colors p-2">
              <div className="w-6 flex flex-col items-end justify-center gap-1.5">
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : 'w-4'}`} />
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-[#fafbf8] border-t border-[#708ca4]/20 overflow-hidden transition-all duration-300 ease-in-out shadow-xl ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-1">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles, brands, models…"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#708ca4]/20 bg-white text-[#19456d] text-base font-medium focus:outline-none focus:ring-1 focus:ring-[#b48001]" />
          </form>

          {navLinks.map((link) => (
            link.isDropdown ? (
              <div key={link.name} className="space-y-1 mb-2">
                <div className="px-4 py-2 text-xs font-bold text-[#708ca4] uppercase tracking-widest">{link.name}</div>
                {link.items.map(subItem => (
                  <Link key={subItem.name} to={subItem.path} onClick={() => setIsOpen(false)}
                    className={`block pl-6 pr-4 py-3 text-base font-bold rounded-xl transition-all ${isActive(subItem.path) ? 'text-[#b48001] bg-[#b48001]/8' : 'text-[#19456d] hover:text-[#b48001] hover:bg-[#708ca4]/10'
                      }`}>
                    {subItem.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-base font-bold rounded-xl transition-all ${isActive(link.path) ? 'text-[#b48001] bg-[#b48001]/8' : 'text-[#19456d] hover:text-[#b48001] hover:bg-[#708ca4]/10'
                  }`}>
                {link.name}
              </Link>
            )
          ))}

          <div className="pt-3 flex flex-col gap-3 px-1">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] hover:bg-[#b48001] hover:text-white transition-all text-base">Login</Link>


              </>
            ) : (
              <>
                {user?.role === 'dealer' || user?.role === 'Admin' ? (
                  <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-full font-bold text-[#19456d] bg-[#708ca4]/15 hover:bg-[#708ca4]/25 transition-all text-base">Dashboard</Link>
                ) : null}
                <button onClick={handleLogout} className="w-full py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md text-base">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
