import { useState } from 'react';
import { loginWithEmail } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Logged in');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-3">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full px-3 py-2 rounded bg-primary-500 text-white hover:opacity-90">{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-sm text-gray-500">No account? <Link to="/register" className="text-primary-600">Register</Link></p>
      </form>
    </div>
  );
}
