import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import {
  getLeaders, updateLeader,
  getMembers, addMember, updateMember, deleteMember,
  getActivities, addActivity, updateActivity, deleteActivity,
  getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
  getSettings, updateSettings,
  getMessages, deleteMessage,
  uploadSingleImage, uploadMultipleImages,
  changeAdminPassword
} from '../services/api';

import {
  LayoutDashboard, Users, UserCheck, Trophy, Image as ImageIcon, Settings,
  MessageSquare, LogOut, Plus, Edit, Trash2, Upload, Save, Check, X, Shield,
  Phone, Eye, Lock, Calendar, MapPin, AlertTriangle, ArrowUp, ArrowDown, Camera
} from 'lucide-react';

export const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  // Stats Data
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settingsData, setSettingsData] = useState({});

  // Modals & Active Edit States
  const [editLeaderModal, setEditLeaderModal] = useState(null);
  const [memberModal, setMemberModal] = useState({ open: false, data: null });
  const [activityModal, setActivityModal] = useState({ open: false, data: null });
  const [galleryModal, setGalleryModal] = useState({ open: false, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null, title: '' });

  // Password state
  const [passwordState, setPasswordState] = useState({ currentPassword: '', newPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [lRes, mRes, aRes, gRes, msgRes, sRes] = await Promise.all([
        getLeaders(),
        getMembers(),
        getActivities(),
        getGallery(),
        getMessages(),
        getSettings()
      ]);
      setLeaders(lRes.data || []);
      setMembers(mRes.data || []);
      setActivities(aRes.data || []);
      setGallery(gRes.data || []);
      setMessages(msgRes.data || []);
      setSettingsData(sRes.data || {});
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // ----------------------------------------------------
  // LEADER MANAGEMENT
  // ----------------------------------------------------
  const handleSaveLeader = async (e) => {
    e.preventDefault();
    try {
      await updateLeader(editLeaderModal.id, editLeaderModal);
      showToast(`Leader ${editLeaderModal.position} updated successfully!`);
      setEditLeaderModal(null);
      loadAllData();
    } catch (err) {
      showToast('Failed to update leader.', 'error');
    }
  };

  const handleLeaderPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadSingleImage(file);
      setEditLeaderModal({ ...editLeaderModal, photo_url: res.data.url });
      showToast('Leader photo uploaded successfully!');
    } catch (err) {
      showToast('Image upload failed.', 'error');
    }
  };

  // ----------------------------------------------------
  // MEMBER MANAGEMENT
  // ----------------------------------------------------
  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      if (memberModal.data?.id) {
        await updateMember(memberModal.data.id, memberModal.data);
        showToast('Member updated successfully!');
      } else {
        await addMember(memberModal.data);
        showToast('New committee member added!');
      }
      setMemberModal({ open: false, data: null });
      loadAllData();
    } catch (err) {
      showToast('Failed to save member details.', 'error');
    }
  };

  const handleMemberPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadSingleImage(file);
      setMemberModal({
        ...memberModal,
        data: { ...memberModal.data, photo_url: res.data.url }
      });
      showToast('Member photo uploaded!');
    } catch (err) {
      showToast('Image upload failed.', 'error');
    }
  };

  const confirmDeleteMember = (member) => {
    setDeleteConfirm({
      open: true,
      type: 'member',
      id: member.id,
      title: `Delete member "${member.name}"?`
    });
  };

  // ----------------------------------------------------
  // ACTIVITY MANAGEMENT
  // ----------------------------------------------------
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    try {
      if (activityModal.data?.id) {
        await updateActivity(activityModal.data.id, activityModal.data);
        showToast('Activity updated successfully!');
      } else {
        await addActivity(activityModal.data);
        showToast('New activity created successfully!');
      }
      setActivityModal({ open: false, data: null });
      loadAllData();
    } catch (err) {
      showToast('Failed to save activity.', 'error');
    }
  };

  const handleActivityPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadSingleImage(file);
      setActivityModal({
        ...activityModal,
        data: { ...activityModal.data, photo_url: res.data.url }
      });
      showToast('Activity image uploaded!');
    } catch (err) {
      showToast('Image upload failed.', 'error');
    }
  };

  const confirmDeleteActivity = (act) => {
    setDeleteConfirm({
      open: true,
      type: 'activity',
      id: act.id,
      title: `Delete activity "${act.title}"?`
    });
  };

  // ----------------------------------------------------
  // GALLERY MANAGEMENT
  // ----------------------------------------------------
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    try {
      if (galleryModal.data?.id) {
        await updateGalleryItem(galleryModal.data.id, galleryModal.data);
        showToast('Gallery item updated!');
      } else {
        await addGalleryItem(galleryModal.data);
        showToast('Photo added to gallery!');
      }
      setGalleryModal({ open: false, data: null });
      loadAllData();
    } catch (err) {
      showToast('Failed to save gallery item.', 'error');
    }
  };

  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadSingleImage(file);
      setGalleryModal({
        ...galleryModal,
        data: { ...galleryModal.data, image_url: res.data.url }
      });
      showToast('Gallery photo uploaded!');
    } catch (err) {
      showToast('Upload failed.', 'error');
    }
  };

  const confirmDeleteGalleryItem = (item) => {
    setDeleteConfirm({
      open: true,
      type: 'gallery',
      id: item.id,
      title: `Delete gallery photo "${item.caption || 'Photo'}"?`
    });
  };

  // ----------------------------------------------------
  // SETTINGS MANAGEMENT
  // ----------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settingsData);
      showToast('Website settings updated live!');
      loadAllData();
    } catch (err) {
      showToast('Failed to update website settings.', 'error');
    }
  };

  // ----------------------------------------------------
  // MESSAGES & GENERAL DELETE DISPATCH
  // ----------------------------------------------------
  const executeDelete = async () => {
    const { type, id } = deleteConfirm;
    try {
      if (type === 'member') await deleteMember(id);
      if (type === 'activity') await deleteActivity(id);
      if (type === 'gallery') await deleteGalleryItem(id);
      if (type === 'message') await deleteMessage(id);

      showToast('Item deleted successfully!');
      setDeleteConfirm({ open: false, type: '', id: null, title: '' });
      loadAllData();
    } catch (err) {
      showToast('Failed to delete item.', 'error');
    }
  };

  // Password Update Handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeAdminPassword(passwordState);
      showToast('Admin password updated successfully!');
      setPasswordState({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update password.', 'error');
    }
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'leaders', label: 'Leadership (4 Roles)', icon: UserCheck },
    { id: 'members', label: 'Committee Members', icon: Users },
    { id: 'activities', label: 'Village Activities', icon: Trophy },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquare },
    { id: 'security', label: 'Password Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-white text-sm leading-tight">
                BARAPADA CMS
              </h2>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Manage content for Maa Ambika Youth Club Barapada.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> View Live Site
          </a>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">4 Leaders</div>
                <div className="text-xs text-slate-400">President, VP, Manager, Cashier</div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{members.length} Members</div>
                <div className="text-xs text-slate-400">Active Committee Volunteers</div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{activities.length} Activities</div>
                <div className="text-xs text-slate-400">Community Projects & Events</div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">{gallery.length} Photos</div>
                <div className="text-xs text-slate-400">Categorized Gallery Photos</div>
              </div>

            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Quick Content Management</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => { setActiveTab('members'); setMemberModal({ open: true, data: { name: '', role: 'Active Member', description: '', photo_url: '' } }); }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Member
                </button>
                <button
                  onClick={() => { setActiveTab('activities'); setActivityModal({ open: true, data: { title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', photo_url: '' } }); }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Activity
                </button>
                <button
                  onClick={() => navigate('/admin/members-photo')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Member Photo Portal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADERSHIP (4 FIXED ROLES) */}
        {activeTab === 'leaders' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400">
              The executive leadership positions include <span className="text-amber-400 font-bold">PRESIDENT, VICE PRESIDENT, MANAGER</span>. Click Edit to update their name, photo, bio, and phone number.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={leader.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt={leader.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {leader.position}
                      </span>
                      <h3 className="font-bold text-white text-lg">{leader.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{leader.description}</p>
                      {leader.phone && <p className="text-xs text-amber-300 font-semibold">📞 {leader.phone}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditLeaderModal(leader)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Officer Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEMBERS MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Manage committee members, roles, and photos.</span>
              <button
                onClick={() => setMemberModal({ open: true, data: { name: '', role: 'Active Member', description: '', photo_url: '' } })}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50">
                      <td className="p-4">
                        <img src={m.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt="" className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="p-4 font-bold text-white">{m.name}</td>
                      <td className="p-4 text-amber-400">{m.role || 'Active Member'}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{m.description || '—'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setMemberModal({ open: true, data: m })}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDeleteMember(m)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITIES MANAGEMENT */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Manage village programs, sports meets, and social drives.</span>
              <button
                onClick={() => setActivityModal({ open: true, data: { title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', photo_url: '' } })}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Activity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((act) => (
                <div key={act.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-base">{act.title}</h3>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3">{act.description}</p>
                    {act.location && <p className="text-xs text-emerald-400 font-semibold">📍 {act.location}</p>}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setActivityModal({ open: true, data: act })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteActivity(act)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Upload photos, set captions, and assign categories.</span>
              <button
                onClick={() => setGalleryModal({ open: true, data: { caption: '', category: 'Events', image_url: '' } })}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  <img src={item.image_url} alt="" className="w-full h-40 object-cover" />
                  <div className="p-2 text-xs text-slate-300 truncate font-semibold bg-slate-900">{item.caption || 'Photo'}</div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => confirmDeleteGalleryItem(item)}
                      className="p-1.5 bg-rose-600 text-white rounded-md shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3">Public Website Configuration</h3>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Committee Name</label>
                  <input
                    type="text"
                    value={settingsData.committee_name || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, committee_name: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsData.tagline || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">About Text</label>
                <textarea
                  rows="3"
                  value={settingsData.about || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, about: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Our Vision</label>
                  <textarea
                    rows="3"
                    value={settingsData.vision || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, vision: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Our Mission (1 line per point)</label>
                  <textarea
                    rows="3"
                    value={settingsData.mission || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, mission: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={settingsData.phone || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Email</label>
                  <input
                    type="text"
                    value={settingsData.email || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Address</label>
                  <input
                    type="text"
                    value={settingsData.address || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Website Settings
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: VISITOR MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <span className="text-xs text-slate-400">Messages submitted by visitors on public contact form.</span>

            {messages.length === 0 ? (
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center text-slate-500">
                No visitor messages received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{msg.name}</h4>
                        <p className="text-xs text-amber-400 font-semibold">Contact: {msg.contact}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, type: 'message', id: msg.id, title: 'Delete this message?' })}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl leading-relaxed">{msg.message}</p>
                    <span className="text-[10px] text-slate-500">{msg.created_at}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: PASSWORD SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-lg space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3">Change Admin Password</h3>
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </form>
          </div>
        )}

      </main>

      {/* EDIT LEADER MODAL */}
      {editLeaderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-xs">
            <h3 className="font-bold text-white text-lg">Edit Leader: {editLeaderModal.position}</h3>
            <form onSubmit={handleSaveLeader} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editLeaderModal.name}
                  onChange={(e) => setEditLeaderModal({ ...editLeaderModal, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Photo Upload</label>
                <input type="file" accept="image/*" onChange={handleLeaderPhotoUpload} className="text-slate-400 mb-2" />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={editLeaderModal.photo_url || ''}
                  onChange={(e) => setEditLeaderModal({ ...editLeaderModal, photo_url: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Description / Bio</label>
                <textarea
                  rows="3"
                  value={editLeaderModal.description || ''}
                  onChange={(e) => setEditLeaderModal({ ...editLeaderModal, description: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editLeaderModal.phone || ''}
                  onChange={(e) => setEditLeaderModal({ ...editLeaderModal, phone: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditLeaderModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold"
                >
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {memberModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-xs">
            <h3 className="font-bold text-white text-lg">
              {memberModal.data?.id ? 'Edit Committee Member' : 'Add New Member'}
            </h3>
            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Member Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberModal.data?.name || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, name: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Sports Coordinator, Active Member"
                  value={memberModal.data?.role || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, role: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Photo Upload</label>
                <input type="file" accept="image/*" onChange={handleMemberPhotoUpload} className="text-slate-400 mb-2" />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={memberModal.data?.photo_url || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, photo_url: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={memberModal.data?.description || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, data: { ...memberModal.data, description: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMemberModal({ open: false, data: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {activityModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-xs">
            <h3 className="font-bold text-white text-lg">
              {activityModal.data?.id ? 'Edit Activity' : 'Create Village Activity'}
            </h3>
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  value={activityModal.data?.title || ''}
                  onChange={(e) => setActivityModal({ ...activityModal, data: { ...activityModal.data, title: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={activityModal.data?.date || ''}
                    onChange={(e) => setActivityModal({ ...activityModal, data: { ...activityModal.data, date: e.target.value } })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={activityModal.data?.location || ''}
                    onChange={(e) => setActivityModal({ ...activityModal, data: { ...activityModal.data, location: e.target.value } })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Photo Upload</label>
                <input type="file" accept="image/*" onChange={handleActivityPhotoUpload} className="text-slate-400 mb-2" />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={activityModal.data?.photo_url || ''}
                  onChange={(e) => setActivityModal({ ...activityModal, data: { ...activityModal.data, photo_url: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows="4"
                  value={activityModal.data?.description || ''}
                  onChange={(e) => setActivityModal({ ...activityModal, data: { ...activityModal.data, description: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActivityModal({ open: false, data: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-xs">
            <h3 className="font-bold text-white text-lg">Add Photo to Gallery</h3>
            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Category</label>
                <select
                  value={galleryModal.data?.category || 'Events'}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, category: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Committee">Committee</option>
                  <option value="Leaders">Leaders</option>
                  <option value="Members">Members</option>
                  <option value="Events">Events</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural Programs">Cultural Programs</option>
                  <option value="Village Activities">Village Activities</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Image Upload</label>
                <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="text-slate-400 mb-2" />
                <input
                  type="text"
                  placeholder="Image URL"
                  required
                  value={galleryModal.data?.image_url || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, image_url: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Caption</label>
                <input
                  type="text"
                  placeholder="Describe this photo..."
                  value={galleryModal.data?.caption || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, caption: e.target.value } })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setGalleryModal({ open: false, data: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-extrabold"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 w-full max-w-sm text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="font-bold text-white text-base">{deleteConfirm.title}</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ open: false, type: '', id: null, title: '' })}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-extrabold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};
