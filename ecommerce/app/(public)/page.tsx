import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { ProductCard } from '@/components/public/ProductCard'
import { FilterButtons } from '@/components/public/FilterButtons'
import { t } from '@/lib/i18n'
import type { Product } from '@/types/models'
import type { Metadata } from 'next'
import { generateProductListJsonLd, generateWebSiteJsonLd, JsonLd } from '@/lib/seo/structured-data'

// ISR: Revalidate every 60 seconds
export const revalidate = 60

interface HomePageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

// Category metadata mapping
const categoryMetadata: Record<string, { title: string; description: string }> = {
  electronics: {
    title: 'Electronics - Gadgets, Phones & Tech',
    description: 'Shop the latest electronics, smartphones, laptops, and tech gadgets. Fast shipping and secure checkout.',
  },
  clothing: {
    title: 'Clothing & Fashion - Latest Trends',
    description: 'Discover trendy clothing and fashion items for men and women. Quality fabrics and fast delivery.',
  },
  home: {
    title: 'Home & Living - Furniture & Decor',
    description: 'Shop home goods, furniture, and decor to transform your living space. Quality products at great prices.',
  },
  all: {
    title: 'All Products - Shop Online',
    description: 'Browse our complete catalog of quality products. Electronics, clothing, home goods and more.',
  },
}

// Generate metadata dynamically based on category/search
export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams
  const category = params?.category || 'all'
  const search = params?.search

  // If searching, customize metadata
  if (search) {
    return {
      title: `Search: ${search}`,
      description: `Search results for "${search}". Find quality products with fast shipping.`,
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  // Category-specific metadata
  const meta = categoryMetadata[category] || categoryMetadata.all

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const category = params?.category
  const search = params?.search

  // Build query
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Add search filter (contains/ilike)
  if (search && search.trim()) {
    query = query.ilike('title', `%${search.trim()}%`)
  }

  let products: Product[] | null = null
  let error = null

  try {
    const { data, error: fetchError } = await query
    if (fetchError) throw fetchError
    products = data as unknown as Product[]
  } catch (err) {
    console.error('Error fetching products:', err)
    error = err

    // En desarrollo con valores dummy, mostrar productos de ejemplo
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      products = [
        {
          id: '1',
          title: 'Producto de Ejemplo 1',
          description: 'Este es un producto de ejemplo para desarrollo',
          price: 29.99,
          category: 'electronics',
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          stock: 10,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Producto de Ejemplo 2',
          description: 'Otro producto de ejemplo para desarrollo',
          price: 49.99,
          category: 'clothing',
          image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
          stock: 5,
          created_at: new Date().toISOString()
        }
      ]
      error = null
    } else if (error) {
      // En producción, mostrar mensaje de error pero no romper la app
      console.error('Production error loading products:', error)
      products = []
    }
  }

  // Generate structured data for SEO
  const productListJsonLd = products && products.length > 0
    ? generateProductListJsonLd(
      products,
      category ? categoryMetadata[category]?.title || 'Products' : 'All Products'
    )
    : null

  const webSiteJsonLd = generateWebSiteJsonLd()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <JsonLd data={webSiteJsonLd} />
      {productListJsonLd && <JsonLd data={productListJsonLd} />}

      {/* Navbar */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h1>
          {/* Filter Buttons */}
          <Suspense fallback={<div className="h-12 w-full animate-pulse bg-gray-100 rounded-lg" />}>
            <FilterButtons />
          </Suspense>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('products.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
