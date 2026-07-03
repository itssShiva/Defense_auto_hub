import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
    setIsOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === 'dealer') return '/dealer-dashboard';
    if (user?.role === 'Admin') return '/admin-dashboard';
    return '/'; // Fallback for regular user until they have a dashboard
  };

  const navLinks = [
    { name: 'Vehicles', path: '#' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '#' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="bg-[#fafbf8] shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center cursor-pointer group">
            <Link to="/"><span className="text-3xl font-extrabold text-[#19456d] tracking-wider group-hover:scale-105 transition-transform duration-300">
              Fouji<span className="text-[#b48001]">Mart</span>
            </span></Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-[#19456d] text-lg font-semibold overflow-hidden px-1 py-2"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#b48001]">
                  {link.name}
                </span>
                <span className="absolute left-0 bottom-0 w-full h-[3px] bg-[#b48001] translate-x-[105%] group-hover:translate-x-0 transition-transform duration-300 ease-out rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button className="relative overflow-hidden px-6 py-2 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] group transition-all duration-300 hover:shadow-[0_0_15px_rgba(180,128,1,0.4)] bg-transparent">
                  <span className="absolute inset-0 bg-[#708ca4] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></span>
                  <Link to="/login"> <span className="relative z-10 group-hover:text-[#19456d] transition-colors duration-300">Login</span></Link>
                </button>
                <button className="relative overflow-hidden px-6 py-2.5 rounded-full font-bold text-[#fafbf8] bg-[#b48001] group transition-all duration-300 hover:shadow-[0_0_15px_rgba(25,69,109,0.4)] border-2 border-transparent">
                  <span className="absolute inset-0 bg-[#19456d] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                  <Link to="/register"><span className="relative z-10">Register</span></Link>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardPath()}
                  className="px-6 py-2 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] hover:bg-[#b48001] hover:text-[#fafbf8] transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#19456d] hover:text-[#b48001] focus:outline-none transition-colors duration-300 p-2"
            >
              <div className="w-6 flex flex-col items-end justify-center gap-1.5">
                <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
                <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'opacity-0' : 'w-4'}`}></span>
                <span className={`h-0.5 bg-current transition-all duration-300 ease-out ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-[#fafbf8] border-t border-[#708ca4]/30 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block px-3 py-3 text-lg font-semibold text-[#19456d] hover:text-[#b48001] hover:bg-[#708ca4]/20 rounded-xl transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-3 px-3">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-full font-bold text-[#b48001] border-2 border-[#b48001] hover:bg-[#708ca4] hover:text-[#19456d] transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-full font-bold text-[#fafbf8] bg-[#b48001] hover:bg-[#19456d] transition-colors duration-300 shadow-md">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-full font-bold text-[#19456d] bg-[#708ca4]/20 hover:bg-[#708ca4]/40 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
