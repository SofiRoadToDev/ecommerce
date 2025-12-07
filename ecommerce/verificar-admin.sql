-- Script para verificar usuarios y sus roles
-- Ejecutar en Supabase Dashboard → SQL Editor

-- 1. Ver TODOS los usuarios y sus roles
SELECT 
    email,
    id,
    raw_user_meta_data->>'role' as user_role,
    raw_app_meta_data->>'role' as app_role,
    email_confirmed_at,
    created_at,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Ver solo usuarios con rol admin
SELECT 
    email,
    id,
    raw_user_meta_data->>'role' as user_role,
    raw_app_meta_data->>'role' as app_role,
    email_confirmed_at
FROM auth.users 
WHERE (raw_user_meta_data->>'role' = 'admin' OR raw_app_meta_data->>'role' = 'admin')
ORDER BY created_at DESC;

-- 3. Verificar si hay usuarios sin email confirmado
SELECT 
    email,
    email_confirmed_at,
    raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- 4. Si necesitas actualizar un usuario existente para que sea admin:
-- (Descomenta y modifica el email)
/*
UPDATE auth.users 
SET 
    raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"'),
    raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"admin"')
WHERE email = 'tu-email@ejemplo.com';
*/