import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  error,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  // Generate a unique ID if none is provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg text-gray-900 bg-white',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all cursor-pointer',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
