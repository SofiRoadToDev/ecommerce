-- =============================================
-- CREATE ADMIN USER FOR E-COMMERCE
-- =============================================
-- Este script crea un usuario administrador en Supabase Auth
-- con el rol 'admin' necesario para acceder al panel de administración

-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → SQL Editor
-- 2. Copia y pega este script
-- 3. CAMBIA el email y password por los que desees
-- 4. Ejecuta el script
-- 5. Ve a /admin/login y usa esas credenciales

-- IMPORTANTE: Cambia estos valores antes de ejecutar:
-- Email: admin@tutienda.com
-- Password: TuPassword123!

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
  'sofia.rrii@gmail.com', -- ← CAMBIA ESTE EMAIL
  crypt('sofi', gen_salt('bf')), -- ← CAMBIA ESTA CONTRASEÑA
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"role":"admin"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Verificar que el usuario fue creado correctamente
SELECT
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'admin@tutienda.com'; -- ← USA EL MISMO EMAIL QUE ARRIBA
