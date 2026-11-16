import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiCompass, FiMap, FiCpu, FiDollarSign, FiCloud, FiArrowRight } from 'react-icons/fi';
import { fetchFeaturedDestinations } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import { DestinationGridSkeleton } from '../components/Skeletons';

const features = [
  { icon: <FiCpu />, title: 'AI Trip Planner', desc: 'Get a personalized day-wise itinerary generated instantly for any destination.' },
  { icon: <FiDollarSign />, title: 'Budget Planner', desc: 'Smart expense estimation broken down by category, before you even book.' },
  { icon: <FiCloud />, title: 'Live Weather', desc: 'Real-time weather and 7-day forecasts for every destination.' },
  { icon: <FiMap />, title: 'Interactive Maps', desc: 'Explore exact locations and nearby attractions on an interactive map.' },
];

const categories = [
  { key: 'solo', label: 'Solo', emoji: '🎒' },
  { key: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { key: 'romantic', label: 'Romantic', emoji: '💕' },
  { key: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { key: 'budget', label: 'Budget', emoji: '💰' },
];

const Landing = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchFeaturedDestinations()
      .then(({ data }) => setFeatured(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000"
          alt="Indian landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-hero-gradient" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-28 text-center sm:py-36">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
          >
            ✨ AI-Powered Travel Intelligence
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight text-white sm:text-6xl"
          >
            Discover India, <span className="text-primary-400">Intelligently</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-2xl text-lg text-slate-200"
          >
            Vista Voyager plans your perfect Indian getaway — personalized recommendations, AI itineraries, and budget planning, all in one place.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/explore?search=${encodeURIComponent(query)}`;
            }}
            className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl"
          >
            <FiSearch className="ml-2 text-slate-400" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Goa, Manali, Jaipur..."
              className="flex-1 bg-transparent px-2 py-2 text-slate-800 outline-none"
            />
            <button type="submit" className="btn-primary !py-2.5">
              Explore <FiArrowRight />
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={`/explore?category=${cat.key}`}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to plan smarter</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Powered by Vista Voyager's intelligent travel engine</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 text-xl">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-slate-100/60 dark:bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Trending Destinations</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Handpicked favorites across India</p>
            </div>
            <Link to="/explore" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 sm:flex">
              View all <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <DestinationGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((dest, i) => (
                <DestinationCard key={dest._id} destination={dest} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <FiCompass className="mx-auto mb-4 text-primary-500" size={40} />
        <h2 className="text-3xl font-bold sm:text-4xl">Ready to plan your next adventure?</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-500 dark:text-slate-400">
          Sign up free and let Voya, our AI assistant, build your personalized itinerary in seconds.
        </p>
        <Link to="/register" className="btn-primary mt-8 inline-flex">
          Get Started Free <FiArrowRight />
        </Link>
      </section>
    </div>
  );
};

export default Landing;
