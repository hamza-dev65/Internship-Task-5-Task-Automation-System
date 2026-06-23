import { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from '../api';
import StatusBadge from '../components/StatusBadge';

const statuses = ['scheduled', 'pending', 'in-progress', 'completed'];

function SkeletonRows() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gray-50 flex gap-4">
        {[180, 120, 80, 80, 80, 60].map((w, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-3" style={{ width: w }} />)}
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-4 p-3 border-b border-gray-50">
          {[160, 100, 60, 60, 60, 40].map((w, j) => <div key={j} className="animate-pulse bg-gray-200 rounded-lg h-3" style={{ width: w }} />)}
        </div>
      ))}
    </div>
  );
}

export default function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.status = filter;
      setTasks(await getTasks(params));
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const handleStatus = async (id, status) => {
    const idx = statuses.indexOf(status);
    if (idx === -1) return;
    const next = statuses[(idx + 1) % statuses.length];
    const updated = await updateTaskStatus(id, next);
    setTasks(prev => prev.map(t => t._id === id ? updated : t));
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">All Tasks</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === s
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRows />
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-500 font-medium">No tasks found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting the filter or create a new task.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Assignee</th>
                  <th className="text-left p-3 font-medium">Due</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id} className="border-t border-gray-50 even:bg-gray-50/50 hover:bg-indigo-50/40 transition-colors">
                    <td className="p-3 font-medium text-gray-800">{t.title}</td>
                    <td className="p-3 text-gray-500">{t.assignedTo?.name || 'Unassigned'}</td>
                    <td className="p-3 text-gray-400">{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`capitalize text-xs font-medium ${t.priority === 'high' ? 'text-red-600' : t.priority === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleStatus(t._id, t.status)} className="cursor-pointer">
                        <StatusBadge status={t.status} />
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(t._id, t.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
