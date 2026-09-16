import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
  uploadSingleImage
} from '../services/api';
import {
  Camera,
  Upload,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Eye,
  Trash2,
  Users,
  Image as ImageIcon,
  Shield,
  Loader2,
  X
} from 'lucide-react';

export const MemberPhotoManager = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'with_photo', 'missing_photo'
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [uploadingId, setUploadingId] = useState(null); // Tracks member ID currently uploading

  // Add Member Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', photo_url: '', role: 'Active Member', description: '' });
  const [modalUploading, setModalUploading] = useState(false);

  // Hidden file input refs for 1-click photo replacement
  const fileInputRefs = useRef({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers();
      setMembers(res.data || []);
    } catch (err) {
      console.error('Failed to load members:', err);
      showToast('Failed to load member list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // 1-Click Photo Upload for an existing member
  const handleDirectPhotoUpload = async (member, file) => {
    if (!file) return;
    try {
      setUploadingId(member.id);
      showToast(`Uploading photo for ${member.name}...`, 'info');
      
      const res = await uploadSingleImage(file);
      const newPhotoUrl = res.data.url;

      await updateMember(member.id, {
        ...member,
        photo_url: newPhotoUrl
      });

      showToast(`Photo for "${member.name}" updated successfully!`);
      loadMembers();
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.response?.data?.error || 'Photo upload failed.', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  // Photo upload inside Add Member modal
  const handleModalPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setModalUploading(true);
      const res = await uploadSingleImage(file);
      setNewMember((prev) => ({ ...prev, photo_url: res.data.url }));
      showToast('Photo uploaded to Cloudinary!');
    } catch (err) {
      console.error('Modal upload error:', err);
      showToast(err.response?.data?.error || 'Photo upload failed.', 'error');
    } finally {
      setModalUploading(false);
    }
  };

  // Submit Add Member form
  const handleSaveNewMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) {
      showToast('Please enter the member name.', 'error');
      return;
    }
    try {
      await addMember(newMember);
      showToast(`Member "${newMember.name}" added successfully!`);
      setAddModalOpen(false);
      setNewMember({ name: '', photo_url: '', role: 'Active Member', description: '' });
      loadMembers();
    } catch (err) {
      console.error('Save member error:', err);
      showToast(err.response?.data?.error || 'Failed to save member.', 'error');
    }
  };

  // Quick member delete
  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove member "${name}"?`)) return;
    try {
      await deleteMember(id);
      showToast(`Member "${name}" removed.`);
      loadMembers();
    } catch (err) {
      console.error('Delete member error:', err);
      showToast('Failed to delete member.', 'error');
    }
  };

  // Filtering & Search
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasPhoto = Boolean(m.photo_url && m.photo_url.trim() !== '');

    if (filter === 'with_photo') return matchesSearch && hasPhoto;
    if (filter === 'missing_photo') return matchesSearch && !hasPhoto;
    return matchesSearch;
  });

  const totalMembers = members.length;
  const withPhotoCount = members.filter((m) => m.photo_url && m.photo_url.trim() !== '').length;
  const missingPhotoCount = totalMembers - withPhotoCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* TOP NAVBAR */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                MAA AMBIKA YOUTH CLUB
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Photo Manager
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Dedicated Member Photo Upload Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/members"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Members Page
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* METRICS & QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Members</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalMembers}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Photos Uploaded</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{withPhotoCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Missing Photos</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{missingPhotoCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, ADD BUTTON */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All ({totalMembers})
            </button>
            <button
              onClick={() => setFilter('with_photo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === 'with_photo'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              With Photo ({withPhotoCount})
            </button>
            <button
              onClick={() => setFilter('missing_photo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === 'missing_photo'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Missing Photo ({missingPhotoCount})
            </button>
          </div>

          {/* Add Member Button */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Member & Photo
          </button>
        </div>

        {/* MEMBER PHOTO GRID */}
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-medium">Loading committee members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-white text-base">No Members Found</h3>
            <p className="text-xs text-slate-400">Try changing your search keyword or active filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => {
              const isUploading = uploadingId === member.id;
              const hasPhoto = Boolean(member.photo_url && member.photo_url.trim() !== '');

              return (
                <div
                  key={member.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
                    {hasPhoto ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 space-y-2 p-4 text-center">
                        <Camera className="w-12 h-12 stroke-[1.5]" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          No Photo Uploaded
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

                    {/* Loading Overlay */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 space-y-2 z-20">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                      </div>
                    )}

                    {/* Top Status Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        {member.role || 'Active Member'}
                      </span>
                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        title="Delete Member"
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Name inside photo */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h4 className="font-display font-black text-white text-base truncate">
                        {member.name}
                      </h4>
                    </div>
                  </div>

                  {/* Upload / Replace Action Bar */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[member.id] = el)}
                      onChange={(e) => handleDirectPhotoUpload(member, e.target.files[0])}
                      className="hidden"
                    />

                    <button
                      disabled={isUploading}
                      onClick={() => fileInputRefs.current[member.id]?.click()}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        hasPhoto
                          ? 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-500'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {hasPhoto ? 'Change Photo' : 'Upload Photo'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ADD MEMBER MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-white text-base">Add New Member</h3>
                  <p className="text-[11px] text-slate-400">Provide name and upload photo</p>
                </div>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMember} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shri Rajesh Kumar"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Member Photo
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModalPhotoUpload}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />

                  {modalUploading && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                    </div>
                  )}

                  {newMember.photo_url && (
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden border border-slate-700">
                      <img src={newMember.photo_url} alt="Preview" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalUploading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Save Member
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MemberPhotoManager;
