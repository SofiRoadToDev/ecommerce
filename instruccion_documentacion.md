📚 Tarea: Crear Documentación Viva del Proyecto

  Necesito que crees documentación técnica completa y actualizable del proyecto que refleje el estado actual (Fase 1) y que se actualizará en cada fase subsiguiente.

  📋 Estructura de Documentación

  Crea los siguientes archivos en la carpeta raíz del proyecto:

  1. README.md (Principal)

  Debe incluir:
  - Título y descripción breve del proyecto
  - Tech Stack con versiones exactas (Next.js 15.1.0, React 18.3.1, etc.)
  - Features implementadas (actualizar por fase)
  - Quick Start (cómo correr el proyecto localmente)
  - Scripts disponibles (dev, build, start, lint)
  - Variables de entorno requeridas (referencia a .env.example)
  - Deployment (instrucciones para Netlify)
  - Project Status (qué fases están completas)
  - License (si aplica)

  2. docs/ARCHITECTURE.md

  Debe incluir:
  - Folder Structure explicada (qué contiene cada carpeta)
  - Route Groups de Next.js: (public) vs admin
  - Component Organization: ui/, public/, admin/
  - Data Flow: Client components ↔ Server components ↔ Supabase
  - State Management: Dónde y cómo se usa Zustand
  - Authentication Strategy: Anon users + Admin auth
  - Supabase Clients: Diferencia entre server.ts, client.ts, admin.ts
  - Diagrama ASCII o Mermaid de la arquitectura (opcional pero recomendado)

  3. docs/DATABASE.md

  Debe incluir:
  - Schema completo (tablas, campos, tipos, constraints)
  - Relationships entre tablas (orders → order_items → products)
  - RLS Policies explicadas (quién puede leer/escribir qué)
  - Stored Procedures (decrement_stock) - qué hace y cuándo se usa
  - Triggers (notify_order_status_change) - cómo funciona
  - Storage Bucket (product-images) - políticas de acceso
  - Indexes y por qué están ahí

  4. docs/SETUP.md (Guía de Configuración)

  Debe incluir:
  - Prerequisites (Node version, npm/pnpm, Supabase account, Stripe account)
  - Step-by-step setup:
    a. Clonar repo
    b. Install dependencies
    c. Crear proyecto en Supabase
    d. Ejecutar SQL script
    e. Configurar env variables
    f. Configurar Stripe (webhooks)
    g. Configurar Resend
    h. Run dev server
  - Troubleshooting común

  5. docs/I18N.md (Internacionalización)

  Debe incluir:
  - Cómo funciona el sistema i18n custom
  - Cómo cambiar el idioma (variable NEXT_PUBLIC_LOCALE)
  - Idiomas soportados: en, es, pt
  - Cómo agregar traducciones nuevas
  - Ejemplo de uso del t() function
  - Estructura de keys (common., products., cart.*, etc.)

  6. docs/DESIGN_SYSTEM.md

  Debe incluir:
  - Filosofía: Moderno, minimalista, conversion-focused
  - Color Palette (bg-blue-600, text-gray-900, etc.)
  - Typography Scale (text-4xl, text-2xl, text-base, etc.)
  - Spacing System (containers, padding, gaps)
  - Component Patterns con ejemplos de código:
    - Buttons (primary, secondary, ghost)
    - Cards
    - Badges
    - Input fields (cuando se implementen)
  - Icons (Lucide React)
  - Mobile-first approach
  - NO usar CSS custom (solo Tailwind)

  ---
  ✅ Qué Documentar de la Fase 1 Actual

  En cada archivo, documenta lo que ya está implementado:

  Estado actual del proyecto:
  - ✅ Next.js 15.1.0 con App Router configurado
  - ✅ TypeScript 5.3.3 (strict mode)
  - ✅ Tailwind CSS 3.4.1 con Inter font
  - ✅ Estructura de carpetas ecosistémica con route groups
  - ✅ 3 Supabase clients (server, client, admin)
  - ✅ Database schema completo (products, orders, order_items)
  - ✅ RLS policies configuradas
  - ✅ Storage bucket para imágenes
  - ✅ Función decrement_stock (atomic stock management)
  - ✅ Trigger para email notifications
  - ✅ Sistema i18n con 3 idiomas (en, es, pt)
  - ✅ 10 productos de seed data
  - ✅ Type definitions (Product, Order, OrderItem, CartItem)
  - ✅ Utility functions (cn, formatPrice)
  - ✅ Página home básica (placeholder, se mejorará en Fase 2)

  Pendiente (mencionar en Project Status):
  - ⏳ Fase 2: Product Catalog completo con componentes UI
  - ⏳ Fase 3-10: Resto de features
  - ⏳ Fase 11-13: Admin panel

  ---
  📝 Formato y Estilo

  - Usa Markdown con formato claro
  - Incluye code blocks con syntax highlighting
  - Usa tablas donde sea apropiado (ej: env variables, schema)
  - Usa emojis solo para secciones (📚 🚀 ⚠️ ✅) para mejorar escaneo visual
  - Usa headings consistentes (##, ###, ####)
  - Incluye ejemplos prácticos de código
  - Mantén explicaciones concisas pero completas

  ---
  🔄 Actualización por Fases

  IMPORTANTE: Esta documentación debe actualizarse al final de cada fase. Cuando completes Fase 2, actualiza:
  - README.md → Features implementadas
  - ARCHITECTURE.md → Nuevos componentes y patrones
  - DESIGN_SYSTEM.md → Componentes UI implementados

  ---
  📤 Output Request

  Entrega los siguientes archivos:

  1. README.md
  2. docs/ARCHITECTURE.md
  3. docs/DATABASE.md
  4. docs/SETUP.md
  5. docs/I18N.md
  6. docs/DESIGN_SYSTEM.md

  Confirma cuando hayas terminado mostrando un resumen de lo documentado.
