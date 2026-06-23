import { useState, useEffect } from 'react';
import { getStats } from '../api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="animate-pulse bg-gray-200 rounded-lg w-10 h-10 rounded-lg mb-3" />
          <div className="animate-pulse bg-gray-200 rounded-lg w-16 h-7 mb-2" />
          <div className="animate-pulse bg-gray-200 rounded-lg w-20 h-3" />
        </div>
      ))}
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
      <div className="animate-pulse bg-gray-200 rounded-lg w-32 h-4" />
      <div className="animate-pulse bg-gray-200 rounded-lg w-full h-3 rounded-full" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try { setStats(await getStats()); } catch { /* ignore */ }
  };

  useEffect(() => { fetchStats(); const interval = setInterval(fetchStats, 10000); return () => clearInterval(interval); }, []);

  if (!stats) return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="animate-pulse bg-gray-200 rounded-lg w-48 h-7 mb-6" />
      <SkeletonCards />
      <SkeletonBlock />
      <div className="mt-8" />
      <SkeletonBlock />
    </div>
  );

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Tasks" value={stats.total} />
        <StatsCard label="Completed" value={stats.completed} color="text-emerald-600" />
        <StatsCard label="Overdue" value={stats.overdue} color="text-red-600" />
        <StatsCard label="Completion Rate" value={`${completionRate}%`} color="text-violet-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8 hover:shadow-md transition-shadow">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Overall Progress</h2>
        <ProgressBar value={completionRate} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <h2 className="font-semibold text-gray-700 mb-1 text-sm uppercase tracking-wider">Per Intern</h2>
        <p className="text-xs text-gray-400 mb-4">
          Tracking {stats.byIntern.length} intern{stats.byIntern.length !== 1 ? 's' : ''} &mdash; {stats.completed} of {stats.total} tasks done
        </p>
        {stats.byIntern.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 flex flex-col items-center gap-2">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            No interns assigned yet
          </div>
        ) : (
          <div className="space-y-3">
            {stats.byIntern.map((item, idx) => {
              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              return (
                <div key={item._id} className="rounded-lg p-3 -mx-1 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{item.name || 'Unknown'}</span>
                    <span className="text-xs text-gray-400">{item.completed}/{item.total} ({pct}%)</span>
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
