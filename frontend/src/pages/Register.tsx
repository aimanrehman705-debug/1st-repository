import { useState } from 'react';
import { registerWithEmail } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerWithEmail(email, password);
      toast.success('Registered');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-3">
        <h1 className="text-xl font-semibold">Create account</h1>
        <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full px-3 py-2 rounded bg-primary-500 text-white hover:opacity-90">{loading ? 'Creating...' : 'Register'}</button>
        <p className="text-sm text-gray-500">Have an account? <Link to="/login" className="text-primary-600">Login</Link></p>
      </form>
    </div>
  );
}
