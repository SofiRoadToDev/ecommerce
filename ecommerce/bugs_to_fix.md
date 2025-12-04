# Bugs To Fix

## 1. Supabase Types Not Recognizing `pending_orders` Table

**Manifestación:**
TypeScript error al intentar insertar datos en la tabla `pending_orders`:
```
Type error: No overload matches this call.
Argument of type 'Omit<PendingOrder, "id" | "created_at">' is not assignable to parameter of type 'never'.
```

**Archivos involucrados:**
- `app/api/create-paypal-order/route.ts` (línea 110-113)
- `app/api/webhooks/paypal/route.ts` (posiblemente afectado también)
- `types/database.ts` (definición del tipo Database)
- `types/models.ts` (interfaz PendingOrder)

**Causa probable:**
Después de actualizar `@supabase/supabase-js` de 2.39.3 a 2.86.0 y `@supabase/ssr` de 0.1.0 a 0.8.0, la inferencia de tipos cambió. Supabase no reconoce la tabla `pending_orders` definida en `Database['public']['Tables']` y la trata como tipo `never`.

**Workaround temporal:**
Se agregó `@ts-ignore` en las líneas donde se inserta en `pending_orders`.

**Solución permanente pendiente:**
1. Verificar estructura correcta del tipo `Database` según documentación de Supabase v2.86+
2. Posiblemente necesite usar `supabase gen types typescript` para regenerar tipos desde la BD
3. Revisar si la estructura del tipo Database necesita ajustes para la nueva versión

**Prioridad:** Media - El código funciona pero sin type-safety en operaciones con `pending_orders`

---

## Notas
- El problema surgió durante implementación de PHASE 11 (Admin Authentication)
- Todas las demás tablas (products, orders, order_items) funcionan correctamente
- Solo `pending_orders` tiene el problema de tipado
