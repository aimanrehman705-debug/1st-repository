import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary-600" />
          <h1 className="text-lg font-semibold">WhatsX</h1>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
              </div>
              <Button onClick={logout} className="bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700">Logout</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
