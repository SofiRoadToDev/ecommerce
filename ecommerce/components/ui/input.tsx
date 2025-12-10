"use client"
import { cn } from '@/lib/utils'
import { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, id, name, ...props }: InputProps) {
  // Use useId consistently to avoid hydration mismatches
  const reactId = useId()
  const inputId = id || reactId

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}

        className={cn(
          'w-full px-4 py-2.5 border rounded-lg',
          'text-gray-900 dark:text-white dark:bg-slate-900 dark:border-slate-700',
          'placeholder:text-gray-400',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1" suppressHydrationWarning={true}>
          {error}
        </p>
      )}
    </div>
  )
}