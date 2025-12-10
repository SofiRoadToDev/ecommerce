'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

// Mapeo de valores de base de datos a keys de traducción
const CATEGORY_MAP: Record<string, string> = {
  'Electronics': 'categories.electronics',
  'Clothing': 'categories.clothing',
  'Accessories': 'categories.accessories',
  'Footwear': 'categories.footwear',
  'Home & Kitchen': 'categories.homeKitchen',
  'Bags': 'categories.bags',
  'Sports': 'categories.sports',
}

// Solo mostrar algunas categorías para no saturar el UI
const VISIBLE_CATEGORIES = ['all', 'Electronics', 'Clothing', 'Accessories', 'Footwear']

export function FilterButtons() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  const currentSearch = searchParams.get('search') || ''

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/?${params.toString()}`)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Box - Full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('common.search')}
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Category Buttons - Full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 flex gap-2 overflow-x-auto pb-2">
        {VISIBLE_CATEGORIES.map((category) => {
          const isActive = currentCategory === category
          // Si es 'all' usa common.all, sino busca en CATEGORY_MAP
          const label = category === 'all'
            ? t('common.all')
            : t(CATEGORY_MAP[category])

          return (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              onClick={() => handleFilter(category)}
              className={`whitespace-nowrap ${isActive ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-gray-100'}`}
            >
              {label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
