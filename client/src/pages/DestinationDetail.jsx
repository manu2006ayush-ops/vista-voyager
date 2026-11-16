import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchDestinationBySlug } from '../services/destinationService';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, categoryColors, capitalize } from '../utils/formatters';
import { DetailPageSkeleton } from '../components/Skeletons';
import WeatherWidget from '../components/WeatherWidget';
import MapView from '../components/MapView';
import ReviewList from '../components/ReviewList';
import DestinationCard from '../components/DestinationCard';

const DestinationDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchDestinationBySlug(slug)
      .then(({ data }) => {
        setDestination(data.data);
        setSimilar(data.similar || []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user && destination) {
      fetchWishlist()
        .then(({ data }) => setWishlisted(data.data.destinations.some((d) => d.destination?._id === destination._id)))
        .catch(() => {});
    }
  }, [user, destination]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to save destinations');
      return;
    }
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <DetailPageSkeleton />;
  if (!destination) return <div className="p-20 text-center">Destination not found.</div>;

  const images = destination.images?.length ? destination.images : [destination.coverImage];

  return (
    <div>
      {/* Hero Gallery */}
      <div className="relative h-[50vh] w-full overflow-hidden sm:h-[60vh]">
        <img src={images[activeImage]} alt={destination.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 flex flex-wrap gap-2">
              {destination.categories?.map((cat) => (
                <span key={cat} className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[cat]}`}>
                  {capitalize(cat)}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{destination.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-white/90">
              <FiMapPin /> {destination.city}, {destination.state}
            </p>
          </motion.div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-2 w-2 rounded-full ${activeImage === i ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="card p-4 text-center">
                <FiStar className="mx-auto mb-1 fill-amber-400 text-amber-400" />
                <p className="text-lg font-bold">{destination.rating?.toFixed(1) || 'New'}</p>
                <p className="text-xs text-slate-500">{destination.numReviews} reviews</p>
              </div>
              <div className="card p-4 text-center">
                <FiCalendar className="mx-auto mb-1 text-primary-500" />
                <p className="text-lg font-bold">{destination.idealTripDuration} days</p>
                <p className="text-xs text-slate-500">Ideal duration</p>
              </div>
              <div className="card p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-lg font-bold text-primary-600">{formatCurrency(destination.avgBudgetPerDay?.medium)}</p>
                <p className="text-xs text-slate-500">Avg. per day</p>
              </div>
              <div className="card p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-sm font-bold">{destination.bestTimeToVisit}</p>
                <p className="text-xs text-slate-500">Best time to visit</p>
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-display text-2xl font-semibold">About {destination.name}</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{destination.description}</p>
            </div>

            {destination.activities?.length > 0 && (
              <div>
                <h3 className="mb-3 font-display text-xl font-semibold">Top Activities</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {destination.activities.map((act) => (
                    <div key={act} className="card flex items-center gap-2 px-4 py-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-primary-500" /> {act}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 font-display text-xl font-semibold">Location</h3>
              <MapView lat={destination.location?.lat} lng={destination.location?.lng} name={destination.name} />
            </div>

            <ReviewList destinationId={destination._id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-5">
              <button onClick={toggleWishlist} className="btn-secondary mb-3 w-full">
                <FiHeart className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
                {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
              <Link to={`/trip-planner?destination=${destination.slug}`} className="btn-primary w-full">
                Plan AI Itinerary <FiArrowRight />
              </Link>
            </div>

            <WeatherWidget slug={destination.slug} />

            {destination.nearbyAttractions?.length > 0 && (
              <div className="card p-5">
                <h4 className="mb-3 font-semibold">Nearby Attractions</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {destination.nearbyAttractions.map((n) => (
                    <li key={n} className="flex items-center gap-2">
                      <FiMapPin size={13} className="text-primary-500" /> {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-semibold">You might also like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((dest, i) => (
                <DestinationCard key={dest._id} destination={dest} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;
