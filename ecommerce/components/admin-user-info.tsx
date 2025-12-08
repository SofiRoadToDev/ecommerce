import { getUser } from '@/lib/supabase/auth'

export default async function AdminUserInfo() {
  // Obtiene usuario desde Supabase en SSR
  const user = await getUser()
  
  if (!user) {
    return null
  }

  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{user.user_metadata?.name || user.email}</span>
      {(user.user_metadata as any)?.role && (
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {(user.user_metadata as any).role}
        </span>
      )}
    </div>
  )
}
