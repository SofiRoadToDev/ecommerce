-- Crear nuevo usuario admin
-- ⚠️ Cambia el email y password

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
  'admin@tutienda.com',  -- ← CAMBIA ESTE EMAIL
  crypt('Admin123!', gen_salt('bf')),  -- ← CAMBIA ESTA CONTRASEÑA
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"role":"admin"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Verificar que se creó correctamente
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@tutienda.com'  -- ← mismo email que arriba
ORDER BY created_at DESC;