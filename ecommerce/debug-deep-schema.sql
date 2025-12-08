-- Script profundo de depuración para "Database error querying schema"
-- Este script inspecciona triggers y eventos en auth.users que no son visibles fácilmente.

-- 1. Listar todos los triggers en auth.users
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    string_agg(event_manipulation, ',') as event,
    action_timing as timing,
    action_statement as statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth'
GROUP BY 1,2,3,4,6,7;

-- 2. Verificar si existen las tablas antiguas de Nextauth (que a veces quedan huerfanas)
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name IN ('users', 'accounts', 'sessions')
AND table_schema IN ('public', 'auth', 'next_auth');

-- 3. Intentar insertar un usuario dummy directamente en auth.users para ver el error exacto de SQL (Rollback inmediato)
DO $$
BEGIN
    BEGIN
        -- Esto debería fallar y darnos el mensaje exacto del trigger que explota
        INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000000', 'test_debug@example.com');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error al insertar en auth.users: %', SQLERRM;
    END;
END $$;
