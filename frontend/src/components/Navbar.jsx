import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Users, Trophy, Image, PhoneCall, Home as HomeIcon, Info, UserCheck, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Leadership', path: '/leadership', icon: UserCheck },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Activities', path: '/activities', icon: Trophy },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const committeeName = settings?.committee_name || 'MAA AMBIKA YOUTH CLUB BARAPADA';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-brand-blue-900/95 backdrop-blur-md shadow-xl border-b border-brand-saffron-500/20 py-3' : 'bg-brand-blue-900 py-4 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform border-2 border-white/80">
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Shield className="w-6 h-6 text-brand-blue-900 stroke-[2.5]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-white text-base sm:text-lg leading-tight tracking-wide group-hover:text-amber-300 transition-colors">
                MAA AMBIKA
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-400 tracking-wider uppercase">
                Youth Club Barapada
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-brand-blue-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Login / Dashboard Button */}
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className={`ml-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                isAuthenticated
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30'
              }`}
            >
              <Lock className="w-4 h-4" />
              {isAuthenticated ? 'Dashboard' : 'Admin Login'}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-7 h-7 text-amber-400" /> : <Menu className="w-7 h-7 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-blue-950/98 backdrop-blur-xl border-b border-amber-500/30 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
          <div className="text-xs uppercase tracking-wider font-semibold text-amber-400 px-3 py-1 border-b border-white/10 mb-2">
            Navigation Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-brand-blue-950 font-bold shadow-md'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-brand-blue-950 shadow-lg mt-2"
            >
              <Lock className="w-5 h-5" />
              {isAuthenticated ? 'Go to Admin Dashboard' : 'Admin Panel Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
