import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { PendingOrderTableClient } from '@/components/admin/PendingOrderTableClient'
import type { PendingOrder } from '@/types/models'

export const dynamic = 'force-dynamic'

async function getPendingOrders(): Promise<PendingOrder[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching pending orders:', error)
        return []
    }

    return (data || []) as unknown as PendingOrder[]
}

export default async function PendingOrdersPage() {
    // Require admin authentication
    const isAdmin = await requireAdmin()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    const pendingOrders = await getPendingOrders()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Pending Orders
                    </h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                        Orders awaiting payment confirmation
                    </p>
                </div>
            </div>

            {/* Pending Orders Table */}
            <PendingOrderTableClient orders={pendingOrders} />
        </div>
    )
}
