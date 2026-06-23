import { useState, useEffect } from 'react';
import { getStats } from '../api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try { setStats(await getStats()); } catch { /* ignore */ }
  };

  useEffect(() => { fetchStats(); const interval = setInterval(fetchStats, 10000); return () => clearInterval(interval); }, []);

  if (!stats) return <div className="p-8 text-gray-500">Loading stats...</div>;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Tasks" value={stats.total} />
        <StatsCard label="Completed" value={stats.completed} color="text-green-600" />
        <StatsCard label="Overdue" value={stats.overdue} color="text-red-600" />
        <StatsCard label="Completion Rate" value={`${completionRate}%`} color="text-indigo-600" />
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">Overall Progress</h2>
        <ProgressBar value={completionRate} />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Per Intern</h2>
        {stats.byIntern.length === 0 ? (
          <p className="text-gray-500 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.byIntern.map(item => {
              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.name || 'Unknown'}</span>
                    <span className="text-gray-500">{item.completed}/{item.total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
