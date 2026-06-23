export default function ProgressBar({ value }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-700 ease-out relative"
        style={{ width: `${pct}%` }}
      >
        {pct >= 25 && (
          <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-bold text-white leading-none">
            {pct}%
          </span>
        )}
      </div>
    </div>
  );
}
