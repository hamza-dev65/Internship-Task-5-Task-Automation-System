export default function StatsCard({ label, value, color = 'text-indigo-600' }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
