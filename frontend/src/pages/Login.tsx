import { FormEvent, useState } from 'react'
import Card from '@components/Card'
import Button from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Login</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="mt-3 text-sm text-gray-600">No account? <Link to="/register" className="text-primary-600">Register</Link></p>
      </Card>
    </div>
  )
}
