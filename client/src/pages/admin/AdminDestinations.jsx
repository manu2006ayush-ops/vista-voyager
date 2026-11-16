import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { fetchAllDestinationsAdmin } from '../../services/adminService';
import { createDestination, updateDestination, deleteDestination } from '../../services/destinationService';
import { CardRowSkeleton } from '../../components/Skeletons';
import { formatCurrency, capitalize } from '../../utils/formatters';

const emptyForm = {
  name: '',
  state: '',
  city: '',
  description: '',
  shortDescription: '',
  coverImage: '',
  location: { lat: '', lng: '' },
  categories: [],
  bestTimeToVisit: '',
  avgBudgetPerDay: { low: 1500, medium: 3500, high: 8000 },
  idealTripDuration: 3,
};

const CATEGORIES = ['solo', 'family', 'romantic', 'adventure', 'budget'];

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllDestinationsAdmin()
      .then(({ data }) => setDestinations(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (dest) => {
    setForm({
      name: dest.name,
      state: dest.state,
      city: dest.city,
      description: dest.description,
      shortDescription: dest.shortDescription || '',
      coverImage: dest.coverImage || '',
      location: dest.location,
      categories: dest.categories || [],
      bestTimeToVisit: dest.bestTimeToVisit || '',
      avgBudgetPerDay: dest.avgBudgetPerDay,
      idealTripDuration: dest.idealTripDuration || 3,
    });
    setEditingId(dest._id);
    setShowForm(true);
  };

  const toggleCategory = (cat) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        location: { lat: Number(form.location.lat), lng: Number(form.location.lng) },
        avgBudgetPerDay: {
          low: Number(form.avgBudgetPerDay.low),
          medium: Number(form.avgBudgetPerDay.medium),
          high: Number(form.avgBudgetPerDay.high),
        },
        idealTripDuration: Number(form.idealTripDuration),
      };

      if (editingId) {
        await updateDestination(editingId, payload);
        toast.success('Destination updated');
      } else {
        await createDestination(payload);
        toast.success('Destination created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this destination?')) return;
    try {
      await deleteDestination(id);
      toast.success('Destination removed');
      load();
    } catch (err) {
      toast.error('Failed to delete destination');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Destination Management</h3>
        <button onClick={openCreate} className="btn-primary text-sm !px-4 !py-2">
          <FiPlus /> Add Destination
        </button>
      </div>

      {showForm && (
        <div className="card space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{editingId ? 'Edit Destination' : 'New Destination'}</h4>
            <button onClick={() => setShowForm(false)}>
              <FiX />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            <input placeholder="Cover Image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="input-field" />
            <input
              required
              type="number"
              step="any"
              placeholder="Latitude"
              value={form.location.lat}
              onChange={(e) => setForm({ ...form, location: { ...form.location, lat: e.target.value } })}
              className="input-field"
            />
            <input
              required
              type="number"
              step="any"
              placeholder="Longitude"
              value={form.location.lng}
              onChange={(e) => setForm({ ...form, location: { ...form.location, lng: e.target.value } })}
              className="input-field"
            />
            <textarea
              required
              placeholder="Full description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field sm:col-span-2"
              rows={3}
            />
            <input placeholder="Best time to visit" value={form.bestTimeToVisit} onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })} className="input-field" />
            <input
              type="number"
              placeholder="Ideal trip duration (days)"
              value={form.idealTripDuration}
              onChange={(e) => setForm({ ...form, idealTripDuration: e.target.value })}
              className="input-field"
            />

            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      form.categories.includes(cat) ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {capitalize(cat)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <input
                type="number"
                placeholder="Budget (low)"
                value={form.avgBudgetPerDay.low}
                onChange={(e) => setForm({ ...form, avgBudgetPerDay: { ...form.avgBudgetPerDay, low: e.target.value } })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Budget (medium)"
                value={form.avgBudgetPerDay.medium}
                onChange={(e) => setForm({ ...form, avgBudgetPerDay: { ...form.avgBudgetPerDay, medium: e.target.value } })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Budget (high)"
                value={form.avgBudgetPerDay.high}
                onChange={(e) => setForm({ ...form, avgBudgetPerDay: { ...form.avgBudgetPerDay, high: e.target.value } })}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">
              {saving ? 'Saving...' : editingId ? 'Update Destination' : 'Create Destination'}
            </button>
          </form>
        </div>
      )}

      <div className="card p-6">
        {loading ? (
          <CardRowSkeleton count={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase text-slate-400">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">State</th>
                  <th className="pb-3">Avg Budget</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium">{d.name}</td>
                    <td className="py-3 text-slate-500">{d.state}</td>
                    <td className="py-3">{formatCurrency(d.avgBudgetPerDay.medium)}</td>
                    <td className="py-3">⭐ {d.rating?.toFixed(1) || 'New'}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(d)} className="text-slate-400 hover:text-primary-500">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(d._id)} className="text-slate-400 hover:text-red-500">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDestinations;
