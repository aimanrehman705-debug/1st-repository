import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, MessageSquare, LayoutDashboard, Users as UsersIcon, FileText, List } from 'lucide-react';
import { logout } from '../services/firebase';

export function Layout() {
  const { role } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { to: '/templates', label: 'Templates', icon: <FileText size={18} /> },
  ];
  if (role === 'admin') {
    links.push({ to: '/users', label: 'Users', icon: <UsersIcon size={18} />});
    links.push({ to: '/logs', label: 'Logs', icon: <List size={18} />});
  }

  return (
    <div className="min-h-full grid grid-cols-[240px_1fr]">
      <aside className="bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 p-4 space-y-2">
        <div className="text-xl font-semibold mb-3">Whats<span className="text-primary-500">X</span></div>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 ${loc.pathname === l.to ? 'bg-gray-100 dark:bg-neutral-800 font-medium' : ''}`}>
            {l.icon}
            <span>{l.label}</span>
          </Link>
        ))}
      </aside>
      <main className="min-h-full">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-3">
          <div className="font-medium">Advanced WhatsApp Messaging & Automation</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={async () => { await logout(); navigate('/login'); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:opacity-90"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
