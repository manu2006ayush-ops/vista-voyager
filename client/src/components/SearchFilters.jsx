import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { fetchFilterMeta } from '../services/destinationService';
import { capitalize } from '../utils/formatters';

const CATEGORIES = ['solo', 'family', 'romantic', 'adventure', 'budget'];

const SearchFilters = ({ filters, onChange }) => {
  const [meta, setMeta] = useState({ states: [], categories: CATEGORIES });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchFilterMeta()
      .then(({ data }) => setMeta(data.data))
      .catch(() => {});
  }, []);

  const toggleCategory = (cat) => {
    const current = filters.category ? filters.category.split(',') : [];
    const updated = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    onChange({ ...filters, category: updated.join(','), page: 1 });
  };

  const activeCategories = filters.category ? filters.category.split(',') : [];

  const clearFilters = () => onChange({ search: '', category: '', state: '', minBudget: '', maxBudget: '', page: 1 });

  const FilterBody = (
    <>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search destinations, cities, states..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className="input-field pl-10"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Travel Style</p>
        <div className="flex flex-wrap gap-2">
          {(meta.categories || CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeCategories.includes(cat)
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400'
              }`}
            >
              {capitalize(cat)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">State</p>
        <select
          value={filters.state || ''}
          onChange={(e) => onChange({ ...filters, state: e.target.value, page: 1 })}
          className="input-field"
        >
          <option value="">All States</option>
          {meta.states?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Budget per day (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minBudget || ''}
            onChange={(e) => onChange({ ...filters, minBudget: e.target.value, page: 1 })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxBudget || ''}
            onChange={(e) => onChange({ ...filters, maxBudget: e.target.value, page: 1 })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Sort by</p>
        <select
          value={filters.sortBy || 'popularity'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="input-field"
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      <button onClick={clearFilters} className="btn-secondary w-full text-sm">
        <FiX size={14} /> Clear filters
      </button>
    </>
  );

  return (
    <>
      <div className="hidden lg:block card space-y-5 p-5">{FilterBody}</div>

      <div className="lg:hidden">
        <button onClick={() => setShowMobileFilters(true)} className="btn-secondary w-full">
          <FiFilter size={16} /> Filters
        </button>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50">
            <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white dark:bg-slate-900 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <FiX size={20} />
                </button>
              </div>
              {FilterBody}
              <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchFilters;
