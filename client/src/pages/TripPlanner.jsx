import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMapPin, FiClock, FiDollarSign, FiUsers, FiCheckCircle, FiZap } from 'react-icons/fi';
import { fetchDestinations } from '../services/destinationService';
import { generateItinerary } from '../services/itineraryService';
import { estimateBudget } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, capitalize } from '../utils/formatters';
import useDebounce from '../hooks/useDebounce';

const TRIP_TYPES = ['solo', 'family', 'romantic', 'adventure', 'budget'];

const TripPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [options, setOptions] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [form, setForm] = useState({ duration: 3, tripType: 'solo', budgetLevel: 'medium', travelers: 1 });
  const [budget, setBudget] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preselect = searchParams.get('destination');
    if (preselect) {
      fetchDestinations({ search: preselect, limit: 1 }).then(({ data }) => {
        if (data.data[0]) setSelectedDestination(data.data[0]);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedSearch.length > 1) {
      fetchDestinations({ search: debouncedSearch, limit: 6 }).then(({ data }) => setOptions(data.data));
    } else {
      setOptions([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedDestination) {
      estimateBudget({
        destinationId: selectedDestination._id,
        duration: form.duration,
        budgetLevel: form.budgetLevel,
        travelers: form.travelers,
      })
        .then(({ data }) => setBudget(data.data))
        .catch(() => {});
    }
  }, [selectedDestination, form.duration, form.budgetLevel, form.travelers]);

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please log in to generate an AI itinerary');
      navigate('/login');
      return;
    }
    if (!selectedDestination) {
      toast.error('Please select a destination first');
      return;
    }
    setLoading(true);
    setItinerary(null);
    try {
      const { data } = await generateItinerary({
        destinationId: selectedDestination._id,
        duration: form.duration,
        tripType: form.tripType,
        budgetLevel: form.budgetLevel,
        travelers: form.travelers,
      });
      setItinerary(data.data);
      toast.success('Your AI itinerary is ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/30 px-4 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
          <FiZap size={12} /> AI-Powered
        </span>
        <h1 className="text-3xl font-bold sm:text-4xl">Plan Your Perfect Trip</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Get a personalized, day-wise itinerary in seconds</p>
      </div>

      <div className="card space-y-6 p-6 sm:p-8">
        {/* Destination search */}
        <div className="relative">
          <label className="mb-1.5 block text-sm font-medium">Destination</label>
          {selectedDestination ? (
            <div className="flex items-center justify-between rounded-xl border border-primary-300 bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
              <span className="flex items-center gap-2 font-medium">
                <FiMapPin className="text-primary-500" /> {selectedDestination.name}, {selectedDestination.state}
              </span>
              <button onClick={() => setSelectedDestination(null)} className="text-sm text-primary-600 underline">
                Change
              </button>
            </div>
          ) : (
            <>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a destination (e.g. Goa, Manali)..."
                className="input-field"
              />
              {options.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
                  {options.map((d) => (
                    <button
                      key={d._id}
                      onClick={() => {
                        setSelectedDestination(d);
                        setSearchTerm('');
                        setOptions([]);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <FiMapPin className="text-slate-400" size={14} /> {d.name}, {d.state}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              <FiClock size={14} /> Duration (days)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              <FiUsers size={14} /> Travelers
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.travelers}
              onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Trip Type</label>
            <select value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })} className="input-field">
              {TRIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {capitalize(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              <FiDollarSign size={14} /> Budget Level
            </label>
            <select value={form.budgetLevel} onChange={(e) => setForm({ ...form, budgetLevel: e.target.value })} className="input-field">
              <option value="low">Budget</option>
              <option value="medium">Mid-range</option>
              <option value="high">Luxury</option>
            </select>
          </div>
        </div>

        {budget && (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
            <p className="mb-2 text-sm font-semibold">Estimated Trip Budget: {formatCurrency(budget.totalEstimated)}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries(budget.breakdown).map(([key, val]) => (
                <div key={key} className="rounded-lg bg-white dark:bg-slate-900 p-2 text-center">
                  <p className="text-xs capitalize text-slate-500">{key}</p>
                  <p className="text-sm font-bold">{formatCurrency(val)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading || !selectedDestination} className="btn-primary w-full">
          {loading ? 'Generating your itinerary...' : 'Generate AI Itinerary'} <FiZap />
        </button>
      </div>

      <AnimatePresence>
        {itinerary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">{itinerary.title}</h2>
              <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400">
                Total: {formatCurrency(itinerary.totalEstimatedBudget)}
              </span>
            </div>

            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: day.day * 0.05 }}
                  className="card p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold">
                      Day {day.day}: {day.title}
                    </h3>
                    <span className="text-sm font-semibold text-primary-600">{formatCurrency(day.estimatedDayCost)}</span>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 border-l-2 border-primary-300 pl-4">
                        <FiCheckCircle className="mt-0.5 text-primary-500" size={16} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{act.time} — {act.activity}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(act.estimatedCost)} · {capitalize(act.category)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripPlanner;
