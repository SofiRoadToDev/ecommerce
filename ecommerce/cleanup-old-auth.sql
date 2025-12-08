-- Este script elimina triggers y funciones obsoletas que solían usar NextAuth
-- y que pueden estar causando el error "Database error querying schema" al intentar
-- escribir en tablas que ya no existen o tienen un esquema diferente.

-- 1. Eliminar trigger de creación de usuario en auth.users si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Eliminar la función asociada (comúnmente usada por NextAuth adapter)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Eliminar tablas de NextAuth (si existen y ya no se usan)
-- PRECAUCIÓN: Solo ejecutar si se está seguro de que ya no se necesita la data antigua
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.verification_tokens CASCADE;
DROP TABLE IF EXISTS next_auth.users CASCADE;
DROP TABLE IF EXISTS next_auth.sessions CASCADE;
DROP TABLE IF EXISTS next_auth.accounts CASCADE;
DROP TABLE IF EXISTS next_auth.verification_tokens CASCADE;

-- 4. Reconstruir/Verificar tabla de admins para el nuevo sistema
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. (Opcional) Trigger limpio para asegurar que admins existan en tabla publica
CREATE OR REPLACE FUNCTION public.handle_new_admin() 
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si el usuario tiene rol admin (definido en metadata)
  IF (new.raw_user_meta_data->>'role') = 'admin' OR (new.raw_app_meta_data->>'role') = 'admin' THEN
    INSERT INTO public.admins (id, email)
    VALUES (new.id, new.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin();
