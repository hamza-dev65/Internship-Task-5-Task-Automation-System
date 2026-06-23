import { useState, useEffect, useRef } from 'react';
import { getReminders, markReminderRead } from '../api';

export default function InternReminderBell({ internId }) {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const unread = reminders.filter(r => !r.read).length;

  const fetchReminders = async () => {
    try {
      const data = await getReminders({ intern: internId });
      setReminders(data);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 30000);
    return () => clearInterval(interval);
  }, [internId]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRead = async (id) => {
    await markReminderRead(id);
    setReminders(prev => prev.map(r => r._id === id ? { ...r, read: true } : r));
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 bg-white rounded-full shadow hover:shadow-md transition">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-3 border-b font-semibold text-sm text-gray-700">Notifications</div>
          {reminders.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {reminders.map(r => (
                <div key={r._id} className={`p-3 border-b last:border-0 text-sm ${r.read ? 'text-gray-500' : 'font-medium text-gray-800'}`}>
                  <div className="flex justify-between items-start">
                    <span>{r.message}</span>
                    {!r.read && (
                      <button onClick={() => handleRead(r._id)} className="ml-2 text-xs text-indigo-600 hover:underline shrink-0">Dismiss</button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(r.sentAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
