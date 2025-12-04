# 🤖 Workflow: Kimi (Ejecutor) + Claude (Revisor)

## 📋 Resumen del Proyecto

**Proyecto:** E-commerce Platform Production-Ready
**Stack:** Next.js 15.1.0, React 18.3.1, TypeScript 5.3.3, Supabase, Stripe, Tailwind
**Metodología:** Desarrollo incremental en 13 fases
**Documentos clave:**
- `specs.md` - Especificación técnica completa
- `prompt_kimi.md` - Prompts paso a paso para Kimi
- `checkout-phases.md` - Checklist de fases

---

## 🔄 Flujo de Trabajo Establecido

```
┌─────────────────────────────────────────────────┐
│  FASE N: [Nombre de la fase]                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  1. KIMI EJECUTA                                │
│  - Lee prompt_kimi.md para la fase              │
│  - Genera código según specs.md                 │
│  - Implementa componentes/features              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. USUARIO ENTREGA A CLAUDE                    │
│  - "Kimi terminó la fase N, revisa"             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. CLAUDE REVISA (Este documento)              │
│  - Verifica build                                │
│  - Valida contra specs.md                        │
│  - Detecta errores sutiles                       │
│  - Revisa consistencia                           │
└─────────────────────────────────────────────────┘
                    ↓
            ┌───────────────┐
            │  ¿Errores?    │
            └───────────────┘
              ↙           ↘
           SÍ              NO
            ↓               ↓
┌──────────────────┐  ┌──────────────────┐
│ 4a. CORRECCIONES │  │ 4b. APROBACIÓN   │
│ - Claude genera  │  │ - Fase completa  │
│   prompt detail. │  │ - Siguiente fase │
│ - Kimi corrige   │  │                  │
│ - Volver a paso 2│  │                  │
└──────────────────┘  └──────────────────┘
```

---

## 🎯 Perfil de Kimi K2 (Aprendido)

### ✅ Fortalezas

| Área | Nivel | Uso recomendado |
|------|-------|-----------------|
| Estructura de archivos | ⭐⭐⭐⭐⭐ | Confiar plenamente |
| Design System | ⭐⭐⭐⭐⭐ | Excelente siguiendo guías visuales |
| Componentes UI | ⭐⭐⭐⭐⭐ | Genera componentes reusables correctos |
| Patrones de código | ⭐⭐⭐⭐ | Sigue bien los ejemplos dados |
| Velocidad | ⭐⭐⭐⭐⭐ | Muy rápido generando código |

### ⚠️ Debilidades (requieren atención)

| Área | Problema observado | Solución |
|------|-------------------|----------|
| **Versiones recientes** | No sabe que Next.js 15 cambió searchParams a Promise | Especificar versión + breaking changes en prompt |
| **Consistencia** | Implementa i18n pero deja strings hardcodeadas | Listar TODOS los casos explícitamente |
| **Sintaxis** | Error `typeof typeof` | Pedir validación con build |
| **Semántica** | Usa keys incorrectas (`products.title` en navbar) | Explicar el "por qué" de cada decisión |
| **Edge cases** | Solo implementa happy path | Listar edge cases: empty, error, loading |
| **Validación** | No corre build automáticamente | Incluir checklist en prompt |

---

## 📝 Template de Prompt para Kimi (Optimizado)

### Estructura básica:

```markdown
# Fase X: [Nombre]

## ⚠️ IMPORTANTE - Contexto técnico
- **Next.js:** 15.1.0
  - ⚠️ searchParams es Promise (await antes de usar)
  - ⚠️ params es Promise (await antes de usar)
- **TypeScript:** 5.3.3 strict mode
- **[Otro warning importante]**

---

## 🎯 Tarea 1: [Nombre específico]

**Archivos a modificar:**
- `path/to/file.tsx` (crear nuevo / modificar)
- `path/to/otro.ts` (agregar función)

**Implementación:**

### Paso 1.1: [Acción concreta]
```typescript
// Archivo: path/to/file.tsx
// ❌ NO hagas esto:
[código incorrecto con explicación]

// ✅ Haz esto:
[código completo correcto]

// Por qué: [Explicación del razonamiento]
```

### Paso 1.2: [Siguiente acción]
[Mismo formato]

**Casos edge a cubrir:**
- [ ] ¿Qué pasa si no hay datos? → Mostrar [comportamiento]
- [ ] ¿Qué pasa si hay error? → Mostrar [comportamiento]
- [ ] ¿Funciona en español/portugués? → Usar t()

---

## ✅ Checklist de validación (OBLIGATORIO)

Antes de entregar, verifica:
- [ ] `npm run build` exitoso (copia el output)
- [ ] TypeScript sin errores
- [ ] Todas las strings visibles usan `t()`
- [ ] Probé edge cases listados arriba
- [ ] [Validación específica de esta fase]

---

## 📦 Entregables

Muestra:
1. **Código completo** de archivos nuevos
2. **Diff** de archivos modificados (antes/después)
3. **Output del build** (para verificar que compila)
4. **Comentarios** sobre decisiones tomadas

---

## 💡 Recuerda para futuras fases
[Concepto clave que Kimi debe recordar]
```

---

## 🔍 Checklist de Revisión de Claude

Cuando revises el código de Kimi, verificar en este orden:

### 1️⃣ **Build y TypeScript (CRÍTICO)**
```bash
cd ecommerce
npm run build -- --no-lint
```

**Verificar:**
- [ ] ✅ Compila sin errores de TypeScript
- [ ] ⚠️ Si hay errores de ESLint config, ignorar por ahora (no crítico)
- [ ] ❌ Si falla con error de runtime, verificar .env.local (esperado si no está configurado)

**Errores comunes de Kimi:**
- `typeof typeof` (doble typeof)
- `searchParams: { }` en vez de `searchParams: Promise<{ }>`
- Imports faltantes

---

### 2️⃣ **Arquitectura de archivos**
- [ ] Archivos en carpetas correctas según `specs.md`
  - `components/ui/` → Primitivas reusables
  - `components/public/` → Componentes públicos
  - `components/admin/` → Componentes admin
  - `lib/` → Utilidades
  - `types/` → TypeScript types
- [ ] Nombres de archivos consistentes (PascalCase para componentes)
- [ ] Imports usando alias `@/` correctamente

---

### 3️⃣ **Design System (specs.md sección 3.5)**
- [ ] **Solo Tailwind** (no custom CSS, no inline styles)
- [ ] **Colores correctos:**
  - Primary: `bg-blue-600 hover:bg-blue-700`
  - Success: `bg-green-50 text-green-700 border-green-200`
  - Error: `bg-red-50 text-red-700 border-red-200`
  - Gray backgrounds: `bg-gray-50`, text: `text-gray-900`
- [ ] **Spacing correcto:**
  - Buttons: `px-6 py-2.5`
  - Cards: `p-6`
  - Grid gap: `gap-6`
  - Sections: `py-12`
- [ ] **Typography:**
  - H1: `text-4xl font-bold tracking-tight`
  - Body: `text-base text-gray-900`
  - Small: `text-sm text-gray-600`
- [ ] **Responsive:**
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - Padding: `px-4 sm:px-6 lg:px-8`
- [ ] **Iconos:** Lucide React (no otros)

---

### 4️⃣ **Internacionalización (i18n)**
- [ ] **TODAS** las strings visibles usan `t()`
  - [ ] Botones
  - [ ] Labels
  - [ ] Placeholders
  - [ ] Mensajes de error
  - [ ] Empty states
  - [ ] Títulos y encabezados
- [ ] Keys semánticamente correctas:
  - ✅ `common.storeName` para nombre del negocio
  - ❌ No `products.title` para navbar
  - ✅ `products.noProducts` para catálogo vacío
  - ❌ No `cart.empty` en catálogo
- [ ] Traducciones en 3 idiomas (en, es, pt)

**Verificar manualmente:**
```bash
# Buscar strings hardcodeadas (no debe haber)
grep -r "\"Add to Cart\"" components/
grep -r "\"Out of Stock\"" components/
```

---

### 5️⃣ **Next.js 15 (IMPORTANTE)**
- [ ] `searchParams` es `Promise<{}>` y se hace `await`
- [ ] `params` es `Promise<{}>` y se hace `await`
- [ ] Server components por defecto (no 'use client' innecesario)
- [ ] Client components cuando se necesita (hooks, eventos)

**Patrón correcto:**
```typescript
// ✅ CORRECTO
interface PageProps {
  searchParams: Promise<{ category?: string }>
  params: Promise<{ id: string }>
}

export default async function Page({ searchParams, params }: PageProps) {
  const sp = await searchParams
  const p = await params
  // usar sp.category, p.id
}
```

---

### 6️⃣ **TypeScript y Types**
- [ ] Interfaces bien definidas en `types/models.ts`
- [ ] Props de componentes tipadas
- [ ] No usar `any`
- [ ] Imports de tipos correctos

---

### 7️⃣ **Edge Cases**
- [ ] Loading states (skeleton loaders)
- [ ] Error states (error boundaries, mensajes)
- [ ] Empty states (sin datos)
- [ ] Out of stock (productos sin inventario)
- [ ] Form validation (errores inline)

---

### 8️⃣ **Consistencia con specs.md**
Verificar contra secciones específicas de `specs.md`:

| Aspecto | Sección specs.md | Qué verificar |
|---------|------------------|---------------|
| Design System | 3.5 | Colores, spacing, componentes |
| i18n | 2.5 | Uso de t(), 3 idiomas |
| Folder structure | 3 | Archivos en carpetas correctas |
| Database types | 5 | Interfaces coinciden con SQL |
| API patterns | 7 | Response format consistente |

---

## 🐛 Errores Comunes de Kimi (Detectados)

### Error 1: Doble `typeof` en TypeScript
```typescript
// ❌ Kimi escribió (Fase 2):
return localeTranslations[key as keyof typeof typeof translations.en] || key

// ✅ Corrección:
return localeTranslations[key as keyof typeof translations.en] || key
```
**Por qué:** Probablemente generación automática sin validación.
**Solución:** Pedir explícitamente que corra el build.

---

### Error 2: Next.js 15 searchParams no es Promise
```typescript
// ❌ Kimi escribió (Fase 2):
interface HomePageProps {
  searchParams: { category?: string }
}

// ✅ Corrección:
interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}
```
**Por qué:** Conocimiento desactualizado de Next.js 15.
**Solución:** En prompts, advertir sobre breaking changes de versiones.

---

### Error 3: i18n inconsistente
```tsx
// ❌ Kimi hizo (Fase 2):
// En ProductCard: ✅ Usa t('products.addToCart')
// En FilterButtons: ❌ Hardcodeó "Electronics", "Clothing"

// ✅ Debería ser:
{t('categories.electronics')}, {t('categories.clothing')}
```
**Por qué:** Implementa estructura pero no piensa en todos los casos.
**Solución:** Listar TODOS los lugares donde debe aplicar i18n.

---

### Error 4: Keys semánticamente incorrectas
```tsx
// ❌ Kimi hizo (Fase 2):
<Link href="/">{t('products.title')}</Link>  // En Navbar
<p>{t('cart.empty')}</p>  // En catálogo de productos

// ✅ Debería ser:
<Link href="/">{t('common.storeName')}</Link>
<p>{t('products.noProducts')}</p>
```
**Por qué:** No analiza el significado contextual.
**Solución:** Explicar el "por qué" de cada key.

---

## 📊 Estado del Proyecto

### ✅ Fases Completadas

#### Fase 1: Setup & Database ✅ 100%
- [x] Next.js 15.1.0 scaffolded
- [x] Folder structure (ecosystemic)
- [x] Supabase clients (server, client, admin)
- [x] SQL schema completo (products, orders, order_items)
- [x] RLS policies
- [x] Storage bucket
- [x] Función `decrement_stock()`
- [x] Trigger de notificaciones
- [x] Seed data (10 productos)
- [x] i18n system (en, es, pt)
- [x] package.json con versiones exactas

**Revisión Claude:** ✅ Aprobada
**Documento:** `correcciones_fase_1.md`

---

#### Fase 2: Product Catalog ✅ 95%
- [x] Types (Product, CartItem)
- [x] Utils (cn, formatPrice)
- [x] UI primitives (Button, Badge)
- [x] ProductCard component
- [x] Navbar component
- [x] Home page (SSR)
- [x] Filter buttons (URL search params)

**Revisión Claude:** ⚠️ Errores críticos detectados y corregidos
**Errores encontrados:**
1. ❌ Doble `typeof` en i18n → ✅ Corregido por Claude
2. ❌ searchParams no es Promise → ✅ Corregido por Claude

**Pendiente:** 3 correcciones menores de i18n (delegadas a Kimi)

---

#### Fase 3: UI Polish & States ✅ 100%
- [x] ProductSkeleton
- [x] Error boundary
- [x] Out of stock UI
- [x] Filter enhancement (URL params)
- [x] Footer

**Revisión Claude:** ✅ Componentes correctos
**Pendiente:** 3 correcciones menores de i18n (delegadas a Kimi)

---

#### Fase 4: Cart System ✅ 100%
- [x] CartItem type verified
- [x] Zustand store with persist middleware
- [x] Stock validation in cart operations
- [x] Dialog UI component (Headless UI)
- [x] CartSheet component with SSR hydration fix
- [x] Navbar integration with cart badge
- [x] ProductCard "Add to Cart" functionality
- [x] LocalStorage persistence
- [x] Edge cases handled (empty cart, stock limits, hydration)

**Revisión Claude:** ✅ Aprobada (sesión anterior)
**Documento:** `FASE_4_COMPLETADA.md`

**Fix adicional (2025-12-02):**
- [x] next.config.ts - Configurado `images.remotePatterns` para Unsplash y Supabase Storage

---

### 🔄 Correcciones Pendientes (Fase 2 y 3)

**Archivo:** `correcciones_fases_2y3.md`

1. Navbar: cambiar `t('products.title')` → `t('common.storeName')`
2. FilterButtons: traducir categorías con `CATEGORY_MAP`
3. Home page: cambiar `t('cart.empty')` → `t('products.noProducts')`

**Estado:** Prompt enviado a Kimi, esperando entrega.

---

### 📅 Próximas Fases (Roadmap)

- [x] **Fase 4:** Cart System (Zustand + LocalStorage) ✅
- [ ] **Fase 5:** Checkout Page (UI + Forms) 🔄 **EN PROGRESO - Kimi trabajando**
- [ ] **Fase 6:** Stripe Payment Integration
- [ ] **Fase 7:** Webhooks & Order Creation
- [ ] **Fase 8:** Email System (Resend)
- [ ] **Fase 9:** Automated Notifications
- [ ] **Fase 10:** Deployment & Docs
- [ ] **Fase 11:** Admin Auth
- [ ] **Fase 12:** Product Management CRUD
- [ ] **Fase 13:** Order Management

---

## 🚨 Issues Conocidos

### 1. ESLint Configuration
**Problema:** Build muestra errores de ESLint parsing (`'import' is reserved`)
**Causa:** Configuración de ESLint no detecta plugin de Next.js
**Impacto:** 🟡 NO CRÍTICO - El código compila correctamente
**Workaround:** Usar `npm run build -- --no-lint`
**Fix futuro:** Revisar `eslint.config.mjs` en fase de deployment

### 2. Runtime error sin .env.local
**Problema:** Build falla en pre-render: "supabaseUrl is required"
**Causa:** Variables de entorno no configuradas
**Impacto:** ✅ ESPERADO - Normal en desarrollo
**Solución:** Crear `.env.local` copiando `.env.example` y llenando credenciales

### 3. Next.js Image - Unconfigured hostname ✅ RESUELTO
**Problema:** Error `Invalid src prop on next/image, hostname "images.unsplash.com" is not configured`
**Causa:** `next.config.ts` no tenía configurados los dominios externos para imágenes
**Impacto:** 🔴 CRÍTICO - Bloqueaba renderizado de productos
**Solución aplicada (2025-12-02):**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: '*.supabase.co' }
  ]
}
```
**Estado:** ✅ Resuelto - Dev server levanta sin errores

---

## 💡 Aprendizajes Clave

### Para Kimi:
1. **Next.js 15:** `searchParams` y `params` son Promises → `await` obligatorio
2. **i18n completo:** No solo estructura, aplicar en TODOS lados
3. **Semántica:** Pensar en el significado de las keys
4. **Validación:** Correr `npm run build` antes de entregar

### Para Claude:
1. **Kimi es excelente con estructura visual** → Confiar en Design System
2. **Kimi necesita recordatorios de versiones** → Siempre especificar
3. **Kimi olvida edge cases** → Listarlos explícitamente
4. **Revisión debe ser sistemática** → Usar este checklist

### Para el flujo:
1. **Prompts detallados = mejor output** → Vale la pena el tiempo
2. **Código completo > snippets** → Kimi copia mejor que infiere
3. **Explicar "por qué" ayuda** → Reduce errores semánticos
4. **Checklist en prompt = mejor validación** → Kimi lo sigue

---

## 📁 Archivos de Referencia

### Documentación del proyecto:
- `specs.md` - Especificación técnica completa (single source of truth)
- `prompt_kimi.md` - Prompts para las 13 fases
- `checkout-phases.md` - Checklist de progreso

### Documentación de revisión:
- `correcciones_fase_1.md` - Lo que faltaba de fase 1 (resultó que nada)
- `correcciones_fases_2y3.md` - Correcciones de i18n pendientes
- `WORKFLOW_KIMI_CLAUDE.md` - Este documento

### En el código:
- `ecommerce/.env.example` - Template de variables de entorno
- `ecommerce/supabase-setup.sql` - Schema + seed data completo
- `ecommerce/lib/i18n/translations.ts` - Traducciones en 3 idiomas

---

## 🎯 Comandos Útiles

### Testing local:
```bash
cd ecommerce

# Build (sin lint para evitar errores de config)
npm run build -- --no-lint

# Dev server
npm run dev

# Lint (cuando ESLint esté configurado)
npm run lint
```

### Búsquedas útiles:
```bash
# Encontrar strings hardcodeadas (no deberían existir)
grep -r '"Add to Cart"' components/
grep -r "'Out of Stock'" components/

# Verificar uso de t()
grep -r "t('" components/ lib/ app/

# Encontrar 'use client' innecesarios
grep -r "'use client'" app/
```

### Git:
```bash
# Ver archivos modificados por Kimi
git status

# Ver diff específico
git diff ecommerce/components/public/ProductCard.tsx

# Comparar con versión anterior
git log --oneline -n 10
```

---

## 📞 Inicio de Próxima Sesión (Template)

Cuando retomes el proyecto en una nueva sesión con Claude:

```markdown
Hola Claude, continuamos con el proyecto e-commerce.

**Última fase completada:** Fase 2 y 3 (con correcciones pendientes)
**Documento de estado:** Lee @WORKFLOW_KIMI_CLAUDE.md

**Situación actual:**
- Kimi [completó/está trabajando en] [fase X]
- [Descripción breve de lo que hizo]

**Necesito que:**
1. Revises el código de Kimi
2. Valides contra specs.md
3. Detectes errores
4. Generes prompt de corrección si es necesario

**Archivos relevantes:**
- @specs.md
- @prompt_kimi.md
- @correcciones_fases_2y3.md (si hay correcciones previas)
```

---

## 🎓 Conclusión

Este workflow **Kimi (ejecutor rápido) + Claude (revisor profundo)** está funcionando bien:

✅ **Velocidad:** Kimi genera código rápido
✅ **Calidad:** Claude detecta errores sutiles
✅ **Aprendizaje:** Cada iteración mejora los prompts
✅ **Documentación:** Todo queda registrado

**Ratio de éxito hasta ahora:**
- Fase 1: 100% correcta en primer intento
- Fase 2-3: 95% correcta, 2 errores críticos + 3 mejoras menores
- Fase 4: 100% correcta (revisada en sesión anterior)

**Progreso general:**
- 4 de 13 fases completadas (30.8%)
- Fase 5 en progreso (Kimi trabajando)
- 1 fix adicional aplicado (next.config.ts)

**Siguiente optimización:**
- Mejorar prompts de Kimi con aprendizajes de fases 2-4
- Crear checklist específica para cada tipo de fase
- Documentar patrones de errores por tipo de tarea

---

**Última actualización:** 2025-12-02 23:40 UTC
**Versión:** 1.1
**Mantenedor:** Claude Code + Kimi K2 (supervisado por usuario)
**Estado actual:** Fase 5 en progreso, Kimi ejecutando
