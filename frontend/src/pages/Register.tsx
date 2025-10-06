import { FormEvent, useState } from 'react'
import Card from '@components/Card'
import Button from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await register(email, password)
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Register</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-3 text-sm text-gray-600">Have an account? <Link to="/login" className="text-primary-600">Login</Link></p>
      </Card>
    </div>
  )
}
