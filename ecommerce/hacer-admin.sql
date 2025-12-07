-- Hacer admin a un usuario existente
-- ⚠️ Cambia 'tu-email@ejemplo.com' por tu email real

UPDATE auth.users 
SET 
    raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'), 
        '{role}', 
        '"admin"'
    ),
    raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'), 
        '{role}', 
        '"admin"'
    )
WHERE email = 'tu-email@ejemplo.com'
RETURNING email, 
          raw_user_meta_data->>'role' as new_user_role,
          raw_app_meta_data->>'role' as new_app_role;

-- Verificar el cambio
SELECT 
    email,
    raw_user_meta_data->>'role' as user_role,
    raw_app_meta_data->>'role' as app_role
FROM auth.users 
WHERE email = 'tu-email@ejemplo.com';