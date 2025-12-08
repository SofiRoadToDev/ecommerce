# Plan de Refactorización: Autenticación Supabase Puro

Este documento rastrea el progreso de la migración de NextAuth + Supabase a una implementación pura de Supabase Auth con SSRHelpers.

## Tareas de Refactorización

- [x] **1. Actualizar Clientes de Supabase (`lib/supabase`)**
  - [x] Actualizar `client.ts` para usar `createBrowserClient` (Manejo de cookies en cliente).
  - [x] Actualizar `server.ts` para usar `createServerClient` (Manejo de cookies en servidor).

- [x] **2. Reescribir Middleware (`middleware.ts`)**
  - [x] Implementar gestión de cookies y refresco de sesión con `createServerClient`.
  - [x] Proteger rutas `/admin` y redirigir login.

- [x] **3. Refactorizar Helpers de Auth (`lib/supabase/auth.ts`)**
  - [x] Eliminar código duplicado.
  - [x] Reutilizar `createClient` de `server.ts` para `getUser` y `getSession`.

- [x] **4. Limpieza de NextAuth**
  - [x] Eliminar `lib/auth.ts` y carpeta `app/api/auth`.
  - [x] Desinstalar paquetes `next-auth` y adaptadores.

- [x] **5. Verificar y Corregir Aplicación**
  - [x] Corregir importaciones en `app/(public)/page.tsx`.
  - [x] Solucionar errores de tipado en `Product[]`.
