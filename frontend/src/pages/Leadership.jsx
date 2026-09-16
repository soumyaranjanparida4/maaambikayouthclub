import React, { useState, useEffect } from 'react';
import { getLeaders } from '../services/api';
import { Star, Phone, ShieldCheck, Award, Mail, ChevronRight } from 'lucide-react';

export const Leadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await getLeaders();
        setLeaders(res.data || []);
      } catch (err) {
        console.error('Error fetching leaders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const president = leaders.find((l) => l.position === 'PRESIDENT') || leaders[0];
  const otherLeaders = leaders.filter((l) => l.id !== president?.id);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Banner */}
      <section className="bg-brand-blue-950 text-white py-16 mb-12 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Executive Body
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-4 tracking-tight">
            Committee Leadership
          </h1>
          <p className="text-slate-300 font-medium text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            The Executive Officers of Maa Ambika Youth Club Barapada.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* PRESIDENT SPOTLIGHT CARD */}
        {president && (
          <div className="bg-gradient-to-r from-brand-blue-900 via-brand-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-amber-500/50 gold-border-glow relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-800">
                    <img
                      src={president.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt={president.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-brand-blue-950 font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-brand-blue-950" /> PRESIDENT SPOTLIGHT
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-white/10 px-3 py-1 rounded-md inline-block">
                  CHIEF EXECUTIVE LEADER
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-amber-300">
                  {president.name}
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  POSITION: <span className="text-amber-400">{president.position}</span>
                </p>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed italic">
                  “{president.description || 'Leading the committee with dedication and responsibility.'}”
                </p>
                {president.phone && (
                  <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <a
                      href={`tel:${president.phone}`}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-brand-blue-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" /> Call President ({president.phone})
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* OTHER EXECUTIVE OFFICERS */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">Executive Council</span>
            <h3 className="font-display font-extrabold text-3xl text-brand-blue-950 mt-1">Vice President & Managers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative w-full aspect-[4/5] bg-slate-200 overflow-hidden">
                    <img
                      src={leader.photo_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-950/80 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-amber-500 text-brand-blue-950 font-black text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow">
                        {leader.position}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <h4 className="font-display font-extrabold text-xl text-brand-blue-950">
                      {leader.name}
                    </h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {leader.description || 'Serving Maa Ambika Youth Club Barapada with active dedication.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  {leader.phone ? (
                    <a
                      href={`tel:${leader.phone}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-brand-blue-950 hover:text-amber-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                    >
                      <Phone className="w-3.5 h-3.5" /> Contact {leader.phone}
                    </a>
                  ) : (
                    <div className="text-xs text-slate-400 font-semibold text-center py-2">
                      Official Committee Officer
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
