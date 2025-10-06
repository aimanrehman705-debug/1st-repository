import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary-600" />
          <h1 className="text-lg font-semibold">WhatsX</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && <>
            <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
            <Button onClick={logout} className="bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700">Logout</Button>
          </>}
        </div>
      </div>
    </header>
  )
}
