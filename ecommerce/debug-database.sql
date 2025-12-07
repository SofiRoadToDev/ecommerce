-- Script de diagnóstico para verificar la base de datos de Supabase
-- Ejecutar esto en el SQL Editor de Supabase Dashboard

-- 1. Verificar tablas existentes
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Verificar estructura de las tablas principales
\dt

-- 3. Verificar políticas de RLS activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
ORDER BY tablename, policyname;

-- 4. Verificar si hay usuarios con rol admin
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as user_role,
    raw_app_meta_data->>'role' as app_role,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE (raw_user_meta_data->>'role' = 'admin' OR raw_app_meta_data->>'role' = 'admin')
ORDER BY created_at DESC;

-- 5. Verificar triggers
SELECT 
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 6. Verificar funciones
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 7. Verificar índices
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 8. Verificar storage buckets
SELECT * FROM storage.buckets;

-- 9. Verificar políticas de storage
SELECT * FROM pg_policies 
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- 10. Verificar datos de ejemplo
-- Products
SELECT COUNT(*) as total_products FROM products;

-- Orders  
SELECT COUNT(*) as total_orders FROM orders;

-- Order items
SELECT COUNT(*) as total_order_items FROM order_items;

-- Pending orders
SELECT COUNT(*) as total_pending_orders FROM pending_orders;

-- 11. Verificar últimos errores (si hay)
SELECT 
    error_severity,
    message,
    detail,
    hint,
    query,
    error_time
FROM pg_stat_activity 
WHERE state = 'idle in transaction (aborted)'
ORDER BY query_start DESC;