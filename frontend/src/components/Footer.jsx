import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, MapPin, Phone, Mail, Lock } from 'lucide-react';

export const Footer = ({ settings }) => {
  const committeeName = settings?.committee_name || 'MAA AMBIKA YOUTH CLUB BARAPADA';
  const tagline = settings?.tagline || 'Unity • Service • Youth • Community';

  return (
    <footer className="bg-brand-blue-950 text-slate-300 pt-16 pb-8 border-t-4 border-amber-500 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-brand-blue-900 shadow-md overflow-hidden border border-white/40">
                {settings?.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Shield className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <h3 className="font-display font-extrabold text-white text-lg leading-tight">
                {committeeName}
              </h3>
            </div>
            <p className="text-amber-400 font-semibold text-sm italic">
              “Together for Our Village, Together for Our Future”
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Serving the Barapada community through youth empowerment, cleanliness drives, sports, cultural preservation, and social service.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase border-b border-amber-500/30 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home Page</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Our Club</Link></li>
              <li><Link to="/leadership" className="hover:text-amber-400 transition-colors">Executive Leaders</Link></li>
              <li><Link to="/members" className="hover:text-amber-400 transition-colors">Committee Members</Link></li>
              <li><Link to="/activities" className="hover:text-amber-400 transition-colors">Village Activities</Link></li>
              <li><Link to="/gallery" className="hover:text-amber-400 transition-colors">Photo Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Get In Touch</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact Summary */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase border-b border-amber-500/30 pb-2 inline-block">
              Contact Barapada
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings?.address || 'At: Barapada, Po: Saudia, District: Jajpur, Odisha - 754279'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{settings?.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="break-all">{settings?.email || 'maaambikayouthclub@gmail.com'}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Village Spirit & Admin */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase border-b border-amber-500/30 pb-2 inline-block">
              Village Pride
            </h4>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated to building a prosperous, harmonious, and united village for current and upcoming generations.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-400" /> Made for Barapada
                </span>
                <Link
                  to="/admin/login"
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md"
                >
                  <Lock className="w-3 h-3" /> Admin Login
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Maa Ambika Youth Club Barapada. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-amber-400">Vision & Mission</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-400">Reach Us</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-amber-400 text-amber-400 font-semibold">Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
