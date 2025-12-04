   ✅ Estrategia recomendada:

  Opción A: Flujo simple (prueba esto primero)

  MENSAJE 1 a Kimi:
  "Vas a construir un e-commerce production-ready en Next.js 15.1.0.
  Lee ATENTAMENTE estas especificaciones técnicas completas:"

  [PEGAR TODO SPECS.MD]

  ---

  MENSAJE 2:
  "Ahora lee el plan de desarrollo dividido en 13 fases.
  Iremos fase por fase esperando mi confirmación antes de continuar:"

  [PEGAR TODO PROMPT_KIMI.MD]

  ---

  MENSAJE 3:
  "Perfecto. Antes de iniciar, confirma que entendiste:

  1. ✅ Versiones exactas (Next.js 15.1.0, React 18.3.1, etc)
  2. ✅ Arquitectura (app/(public), app/admin, components/ui, lib/i18n)
  3. ✅ Design System (SOLO Tailwind, mobile-first, colores bg-blue-600, spacing px-6 py-2.5)
  4. ✅ i18n (usar t() para TODOS los textos, NEXT_PUBLIC_LOCALE)

  Si todo está claro, INICIA CON PHASE 1"

  ---
  Opción B: Si Kimi pierde contexto (usa recordatorios)

  Cada 3-4 fases, envía esto:

  "Antes de continuar, RECORDATORIO CRÍTICO:

  🎨 DESIGN SYSTEM:
  - SOLO Tailwind CSS (cero CSS custom)
  - Colores: bg-blue-600, text-gray-900, border-gray-200
  - Spacing: px-6 py-2.5, gap-6, space-y-4
  - Buttons: rounded-lg, transition-colors
  - Mobile-first siempre

  🌍 i18n:
  - Usar t('key') para TODOS los textos
  - Nunca hardcodear strings

  📁 Arquitectura:
  - components/ui/ (primitives)
  - components/public/ (public components)
  - components/admin/ (admin components)
  - lib/i18n/ (translations)

  Ahora continúa con PHASE X"
 
 CHECKLIST después de cada fase:
  ✅ ¿Usó solo Tailwind?
  ✅ ¿Usó t() para textos?
  ✅ ¿Siguió folder structure?
  ✅ ¿Colores correctos? (bg-blue-600, no bg-blue-500)
  ✅ ¿Mobile-first?