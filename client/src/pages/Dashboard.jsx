import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMap, FiHeart, FiCalendar, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { fetchDashboard } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { CardRowSkeleton } from '../components/Skeletons';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div whileHover={{ y: -4 }} className="card p-5">
    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-lg ${color}`}>{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Here's an overview of your travel plans</p>

      {loading ? (
        <div className="mt-8"><CardRowSkeleton count={4} /></div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<FiCalendar />} label="Upcoming Trips" value={data?.stats.upcomingTrips ?? 0} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
            <StatCard icon={<FiMap />} label="Total Trips" value={data?.stats.totalTrips ?? 0} color="bg-green-100 text-green-600 dark:bg-green-900/30" />
            <StatCard icon={<FiBookOpen />} label="Saved Itineraries" value={data?.stats.savedItineraries ?? 0} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
            <StatCard icon={<FiHeart />} label="Wishlist Items" value={data?.stats.wishlistCount ?? 0} color="bg-pink-100 text-pink-600 dark:bg-pink-900/30" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Recent Trips</h2>
                <Link to="/trip-planner" className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Plan new trip <FiArrowRight size={14} />
                </Link>
              </div>

              {data?.recentTrips?.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  No trips yet. Start planning your first adventure!
                  <div className="mt-4">
                    <Link to="/explore" className="btn-primary inline-flex text-sm">
                      Explore Destinations
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.recentTrips?.map((trip) => (
                    <Link
                      key={trip._id}
                      to={`/destinations/${trip.destination?.slug || ''}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <img src={trip.destination?.coverImage} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold">{trip.destination?.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {trip.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <Link to="/trip-planner" className="btn-secondary w-full justify-start text-sm">
                  <FiMap /> AI Trip Planner
                </Link>
                <Link to="/wishlist" className="btn-secondary w-full justify-start text-sm">
                  <FiHeart /> View Wishlist
                </Link>
                <Link to="/profile" className="btn-secondary w-full justify-start text-sm">
                  <FiBookOpen /> Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
