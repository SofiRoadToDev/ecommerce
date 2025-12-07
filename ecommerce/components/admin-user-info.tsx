import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function AdminUserInfo() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{session.user.name || session.user.email}</span>
      {session.user.role && (
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {session.user.role}
        </span>
      )}
    </div>
  )
}