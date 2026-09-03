import React, { useState } from 'react';
import { sendMessage } from '../services/api';
import { Toast } from '../components/Toast';
import { MapPin, Phone, Mail, Send, Facebook, Instagram, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Contact = ({ settings }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const committeeName = settings?.committee_name || 'MAA AMBIKA YOUTH CLUB BARAPADA';
  const address = settings?.address || 'At: Barapada, Po: Saudia, District: Jajpur, Odisha - 754279';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'maaambikayouthclub@gmail.com';
  const mapUrl = settings?.map_url || 'https://maps.google.com/?q=Barapada,Saudia,Jajpur,Odisha';
  const fbUrl = settings?.facebook_url || 'https://facebook.com';
  const instaUrl = settings?.instagram_url || 'https://instagram.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendMessage(formData);
      setToast({ message: res.data.message || 'Your message has been sent successfully!', type: 'success' });
      setFormData({ name: '', contact: '', message: '' });
    } catch (err) {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Banner */}
      <section className="bg-brand-blue-950 text-white py-16 mb-12 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Reach Barapada Committee
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-4 tracking-tight">
            Contact & Location Details
          </h1>
          <p className="text-amber-300 font-semibold text-base sm:text-lg mt-2">
            Village: Barapada
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-black uppercase text-amber-600">Official Office</span>
                <h3 className="font-display font-extrabold text-2xl text-brand-blue-950 mt-1">
                  {committeeName}
                </h3>
                <p className="text-xs font-bold text-emerald-600 mt-1">Village: Barapada</p>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-blue-950">Village Address</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-blue-950">Phone Contact</h4>
                    <a href={`tel:${phone}`} className="text-amber-600 hover:underline text-xs font-semibold">{phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-blue-950">Email Address</h4>
                    <a href={`mailto:${email}`} className="text-amber-600 hover:underline text-xs font-semibold break-all">{email}</a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Connect With Us:</span>
                <div className="flex items-center gap-3">
                  <a href={fbUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href={instaUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Button Card */}
            <div className="bg-brand-blue-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl flex items-center justify-between">
              <div>
                <h4 className="font-display font-extrabold text-amber-300">Google Maps Location</h4>
                <p className="text-xs text-slate-300 mt-1">Locate Barapada Village on Maps</p>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-brand-blue-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Open Map
              </a>
            </div>

          </div>

          {/* Right Column: Public Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
              <span className="text-xs font-black uppercase text-amber-600">Send Message</span>
              <h3 className="font-display font-extrabold text-2xl text-brand-blue-950 mt-1 mb-6">
                Get in Touch with Committee Leadership
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number or Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 9876543210 or yourname@gmail.com"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Message / Query *
                  </label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Write your message or inquiry for Barapada Youth Committee..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-brand-blue-950 font-extrabold text-base shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Sending Message...' : 'Submit Message'}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};
