import React from 'react';
import { Shield, Eye, Target, CheckCircle2, Heart, Users, Award, Landmark } from 'lucide-react';

export const About = ({ settings }) => {
  const visionText = settings?.vision || "To build a united, active and progressive village community through youth participation and collective effort.";
  const aboutText = settings?.about || "Maa Ambika Youth Club Barapada is a community-focused youth organization dedicated to unity, social service, cultural activities, sports, and the overall development of our village.";

  const missionItems = settings?.mission
    ? settings.mission.split('\n').filter(Boolean)
    : [
        'Promote unity among villagers',
        'Encourage youth participation',
        'Organize cultural and sports activities',
        'Support social and community initiatives',
        'Contribute to village development',
        'Preserve local traditions and values',
      ];

  const values = [
    { title: 'Unity & Brotherhood', desc: 'Fostering deep bond and solidarity across all families in Barapada.', icon: Users, color: 'bg-blue-500' },
    { title: 'Selfless Service', desc: 'Serving the elderly, needy, and village infrastructure with dedication.', icon: Heart, color: 'bg-rose-500' },
    { title: 'Youth Empowerment', desc: 'Guiding young minds in education, sports, career, and leadership.', icon: Target, color: 'bg-amber-500' },
    { title: 'Cultural Heritage', desc: 'Celebrating traditional Odia festivals, pujas, and folk arts.', icon: Landmark, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Header Banner */}
      <section className="bg-brand-blue-950 text-white py-16 mb-12 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            About Our Committee
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-4 tracking-tight">
            Maa Ambika Youth Club Barapada
          </h1>
          <p className="text-amber-300 font-semibold text-base sm:text-xl mt-2 italic">
            “Unity • Service • Youth • Community”
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Intro & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">Our Identity & Roots</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-blue-950 leading-tight">
              A Legacy of Service & Youth Leadership in Barapada
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {aboutText}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded by the enthusiastic youth of Barapada village, our committee serves as an energetic pillar of community welfare. We organize annual sports meets, mega cleanliness drives, blood donation camps, cultural pujas, and educational guidance programs for students.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                alt="Barapada Village Community"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-blue-900 text-white p-6 rounded-2xl shadow-xl max-w-xs border border-amber-500/40 hidden sm:block">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">Barapada Pride</h4>
                  <p className="text-xs text-slate-300">United for progressive village development.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-gradient-to-br from-brand-blue-900 to-brand-blue-950 text-white p-8 rounded-3xl border border-amber-500/30 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-amber-300">Our Vision</h3>
              <p className="text-slate-200 text-lg leading-relaxed italic">
                “{visionText}”
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              Barapada Tomorrow
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-brand-blue-950">Our Mission</h3>
              <ul className="space-y-3">
                {missionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Action Commitments
            </div>
          </div>

        </div>

        {/* Core Values Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="font-display font-extrabold text-3xl text-brand-blue-950">Core Pillars of Our Club</h3>
            <p className="text-slate-600 text-sm mt-2">Principles that guide every event and initiative we undertake.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all space-y-3">
                  <div className={`w-12 h-12 rounded-xl ${v.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-brand-blue-950 text-lg">{v.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
