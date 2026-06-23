import { Link, useLocation } from 'react-router-dom';
import ReminderBell from './ReminderBell';

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/tasks', label: 'Tasks' },
  { to: '/admin/interns', label: 'Interns' },
  { to: '/admin/tasks/new', label: '+ New Task' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  if (pathname === '/' || pathname.startsWith('/intern/')) return null;

  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          InternTask
        </Link>
        <div className="flex items-center gap-1">
          {isAdmin && adminLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? 'bg-white/15 shadow-sm'
                  : 'hover:bg-white/10'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && <ReminderBell />}
          {isAdmin && (
            <Link
              to="/"
              className="ml-2 px-3 py-1.5 rounded-lg text-sm text-indigo-200 hover:text-white hover:bg-red-500/20 transition-all duration-200"
            >
              Logout
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
