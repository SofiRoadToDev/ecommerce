import { cn } from '@/lib/utils'

/**
 * Table component system for displaying data tables
 * Mobile-responsive with horizontal scrolling
 */

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-800">
      <table
        className={cn('w-full text-sm text-left text-gray-700 dark:text-gray-200', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800', className)}
      {...props}
    >
      {children}
    </thead>
  )
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200 dark:divide-slate-800 bg-white dark:bg-transparent', className)} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn('hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors', className)}
      {...props}
    >
      {children}
    </tr>
  )
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  sortable?: boolean
  sorted?: 'asc' | 'desc' | null
  onSort?: () => void
}

export function TableHead({
  children,
  sortable,
  sorted,
  onSort,
  className,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sorted === 'asc' && '↑'}
            {sorted === 'desc' && '↓'}
            {!sorted && '↕'}
          </span>
        )}
      </div>
    </th>
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap', className)} {...props}>
      {children}
    </td>
  )
}

interface TableEmptyProps {
  message: string
  colSpan?: number
}

export function TableEmpty({ message, colSpan = 5 }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
        {message}
      </td>
    </tr>
  )
}
