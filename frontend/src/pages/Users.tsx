import Card from '@components/Card'
import { Table, THead, TBody, TR, TH, TD } from '@components/Table'
import { useEffect, useState } from 'react'
import api from '@services/api'

interface User { uid: string; email: string; displayName?: string; role?: string }

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function load() {
      const res = await api.get('/users')
      setUsers(res.data)
    }
    load()
  }, [])

  return (
    <Card>
      <h3 className="mb-3 text-lg font-semibold">Users</h3>
      <Table>
        <THead>
          <TR>
            <TH>Email</TH>
            <TH>Role</TH>
          </TR>
        </THead>
        <TBody>
          {users.map(u => (
            <TR key={u.uid}>
              <TD>{u.email}</TD>
              <TD>{u.role || 'user'}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  )
}
