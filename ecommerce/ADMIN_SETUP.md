# 🔐 Configuración del Usuario Admin

## Problema
El login del admin dice "no autorizado" porque falta crear el usuario administrador en Supabase Auth.

## Solución Rápida (5 minutos)

### Paso 1: Abre el SQL Editor de Supabase
1. Ve a tu proyecto en https://supabase.com/dashboard
2. Click en **SQL Editor** en el menú lateral izquierdo
3. Click en **New Query**

### Paso 2: Ejecuta el script
1. Abre el archivo `create-admin-user.sql`
2. **IMPORTANTE:** Cambia estos valores en el script:
   - `admin@tutienda.com` → Tu email de admin
   - `TuPassword123!` → Tu contraseña de admin
3. Copia y pega el script modificado en el SQL Editor
4. Click en **Run** (o presiona Ctrl+Enter)

### Paso 3: Verifica la creación
Deberías ver un resultado con:
- ✅ id: UUID del usuario
- ✅ email: Tu email de admin
- ✅ role: "admin"
- ✅ created_at: Fecha actual

### Paso 4: Inicia sesión
1. Ve a `/admin/login` en tu aplicación
2. Usa el email y contraseña que configuraste
3. ¡Listo! Deberías acceder al panel de administración

---

## Método Alternativo: Dashboard de Supabase

Si prefieres usar la interfaz gráfica:

### 1. Crear el usuario
- Ve a **Authentication** → **Users**
- Click en **Add User** → **Create new user**
- Email: tu-admin@tutienda.com
- Password: Tu contraseña segura
- Click **Create user**

### 2. Asignar rol de admin
- Ve a **Authentication** → **Users**
- Click en el usuario que acabas de crear
- En la pestaña **User Metadata**, click en **Edit**
- Agrega este JSON:
```json
{
  "role": "admin"
}
```
- Click **Save**

### 3. Confirmar email (opcional)
- Si el email no está confirmado automáticamente:
  - En el usuario, click en los 3 puntos (⋮)
  - Click **Confirm email**

---

## Verificación

### El login debería funcionar si:
- ✅ El usuario existe en Authentication → Users
- ✅ El usuario tiene `"role": "admin"` en User Metadata
- ✅ El email está confirmado (email_confirmed_at no es null)

### Si aún dice "no autorizado":
1. Verifica que el usuario tenga el rol exacto `"admin"` (sin mayúsculas)
2. Cierra sesión completamente y vuelve a intentar
3. Verifica las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Notas de Seguridad

- 🔒 **Usa contraseñas fuertes** (mínimo 12 caracteres, mayúsculas, minúsculas, números, símbolos)
- 🔒 **No compartas** las credenciales de admin
- 🔒 **Cambia la contraseña** regularmente desde el panel de Supabase
- 🔒 **Habilita 2FA** en tu cuenta de Supabase para mayor seguridad
