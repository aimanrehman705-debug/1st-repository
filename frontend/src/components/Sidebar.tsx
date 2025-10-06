import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageCircle, FileText, Users, List } from 'lucide-react'

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const linkBase = 'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
  return (
    <aside className="hidden h-full w-64 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:block">
      <nav className="space-y-1">
        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`} to="/dashboard">
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`} to="/messages">
          <MessageCircle size={16} /> Messages
        </NavLink>
        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`} to="/templates">
          <FileText size={16} /> Templates
        </NavLink>
        {isAdmin && (
          <>
            <NavLink className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`} to="/users">
              <Users size={16} /> Users
            </NavLink>
            <NavLink className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`} to="/logs">
              <List size={16} /> Logs
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
