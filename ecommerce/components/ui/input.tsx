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
        className="block text-sm font-medium text-slate-700 mb-1"

      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}

        className={cn(
          'w-full px-4 py-2.5 border rounded-lg',
          'bg-slate-800/50 text-slate-100 border-slate-600',
          'placeholder:text-slate-400',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-all',
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 mt-1" suppressHydrationWarning={true}>
          {error}
        </p>
      )}
    </div>
  )
}