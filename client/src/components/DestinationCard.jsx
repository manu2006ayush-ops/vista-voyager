import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist } from '../services/wishlistService';
import { formatCurrency, categoryColors, capitalize } from '../utils/formatters';

const DestinationCard = ({ destination, isWishlisted = false, onWishlistChange, index = 0 }) => {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save destinations');
      return;
    }
    setLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(destination._id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(destination._id);
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="card group overflow-hidden"
    >
      <Link to={`/destinations/${destination.slug}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={destination.coverImage || destination.images?.[0]}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={toggleWishlist}
            disabled={loading}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur transition hover:scale-110"
          >
            <FiHeart className={wishlisted ? 'fill-red-500 text-red-500' : ''} size={16} />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800">
            <FiStar className="fill-amber-400 text-amber-400" size={12} />
            {destination.rating?.toFixed(1) || 'New'}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{destination.name}</h3>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(destination.avgBudgetPerDay?.medium)}/day
            </span>
          </div>
          <p className="mb-3 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <FiMapPin size={13} /> {destination.city}, {destination.state}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {destination.categories?.slice(0, 3).map((cat) => (
              <span key={cat} className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[cat]}`}>
                {capitalize(cat)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
