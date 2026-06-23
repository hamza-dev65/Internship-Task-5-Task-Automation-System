const icons = {
  'Total Tasks': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  ),
  'Completed': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  'Overdue': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
};

const bgTints = {
  'Total Tasks': 'from-indigo-50 to-indigo-100/50',
  'Completed': 'from-green-50 to-green-100/50',
  'Overdue': 'from-red-50 to-red-100/50',
  'Completion': 'from-violet-50 to-violet-100/50',
};

export default function StatsCard({ label, value, color = 'text-indigo-600' }) {
  const icon = icons[label];
  const bg = bgTints[label] || 'from-gray-50 to-gray-100/50';

  return (
    <div className={`bg-gradient-to-br ${bg} rounded-xl p-5 flex items-center gap-4 shadow-sm border border-white/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
      {icon && <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-white/70 shadow-sm`}>{icon}</div>}
      <div className="min-w-0">
        <div className={`text-3xl font-extrabold tracking-tight ${color}`}>{value}</div>
        <div className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
