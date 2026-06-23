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
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-bold text-lg">InternTask</Link>
        <div className="flex items-center gap-6">
          {isAdmin && adminLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`hover:text-indigo-200 transition ${pathname === l.to ? 'text-indigo-200 border-b-2 border-white' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && <ReminderBell />}
        </div>
      </div>
    </nav>
  );
}
