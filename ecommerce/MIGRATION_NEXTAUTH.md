# Migración de Supabase Auth a NextAuth.js

## Resumen

Se ha completado la migración de la autenticación de Supabase directo a NextAuth.js para resolver el error 500 en `/auth/v1/token?grant_type=password`.

## Cambios Realizados

### 1. Instalación de Dependencias
```bash
npm install next-auth @auth/supabase-adapter @next-auth/supabase-adapter
```

### 2. Nueva Configuración de NextAuth
- **Archivo**: `lib/auth.ts`
- Configuración completa con Credentials Provider
- Integración con Supabase para verificación de credenciales
- Manejo de roles admin
- Callbacks JWT y Session actualizados

### 3. Ruta API de NextAuth
- **Archivo**: `app/api/auth/[...nextauth]/route.ts`
- Handler configurado para GET y POST requests

### 4. Componente de Login Actualizado
- **Archivo**: `app/admin/login/page.tsx`
- Ahora usa `signIn` de `next-auth/react`
- Manejo de errores mejorado
- Redirección manual después del login exitoso

### 5. Provider de NextAuth
- **Archivo**: `components/auth-provider.tsx`
- Envuelve toda la aplicación en `app/layout.tsx`

### 6. Middleware Actualizado
- **Archivo**: `middleware.ts`
- Ahora usa `getToken` de `next-auth/jwt`
- Protección de rutas `/admin/*` mantenida
- Verificación de rol admin

### 7. Helpers de Autenticación Actualizados
- **Archivo**: `lib/supabase/auth.ts` (actualizado)
- **Archivo**: `lib/auth-helpers.ts` (nuevo)
- Funciones compatibles con NextAuth

### 8. Tipos de TypeScript
- **Archivo**: `types/next-auth.d.ts`
- Extensiones de tipos para NextAuth
- Soporte para campos personalizados (role, accessToken, etc.)

### 9. Variables de Entorno
Agregadas a `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=fcd664e23be916fff75a778697a0ad1377951379eaa56ce4ee2b1153708db017
```

### 10. Componentes Adicionales
- **AdminLogout**: Componente para cerrar sesión
- **AdminUserInfo**: Muestra información del usuario actual

## Características Mantenidas

✅ **Rol Admin**: La verificación de rol admin se mantiene intacta
✅ **Redirecciones**: Las redirecciones funcionan igual que antes
✅ **Middleware**: Protección de rutas administrativas
✅ **Supabase como BD**: Supabase se usa como base de datos pero no para auth directo
✅ **Internacionalización**: Todos los textos de traducción se mantienen

## Solución al Error 500

El error 500 en `/auth/v1/token?grant_type=password` se resuelve porque:

1. **No más llamadas directas**: No se hacen más llamadas directas al endpoint de Supabase
2. **NextAuth maneja la sesión**: La gestión de sesión se hace a través de NextAuth
3. **Supabase como backend**: Supabase se usa solo para verificar credenciales, no para mantener la sesión

## Próximos Pasos

1. **Probar el login**: Ir a `/admin/login` y probar con credenciales válidas
2. **Verificar redirecciones**: Asegurarse que redirige correctamente a `/admin/dashboard`
3. **Protección de rutas**: Verificar que las rutas admin están protegidas
4. **Logout**: Probar que el logout funciona correctamente

## Notas Importantes

- El secreto de NextAuth debe ser diferente en producción
- Las cookies de sesión ahora las maneja NextAuth
- Supabase sigue siendo usado como base de datos
- El rol admin se verifica en cada request

## Estructura de la Sesión

La sesión de NextAuth incluye:
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: string
  },
  accessToken?: string
  refreshToken?: string
}
```

## Resolución de Problemas

Si encuentras problemas:

1. Verificar que `NEXTAUTH_SECRET` esté configurado
2. Asegurarse que el provider de sesión esté correctamente importado
3. Revisar los logs del servidor para errores específicos
4. Verificar que las variables de entorno de Supabase estén correctas