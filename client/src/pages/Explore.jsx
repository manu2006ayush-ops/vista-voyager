import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDestinations } from '../services/destinationService';
import { fetchWishlist } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import SearchFilters from '../components/SearchFilters';
import DestinationCard from '../components/DestinationCard';
import { DestinationGridSkeleton } from '../components/Skeletons';

const Explore = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    sortBy: searchParams.get('sortBy') || 'popularity',
    page: Number(searchParams.get('page')) || 1,
  };

  const updateFilters = (newFilters) => {
    const cleaned = Object.fromEntries(Object.entries(newFilters).filter(([, v]) => v !== '' && v !== undefined && v !== null));
    setSearchParams(cleaned);
  };

  useEffect(() => {
    setLoading(true);
    fetchDestinations(filters)
      .then(({ data }) => {
        setDestinations(data.data);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchWishlist()
        .then(({ data }) => setWishlistIds(data.data.destinations.map((d) => d.destination?._id)))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Destination Explorer</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {pagination.total} destinations across India, ready to explore
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <SearchFilters filters={filters} onChange={updateFilters} />
        </div>

        <div>
          {loading ? (
            <DestinationGridSkeleton count={9} />
          ) : destinations.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-lg font-semibold">No destinations found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {destinations.map((dest, i) => (
                  <DestinationCard key={dest._id} destination={dest} isWishlisted={wishlistIds.includes(dest._id)} index={i} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilters({ ...filters, page: i + 1 })}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${
                        pagination.page === i + 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
