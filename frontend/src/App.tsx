import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Messages } from './pages/Messages';
import { Templates } from './pages/Templates';
import { Users } from './pages/Users';
import { Logs } from './pages/Logs';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';

export default function App() {
  const { user, role, initializing } = useAuth();

  if (initializing) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-full bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-50">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        <Route element={user ? <Layout /> : <Navigate to="/login" /> }>
          <Route index element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/templates" element={<Templates />} />
          {role === 'admin' && (
            <>
              <Route path="/users" element={<Users />} />
              <Route path="/logs" element={<Logs />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </div>
  );
}
