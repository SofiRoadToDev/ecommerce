-- Script de Limpieza Final para Solucionar Conflicts de Schema
-- Basado en el hallazgo de que `auth.sessions` existe y causa conflictos.

-- 1. Eliminar la tabla `auth.sessions` que NO pertenece al Auth nativo de Supabase actual
-- (Supabase usa `auth.sessions` internamente pero gestionada por ellos, si esta tabla fue creada por
-- NextAuth Adapter en el esquema auth, puede estar colisionando o tener una estructura incorrecta).
-- En migraciones recientes de Supabase, `auth.sessions` es nativa.
-- PERO, el error "Database error querying schema" sugiere que hay un trigger en `auth.users` que intenta escribir
-- en una tabla que tiene un esquema diferente al esperado.

-- Inspección profunda de Triggers para ser quirúrgicos antes de borrar nada a ciegas.
SELECT trigger_name, event_manipulation, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- SI NO PUEDES DISPARAR ESO, ESTE ES EL WORKAROUND SEGURO:
-- Borrar triggers que sepamos que son "custom" o de adapters viejos.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Intentar recrear el trigger de admins limpio (si se borró en el paso anterior)
CREATE OR REPLACE FUNCTION public.handle_new_admin() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin();
