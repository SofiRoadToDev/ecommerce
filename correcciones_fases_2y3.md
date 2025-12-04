# 🔧 Correcciones de Fases 2 y 3 - Mejoras de i18n

## 📊 Revisión de Claude Code

Hola Kimi, Claude Code revisó el trabajo que hiciste en las **Fases 2 y 3** y el veredicto es:

**✅ Calificación: 95% EXCELENTE**

### ✅ Lo que está PERFECTO:
- ✅ Estructura de componentes correcta
- ✅ Design System implementado al 100% (colores, spacing, tipografía)
- ✅ TypeScript con tipos bien definidos
- ✅ Server-side rendering correcto
- ✅ Grid responsivo siguiendo specs
- ✅ Uso de `next/image` optimizado
- ✅ ProductCard, Navbar, Footer, Error boundary bien hechos
- ✅ Skeleton loaders correctos

### ❌ Errores CRÍTICOS encontrados (YA ARREGLADOS por Claude):

#### 1. Error de TypeScript en `lib/i18n/index.ts` (línea 12)
```typescript
// ❌ LO QUE HICISTE (doble typeof - error de sintaxis)
return localeTranslations[key as keyof typeof typeof translations.en] || key

// ✅ LO QUE CLAUDE ARREGLÓ
return localeTranslations[key as keyof typeof translations.en] || key
```
**Impacto:** Build fallaba completamente. ✅ **YA ARREGLADO**.

#### 2. Error de Next.js 15 en `app/(public)/page.tsx`
```typescript
// ❌ LO QUE HICISTE (Next.js 14 syntax - no funciona en v15)
interface HomePageProps {
  searchParams: { category?: string }
}
export default async function HomePage({ searchParams }: HomePageProps) {
  const category = searchParams?.category  // ❌ Error
}

// ✅ LO QUE CLAUDE ARREGLÓ (Next.js 15 requiere Promise)
interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams  // ✅ Await primero
  const category = params?.category
}
```
**Impacto:** Build fallaba con error de TypeScript. ✅ **YA ARREGLADO**.

**IMPORTANTE:** En Next.js 15, `searchParams` y `params` en páginas son **Promises**, siempre debes hacer `await` primero. Recuerda esto para futuras páginas.

---

## 🎯 CORRECCIONES MENORES PENDIENTES (Tu tarea)

Ahora que los errores críticos están arreglados, necesito que hagas **3 correcciones menores de i18n**. Son cambios simples pero importantes para que la internacionalización sea semánticamente correcta.

---

### 🎯 Corrección 1: Navbar - Key de logo incorrecta

**Archivo:** `components/public/Navbar.tsx` (línea 19)

**Problema:**
Usas `t('products.title')` para el nombre de la tienda en el navbar, pero `products.title` es una key pensada para el título de listado de productos, no para el nombre del negocio. Es semánticamente incorrecto.

**Solución:**

**Paso 1:** Agregar nueva key a `lib/i18n/translations.ts` en **cada idioma**:

```typescript
// En la sección "Common" de cada idioma (después de "common.close"):

// English (en)
"common.storeName": "E-commerce Store",

// Spanish (es)
"common.storeName": "Tienda E-commerce",

// Portuguese (pt)
"common.storeName": "Loja E-commerce",
```

**Paso 2:** Modificar `components/public/Navbar.tsx` línea 18-20:

```tsx
// ❌ ANTES:
<Link href="/" className="text-xl font-bold text-gray-900">
  {t('products.title')}
</Link>

// ✅ DESPUÉS:
<Link href="/" className="text-xl font-bold text-gray-900">
  {t('common.storeName')}
</Link>
```

---

### 🎯 Corrección 2: FilterButtons - Categorías no traducidas

**Archivo:** `components/public/FilterButtons.tsx`

**Problema:**
Las categorías se muestran hardcodeadas en inglés ("Electronics", "Clothing", etc.) sin importar el valor de `NEXT_PUBLIC_LOCALE`. Si el usuario configura español o portugués, las categorías siguen en inglés.

**Solución:**

**Paso 1:** Agregar nuevas keys de categorías a `lib/i18n/translations.ts` en **cada idioma**.

Agregar una nueva sección **DESPUÉS de "Products"** en cada idioma:

```typescript
// ==========================================
// ENGLISH (en)
// ==========================================
// ... (después de la sección Products)

// Categories
"categories.electronics": "Electronics",
"categories.clothing": "Clothing",
"categories.accessories": "Accessories",
"categories.footwear": "Footwear",
"categories.homeKitchen": "Home & Kitchen",
"categories.bags": "Bags",
"categories.sports": "Sports",

// ==========================================
// SPANISH (es)
// ==========================================
// ... (después de la sección Products)

// Categorías
"categories.electronics": "Electrónica",
"categories.clothing": "Ropa",
"categories.accessories": "Accesorios",
"categories.footwear": "Calzado",
"categories.homeKitchen": "Hogar y Cocina",
"categories.bags": "Bolsos",
"categories.sports": "Deportes",

// ==========================================
// PORTUGUESE (pt)
// ==========================================
// ... (después de la sección Products)

// Categorias
"categories.electronics": "Eletrônicos",
"categories.clothing": "Roupas",
"categories.accessories": "Acessórios",
"categories.footwear": "Calçados",
"categories.homeKitchen": "Casa e Cozinha",
"categories.bags": "Bolsas",
"categories.sports": "Esportes",
```

**Paso 2:** Reescribir `components/public/FilterButtons.tsx` completamente:

```tsx
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
```

**Cambios clave:**
- ✅ Agregado `CATEGORY_MAP` que mapea nombres de DB a keys de i18n
- ✅ Simplificado el array a `VISIBLE_CATEGORIES` (solo valores, no objetos)
- ✅ Lógica de traducción: `category === 'all' ? t('common.all') : t(CATEGORY_MAP[category])`
- ✅ Más limpio y mantenible

---

### 🎯 Corrección 3: Home page - Mensaje "no products" semánticamente incorrecto

**Archivo:** `app/(public)/page.tsx` (línea ~61)

**Problema:**
Cuando el catálogo no tiene productos (por filtro o DB vacía), muestras `t('cart.empty')` que dice "Your cart is empty" / "Tu carrito está vacío". Pero **no estamos en el carrito**, estamos en el catálogo de productos. Es confuso.

**Solución:**

**Paso 1:** Agregar nueva key a `lib/i18n/translations.ts` en la sección "Products" de **cada idioma**:

```typescript
// Agregar después de "products.description":

// English (en)
"products.noProducts": "No products found",

// Spanish (es)
"products.noProducts": "No se encontraron productos",

// Portuguese (pt)
"products.noProducts": "Nenhum produto encontrado",
```

**Paso 2:** Modificar `app/(public)/page.tsx` alrededor de la línea 60-62:

```tsx
// ❌ ANTES:
) : (
  <div className="text-center py-12">
    <p className="text-gray-600">{t('cart.empty')}</p>
  </div>
)}

// ✅ DESPUÉS:
) : (
  <div className="text-center py-12">
    <p className="text-gray-600">{t('products.noProducts')}</p>
  </div>
)}
```

---

## ✅ Checklist de Entrega

Antes de marcar como completo, verifica:

- [ ] **Agregaste 11 nuevas keys** a `translations.ts`:
  - `common.storeName` × 3 idiomas
  - `categories.*` × 7 categorías × 3 idiomas = 21 keys
  - `products.noProducts` × 3 idiomas
  - **Total: 25 nuevas líneas en translations.ts**

- [ ] **Modificaste 4 archivos:**
  1. `lib/i18n/translations.ts` (25 nuevas líneas)
  2. `components/public/Navbar.tsx` (1 línea cambiada)
  3. `components/public/FilterButtons.tsx` (archivo completo reescrito)
  4. `app/(public)/page.tsx` (1 línea cambiada)

- [ ] **Probaste que funciona:**
  - Build sin errores: `npm run build -- --no-lint`
  - Cambiar idioma funciona (edita `NEXT_PUBLIC_LOCALE` en `.env.local` a `es` o `pt` y verifica)

---

## 📦 Entregables

Cuando termines, muéstrame:
1. El diff completo de `lib/i18n/translations.ts`
2. El código completo de `components/public/FilterButtons.tsx`
3. Las líneas modificadas de `Navbar.tsx` y `page.tsx`

---

## 💡 Aprendizajes para futuras fases

1. **Next.js 15:** `searchParams` y `params` son Promises → siempre `await`
2. **i18n semántico:** Usar keys apropiadas (`common.storeName` vs `products.title`)
3. **TypeScript:** Cuidado con `typeof typeof` (doble keyword no es válido)
4. **Traducciones completas:** Si hay categorías, traducirlas en los 3 idiomas

---

**¿Listo para empezar? Avísame cuando completes las 3 correcciones.** 🚀
