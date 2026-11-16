import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiCalendar, FiStar } from 'react-icons/fi';
import { fetchAnalytics } from '../../services/adminService';
import { CardRowSkeleton } from '../../components/Skeletons';

const StatBox = ({ icon, label, value, color }) => (
  <motion.div whileHover={{ y: -4 }} className="card p-5">
    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-lg ${color}`}>{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </motion.div>
);

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CardRowSkeleton count={4} />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatBox icon={<FiUsers />} label="Total Users" value={data.totals.totalUsers} color="bg-blue-100 text-blue-600" />
        <StatBox icon={<FiMap />} label="Destinations" value={data.totals.totalDestinations} color="bg-green-100 text-green-600" />
        <StatBox icon={<FiCalendar />} label="Trips" value={data.totals.totalTrips} color="bg-purple-100 text-purple-600" />
        <StatBox icon={<FiStar />} label="Reviews" value={data.totals.totalReviews} color="bg-amber-100 text-amber-600" />
        <StatBox icon={<FiMap />} label="Itineraries" value={data.totals.totalItineraries} color="bg-pink-100 text-pink-600" />
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Top Destinations</h3>
        <div className="space-y-2">
          {data.topDestinations.map((d) => (
            <div key={d._id} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="text-slate-500">⭐ {d.rating?.toFixed(1)} · {d.numReviews} reviews</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
