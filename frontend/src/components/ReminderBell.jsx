import { useState, useEffect, useRef } from 'react';
import { getReminders, markReminderRead } from '../api';

export default function ReminderBell() {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const prevUnread = useRef(0);
  const ref = useRef();

  const unread = reminders.filter(r => !r.read).length;

  useEffect(() => {
    if (unread > prevUnread.current && prevUnread.current > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    prevUnread.current = unread;
  }, [unread]);

  const fetchReminders = async () => {
    try { setReminders(await getReminders({ admin: true })); } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <button onClick={() => setOpen(!open)} className={`relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200 ${shake ? 'animate-shake' : ''}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-slideDown origin-top-right overflow-hidden">
          <div className="p-3 border-b border-gray-100 font-semibold text-sm text-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </div>
          {reminders.length === 0 ? (
            <div className="p-6 text-sm text-gray-400 text-center flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              No new notifications
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {reminders.map(r => (
                <div key={r._id} className={`p-3 border-b border-gray-50 last:border-0 text-sm transition-colors ${r.read ? 'text-gray-400' : 'bg-indigo-50/30 font-medium text-gray-800'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="leading-snug">{r.message}</span>
                    {!r.read && (
                      <button onClick={() => handleRead(r._id)} className="shrink-0 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors">
                        Dismiss
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1.5">{new Date(r.sentAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
