import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { fetchAnalytics } from '../../services/adminService';
import { CardRowSkeleton } from '../../components/Skeletons';

const COLORS = ['#f97316', '#0891b2', '#8b5cf6', '#ec4899', '#22c55e', '#eab308'];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CardRowSkeleton count={4} />;

  const categoryData = data.categoryBreakdown.map((c) => ({ name: c._id, value: c.count }));
  const tripsStatusData = data.tripsByStatus.map((t) => ({ name: t._id, value: t.count }));
  const stateData = data.stateBreakdown.map((s) => ({ name: s._id, count: s.count }));

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Destinations by State</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Trips by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tripsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {tripsStatusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
