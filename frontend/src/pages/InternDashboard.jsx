import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIntern, getTasks, updateTaskStatus, getReminders, markReminderRead } from '../api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import InternReminderBell from '../components/InternReminderBell';

const statuses = ['scheduled', 'pending', 'in-progress', 'completed'];

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="flex justify-between mb-6"><div className="animate-pulse bg-gray-200 rounded-lg w-48 h-8" /><div className="animate-pulse bg-gray-200 rounded-lg w-10 h-10 rounded-full" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-xl p-5 shadow-sm"><div className="animate-pulse bg-gray-200 rounded-lg w-full h-16" /></div>)}
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm mb-8"><div className="animate-pulse bg-gray-200 rounded-lg w-32 h-4 mb-3" /><div className="animate-pulse bg-gray-200 rounded-lg w-full h-3 rounded-full" /></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-50 flex gap-4">{[120, 80, 80, 60].map((w, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-3" style={{ width: w }} />)}</div>
        {[1, 2, 3].map(i => <div key={i} className="flex gap-4 p-3 border-b border-gray-50">{[100, 60, 60, 40].map((w, j) => <div key={j} className="animate-pulse bg-gray-200 rounded-lg h-3" style={{ width: w }} />)}</div>)}
      </div>
    </div>
  );
}

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

  const handleSubmit = async (taskId) => {
    const updated = await updateTaskStatus(taskId, 'completed');
    setTasks(prev => prev.map(t => t._id === taskId ? updated : t));
  };

  const handleDismissReminder = async (reminderId) => {
    await markReminderRead(reminderId);
    setReminders(prev => prev.map(r => r._id === reminderId ? { ...r, read: true } : r));
  };

  if (!intern) return <Skeleton />;

  const activeTasks = tasks.filter(t => t.status !== 'scheduled');
  const total = activeTasks.length;
  const completed = activeTasks.filter(t => t.status === 'completed').length;
  const overdue = activeTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const unreadReminders = reminders.filter(r => !r.read);
  const initials = intern.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Welcome, {intern.name}</h1>
            <p className="text-sm text-gray-400">{intern.department} &middot; {intern.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <InternReminderBell internId={id} />
          <Link to="/" className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-200">
            Switch role
          </Link>
        </div>
      </div>

      {unreadReminders.length > 0 && (
        <div className="space-y-2 mb-6">
          {unreadReminders.slice(0, 5).map(r => (
            <div key={r._id} className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-3 flex justify-between items-center text-sm shadow-sm">
              <span className="text-amber-800">{r.message}</span>
              <button onClick={() => handleDismissReminder(r._id)} className="shrink-0 text-xs text-amber-700 font-medium px-3 py-1 rounded-full bg-amber-100/80 hover:bg-amber-200 transition-colors ml-2">
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="My Tasks" value={tasks.length} />
        <StatsCard label="Completed" value={completed} color="text-emerald-600" />
        <StatsCard label="Overdue" value={overdue} color="text-red-600" />
        <StatsCard label="Completion" value={`${rate}%`} color="text-violet-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8 hover:shadow-md transition-shadow">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">My Progress</h2>
        <ProgressBar value={rate} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <h2 className="font-semibold text-gray-700 p-5 pb-0 text-sm uppercase tracking-wider">All Tasks</h2>
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 font-medium">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Due</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id} className="border-t border-gray-50 even:bg-gray-50/50 hover:bg-indigo-50/40 transition-colors">
                    <td className="p-3 font-medium text-gray-800">{t.title}</td>
                    <td className="p-3 text-gray-400">{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`capitalize text-xs font-medium ${t.priority === 'high' ? 'text-red-600' : t.priority === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleStatus(t._id, t.status)} className="cursor-pointer" disabled={t.status === 'completed'}>
                        <StatusBadge status={t.status} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      {t.status === 'completed' ? (
                        <span className="text-emerald-600 font-bold text-lg">✓</span>
                      ) : t.status === 'scheduled' ? (
                        <span className="text-gray-300 text-lg">—</span>
                      ) : (
                        <button
                          onClick={() => handleSubmit(t._id)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
