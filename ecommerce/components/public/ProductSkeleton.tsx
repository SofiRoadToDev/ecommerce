export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
}