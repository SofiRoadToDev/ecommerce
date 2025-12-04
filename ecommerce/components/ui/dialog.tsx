'use client'

import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Dialog({ open, onClose, children, title }: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-over panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <HeadlessDialog.Panel className="w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  {title && (
                    <HeadlessDialog.Title className="text-lg font-semibold text-gray-900">
                      {title}
                    </HeadlessDialog.Title>
                  )}
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label={t('common.close')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </div>
            </HeadlessDialog.Panel>
          </div>
        </Transition.Child>
      </HeadlessDialog>
    </Transition>
  )
}
