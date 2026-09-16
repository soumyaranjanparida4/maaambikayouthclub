import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Trophy, Calendar, ArrowRight, Heart, Star, Sparkles, Award, MapPin, CheckCircle2 } from 'lucide-react';
import { getLeaders, getMembers, getActivities, getGallery } from '../services/api';

export const Home = ({ settings }) => {
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadersRes, membersRes, activitiesRes, galleryRes] = await Promise.all([
          getLeaders(),
          getMembers(),
          getActivities(),
          getGallery()
        ]);
        setLeaders(leadersRes.data || []);
        setMembers(membersRes.data || []);
        setActivities(activitiesRes.data || []);
        setGallery(galleryRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroImage = settings?.hero_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80';
  const tagline = settings?.tagline || 'Unity • Service • Youth • Community';

  const stats = [
    { title: 'Executive Leaders', count: '4 Leaders', subtitle: 'President, Vice President & Managers', icon: Award, color: 'text-amber-400 border-amber-500/30' },
    { title: 'Total Members', count: `${members.length || 8}+ Members`, subtitle: 'Active Youth & Volunteers', icon: Users, color: 'text-emerald-400 border-emerald-500/30' },
    { title: 'Community Activities', count: `${activities.length || 5}+ Projects`, subtitle: 'Sports, Cleanliness & Welfare', icon: Trophy, color: 'text-blue-400 border-blue-500/30' },
    { title: 'Years of Service', count: '10+ Years', subtitle: 'Dedicated to Barapada Village', icon: Heart, color: 'text-rose-400 border-rose-500/30' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section pt-20 pb-12 sm:pt-24 sm:pb-16 bg-brand-blue-950">
        
        {/* Fallback Background Image behind video */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0 pointer-events-none"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>

        {/* Hero Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          className="hero-background-video"
          ref={(video) => {
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
            }
          }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark Cinematic Semi-Transparent Overlay (Calibrated for visible video + clear text) */}
        <div className="hero-video-overlay bg-gradient-to-b from-[#05162d]/50 via-[#05162d]/50 to-[#05162d]/75"></div>

        {/* Hero Decorative Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none z-10"></div>

        <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-500/10 border border-amber-400/40 backdrop-blur-md mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-amber-300">
              Official Village Youth Committee • Barapada
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-white text-3xl sm:text-5xl md:text-6xl leading-[1.15] tracking-tight uppercase mb-4 drop-shadow-md">
            MAA &nbsp; AMBIKA  &nbsp;YOUTH CLUB <span className="text-amber-400 block sm:inline">BARAPADA</span>
          </h1>

          {/* Motto & Tagline */}
          <p className="font-display text-base sm:text-xl md:text-2xl font-bold text-amber-300 mb-2 italic">
            “Together for Our Village, Together for Our Future”
          </p>

          <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-300 tracking-wider uppercase mb-8">
            {tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            <Link
              to="/leadership"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-brand-blue-950 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 flex-shrink-0" /> Meet Our Leaders
            </Link>
            <Link
              to="/members"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              View Members
            </Link>
            <Link
              to="/activities"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 flex-shrink-0" /> Our Activities
            </Link>
          </div>

        </div>
      </section>

      {/* 2. SHORT INTRODUCTION & STATS */}
      <section className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 text-center mb-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">About Our Organization</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-blue-950">
              Empowering Barapada Through Unity & Service
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
              “Maa Ambika Youth Club Barapada is a community-focused youth organization dedicated to unity, social service, cultural activities, sports, and the overall development of our village.”
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-brand-blue-900 rounded-2xl p-6 border border-white/10 text-white shadow-xl hover:border-amber-400/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300 mb-1">
                  {item.count}
                </div>
                <h3 className="font-bold text-base text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-300 font-medium">{item.subtitle}</p>
              </div>
            );
          })}
        </div>

      </section>

      {/* 3. EXECUTIVE LEADERS SPOTLIGHT */}
      <section className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Leadership Team
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-blue-950 mt-3">
              Executive Committee Officers
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Guided by dedicated leaders committed to integrity, youth welfare, and village advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.slice(0, 4).map((leader) => {
              const isPresident = leader.position === 'PRESIDENT';
              return (
                <div
                  key={leader.id}
                  className={`relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    isPresident ? 'ring-4 ring-amber-500 shadow-glow-saffron' : 'border border-slate-200'
                  }`}
                >
                  {isPresident && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-500 text-brand-blue-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-brand-blue-950" /> President
                    </div>
                  )}

                  {/* Profile Photo */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-200">
                    <img
                      src={leader.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        {leader.position}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-extrabold text-brand-blue-950 text-lg">
                      {leader.name}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                      {leader.description || 'Dedicated committee leader serving Barapada village.'}
                    </p>
                    {leader.phone && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-blue-900">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" /> Barapada • {leader.phone}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/leadership"
              className="inline-flex items-center gap-2 text-brand-blue-900 font-extrabold hover:text-amber-600 text-base transition-colors"
            >
              View Full Leadership Details <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. RECENT ACTIVITIES PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Community Initiatives
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-blue-950 mt-3">
                Recent Village Activities
              </h2>
            </div>
            <Link
              to="/activities"
              className="mt-4 md:mt-0 text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              See All Activities ({activities.length}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={act.photo_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-brand-blue-900/90 text-amber-400 font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md">
                    {act.date}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-brand-blue-950 text-lg leading-snug group-hover:text-amber-600 transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                  {act.location && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-3 border-t border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. GALLERY TEASER & CALL TO ACTION */}
      <section className="py-16 bg-brand-blue-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
            Capturing Memories of Barapada
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-8">
            Explore our rich collection of photos featuring cricket tournaments, blood donation camps, cultural pujas, and village tree plantation drives.
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-brand-blue-950 bg-amber-500 hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-transform transform hover:scale-105"
          >
            Explore Photo Gallery <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
