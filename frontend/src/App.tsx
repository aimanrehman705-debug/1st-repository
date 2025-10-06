import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Messages from './pages/Messages'
import Templates from './pages/Templates'
import Users from './pages/Users'
import Logs from './pages/Logs'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="h-full flex">
      {user && <Sidebar isAdmin={!!isAdmin} />}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 space-y-4">
          <Routes>
            {!user && <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>}
            {user && <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/templates" element={<Templates />} />
              {isAdmin && <Route path="/users" element={<Users />} />}
              {isAdmin && <Route path="/logs" element={<Logs />} />}
              <Route path="*" element={<Navigate to="/" />} />
            </>}
          </Routes>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
