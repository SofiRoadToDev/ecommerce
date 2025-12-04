import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  // Generate a unique ID if none is provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-1">
      <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg text-gray-900',
          'placeholder:text-gray-400',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all resize-y min-h-[100px]',
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
