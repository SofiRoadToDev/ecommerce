'use client'

import { Dialog } from '@headlessui/react'
import { X, ExternalLink, Package, User, MapPin, CreditCard } from 'lucide-react'
import { OrderWithDetails } from '@/types/models'
import Image from 'next/image'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderWithDetails | null
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0)

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full glass rounded-xl shadow-xl max-h-[90vh] overflow-y-auto border border-white/10">
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-slate-100">
              Order Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Order ID</p>
                  <p className="text-sm font-mono text-slate-200">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Order Date</p>
                  <p className="text-sm text-slate-200">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">Customer Information</h3>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-sm font-medium text-slate-200">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-200">{order.customer_email}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">Shipping Address</h3>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-slate-200">{order.shipping_address.address}</p>
                <p className="text-sm text-slate-200">
                  {order.shipping_address.city}, {order.shipping_address.postal_code}
                </p>
                <p className="text-sm text-slate-200">{order.shipping_address.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">Order Items</h3>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg divide-y divide-white/10">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4">
                    {item.product.image_url && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        Quantity: {item.quantity} × {formatPrice(item.price_at_purchase)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-100">
                        {formatPrice(item.price_at_purchase * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">Payment Information</h3>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-100">{formatPrice(subtotal)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-base font-semibold text-slate-100">Total</span>
                  <span className="text-base font-bold text-slate-100">{formatPrice(order.total_amount)}</span>
                </div>
                {order.payment_intent_id && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-sm text-slate-400 mb-1">Payment ID</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-slate-200 bg-slate-700 px-2 py-1 rounded">
                        {order.payment_intent_id}
                      </code>
                      <a
                        href={`https://dashboard.stripe.com/payments/${order.payment_intent_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium border border-slate-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
