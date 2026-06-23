import { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from '../api';
import StatusBadge from '../components/StatusBadge';

const statuses = ['scheduled', 'pending', 'in-progress', 'completed'];

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">All Tasks</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Assignee</th>
                <th className="text-left p-3">Due</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{t.title}</td>
                  <td className="p-3 text-gray-600">{t.assignedTo?.name || 'Unassigned'}</td>
                  <td className="p-3 text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`capitalize text-xs font-medium ${t.priority === 'high' ? 'text-red-600' : t.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
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
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
