import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Product } from '@/types/models'
import { Metadata } from 'next'
import ProductDetailClient from '../../../../components/public/ProductDetailClient'

// ISR: Revalidate every hour
export const revalidate = 3600

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category_data:categories(*)
    `)
        .eq('slug', slug)
        .single()

    if (error || !data) {
        return null
    }

    return data as unknown as Product
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`

    return {
        title: `${product.title} - $${product.price}`,
        description: product.description || `Buy ${product.title} at the best price`,

        openGraph: {
            title: product.title,
            description: product.description || `Buy ${product.title}`,
            images: product.image_url ? [product.image_url] : [],
            url: productUrl,
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description || `Buy ${product.title}`,
            images: product.image_url ? [product.image_url] : [],
        },

        alternates: {
            canonical: productUrl,
        },
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    // Structured Data (JSON-LD) for Google Rich Snippets
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image_url,
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} />
        </>
    )
}
