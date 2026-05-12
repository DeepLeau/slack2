-- ============================================================
-- Migration 0003: Trigger de provisioning auto des profiles
-- Exécute INSERT INTO profiles lors de auth.signUp()
-- ============================================================

-- Fonction trigger SECURITY DEFINER avec search_path explicite
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Révocation de l'exécution publique (appel uniquement via trigger système)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- Trigger qui appelle la fonction après chaque nouveau user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Crée automatiquement une row profiles lors de auth.signUp()';
