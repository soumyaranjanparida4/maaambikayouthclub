import React, { useState, useEffect } from 'react';
import { getMembers } from '../services/api';
import { Users, Search, Shield, Maximize2, X, Sparkles } from 'lucide-react';

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBannerFullscreen, setIsBannerFullscreen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        setMembers(res.data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Banner */}
      <section className="bg-brand-blue-950 text-white py-14 mb-10 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Village Volunteers
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-4 tracking-tight">
            Committee Members
          </h1>
          <p className="text-slate-300 font-medium text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Dedicated youth volunteers powering our community events, sports, and village development initiatives.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* FULL SCREEN SHOWCASE BANNER */}
        <section className="relative group">
          <div className="bg-gradient-to-r from-brand-blue-950 via-slate-900 to-brand-blue-950 rounded-3xl p-2.5 sm:p-3 shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
            
            {/* Top Tag */}
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Official Committee Group Banner
              </span>
              <button
                onClick={() => setIsBannerFullscreen(true)}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen
              </button>
            </div>

            {/* Banner Image */}
            <div
              onClick={() => setIsBannerFullscreen(true)}
              className="cursor-pointer overflow-hidden rounded-2xl relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 flex items-center justify-center group"
            >
              <img
                src="/members-banner.jpg"
                alt="Maa Ambika Yuvak Sangha Barapada Official Banner"
                className="w-full h-full object-contain sm:object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Overlay Prompt */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" /> Click to Open Full Resolution
                </span>
              </div>
            </div>

          </div>
        </section>
        
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-slate-800"
            />
          </div>
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-amber-600">{filteredMembers.length}</span> Active Members
          </div>
        </div>

        {/* Member Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-brand-blue-950">No Members Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                    <img
                      src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="bg-brand-blue-950/90 backdrop-blur-sm text-amber-400 font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow border border-amber-500/30 inline-block">
                        {member.role || 'Active Member'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-extrabold text-brand-blue-950 text-base group-hover:text-amber-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {member.description || 'Active member contributing to Maa Ambika Youth Club Barapada.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-4 pt-0">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 border-t border-slate-100 pt-3">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" /> Barapada Volunteer
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isBannerFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsBannerFullscreen(false)}
        >
          <button
            onClick={() => setIsBannerFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-2xl"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-6xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/members-banner.jpg"
              alt="Maa Ambika Yuvak Sangha Barapada Official Banner"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            <p className="text-amber-400 text-xs sm:text-sm font-extrabold tracking-wide mt-3 text-center">
              MAA AMBIKA YUVAK SANGHA, BARAPADA — 2025
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Members;
