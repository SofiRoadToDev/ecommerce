import { createServerClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/public/Navbar'
import { ProductCard } from '@/components/public/ProductCard'
import { FilterButtons } from '@/components/public/FilterButtons'
import { t } from '@/lib/i18n'

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createServerClient()
  const params = await searchParams
  const category = params?.category
  
  // Build query
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  let products = null
  let error = null

  try {
    const { data, error: fetchError } = await query
    if (fetchError) throw fetchError
    products = data
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
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Producto de Ejemplo 2',
          description: 'Otro producto de ejemplo para desarrollo',
          price: 49.99,
          category: 'clothing',
          image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
     
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h1>
          {/* Filter Buttons */}
          <FilterButtons />
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
