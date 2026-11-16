import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { capitalize } from '../utils/formatters';

const STYLES = ['solo', 'family', 'romantic', 'adventure', 'budget'];

const Profile = () => {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    password: '',
    preferences: {
      travelStyle: user?.preferences?.travelStyle || [],
      budgetRange: user?.preferences?.budgetRange || 'medium',
    },
  });
  const [saving, setSaving] = useState(false);

  const toggleStyle = (style) => {
    const current = form.preferences.travelStyle;
    const updated = current.includes(style) ? current.filter((s) => s !== style) : [...current, style];
    setForm({ ...form, preferences: { ...form.preferences, travelStyle: updated } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await updateProfile(payload);
      updateUserLocal(data.data);
      toast.success('Profile updated successfully!');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+91 XXXXX XXXXX" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            maxLength={300}
            className="input-field"
            placeholder="Tell us about your travel personality..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Preferred Travel Styles</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => toggleStyle(style)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  form.preferences.travelStyle.includes(style)
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {capitalize(style)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Budget Range</label>
          <select
            value={form.preferences.budgetRange}
            onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, budgetRange: e.target.value } })}
            className="input-field"
          >
            <option value="low">Budget</option>
            <option value="medium">Mid-range</option>
            <option value="high">Luxury</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">New Password (optional)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.form>
    </div>
  );
};

export default Profile;
