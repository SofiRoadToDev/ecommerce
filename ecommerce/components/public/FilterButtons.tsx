'use client'

import { useSearchParams, useRouter } from 'next/navigation'
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

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
      {VISIBLE_CATEGORIES.map((category) => {
        const isActive = currentCategory === category
        // Si es 'all' usa common.all, sino busca en CATEGORY_MAP
        const label = category === 'all'
          ? t('common.all')
          : t(CATEGORY_MAP[category])

        return (
          <Button
            key={category}
            variant={isActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleFilter(category)}
            className="whitespace-nowrap"
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
