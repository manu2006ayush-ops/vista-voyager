import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { fetchWishlist } from '../services/wishlistService';
import DestinationCard from '../components/DestinationCard';
import { DestinationGridSkeleton } from '../components/Skeletons';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchWishlist()
      .then(({ data }) => setItems(data.data.destinations.filter((d) => d.destination)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Destinations you've saved for later</p>

      <div className="mt-8">
        {loading ? (
          <DestinationGridSkeleton count={6} />
        ) : items.length === 0 ? (
          <div className="card flex flex-col items-center p-16 text-center">
            <FiHeart className="mb-4 text-slate-300" size={40} />
            <p className="text-lg font-semibold">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-slate-500">Save destinations you love to plan them later.</p>
            <Link to="/explore" className="btn-primary mt-6">
              Explore Destinations <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <DestinationCard key={item.destination._id} destination={item.destination} isWishlisted onWishlistChange={load} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
