-- Script para arreglar el usuario administrador corrupto
-- El error "Database error querying schema" solo ocurre con este usuario, lo que sugiere corrupción de datos.

-- 1. Borrar el usuario problemático (si existe)
DELETE FROM auth.users WHERE email = 'sofi@admin.com';

-- 2. Asegurarse que no quede rastro en public.admins
DELETE FROM public.admins WHERE email = 'sofi@admin.com';

-- 3. Insertar el usuario nuevamente con datos limpios
-- Pass: 'sofi' (Hasheado con el algoritmo por defecto de Supabase/GoTrue)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'sofi@admin.com',
    crypt('sofi', gen_salt('bf')), -- Genera hash bcrypt válido
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "admin"}', -- App metadata correcto
    '{"role": "admin"}', -- User metadata correcto
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- El trigger 'on_auth_user_created_admin' que vimos antes (si está activo)
-- debería encargarse de insertar en public.admins automáticamente.
-- Pero por si acaso, lo hacemos manual para asegurar.

INSERT INTO public.admins (id, email)
SELECT id, email FROM auth.users WHERE email = 'sofi@admin.com'
ON CONFLICT (id) DO NOTHING;
