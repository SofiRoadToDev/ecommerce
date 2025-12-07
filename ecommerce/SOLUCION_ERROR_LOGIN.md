# 🐛 Solución: Database error querying schema en Login

## 📋 Descripción del Problema

El error "Database error querying schema" al intentar hacer login con Supabase Auth generalmente indica uno de estos problemas:

1. **Problemas de conexión con Supabase**
2. **Tipos de TypeScript incorrectos**
3. **Configuración incorrecta de RLS (Row Level Security)**
4. **Usuario admin no configurado correctamente**
5. **Problemas con el metadata del usuario**

## 🔧 Soluciones Paso a Paso

### 1. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga las credenciales correctas:

```bash
# Verifica en Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-real
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-real
```

**Para verificar:**
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia los valores exactos

### 2. Verificar Tipos de TypeScript

El error puede estar en `types/database.ts`. Asegúrate de que esté correcto:

```typescript
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      pending_orders: {
        Row: PendingOrder
        Insert: Omit<PendingOrder, 'id' | 'created_at'>
        Update: Partial<Omit<PendingOrder, 'id'>>  // ← IMPORTANTE: No excluir created_at
      }
    }
  }
}
```

### 3. Crear Usuario Admin Correctamente

**Opción A: Usando el script SQL**

1. Ve a Supabase Dashboard → SQL Editor
2. Copia y ejecuta este script (cambia email y password):

```sql
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'tu-email@ejemplo.com',  -- ← CAMBIA ESTE EMAIL
  crypt('tu-password', gen_salt('bf')),  -- ← CAMBIA ESTA CONTRASEÑA
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"role":"admin"}',
  NOW(),
  NOW(),
  '',
  ''
);
```

**Opción B: Usando Supabase Auth UI**

1. Ve a Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create New User"
3. Ingresa email y password
4. En "User Metadata" agrega: `{"role": "admin"}`
5. En "App Metadata" agrega: `{"role": "admin"}`

### 4. Verificar RLS (Row Level Security)

Asegúrate de que las políticas estén correctamente configuradas. Ejecuta en SQL Editor:

```sql
-- Verificar políticas para auth.users
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Si no hay políticas, créalas:
CREATE POLICY "Allow admin to manage users" ON auth.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 5. Verificar la Conexión

**Test de conexión básica:**

```bash
# Instala las dependencias si no las tienes
npm install @supabase/supabase-js

# Crea un archivo test-connection.js
node debug-supabase.js
```

### 6. Verificar el Código de Login

En `app/admin/login/page.tsx`, asegúrate de que el código esté correcto:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Verificar rol admin
    const role = data.user?.user_metadata?.role || data.user?.app_metadata?.role

    if (role !== 'admin') {
      await supabase.auth.signOut()
      setError('No tienes permisos de administrador')
      setLoading(false)
      return
    }

    // Redirigir al dashboard
    router.push('/admin/dashboard')
    router.refresh()
  } catch (err) {
    setError('Error al iniciar sesión')
    setLoading(false)
  }
}
```

### 7. Problemas Comunes y Soluciones

#### **Error: "Failed to fetch"**
- Verifica que tu proyecto Supabase esté activo
- Asegúrate de que la URL de Supabase sea correcta
- Verifica tu conexión a internet

#### **Error: "Invalid login credentials"**
- Verifica que el usuario exista en Supabase Dashboard
- Asegúrate de que el email esté confirmado
- Verifica que el metadata tenga `role: "admin"`

#### **Error: "No tienes permisos de administrador"**
- El usuario existe pero no tiene rol admin
- Actualiza el metadata del usuario en Supabase Dashboard

#### **Error: "Database error querying schema"**
- Problema con los tipos de TypeScript
- Revisa `types/database.ts`
- Verifica que el esquema de la BD coincida con los tipos

## 🧪 Tests de Diagnóstico

### Test 1: Verificar usuario admin
```sql
-- En Supabase SQL Editor
SELECT 
  email, 
  raw_user_meta_data->>'role' as user_role,
  raw_app_meta_data->>'role' as app_role
FROM auth.users 
WHERE email = 'tu-email@ejemplo.com';
```

### Test 2: Verificar políticas RLS
```sql
SELECT * FROM pg_policies WHERE tablename IN ('users', 'products', 'orders');
```

### Test 3: Verificar conexión
```bash
node debug-supabase.js
```

## 🚀 Verificación Final

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Limpia la caché del navegador**

3. **Prueba el login:**
   - Ve a `http://localhost:3000/admin/login`
   - Usa las credenciales del usuario admin que creaste
   - Verifica la consola del navegador para errores

4. **Si el error persiste, revisa:**
   - Console del navegador (F12 → Console)
   - Network tab para ver las llamadas a Supabase
   - Logs del servidor de Next.js
   - Dashboard de Supabase para ver logs de autenticación

## 📞 Soporte Adicional

Si después de seguir estos pasos el error persiste, proporciona:

1. Mensaje de error exacto de la consola
2. Screenshots del error
3. Logs de Supabase (Authentication → Logs)
4. Tu archivo `.env.local` (con valores ofuscados)
5. Resultados del script `debug-supabase.js`