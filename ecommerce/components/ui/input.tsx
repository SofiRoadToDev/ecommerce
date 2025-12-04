import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  // Generate a unique ID if none is provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg text-gray-900',
          'placeholder:text-gray-400',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
