import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIntern, getTasks, updateTaskStatus, getReminders, markReminderRead } from '../api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import InternReminderBell from '../components/InternReminderBell';

const statuses = ['scheduled', 'pending', 'in-progress', 'completed'];

export default function InternDashboard() {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);

  const fetchData = async () => {
    try {
      const [internData, tasksData, remindersData] = await Promise.all([
        getIntern(id),
        getTasks({ intern: id }),
        getReminders({ intern: id }),
      ]);
      setIntern(internData);
      setTasks(tasksData);
      setReminders(remindersData);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 10000); return () => clearInterval(interval); }, [id]);

  const cycleStatus = (current) => {
    const idx = statuses.indexOf(current);
    if (idx === -1 || idx >= statuses.length - 1) return current;
    return statuses[idx + 1];
  };

  const handleStatus = async (taskId, currentStatus) => {
    if (currentStatus === 'completed') return;
    const next = cycleStatus(currentStatus);
    const updated = await updateTaskStatus(taskId, next);
    setTasks(prev => prev.map(t => t._id === taskId ? updated : t));
  };

  const handleDismissReminder = async (reminderId) => {
    await markReminderRead(reminderId);
    setReminders(prev => prev.map(r => r._id === reminderId ? { ...r, read: true } : r));
  };

  if (!intern) return <div className="p-8 text-gray-500 text-center">Loading...</div>;

  const activeTasks = tasks.filter(t => t.status !== 'scheduled');
  const total = activeTasks.length;
  const completed = activeTasks.filter(t => t.status === 'completed').length;
  const overdue = activeTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const unreadReminders = reminders.filter(r => !r.read);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {intern.name}</h1>
          <p className="text-gray-500 text-sm">{intern.department} &middot; {intern.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <InternReminderBell internId={id} />
          <Link to="/" className="text-sm text-indigo-600 hover:underline">Switch role</Link>
        </div>
      </div>

      {unreadReminders.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 text-sm mb-2">Unread Notifications ({unreadReminders.length})</h3>
          <div className="space-y-2">
            {unreadReminders.slice(0, 5).map(r => (
              <div key={r._id} className="flex justify-between items-center text-sm text-yellow-700">
                <span>{r.message}</span>
                <button onClick={() => handleDismissReminder(r._id)} className="text-xs text-yellow-800 underline ml-2 shrink-0">Dismiss</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="My Tasks" value={tasks.length} />
        <StatsCard label="Completed" value={completed} color="text-green-600" />
        <StatsCard label="Overdue" value={overdue} color="text-red-600" />
        <StatsCard label="Completion" value={`${rate}%`} color="text-indigo-600" />
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">My Progress</h2>
        <ProgressBar value={rate} />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="font-semibold text-gray-700 p-5 pb-0">All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="p-5 text-gray-500 text-sm">No tasks assigned yet.</p>
        ) : (
          <table className="w-full text-sm mt-3">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Due</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{t.title}</td>
                  <td className="p-3 text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`capitalize text-xs font-medium ${t.priority === 'high' ? 'text-red-600' : t.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleStatus(t._id, t.status)} className="cursor-pointer" disabled={t.status === 'completed'}>
                      <StatusBadge status={t.status} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
