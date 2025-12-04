import type { Product } from '@/types/models'

/**
 * Generate JSON-LD structured data for a product
 * This enables rich snippets in Google search results
 * and is critical for e-commerce SEO
 */
export function generateProductJsonLd(product: Product) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.image_url,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/?product=${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
}

/**
 * Generate JSON-LD for a list of products (ItemList)
 * Used on category pages and home page
 */
export function generateProductListJsonLd(products: Product[], listName: string = 'Products') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description || product.title,
        image: product.image_url,
        url: `${baseUrl}/?product=${product.id}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.price.toFixed(2),
          availability: product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      },
    })),
  }
}

/**
 * Generate JSON-LD for organization/website
 * Used in the main layout for site-wide information
 */
export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'E-commerce Store',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      // Add social media URLs here
      // 'https://www.facebook.com/yourstore',
      // 'https://twitter.com/yourstore',
      // 'https://www.instagram.com/yourstore',
    ],
  }
}

/**
 * Generate JSON-LD for WebSite with search action
 * Enables sitelinks search box in Google
 */
export function generateWebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    name: 'E-commerce Store',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Render JSON-LD script tag
 * Use this in your page components
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
