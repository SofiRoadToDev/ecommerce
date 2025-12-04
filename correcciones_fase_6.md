● Revisión completada. Encontré y corregí 4 problemas:

  Errores corregidos:

  1. lib/supabase/server.ts (línea 7): Kimi lo cambió a usar SERVICE_ROLE_KEY que bypasea RLS. Revertido a ANON_KEY.
  2. app/api/create-payment-intent/route.ts (línea 4, 32): Importaba createServerClient cuando debería usar createAdminClient para operaciones con SERVICE_ROLE_KEY.        
  3. lib/stripe/server.ts (línea 9): API version '2024-11-20.acacia' no reconocida por TypeScript. Cambiado a '2023-10-16'.
  4. checkout/page.tsx (línea 35): Código muerto que guardaba shipping data en sessionStorage sin usarla. Eliminado.

  Lo que está bien:

  ✅ PaymentForm.tsx - Implementación correcta de Stripe Elements
  ✅ create-payment-intent API - Fetch de precios del servidor, validación de stock
  ✅ Traducciones - 11 nuevas keys en 3 idiomas
  ✅ Flujo two-step: shipping info → payment
  ✅ TypeScript compila sin errores